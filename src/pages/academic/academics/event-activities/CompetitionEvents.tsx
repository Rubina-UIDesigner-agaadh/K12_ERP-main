import React, { useMemo, useState } from 'react';
import { CalendarDays, Download, Eye, MapPin, Pencil, Plus, Search, Users, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  COMPETITION_EVENT_STATUSES,
  COMPETITION_EVENTS_STORAGE_KEY,
  COMPETITION_LEVELS,
  COMPETITION_TYPES_STORAGE_KEY,
  DEFAULT_COMPETITION_EVENTS,
  DEFAULT_COMPETITION_TYPES,
  ELIGIBLE_CLASS_GROUPS,
  CompetitionEventRecord,
  CompetitionTypeRecord,
  downloadCsv,
  loadCompetitionCollection,
  saveCompetitionCollection,
  setActiveCompetitionEvent
} from './competitionData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
const panelClass = 'rounded-xl border border-slate-200 bg-white p-4';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}</label>;
}

function formatDate(date: string, endDate?: string) {
  if (!date) return '—';
  const fmt = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return endDate ? `${fmt(date)} – ${fmt(endDate)}` : fmt(date);
}

const createEventDraft = (types: CompetitionTypeRecord[]): CompetitionEventRecord => {
  const type = types.find((item) => item.status === 'Active') || DEFAULT_COMPETITION_TYPES[0];
  return {
    ...DEFAULT_COMPETITION_EVENTS[0],
    id: `evt-${Date.now()}`,
    name: '',
    typeId: type.id,
    typeName: type.name,
    code: `COMP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
    academicYear: '2026-27',
    status: 'Planning',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    resultExpectedBy: '',
    venueName: '',
    venueAddress: '',
    coordinator: '',
    coCoordinator: '',
    subjects: [],
    topics: '',
    syllabusDocument: '',
    referenceMaterials: [],
    prizes: DEFAULT_COMPETITION_EVENTS[0].prizes.map((prize) => ({ ...prize }))
  };
};

const statusVariant = (status: string): 'info' | 'warning' | 'success' | 'danger' | 'default' => {
  if (status === 'Registration Open') return 'warning';
  if (status === 'Ongoing') return 'info';
  if (status === 'Completed') return 'success';
  if (status === 'Cancelled') return 'danger';
  return 'default';
};

export function CompetitionEvents() {
  const [events, setEvents] = useState<CompetitionEventRecord[]>(() => loadCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS));
  const [types] = useState<CompetitionTypeRecord[]>(() => loadCompetitionCollection(COMPETITION_TYPES_STORAGE_KEY, DEFAULT_COMPETITION_TYPES));
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [form, setForm] = useState<CompetitionEventRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<CompetitionEventRecord | null>(null);
  const [message, setMessage] = useState('');

  const filteredEvents = useMemo(() => events.filter((event) => {
    const term = appliedSearch.trim().toLowerCase();
    if (term && !`${event.name} ${event.typeName} ${event.code} ${event.venueName}`.toLowerCase().includes(term)) return false;
    if (typeFilter !== 'All' && event.typeId !== typeFilter) return false;
    if (levelFilter !== 'All' && event.level !== levelFilter) return false;
    if (statusFilter !== 'All' && event.status !== statusFilter) return false;
    if (fromDate && event.startDate < fromDate) return false;
    if (toDate && event.startDate > toDate) return false;
    if (classFilter !== 'All' && !event.eligibleClasses.includes(classFilter)) return false;
    if (monthFilter !== 'All' && event.startDate.slice(5, 7) !== monthFilter) return false;
    return true;
  }), [events, appliedSearch, typeFilter, levelFilter, statusFilter, fromDate, toDate, classFilter, monthFilter]);

  function updateForm<K extends keyof CompetitionEventRecord>(key: K, value: CompetitionEventRecord[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  const persist = (next: CompetitionEventRecord[]) => {
    setEvents(next);
    saveCompetitionCollection(COMPETITION_EVENTS_STORAGE_KEY, next);
  };

  const resetFilters = () => {
    setSearch(''); setAppliedSearch(''); setTypeFilter('All'); setLevelFilter('All'); setStatusFilter('All'); setFromDate(''); setToDate(''); setClassFilter('All'); setMonthFilter('All');
  };

  const saveEvent = () => {
    if (!form || !form.name.trim() || !form.startDate) {
      setMessage('Enter a competition name and date before saving.');
      return;
    }
    const normalized = { ...form, name: form.name.trim() };
    const next = events.some((event) => event.id === normalized.id)
      ? events.map((event) => event.id === normalized.id ? normalized : event)
      : [normalized, ...events];
    persist(next);
    setForm(null);
    setMessage(`“${normalized.name}” saved.`);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const exportEvents = () => downloadCsv('competition-events.csv', filteredEvents.map((event) => ({
    Name: event.name, Type: event.typeName, Level: event.level, Date: event.startDate, EndDate: event.endDate,
    Venue: event.venueName, Status: event.status, AcademicYear: event.academicYear, Code: event.code
  })));

  const selectForFollowUp = (event: CompetitionEventRecord, page: 'students' | 'results') => {
    setActiveCompetitionEvent(event.id);
    setMessage(`${event.name} selected. Open ${page === 'students' ? 'Student Participation' : 'Results & Achievements'} from the Competition Management sidebar section.`);
    window.setTimeout(() => setMessage(''), 4500);
  };

  const toggleFormArray = (key: 'eligibleClasses' | 'subjects' | 'notifyChannels', value: string) => {
    setForm((current) => current ? {
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value]
    } : current);
  };

  const addPrize = () => setForm((current) => current ? { ...current, prizes: [...current.prizes, { rank: '', award: '', cashPrize: 0, certificate: true, trophy: false }] } : current);
  function updatePrize<K extends 'rank' | 'award' | 'cashPrize' | 'certificate' | 'trophy>(index: number, field: K, value: CompetitionEventRecord['prizes'][number][K]) {
    setForm((current) => current ? { ...current, prizes: current.prizes.map((prize, prizeIndex) => prizeIndex === index ? { ...prize, [field]: value } : prize) } : current);
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3"><div className="rounded-xl bg-indigo-100 p-3 text-indigo-700"><CalendarDays className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Competition Management</p><h1 className="text-2xl font-bold text-slate-900">Competition Events</h1><p className="mt-1 text-sm text-slate-500">Schedule, manage, and track individual competition occurrences.</p></div></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={exportEvents}><Download className="h-4 w-4" />Export</Button><Button onClick={() => { setForm(createEventDraft(types)); setMessage(''); }}><Plus className="h-4 w-4" />Create Competition Event</Button></div>
      </div>

      {message && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card className="border-slate-200 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Competition name or type…" /></div></Field>
          <Field label="Competition Type"><select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="All">All Types</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></Field>
          <Field label="Level"><select className={inputClass} value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}><option value="All">All Levels</option>{COMPETITION_LEVELS.map((level) => <option key={level}>{level}</option>)}</select></Field>
          <Field label="Status"><select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All Statuses</option>{COMPETITION_EVENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></Field>
          <Field label="From date"><input type="date" className={inputClass} value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></Field>
          <Field label="To date"><input type="date" className={inputClass} value={toDate} onChange={(event) => setToDate(event.target.value)} /></Field>
          <Field label="Eligible Class"><select className={inputClass} value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="All">All Classes</option>{ELIGIBLE_CLASS_GROUPS.map((classGroup) => <option key={classGroup}>{classGroup}</option>)}</select></Field>
          <Field label="Month"><select className={inputClass} value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}><option value="All">All Months</option>{Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((month) => <option key={month} value={month}>{new Date(2025, Number(month) - 1, 1).toLocaleString('en', { month: 'long' })}</option>)}</select></Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"><Button size="sm" onClick={() => setAppliedSearch(search)}><Search className="h-4 w-4" />Search</Button><Button size="sm" variant="outline" onClick={resetFilters}><X className="h-4 w-4" />Reset</Button><span className="ml-auto text-xs text-slate-500">{filteredEvents.length} event(s)</span></div>
      </Card>

      <Card noPadding className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><h2 className="font-semibold text-slate-900">Competition Events List</h2><span className="text-xs text-slate-500">Dates and status update with each event</span></div>
        <div className="overflow-x-auto"><table className="min-w-[1120px] w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Competition Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Date(s)</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filteredEvents.map((event, index) => <tr key={event.id} className="hover:bg-indigo-50/30">
            <td className="px-4 py-3 text-slate-400">{index + 1}</td>
            <td className="px-4 py-3"><div className="font-semibold text-slate-900">{event.name}</div><div className="font-mono text-[10px] text-slate-500">{event.code} · {event.academicYear}</div></td>
            <td className="px-4 py-3 text-slate-700">{event.typeName}</td><td className="px-4 py-3 text-slate-600">{event.level}</td><td className="px-4 py-3 whitespace-nowrap">{formatDate(event.startDate, event.isMultiDay ? event.endDate : '')}</td>
            <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-slate-600"><MapPin className="h-3.5 w-3.5" />{event.venueName || event.venueMode}</span></td>
            <td className="px-4 py-3"><Badge variant={statusVariant(event.status)}>{event.status}</Badge></td>
            <td className="px-4 py-3"><div className="flex items-center gap-1"><Button size="xs" variant="ghost" title="View event" onClick={() => setViewRecord(event)}><Eye className="h-4 w-4" /></Button><Button size="xs" variant="ghost" title="Edit event" onClick={() => { setForm({ ...event, eligibleClasses: [...event.eligibleClasses], subjects: [...event.subjects], notifyChannels: [...event.notifyChannels], prizes: event.prizes.map((prize) => ({ ...prize })) }); setMessage(''); }}><Pencil className="h-4 w-4" /></Button><Button size="xs" variant="outline" onClick={() => selectForFollowUp(event, 'students')}><Users className="h-3.5 w-3.5" />Students</Button><Button size="xs" variant="outline" onClick={() => selectForFollowUp(event, 'results')}>Results</Button></div></td>
          </tr>)}
          {!filteredEvents.length && <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">No events match the selected filters.</td></tr>}</tbody>
        </table></div>
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">Status: Planning · Registration Open · Registration Closed · Ongoing · Completed · Cancelled</div>
      </Card>

      <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form?.id && events.some((event) => event.id === form.id) ? 'Edit Competition Event' : 'Create Competition Event'} size="xl" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}><X className="h-4 w-4" />Cancel</Button><Button onClick={saveEvent}>Save Competition Event</Button></div>}>
        {form && <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          <p className="text-xs text-slate-500">Create an event occurrence from an active Competition Master type. Event settings may override the type defaults.</p>
          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 1 · Competition Identity</h3><div className="grid gap-3 md:grid-cols-2">
            <Field label="Competition Name *"><input className={inputClass} value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="District Science Olympiad 2026" /></Field>
            <Field label="Competition Type"><select className={inputClass} value={form.typeId} onChange={(event) => { const selected = types.find((type) => type.id === event.target.value); setForm((current) => current ? { ...current, typeId: event.target.value, typeName: selected?.name || '' } : current); }}>{types.map((type) => <option key={type.id} value={type.id}>{type.name}{type.status === 'Inactive' ? ' (Inactive)' : ''}</option>)}</select></Field>
            <Field label="Competition Code · auto-generated"><input className={`${inputClass} bg-slate-50 font-mono`} readOnly value={form.code} /></Field>
            <Field label="Academic Year"><input className={`${inputClass} bg-slate-50`} value={form.academicYear} readOnly /></Field>
            <Field label="Status"><select className={inputClass} value={form.status} onChange={(event) => updateForm('status', event.target.value as CompetitionEventRecord['status'])}>{COMPETITION_EVENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></Field>
            <Field label="Competition Level"><select className={inputClass} value={form.level} onChange={(event) => updateForm('level', event.target.value)}>{COMPETITION_LEVELS.map((level) => <option key={level}>{level}</option>)}</select></Field>
          </div></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 2 · Dates & Venue</h3><div className="grid gap-3 md:grid-cols-2">
            <Field label="Competition Date"><input type="date" className={inputClass} value={form.startDate} onChange={(event) => updateForm('startDate', event.target.value)} /></Field>
            <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={form.isMultiDay} onChange={(event) => updateForm('isMultiDay', event.target.checked)} />Multi-day competition</label>
            {form.isMultiDay && <Field label="To Date"><input type="date" className={inputClass} value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} /></Field>}
            <div className="grid grid-cols-2 gap-3"><Field label="From"><input type="time" className={inputClass} value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} /></Field><Field label="To"><input type="time" className={inputClass} value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} /></Field></div>
            <Field label="Registration Deadline"><input type="date" className={inputClass} value={form.registrationDeadline} onChange={(event) => updateForm('registrationDeadline', event.target.value)} /></Field>
            <Field label="Result Expected By"><input type="date" className={inputClass} value={form.resultExpectedBy} onChange={(event) => updateForm('resultExpectedBy', event.target.value)} /></Field>
            <Field label="Organized By"><select className={inputClass} value={form.organizerMode} onChange={(event) => updateForm('organizerMode', event.target.value as CompetitionEventRecord['organizerMode'])}><option>External Body</option><option>Our School</option><option>Joint</option></select></Field>
            <Field label="Organizing Body"><input className={inputClass} value={form.organizingBody} onChange={(event) => updateForm('organizingBody', event.target.value)} placeholder="District Education Office" /></Field>
            <Field label="Organizing Body Contact"><input className={inputClass} value={form.organizingContact} onChange={(event) => updateForm('organizingContact', event.target.value)} placeholder="Contact person and phone" /></Field>
            <Field label="Venue Type"><select className={inputClass} value={form.venueMode} onChange={(event) => updateForm('venueMode', event.target.value as CompetitionEventRecord['venueMode'])}><option>External Venue</option><option>Our School</option></select></Field>
            <Field label="Venue Name"><input className={inputClass} value={form.venueName} onChange={(event) => updateForm('venueName', event.target.value)} placeholder="Auditorium / external venue" /></Field>
            <Field label="Venue Address"><input className={inputClass} value={form.venueAddress} onChange={(event) => updateForm('venueAddress', event.target.value)} /></Field>
            <Field label="Google Maps URL"><input className={inputClass} value={form.mapsUrl} onChange={(event) => updateForm('mapsUrl', event.target.value)} placeholder="https://maps.google.com/?q=…" /></Field>
          </div></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 3 · Eligibility</h3><div className="grid gap-3 md:grid-cols-2">
            <div><span className={labelClass}>Eligible Classes</span><div className="grid gap-2 sm:grid-cols-2">{ELIGIBLE_CLASS_GROUPS.map((classGroup) => <label key={classGroup} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={form.eligibleClasses.includes(classGroup)} onChange={() => toggleFormArray('eligibleClasses', classGroup)} />{classGroup}</label>)}</div></div>
            <div className="space-y-3"><Field label="Eligible Gender"><select className={inputClass} value={form.eligibleGender} onChange={(event) => updateForm('eligibleGender', event.target.value as CompetitionEventRecord['eligibleGender'])}><option>All</option><option>Boys only</option><option>Girls only</option></select></Field><Field label="Participation Type"><select className={inputClass} value={form.participationMode} onChange={(event) => updateForm('participationMode', event.target.value as CompetitionEventRecord['participationMode'])}><option>Individual</option><option>Team</option><option>Both</option></select></Field><div className="grid grid-cols-2 gap-3"><Field label="Maximum Participants"><input type="number" min={1} className={inputClass} value={form.maxParticipants} onChange={(event) => updateForm('maxParticipants', Number(event.target.value))} /></Field><Field label="Per Class Limit"><input type="number" min={0} className={inputClass} value={form.perClassLimit} onChange={(event) => updateForm('perClassLimit', Number(event.target.value))} /></Field></div><Field label="Minimum Attendance (%)"><input type="number" min={0} max={100} className={inputClass} value={form.minimumAttendance} onChange={(event) => updateForm('minimumAttendance', Number(event.target.value))} /></Field></div>
          </div></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 4 · School Coordinator</h3><div className="grid gap-3 md:grid-cols-2"><Field label="School Coordinator"><input className={inputClass} value={form.coordinator} onChange={(event) => updateForm('coordinator', event.target.value)} placeholder="Staff name / department" /></Field><Field label="Co-coordinator"><input className={inputClass} value={form.coCoordinator} onChange={(event) => updateForm('coCoordinator', event.target.value)} /></Field><Field label="Coordinator Responsibilities"><textarea className={`${inputClass} min-h-20`} value={form.coordinatorResponsibilities} onChange={(event) => updateForm('coordinatorResponsibilities', event.target.value)} placeholder="Shortlist, prepare, register and accompany students…" /></Field><Field label="Accompanying Teachers · comma separated"><input className={inputClass} value={form.accompanyingTeachers.join(', ')} onChange={(event) => updateForm('accompanyingTeachers', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></Field></div></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 5 · Subjects & Topics</h3><div className="grid gap-3 md:grid-cols-2"><div><span className={labelClass}>Subjects Covered</span><div className="grid grid-cols-2 gap-2">{['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Technology', 'General Knowledge'].map((subject) => <label key={subject} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={form.subjects.includes(subject)} onChange={() => toggleFormArray('subjects', subject)} />{subject}</label>)}</div></div><div className="space-y-3"><Field label="Topics / Syllabus"><textarea className={`${inputClass} min-h-20`} value={form.topics} onChange={(event) => updateForm('topics', event.target.value)} /></Field><Field label="Syllabus Document"><input className={inputClass} type="file" onChange={(event) => updateForm('syllabusDocument', event.target.files?.[0]?.name || '')} /></Field><Field label="Reference Materials · links separated by commas"><input className={inputClass} value={form.referenceMaterials.join(', ')} onChange={(event) => updateForm('referenceMaterials', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></Field></div></div></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 6 · Registration & Fee</h3><div className="grid gap-3 md:grid-cols-2"><Field label="External Registration Required"><select className={inputClass} value={String(form.externalRegistrationRequired)} onChange={(event) => updateForm('externalRegistrationRequired', event.target.value === 'true')}><option value="true">Yes — submit to organizer</option><option value="false">No</option></select></Field><Field label="Registration Portal"><input className={inputClass} value={form.registrationPortal} onChange={(event) => updateForm('registrationPortal', event.target.value)} placeholder="https://…" /></Field><Field label="Registration Fee"><select className={inputClass} value={String(form.feeRequired)} onChange={(event) => updateForm('feeRequired', event.target.value === 'true')}><option value="false">No — free</option><option value="true">Yes</option></select></Field>{form.feeRequired && <Field label="Fee per Student (₹)"><input type="number" min={0} className={inputClass} value={form.registrationFee} onChange={(event) => updateForm('registrationFee', Number(event.target.value))} /></Field>}<Field label="Who Pays"><select className={inputClass} value={form.feePayer} onChange={(event) => updateForm('feePayer', event.target.value as CompetitionEventRecord['feePayer'])}><option>Student</option><option>School</option><option>Shared</option></select></Field></div></section>

          <section className={panelClass}><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">Panel 7 · Prizes & Awards</h3><Button size="xs" variant="outline" onClick={addPrize}><Plus className="h-3.5 w-3.5" />Add Prize Level</Button></div><div className="space-y-2">{form.prizes.map((prize, index) => <div key={`${prize.rank}-${index}`} className="grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-[0.7fr_1.5fr_0.8fr_0.8fr_0.8fr]"><Field label="Rank"><input className={inputClass} value={prize.rank} onChange={(event) => updatePrize(index, 'rank', event.target.value)} /></Field><Field label="Prize / Award"><input className={inputClass} value={prize.award} onChange={(event) => updatePrize(index, 'award', event.target.value)} /></Field><Field label="Cash Prize (₹)"><input type="number" min={0} className={inputClass} value={prize.cashPrize} onChange={(event) => updatePrize(index, 'cashPrize', Number(event.target.value))} /></Field><label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs"><input type="checkbox" checked={prize.certificate} onChange={(event) => updatePrize(index, 'certificate', event.target.checked)} />Certificate</label><label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs"><input type="checkbox" checked={prize.trophy} onChange={(event) => updatePrize(index, 'trophy', event.target.checked)} />Trophy</label></div>)}</div><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4"><Field label="1st Place Points"><input type="number" className={inputClass} value={form.housePointsFirst} onChange={(event) => updateForm('housePointsFirst', Number(event.target.value))} /></Field><Field label="2nd Place Points"><input type="number" className={inputClass} value={form.housePointsSecond} onChange={(event) => updateForm('housePointsSecond', Number(event.target.value))} /></Field><Field label="3rd Place Points"><input type="number" className={inputClass} value={form.housePointsThird} onChange={(event) => updateForm('housePointsThird', Number(event.target.value))} /></Field><Field label="Participation Points"><input type="number" className={inputClass} value={form.housePointsParticipation} onChange={(event) => updateForm('housePointsParticipation', Number(event.target.value))} /></Field></div><label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={form.housePointsEnabled} onChange={(event) => updateForm('housePointsEnabled', event.target.checked)} />Award house points based on results</label></section>

          <section className={panelClass}><h3 className="mb-3 text-sm font-bold text-slate-900">Panel 8 · Notifications</h3><div className="grid gap-3 md:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.notifyParents} onChange={(event) => updateForm('notifyParents', event.target.checked)} />Notify parents of selected students</label><div><span className={labelClass}>Notify via</span><div className="flex flex-wrap gap-2">{['SMS', 'Email', 'Parent Portal', 'App Notification'].map((channel) => <label key={channel} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={form.notifyChannels.includes(channel)} onChange={() => toggleFormArray('notifyChannels', channel)} />{channel}</label>)}</div></div><label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.attachCircular} onChange={(event) => updateForm('attachCircular', event.target.checked)} />Attach circular to notification</label><label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.postNoticeBoard} onChange={(event) => updateForm('postNoticeBoard', event.target.checked)} />Post on school notice board</label><label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.postParentPortal} onChange={(event) => updateForm('postParentPortal', event.target.checked)} />Post on parent portal</label></div></section>
        </div>}
      </Modal>

      <Modal isOpen={Boolean(viewRecord)} onClose={() => setViewRecord(null)} title={viewRecord?.name || 'Competition Details'} size="lg">
        {viewRecord && <div className="space-y-4 text-sm"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Type / Level</span><p className="mt-1 font-semibold">{viewRecord.typeName} · {viewRecord.level}</p></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Date / Status</span><p className="mt-1 font-semibold">{formatDate(viewRecord.startDate, viewRecord.endDate)} · {viewRecord.status}</p></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Venue</span><p className="mt-1 font-semibold">{viewRecord.venueName || viewRecord.venueMode}</p></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Registration / Limit</span><p className="mt-1 font-semibold">{viewRecord.registrationDeadline || 'No deadline'} · {viewRecord.maxParticipants} students</p></div></div><div className="flex justify-end"><Button variant="outline" onClick={() => { const record = viewRecord; setViewRecord(null); setForm({ ...record, prizes: record.prizes.map((prize) => ({ ...prize })) }); }}>Edit Event</Button></div></div>}
      </Modal>
    </div>
  );
}
