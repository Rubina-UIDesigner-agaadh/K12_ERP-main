import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, ImageIcon, MapPin, Pencil, Plus, Search, Star, Trash2, Users, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  DEFAULT_EVENT_TYPES,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_STATUSES,
  SCHOOL_EVENTS_STORAGE_KEY,
  EVENT_TYPES_STORAGE_KEY as TYPES_KEY,
  EventBudgetItem,
  EventGuest,
  EventPreparationDay,
  EventProgramItem,
  EventResponsibility,
  EventTypeRecord,
  SchoolEventRecord,
  createEventId,
  DEFAULT_EVENT_REVIEWS,
  EVENT_REVIEWS_STORAGE_KEY,
  EventReviewRecord,
  createBlankSchoolEvent,
  createEmptyReview,
  downloadEventCsv,
  loadEventCollection,
  saveEventCollection,
  setActiveSchoolEvent
} from './eventData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
const resourceOptions = ['Projector / Screen', 'Sound System', 'Microphones (5)', 'Stage Lighting', 'Backdrop / Banner', 'Podium', 'Chairs for Audience', 'Reserved VIP Seating', 'Live Streaming Setup', 'Decorations', 'Red Carpet', 'Photo Booth'];
const venueOptions = ['Main Auditorium', 'School Ground', 'School Hall', 'All Rooms', 'Classrooms', 'Library', 'Medical Room', 'Off-campus', 'Other'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}</label>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white"><h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">{title}</h3><div className="space-y-4 p-4">{children}</div></section>;
}

function MultiSelect({ label, options, values, onChange }: { label: string; options: string[]; values: string[]; onChange: (next: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <p className={labelClass}>{label}</p>
      <button type="button" className={`${inputClass} flex items-center justify-between gap-2 text-left`} onClick={() => setOpen((current) => !current)}>
        <span className={values.length ? 'truncate text-slate-800' : 'truncate text-slate-400'}>{values.length ? values.join(', ') : `Select ${label.toLowerCase()}`}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-indigo-50">
              <input type="checkbox" checked={values.includes(option)} onChange={() => onChange(values.includes(option) ? values.filter((item) => item !== option) : [...values, option])} />
              {option}
            </label>
          ))}
        </div>
      )}
      <p className="mt-1 text-[11px] text-slate-500">{values.length} selected</p>
    </div>
  );
}
const branchAudienceOptions = ['Main Campus', 'North Campus', 'South Campus', 'East Campus', 'West Campus'];
const classAudienceOptions = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`);
const divisionAudienceOptions = ['A', 'B', 'C', 'D'];
const studentAudienceOptions = ['Arjun Sharma', 'Priya Patel', 'Rohan Mehta', 'Ananya Singh', 'Vikram Reddy', 'Sneha Gupta', 'Rahul Kumar', 'Kavya Nair'];
const staffAudienceOptions = ['Mrs. P. Gupta', 'Mr. V. Patel', 'Ms. M. Verma', 'Mr. H. Nair', 'Ms. K. Singh', 'Mrs. A. Roy'];
const parentAudienceOptions = ['All Parents', 'Class Parents', 'Selected Parents', 'PTA Members'];

const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  if (status === 'Completed' || status === 'Approved') return 'success';
  if (status === 'Planning' || status === 'Pending Approval') return 'warning';
  if (status === 'In Progress') return 'info';
  if (status === 'Cancelled') return 'danger';
  return 'default';
};
const showDate = (date: string, endDate?: string) => {
  if (!date) return '—';
  const format = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  return endDate ? `${format(date)} – ${format(endDate)}` : format(date);
};


function EventFeedbackPanel({ event, reviews, setReviews }: { event: SchoolEventRecord; reviews: EventReviewRecord[]; setReviews: React.Dispatch<React.SetStateAction<EventReviewRecord[]>> }) {
  const review = reviews.find((item) => item.eventId === event.id) || createEmptyReview(event.id);
  const persist = (updated: EventReviewRecord) => {
    const next = reviews.some((item) => item.eventId === updated.eventId) ? reviews.map((item) => item.eventId === updated.eventId ? updated : item) : [...reviews, updated];
    setReviews(next);
    saveEventCollection(EVENT_REVIEWS_STORAGE_KEY, next);
  };
  const update = (patch: Partial<EventReviewRecord>) => persist({ ...review, ...patch });
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label><span className={labelClass}>Overall rating</span>
          <select className={inputClass} value={review.rating} onChange={(event) => update({ rating: Number(event.target.value) })}>
            {[0, 1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating ? `${rating} / 5` : 'Not rated'}</option>)}
          </select>
          <div className="mt-2 flex gap-1 text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(review.rating) ? 'fill-current' : ''}`} />)}</div>
        </label>
        <label><span className={labelClass}>Actual students</span><input type="number" min={0} className={inputClass} value={review.actualStudents} onChange={(event) => update({ actualStudents: Number(event.target.value) })} /></label>
        <label><span className={labelClass}>Actual staff</span><input type="number" min={0} className={inputClass} value={review.actualStaff} onChange={(event) => update({ actualStaff: Number(event.target.value) })} /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block"><span className={labelClass}>What went well</span><textarea className={`${inputClass} min-h-24`} value={review.whatWentWell} onChange={(event) => update({ whatWentWell: event.target.value })} /></label>
        <label className="block"><span className={labelClass}>What to improve</span><textarea className={`${inputClass} min-h-24`} value={review.improvements} onChange={(event) => update({ improvements: event.target.value })} /></label>
        <label className="block"><span className={labelClass}>Suggestions</span><textarea className={`${inputClass} min-h-24`} value={review.suggestions} onChange={(event) => update({ suggestions: event.target.value })} /></label>
      </div>
      <label className="block"><span className={labelClass}>Feedback summary</span><input className={inputClass} value={review.feedbackSummary} onChange={(event) => update({ feedbackSummary: event.target.value })} placeholder="Parent / staff feedback notes" /></label>
      <div className="flex justify-end"><Button onClick={() => { persist({ ...review, reviewStatus: 'Saved' }); }}>Save feedback</Button></div>
    </div>
  );
}

