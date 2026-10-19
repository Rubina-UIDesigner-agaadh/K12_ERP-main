import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  COMPETITION_EVENTS_STORAGE_KEY,
  COMPETITION_PARTICIPANTS_STORAGE_KEY,
  COMPETITION_RESULTS_STORAGE_KEY,
  DEFAULT_COMPETITION_EVENTS,
  DEFAULT_COMPETITION_PARTICIPANTS,
  DEFAULT_COMPETITION_RESULTS,
  CompetitionEventRecord,
  CompetitionParticipantRecord,
  CompetitionStudentResult,
  loadCompetitionCollection,
  setActiveCompetitionEvent
} from './competitionData';

const OVERALL_STORAGE_KEY = 'k12-competition-overall-results-v1';
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';

interface OverallCompetitionResult {
  eventId: string;
  schoolRank: string;
  schoolsCount: number;
  overallResult: string;
  prizeReceived: string;
  certificateReceived: string;
  teacherReport: string;
  postActions: Record<string, boolean>;
}

const initialOverall: OverallCompetitionResult = {
  eventId: 'evt-001', schoolRank: '2nd', schoolsCount: 25, overallResult: 'Runner-up',
  prizeReceived: 'Silver Trophy + ₹3,000 Cash Prize', certificateReceived: 'School Participation Certificate', teacherReport: '',
  postActions: { participationCertificates: true, meritCertificates: true, studentProfiles: true, noticeBoard: true, notifyParents: true, parentPortal: true, housePoints: true, assembly: false }
};

const emptyOverall = (eventId: string): OverallCompetitionResult => ({ ...initialOverall, eventId, schoolRank: '', schoolsCount: 0, overallResult: 'Participated', prizeReceived: '', certificateReceived: '', teacherReport: '', postActions: { ...initialOverall.postActions } });
const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  if (status === 'Completed') return 'success';
  if (status === 'Cancelled') return 'danger';
  if (status === 'Ongoing' || status === 'Registration Open') return status === 'Ongoing' ? 'info' : 'warning';
  return 'default';
};
const formatDate = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export function ResultsAchievements({ embeddedEventId, onBack }: { embeddedEventId?: string; onBack?: () => void } = {}) {
  const [events] = useState<CompetitionEventRecord[]>(() => loadCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS));
  const [participants] = useState<CompetitionParticipantRecord[]>(() => loadCompetitionCollection(COMPETITION_PARTICIPANTS_STORAGE_KEY, DEFAULT_COMPETITION_PARTICIPANTS));
  const [results] = useState<CompetitionStudentResult[]>(() => loadCompetitionCollection(COMPETITION_RESULTS_STORAGE_KEY, DEFAULT_COMPETITION_RESULTS));
  const [overallRecords] = useState<OverallCompetitionResult[]>(() => loadCompetitionCollection(OVERALL_STORAGE_KEY, [initialOverall]));
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(embeddedEventId || null);

  const searchableEvents = useMemo(() => events.filter((event) => {
    const term = search.trim().toLowerCase();
    return !term || `${event.name} ${event.typeName} ${event.code} ${event.venueName}`.toLowerCase().includes(term);
  }), [events, search]);

  const event = events.find((item) => item.id === viewingId) || null;
  const eventParticipants = useMemo(() => participants.filter((item) => item.eventId === event?.id), [participants, event?.id]);
  const storedResults = useMemo(() => results.filter((item) => item.eventId === event?.id), [results, event?.id]);
  const rows = storedResults.length ? storedResults : eventParticipants.map((participant) => ({
    id: `result-${participant.id}`,
    eventId: participant.eventId,
    studentName: participant.studentName,
    className: participant.className,
    score: '',
    position: 'Participation',
    award: 'Participation',
    house: 'Fire House',
    housePoints: 0
  }));
  const overall = overallRecords.find((record) => record.eventId === event?.id) || (event ? emptyOverall(event.id) : initialOverall);

  const openEvent = (id: string) => {
    setViewingId(id);
    setActiveCompetitionEvent(id);
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      {!embeddedEventId && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Competition Management</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Results &amp; Achievements</h1>
          <p className="mt-1 text-sm text-slate-500">View competition results. Search, then open a competition to see its result.</p>
        </div>
      )}
      {embeddedEventId && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Results</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{event?.name || 'Competition result'}</h1>
          </div>
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><X className="h-4 w-4" />Back to events</Button>}
        </div>
      )}

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
                  <tr><th className="px-4 py-3">Competition</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchableEvents.map((item) => (
                    <tr key={item.id} className="cursor-pointer hover:bg-amber-50/40" onClick={() => openEvent(item.id)}>
                      <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.name}</p><p className="font-mono text-[10px] text-slate-400">{item.code}</p></td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(item.startDate)}</td>
                      <td className="px-4 py-3 text-slate-600">{item.venueName || item.venueMode || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge></td>
                    </tr>
                  ))}
                  {searchableEvents.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-400">No competitions match the search.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {viewingId && event && (
        <>
          {!embeddedEventId && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewingId(null)}><X className="h-4 w-4" />Back</Button>
              <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
            </div>
          )}
          <Card className="border-amber-200 bg-amber-50/60">
            <h2 className="text-base font-bold text-amber-950">{event.name}</h2>
            <p className="mt-1 text-xs text-amber-800">{event.typeName} · {event.level} · {formatDate(event.startDate)}</p>
          </Card>
          <Card title="Winners">
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <p>House-wise: <b>{event.winnerHouse || '—'}</b></p>
              <p>Class-wise: <b>{event.winnerClass || '—'}</b></p>
              <p>School-wise: <b>{event.winnerSchool || '—'}</b></p>
            </div>
          </Card>
          <Card title="Overall school result">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm">
              <p>Rank: <b>{overall.schoolRank || '—'}</b></p>
              <p>Out of schools: <b>{overall.schoolsCount || '—'}</b></p>
              <p>Overall result: <b>{overall.overallResult || '—'}</b></p>
              <p>Prize: <b>{overall.prizeReceived || '—'}</b></p>
              <p>Certificate: <b>{overall.certificateReceived || '—'}</b></p>
            </div>
            {overall.teacherReport ? <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{overall.teacherReport}</p> : null}
          </Card>
          <Card noPadding>
            <div className="border-b border-slate-200 px-4 py-3"><h3 className="font-semibold text-slate-900">Student results</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Award</th><th className="px-4 py-3">House</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-semibold">{row.studentName}</td>
                      <td className="px-4 py-3">{row.className}</td>
                      <td className="px-4 py-3">{row.score || '—'}</td>
                      <td className="px-4 py-3">{row.position || '—'}</td>
                      <td className="px-4 py-3">{row.award || '—'}</td>
                      <td className="px-4 py-3">{row.house || '—'}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No results recorded for this competition.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default ResultsAchievements;
