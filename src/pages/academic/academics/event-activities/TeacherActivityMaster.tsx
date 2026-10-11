import React, { useMemo, useState } from 'react';
import { Download, Edit3, Plus, Search } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  DEFAULT_TEACHER_ACTIVITY_TYPES,
  TEACHER_ACTIVITY_TYPES_STORAGE_KEY,
  TeacherActivityTypeRecord,
  createTeacherRecordId,
  downloadTeacherCsv,
  loadTeacherCollection,
  saveTeacherCollection
} from './teacherData';

const categories = ['Training', 'Self-learning', 'Academic', 'Recognition', 'Achievement', 'Leadership', 'Social', 'School Service', 'Other'];
const bases = ['points/day', 'points per FDP', 'points each', 'points/month', 'points/activity', 'points/event'];
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

type TypeForm = TeacherActivityTypeRecord;
const emptyType = (): TypeForm => ({ id: createTeacherRecordId('tat'), name: '', icon: '📚', category: 'Training', creditValue: 1, creditBasis: 'points each', status: 'Active', description: '' });

export function TeacherActivityMaster() {
  const [types, setTypes] = useState<TeacherActivityTypeRecord[]>(() => loadTeacherCollection(TEACHER_ACTIVITY_TYPES_STORAGE_KEY, DEFAULT_TEACHER_ACTIVITY_TYPES));
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [form, setForm] = useState<TypeForm | null>(null);
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => types.filter((type) => {
    const term = search.trim().toLowerCase();
    return (!term || `${type.name} ${type.category} ${type.creditBasis}`.toLowerCase().includes(term)) && (categoryFilter === 'All' || type.category === categoryFilter);
  }), [types, search, categoryFilter]);
  const persist = (next: TeacherActivityTypeRecord[]) => { setTypes(next); saveTeacherCollection(TEACHER_ACTIVITY_TYPES_STORAGE_KEY, next); };
  const save = () => {
    if (!form?.name.trim()) { setMessage('Enter an activity type name before saving.'); return; }
    const record = { ...form, name: form.name.trim(), creditValue: Math.max(0, Number(form.creditValue)) };
    persist(types.some((item) => item.id === record.id) ? types.map((item) => item.id === record.id ? record : item) : [record, ...types]);
    setForm(null); setMessage(`“${record.name}” saved.`); window.setTimeout(() => setMessage(''), 3000);
  };
  const exportTypes = () => downloadTeacherCsv('teacher-activity-types.csv', filtered.map((type) => ({ ActivityType: type.name, Category: type.category, Credit: `${type.creditValue} ${type.creditBasis}`, Status: type.status })));

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Activities Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">👩‍🏫 Teacher Activity Types Master</h1><p className="mt-1 text-sm text-slate-500">Set the activity catalog and credit-point rules used by Professional Development and achievement records.</p></div><div className="flex gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportTypes}>Export</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setForm(emptyType())}>Add Activity Type</Button></div></div>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <Card noPadding className="overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 p-4 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-9`} placeholder="Search activity types..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className={`${inputClass} md:w-56`} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><span className="self-center whitespace-nowrap text-xs text-slate-500">{filtered.length} types</span></div><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Activity Type</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Credit / Points</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((type, index) => <tr key={type.id} className="hover:bg-indigo-50/30"><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3"><span className="mr-2 text-lg">{type.icon}</span><span className="font-semibold text-slate-800">{type.name}</span></td><td className="px-4 py-3"><Badge variant="info">{type.category}</Badge></td><td className="px-4 py-3 text-slate-600">{type.creditValue} {type.creditBasis}</td><td className="px-4 py-3"><Badge variant={type.status === 'Active' ? 'success' : 'default'}>{type.status}</Badge></td><td className="px-4 py-3 text-right"><button className="rounded p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700" title="Edit activity type" onClick={() => setForm({ ...type })}><Edit3 className="h-4 w-4" /></button><button className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100" onClick={() => persist(types.map((item) => item.id === type.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))}>{type.status === 'Active' ? 'Deactivate' : 'Activate'}</button></td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No activity types found.</td></tr>}</tbody></table></div></Card>
    <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form && types.some((item) => item.id === form.id) ? `Edit Activity Type — ${form?.name}` : 'Add Activity Type'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button onClick={save}>Save Activity Type</Button></div>}>
      {form && <div className="grid gap-4 md:grid-cols-2"><label><span className={labelClass}>Activity Type Name</span><input className={inputClass} value={form.name} onChange={(event) => setForm((current) => current ? { ...current, name: event.target.value } : current)} /></label><label><span className={labelClass}>Icon / Emoji</span><input className={inputClass} value={form.icon} onChange={(event) => setForm((current) => current ? { ...current, icon: event.target.value } : current)} /></label><label><span className={labelClass}>Category</span><select className={inputClass} value={form.category} onChange={(event) => setForm((current) => current ? { ...current, category: event.target.value } : current)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span className={labelClass}>Credit Value</span><input type="number" min="0" className={inputClass} value={form.creditValue} onChange={(event) => setForm((current) => current ? { ...current, creditValue: Number(event.target.value) } : current)} /></label><label><span className={labelClass}>Credit Basis</span><select className={inputClass} value={form.creditBasis} onChange={(event) => setForm((current) => current ? { ...current, creditBasis: event.target.value } : current)}>{bases.map((basis) => <option key={basis}>{basis}</option>)}</select></label><label><span className={labelClass}>Status</span><select className={inputClass} value={form.status} onChange={(event) => setForm((current) => current ? { ...current, status: event.target.value as TypeForm['status'] } : current)}><option>Active</option><option>Inactive</option></select></label><label className="md:col-span-2"><span className={labelClass}>Description</span><textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(event) => setForm((current) => current ? { ...current, description: event.target.value } : current)} /></label></div>}
    </Modal>
  </div>;
}