export function EventPlanningSchedule() {
  const [events, setEvents] = useState<SchoolEventRecord[]>(() => loadEventCollection(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS));
  const [types] = useState<EventTypeRecord[]>(() => loadEventCollection(TYPES_KEY, DEFAULT_EVENT_TYPES));
  const [search, setSearch] = useState('');
  const [workspace, setWorkspace] = useState<{ eventId: string; mode: 'duties' | 'gallery' | 'feedback' } | null>(null);
  const [reviews, setReviews] = useState<EventReviewRecord[]>(() => loadEventCollection(EVENT_REVIEWS_STORAGE_KEY, DEFAULT_EVENT_REVIEWS));
  const [monthFilter, setMonthFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [calendarView, setCalendarView] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 2, 1));
  const [form, setForm] = useState<SchoolEventRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<SchoolEventRecord | null>(null);
  const [message, setMessage] = useState('');

  const typeById = useMemo(() => {
    const result = new Map<string, EventTypeRecord>();
    types.forEach((type) => result.set(type.id, type));
    return result;
  }, [types]);
  const filteredEvents = useMemo(() => events.filter((event) => {
    const type = typeById.get(event.typeId);
    const term = search.trim().toLowerCase();
    if (term && !`${event.name} ${event.typeName} ${event.code} ${event.venueName}`.toLowerCase().includes(term)) return false;
    if (statusFilter !== 'All' && event.status !== statusFilter) return false;
    if (monthFilter !== 'All' && event.date.slice(5, 7) !== monthFilter) return false;
    if (classFilter !== 'All' && type && !type.appliesToAllClasses && !type.classes.includes(classFilter)) return false;
    return true;
  }), [events, typeById, search, statusFilter, monthFilter, classFilter]);

  const persistEvents = (next: SchoolEventRecord[]) => {
    setEvents(next);
    saveEventCollection(SCHOOL_EVENTS_STORAGE_KEY, next);
  };
  function updateForm<K extends keyof SchoolEventRecord>(key: K, value: SchoolEventRecord[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }
  const toggleArray = (key: 'resources' | 'notifyVia' | 'postOn', value: string) => setForm((current) => current ? {
    ...current,
    [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value]
  } : current);
  const createNew = () => {
    setForm(createBlankSchoolEvent());
  };
  const editEvent = (event: SchoolEventRecord) => {
    setForm({ ...event, preparationDays: event.preparationDays.map((item) => ({ ...item })), programItems: event.programItems.map((item) => ({ ...item })), guests: event.guests.map((item) => ({ ...item })), responsibilities: event.responsibilities.map((item) => ({ ...item })), resources: [...event.resources], budgetItems: event.budgetItems.map((item) => ({ ...item })), notifyVia: [...event.notifyVia], postOn: [...event.postOn], audienceBranches: [...(event.audienceBranches || [])], audienceClasses: [...(event.audienceClasses || [])], audienceDivisions: [...(event.audienceDivisions || [])], audienceStudents: [...(event.audienceStudents || [])], audienceStaff: [...(event.audienceStaff || [])], audienceParents: [...(event.audienceParents || [])], galleryItems: (event.galleryItems || []).map((item) => ({ ...item })) });
  };
  const addPreparationDay = () => setForm((current) => current ? { ...current, preparationDays: [...current.preparationDays, { id: createEventId('prep'), kind: 'Rehearsal', date: '', activity: '', venue: current.venueName }] } : current);
  const updatePreparationDay = (id: string, patch: Partial<EventPreparationDay>) => setForm((current) => current ? { ...current, preparationDays: current.preparationDays.map((item) => item.id === id ? { ...item, ...patch } : item) } : current);
  const removePreparationDay = (id: string) => setForm((current) => current ? { ...current, preparationDays: current.preparationDays.filter((item) => item.id !== id) } : current);
  const addProgramItem = () => setForm((current) => current ? { ...current, programItems: [...current.programItems, { id: createEventId('agenda'), time: '', item: '', participants: '', actualTime: '', status: 'Upcoming' }] } : current);
  const updateProgramItem = (id: string, patch: Partial<EventProgramItem>) => setForm((current) => current ? { ...current, programItems: current.programItems.map((item) => item.id === id ? { ...item, ...patch } : item) } : current);
  const removeProgramItem = (id: string) => setForm((current) => current ? { ...current, programItems: current.programItems.filter((item) => item.id !== id) } : current);
  const moveProgram = (index: number, direction: -1 | 1) => setForm((current) => {
    if (!current) return current;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.programItems.length) return current;
    const programItems = [...current.programItems];
    [programItems[index], programItems[nextIndex]] = [programItems[nextIndex], programItems[index]];
    return { ...current, programItems };
  });
  const addGuest = () => setForm((current) => current ? { ...current, guests: [...current.guests, { id: createEventId('guest'), name: '', designation: '', contact: '', invitationSent: false, response: 'Awaiting' }] } : current);
  const updateGuest = (id: string, patch: Partial<EventGuest>) => setForm((current) => current ? { ...current, guests: current.guests.map((guest) => guest.id === id ? { ...guest, ...patch } : guest) } : current);
  const removeGuest = (id: string) => setForm((current) => current ? { ...current, guests: current.guests.filter((guest) => guest.id !== id) } : current);
  const addResponsibility = () => setForm((current) => current ? { ...current, responsibilities: [...current.responsibilities, { id: createEventId('role'), role: '', assignedTo: '' }] } : current);
  const updateResponsibility = (id: string, patch: Partial<EventResponsibility>) => setForm((current) => current ? { ...current, responsibilities: current.responsibilities.map((item) => item.id === id ? { ...item, ...patch } : item) } : current);
  const removeResponsibility = (id: string) => setForm((current) => current ? { ...current, responsibilities: current.responsibilities.filter((item) => item.id !== id) } : current);
  const addBudgetItem = () => setForm((current) => current ? { ...current, budgetItems: [...current.budgetItems, { id: createEventId('budget'), item: '', estimatedCost: 0, actualCost: null, vendor: '' }] } : current);
  const updateBudgetItem = (id: string, patch: Partial<EventBudgetItem>) => setForm((current) => current ? { ...current, budgetItems: current.budgetItems.map((item) => item.id === id ? { ...item, ...patch } : item) } : current);
  const removeBudgetItem = (id: string) => setForm((current) => current ? { ...current, budgetItems: current.budgetItems.filter((item) => item.id !== id) } : current);

  const saveEvent = (submitForApproval = false, addToCalendar = false) => {
    if (!form || !form.name.trim()) { setMessage('Enter an event name before saving.'); return; }
    if (!form.date) { setMessage('Choose the event date before saving.'); return; }
    const saved: SchoolEventRecord = {
      ...form,
      name: form.name.trim(),
      code: form.code || `EVT-${form.academicYear}-${Date.now().toString().slice(-3)}`,
      status: submitForApproval ? 'Pending Approval' : form.status,
      principalApprovalStatus: submitForApproval ? 'Pending Approval' : form.principalApprovalStatus,
      postOn: addToCalendar && !form.postOn.includes('Institute Calendar') ? [...form.postOn, 'Institute Calendar'] : form.postOn
    };
    const next = events.some((event) => event.id === saved.id) ? events.map((event) => event.id === saved.id ? saved : event) : [saved, ...events];
    persistEvents(next);
    setActiveSchoolEvent(saved.id);
    setForm(null);
    setMessage(submitForApproval ? `“${saved.name}” submitted for approval.` : addToCalendar ? `“${saved.name}” saved and added to the Institute Calendar.` : `“${saved.name}” saved.`);
    window.setTimeout(() => setMessage(''), 3500);
  };
  const exportEvents = () => downloadEventCsv('school-events.csv', filteredEvents.map((event) => ({
    Name: event.name, Type: event.typeName, Category: typeById.get(event.typeId)?.category || 'Other', Date: event.date, EndDate: event.endDate, Venue: event.venueName,
    Status: event.status, AcademicYear: event.academicYear, ExpectedAttendance: event.expectedAttendance, Code: event.code
  })));
  const followUp = (event: SchoolEventRecord, section: 'duties' | 'gallery' | 'feedback') => {
    setActiveSchoolEvent(event.id);
    setWorkspace({ eventId: event.id, mode: section });
    setMessage('');
  };
  const workspaceEvent = events.find((event) => event.id === workspace?.eventId) || null;
  const patchWorkspaceEvent = (patch: Partial<SchoolEventRecord>) => {
    if (!workspaceEvent) return;
    persistEvents(events.map((event) => event.id === workspaceEvent.id ? { ...event, ...patch } : event));
  };
  const monthName = calendarMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const calendarDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarOffset = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const totalEstimatedBudget = form?.budgetItems.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0) || 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Planning</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Event Planning &amp; Schedule</h1><p className="mt-1 max-w-3xl text-sm text-slate-500">Schedule school events, coordinate the program and manage approvals, resources, communication and budgets.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportEvents}>Export</Button><Button variant={calendarView ? 'secondary' : 'outline'} leftIcon={<CalendarDays className="h-4 w-4" />} onClick={() => setCalendarView((value) => !value)}>{calendarView ? 'List View' : 'Calendar View'}</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={createNew}>Create Event</Button></div></div>
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      {!workspace && <Card noPadding className="overflow-hidden">
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5"><div className="relative xl:col-span-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-9`} placeholder="Search event, code or venue..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className={inputClass} value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}><option value="All">Month: All</option>{Array.from({ length: 12 }, (_, index) => <option key={index} value={String(index + 1).padStart(2, '0')}>{new Date(2026, index, 1).toLocaleDateString('en-IN', { month: 'long' })}</option>)}</select><select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">Status: All</option>{EVENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><select className={inputClass} value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="All">Class: All</option>{['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'].map((className) => <option key={className}>{className}</option>)}</select></div>
        {!calendarView ? <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm"><thead className="bg-white text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Event Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Date(s)</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredEvents.map((event, index) => <tr key={event.id} className="hover:bg-indigo-50/30"><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3"><p className="font-semibold text-slate-800">{event.name}</p><p className="font-mono text-[10px] text-slate-400">{event.code}</p></td><td className="px-4 py-3"><Badge variant="info">{typeById.get(event.typeId)?.category || event.typeName}</Badge><p className="mt-1 text-[10px] text-slate-500">{event.typeName}</p></td><td className="px-4 py-3 whitespace-nowrap text-slate-600">{showDate(event.date, event.isMultiDay ? event.endDate : '')}</td><td className="px-4 py-3 text-slate-600">{event.venueName || '—'}</td><td className="px-4 py-3"><Badge variant={statusVariant(event.status)}>{event.status}</Badge></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="View event" onClick={() => { setViewRecord(event); setActiveSchoolEvent(event.id); }} className="rounded p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"><Eye className="h-4 w-4" /></button><button title="Edit event" onClick={() => editEvent(event)} className="rounded p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"><Pencil className="h-4 w-4" /></button><button title="Duties / execution" onClick={() => followUp(event, 'duties')} className="rounded px-2 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50">Duties</button><button title="Gallery" onClick={() => followUp(event, 'gallery')} className="rounded px-2 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50">Gallery</button><button title="Feedback" onClick={() => followUp(event, 'feedback')} className="rounded px-2 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50">Feedback</button></div></td></tr>)}{filteredEvents.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">No events match the selected filters.</td></tr>}</tbody></table></div> : <div className="p-4"><div className="mb-4 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" />Previous</Button><h3 className="font-bold text-slate-800">{monthName}</h3><Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>Next<ChevronRight className="h-4 w-4" /></Button></div><div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <div key={day} className="py-2">{day}</div>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: calendarOffset }, (_, index) => <div key={`empty-${index}`} className="min-h-24 rounded-lg bg-slate-50" />)}{Array.from({ length: calendarDays }, (_, index) => { const day = index + 1; const dateKey = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const dayEvents = filteredEvents.filter((event) => event.date === dateKey); return <div key={dateKey} className="min-h-24 rounded-lg border border-slate-100 bg-white p-1.5"><span className="text-xs font-semibold text-slate-400">{day}</span><div className="mt-1 space-y-1">{dayEvents.map((event) => <button key={event.id} onClick={() => setViewRecord(event)} className="block w-full truncate rounded bg-indigo-50 px-1.5 py-1 text-left text-[10px] font-medium text-indigo-800" title={event.name}>{event.name}</button>)}</div></div>; })}</div></div>}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">{filteredEvents.length} event(s) · Academic Year 2025-26 / 2026-27 · List and calendar views share the same filters.</div>
      </Card>}

      {workspace && workspaceEvent && (
        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{workspace.mode === 'duties' ? 'Duties' : workspace.mode === 'gallery' ? 'Gallery' : 'Feedback'}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{workspaceEvent.name}</h2>
              <p className="text-sm text-slate-500">{workspace.mode === 'duties' ? 'Assign and track event duties on this page.' : workspace.mode === 'gallery' ? 'Upload and review event media on this page.' : 'Capture outcomes, ratings and notes for this event.'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setWorkspace(null)}><X className="h-4 w-4" />Back to schedule</Button>
          </div>
          {workspace.mode === 'duties' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">Assigned duties</p>
                <Button size="sm" variant="outline" onClick={() => patchWorkspaceEvent({ responsibilities: [...workspaceEvent.responsibilities, { id: createEventId('role'), role: '', assignedTo: '' }] })}><Plus className="h-3.5 w-3.5" />Add Duty</Button>
              </div>
              {workspaceEvent.responsibilities.map((item) => (
                <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                  <input className={inputClass} value={item.role} placeholder="Duty / role" onChange={(event) => patchWorkspaceEvent({ responsibilities: workspaceEvent.responsibilities.map((row) => row.id === item.id ? { ...row, role: event.target.value } : row) })} />
                  <input className={inputClass} value={item.assignedTo} placeholder="Assigned staff / team" onChange={(event) => patchWorkspaceEvent({ responsibilities: workspaceEvent.responsibilities.map((row) => row.id === item.id ? { ...row, assignedTo: event.target.value } : row) })} />
                  <Button size="sm" variant="ghost" onClick={() => patchWorkspaceEvent({ responsibilities: workspaceEvent.responsibilities.filter((row) => row.id !== item.id) })}><Trash2 className="h-4 w-4 text-rose-600" />Remove</Button>
                </div>
              ))}
              {workspaceEvent.responsibilities.length === 0 && <p className="text-sm text-slate-400">No duties assigned yet. Add a duty above.</p>}
            </div>
          )}
          {workspace.mode === 'gallery' && (
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-sm text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/40">
                <input type="file" multiple accept="image/*" className="hidden" onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  if (!files.length) return;
                  patchWorkspaceEvent({ galleryItems: [...(workspaceEvent.galleryItems || []), ...files.map((file) => ({ id: createEventId('img'), name: file.name }))] });
                  event.target.value = '';
                }} />
                <ImageIcon className="mr-2 h-5 w-5 text-slate-400" />Add photos for this event
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(workspaceEvent.galleryItems || []).map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex aspect-square items-center justify-center rounded-lg bg-slate-100"><ImageIcon className="h-8 w-8 text-slate-400" /></div>
                    <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
                    <Button size="xs" variant="ghost" className="mt-1 text-rose-600" onClick={() => patchWorkspaceEvent({ galleryItems: (workspaceEvent.galleryItems || []).filter((row) => row.id !== item.id) })}>Remove</Button>
                  </div>
                ))}
              </div>
              {(workspaceEvent.galleryItems || []).length === 0 && <p className="text-sm text-slate-400">No photos added yet.</p>}
            </div>
          )}
          {workspace.mode === 'feedback' && (
            <EventFeedbackPanel event={workspaceEvent} reviews={reviews} setReviews={setReviews} />
          )}
        </Card>
      )}

      <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form ? `Create / Edit Event — ${form.name || 'New Event'}` : 'Create Event'} size="xl" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button variant="outline" onClick={() => saveEvent(false, true)}><CalendarDays className="h-4 w-4" />Add to Calendar</Button><Button variant="outline" onClick={() => saveEvent(true)}>Submit for Approval</Button><Button onClick={() => saveEvent(false)}>Save Event</Button></div>}>
        {form && <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
          <Panel title="Panel 1 · Event Basics">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Event Name"><input className={inputClass} value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Annual Day 2026 — Colours of India" /></Field><Field label="Event Theme" hint="Optional — especially useful for cultural events."><input className={inputClass} value={form.theme} onChange={(event) => updateForm('theme', event.target.value)} placeholder="Colours of India" /></Field><Field label="Event Code"><input className={`${inputClass} bg-slate-50 font-mono`} value={form.code} readOnly /></Field><Field label="Academic Year" hint="Auto-filled from the active academic session."><input className={`${inputClass} bg-slate-50`} value={form.academicYear} readOnly /></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={(event) => updateForm('status', event.target.value as SchoolEventRecord['status'])}>{EVENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></Field></div>
          </Panel>


          <Panel title="Audience">
            <p className="text-[11px] text-slate-500">Choose who this event is for. Each list supports multiple selections.</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MultiSelect label="Branch" options={branchAudienceOptions} values={form.audienceBranches || []} onChange={(next) => updateForm('audienceBranches', next)} />
              <MultiSelect label="Class" options={classAudienceOptions} values={form.audienceClasses || []} onChange={(next) => updateForm('audienceClasses', next)} />
              <MultiSelect label="Division" options={divisionAudienceOptions} values={form.audienceDivisions || []} onChange={(next) => updateForm('audienceDivisions', next)} />
              <MultiSelect label="Student" options={studentAudienceOptions} values={form.audienceStudents || []} onChange={(next) => updateForm('audienceStudents', next)} />
              <MultiSelect label="Staff" options={staffAudienceOptions} values={form.audienceStaff || []} onChange={(next) => updateForm('audienceStaff', next)} />
              <MultiSelect label="Parents" options={parentAudienceOptions} values={form.audienceParents || []} onChange={(next) => updateForm('audienceParents', next)} />
            </div>
          </Panel>
          <Panel title="Default Settings">
            <div className="grid gap-3 md:grid-cols-2">
              {([['schoolHoliday', 'Mark as school holiday for students'], ['requiresPrincipalApproval', 'Require Principal approval to create'], ['notifyParents', 'Notify parents automatically'], ['parentPortal', 'Show on Parent Portal'], ['instituteCalendar', 'Appear on Institute Calendar']] as Array<[keyof SchoolEventRecord, string]>).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs">
                  <input type="checkbox" checked={Boolean(form[key])} onChange={(event) => {
                    updateForm(key, event.target.checked as never);
                    if (key === 'notifyParents') setForm((current) => current ? { ...current, notifyParents: event.target.checked, notifyVia: event.target.checked ? (current.notifyVia.length ? current.notifyVia : ['SMS', 'Email', 'Parent Portal']) : current.notifyVia.filter((item) => item !== 'Parent Portal') } : current);
                    if (key === 'parentPortal') setForm((current) => current ? { ...current, parentPortal: event.target.checked, postOn: event.target.checked ? Array.from(new Set([...current.postOn, 'Parent Portal'])) : current.postOn.filter((item) => item !== 'Parent Portal') } : current);
                    if (key === 'instituteCalendar') setForm((current) => current ? { ...current, instituteCalendar: event.target.checked, postOn: event.target.checked ? Array.from(new Set([...current.postOn, 'Institute Calendar'])) : current.postOn.filter((item) => item !== 'Institute Calendar') } : current);
                    if (key === 'requiresPrincipalApproval') setForm((current) => current ? { ...current, requiresPrincipalApproval: event.target.checked, principalApprovalStatus: event.target.checked ? (current.principalApprovalStatus === 'Not Required' ? 'Pending Approval' : current.principalApprovalStatus) : 'Not Required', status: event.target.checked && current.status === 'Planning' ? 'Pending Approval' : current.status } : current);
                  }} />
                  {label}
                </label>
              ))}
            </div>
          </Panel>
          <Panel title="Certificates / Remembrances">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.participationCertificates} onChange={(event) => updateForm('participationCertificates', event.target.checked)} />Participation certificates for performers</label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.achievementCertificates} onChange={(event) => updateForm('achievementCertificates', event.target.checked)} />Achievement certificates for winners</label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.mementos} onChange={(event) => updateForm('mementos', event.target.checked)} />Mementos / gifts to guests</label>
            </div>
          </Panel>
          <Panel title="Panel 2 · Date, Time & Venue">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field label="Event Date"><input type="date" className={inputClass} value={form.date} onChange={(event) => updateForm('date', event.target.value)} /></Field><Field label="Is Multi-Day?"><select className={inputClass} value={form.isMultiDay ? 'Yes' : 'No'} onChange={(event) => updateForm('isMultiDay', event.target.value === 'Yes')}><option>No</option><option>Yes</option></select></Field>{form.isMultiDay && <Field label="End Date"><input type="date" className={inputClass} value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} /></Field>}<Field label="Start Time"><input type="text" className={inputClass} value={form.startTime} placeholder="05:00 PM" onChange={(event) => updateForm('startTime', event.target.value)} /></Field><Field label="End Time"><input type="text" className={inputClass} value={form.endTime} placeholder="09:00 PM" onChange={(event) => updateForm('endTime', event.target.value)} /></Field><Field label="Venue / Campus Location"><select className={inputClass} value={venueOptions.includes(form.venueName) ? form.venueName : 'Other'} onChange={(event) => updateForm('venueName', event.target.value === 'Other' ? '' : event.target.value)}>{venueOptions.map((venue) => <option key={venue}>{venue}</option>)}</select>{(!form.venueName || !venueOptions.includes(form.venueName)) && <input className={`${inputClass} mt-2`} value={form.venueName} onChange={(event) => updateForm('venueName', event.target.value)} placeholder="Enter custom venue / room" />}</Field><Field label="Venue / Room Code"><input className={inputClass} value={form.venueCode} onChange={(event) => updateForm('venueCode', event.target.value)} placeholder="AUD-01, Admin Block" /></Field><Field label="Seating Capacity" hint="Can be linked to Campus setup when integrated."><input type="number" min="0" className={inputClass} value={form.seatingCapacity} onChange={(event) => updateForm('seatingCapacity', Number(event.target.value))} /></Field><Field label="Expected Attendance" hint="May exceed room capacity if overflow is planned."><input type="number" min="0" className={inputClass} value={form.expectedAttendance} onChange={(event) => updateForm('expectedAttendance', Number(event.target.value))} /></Field><Field label="Venue Address"><input className={inputClass} value={form.venueAddress} onChange={(event) => updateForm('venueAddress', event.target.value)} /></Field><Field label="Overflow Arrangements"><input className={inputClass} value={form.overflowArrangements} onChange={(event) => updateForm('overflowArrangements', event.target.value)} placeholder="Live stream to Computer Lab 1 and 2" /></Field></div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs"><input type="checkbox" checked={form.schoolHoliday} onChange={(event) => updateForm('schoolHoliday', event.target.checked)} />School holiday for students on event day — no regular classes</label>
            <div className="rounded-lg border border-slate-100 p-3"><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold text-slate-700">Preparation / Rehearsal Days</p><p className="text-[11px] text-slate-500">Track rehearsals and setup on the event schedule.</p></div><Button size="sm" variant="outline" onClick={addPreparationDay}><Plus className="h-3.5 w-3.5" />Add Preparation Day</Button></div><div className="space-y-2">{form.preparationDays.map((item) => <div key={item.id} className="grid gap-2 rounded-lg bg-slate-50 p-2 md:grid-cols-5"><select className={inputClass} value={item.kind} onChange={(event) => updatePreparationDay(item.id, { kind: event.target.value })}>{['Rehearsal','Setup','Decoration','Sound Check','Other'].map((kind) => <option key={kind}>{kind}</option>)}</select><input type="date" className={inputClass} value={item.date} onChange={(event) => updatePreparationDay(item.id, { date: event.target.value })} /><input className={inputClass} value={item.activity} placeholder="Activity" onChange={(event) => updatePreparationDay(item.id, { activity: event.target.value })} /><input className={inputClass} value={item.venue} placeholder="Venue" onChange={(event) => updatePreparationDay(item.id, { venue: event.target.value })} /><Button size="sm" variant="ghost" onClick={() => removePreparationDay(item.id)}><Trash2 className="h-4 w-4 text-rose-600" />Remove</Button></div>)}{form.preparationDays.length === 0 && <p className="text-xs text-slate-400">No preparation days added.</p>}</div></div>
          </Panel>

          <Panel title="Panel 3 · Event Program / Agenda">
            <div className="space-y-2">{form.programItems.map((item, index) => <div key={item.id} className="grid gap-2 rounded-lg border border-slate-100 p-2 md:grid-cols-[70px_125px_1fr_1fr_auto]"><div className="flex items-center justify-center text-xs font-semibold text-slate-400">{index + 1}</div><input className={inputClass} value={item.time} placeholder="05:00 PM" onChange={(event) => updateProgramItem(item.id, { time: event.target.value })} /><input className={inputClass} value={item.item} placeholder="Program item" onChange={(event) => updateProgramItem(item.id, { item: event.target.value })} /><input className={inputClass} value={item.participants} placeholder="Participants / performers" onChange={(event) => updateProgramItem(item.id, { participants: event.target.value })} /><div className="flex items-center gap-1"><Button size="xs" variant="ghost" disabled={index === 0} onClick={() => moveProgram(index, -1)}><ArrowUp className="h-4 w-4" /></Button><Button size="xs" variant="ghost" disabled={index === form.programItems.length - 1} onClick={() => moveProgram(index, 1)}><ArrowDown className="h-4 w-4" /></Button><Button size="xs" variant="ghost" onClick={() => removeProgramItem(item.id)}><Trash2 className="h-4 w-4 text-rose-600" /></Button></div></div>)}{form.programItems.length === 0 && <p className="text-xs text-slate-400">Add agenda items, times and performers.</p>}</div><Button size="sm" variant="outline" onClick={addProgramItem}><Plus className="h-3.5 w-3.5" />Add Program Item</Button>
          </Panel>

          <Panel title="Panel 4 · Event Organizers & In-charge">
            <div className="mb-2 flex items-center justify-between"><div><p className="text-xs font-bold text-slate-700">Chief Guest / Guest of Honour</p><p className="text-[11px] text-slate-500">Track invitation and response for each guest.</p></div><Button size="sm" variant="outline" onClick={addGuest}><Plus className="h-3.5 w-3.5" />Add Another Guest</Button></div>
            {form.guests.map((guest) => <div key={guest.id} className="grid gap-2 rounded-lg border border-slate-100 p-3 md:grid-cols-6"><input className={inputClass} value={guest.name} placeholder="Name" onChange={(event) => updateGuest(guest.id, { name: event.target.value })} /><input className={inputClass} value={guest.designation} placeholder="Designation" onChange={(event) => updateGuest(guest.id, { designation: event.target.value })} /><input className={inputClass} value={guest.contact} placeholder="Contact" onChange={(event) => updateGuest(guest.id, { contact: event.target.value })} /><select className={inputClass} value={guest.response} onChange={(event) => updateGuest(guest.id, { response: event.target.value as EventGuest['response'] })}><option>Confirmed</option><option>Awaiting</option><option>Declined</option></select><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={guest.invitationSent} onChange={(event) => updateGuest(guest.id, { invitationSent: event.target.checked })} />Invitation sent</label><Button size="sm" variant="ghost" onClick={() => removeGuest(guest.id)}><Trash2 className="h-4 w-4 text-rose-600" />Remove</Button></div>)}
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-700">Event Responsibilities</p><p className="text-[11px] text-slate-500">Assign event coordinator, stage, decoration, sound/AV, photography and other duties.</p></div><Button size="sm" variant="outline" onClick={addResponsibility}><Plus className="h-3.5 w-3.5" />Add Responsibility</Button></div>
            {form.responsibilities.map((item) => <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]"><input className={inputClass} value={item.role} placeholder="Responsibility / role" onChange={(event) => updateResponsibility(item.id, { role: event.target.value })} /><input className={inputClass} value={item.assignedTo} placeholder="Assigned staff / team" onChange={(event) => updateResponsibility(item.id, { assignedTo: event.target.value })} /><Button size="sm" variant="ghost" onClick={() => removeResponsibility(item.id)}><Trash2 className="h-4 w-4 text-rose-600" />Remove</Button></div>)}
          </Panel>

          <Panel title="Panel 5 · Resources & Budget">
            <div><p className={labelClass}>Venue Requirements</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{resourceOptions.map((resource) => <label key={resource} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700"><input type="checkbox" checked={form.resources.includes(resource)} onChange={() => toggleArray('resources', resource)} />{resource}</label>)}</div></div>
            <div><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold text-slate-700">Estimated Budget</p><p className="text-[11px] text-slate-500">Actual costs can be completed during Event Feedback &amp; Review.</p></div><Button size="sm" variant="outline" onClick={addBudgetItem}><Plus className="h-3.5 w-3.5" />Add Budget Item</Button></div><div className="space-y-2">{form.budgetItems.map((item) => <div key={item.id} className="grid gap-2 rounded-lg bg-slate-50 p-2 md:grid-cols-[1.3fr_0.7fr_0.7fr_1.2fr_auto]"><input className={inputClass} value={item.item} placeholder="Budget item" onChange={(event) => updateBudgetItem(item.id, { item: event.target.value })} /><input type="number" min="0" className={inputClass} value={item.estimatedCost} aria-label="Estimated cost" onChange={(event) => updateBudgetItem(item.id, { estimatedCost: Number(event.target.value) })} /><input type="number" min="0" className={inputClass} value={item.actualCost ?? ''} placeholder="Actual" aria-label="Actual cost" onChange={(event) => updateBudgetItem(item.id, { actualCost: event.target.value === '' ? null : Number(event.target.value) })} /><input className={inputClass} value={item.vendor} placeholder="Vendor / remarks" onChange={(event) => updateBudgetItem(item.id, { vendor: event.target.value })} /><Button size="sm" variant="ghost" onClick={() => removeBudgetItem(item.id)}><Trash2 className="h-4 w-4 text-rose-600" /></Button></div>)}</div><div className="mt-3 flex justify-end text-sm font-bold text-slate-800">Total estimated: ₹{totalEstimatedBudget.toLocaleString('en-IN')}</div></div>
          </Panel>

          <Panel title="Panel 6 · Parent & Public Communication">
            <div className="grid gap-3 md:grid-cols-3"><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.parentsInvited} onChange={(event) => updateForm('parentsInvited', event.target.checked)} />Parents invited</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.passesRequired} onChange={(event) => updateForm('passesRequired', event.target.checked)} />Passes / entry system required</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.publicInvited} onChange={(event) => updateForm('publicInvited', event.target.checked)} />Public invited</label></div>
            {form.passesRequired && <Field label="Passes per family"><input type="number" min="1" className={inputClass} value={form.passesPerFamily} onChange={(event) => updateForm('passesPerFamily', Number(event.target.value))} /></Field>}
            <div className="grid gap-4 md:grid-cols-2"><Field label="Circular / Invitation"><input type="file" className={inputClass} onChange={(event) => updateForm('circularFile', event.target.files?.[0]?.name || '')} /><span className="mt-1 block text-[11px] text-slate-500">{form.circularFile || 'No file selected.'}</span></Field><Field label="Notify Date"><input type="date" className={inputClass} value={form.notifyDate} onChange={(event) => updateForm('notifyDate', event.target.value)} /></Field></div>
            <div className="grid gap-4 md:grid-cols-2"><div><p className={labelClass}>Notify via</p><div className="flex flex-wrap gap-2">{['SMS','Email','Parent Portal','WhatsApp'].map((channel) => <label key={channel} className="flex items-center gap-2 rounded border border-slate-100 px-3 py-2 text-xs"><input type="checkbox" checked={form.notifyVia.includes(channel)} onChange={() => toggleArray('notifyVia', channel)} />{channel}</label>)}</div></div><div><p className={labelClass}>Post on</p><div className="flex flex-wrap gap-2">{['School Website','Parent Portal','Social Media','Institute Calendar'].map((channel) => <label key={channel} className="flex items-center gap-2 rounded border border-slate-100 px-3 py-2 text-xs"><input type="checkbox" checked={form.postOn.includes(channel)} onChange={() => toggleArray('postOn', channel)} />{channel}</label>)}</div></div></div>
          </Panel>

          <Panel title="Panel 7 · Approvals Required">
            <div className="grid gap-3 md:grid-cols-2"><div className="rounded-lg border border-slate-100 p-3"><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={form.requiresPrincipalApproval} onChange={(event) => updateForm('requiresPrincipalApproval', event.target.checked)} />Requires Principal Approval</label><select className={`${inputClass} mt-2`} value={form.principalApprovalStatus} onChange={(event) => updateForm('principalApprovalStatus', event.target.value)}><option>Pending Approval</option><option>Approved</option><option>Rejected</option><option>Not Required</option></select></div><div className="rounded-lg border border-slate-100 p-3"><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={form.requiresManagementApproval} onChange={(event) => updateForm('requiresManagementApproval', event.target.checked)} />Requires Management Approval</label><select className={`${inputClass} mt-2`} value={form.managementApprovalStatus} onChange={(event) => updateForm('managementApprovalStatus', event.target.value)}><option>Pending</option><option>Approved</option><option>Rejected</option><option>Not Required</option></select></div><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.policePermission} onChange={(event) => updateForm('policePermission', event.target.checked)} />Police permission required</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.fireNoc} onChange={(event) => updateForm('fireNoc', event.target.checked)} />Fire NOC required (e.g. large events over 500 people)</label></div>
            <Field label="Event Notes"><textarea className={`${inputClass} min-h-20`} value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Planning notes, special arrangements or risks" /></Field>
          </Panel>
        </div>}
      </Modal>

      <Modal isOpen={Boolean(viewRecord)} onClose={() => setViewRecord(null)} title={viewRecord?.name || 'Event Details'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setViewRecord(null)}>Close</Button>{viewRecord && <Button onClick={() => { const record = viewRecord; setViewRecord(null); editEvent(record); }}>Edit Event</Button>}</div>}>
        {viewRecord && <div className="max-h-[68vh] space-y-4 overflow-y-auto"><div className="flex flex-wrap items-center gap-2"><Badge variant={statusVariant(viewRecord.status)}>{viewRecord.status}</Badge><Badge variant="info">{viewRecord.typeName}</Badge><span className="font-mono text-xs text-slate-500">{viewRecord.code}</span></div><div className="grid gap-3 sm:grid-cols-2"><div><p className={labelClass}>Date &amp; Time</p><p className="text-sm">{showDate(viewRecord.date, viewRecord.isMultiDay ? viewRecord.endDate : '')} · {viewRecord.startTime}–{viewRecord.endTime}</p></div><div><p className={labelClass}>Venue</p><p className="text-sm"><MapPin className="mr-1 inline h-4 w-4" />{viewRecord.venueName || '—'} · Capacity {viewRecord.seatingCapacity || '—'}</p></div><div><p className={labelClass}>Expected Attendance</p><p className="text-sm"><Users className="mr-1 inline h-4 w-4" />{viewRecord.expectedAttendance}</p></div><div><p className={labelClass}>Approval</p><p className="text-sm">Principal: {viewRecord.principalApprovalStatus}; Management: {viewRecord.managementApprovalStatus}</p></div></div><div><p className={labelClass}>Program</p>{viewRecord.programItems.length ? <ol className="list-decimal space-y-1 pl-5 text-sm">{viewRecord.programItems.map((item) => <li key={item.id}>{item.time} — {item.item} <span className="text-slate-500">({item.participants})</span></li>)}</ol> : <p className="text-sm text-slate-400">No program items added yet.</p>}</div></div>}
      </Modal>
    </div>
  );
}
