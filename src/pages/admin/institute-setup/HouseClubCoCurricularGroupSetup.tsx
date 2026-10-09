import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Activity,
  AlertCircle,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Download,
  Edit2,
  Filter,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';

type SetupTab = 'Houses' | 'Co-Curricular Groups';
type EntityStatus = 'Active' | 'Inactive';
type GroupCategory = 'Sports' | 'Arts & Culture' | 'Academic' | 'Service' | 'Leadership' | 'Other';

interface House {
  id: string;
  year: string;
  name: string;
  code: string;
  color: string;
  mentor: string;
  assistantMentor: string;
  motto: string;
  description: string;
  status: EntityStatus;
}

interface CoCurricularGroup {
  id: string;
  year: string;
  name: string;
  code: string;
  category: GroupCategory;
  description: string;
  mentor: string;
  schedule: string;
  venue: string;
  targetClasses: string;
  status: EntityStatus;
}

interface HouseFormData {
  name: string;
  code: string;
  color: string;
  mentor: string;
  assistantMentor: string;
  motto: string;
  description: string;
  status: EntityStatus;
}

interface GroupFormData {
  name: string;
  code: string;
  category: GroupCategory;
  description: string;
  mentor: string;
  schedule: string;
  venue: string;
  targetClasses: string;
  status: EntityStatus;
}

const YEAR_OPTIONS = ['2024-25', '2025-26', '2026-27', '2027-28'];
const CURRENT_YEAR = '2026-27';
const GROUP_CATEGORIES: GroupCategory[] = ['Sports', 'Arts & Culture', 'Academic', 'Service', 'Leadership', 'Other'];
const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const selectClass = `${inputClass} cursor-pointer`;
const textareaClass = `${inputClass} min-h-[88px] resize-y`;

const seedHouses: House[] = [
  { id: 'house-25-red', year: '2025-26', name: 'Ruby House', code: 'RUBY', color: '#e05252', mentor: 'Mrs. R. Shah', assistantMentor: 'Mr. K. Patel', motto: 'Courage, care, and commitment', description: 'A spirited house built around teamwork and service.', status: 'Active' },
  { id: 'house-25-blue', year: '2025-26', name: 'Sapphire House', code: 'SAPPHIRE', color: '#4f7ee8', mentor: 'Mr. A. Desai', assistantMentor: 'Ms. P. Mehta', motto: 'Think deeply, act wisely', description: 'A curious community that values learning and integrity.', status: 'Active' },
  { id: 'house-25-green', year: '2025-26', name: 'Emerald House', code: 'EMERALD', color: '#26a269', mentor: 'Ms. N. Trivedi', assistantMentor: 'Mr. H. Joshi', motto: 'Grow together, give back', description: 'A green-minded house focused on sustainability.', status: 'Active' },
  { id: 'house-25-gold', year: '2025-26', name: 'Amber House', code: 'AMBER', color: '#dc9b27', mentor: 'Mr. S. Vyas', assistantMentor: 'Ms. D. Rao', motto: 'Shine through effort', description: 'A house that celebrates creativity and perseverance.', status: 'Active' },
  { id: 'house-25-violet', year: '2025-26', name: 'Violet House', code: 'VIOLET', color: '#8a63cf', mentor: 'Mrs. M. Amin', assistantMentor: 'Mr. P. Shah', motto: 'Imagine, invent, inspire', description: 'A creative house for new ideas and bold thinking.', status: 'Active' },
  { id: 'house-26-red', year: '2026-27', name: 'Ruby House', code: 'RUBY', color: '#e05252', mentor: 'Mrs. R. Shah', assistantMentor: 'Mr. K. Patel', motto: 'Courage, care, and commitment', description: 'A spirited house built around teamwork and service.', status: 'Active' },
  { id: 'house-26-blue', year: '2026-27', name: 'Sapphire House', code: 'SAPPHIRE', color: '#4f7ee8', mentor: 'Mr. A. Desai', assistantMentor: 'Ms. P. Mehta', motto: 'Think deeply, act wisely', description: 'A curious community that values learning and integrity.', status: 'Active' },
  { id: 'house-26-green', year: '2026-27', name: 'Emerald House', code: 'EMERALD', color: '#26a269', mentor: 'Ms. N. Trivedi', assistantMentor: 'Mr. H. Joshi', motto: 'Grow together, give back', description: 'A green-minded house focused on sustainability.', status: 'Active' },
  { id: 'house-26-gold', year: '2026-27', name: 'Amber House', code: 'AMBER', color: '#dc9b27', mentor: 'Mr. S. Vyas', assistantMentor: 'Ms. D. Rao', motto: 'Shine through effort', description: 'A house that celebrates creativity and perseverance.', status: 'Active' }
];

