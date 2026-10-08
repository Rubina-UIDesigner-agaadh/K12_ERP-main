import React, { useMemo, useState } from 'react';
import { Camera, CheckCircle2, Clock3, Plus, Trash2, Users } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  DEFAULT_EVENT_EXECUTIONS,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_EXECUTIONS_STORAGE_KEY,
  SCHOOL_EVENTS_STORAGE_KEY,
  EventExecutionSnapshot,
  EventIncident,
  EventProgramItem,
  SchoolEventRecord,
  createEmptyExecution,
  createEventId,
  getActiveSchoolEvent,
  loadEventCollection,
  saveEventCollection,
  setActiveSchoolEvent
} from './eventData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const checklistItems = [
  'Venue decoration completed', 'Sound system tested', 'Guest of Honour confirmed',
  'Costumes distributed to performers', 'Seating arrangement done', 'Registration desk set up',
  'Refreshments arranged', 'Photography/videography team in place'
];
const statusOptions = ['Upcoming', 'Next', 'On Stage Now', 'Done', 'Delayed', 'Skipped'];
const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  if (status === 'Done') return 'success';
  if (status === 'On Stage Now') return 'info';
  if (status === 'Delayed') return 'warning';
  if (status === 'Skipped') return 'danger';
  return 'default';
};
const currentClockTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export function EventExecution() {
  const [events, setEvents] = useState<SchoolEventRecord[]>(() => loadEventCollection(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS));
  const [snapshots, setSnapshots] = useState<EventExecutionSnapshot[]>(() => loadEventCollection(EVENT_EXECUTIONS_STORAGE_KEY, DEFAULT_EVENT_EXECUTIONS));
  const [selectedEventId, setSelectedEventId] = useState(() => getActiveSchoolEvent() || 'evt-annual-2026');
  const [message, setMessage] = useState('');
  const [incidentDraft, setIncidentDraft] = useState({ description: '', actionTaken: '' });

  const event = events.find((item) => item.id === selectedEventId) || events[0];
  const savedSnapshot = useMemo(() => snapshots.find((item) => item.eventId === event?.id), [snapshots, event?.id]);
  const execution = savedSnapshot || (event ? createEmptyExecution(event) : null);
  const expected = event?.expectedAttendance || 0;
  const completedChecklist = checklistItems.filter((item) => Boolean(execution?.checklist[item])).length;

  const persistSnapshot = (snapshot: EventExecutionSnapshot) => {
    const next = snapshots.some((item) => item.eventId === snapshot.eventId)
      ? snapshots.map((item) => item.eventId === snapshot.eventId ? snapshot : item)
      : [...snapshots, snapshot];
    setSnapshots(next);
    saveEventCollection(EVENT_EXECUTIONS_STORAGE_KEY, next);
  };
  const updateExecution = (patch: Partial<EventExecutionSnapshot>) => {
    if (!execution) return;
    persistSnapshot({ ...execution, ...patch });
  };
  const changeEvent = (id: string) => {
    setSelectedEventId(id);
    setActiveSchoolEvent(id);
  };
  const updateProgram = (id: string, patch: Partial<EventProgramItem>) => {
    if (!execution) return;
    updateExecution({ programItems: execution.programItems.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };
  const logTime = (item: EventProgramItem) => updateProgram(item.id, { actualTime: currentClockTime(), status: 'Done' });
  const updateAttendance = (field: 'staffCount' | 'studentCount' | 'parentCount', value: number) => {
    if (!execution) return;
    const next = { ...execution, [field]: Math.max(0, value) };
    next.actualCounted = next.staffCount + next.studentCount + next.parentCount;
    persistSnapshot(next);
  };
  const addIncident = () => {
    if (!execution || !incidentDraft.description.trim()) return;
    const incident: EventIncident = { id: createEventId('incident'), time: currentClockTime(), description: incidentDraft.description.trim(), actionTaken: incidentDraft.actionTaken.trim() };
    updateExecution({ incidents: [...execution.incidents, incident] });
    setIncidentDraft({ description: '', actionTaken: '' });
    setMessage('Incident logged.');
    window.setTimeout(() => setMessage(''), 3000);
  };
  const removeIncident = (id: string) => {
    if (execution) updateExecution({ incidents: execution.incidents.filter((incident) => incident.id !== id) });
  };
  const uploadPhotos = (files: FileList | null) => {
    if (!execution || !files?.length) return;
    updateExecution({ photoFiles: [...execution.photoFiles, ...Array.from(files).map((file) => file.name)] });
    setMessage(`${files.length} photo file name(s) added to the event log.`);
    window.setTimeout(() => setMessage(''), 3500);
  };
  const completeEvent = () => {
    if (!event || !execution) return;
    const nextEvents = events.map((item) => item.id === event.id ? { ...item, status: 'Completed' as const } : item);
    setEvents(nextEvents);
    saveEventCollection(SCHOOL_EVENTS_STORAGE_KEY, nextEvents);
    updateExecution({ complete: true });
    setMessage(`${event.name} marked complete. It is ready for Event Feedback & Review.`);
    window.setTimeout(() => setMessage(''), 4500);
  };

  if (!event || !execution) return <div className="p-6"><Card title="Event Execution"><p className="text-sm text-slate-500">Create an event in Event Planning &amp; Schedule before tracking execution.</p></Card></div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Day-of Operations</p><h1 className="mt-1 text-2xl font-bold text-slate-900">🎉 Event Execution</h1><p className="mt-1 text-sm text-slate-500">Live event checklist, program progress, attendance and incident log.</p></div><div className="flex flex-wrap items-center gap-2"><label className="text-xs font-semibold text-slate-500">Active Event</label><select className={`${inputClass} min-w-64`} value={event.id} onChange={(change) => changeEvent(change.target.value)}>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Badge variant={statusVariant(event.status)}>{event.status}</Badge></div></div>
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card className="border-indigo-200 bg-indigo-50/60"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-indigo-950">{event.name}</p><p className="mt-1 text-xs text-indigo-800">{event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Event date not set'} · {event.startTime} · {event.venueName || 'Venue not assigned'}</p></div><div className="flex items-center gap-2 text-xs text-indigo-900"><Clock3 className="h-4 w-4" />{currentClockTime()} · {completedChecklist}/{checklistItems.length} checks done</div></div></Card>

      <Card title="Pre-event Checklist" headerAction={<Badge variant={completedChecklist === checklistItems.length ? 'success' : 'warning'}>{completedChecklist}/{checklistItems.length} complete</Badge>}>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">{checklistItems.map((item) => <label key={item} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-3 text-xs ${execution.checklist[item] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'}`}><input type="checkbox" checked={Boolean(execution.checklist[item])} onChange={(change) => updateExecution({ checklist: { ...execution.checklist, [item]: change.target.checked } })} /><span>{execution.checklist[item] && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}{item}</span></label>)}</div>
      </Card>

      <Card title="Real-time Program Status" noPadding><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Program Item</th><th className="px-4 py-3">Scheduled</th><th className="px-4 py-3">Actual</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{execution.programItems.map((item, index) => <tr key={item.id}><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.item || 'Untitled item'}</p><p className="text-xs text-slate-500">{item.participants}</p></td><td className="px-4 py-3 text-slate-600">{item.time || '—'}</td><td className="px-4 py-3"><input className={`${inputClass} max-w-32`} value={item.actualTime} placeholder="—" onChange={(change) => updateProgram(item.id, { actualTime: change.target.value })} /></td><td className="px-4 py-3"><select className={`${inputClass} max-w-40`} value={item.status} onChange={(change) => updateProgram(item.id, { status: change.target.value })}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-4 py-3 text-right"><Button size="xs" variant="outline" onClick={() => logTime(item)}><Clock3 className="h-3.5 w-3.5" />Log Time / Mark Done</Button></td></tr>)}{execution.programItems.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No agenda is scheduled yet. Add program items in Event Planning &amp; Schedule.</td></tr>}</tbody></table></div></Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Attendance Log"><div className="grid gap-3 sm:grid-cols-2"><label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">Students</span><input type="number" min="0" className={inputClass} value={execution.studentCount} onChange={(change) => updateAttendance('studentCount', Number(change.target.value))} /></label><label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">Parents</span><input type="number" min="0" className={inputClass} value={execution.parentCount} onChange={(change) => updateAttendance('parentCount', Number(change.target.value))} /></label><label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">Staff</span><input type="number" min="0" className={inputClass} value={execution.staffCount} onChange={(change) => updateAttendance('staffCount', Number(change.target.value))} /></label><div className="flex items-end"><div className="w-full rounded-lg bg-slate-50 px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-slate-500">Actual Counted</p><p className="flex items-center gap-2 text-xl font-bold text-indigo-700"><Users className="h-4 w-4" />{execution.actualCounted.toLocaleString('en-IN')}</p></div></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs"><span className="text-slate-600">Expected: <strong>{expected.toLocaleString('en-IN')}</strong></span><span className={execution.actualCounted > expected ? 'font-semibold text-amber-700' : 'font-semibold text-emerald-700'}>{expected ? `${Math.round(execution.actualCounted / expected * 100)}% of expected` : 'Expected count not set'}</span></div></Card>

        <Card title="Incident Log" headerAction={<Badge variant={execution.incidents.length ? 'warning' : 'success'}>{execution.incidents.length ? `${execution.incidents.length} incident(s)` : 'No incidents'}</Badge>}>
          <div className="grid gap-2 sm:grid-cols-2"><input className={inputClass} value={incidentDraft.description} onChange={(change) => setIncidentDraft((current) => ({ ...current, description: change.target.value }))} placeholder="Incident description" /><input className={inputClass} value={incidentDraft.actionTaken} onChange={(change) => setIncidentDraft((current) => ({ ...current, actionTaken: change.target.value }))} placeholder="Action taken / follow-up" /></div><Button className="mt-2" size="sm" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addIncident} disabled={!incidentDraft.description.trim()}>Log Incident</Button>
          <div className="mt-3 space-y-2">{execution.incidents.length === 0 ? <p className="rounded-lg bg-slate-50 px-3 py-3 text-xs text-slate-500">No incidents recorded yet.</p> : execution.incidents.map((incident) => <div key={incident.id} className="flex items-start justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2"><div><p className="text-xs font-semibold text-slate-800">{incident.time} · {incident.description}</p><p className="mt-1 text-xs text-slate-600">{incident.actionTaken || 'No action noted.'}</p></div><button title="Remove incident" className="rounded p-1 text-slate-400 hover:text-rose-600" onClick={() => removeIncident(incident.id)}><Trash2 className="h-4 w-4" /></button></div>)}</div>
        </Card>
      </div>

      <Card title="Event Notes & Photos"><label className="mb-4 block"><span className="mb-1 block text-xs font-semibold text-slate-600">Real-time notes</span><textarea className={`${inputClass} min-h-24`} value={execution.notes} onChange={(change) => updateExecution({ notes: change.target.value })} placeholder="Operational notes, delays, announcements or handover details" /></label><div className="flex flex-wrap items-center justify-between gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Camera className="h-4 w-4" />Add Photos<input type="file" accept="image/*" multiple className="hidden" onChange={(change) => uploadPhotos(change.target.files)} /></label><span className="text-xs text-slate-500">{execution.photoFiles.length ? execution.photoFiles.join(', ') : 'No event photos attached.'}</span></div></Card>

      <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => { const nextEvents = events.map((item) => item.id === event.id ? { ...item, status: 'In Progress' as const } : item); setEvents(nextEvents); saveEventCollection(SCHOOL_EVENTS_STORAGE_KEY, nextEvents); updateExecution({ complete: false }); setMessage(`${event.name} is marked in progress.`); }}>Save / Mark In Progress</Button><Button onClick={completeEvent}><CheckCircle2 className="h-4 w-4" />Mark Event Complete</Button></div>
    </div>
  );
}
