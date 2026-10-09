import React, { useMemo, useState } from 'react';
import { Award, CalendarDays, CheckCircle2, Download, FileText, Medal, Save, Trophy, X } from 'lucide-react';
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
  downloadCsv,
  getActiveCompetitionEvent,
  loadCompetitionCollection,
  saveCompetitionCollection,
  setActiveCompetitionEvent
} from './competitionData';

const OVERALL_STORAGE_KEY = 'k12-competition-overall-results-v1';
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

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
const rankOptions = ['1st', '2nd', '3rd', '4th', '5th', 'Participation', 'Other'];
const HOUSE_OPTIONS = ['Fire House', 'Earth House', 'Water House', 'Air House', 'Red House', 'Blue House', 'Green House', 'Yellow House'];
const actionLabels: Array<[keyof OverallCompetitionResult['postActions'], string]> = [
  ['participationCertificates', 'Generate participation certificates for all students'],
  ['meritCertificates', 'Generate merit certificates for winners'],
  ['studentProfiles', 'Update student profiles with achievements'],
  ['noticeBoard', 'Post achievement on school notice board'],
  ['notifyParents', 'Notify parents of participating students'],
  ['parentPortal', 'Share results on Parent Portal'],
  ['housePoints', 'Award house points as configured'],
  ['assembly', 'Announce results in morning assembly']
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}</label>;
}

function getAward(position: string) {
  if (position === '1st') return 'Gold + Certificate';
  if (position === '2nd') return 'Silver + Certificate';
  if (position === '3rd') return 'Bronze + Certificate';
  return 'Participation';
}

function pointsFor(position: string, event: CompetitionEventRecord) {
  if (!event.housePointsEnabled) return 0;
  if (position === '1st') return event.housePointsFirst;
  if (position === '2nd') return event.housePointsSecond;
  if (position === '3rd') return event.housePointsThird;
  return event.housePointsParticipation;
}

const emptyOverall = (eventId: string): OverallCompetitionResult => ({ ...initialOverall, eventId, schoolRank: '', schoolsCount: 0, overallResult: 'Participated', prizeReceived: '', certificateReceived: '', teacherReport: '', postActions: { ...initialOverall.postActions } });

