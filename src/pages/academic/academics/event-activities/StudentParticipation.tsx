
import React, { useMemo, useState } from 'react';
import { Check, Download, Mail, Plus, Search, Trash2, Upload, Users, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  COMPETITION_EVENTS_STORAGE_KEY,
  COMPETITION_PARTICIPANTS_STORAGE_KEY,
  DEFAULT_COMPETITION_EVENTS,
  DEFAULT_COMPETITION_PARTICIPANTS,
  ELIGIBLE_CLASS_GROUPS,
  CompetitionEventRecord,
  CompetitionParticipantRecord,
  downloadCsv,
  getActiveCompetitionEvent,
  loadCompetitionCollection,
  saveCompetitionCollection,
  setActiveCompetitionEvent
} from './competitionData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}</label>;
}

function getEligibleClassGroup(className: string) {
  const grade = Number(className.match(/\d+/)?.[0] || 0);
  if (grade >= 1 && grade <= 5) return ELIGIBLE_CLASS_GROUPS[0];
  if (grade >= 6 && grade <= 8) return ELIGIBLE_CLASS_GROUPS[1];
  if (grade >= 9 && grade <= 10) return ELIGIBLE_CLASS_GROUPS[2];
  if (grade >= 11 && grade <= 12) return ELIGIBLE_CLASS_GROUPS[3];
  return '';
}

const statusVariant = (status: string): 'success' | 'warning' | 'danger' => status === 'Confirmed' ? 'success' : status === 'Rejected' ? 'danger' : 'warning';

