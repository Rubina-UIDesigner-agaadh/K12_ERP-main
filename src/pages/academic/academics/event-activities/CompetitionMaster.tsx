import React, { useMemo, useState } from 'react';
import { Award, Download, Pencil, Plus, Search, Trophy, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  COMPETITION_CATEGORIES,
  COMPETITION_LEVELS,
  COMPETITION_TYPES_STORAGE_KEY,
  DEFAULT_COMPETITION_TYPES,
  ELIGIBLE_CLASS_GROUPS,
  CompetitionTypeRecord,
  downloadCsv,
  loadCompetitionCollection,
  saveCompetitionCollection
} from './competitionData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}</label>;
}

const suggestedCode = (name: string) => {
  const words = name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, ' ').split(' ').filter(Boolean);
  return words.length ? `COMP-${words.map((word) => word.slice(0, 3)).join('-')}` : 'COMP-NEW-TYPE';
};

const createType = (): CompetitionTypeRecord => ({
  id: `ct-${Date.now()}`,
  name: '',
  shortName: '',
  code: 'COMP-NEW-TYPE',
  category: 'Academic',
  subCategory: '',
  levels: ['School / Internal'],
  organizer: 'Internal',
  description: '',
  status: 'Active',
  eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'],
  eligibleGender: 'All',
  participationMode: 'Both',
  minTeamSize: 1,
  maxTeamSize: 4,
  minimumAttendance: 75,
  judgingType: 'External Judges',
  resultType: 'Rank-based (1st, 2nd, 3rd)',
  housePoints: true,
  participationCertificate: true,
  meritCertificate: true,
  reportCard: true,
  studentProfile: true,
  parentPortal: true
});