export function ResultsAchievements() {
  const [events, setEvents] = useState<CompetitionEventRecord[]>(() => loadCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS));
  const [participants] = useState<CompetitionParticipantRecord[]>(() => loadCompetitionCollection(COMPETITION_PARTICIPANTS_STORAGE_KEY, DEFAULT_COMPETITION_PARTICIPANTS));
  const [results, setResults] = useState<CompetitionStudentResult[]>(() => loadCompetitionCollection(COMPETITION_RESULTS_STORAGE_KEY, DEFAULT_COMPETITION_RESULTS));
  const [overallRecords, setOverallRecords] = useState<OverallCompetitionResult[]>(() => loadCompetitionCollection(OVERALL_STORAGE_KEY, [initialOverall]));
  const [selectedEventId, setSelectedEventId] = useState(() => getActiveCompetitionEvent() || DEFAULT_COMPETITION_EVENTS[0].id);
  const [message, setMessage] = useState('');
  const [evidence, setEvidence] = useState({ resultSheet: '', schoolCertificate: '', photos: '', mediaCoverage: '' });

  const event = events.find((item) => item.id === selectedEventId) || events[0];
  const eventParticipants = useMemo(() => participants.filter((item) => item.eventId === event?.id), [participants, event?.id]);
  const storedResults = useMemo(() => results.filter((item) => item.eventId === event?.id), [results, event?.id]);
  const rows = useMemo(() => {
    if (storedResults.length) return storedResults;
    return eventParticipants.map((participant) => ({
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
  }, [storedResults, eventParticipants]);
  const overall = overallRecords.find((record) => record.eventId === event?.id) || (event ? emptyOverall(event.id) : initialOverall);

  function updateOverall<K extends keyof OverallCompetitionResult>(key: K, value: OverallCompetitionResult[K]) {
    if (!event) return;
    const current = overallRecords.find((record) => record.eventId === event.id) || emptyOverall(event.id);
    const nextRecord = { ...current, [key]: value };
    const next = overallRecords.some((record) => record.eventId === event.id)
      ? overallRecords.map((record) => record.eventId === event.id ? nextRecord : record)
      : [...overallRecords, nextRecord];
    setOverallRecords(next);
  }

  const setEvent = (id: string) => { setSelectedEventId(id); setActiveCompetitionEvent(id); };

  const updateResult = (id: string, patch: Partial<CompetitionStudentResult>) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    const normalizedPatch = patch.position
      ? { ...patch, award: getAward(patch.position), housePoints: event ? pointsFor(patch.position, event) : 0 }
      : patch;
    const nextRow = { ...row, ...normalizedPatch };
    const next = results.some((item) => item.id === id)
      ? results.map((item) => item.id === id ? nextRow : item)
      : [...results, nextRow];
    setResults(next);
  };

  const persistResults = () => {
    if (!event) return;
    const merged = results.filter((item) => item.eventId !== event.id).concat(rows);
    setResults(merged);
    saveCompetitionCollection(COMPETITION_RESULTS_STORAGE_KEY, merged);
    saveCompetitionCollection(OVERALL_STORAGE_KEY, overallRecords.some((record) => record.eventId === event.id) ? overallRecords : [...overallRecords, overall]);
    setMessage(`Results saved for ${event.name}.`);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const autoAwardPoints = () => {
    if (!event) return;
    const updatedRows = rows.map((row) => ({ ...row, housePoints: pointsFor(row.position, event), award: getAward(row.position) }));
    const merged = results.filter((item) => item.eventId !== event.id).concat(updatedRows);
    setResults(merged);
    saveCompetitionCollection(COMPETITION_RESULTS_STORAGE_KEY, merged);
    updateOverall('postActions', { ...overall.postActions, housePoints: true });
    setMessage('House points and award labels were calculated from the saved event rules.');
    window.setTimeout(() => setMessage(''), 3500);
  };

  const finalize = () => {
    if (!event) return;
    persistResults();
    const nextEvents = events.map((item) => item.id === event.id ? { ...item, status: 'Completed' as const } : item);
    setEvents(nextEvents);
    saveCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, nextEvents);
    setMessage(`Results finalized for ${event.name}. Certificate actions are ready for review.`);
    window.setTimeout(() => setMessage(''), 4000);
  };

  const exportResults = () => downloadCsv('competition-results-achievements.csv', rows.map((row) => ({
    Student: row.studentName, Class: row.className, Score: row.score, Position: row.position, Award: row.award, House: row.house, HousePoints: row.housePoints
  })));

  const resetChanges = () => {
    const fresh = loadCompetitionCollection(COMPETITION_RESULTS_STORAGE_KEY, DEFAULT_COMPETITION_RESULTS);
    setResults(fresh);
    setOverallRecords(loadCompetitionCollection(OVERALL_STORAGE_KEY, [initialOverall]));
    setMessage('Unsaved changes were discarded.');
    window.setTimeout(() => setMessage(''), 3000);
  };

  if (!event) return <div className="p-6 text-sm text-slate-500">Create a competition event before entering results.</div>;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-amber-100 p-3 text-amber-700"><Trophy className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Competition Management</p><h1 className="text-2xl font-bold text-slate-900">Results &amp; Achievements</h1><p className="mt-1 text-sm text-slate-500">Record school and student outcomes, distribute configured house points, and prepare certificates.</p></div></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={exportResults}><Download className="h-4 w-4" />Export Results</Button><Button onClick={persistResults}><Save className="h-4 w-4" />Save Results</Button></div></div>

      <Card className="border-amber-200 bg-amber-50/60 p-4"><div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><Field label="Competition"><select className={inputClass} value={event.id} onChange={(change) => setEvent(change.target.value)}>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Results Status"><select className={inputClass} value={event.status === 'Completed' ? 'Finalized' : 'Entering Results'} onChange={(change) => { const next = events.map((item) => item.id === event.id ? { ...item, status: change.target.value === 'Finalized' ? 'Completed' as const : 'Ongoing' as const } : item); setEvents(next); saveCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, next); }}><option>Entering Results</option><option>Finalized</option></select></Field><div className="self-end text-sm text-amber-900"><CalendarDays className="mr-1 inline h-4 w-4" />{event.startDate || 'Date not set'}</div></div></Card>

      {message && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{message}</div>}

      <Card className="overflow-hidden"><div className="mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-indigo-600" /><h2 className="font-bold text-slate-900">Panel 1 · Overall School Result</h2></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><Field label="School's Overall Rank / Position"><select className={inputClass} value={overall.schoolRank} onChange={(change) => updateOverall('schoolRank', change.target.value)}><option value="">Select rank</option>{rankOptions.map((rank) => <option key={rank}>{rank}</option>)}</select></Field><Field label="Out of how many schools"><input type="number" min={0} className={inputClass} value={overall.schoolsCount} onChange={(change) => updateOverall('schoolsCount', Number(change.target.value))} /></Field><Field label="Overall Result"><select className={inputClass} value={overall.overallResult} onChange={(change) => updateOverall('overallResult', change.target.value)}><option>Won</option><option>Runner-up</option><option>Participated</option><option>Disqualified</option></select></Field><Field label="Prize / Trophy Received"><input className={inputClass} value={overall.prizeReceived} onChange={(change) => updateOverall('prizeReceived', change.target.value)} /></Field><Field label="Certificate Received"><input className={inputClass} value={overall.certificateReceived} onChange={(change) => updateOverall('certificateReceived', change.target.value)} /></Field><div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><span className="text-xs text-slate-500">Competition</span><p className="mt-1 font-semibold text-slate-900">{event.name}</p><p className="text-xs text-slate-600">{event.typeName} · {event.level}</p></div></div></Card>

      <Card noPadding className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-bold text-slate-900">Panel 2 · Individual Student Results</h2><p className="mt-1 text-xs text-slate-500">Results are prefilled from this competition's registered participants.</p></div><Badge variant="info">{rows.length} participant(s)</Badge></div><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Marks / Score</th><th className="px-4 py-3">Position / Rank</th><th className="px-4 py-3">Award / Certificate</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="px-4 py-3 font-semibold">{row.studentName}</td><td className="px-4 py-3">{row.className}</td><td className="px-4 py-3"><input className={`${inputClass} min-w-28`} value={row.score} onChange={(change) => updateResult(row.id, { score: change.target.value })} placeholder="88/100" /></td><td className="px-4 py-3"><select className={inputClass} value={row.position} onChange={(change) => updateResult(row.id, { position: change.target.value })}>{rankOptions.map((rank) => <option key={rank}>{rank}</option>)}</select></td><td className="px-4 py-3"><input className={inputClass} value={row.award} onChange={(change) => updateResult(row.id, { award: change.target.value })} /></td><td className="px-4 py-3"><Button size="xs" variant="outline" onClick={() => { setMessage(`Certificate prepared for ${row.studentName}.`); window.setTimeout(() => setMessage(''), 3000); }}><Medal className="h-3.5 w-3.5" />Certificate</Button></td></tr>)}{rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No student registrations are available for this event.</td></tr>}</tbody></table></div></Card>

      <Card className="border-emerald-200 bg-emerald-50/40"><div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">Panel 3 · House Points Distribution</h2><p className="mt-1 text-xs text-slate-600">{event.housePointsEnabled ? 'Points follow this event’s Competition Master / event settings.' : 'House points are disabled for this competition.'}</p></div><Button variant="outline" disabled={!event.housePointsEnabled} onClick={autoAwardPoints}><CheckCircle2 className="h-4 w-4" />Auto-Award House Points</Button></div><div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"><input type="checkbox" checked={event.housePointsEnabled} onChange={(change) => { const next = events.map((item) => item.id === event.id ? { ...item, housePointsEnabled: change.target.checked } : item); setEvents(next); saveCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, next); }} /><span>Award House Points Based on Results</span></div><div className="overflow-x-auto"><table className="min-w-[560px] w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Student / Position</th><th className="px-3 py-2">House</th><th className="px-3 py-2">Points</th><th className="px-3 py-2">Assign House</th></tr></thead><tbody className="divide-y divide-emerald-100">{rows.map((row) => <tr key={row.id}><td className="px-3 py-2">{row.studentName} <span className="text-slate-500">({row.position})</span></td><td className="px-3 py-2">{row.house}</td><td className="px-3 py-2 font-bold text-emerald-800">{row.housePoints}</td><td className="px-3 py-2"><select className={inputClass} value={row.house} onChange={(change) => updateResult(row.id, { house: change.target.value })}>{HOUSE_OPTIONS.map((house) => <option key={house}>{house}</option>)}</select></td></tr>)}</tbody></table></div></Card>

      <Card><div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-slate-600" /><h2 className="font-bold text-slate-900">Panel 4 · Evidence & Documents</h2></div><div className="grid gap-3 md:grid-cols-2">{([
        ['resultSheet', 'Upload Result Sheet'], ['schoolCertificate', 'Upload School Certificate'], ['photos', 'Upload Photos'], ['mediaCoverage', 'Upload Media Coverage']
      ] as Array<[keyof typeof evidence, string]>).map(([key, label]) => <Field key={key} label={label}><input type="file" className={inputClass} onChange={(change) => setEvidence((current) => ({ ...current, [key]: change.target.files?.[0]?.name || '' }))} />{evidence[key] && <span className="mt-1 block text-xs text-emerald-700">Selected: {evidence[key]}</span>}</Field>)}</div><Field label="Teacher's Report"><textarea className={`${inputClass} mt-2 min-h-24`} value={overall.teacherReport} onChange={(change) => updateOverall('teacherReport', change.target.value)} placeholder="Brief account of the competition experience…" /></Field></Card>

      <Card><h2 className="mb-3 font-bold text-slate-900">Panel 5 · Post-Result Actions</h2><div className="grid gap-2 sm:grid-cols-2">{actionLabels.map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={overall.postActions[key]} onChange={(change) => updateOverall('postActions', { ...overall.postActions, [key]: change.target.checked })} />{label}</label>)}</div></Card>

      <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={resetChanges}><X className="h-4 w-4" />Cancel Changes</Button><Button variant="outline" onClick={persistResults}><Save className="h-4 w-4" />Save Results</Button><Button onClick={finalize}><Trophy className="h-4 w-4" />Finalize &amp; Generate All Certificates</Button></div>
    </div>
  );
}
