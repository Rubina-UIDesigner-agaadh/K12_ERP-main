import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Bell, Clock3, Pencil, Plus, Save, Timer } from 'lucide-react';

const YEARS = ['2025-26', '2026-27', '2027-28'];
const STORE = 'k12-application-schedule-v3';

const isoDate = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

interface Cycle {
  id: string;
  round: number;
  name: string;
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
interface YearSchedule { status: ScheduleStatus; cycles: Cycle[]; }
type CycleStatus = 'Upcoming' | 'Active' | 'Completed' | 'Overdue';

const emptyCycle = (round: number, startDate = '', endDate = ''): Cycle => ({
  id: `R${round}-${Date.now()}`,
  round,
  name: `Round ${round} Allotment`,
  startDate,
  startTime: '09:00',
  endDate,
  endTime: '17:00',
  notes: '',
  portalMessage: '',
  forceActive: false,
  autoNotify: false,
  notifyMessage: '',
});

const seedCycles = (yearStart: number, status: ScheduleStatus): Cycle[] => {
  if (status === 'Draft') return [];
  if (status === 'Completed') {
    return [
      { ...emptyCycle(1, `${yearStart}-06-19`, `${yearStart}-06-19`), id: `R1-${yearStart}`, endTime: '18:00' },
      { ...emptyCycle(2, `${yearStart}-06-26`, `${yearStart}-06-26`), id: `R2-${yearStart}`, endTime: '18:00' },
      { ...emptyCycle(3, `${yearStart}-07-03`, `${yearStart}-07-03`), id: `R3-${yearStart}`, endTime: '18:00' },
    ];
  }
  return [
    { ...emptyCycle(1, '2026-10-20', '2026-10-28'), id: 'R1-2026', notes: 'First allotment — Science / Commerce / Arts' },
    { ...emptyCycle(2, '2026-10-29', '2026-11-04'), id: 'R2-2026', notes: 'Waitlist and declined seats redistributed' },
    { ...emptyCycle(3, '2026-11-05', '2026-11-12'), id: 'R3-2026', notes: 'Final allotment cycle' },
  ];
};

const loadAll = (): Record<string, YearSchedule> => {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch { /* ignore */ }
  return {
    '2026-27': { status: 'Active', cycles: seedCycles(2026, 'Active') },
    '2025-26': { status: 'Completed', cycles: seedCycles(2025, 'Completed') },
    '2027-28': { status: 'Draft', cycles: [] },
  };
};

const saveAll = (next: Record<string, YearSchedule>) => {
  try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* ignore */ }
};

const toMs = (date: string, time: string) => {
  if (!date) return 0;
  return new Date(`${date}T${time || '00:00'}:00`).getTime();
};

const cycleStart = (c: Cycle) => toMs(c.startDate, c.startTime || '00:00');
const cycleEnd = (c: Cycle) => toMs(c.endDate || c.startDate, c.endTime || '23:59');

const formatSpan = (ms: number) => {
  if (ms <= 0) return '0 days';
  const totalDays = Math.max(0, Math.floor(ms / 86400000));
  const months = Math.floor(totalDays / 30);
  const rem = totalDays % 30;
  const weeks = Math.floor(rem / 7);
  const days = rem % 7;
  const parts: string[] = [];
  if (months) parts.push(months === 1 ? '1 month' : `${months} months`);
  if (weeks) parts.push(weeks === 1 ? '1 week' : `${weeks} weeks`);
  if (days || parts.length === 0) parts.push(days === 1 ? '1 day' : `${days} days`);
  return parts.join(' ');
};