const seedGroups: CoCurricularGroup[] = [
  { id: 'group-25-football', year: '2025-26', name: 'Football Squad', code: 'FOOTBALL', category: 'Sports', description: 'Football training and inter-school fixtures.', mentor: 'Coach M. Rathod', schedule: 'Tue & Thu · 3:30 PM', venue: 'Main Ground', targetClasses: 'Classes 6–12', status: 'Active' },
  { id: 'group-25-robotics', year: '2025-26', name: 'Robotics Club', code: 'ROBOTICS', category: 'Academic', description: 'Build, code, and test robotics projects.', mentor: 'Ms. J. Parikh', schedule: 'Wed · 3:15 PM', venue: 'Innovation Lab', targetClasses: 'Classes 7–12', status: 'Active' },
  { id: 'group-25-choir', year: '2025-26', name: 'School Choir', code: 'CHOIR', category: 'Arts & Culture', description: 'Vocal ensemble for assemblies and school performances.', mentor: 'Mr. D. Fernandes', schedule: 'Mon & Fri · 3:20 PM', venue: 'Music Room', targetClasses: 'Classes 4–12', status: 'Active' },
  { id: 'group-25-eco', year: '2025-26', name: 'Eco Action Club', code: 'ECO', category: 'Service', description: 'Campus gardening, recycling, and local environment projects.', mentor: 'Ms. N. Trivedi', schedule: 'Fri · 3:15 PM', venue: 'Science Garden', targetClasses: 'Classes 5–12', status: 'Active' },
  { id: 'group-25-debate', year: '2025-26', name: 'Debate Society', code: 'DEBATE', category: 'Academic', description: 'Structured discussion, public speaking, and debate tournaments.', mentor: 'Mr. A. Desai', schedule: 'Tue · 3:30 PM', venue: 'Room 204', targetClasses: 'Classes 8–12', status: 'Active' },
  { id: 'group-25-modelun', year: '2025-26', name: 'Model United Nations', code: 'MODELUN', category: 'Leadership', description: 'Diplomacy, research, and conference simulations.', mentor: 'Mrs. M. Amin', schedule: 'Wed · 3:30 PM', venue: 'Conference Room', targetClasses: 'Classes 8–12', status: 'Active' },
  { id: 'group-26-football', year: '2026-27', name: 'Football Squad', code: 'FOOTBALL', category: 'Sports', description: 'Football training and inter-school fixtures.', mentor: 'Coach M. Rathod', schedule: 'Tue & Thu · 3:30 PM', venue: 'Main Ground', targetClasses: 'Classes 6–12', status: 'Active' },
  { id: 'group-26-robotics', year: '2026-27', name: 'Robotics Club', code: 'ROBOTICS', category: 'Academic', description: 'Build, code, and test robotics projects.', mentor: 'Ms. J. Parikh', schedule: 'Wed · 3:15 PM', venue: 'Innovation Lab', targetClasses: 'Classes 7–12', status: 'Active' },
  { id: 'group-26-choir', year: '2026-27', name: 'School Choir', code: 'CHOIR', category: 'Arts & Culture', description: 'Vocal ensemble for assemblies and school performances.', mentor: 'Mr. D. Fernandes', schedule: 'Mon & Fri · 3:20 PM', venue: 'Music Room', targetClasses: 'Classes 4–12', status: 'Active' },
  { id: 'group-26-eco', year: '2026-27', name: 'Eco Action Club', code: 'ECO', category: 'Service', description: 'Campus gardening, recycling, and local environment projects.', mentor: 'Ms. N. Trivedi', schedule: 'Fri · 3:15 PM', venue: 'Science Garden', targetClasses: 'Classes 5–12', status: 'Active' },
  { id: 'group-26-debate', year: '2026-27', name: 'Debate Society', code: 'DEBATE', category: 'Academic', description: 'Structured discussion, public speaking, and debate tournaments.', mentor: 'Mr. A. Desai', schedule: 'Tue · 3:30 PM', venue: 'Room 204', targetClasses: 'Classes 8–12', status: 'Active' }
];

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700"><span>{label}</span>{children}{hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}</label>;
}

