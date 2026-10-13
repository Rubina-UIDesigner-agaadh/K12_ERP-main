import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Calendar, Download, Pencil, Plus, Save } from 'lucide-react';

const YEARS = ['2025-26', '2026-27', '2027-28'];
const STORE = 'k12-application-schedule-v1';
const TODAY = '2026-10-12';

interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  notes: string;
  portalMessage: string;
  forceActive: boolean;
  autoNotify: boolean;
  notifyMessage: string;
}

type ScheduleStatus = 'Draft' | 'Active' | 'Completed';

interface YearSchedule {
  status: ScheduleStatus;
  phases: Phase[];
}

const PHASE_DEFS: { name: string; description: string }[] = [
  { name: 'Result Entry Window', description: 'Admin enters or imports 10th results' },
  { name: 'Application Open', description: 'Students can start submitting stream preferences' },
  { name: 'Application Close', description: 'Last moment for submissions — form locks after this' },
  { name: 'Eligibility Processing', description: 'System runs eligibility rules against all submissions' },
  { name: 'Round 1 Allotment', description: 'Auto-allotment engine runs for the first time' },
  { name: 'Round 1 Acceptance', description: 'Students can accept or reject their Round 1 result' },
  { name: 'Round 2 Allotment', description: 'Freed and waitlisted seats are redistributed' },
  { name: 'Round 2 Acceptance', description: 'Students accept or reject Round 2 result' },
  { name: 'Counselling', description: 'Admin manually handles remaining unallotted students' },
  { name: 'Final Allotment Publish', description: 'Results are locked as final — no more changes' },
  { name: 'Document Submission', description: 'Students upload enrollment documents' },
  { name: 'Admission Close', description: 'Module closes completely for this year' }
];

const blankPhases = (): Phase[] => PHASE_DEFS.map((p, i) => ({
  id: `P${i + 1}`,
  name: p.name,
  description: p.description,
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '17:00',
  notes: '',
  portalMessage: '',
  forceActive: false,
  autoNotify: false,
  notifyMessage: ''
}));

const seed2026 = (): Phase[] => {
  const rows = blankPhases();
  const dates: [string, string][] = [
    ['2026-05-01', '2026-05-20'],
    ['2026-06-01', '2026-06-14'],
    ['2026-06-15', '2026-06-15'],
    ['2026-06-16', '2026-06-18'],
    ['2026-06-19', '2026-06-19'],
    ['2026-06-20', '2026-06-25'],
    ['2026-06-26', '2026-06-26'],
    ['2026-06-27', '2026-06-30'],
    ['2026-07-01', '2026-07-10'],
    ['2026-07-11', '2026-07-11'],
    ['2026-07-12', '2026-10-20'],
    ['2026-10-31', '2026-10-31']
  ];
  return rows.map((p, i) => ({ ...p, startDate: dates[i][0], endDate: dates[i][1] }));
};

const seed2025 = (): Phase[] => seed2026().map((p) => ({
  ...p,
  startDate: p.startDate.replace('2026', '2025'),
  endDate: p.endDate.replace('2026', '2025')
}));

const DEFAULTS: Record<string, YearSchedule> = {
  '2025-26': { status: 'Completed', phases: seed2025() },
  '2026-27': { status: 'Active', phases: seed2026() },
  '2027-28': { status: 'Draft', phases: blankPhases() }
};

const loadAll = (): Record<string, YearSchedule> => {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* seed */ }
  return DEFAULTS;
};

const saveAll = (all: Record<string, YearSchedule>) => window.localStorage.setItem(STORE, JSON.stringify(all));

const toMs = (date: string, time: string) => {
  if (!date) return NaN;
  return new Date(`${date}T${time || '00:00'}:00`).getTime();
};

const daysBetween = (a: string, b: string) => {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1);
};

const phaseStatus = (p: Phase, today = TODAY): 'Upcoming' | 'Active' | 'Completed' | 'Overdue' => {
  if (p.forceActive) return 'Active';
  const start = toMs(p.startDate, p.startTime);
  const end = toMs(p.endDate, p.endTime);
  const now = new Date(`${today}T12:00:00`).getTime();
  if (!p.startDate || !p.endDate) return 'Upcoming';
  if (now > end) return 'Completed';
  if (now >= start && now <= end) return 'Active';
  if (now > start && now > end) return 'Completed';
  if (p.endDate && new Date(p.endDate) < new Date(today) && now > end) return 'Overdue';
  return 'Upcoming';
};