const formatShort = (date: string, time: string) => {
  if (!date) return '—';
  const value = new Date(`${date}T${time || '00:00'}:00`);
  if (Number.isNaN(value.getTime())) return '—';
  return value.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const durationLabel = (c: Cycle) => {
  const start = cycleStart(c);
  const end = cycleEnd(c);
  if (!start || !end || end < start) return '—';
  return formatSpan(end - start);
};

const cycleStatus = (c: Cycle, now: number): CycleStatus => {
  if (c.forceActive) return 'Active';
  if (!c.startDate) return 'Upcoming';
  const start = cycleStart(c);
  const end = cycleEnd(c);
  if (c.endDate && end < start) return 'Overdue';
  if (now > end) return 'Completed';
  if (now >= start && now <= end) return 'Active';
  return 'Upcoming';
};

const STATUS_BADGE: Record<string, 'success' | 'info' | 'secondary' | 'danger' | 'warning'> = {
  Upcoming: 'secondary',
  Active: 'info',
  Completed: 'success',
  Overdue: 'danger',
  Draft: 'warning',
};

const BAR_COLOR: Record<CycleStatus, string> = {
  Upcoming: 'bg-gray-300',
  Active: 'bg-blue-500',
  Completed: 'bg-emerald-500',
  Overdue: 'bg-red-500',
};

const fieldClass = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm';

const sortedCycles = (list: Cycle[]) => [...list].sort((a, b) => a.round - b.round || cycleStart(a) - cycleStart(b));

export function ApplicationScheduleManager() {
  const [all, setAll] = useState(loadAll);
  const [year, setYear] = useState('2026-27');
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [editing, setEditing] = useState<Cycle | null>(null);
  const [creating, setCreating] = useState<Cycle | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const schedule = all[year] || { status: 'Draft' as ScheduleStatus, cycles: [] as Cycle[] };
  const cycles = sortedCycles(schedule.cycles);

  const persist = (next: Record<string, YearSchedule>) => {
    setAll(next);
    saveAll(next);
  };

  const setCycles = (nextCycles: Cycle[], status?: ScheduleStatus) => {
    persist({ ...all, [year]: { status: status || schedule.status, cycles: nextCycles } });
  };

  const derivedStatus = useMemo(() => {
    if (!cycles.length) return 'Draft';
    const statuses = cycles.map((c) => cycleStatus(c, now));
    if (statuses.every((s) => s === 'Completed')) return 'Completed';
    if (statuses.some((s) => s === 'Active')) return 'Active';
    return schedule.status;
  }, [cycles, now, schedule.status]);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const validate = (list: Cycle[]) => {
    const e: string[] = [];
    const ordered = sortedCycles(list);
    ordered.forEach((c) => {
      if (!c.startDate || !c.endDate) e.push(`Save blocked: ${c.name} needs a start and end.`);
      if (c.startDate && c.endDate && cycleEnd(c) < cycleStart(c)) e.push(`${c.name} cannot end before it starts.`);
    });
    for (let i = 0; i < ordered.length - 1; i++) {
      const a = ordered[i];
      const b = ordered[i + 1];
      if (!a.endDate || !b.startDate) continue;
      if (cycleStart(b) < cycleEnd(a)) e.push(`${b.name} overlaps ${a.name}. Adjust dates.`);
    }
    return e;
  };

  const saveFull = () => {
    const e = validate(cycles);
    setErrors(e);
    if (e.length) return;
    persist({ ...all, [year]: { ...schedule, status: derivedStatus as ScheduleStatus } });
    flash('Allotment cycles saved.');
  };

  const saveEdit = () => {
    if (!editing) return;
    const next = cycles.map((c) => {
      if (c.id === editing.id) return editing;
      return editing.forceActive ? { ...c, forceActive: false } : c;
    });
    const e = validate(next);
    setErrors(e);
    if (e.length) return;
    setCycles(next);
    setEditing(null);
    flash(editing.forceActive ? `${editing.name} is now the current allotment cycle.` : `${editing.name} updated.`);
  };

  const openCreate = () => {
    const round = (cycles.reduce((max, c) => Math.max(max, c.round), 0) || 0) + 1;
    const last = cycles[cycles.length - 1];
    let startDate = isoDate(new Date());
    let endDate = isoDate(new Date(Date.now() + 86400000 * 2));
    if (last?.endDate) {
      const nextStart = new Date(`${last.endDate}T00:00:00`);
      nextStart.setDate(nextStart.getDate() + 1);
      startDate = isoDate(nextStart);
      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextEnd.getDate() + 2);
      endDate = isoDate(nextEnd);
    }
    setErrors([]);
    setCreating(emptyCycle(round, startDate, endDate));
  };

  const saveCreate = () => {
    if (!creating) return;
    const next = creating.forceActive
      ? [...cycles.map((c) => ({ ...c, forceActive: false })), creating]
      : [...cycles, creating];
    const e = validate(next);
    setErrors(e);
    if (e.length) return;
    setCycles(next, derivedStatus === 'Draft' ? 'Active' : schedule.status);
    setCreating(null);
    flash(`${creating.name} created.`);
  };

  const patchCycle = (id: string, patch: Partial<Cycle>) => {
    setCycles(cycles.map((c) => c.id === id ? { ...c, ...patch } : c));
  };

  const activateCycle = (id: string) => {
    setCycles(cycles.map((c) => ({ ...c, forceActive: c.id === id })));
    flash(`${cycles.find((c) => c.id === id)?.name || 'Cycle'} is now the current allotment cycle.`);
  };

  const deactivateCycle = (id: string) => {
    setCycles(cycles.map((c) => c.id === id ? { ...c, forceActive: false } : c));
    flash(`${cycles.find((c) => c.id === id)?.name || 'Cycle'} deactivated.`);
  };

  const currentCycle = cycles.find((c) => cycleStatus(c, now) === 'Active') || null;
  const nextCycle = cycles.find((c) => {
    const status = cycleStatus(c, now);
    if (status !== 'Upcoming') return false;
    if (!currentCycle) return true;
    return cycleStart(c) >= cycleEnd(currentCycle);
  }) || cycles.find((c) => cycleStatus(c, now) === 'Upcoming') || null;

  const currentRemaining = currentCycle ? Math.max(0, cycleEnd(currentCycle) - now) : 0;
  const nextStartsIn = nextCycle ? Math.max(0, cycleStart(nextCycle) - now) : 0;
  const currentElapsedPct = currentCycle
    ? Math.min(100, Math.max(0, ((now - cycleStart(currentCycle)) / Math.max(1, cycleEnd(currentCycle) - cycleStart(currentCycle))) * 100))
    : 0;

  const notifyNow = () => {
    const target = editing || currentCycle;
    if (!target) { flash('No active allotment cycle to notify about.'); return; }
    setNotifyMessage(target.notifyMessage || target.portalMessage || `Update: ${target.name} is now in progress.`);
    setNotifyOpen(true);
  };

  const timeline = useMemo(() => {
    const dated = cycles.filter((c) => c.startDate);
    const starts = dated.map((c) => c.startDate);
    const ends = dated.map((c) => c.endDate || c.startDate);
    const today = isoDate(new Date(now));
    const min = starts.length ? [...starts].sort()[0] : today;
    const max = ends.length ? [...ends].sort().slice(-1)[0] : today;
    const minMs = new Date(`${min}T00:00:00`).getTime();
    const maxMs = new Date(`${max}T23:59:59`).getTime();
    const span = Math.max(1, maxMs - minMs);
    const months: { label: string; left: number }[] = [];
    const cursor = new Date(`${min}T00:00:00`);
    cursor.setDate(1);
    while (cursor.getTime() <= maxMs) {
      months.push({
        label: cursor.toLocaleDateString('en-IN', { month: 'short' }),
        left: ((cursor.getTime() - minMs) / span) * 100,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const todayLeft = ((now - minMs) / span) * 100;
    return { minMs, span, months, todayLeft };
  }, [cycles, now]);

  const barStyle = (c: Cycle) => {
    if (!c.startDate) return { left: '0%', width: '0%' };
    const start = new Date(`${c.startDate}T00:00:00`).getTime();
    const end = new Date(`${c.endDate || c.startDate}T23:59:59`).getTime();
    const left = ((start - timeline.minMs) / timeline.span) * 100;
    const width = Math.max(1.2, ((end - start) / timeline.span) * 100);
    return { left: `${Math.min(100, Math.max(0, left))}%`, width: `${Math.min(100 - Math.max(0, left), width)}%` };
  };

  const cycleProgress = (c: Cycle) => {
    const status = cycleStatus(c, now);
    if (status === 'Upcoming') return { label: `Starts in ${formatSpan(cycleStart(c) - now)}`, pct: 0 };
    if (status === 'Active') {
      const total = Math.max(1, cycleEnd(c) - cycleStart(c));
      return { label: `Ends in ${formatSpan(cycleEnd(c) - now)}`, pct: Math.min(100, Math.max(0, ((now - cycleStart(c)) / total) * 100)) };
    }
    return { label: 'Ended', pct: 100 };
  };

  const formFields = (cycle: Cycle, setCycle: (next: Cycle) => void) => (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium text-gray-500">Cycle name</span>
        <input className={fieldClass} value={cycle.name} onChange={(event) => setCycle({ ...cycle, name: event.target.value })} />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-medium text-gray-500">Start Date</span>
          <input type="date" className={fieldClass} value={cycle.startDate} onChange={(event) => setCycle({ ...cycle, startDate: event.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-medium text-gray-500">Start Time</span>
          <input type="time" className={fieldClass} value={cycle.startTime} onChange={(event) => setCycle({ ...cycle, startTime: event.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-medium text-gray-500">End Date</span>
          <input type="date" className={fieldClass} value={cycle.endDate} onChange={(event) => setCycle({ ...cycle, endDate: event.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-medium text-gray-500">End Time</span>
          <input type="time" className={fieldClass} value={cycle.endTime} onChange={(event) => setCycle({ ...cycle, endTime: event.target.value })} />
        </label>
      </div>
      <Textarea label="Internal Notes" rows={3} value={cycle.notes} onChange={(e) => setCycle({ ...cycle, notes: e.target.value })} helperText="Admin only — not visible to students" />
      <Textarea label="Student Portal Message" rows={3} value={cycle.portalMessage} onChange={(e) => setCycle({ ...cycle, portalMessage: e.target.value })} placeholder='e.g. "Round 2 allotment is open. Accept or decline by 5 PM."' />
      <Toggle label="Force Activate Now" checked={cycle.forceActive} onChange={(checked) => setCycle({ ...cycle, forceActive: checked })} />
      <Toggle label="Auto Notify Students When This Cycle Starts" checked={cycle.autoNotify} onChange={(checked) => setCycle({ ...cycle, autoNotify: checked })} />
      {cycle.autoNotify && (
        <Textarea label="Notification Message" rows={3} value={cycle.notifyMessage} onChange={(e) => setCycle({ ...cycle, notifyMessage: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → Schedule</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <h1 className="text-xl font-bold">Application Schedule</h1>
            <Badge variant="info">{year}</Badge>
            <Badge variant={STATUS_BADGE[derivedStatus] || 'secondary'}>{derivedStatus}</Badge>
          </div>
          <p className="text-sm text-gray-500">Create allotment cycle rounds. Remaining time is shown in months, weeks and days.</p>
        </div>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block text-xs font-medium text-gray-500">Academic Year</span>
          <select className={fieldClass} value={year} onChange={(event) => setYear(event.target.value)}>
            {YEARS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{notice}</div>}
      {errors.length > 0 && (
        <div className="space-y-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errors.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Timer className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Current cycle — time left</p>
          </div>
          {currentCycle ? (
            <>
              <p className="mt-2 text-lg font-bold text-gray-900">{currentCycle.name}</p>
              <p className="text-sm text-gray-500">{formatShort(currentCycle.startDate, currentCycle.startTime)} → {formatShort(currentCycle.endDate, currentCycle.endTime)}</p>
              <p className="mt-3 text-2xl font-bold text-blue-700">{formatSpan(currentRemaining)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${currentElapsedPct}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">{Math.round(currentElapsedPct)}% elapsed</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No allotment cycle is running. Create a round or wait for the next start time.</p>
          )}
        </div>
        <div className="rounded-xl border border-indigo-200 bg-white p-4">
          <div className="flex items-center gap-2 text-indigo-700">
            <Clock3 className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Next cycle — time until start</p>
          </div>
          {nextCycle ? (
            <>
              <p className="mt-2 text-lg font-bold text-gray-900">{nextCycle.name}</p>
              <p className="text-sm text-gray-500">Starts {formatShort(nextCycle.startDate, nextCycle.startTime)}</p>
              <p className="mt-3 text-2xl font-bold text-indigo-700">{formatSpan(nextStartsIn)}</p>
              <p className="mt-3 text-xs text-gray-500">Ends {formatShort(nextCycle.endDate, nextCycle.endTime)} · {durationLabel(nextCycle)}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No upcoming allotment cycle. Use Create Allotment Cycle to add the next round.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Create Allotment Cycle</Button>
        <Button variant="outline" onClick={saveFull}><Save className="h-4 w-4" />Save Cycle</Button>
        <Button variant="outline" onClick={() => {
          const id = selectedId || editing?.id || cycles.find((c) => cycleStatus(c, now) === 'Upcoming')?.id || cycles[0]?.id;
          if (!id) { flash('Create an allotment cycle first.'); return; }
          activateCycle(id);
        }}>Activate Cycle</Button>
        <Button variant="outline" onClick={notifyNow}><Bell className="h-4 w-4" />Notify All Students</Button>
        <Button variant="outline" onClick={() => {
          const id = selectedId || currentCycle?.id || editing?.id;
          if (!id) { flash('No active cycle to deactivate.'); return; }
          deactivateCycle(id);
        }}>Deactivate Cycle</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Allotment cycles</h2>
          <p className="text-xs text-gray-500">Only allotment rounds are created here. Each row shows time until start or time left to end.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Round</th>
                <th className="px-3 py-3">Start</th>
                <th className="px-3 py-3">End</th>
                <th className="px-3 py-3">Duration</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Progress</th>
                <th className="px-3 py-3">Next cycle</th>
                <th className="px-3 py-3">Force Active</th>
                <th className="px-3 py-3 print:hidden">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cycles.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-sm text-gray-500">No allotment cycles yet. Create Round 1 Allotment to begin.</td>
                </tr>
              )}
              {cycles.map((c, index) => {
                const status = cycleStatus(c, now);
                const progress = cycleProgress(c);
                const following = cycles[index + 1];
                const untilNext = following ? Math.max(0, cycleStart(following) - now) : 0;
                return (
                  <tr key={c.id} className={`${status === 'Active' ? 'bg-blue-50/40' : ''} ${selectedId === c.id ? 'ring-2 ring-inset ring-blue-400' : ''} cursor-pointer`} onClick={() => setSelectedId(c.id)}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.notes || 'Allotment cycle'}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-700">{formatShort(c.startDate, c.startTime)}</td>
                    <td className="px-3 py-3 text-xs text-gray-700">{formatShort(c.endDate, c.endTime)}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{durationLabel(c)}</td>
                    <td className="px-3 py-3"><Badge variant={STATUS_BADGE[status]}>{status}</Badge></td>
                    <td className="px-3 py-3 min-w-[180px]">
                      <p className="font-mono text-xs font-semibold text-gray-800">{progress.label}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${status === 'Active' ? 'bg-blue-500' : status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ width: `${progress.pct}%` }} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">
                      {following ? (
                        <>
                          <p className="font-medium text-gray-800">{following.name}</p>
                          <p>{now >= cycleStart(following) ? 'Started' : `Starts in ${formatSpan(untilNext)}`}</p>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-3 py-3 print:hidden">
                      <Toggle size="sm" checked={c.forceActive} onChange={(checked) => {
                        if (checked) activateCycle(c.id);
                        else deactivateCycle(c.id);
                      }} />
                    </td>
                    <td className="px-3 py-3 print:hidden">
                      <Button size="xs" variant="ghost" onClick={() => { setEditing({ ...c }); setErrors([]); }}><Pencil className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Cycle timeline</h2>
            <p className="text-xs text-gray-500">Allotment rounds plotted across the calendar. Click a bar to edit.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-gray-600">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-emerald-500" />Completed</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-blue-500" />Active</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-gray-300" />Upcoming</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-red-500" />Overdue</span>
          </div>
        </div>
        <div className="relative overflow-x-auto">
          <div className="relative min-w-[720px]">
            <div className="relative mb-2 h-6 border-b border-gray-200">
              {timeline.months.map((m) => (
                <span key={`${m.label}-${m.left}`} className="absolute top-0 -translate-x-1/2 text-[10px] uppercase text-gray-400" style={{ left: `${m.left}%` }}>{m.label}</span>
              ))}
            </div>
            <div className="relative space-y-1 py-2">
              {timeline.todayLeft >= 0 && timeline.todayLeft <= 100 && (
                <div className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-red-500" style={{ left: `${timeline.todayLeft}%` }} />
              )}
              {cycles.map((c) => {
                const status = cycleStatus(c, now);
                const style = barStyle(c);
                return (
                  <div key={c.id} className="relative h-8">
                    <span className="absolute left-0 top-1/2 z-20 w-36 -translate-y-1/2 truncate pr-2 text-[11px] font-medium text-gray-600">{c.name}</span>
                    <div className="ml-36 relative h-8">
                      <button
                        type="button"
                        className={`absolute top-1 h-6 rounded-md ${BAR_COLOR[status]} shadow-sm`}
                        style={style}
                        onMouseEnter={() => setHoverId(c.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => { setEditing({ ...c }); setErrors([]); }}
                        title={`${c.name} · ${cycleProgress(c).label}`}
                      />
                      {hoverId === c.id && (
                        <div className="absolute z-30 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 shadow" style={{ left: style.left, top: '1.8rem' }}>
                          <b>{c.name}</b><br />
                          {cycleProgress(c).label}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {cycles.length === 0 && <p className="py-4 text-sm text-gray-500">Timeline appears after you create an allotment cycle.</p>}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-red-600">Red vertical line = now.</p>
      </div>

      <Modal
        isOpen={Boolean(creating)}
        onClose={() => setCreating(null)}
        title={creating ? `Create ${creating.name}` : 'Create allotment cycle'}
        size="lg"
        footer={<div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setCreating(null)}>Cancel</Button>
          <Button onClick={saveCreate}>Create cycle</Button>
        </div>}
      >
        {creating && formFields(creating, setCreating)}
      </Modal>

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Edit cycle · ${editing.name}` : 'Cycle'}
        size="lg"
        footer={<div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          {editing && <Button variant="outline" onClick={() => { activateCycle(editing.id); setEditing((current) => current ? { ...current, forceActive: true } : current); }}>Activate Cycle</Button>}
          {editing && <Button variant="outline" onClick={() => { deactivateCycle(editing.id); setEditing((current) => current ? { ...current, forceActive: false } : current); }}>Deactivate Cycle</Button>}
          <Button onClick={saveEdit}>Save Cycle</Button>
        </div>}
      >
        {editing && formFields(editing, setEditing)}
      </Modal>

      <Modal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        title="Notify all students"
        size="md"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setNotifyOpen(false)}>Cancel</Button><Button onClick={() => { setNotifyOpen(false); flash('Notification queued for all students about the current allotment cycle.'); }}>Send now</Button></div>}
      >
        <Textarea rows={4} value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} />
      </Modal>
    </div>
  );
}

export default ApplicationScheduleManager;