function DialogFrame({ title, subtitle, onClose, children, wide = false }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={`max-h-[92vh] w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} overflow-y-auto rounded-2xl bg-white shadow-2xl`} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-white px-5 py-4">
          <div><h2 className="text-lg font-bold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function HouseClubCoCurricularGroupSetup() {
  const [activeTab, setActiveTab] = useState<SetupTab>('Houses');
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [houses, setHouses] = useState<House[]>(seedHouses);
  const [groups, setGroups] = useState<CoCurricularGroup[]>(seedGroups);
  const [dialog, setDialog] = useState<'house' | 'group' | 'copy' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ kind: 'house' | 'group'; id: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const [houseSearch, setHouseSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [groupCategoryFilter, setGroupCategoryFilter] = useState('all');
  const [groupStatusFilter, setGroupStatusFilter] = useState('all');
  const [copyFromYear, setCopyFromYear] = useState('2025-26');
  const [copyToYear, setCopyToYear] = useState(CURRENT_YEAR);
  const [houseForm, setHouseForm] = useState<HouseFormData>({ name: '', code: '', color: '#e05252', mentor: '', assistantMentor: '', motto: '', description: '', status: 'Active' });
  const [groupForm, setGroupForm] = useState<GroupFormData>({ name: '', code: '', category: 'Sports', description: '', mentor: '', schedule: '', venue: '', targetClasses: 'All Classes', status: 'Active' });

  const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => setToast({ message, type });
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const currentHouses = useMemo(() => houses.filter((house) => house.year === selectedYear), [houses, selectedYear]);
  const currentGroups = useMemo(() => groups.filter((group) => group.year === selectedYear), [groups, selectedYear]);
  const filteredHouses = useMemo(() => {
    const query = houseSearch.trim().toLowerCase();
    return currentHouses.filter((house) => `${house.name} ${house.code} ${house.mentor} ${house.assistantMentor}`.toLowerCase().includes(query));
  }, [currentHouses, houseSearch]);
  const filteredGroups = useMemo(() => {
    const query = groupSearch.trim().toLowerCase();
    return currentGroups.filter((group) => {
      const matchesSearch = `${group.name} ${group.code} ${group.mentor} ${group.category} ${group.venue}`.toLowerCase().includes(query);
      const matchesCategory = groupCategoryFilter === 'all' || group.category === groupCategoryFilter;
      const matchesStatus = groupStatusFilter === 'all' || group.status === groupStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [currentGroups, groupSearch, groupCategoryFilter, groupStatusFilter]);

  const openHouseForm = (house?: House) => {
    setEditingId(house?.id || null);
    setHouseForm(house ? {
      name: house.name,
      code: house.code,
      color: house.color,
      mentor: house.mentor,
      assistantMentor: house.assistantMentor,
      motto: house.motto,
      description: house.description,
      status: house.status
    } : { name: '', code: '', color: '#e05252', mentor: '', assistantMentor: '', motto: '', description: '', status: 'Active' });
    setDialog('house');
  };

  const saveHouse = () => {
    const name = houseForm.name.trim();
    const code = houseForm.code.trim().toUpperCase();
    if (!name || !code || !houseForm.mentor.trim()) {
      notify('Enter a house name, short code, and mentor.', 'error');
      return;
    }
    const duplicate = currentHouses.some((house) => house.id !== editingId && (house.code.toLowerCase() === code.toLowerCase() || house.name.toLowerCase() === name.toLowerCase()));
    if (duplicate) {
      notify('A house with this name or code already exists for the selected year.', 'warning');
      return;
    }
    const record: House = { id: editingId || makeId('house'), year: selectedYear, ...houseForm, name, code, status: houseForm.status };
    setHouses((previous) => editingId ? previous.map((house) => house.id === editingId ? record : house) : [...previous, record]);
    setDialog(null);
    setEditingId(null);
    notify(editingId ? 'House details updated.' : 'House created successfully.');
  };

  const openGroupForm = (group?: CoCurricularGroup) => {
    setEditingId(group?.id || null);
    setGroupForm(group ? {
      name: group.name,
      code: group.code,
      category: group.category,
      description: group.description,
      mentor: group.mentor,
      schedule: group.schedule,
      venue: group.venue,
      targetClasses: group.targetClasses,
      status: group.status
    } : { name: '', code: '', category: 'Sports', description: '', mentor: '', schedule: '', venue: '', targetClasses: 'All Classes', status: 'Active' });
    setDialog('group');
  };

  const saveGroup = () => {
    const name = groupForm.name.trim();
    const code = groupForm.code.trim().toUpperCase();
    if (!name || !code || !groupForm.mentor.trim()) {
      notify('Enter a group name, short code, and mentor.', 'error');
      return;
    }
    const duplicate = currentGroups.some((group) => group.id !== editingId && (group.code.toLowerCase() === code.toLowerCase() || group.name.toLowerCase() === name.toLowerCase()));
    if (duplicate) {
      notify('A group with this name or code already exists for the selected year.', 'warning');
      return;
    }
    const record: CoCurricularGroup = { id: editingId || makeId('group'), year: selectedYear, ...groupForm, name, code, status: groupForm.status };
    setGroups((previous) => editingId ? previous.map((group) => group.id === editingId ? record : group) : [...previous, record]);
    setDialog(null);
    setEditingId(null);
    notify(editingId ? 'Group details updated.' : 'Co-curricular group created successfully.');
  };

  const requestDelete = (kind: 'house' | 'group', id: string) => setPendingDelete({ kind, id });
  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'house') setHouses((previous) => previous.filter((house) => house.id !== pendingDelete.id));
    else setGroups((previous) => previous.filter((group) => group.id !== pendingDelete.id));
    const label = pendingDelete.kind === 'house' ? 'House' : 'Co-curricular group';
    setPendingDelete(null);
    notify(`${label} deleted.`);
  };

  const toggleHouseStatus = (house: House) => {
    const status: EntityStatus = house.status === 'Active' ? 'Inactive' : 'Active';
    setHouses((previous) => previous.map((item) => item.id === house.id ? { ...item, status } : item));
    notify(`${house.name} marked ${status.toLowerCase()}.`, 'info');
  };

  const toggleGroupStatus = (group: CoCurricularGroup) => {
    const status: EntityStatus = group.status === 'Active' ? 'Inactive' : 'Active';
    setGroups((previous) => previous.map((item) => item.id === group.id ? { ...item, status } : item));
    notify(`${group.name} marked ${status.toLowerCase()}.`, 'info');
  };

  const openCopyDialog = () => {
    const currentIndex = YEAR_OPTIONS.indexOf(selectedYear);
    setCopyFromYear(YEAR_OPTIONS[Math.max(0, currentIndex - 1)] || selectedYear);
    setCopyToYear(selectedYear);
    setDialog('copy');
  };

  const copyStructure = () => {
    if (copyFromYear === copyToYear) {
      notify('Choose different source and destination academic years.', 'warning');
      return;
    }
    const sourceHouses = houses.filter((house) => house.year === copyFromYear);
    const targetHouses = houses.filter((house) => house.year === copyToYear);
    const newHouses = sourceHouses
      .filter((source) => !targetHouses.some((target) => target.code.toLowerCase() === source.code.toLowerCase() || target.name.toLowerCase() === source.name.toLowerCase()))
      .map((source) => ({ ...source, id: makeId('house'), year: copyToYear }));
    const sourceGroups = groups.filter((group) => group.year === copyFromYear);
    const targetGroups = groups.filter((group) => group.year === copyToYear);
    const newGroups = sourceGroups
      .filter((source) => !targetGroups.some((target) => target.code.toLowerCase() === source.code.toLowerCase() || target.name.toLowerCase() === source.name.toLowerCase()))
      .map((source) => ({ ...source, id: makeId('group'), year: copyToYear }));
    setHouses((previous) => [...previous, ...newHouses]);
    setGroups((previous) => [...previous, ...newGroups]);
    setDialog(null);
    notify(`Copied ${newHouses.length} house(s) and ${newGroups.length} co-curricular group(s).`);
  };

  const exportSetup = () => {
    const payload = { academicYear: selectedYear, houses: currentHouses, coCurricularGroups: currentGroups };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `house-cocurricular-setup-${selectedYear}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify(`Setup for ${selectedYear} exported as JSON.`);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setHouseSearch('');
    setGroupSearch('');
    setGroupCategoryFilter('all');
    setGroupStatusFilter('all');
    setPendingDelete(null);
    setDialog(null);
  };

  const tabActionLabel = activeTab === 'Houses' ? 'Add House' : 'Create Group';
  const houseSummary = [
    { label: 'Houses', value: currentHouses.length, detail: `in ${selectedYear}`, icon: <Building2 className="h-5 w-5" />, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Active Houses', value: currentHouses.filter((house) => house.status === 'Active').length, detail: 'available in this year', icon: <Activity className="h-5 w-5" />, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Co-Curricular Groups', value: currentGroups.length, detail: `in ${selectedYear}`, icon: <Calendar className="h-5 w-5" />, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Active Groups', value: currentGroups.filter((group) => group.status === 'Active').length, detail: 'available in this year', icon: <Activity className="h-5 w-5" />, tone: 'bg-violet-50 text-violet-700' }
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/70 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Building2 className="h-6 w-6" /></div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>Institute Setup</span><ChevronRight className="h-3 w-3" /><span className="font-semibold text-indigo-700">House &amp; Co-Curricular Groups</span></div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">House &amp; Co-Curricular Group Master</h1>
              <p className="mt-1 text-sm text-slate-500">Create and manage houses and co-curricular groups, including their mentors and schedules.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><Calendar className="h-4 w-4 text-slate-500" /><span className="font-medium text-slate-600">Academic Year</span><select aria-label="Academic year" value={selectedYear} onChange={(event) => handleYearChange(event.target.value)} className="cursor-pointer bg-transparent font-semibold text-slate-900 outline-none">{YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
            <Button variant="outline" onClick={openCopyDialog}><Copy className="h-4 w-4" />Copy from Last Year</Button>
            <Button variant="outline" onClick={exportSetup}><Download className="h-4 w-4" />Export Setup</Button>
            <Button onClick={() => activeTab === 'Houses' ? openHouseForm() : openGroupForm()}><Plus className="h-4 w-4" />{tabActionLabel}</Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Setup active</span><span>House and co-curricular structure for the selected academic year.</span><span className="ml-auto text-slate-400">Changes are scoped to {selectedYear}</span></div>
      </header>

      <section aria-label="House and co-curricular overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {houseSummary.map((item) => <Card noPadding key={item.label} className="border border-slate-200 p-4 shadow-sm"><div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>{item.icon}</span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p><p className="mt-1 text-xs text-slate-400">{item.detail}</p></div></div></Card>)}
      </section>

      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label="House and co-curricular setup">
        {(['Houses', 'Co-Curricular Groups'] as SetupTab[]).map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>{tab}</button>)}
      </nav>

      {activeTab === 'Houses' && <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-lg font-bold text-slate-900">House Directory</h2><p className="mt-1 text-sm text-slate-500">Manage house identity, colour, mentors, and status.</p></div>
          <div className="flex flex-wrap items-center gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search houses" placeholder="Search houses or mentors..." value={houseSearch} onChange={(event) => setHouseSearch(event.target.value)} className={`${inputClass} mt-0 w-64 pl-9`} /></div><Button onClick={() => openHouseForm()}><Plus className="h-4 w-4" />Add House</Button></div>
        </div>
        {filteredHouses.length ? <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{filteredHouses.map((house) => <Card noPadding key={house.id} className="overflow-hidden border border-slate-200 p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-4" style={{ borderTop: `4px solid ${house.color}` }}>
            <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: house.color }}>{house.code.slice(0, 2)}</span><div><h3 className="font-bold text-slate-900">{house.name}</h3><p className="text-xs font-medium tracking-wide text-slate-400">{house.code}</p></div></div><Badge variant={house.status === 'Active' ? 'success' : 'secondary'}>{house.status}</Badge></div>
            <p className="mt-3 min-h-10 text-sm italic text-slate-500">“{house.motto || 'A house united in learning and spirit'}”</p>
            <p className="mt-2 min-h-10 text-sm text-slate-600">{house.description || 'No house description has been added.'}</p>
            <div className="mt-4 space-y-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><p><span className="font-semibold text-slate-800">Mentor:</span> {house.mentor || 'Not set'}</p><p><span className="font-semibold text-slate-800">Assistant mentor:</span> {house.assistantMentor || 'Not set'}</p></div>
            <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3"><button type="button" title="Edit house" onClick={() => openHouseForm(house)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"><Edit2 className="h-4 w-4" /></button><button type="button" title={house.status === 'Active' ? 'Deactivate house' : 'Activate house'} onClick={() => toggleHouseStatus(house)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Activity className="h-4 w-4" /></button><button type="button" title="Delete house" onClick={() => requestDelete('house', house.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div>
          </div>
        </Card>)}</div> : <Card noPadding className="border-dashed p-10 text-center"><Building2 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 font-semibold text-slate-700">No houses match this search.</p><p className="mt-1 text-sm text-slate-500">Clear the search or add a house for {selectedYear}.</p></Card>}
      </div>}

      {activeTab === 'Co-Curricular Groups' && <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><h2 className="text-lg font-bold text-slate-900">Co-Curricular Groups</h2><p className="mt-1 text-sm text-slate-500">Create and manage clubs, teams, arts groups, and activities.</p></div><Button onClick={() => openGroupForm()}><Plus className="h-4 w-4" />Create Group</Button></div>
        <Card noPadding className="border border-slate-200 p-4 shadow-sm"><div className="grid gap-3 md:grid-cols-4"><div className="relative md:col-span-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search groups" placeholder="Search name, code, mentor, or venue..." value={groupSearch} onChange={(event) => setGroupSearch(event.target.value)} className={`${inputClass} mt-0 pl-9`} /></div><select aria-label="Filter groups by category" value={groupCategoryFilter} onChange={(event) => setGroupCategoryFilter(event.target.value)} className={`${selectClass} mt-0`}><option value="all">All categories</option>{GROUP_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select><select aria-label="Filter groups by status" value={groupStatusFilter} onChange={(event) => setGroupStatusFilter(event.target.value)} className={`${selectClass} mt-0`}><option value="all">All statuses</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Filter className="h-3.5 w-3.5" />Showing {filteredGroups.length} of {currentGroups.length} groups<span className="ml-auto">Filter by category and status</span></div></Card>
        <Card noPadding className="overflow-hidden border border-slate-200 p-0 shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Group</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Mentor / Schedule</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Applicable Classes</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredGroups.map((group) => <tr key={group.id} className="hover:bg-slate-50"><td className="px-4 py-3"><div className="font-semibold text-slate-800">{group.name}</div><div className="text-xs text-slate-400">{group.code}</div></td><td className="px-4 py-3"><Badge variant="info">{group.category}</Badge></td><td className="px-4 py-3"><div>{group.mentor || '—'}</div><div className="text-xs text-slate-400">{group.schedule || 'Schedule not set'}</div></td><td className="px-4 py-3">{group.venue || '—'}</td><td className="px-4 py-3">{group.targetClasses || 'All Classes'}</td><td className="px-4 py-3"><Badge variant={group.status === 'Active' ? 'success' : 'secondary'}>{group.status}</Badge></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Button size="xs" variant="ghost" title="Edit group" onClick={() => openGroupForm(group)}><Edit2 className="h-4 w-4" /></Button><Button size="xs" variant="ghost" title={group.status === 'Active' ? 'Deactivate group' : 'Activate group'} onClick={() => toggleGroupStatus(group)}><Activity className="h-4 w-4" /></Button><Button size="xs" variant="ghost" title="Delete group" onClick={() => requestDelete('group', group.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button></div></td></tr>)}</tbody></table>{!filteredGroups.length && <div className="p-10 text-center text-sm text-slate-500">No groups match the selected filters.</div>}</div></Card>
      </div>}

      {dialog === 'house' && <DialogFrame title={editingId ? 'Edit House' : 'Create House'} subtitle={`House structure for academic year ${selectedYear}`} onClose={() => setDialog(null)}>
        <div className="grid gap-4 sm:grid-cols-2"><FormField label="House Name"><input className={inputClass} autoFocus value={houseForm.name} onChange={(event) => setHouseForm((previous) => ({ ...previous, name: event.target.value }))} placeholder="e.g. Ruby House" /></FormField><FormField label="Short Code"><input className={inputClass} value={houseForm.code} onChange={(event) => setHouseForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))} placeholder="e.g. RUBY" /></FormField><FormField label="House Colour"><input className={`${inputClass} h-11 p-1`} type="color" value={houseForm.color} onChange={(event) => setHouseForm((previous) => ({ ...previous, color: event.target.value }))} /></FormField><FormField label="House Mentor"><input className={inputClass} value={houseForm.mentor} onChange={(event) => setHouseForm((previous) => ({ ...previous, mentor: event.target.value }))} placeholder="Teacher or staff name" /></FormField><FormField label="Assistant Mentor"><input className={inputClass} value={houseForm.assistantMentor} onChange={(event) => setHouseForm((previous) => ({ ...previous, assistantMentor: event.target.value }))} placeholder="Optional" /></FormField><FormField label="House Motto"><input className={inputClass} value={houseForm.motto} onChange={(event) => setHouseForm((previous) => ({ ...previous, motto: event.target.value }))} placeholder="A short house motto" /></FormField><FormField label="Status"><select className={selectClass} value={houseForm.status} onChange={(event) => setHouseForm((previous) => ({ ...previous, status: event.target.value as EntityStatus }))}><option>Active</option><option>Inactive</option></select></FormField><div className="sm:col-span-2"><FormField label="Description"><textarea className={textareaClass} value={houseForm.description} onChange={(event) => setHouseForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Purpose, identity, or other house details" /></FormField></div></div>
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={saveHouse}><Check className="h-4 w-4" />{editingId ? 'Save Changes' : 'Create House'}</Button></div>
      </DialogFrame>}

      {dialog === 'group' && <DialogFrame title={editingId ? 'Edit Co-Curricular Group' : 'Create Co-Curricular Group'} subtitle={`Group setup for ${selectedYear}`} onClose={() => setDialog(null)} wide>
        <div className="grid gap-4 sm:grid-cols-2"><FormField label="Group Name"><input className={inputClass} autoFocus value={groupForm.name} onChange={(event) => setGroupForm((previous) => ({ ...previous, name: event.target.value }))} placeholder="e.g. Robotics Club" /></FormField><FormField label="Short Code"><input className={inputClass} value={groupForm.code} onChange={(event) => setGroupForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))} placeholder="e.g. ROBOTICS" /></FormField><FormField label="Category"><select className={selectClass} value={groupForm.category} onChange={(event) => setGroupForm((previous) => ({ ...previous, category: event.target.value as GroupCategory }))}>{GROUP_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></FormField><FormField label="Faculty Mentor / In-charge"><input className={inputClass} value={groupForm.mentor} onChange={(event) => setGroupForm((previous) => ({ ...previous, mentor: event.target.value }))} placeholder="Teacher or staff name" /></FormField><FormField label="Meeting Schedule"><input className={inputClass} value={groupForm.schedule} onChange={(event) => setGroupForm((previous) => ({ ...previous, schedule: event.target.value }))} placeholder="e.g. Wednesday · 3:15 PM" /></FormField><FormField label="Venue"><input className={inputClass} value={groupForm.venue} onChange={(event) => setGroupForm((previous) => ({ ...previous, venue: event.target.value }))} placeholder="Room, lab, or field" /></FormField><FormField label="Applicable Classes"><input className={inputClass} value={groupForm.targetClasses} onChange={(event) => setGroupForm((previous) => ({ ...previous, targetClasses: event.target.value }))} placeholder="e.g. Classes 7–12 or All Classes" /></FormField><FormField label="Status"><select className={selectClass} value={groupForm.status} onChange={(event) => setGroupForm((previous) => ({ ...previous, status: event.target.value as EntityStatus }))}><option>Active</option><option>Inactive</option></select></FormField><div className="sm:col-span-2"><FormField label="Group Description"><textarea className={textareaClass} value={groupForm.description} onChange={(event) => setGroupForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Purpose, activities, and other group details" /></FormField></div></div>
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={saveGroup}><Check className="h-4 w-4" />{editingId ? 'Save Changes' : 'Create Group'}</Button></div>
      </DialogFrame>}

      {dialog === 'copy' && <DialogFrame title="Copy from Last Year" subtitle="Copy house and group setup records into another academic year." onClose={() => setDialog(null)}>
        <div className="grid gap-4 sm:grid-cols-2"><FormField label="Copy Structure From"><select className={selectClass} value={copyFromYear} onChange={(event) => setCopyFromYear(event.target.value)}>{YEAR_OPTIONS.map((year) => <option key={year}>{year}</option>)}</select></FormField><FormField label="Copy Structure To"><select className={selectClass} value={copyToYear} onChange={(event) => setCopyToYear(event.target.value)}>{YEAR_OPTIONS.map((year) => <option key={year}>{year}</option>)}</select></FormField></div>
        <p className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">Only house and co-curricular group definitions are copied. Existing records in the destination year are kept.</p>
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={copyStructure}><Copy className="h-4 w-4" />Copy Structure</Button></div>
      </DialogFrame>}

      {pendingDelete && <DialogFrame title={`Delete ${pendingDelete.kind === 'house' ? 'House' : 'Co-Curricular Group'}?`} subtitle="This action cannot be undone." onClose={() => setPendingDelete(null)}>
        <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><p className="text-sm text-rose-800">This removes the selected setup record for {selectedYear}.</p></div>
        <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}><Trash2 className="h-4 w-4" />Delete</Button></div>
      </DialogFrame>}

      {toast && <div className={`fixed bottom-5 right-5 z-[100] flex max-w-lg items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${toast.type === 'success' ? 'bg-slate-900' : toast.type === 'warning' ? 'bg-amber-700' : toast.type === 'error' ? 'bg-rose-700' : 'bg-indigo-700'}`}><span className="flex-1">{toast.message}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)} className="rounded p-1 hover:bg-white/10"><X className="h-4 w-4" /></button></div>}
    </div>
  );
}
