import React, { useMemo, useState } from 'react';
import { Download, Edit3, Plus, Search } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  DEFAULT_EVENT_TYPES,
  EVENT_AUDIENCES,
  EVENT_RECURRENCES,
  EVENT_TYPE_CATEGORIES,
  EVENT_TYPES_STORAGE_KEY,
  EventTypeRecord,
  createEventId,
  downloadEventCsv,
  eventTypeAudienceLabel,
  loadEventCollection,
  saveEventCollection
} from './eventData';

const classOptions = ['Pre-primary', ...Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`)];
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}</label>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white"><h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">{title}</h3><div className="space-y-4 p-4">{children}</div></section>;
}

const generatedCode = (name: string) => {
  const suffix = name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return suffix ? `EVT-${suffix}` : 'EVT-NEW-TYPE';
};

function createType(): EventTypeRecord {
  return {
    id: createEventId('et'), name: '', code: 'EVT-NEW-TYPE', icon: '🎉', category: 'Academic', description: '',
    audience: ['All Students', 'All Staff', 'Parents'], appliesToAllClasses: true, classes: [], recurrence: 'Yearly', status: 'Active',
    typicalDurationHours: 8, preferredTimeOfYear: 'December to February', venueType: 'Auditorium', preparationWeeks: 4,
    schoolHoliday: false, principalApproval: true, notifyParents: true, parentPortal: true, instituteCalendar: true,
    participationCertificates: true, achievementCertificates: true, mementos: false
  };
}

export function EventMaster() {
  const [types, setTypes] = useState<EventTypeRecord[]>(() => loadEventCollection(EVENT_TYPES_STORAGE_KEY, DEFAULT_EVENT_TYPES));
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm] = useState<EventTypeRecord | null>(null);
  const [message, setMessage] = useState('');

  const filteredTypes = useMemo(() => types.filter((type) => {
    const term = search.trim().toLowerCase();
    if (term && !`${type.name} ${type.code} ${type.category} ${type.description}`.toLowerCase().includes(term)) return false;
    if (categoryFilter !== 'All' && type.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && type.status !== statusFilter) return false;
    return true;
  }), [types, search, categoryFilter, statusFilter]);

  const persist = (next: EventTypeRecord[]) => {
    setTypes(next);
    saveEventCollection(EVENT_TYPES_STORAGE_KEY, next);
  };

  function updateForm<K extends keyof EventTypeRecord>(key: K, value: EventTypeRecord[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  const updateName = (name: string) => setForm((current) => current ? { ...current, name, code: generatedCode(name) } : current);
  const toggleArray = (key: 'audience' | 'classes', value: string) => setForm((current) => current ? {
    ...current,
    [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value]
  } : current);

  const saveType = () => {
    if (!form || !form.name.trim()) { setMessage('Enter an event type name before saving.'); return; }
    const saved = { ...form, name: form.name.trim(), code: generatedCode(form.name), classes: form.appliesToAllClasses ? [] : form.classes };
    const next = types.some((type) => type.id === saved.id)
      ? types.map((type) => type.id === saved.id ? saved : type)
      : [saved, ...types];
    persist(next);
    setForm(null);
    setMessage(`“${saved.name}” saved to Event Type Master.`);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const exportTypes = () => downloadEventCsv('event-type-master.csv', filteredTypes.map((type) => ({
    Name: type.name, Code: type.code, Category: type.category, Audience: type.appliesToAllClasses ? eventTypeAudienceLabel(type.audience) : type.classes.join(', ') || eventTypeAudienceLabel(type.audience),
    Recurring: type.recurrence, Status: type.status
  })));

  const toggleStatus = (type: EventTypeRecord) => {
    persist(types.map((item) => item.id === type.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Reference Master</p><h1 className="mt-1 text-2xl font-bold text-slate-900">🎉 Event Type Master</h1><p className="mt-1 max-w-3xl text-sm text-slate-500">Define reusable school event types, audience, recurrence and planning defaults before scheduling an event.</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportTypes}>Export</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setForm(createType())}>Add Event Type</Button></div>
      </div>

      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card className="overflow-hidden" noPadding>
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 p-4 lg:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-9`} placeholder="Search event types, codes, categories..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <select className={`${inputClass} lg:w-52`} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="All">All categories</option>{EVENT_TYPE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
          <select className={`${inputClass} lg:w-40`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All statuses</option><option>Active</option><option>Inactive</option></select>
          <div className="self-center whitespace-nowrap text-xs text-slate-500">{filteredTypes.length} of {types.length} types</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-white text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Event Type Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Audience</th><th className="px-4 py-3">Recurring</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{filteredTypes.map((type, index) => <tr key={type.id} className="hover:bg-indigo-50/30"><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3"><div className="flex items-center gap-2 font-semibold text-slate-800"><span className="text-xl" aria-hidden="true">{type.icon}</span>{type.name}</div><div className="ml-8 font-mono text-[10px] text-slate-400">{type.code}</div></td><td className="px-4 py-3"><Badge variant="info">{type.category}</Badge></td><td className="px-4 py-3 text-slate-600">{type.appliesToAllClasses ? eventTypeAudienceLabel(type.audience) : type.classes.join(', ') || eventTypeAudienceLabel(type.audience)}</td><td className="px-4 py-3 text-slate-600">{type.recurrence}</td><td className="px-4 py-3"><Badge variant={type.status === 'Active' ? 'success' : 'default'}>{type.status}</Badge></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Edit event type" onClick={() => setForm({ ...type, audience: [...type.audience], classes: [...type.classes] })} className="rounded p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"><Edit3 className="h-4 w-4" /></button><button title={type.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(type)} className="rounded px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100">{type.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></td></tr>)}
              {filteredTypes.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">No event types match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form?.id.startsWith('et-') && types.some((type) => type.id === form?.id) ? `Edit Event Type — ${form?.name}` : '🎉 Create Event Type'} size="xl" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button onClick={saveType}>Save Event Type</Button></div>}>
        {form && <div className="max-h-[74vh] space-y-4 overflow-y-auto pr-1">
          <Panel title="Panel 1 · Basic Information">
            <div className="grid gap-4 md:grid-cols-2"><Field label="Event Type Name"><input className={inputClass} value={form.name} onChange={(event) => updateName(event.target.value)} placeholder="Annual Day" /></Field><Field label="Event Code" hint="Auto-generated from the event type name."><input className={`${inputClass} bg-slate-50 font-mono`} value={form.code} readOnly /></Field><Field label="Event Icon"><input className={inputClass} value={form.icon} onChange={(event) => updateForm('icon', event.target.value)} placeholder="🎭" /></Field><Field label="Category"><select className={inputClass} value={form.category} onChange={(event) => updateForm('category', event.target.value)}>{EVENT_TYPE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={(event) => updateForm('status', event.target.value as EventTypeRecord['status'])}><option>Active</option><option>Inactive</option></select></Field><Field label="Description"><textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Purpose and typical program details" /></Field></div>
          </Panel>

          <Panel title="Panel 2 · Audience & Scope">
            <div><p className={labelClass}>Primary Audience</p><div className="flex flex-wrap gap-2">{EVENT_AUDIENCES.map((audience) => <label key={audience} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${form.audience.includes(audience) ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-600'}`}><input type="checkbox" checked={form.audience.includes(audience)} onChange={() => toggleArray('audience', audience)} />{audience}</label>)}</div></div>
            <div className="grid gap-4 md:grid-cols-2"><div><p className={labelClass}>Applies To Classes</p><div className="mb-2 flex gap-4"><label className="flex items-center gap-2 text-xs"><input type="radio" checked={form.appliesToAllClasses} onChange={() => updateForm('appliesToAllClasses', true)} />All Classes</label><label className="flex items-center gap-2 text-xs"><input type="radio" checked={!form.appliesToAllClasses} onChange={() => updateForm('appliesToAllClasses', false)} />Specific Classes</label></div>{!form.appliesToAllClasses && <div className="flex flex-wrap gap-2">{classOptions.map((className) => <label key={className} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1 text-xs"><input type="checkbox" checked={form.classes.includes(className)} onChange={() => toggleArray('classes', className)} />{className}</label>)}</div>}</div><Field label="Recurrence"><select className={inputClass} value={form.recurrence} onChange={(event) => updateForm('recurrence', event.target.value)}>{EVENT_RECURRENCES.map((recurrence) => <option key={recurrence}>{recurrence}</option>)}</select></Field></div>
          </Panel>

          <Panel title="Panel 3 · Planning Defaults">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field label="Typical Duration"><select className={inputClass} value={form.typicalDurationHours} onChange={(event) => updateForm('typicalDurationHours', Number(event.target.value))}><option value={2}>Half day (2 hours)</option><option value={4}>Half day (4 hours)</option><option value={6}>Most of a day (6 hours)</option><option value={8}>Full day (8 hours)</option><option value={24}>Overnight / multi-day (24 hours)</option></select></Field><Field label="Preferred Time of Year"><select className={inputClass} value={form.preferredTimeOfYear} onChange={(event) => updateForm('preferredTimeOfYear', event.target.value)}>{['December to February', 'March to May', 'June to August', 'September to November', 'August', 'September', 'October', 'November', 'January', 'June', 'Any time'].map((month) => <option key={month}>{month}</option>)}</select></Field><Field label="Typical Venue Type"><select className={inputClass} value={form.venueType} onChange={(event) => updateForm('venueType', event.target.value)}>{['Auditorium', 'School Ground', 'School Hall', 'Classrooms', 'All Classrooms', 'Library', 'Medical Room', 'Whole Campus', 'Off-campus', 'School Campus', 'Other'].map((venue) => <option key={venue}>{venue}</option>)}</select></Field><Field label="Typical Preparation Time" hint="How far in advance planning should start."><select className={inputClass} value={form.preparationWeeks} onChange={(event) => updateForm('preparationWeeks', Number(event.target.value))}>{[1, 2, 3, 4, 6, 8, 12].map((weeks) => <option key={weeks} value={weeks}>{weeks} week{weeks > 1 ? 's' : ''}</option>)}</select></Field></div>
          </Panel>

          <Panel title="Panel 4 · Default Settings">
            <div className="grid gap-2 md:grid-cols-2">{[
              ['schoolHoliday', 'Mark as school holiday for students'], ['principalApproval', 'Require Principal approval to create'],
              ['notifyParents', 'Notify parents automatically'], ['parentPortal', 'Show on Parent Portal'], ['instituteCalendar', 'Appear on Institute Calendar']
            ].map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700"><span>{label}</span><input type="checkbox" checked={Boolean(form[key as keyof EventTypeRecord])} onChange={(event) => updateForm(key as keyof EventTypeRecord, event.target.checked as never)} /></label>)}</div>
            <div><p className={labelClass}>Certificates / Remembrances</p><div className="grid gap-2 md:grid-cols-3">{[
              ['participationCertificates', 'Participation certificates for performers'], ['achievementCertificates', 'Achievement certificates for winners'], ['mementos', 'Mementos / gifts to guests']
            ].map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700"><input type="checkbox" checked={Boolean(form[key as keyof EventTypeRecord])} onChange={(event) => updateForm(key as keyof EventTypeRecord, event.target.checked as never)} />{label}</label>)}</div></div>
          </Panel>
        </div>}
      </Modal>
    </div>
  );
}
