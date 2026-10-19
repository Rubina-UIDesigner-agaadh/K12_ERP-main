import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  COMPETITION_EVENTS_STORAGE_KEY,
  COMPETITION_PARTICIPANTS_STORAGE_KEY,
  DEFAULT_COMPETITION_EVENTS,
  DEFAULT_COMPETITION_PARTICIPANTS,
  CompetitionEventRecord,
  CompetitionParticipantRecord,
  loadCompetitionCollection,
  setActiveCompetitionEvent
} from './competitionData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const statusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  if (status === 'Confirmed' || status === 'Completed') return 'success';
  if (status === 'Rejected' || status === 'Cancelled') return 'danger';
  if (status === 'Pending' || status === 'Registration Open') return 'warning';
  if (status === 'Ongoing') return 'info';
  return 'default';
};
const formatDate = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export function StudentParticipation() {
  const [events] = useState<CompetitionEventRecord[]>(() => loadCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS));
  const [participants] = useState<CompetitionParticipantRecord[]>(() => loadCompetitionCollection(COMPETITION_PARTICIPANTS_STORAGE_KEY, DEFAULT_COMPETITION_PARTICIPANTS));
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(null);

  const searchableEvents = useMemo(() => events.filter((event) => {
    const term = search.trim().toLowerCase();
    return !term || `${event.name} ${event.typeName} ${event.code} ${event.venueName}`.toLowerCase().includes(term);
  }), [events, search]);

  const event = events.find((item) => item.id === viewingId) || null;
  const eventParticipants = useMemo(() => participants.filter((participant) => participant.eventId === event?.id), [participants, event?.id]);

  const openEvent = (id: string) => {
    setViewingId(id);
    setActiveCompetitionEvent(id);
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Competition Management</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Student Participation</h1>
        <p className="mt-1 text-sm text-slate-500">View registered students by competition. Search, then open a competition to see who registered.</p>
      </div>

      {!viewingId && (
        <>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className={`${inputClass} pl-9`} placeholder="Search competition name, type or venue..." value={search} onChange={(change) => setSearch(change.target.value)} />
          </div>
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Competition</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Registered</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchableEvents.map((item) => {
                    const count = participants.filter((participant) => participant.eventId === item.id).length;
                    return (
                      <tr key={item.id} className="cursor-pointer hover:bg-violet-50/40" onClick={() => openEvent(item.id)}>
                        <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.name}</p><p className="font-mono text-[10px] text-slate-400">{item.code}</p></td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(item.startDate)}</td>
                        <td className="px-4 py-3 text-slate-600">{item.venueName || item.venueMode || '—'}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{count}</td>
                        <td className="px-4 py-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge></td>
                      </tr>
                    );
                  })}
                  {searchableEvents.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">No competitions match the search.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {viewingId && event && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewingId(null)}><X className="h-4 w-4" />Back</Button>
            <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
          </div>
          <Card className="border-violet-200 bg-violet-50/50">
            <h2 className="text-base font-bold text-violet-950">{event.name}</h2>
            <p className="mt-1 text-xs text-violet-800">{event.typeName} · {event.level} · {formatDate(event.startDate)} · {eventParticipants.length} student(s) registered</p>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-4"><p className="text-xs font-medium text-slate-500">Registered</p><p className="mt-1 text-2xl font-bold text-slate-900">{eventParticipants.length}</p></Card>
            <Card className="p-4"><p className="text-xs font-medium text-slate-500">Confirmed</p><p className="mt-1 text-2xl font-bold text-emerald-700">{eventParticipants.filter((participant) => participant.registrationStatus === 'Confirmed').length}</p></Card>
            <Card className="p-4"><p className="text-xs font-medium text-slate-500">Pending</p><p className="mt-1 text-2xl font-bold text-amber-700">{eventParticipants.filter((participant) => participant.registrationStatus === 'Pending').length}</p></Card>
            <Card className="p-4"><p className="text-xs font-medium text-slate-500">Rejected</p><p className="mt-1 text-2xl font-bold text-rose-700">{eventParticipants.filter((participant) => participant.registrationStatus === 'Rejected').length}</p></Card>
          </div>
          <Card noPadding>
            <div className="border-b border-slate-200 px-4 py-3"><h3 className="font-semibold text-slate-900">Who registered</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Roll No.</th><th className="px-4 py-3">Registration Status</th><th className="px-4 py-3">Parent Consent</th><th className="px-4 py-3">Attendance</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eventParticipants.map((participant, index) => (
                    <tr key={participant.id}>
                      <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{participant.studentName}</td>
                      <td className="px-4 py-3">{participant.className}</td>
                      <td className="px-4 py-3 font-mono text-xs">{participant.rollNumber}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(participant.registrationStatus)}>{participant.registrationStatus}</Badge></td>
                      <td className="px-4 py-3">{participant.parentConsent}</td>
                      <td className="px-4 py-3">{participant.attendance}%</td>
                    </tr>
                  ))}
                  {eventParticipants.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">No students have registered for this competition.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default StudentParticipation;