export function CompetitionMaster() {
  const [types, setTypes] = useState<CompetitionTypeRecord[]>(() =>
    loadCompetitionCollection(COMPETITION_TYPES_STORAGE_KEY, DEFAULT_COMPETITION_TYPES)
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm] = useState<CompetitionTypeRecord | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  const filteredTypes = useMemo(() => types.filter((type) => {
    const term = search.trim().toLowerCase();
    if (term && !`${type.name} ${type.code} ${type.shortName} ${type.category} ${type.subCategory}`.toLowerCase().includes(term)) return false;
    if (categoryFilter !== 'All' && type.category !== categoryFilter) return false;
    if (levelFilter !== 'All' && !type.levels.includes(levelFilter)) return false;
    if (statusFilter !== 'All' && type.status !== statusFilter) return false;
    return true;
  }), [types, search, categoryFilter, levelFilter, statusFilter]);

  const persist = (next: CompetitionTypeRecord[]) => {
    setTypes(next);
    saveCompetitionCollection(COMPETITION_TYPES_STORAGE_KEY, next);
  };

  function updateForm<K extends keyof CompetitionTypeRecord>(key: K, value: CompetitionTypeRecord[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  const toggleArrayValue = (key: 'levels' | 'eligibleClasses', value: string) => {
    setForm((current) => current ? {
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value]
    } : current);
  };

  const saveType = () => {
    if (!form || !form.name.trim()) {
      setSavedMessage('Enter a competition type name before saving.');
      return;
    }
    const normalized: CompetitionTypeRecord = {
      ...form,
      name: form.name.trim(),
      code: form.code || suggestedCode(form.name),
      levels: form.levels.length ? form.levels : ['School / Internal']
    };
    const next = types.some((item) => item.id === normalized.id)
      ? types.map((item) => item.id === normalized.id ? normalized : item)
      : [normalized, ...types];
    persist(next);
    setForm(null);
    setSavedMessage(`“${normalized.name}” saved to Competition Master.`);
    window.setTimeout(() => setSavedMessage(''), 3000);
  };

  const exportTypes = () => downloadCsv('competition-types.csv', filteredTypes.map((type) => ({
    Name: type.name,
    Code: type.code,
    Category: type.category,
    SubCategory: type.subCategory,
    Levels: type.levels.join('; '),
    Organizer: type.organizer,
    Status: type.status
  })));

  const displayedLevels = (type: CompetitionTypeRecord) => type.levels.length === COMPETITION_LEVELS.length
    ? 'All Levels'
    : type.levels.join(', ') || '—';

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700"><Trophy className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Competition Management</p>
            <h1 className="text-2xl font-bold text-slate-900">Competition Master</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">Define the competition types used as the master reference when scheduling events.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportTypes}><Download className="h-4 w-4" />Export</Button>
          <Button onClick={() => { setForm(createType()); setSavedMessage(''); }}><Plus className="h-4 w-4" />Add Competition Type</Button>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/70 p-4">
        <p className="text-sm font-semibold text-amber-900">🎯 Purpose</p>
        <p className="mt-1 text-sm text-amber-800">Define each competition type once. Events inherit its category, levels, organizer, default eligibility, evaluation, points, and certificate settings.</p>
      </Card>

      {savedMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{savedMessage}</div>}

      <Card noPadding className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} pl-9`} placeholder="Search competition types…" aria-label="Search competition types" />
          </div>
          <select className={`${inputClass} lg:w-48`} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category">
            <option value="All">All Categories</option>{COMPETITION_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select className={`${inputClass} lg:w-48`} value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} aria-label="Filter by level">
            <option value="All">All Levels</option>{COMPETITION_LEVELS.map((level) => <option key={level}>{level}</option>)}
          </select>
          <select className={`${inputClass} lg:w-36`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
            <option value="All">All Statuses</option><option>Active</option><option>Inactive</option>
          </select>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-semibold text-slate-900">🏆 Competition Types Master</h2>
          <span className="text-xs text-slate-500">{filteredTypes.length} of {types.length} types</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Competition Type Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Organizer</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTypes.map((type, index) => (
                <tr key={type.id} className="hover:bg-amber-50/30">
                  <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                  <td className="px-4 py-3"><div className="font-semibold text-slate-900">{type.name}</div><div className="text-xs text-slate-500">{type.shortName} · {type.code}</div></td>
                  <td className="px-4 py-3"><span className="font-medium text-slate-800">{type.category}</span>{type.subCategory && <span className="block text-xs text-slate-500">{type.subCategory}</span>}</td>
                  <td className="px-4 py-3 text-slate-600">{displayedLevels(type)}</td>
                  <td className="px-4 py-3 text-slate-600">{type.organizer}</td>
                  <td className="px-4 py-3"><Badge variant={type.status === 'Active' ? 'success' : 'default'}>{type.status}</Badge></td>
                  <td className="px-4 py-3 text-right"><Button size="xs" variant="outline" onClick={() => { setForm({ ...type, levels: [...type.levels], eligibleClasses: [...type.eligibleClasses] }); setSavedMessage(''); }}><Pencil className="h-3.5 w-3.5" />Edit</Button></td>
                </tr>
              ))}
              {!filteredTypes.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">No competition types match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={Boolean(form)}
        onClose={() => setForm(null)}
        title={form?.id && types.some((type) => type.id === form.id) ? 'Edit Competition Type' : 'Create Competition Type'}
        size="xl"
        footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}><X className="h-4 w-4" />Cancel</Button><Button onClick={saveType}><Award className="h-4 w-4" />Save Competition Type</Button></div>}
      >
        {form && <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          <p className="text-xs text-slate-500">Configure reusable defaults. Competition events can override eligibility and scoring when needed.</p>
          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Panel 1 · Basic Identity</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Competition Type Name *"><input className={inputClass} value={form.name} onChange={(event) => { const name = event.target.value; setForm((current) => current ? { ...current, name, code: suggestedCode(name) } : current); }} placeholder="Science Olympiad" /></Field>
              <Field label="Short Name"><input className={inputClass} value={form.shortName} onChange={(event) => updateForm('shortName', event.target.value)} placeholder="Sci. Olympiad" /></Field>
              <Field label="Competition Code" hint="Suggested from the competition name; unique code for reference."><input className={`${inputClass} bg-slate-50 font-mono`} value={form.code} readOnly /></Field>
              <Field label="Category"><select className={inputClass} value={form.category} onChange={(event) => updateForm('category', event.target.value)}>{COMPETITION_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field>
              <Field label="Sub-Category" hint="Optional; describe the discipline within the main category."><input className={inputClass} value={form.subCategory} onChange={(event) => updateForm('subCategory', event.target.value)} placeholder="Science, Music, Robotics…" /></Field>
              <Field label="Organized By"><select className={inputClass} value={form.organizer} onChange={(event) => updateForm('organizer', event.target.value as CompetitionTypeRecord['organizer'])}><option>Internal</option><option>External</option><option>Both</option></select></Field>
              <div className="md:col-span-2">
                <span className={labelClass}>Competition Levels · select all that apply</span>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{COMPETITION_LEVELS.map((level) => <label key={level} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700"><input type="checkbox" checked={form.levels.includes(level)} onChange={() => toggleArrayValue('levels', level)} />{level}</label>)}</div>
              </div>
              <Field label="Description"><textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Describe the competition scope and purpose…" /></Field>
              <Field label="Status"><select className={inputClass} value={form.status} onChange={(event) => updateForm('status', event.target.value as CompetitionTypeRecord['status'])}><option>Active</option><option>Inactive</option></select></Field>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-1 text-sm font-bold text-slate-900">Panel 2 · Eligibility Defaults</h3>
            <p className="mb-3 text-xs text-slate-500">Defaults may be overridden for an individual competition event.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div><span className={labelClass}>Eligible Classes</span><div className="grid gap-2 sm:grid-cols-2">{ELIGIBLE_CLASS_GROUPS.map((classGroup) => <label key={classGroup} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={form.eligibleClasses.includes(classGroup)} onChange={() => toggleArrayValue('eligibleClasses', classGroup)} />{classGroup}</label>)}</div></div>
              <div className="space-y-3">
                <Field label="Eligible Gender"><select className={inputClass} value={form.eligibleGender} onChange={(event) => updateForm('eligibleGender', event.target.value as CompetitionTypeRecord['eligibleGender'])}><option>All</option><option>Boys</option><option>Girls</option></select></Field>
                <Field label="Team or Individual"><select className={inputClass} value={form.participationMode} onChange={(event) => updateForm('participationMode', event.target.value as CompetitionTypeRecord['participationMode'])}><option>Individual</option><option>Team</option><option>Both</option></select></Field>
                <div className="grid grid-cols-2 gap-3"><Field label="Minimum Team Size"><input type="number" min={1} className={inputClass} value={form.minTeamSize} onChange={(event) => updateForm('minTeamSize', Number(event.target.value))} /></Field><Field label="Maximum Team Size"><input type="number" min={1} className={inputClass} value={form.maxTeamSize} onChange={(event) => updateForm('maxTeamSize', Number(event.target.value))} /></Field></div>
                <Field label="Minimum Attendance Required (%)"><input type="number" min={0} max={100} className={inputClass} value={form.minimumAttendance} onChange={(event) => updateForm('minimumAttendance', Number(event.target.value))} /></Field>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Panel 3 · Scoring & Evaluation</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Judging Type"><select className={inputClass} value={form.judgingType} onChange={(event) => updateForm('judgingType', event.target.value)}>{['Internal Teachers', 'External Judges', 'Mixed', 'Online Platform', 'Self-scored'].map((value) => <option key={value}>{value}</option>)}</select></Field>
              <Field label="Result Type"><select className={inputClass} value={form.resultType} onChange={(event) => updateForm('resultType', event.target.value)}>{['Rank-based (1st, 2nd, 3rd)', 'Grade-based', 'Points-based', 'Qualify/Eliminate', 'Certificate only'].map((value) => <option key={value}>{value}</option>)}</select></Field>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-sm md:col-span-2"><input type="checkbox" checked={form.housePoints} onChange={(event) => updateForm('housePoints', event.target.checked)} /><span><strong>Contribute to house points</strong><span className="block text-xs text-slate-500">Competition results can update the house points system.</span></span></label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Panel 4 · Document & Certificate Settings</h3>
            <div className="grid gap-2 sm:grid-cols-2">{([
              ['participationCertificate', 'Generate participation certificates'],
              ['meritCertificate', 'Generate merit certificates for winners'],
              ['reportCard', 'Appear on student report card'],
              ['studentProfile', 'Appear on TC / student profile'],
              ['parentPortal', 'Show on parent portal']
            ] as Array<[keyof CompetitionTypeRecord, string]>).map(([key, label]) => <label key={String(key)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={Boolean(form[key])} onChange={(event) => updateForm(key, event.target.checked as never)} />{label}</label>)}</div>
          </section>
        </div>}
      </Modal>
    </div>
  );
}