const addDaysIso = (iso: string, days: number) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const STATUS_BADGE: Record<string, 'success' | 'info' | 'secondary' | 'danger' | 'warning'> = {
  Upcoming: 'secondary',
  Active: 'info',
  Completed: 'success',
  Overdue: 'danger',
  Draft: 'warning'
};

export function ApplicationScheduleManager() {
  const [all, setAll] = useState(loadAll);
  const [year, setYear] = useState('2026-27');
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [editing, setEditing] = useState<Phase | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const schedule = all[year] || { status: 'Draft' as ScheduleStatus, phases: blankPhases() };
  const phases = schedule.phases;

  const persist = (next: Record<string, YearSchedule>) => {
    setAll(next);
    saveAll(next);
  };

  const setPhases = (nextPhases: Phase[], status?: ScheduleStatus) => {
    persist({ ...all, [year]: { status: status || schedule.status, phases: nextPhases } });
  };

  const derivedStatus = useMemo(() => {
    const statuses = phases.map((p) => phaseStatus(p));
    if (statuses.every((s) => s === 'Completed')) return 'Completed';
    if (statuses.some((s) => s === 'Active')) return 'Active';
    if (phases.every((p) => !p.startDate)) return 'Draft';
    return schedule.status;
  }, [phases, schedule.status]);

  const validate = (list: Phase[]) => {
    const e: string[] = [];
    list.forEach((p) => {
      if (!p.startDate) e.push(`Save blocked: ${p.name} has no start date. All phases require a date.`);
      if (p.startDate && p.endDate && toMs(p.endDate, p.endTime) < toMs(p.startDate, p.startTime)) {
        e.push(`${p.name} cannot end before it starts.`);
      }
    });
    const named = (n: string) => list.find((p) => p.name === n);
    const open = named('Application Open');
    const close = named('Application Close');
    if (open && close && open.startDate && close.endDate && close.endDate < open.startDate) {
      e.push('Application Close cannot be before Application Open.');
    }
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (!a.endDate || !b.startDate) continue;
      if (b.startDate < a.endDate && !(a.name.includes('Open') && b.name.includes('Close'))) {
        if (toMs(b.startDate, b.startTime) < toMs(a.endDate, a.endTime) && a.name !== 'Application Open') {
          e.push(`${b.name} overlaps with ${a.name}. Adjust dates.`);
        }
      }
      const gap = daysBetween(a.endDate, b.startDate) - 1;
      if (a.name.includes('Allotment') && b.name.includes('Acceptance') && gap <= 1 && gap >= 0) {
        e.push(`Warning: Only ${Math.max(1, gap)} day between Allotment and Acceptance. Students may not have enough time.`);
      }
    }
    return e;
  };

  const saveFull = () => {
    const e = validate(phases);
    const blocking = e.filter((x) => !x.startsWith('Warning'));
    setErrors(e);
    if (blocking.length) return;
    persist({ ...all, [year]: { ...schedule, status: derivedStatus as ScheduleStatus } });
    setNotice('Full schedule saved.');
  };

  const copyLastYear = () => {
    const idx = YEARS.indexOf(year);
    const prev = idx > 0 ? YEARS[idx - 1] : null;
    if (!prev || !all[prev]) { setNotice('No previous year to copy.'); return; }
    const copied = all[prev].phases.map((p) => ({
      ...p,
      forceActive: false,
      startDate: addDaysIso(p.startDate, 365),
      endDate: addDaysIso(p.endDate, 365)
    }));
    setPhases(copied, 'Draft');
    setNotice(`Copied ${prev} dates + 365 days into ${year}. Fine-tune then save.`);
  };

  const createNew = () => {
    setPhases(blankPhases(), 'Draft');
    setNotice('Blank schedule created. Set dates for every phase.');
  };

  const range = useMemo(() => {
    const dates = phases.flatMap((p) => [p.startDate, p.endDate]).filter(Boolean).sort();
    if (!dates.length) return { start: new Date('2026-05-01'), end: new Date('2026-12-31') };
    return { start: new Date(`${dates[0]}T00:00:00`), end: new Date(`${dates[dates.length - 1]}T00:00:00`) };
  }, [phases]);

  const span = Math.max(1, range.end.getTime() - range.start.getTime());
  const todayMs = new Date(`${TODAY}T00:00:00`).getTime();
  const todayPct = Math.min(100, Math.max(0, ((todayMs - range.start.getTime()) / span) * 100));

  const barColor = (st: string) => st === 'Completed' ? 'bg-emerald-500' : st === 'Active' ? 'bg-blue-500' : st === 'Overdue' ? 'bg-red-500' : 'bg-gray-300';

  const activePhase = phases.find((p) => phaseStatus(p) === 'Active');

  return (
    <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-full">
      <div>
        <p className="text-xs text-gray-500">Home → Schedule</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <h1 className="text-xl font-bold">Application Schedule</h1>
          <Badge variant="info">{year}</Badge>
          <Badge variant={STATUS_BADGE[derivedStatus] || 'secondary'}>{derivedStatus}</Badge>
        </div>
        <p className="text-sm text-gray-500">Set the dates and windows for every phase of stream selection</p>
      </div>

      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}
      {errors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-1">{errors.map((e) => <p key={e}>{e}</p>)}</div>}

      <div className="bg-white border rounded-xl p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-gray-600">Academic Year</label>
          <select className="block mt-1 px-3 py-2 border rounded-lg text-sm" value={year} onChange={(e) => { setYear(e.target.value); setErrors([]); }}>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <Button variant="outline" onClick={copyLastYear}>Copy from Last Year</Button>
        <Button variant="outline" onClick={createNew}><Plus className="w-4 h-4 mr-1" /> Create New Schedule</Button>
        <span className="text-sm text-gray-500">Schedule status: <b>{derivedStatus}</b></span>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Phase Schedule</div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Phase', 'Description', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Duration', 'Status', 'Force Active', 'Notes', ''].map((h) => <th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody>
            {phases.map((p, idx) => {
              const st = phaseStatus(p);
              return (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{idx + 1}. {p.name}</td>
                  <td className="px-3 py-2 text-gray-600 min-w-[200px]">{p.description}</td>
                  <td className="px-3 py-2"><input type="date" className="border rounded px-2 py-1" value={p.startDate} onChange={(e) => setPhases(phases.map((x) => x.id === p.id ? { ...x, startDate: e.target.value } : x))} /></td>
                  <td className="px-3 py-2"><input type="time" className="border rounded px-2 py-1" value={p.startTime} onChange={(e) => setPhases(phases.map((x) => x.id === p.id ? { ...x, startTime: e.target.value } : x))} /></td>
                  <td className="px-3 py-2"><input type="date" className="border rounded px-2 py-1" value={p.endDate} onChange={(e) => setPhases(phases.map((x) => x.id === p.id ? { ...x, endDate: e.target.value } : x))} /></td>
                  <td className="px-3 py-2"><input type="time" className="border rounded px-2 py-1" value={p.endTime} onChange={(e) => setPhases(phases.map((x) => x.id === p.id ? { ...x, endTime: e.target.value } : x))} /></td>
                  <td className="px-3 py-2 whitespace-nowrap">{p.startDate && p.endDate ? `${daysBetween(p.startDate, p.endDate)} days` : '—'}</td>
                  <td className="px-3 py-2"><Badge variant={STATUS_BADGE[st]}>{st}</Badge></td>
                  <td className="px-3 py-2"><Toggle checked={p.forceActive} onChange={(v) => setPhases(phases.map((x) => x.id === p.id ? { ...x, forceActive: v } : x))} /></td>
                  <td className="px-3 py-2"><input className="border rounded px-2 py-1 w-36" value={p.notes} onChange={(e) => setPhases(phases.map((x) => x.id === p.id ? { ...x, notes: e.target.value } : x))} /></td>
                  <td className="px-3 py-2"><button type="button" className="p-1.5 hover:bg-gray-100 rounded" onClick={() => setEditing({ ...p })}><Pencil className="w-4 h-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold text-sm mb-3">Visual Timeline</h2>
        <div className="flex gap-4 text-xs mb-3">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Completed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Active</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300" /> Upcoming</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Overdue</span>
        </div>
        <div className="relative space-y-2">
          <div className="absolute top-0 bottom-0 w-px bg-red-500 z-10" style={{ left: `${todayPct}%` }} title={`Today ${TODAY}`} />
          {phases.map((p) => {
            const st = phaseStatus(p);
            const start = p.startDate ? new Date(`${p.startDate}T00:00:00`).getTime() : range.start.getTime();
            const end = p.endDate ? new Date(`${p.endDate}T00:00:00`).getTime() : start;
            const left = ((start - range.start.getTime()) / span) * 100;
            const width = Math.max(1.5, ((end - start) / span) * 100);
            return (
              <button
                type="button"
                key={p.id}
                className="relative h-8 w-full bg-gray-50 rounded"
                onClick={() => setEditing({ ...p })}
                title={`${p.name}: ${p.startDate || '—'} → ${p.endDate || '—'} (${daysBetween(p.startDate, p.endDate)} days)`}
              >
                <span className="absolute left-2 top-1.5 text-[11px] text-gray-600 z-20">{p.name}</span>
                <span className={`absolute top-1 h-6 rounded ${barColor(st)}`} style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(100 - Math.max(0, left), width)}%` }} />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">Red line = today ({TODAY}). Click a bar to edit that phase.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={saveFull}><Save className="w-4 h-4 mr-1" /> Save Full Schedule</Button>
        <Button variant="outline" onClick={() => {
          const p = activePhase || phases[0];
          setPhases(phases.map((x) => x.id === p.id ? { ...x, forceActive: true } : { ...x, forceActive: false }));
          setNotice(`${p.name} force-activated.`);
        }}>Activate Phase Manually</Button>
        <Button variant="outline" onClick={() => {
          if (!activePhase) { setNotice('No active phase to deactivate.'); return; }
          setPhases(phases.map((x) => x.id === activePhase.id ? { ...x, forceActive: false, endDate: TODAY, endTime: '12:00' } : x));
          setNotice(`${activePhase.name} deactivated.`);
        }}>Deactivate Phase</Button>
        <Button variant="outline" onClick={() => setNotifyOpen(true)}>Notify All Students Now</Button>
        <Button variant="outline" onClick={() => window.print()}><Download className="w-4 h-4 mr-1" /> Export Schedule as PDF</Button>
      </div>

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `Edit — ${editing.name}` : ''} size="lg" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
          <Button onClick={() => {
            if (!editing) return;
            if (editing.endDate && editing.startDate && toMs(editing.endDate, editing.endTime) < toMs(editing.startDate, editing.startTime)) {
              setErrors([`${editing.name} cannot end before it starts.`]);
              return;
            }
            setPhases(phases.map((x) => x.id === editing.id ? editing : x));
            setEditing(null);
            setNotice(`${editing.name} updated.`);
          }}>Save Phase</Button>
        </div>
      }>
        {editing && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{editing.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-600">Start date</label><input type="date" className="w-full border rounded px-3 py-2" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></div>
              <div><label className="text-xs text-gray-600">Start time</label><input type="time" className="w-full border rounded px-3 py-2" value={editing.startTime} onChange={(e) => setEditing({ ...editing, startTime: e.target.value })} /></div>
              <div><label className="text-xs text-gray-600">End date</label><input type="date" className="w-full border rounded px-3 py-2" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></div>
              <div><label className="text-xs text-gray-600">End time</label><input type="time" className="w-full border rounded px-3 py-2" value={editing.endTime} onChange={(e) => setEditing({ ...editing, endTime: e.target.value })} /></div>
            </div>
            <Textarea label="Internal notes" rows={2} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            <Textarea label="Student portal message" rows={2} value={editing.portalMessage} onChange={(e) => setEditing({ ...editing, portalMessage: e.target.value })} placeholder="Shown on student portal during this phase" />
            <Toggle checked={editing.forceActive} onChange={(v) => setEditing({ ...editing, forceActive: v })} label="Force activate now — bypasses date-based activation" />
            <Toggle checked={editing.autoNotify} onChange={(v) => setEditing({ ...editing, autoNotify: v })} label="Auto notify students when this phase starts" />
            {editing.autoNotify && <Textarea label="Notification message" rows={2} value={editing.notifyMessage} onChange={(e) => setEditing({ ...editing, notifyMessage: e.target.value })} />}
          </div>
        )}
      </Modal>

      <Modal isOpen={notifyOpen} onClose={() => setNotifyOpen(false)} title="Notify all students" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setNotifyOpen(false)}>Cancel</Button>
          <Button onClick={() => { setNotifyOpen(false); setNotice(`Notification sent about ${activePhase?.name || 'current schedule'}.`); }}>Send</Button>
        </div>
      }>
        <p className="text-sm">Send an immediate notice about the current active phase: <b>{activePhase?.name || 'None active'}</b>.</p>
        <p className="text-sm text-gray-600 mt-2">{activePhase?.portalMessage || activePhase?.notifyMessage || 'Applications schedule update.'}</p>
      </Modal>
    </div>
  );
}

export default ApplicationScheduleManager;