export function StudentParticipation() {
  const [events] = useState<CompetitionEventRecord[]>(() => loadCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS));
  const [participants, setParticipants] = useState<CompetitionParticipantRecord[]>(() => loadCompetitionCollection(COMPETITION_PARTICIPANTS_STORAGE_KEY, DEFAULT_COMPETITION_PARTICIPANTS));
  const [selectedEventId, setSelectedEventId] = useState(() => getActiveCompetitionEvent() || DEFAULT_COMPETITION_EVENTS[0].id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState({ studentName: '', className: '10-A', rollNumber: '', attendance: 85, parentConsent: 'Awaiting' as 'Yes' | 'Awaiting' });
  const event = events.find((item) => item.id === selectedEventId) || events[0];

  const eventParticipants = useMemo(() => participants.filter((participant) => participant.eventId === event?.id), [participants, event?.id]);
  const visibleParticipants = useMemo(() => eventParticipants.filter((participant) => {
    const term = search.trim().toLowerCase();
    if (term && !`${participant.studentName} ${participant.className} ${participant.rollNumber}`.toLowerCase().includes(term)) return false;
    if (statusFilter !== 'All' && participant.registrationStatus !== statusFilter) return false;
    return true;
  }), [eventParticipants, search, statusFilter]);

  const classGroup = getEligibleClassGroup(draft.className);
  const classEligible = Boolean(event?.eligibleClasses.includes(classGroup));
  const attendanceEligible = Boolean(event && draft.attendance >= event.minimumAttendance);
  const disciplineEligible = true;
  const capacityAvailable = Boolean(event && eventParticipants.length < event.maxParticipants);
  const isEligible = classEligible && attendanceEligible && disciplineEligible && capacityAvailable;

  const persist = (next: CompetitionParticipantRecord[]) => {
    setParticipants(next);
    saveCompetitionCollection(COMPETITION_PARTICIPANTS_STORAGE_KEY, next);
  };

  const setEvent = (id: string) => {
    setSelectedEventId(id);
    setActiveCompetitionEvent(id);
  };

  const registerStudent = () => {
    if (!event || !draft.studentName.trim() || !isEligible) return;
    const participant: CompetitionParticipantRecord = {
      id: `part-${Date.now()}`,
      eventId: event.id,
      studentName: draft.studentName.trim(),
      className: draft.className,
      rollNumber: draft.rollNumber.trim() || '—',
      registrationStatus: draft.parentConsent === 'Yes' ? 'Confirmed' : 'Pending',
      parentConsent: draft.parentConsent,
      attendance: draft.attendance,
      disciplineClear: disciplineEligible
    };
    persist([participant, ...participants]);
    setShowRegister(false);
    setDraft({ studentName: '', className: '10-A', rollNumber: '', attendance: 85, parentConsent: 'Awaiting' });
    setMessage(`${participant.studentName} registered for ${event.name}.`);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const updateParticipant = (id: string, patch: Partial<CompetitionParticipantRecord>) => {
    persist(participants.map((participant) => participant.id === id ? { ...participant, ...patch } : participant));
  };

  const removeParticipant = (id: string) => {
    const removed = participants.find((participant) => participant.id === id);
    persist(participants.filter((participant) => participant.id !== id));
    setMessage(`${removed?.studentName || 'Student'} removed from this competition.`);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const importCsv = async (file?: File) => {
    if (!file || !event) return;
    try {
      const lines = (await file.text()).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (lines.length < 2) { setMessage('CSV has no student rows to import.'); return; }
      const headers = lines[0].split(',').map((value) => value.replace(/^\"|\"$/g, '').trim().toLowerCase());
      const nameIndex = headers.findIndex((value) => value.includes('name'));
      const classIndex = headers.findIndex((value) => value.includes('class'));
      const rollIndex = headers.findIndex((value) => value.includes('roll') || value.includes('admission'));
      if (nameIndex < 0 || classIndex < 0) { setMessage('CSV needs Name and Class columns; Roll No is optional.'); return; }
      const imported = lines.slice(1).map((line, index) => {
        const cells = line.split(',').map((value) => value.replace(/^\"|\"$/g, '').trim());
        const studentName = cells[nameIndex] || '';
        const className = cells[classIndex] || '';
        return { id: `part-import-${Date.now()}-${index}`, eventId: event.id, studentName, className, rollNumber: rollIndex >= 0 ? cells[rollIndex] || '—' : '—', registrationStatus: 'Pending' as const, parentConsent: 'Awaiting' as const, attendance: 0, disciplineClear: true };
      }).filter((participant) => participant.studentName && participant.className);
      persist([...imported, ...participants]);
      setMessage(`${imported.length} student row(s) imported as pending registrations.`);
    } catch {
      setMessage('Could not read the selected CSV file.');
    }
    window.setTimeout(() => setMessage(''), 4500);
  };

  const exportList = () => downloadCsv('competition-student-participation.csv', visibleParticipants.map((participant) => ({
    Student: participant.studentName, Class: participant.className, RollNo: participant.rollNumber,
    RegistrationStatus: participant.registrationStatus, ParentConsent: participant.parentConsent,
    Attendance: participant.attendance
  })));

  const notifyParents = () => {
    setMessage(`Parent notification queued for ${eventParticipants.length} student(s).`);
    window.setTimeout(() => setMessage(''), 3500);
  };

  if (!event) return <div className="p-6 text-sm text-slate-500">Create a competition event before managing student participation.</div>;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3"><div className="rounded-xl bg-violet-100 p-3 text-violet-700"><Users className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Competition Management</p><h1 className="text-2xl font-bold text-slate-900">Student Participation</h1><p className="mt-1 text-sm text-slate-500">Register eligible students, confirm parent consent, and track entries.</p></div></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={exportList}><Download className="h-4 w-4" />Export List</Button><Button onClick={() => { setDraft({ studentName: '', className: '10-A', rollNumber: '', attendance: 85, parentConsent: 'Awaiting' }); setShowRegister(true); }}><Plus className="h-4 w-4" />Register Student</Button></div>
      </div>

      <Card className="border-violet-200 bg-violet-50/50 p-4"><div className="grid gap-3 md:grid-cols-[1fr_2fr]"><Field label="Competition"><select className={inputClass} value={event.id} onChange={(change) => setEvent(change.target.value)}>{events.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.startDate || 'Date not set'}</option>)}</select></Field><div><p className="text-sm font-semibold text-violet-950">{event.name}</p><p className="mt-1 text-xs text-violet-800">{event.typeName} · {event.level} · {event.startDate ? new Date(`${event.startDate}T00:00:00`).toLocaleDateString('en-IN') : 'Date not set'} · Maximum {event.maxParticipants} students</p></div></div></Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
        { label: 'Registered', value: eventParticipants.length, tone: 'text-slate-900' },
        { label: 'Confirmed', value: eventParticipants.filter((participant) => participant.registrationStatus === 'Confirmed').length, tone: 'text-emerald-700' },
        { label: 'Rejected', value: eventParticipants.filter((participant) => participant.registrationStatus === 'Rejected').length, tone: 'text-rose-700' },
        { label: 'Pending', value: eventParticipants.filter((participant) => participant.registrationStatus === 'Pending').length, tone: 'text-amber-700' },
        { label: 'Vacant Slots', value: Math.max(0, event.maxParticipants - eventParticipants.length), tone: 'text-indigo-700' }
      ].map((stat) => <Card key={stat.label} className="p-4"><p className="text-xs font-medium text-slate-500">{stat.label}</p><p className={`mt-1 text-2xl font-bold ${stat.tone}`}>{stat.value}</p></Card>)}</div>

      {message && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card noPadding className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-9`} value={search} onChange={(change) => setSearch(change.target.value)} placeholder="Search student, class, or roll number…" /></div><select className={`${inputClass} lg:w-48`} value={statusFilter} onChange={(change) => setStatusFilter(change.target.value)}><option value="All">All Registration Statuses</option><option>Confirmed</option><option>Pending</option><option>Rejected</option></select><label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Upload className="h-4 w-4" />Bulk Import<input className="sr-only" type="file" accept=".csv,text/csv" onChange={(change) => { void importCsv(change.target.files?.[0]); change.target.value = ''; }} /></label><Button variant="outline" onClick={notifyParents}><Mail className="h-4 w-4" />Notify All Parents</Button></div>
        <div className="overflow-x-auto"><table className="min-w-[850px] w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Roll No.</th><th className="px-4 py-3">Registration Status</th><th className="px-4 py-3">Parent Consent</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleParticipants.map((participant, index) => <tr key={participant.id} className="hover:bg-violet-50/30"><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3 font-semibold text-slate-900">{participant.studentName}</td><td className="px-4 py-3">{participant.className}</td><td className="px-4 py-3 font-mono text-xs">{participant.rollNumber}</td><td className="px-4 py-3"><Badge variant={statusVariant(participant.registrationStatus)}>{participant.registrationStatus}</Badge></td><td className="px-4 py-3"><Badge variant={participant.parentConsent === 'Yes' ? 'success' : participant.parentConsent === 'No' ? 'danger' : 'warning'}>{participant.parentConsent}</Badge></td><td className="px-4 py-3">{participant.attendance}%</td><td className="px-4 py-3"><div className="flex justify-end gap-1">{participant.registrationStatus !== 'Confirmed' && <Button size="xs" variant="outline" title="Confirm registration" onClick={() => updateParticipant(participant.id, { registrationStatus: 'Confirmed', parentConsent: 'Yes' })}><Check className="h-3.5 w-3.5" />Confirm</Button>}{participant.registrationStatus === 'Rejected' && <Button size="xs" variant="ghost" onClick={() => updateParticipant(participant.id, { registrationStatus: 'Pending' })}>Review</Button>}<Button size="xs" variant="ghost" title="Remove student" onClick={() => removeParticipant(participant.id)}><Trash2 className="h-4 w-4 text-rose-600" /></Button></div></td></tr>)}{!visibleParticipants.length && <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">No student registrations match this view.</td></tr>}</tbody></table></div>
      </Card>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)} title="Register Student" size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowRegister(false)}><X className="h-4 w-4" />Cancel</Button><Button onClick={registerStudent} disabled={!draft.studentName.trim() || !isEligible}>Register Student</Button></div>}>
        <div className="space-y-4"><p className="text-sm text-slate-600">Add a student to <strong>{event.name}</strong>. Eligibility is checked against this event’s classes and attendance requirement.</p>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Student Name"><input className={inputClass} value={draft.studentName} onChange={(change) => setDraft((current) => ({ ...current, studentName: change.target.value }))} placeholder="Search by name or roll number" /></Field><Field label="Class"><select className={inputClass} value={draft.className} onChange={(change) => setDraft((current) => ({ ...current, className: change.target.value }))}>{['6-A', '7-A', '8-A', '9-A', '10-A', '10-B', '11-A', '12-B'].map((className) => <option key={className}>{className}</option>)}</select></Field><Field label="Roll No."><input className={inputClass} value={draft.rollNumber} onChange={(change) => setDraft((current) => ({ ...current, rollNumber: change.target.value }))} /></Field><Field label="Attendance (%)"><input type="number" min={0} max={100} className={inputClass} value={draft.attendance} onChange={(change) => setDraft((current) => ({ ...current, attendance: Number(change.target.value) }))} /></Field><Field label="Parent Consent"><select className={inputClass} value={draft.parentConsent} onChange={(change) => setDraft((current) => ({ ...current, parentConsent: change.target.value as 'Yes' | 'Awaiting' }))}><option>Awaiting</option><option>Yes</option></select></Field></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-bold text-slate-900">Eligibility Check</h3><ul className="mt-2 space-y-2 text-sm">{[
            { ok: classEligible, text: `Class ${draft.className} ${classEligible ? 'is eligible' : 'is not included in this event'}` },
            { ok: attendanceEligible, text: `Attendance ${draft.attendance}% · minimum ${event.minimumAttendance}%` },
            { ok: disciplineEligible, text: 'No disciplinary issue is recorded for this registration' },
            { ok: capacityAvailable, text: capacityAvailable ? `${Math.max(0, event.maxParticipants - eventParticipants.length)} slot(s) remain` : 'Maximum participants reached' }
          ].map((item) => <li key={item.text} className={`flex items-center gap-2 ${item.ok ? 'text-emerald-700' : 'text-rose-700'}`}><span aria-hidden="true">{item.ok ? '✓' : '✕'}</span>{item.text}</li>)}</ul></div>
        </div>
      </Modal>
    </div>
  );
}
