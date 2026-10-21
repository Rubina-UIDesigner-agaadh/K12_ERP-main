import React, { useMemo, useState } from 'react';
import { CheckCircle2, Search, Users, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  DEFAULT_EVENT_EXECUTIONS,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_EXECUTIONS_STORAGE_KEY,
  EVENT_EXECUTION_CHECKLIST,
  SCHOOL_EVENTS_STORAGE_KEY,
  EventExecutionSnapshot,
  EventIncident,
  SchoolEventRecord,
  createEmptyExecution,
  loadEventCollection,
  saveEventCollection,
  setActiveSchoolEvent
} from './eventData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const checklistItems = EVENT_EXECUTION_CHECKLIST;
const programStatuses = ['Upcoming', 'Next', 'On Stage Now', 'Done', 'Delayed', 'Skipped', 'Completed'];
const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  if (status === 'Done' || status === 'Completed') return 'success';
  if (status === 'On Stage Now' || status === 'In Progress') return 'info';
  if (status === 'Delayed') return 'warning';
  if (status === 'Skipped' || status === 'Cancelled') return 'danger';
  return 'default';
};

export function EventExecution({ embeddedEventId, onBack, editable = false }: { embeddedEventId?: string; onBack?: () => void; editable?: boolean } = {}) {
  const [events] = useState<SchoolEventRecord[]>(() => loadEventCollection(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS));
  const [snapshots, setSnapshots] = useState<EventExecutionSnapshot[]>(() => loadEventCollection(EVENT_EXECUTIONS_STORAGE_KEY, DEFAULT_EVENT_EXECUTIONS));
  const [eventSearch, setEventSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingId, setViewingId] = useState<string | null>(embeddedEventId || null);
  const [incidentDraft, setIncidentDraft] = useState({ time: '', description: '', actionTaken: '' });
  const [message, setMessage] = useState('');

  const searchableEvents = events.filter((item) => {
    const q = eventSearch.toLowerCase();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || (item.code || '').toLowerCase().includes(q) || (item.venueName || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const event = events.find((item) => item.id === viewingId) || null;
  const savedSnapshot = useMemo(() => snapshots.find((item) => item.eventId === event?.id), [snapshots, event?.id]);
  const execution = savedSnapshot || (event ? createEmptyExecution(event) : null);
  const expected = event?.expectedAttendance || 0;
  const completedChecklist = checklistItems.filter((item) => Boolean(execution?.checklist[item])).length;

  const persistSnapshot = (next: EventExecutionSnapshot) => {
    const merged = snapshots.some((item) => item.eventId === next.eventId)
      ? snapshots.map((item) => item.eventId === next.eventId ? next : item)
      : [...snapshots, next];
    setSnapshots(merged);
    saveEventCollection(EVENT_EXECUTIONS_STORAGE_KEY, merged);
  };

  const patchExecution = (patch: Partial<EventExecutionSnapshot>) => {
    if (!execution || !event) return;
    persistSnapshot({ ...execution, ...patch, eventId: event.id });
  };

  const openEvent = (id: string) => {
    setViewingId(id);
    setActiveSchoolEvent(id);
  };

  const addIncident = () => {
    if (!execution || !incidentDraft.description.trim()) return;
    const incident: EventIncident = { id: `inc-${Date.now()}`, time: incidentDraft.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), description: incidentDraft.description.trim(), actionTaken: incidentDraft.actionTaken.trim() };
    patchExecution({ incidents: [...execution.incidents, incident] });
    setIncidentDraft({ time: '', description: '', actionTaken: '' });
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      {!embeddedEventId && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Day-of Operations</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Event Execution</h1>
          <p className="mt-1 text-sm text-slate-500">View event duties. Search, then open an event to see its duty checklist and program.</p>
        </div>
      )}
      {embeddedEventId && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Duties</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{event?.name || 'Event duties'}</h1>
            <p className="mt-1 text-sm text-slate-500">{editable ? 'Update the duty checklist, program status and attendance for this event.' : 'Event duties for this schedule.'}</p>
          </div>
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><X className="h-4 w-4" />Back to schedule</Button>}
        </div>
      )}
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      {!viewingId && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} placeholder="Search event, code or venue..." value={eventSearch} onChange={(change) => setEventSearch(change.target.value)} />
            </div>
            <select className={`${inputClass} max-w-48`} value={statusFilter} onChange={(change) => setStatusFilter(change.target.value)}>
              <option value="All">Status: All</option>
              {['Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchableEvents.map((item) => (
                    <tr key={item.id} className="cursor-pointer hover:bg-indigo-50/40" onClick={() => openEvent(item.id)}>
                      <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.name}</p><p className="font-mono text-[10px] text-slate-400">{item.code}</p></td>
                      <td className="px-4 py-3 text-slate-600">{item.date || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{item.venueName || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge></td>
                    </tr>
                  ))}
                  {searchableEvents.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-400">No events match the search.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {viewingId && event && execution && (
        <>
          {!embeddedEventId && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { if (onBack) onBack(); else setViewingId(null); }}><X className="h-4 w-4" />Back</Button>
              <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
            </div>
          )}
          <Card className="border-indigo-200 bg-indigo-50/60">
            <p className="text-sm font-bold text-indigo-950">{event.name} · Event duties</p>
            <p className="mt-1 text-xs text-indigo-800">{event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Event date not set'} · {event.startTime} · {event.venueName || 'Venue not assigned'}</p>
          </Card>
          <Card title="Pre-event Checklist" headerAction={<Badge variant={completedChecklist === checklistItems.length ? 'success' : 'warning'}>{completedChecklist}/{checklistItems.length} complete</Badge>}>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">{checklistItems.map((item) => editable ? (
              <label key={item} className={`flex items-start gap-2 rounded-lg border px-3 py-3 text-xs ${execution.checklist[item] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <input type="checkbox" className="mt-0.5" checked={Boolean(execution.checklist[item])} onChange={(change) => patchExecution({ checklist: { ...execution.checklist, [item]: change.target.checked } })} />
                {item}
              </label>
            ) : (
              <div key={item} className={`rounded-lg border px-3 py-3 text-xs ${execution.checklist[item] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'}`}>{execution.checklist[item] ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : null}{item}</div>
            ))}</div>
          </Card>
          <Card title="Program Status" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Program Item</th><th className="px-4 py-3">Scheduled</th><th className="px-4 py-3">Actual</th><th className="px-4 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {execution.programItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.item || 'Untitled item'}</p><p className="text-xs text-slate-500">{item.participants}</p></td>
                      <td className="px-4 py-3 text-slate-600">{item.time || '—'}</td>
                      <td className="px-4 py-3">{editable ? <input className={inputClass} value={item.actualTime || ''} onChange={(change) => patchExecution({ programItems: execution.programItems.map((row) => row.id === item.id ? { ...row, actualTime: change.target.value } : row) })} /> : <span className="text-slate-600">{item.actualTime || '—'}</span>}</td>
                      <td className="px-4 py-3">{editable ? <select className={inputClass} value={item.status} onChange={(change) => patchExecution({ programItems: execution.programItems.map((row) => row.id === item.id ? { ...row, status: change.target.value } : row) })}>{programStatuses.map((status) => <option key={status}>{status}</option>)}</select> : <Badge variant={statusVariant(item.status)}>{item.status}</Badge>}</td>
                    </tr>
                  ))}
                  {execution.programItems.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">No agenda is scheduled yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Attendance">
              {editable ? (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <label>Students<input type="number" min={0} className={`${inputClass} mt-1`} value={execution.studentCount} onChange={(change) => patchExecution({ studentCount: Number(change.target.value) || 0 })} /></label>
                  <label>Parents<input type="number" min={0} className={`${inputClass} mt-1`} value={execution.parentCount} onChange={(change) => patchExecution({ parentCount: Number(change.target.value) || 0 })} /></label>
                  <label>Staff<input type="number" min={0} className={`${inputClass} mt-1`} value={execution.staffCount} onChange={(change) => patchExecution({ staffCount: Number(change.target.value) || 0 })} /></label>
                  <label>Actual counted<input type="number" min={0} className={`${inputClass} mt-1`} value={execution.actualCounted} onChange={(change) => patchExecution({ actualCounted: Number(change.target.value) || 0 })} /></label>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <p>Students: <b>{execution.studentCount}</b></p>
                  <p>Parents: <b>{execution.parentCount}</b></p>
                  <p>Staff: <b>{execution.staffCount}</b></p>
                  <p className="flex items-center gap-2 text-indigo-700"><Users className="h-4 w-4" />Actual {execution.actualCounted.toLocaleString('en-IN')} / expected {expected.toLocaleString('en-IN')}</p>
                </div>
              )}
            </Card>
            <Card title="Incident Log">
              {execution.incidents.length === 0 ? <p className="text-xs text-slate-500">No incidents recorded.</p> : execution.incidents.map((incident) => (
                <div key={incident.id} className="mb-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-800">{incident.time} · {incident.description}</p>
                  <p className="mt-1 text-xs text-slate-600">{incident.actionTaken || 'No action noted.'}</p>
                </div>
              ))}
              {editable && (
                <div className="mt-3 grid gap-2">
                  <input className={inputClass} placeholder="Time" value={incidentDraft.time} onChange={(change) => setIncidentDraft((current) => ({ ...current, time: change.target.value }))} />
                  <input className={inputClass} placeholder="Incident description" value={incidentDraft.description} onChange={(change) => setIncidentDraft((current) => ({ ...current, description: change.target.value }))} />
                  <input className={inputClass} placeholder="Action taken" value={incidentDraft.actionTaken} onChange={(change) => setIncidentDraft((current) => ({ ...current, actionTaken: change.target.value }))} />
                  <Button size="sm" variant="outline" onClick={addIncident}>Add incident</Button>
                </div>
              )}
            </Card>
          </div>
          <Card title="Notes & Photos">
            {editable ? (
              <textarea className={`${inputClass} min-h-24`} value={execution.notes} onChange={(change) => patchExecution({ notes: change.target.value })} placeholder="Duty notes" />
            ) : (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{execution.notes || 'No notes.'}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">{execution.photoFiles.length ? execution.photoFiles.join(', ') : 'No event photos attached.'}</p>
          </Card>
          {editable && <div className="flex justify-end"><Button onClick={() => { persistSnapshot({ ...execution, complete: completedChecklist === checklistItems.length }); setMessage('Duties saved.'); window.setTimeout(() => setMessage(''), 3000); }}>Save duties</Button></div>}
        </>
      )}
    </div>
  );
}

export default EventExecution;
