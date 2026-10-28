import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Plus, Edit, Trash2, Save, Search, Calendar, Copy } from 'lucide-react';
import {
  PAYROLL_CAMPUSES,
  PAYROLL_STAFF_CATEGORIES,
  WEEKDAY_OPTIONS,
  loadPayrollPolicyConfig,
  savePayrollPolicyConfig,
  subscribePayrollPolicyConfig,
  type WorkingHolidayCalendarRecord,
  type WorkingHoliday,
  type WorkingSpecialDay
} from '../payroll/PayrollSetup';

const staffOpts = PAYROLL_STAFF_CATEGORIES.map((item) => ({ value: item, label: item }));
const dayOpts = WEEKDAY_OPTIONS.map((item) => ({ value: item, label: item }));
const campusOpts = PAYROLL_CAMPUSES.filter((item) => item.value !== 'all');

const emptyCalendar = (): WorkingHolidayCalendarRecord => ({
  id: `WC-${Date.now()}`,
  name: '',
  campusId: 'main',
  staffTypes: [],
  effectiveFrom: '',
  effectiveTo: '',
  status: 'Draft',
  weeklyOffDays: ['Sunday'],
  saturdayPattern: 'none',
  holidays: [],
  specialDays: []
});

export function WorkingCalendarMaster() {
  const boot = loadPayrollPolicyConfig();
  const [calendars, setCalendars] = useState<WorkingHolidayCalendarRecord[]>(boot.config.workingCalendars);
  const [selectedId, setSelectedId] = useState(boot.config.workingCalendars[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'weekly-off' | 'holidays' | 'special-days'>('weekly-off');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(boot.warning || '');
  const [calendarForm, setCalendarForm] = useState(emptyCalendar());
  const [holidayForm, setHolidayForm] = useState({ date: '', name: '', type: 'Festival', applicableTo: [] as string[], treatAsWorking: false });
  const [specialForm, setSpecialForm] = useState({ date: '', description: '', appliesTo: [] as string[], overrideType: 'Off-to-Working' as WorkingSpecialDay['overrideType'] });

  const persist = (next: WorkingHolidayCalendarRecord[], success?: string) => {
    const loaded = loadPayrollPolicyConfig();
    const result = savePayrollPolicyConfig({ ...loaded.config, workingCalendars: next });
    if (!result.ok) { setNotice(result.error || 'Save failed. Edits remain on screen.'); return false; }
    setCalendars(next); setNotice(success || 'Saved in this browser only.'); return true;
  };

  useEffect(() => subscribePayrollPolicyConfig(() => {
    const next = loadPayrollPolicyConfig();
    setCalendars(next.config.workingCalendars);
  }), []);

  const selected = calendars.find((item) => item.id === selectedId);
  const referenced = (id: string) => {
    const { config } = loadPayrollPolicyConfig();
    return config.policies.some((item) => item.workingCalendarId === id) || config.snapshots.some((item) => item.workingCalendarId === id);
  };

  const saveCalendar = () => {
    if (!calendarForm.name.trim()) { setNotice('Calendar name is required.'); return; }
    if (editId) persist(calendars.map((item) => item.id === editId ? { ...calendarForm, id: editId } : item), 'Calendar updated.');
    else {
      const created = { ...calendarForm, id: `WC-${Date.now()}` };
      persist([...calendars, created], 'Calendar created.');
      setSelectedId(created.id);
    }
    setShowForm(false); setEditId(null);
  };

  const cloneCalendar = (item: WorkingHolidayCalendarRecord) => {
    const copy = { ...item, id: `WC-${Date.now()}`, name: `${item.name} (copy)`, status: 'Draft' as const, sample: false, holidays: item.holidays.map((h) => ({ ...h, id: `H-${Date.now()}-${h.id}` })), specialDays: item.specialDays.map((s) => ({ ...s, id: `SD-${Date.now()}-${s.id}` })) };
    persist([...calendars, copy], 'Calendar cloned as draft.');
  };

  const deleteCalendar = (item: WorkingHolidayCalendarRecord) => {
    if (referenced(item.id)) { setNotice('This calendar is selected on a saved payroll policy or preview and cannot be deleted.'); return; }
    persist(calendars.filter((row) => row.id !== item.id), 'Calendar deleted.');
    if (selectedId === item.id) setSelectedId(calendars.find((row) => row.id !== item.id)?.id || '');
  };

  const addHoliday = () => {
    if (!selected || !holidayForm.date || !holidayForm.name) { setNotice('Holiday date and name are required.'); return; }
    const row: WorkingHoliday = { id: `H-${Date.now()}`, date: holidayForm.date, name: holidayForm.name, type: holidayForm.type, applicableTo: holidayForm.applicableTo, treatAsWorking: holidayForm.treatAsWorking };
    persist(calendars.map((item) => item.id === selected.id ? { ...item, holidays: [...item.holidays, row] } : item), 'Holiday added.');
    setHolidayForm({ date: '', name: '', type: 'Festival', applicableTo: [], treatAsWorking: false });
  };
  const addSpecial = () => {
    if (!selected || !specialForm.date || !specialForm.description) { setNotice('Special-day date and description are required.'); return; }
    const row: WorkingSpecialDay = { id: `SD-${Date.now()}`, ...specialForm };
    persist(calendars.map((item) => item.id === selected.id ? { ...item, specialDays: [...item.specialDays, row] } : item), 'Special day added.');
    setSpecialForm({ date: '', description: '', appliesTo: [], overrideType: 'Off-to-Working' });
  };

  const filteredCalendars = calendars.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Working Calendar Master</h1>
          <p className="text-sm text-gray-500">Named working/holiday calendars for campus and staff groups. Saturdays are not assumed off.</p>
        </div>
        <Button variant="primary" onClick={() => { setCalendarForm(emptyCalendar()); setEditId(null); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" />Add New</Button>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div><div><p className="text-xl font-bold">{calendars.length}</p><p className="text-xs text-gray-500">Calendars</p></div></div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-green-600" /></div><div><p className="text-xl font-bold">{calendars.reduce((sum, item) => sum + item.holidays.length, 0)}</p><p className="text-xs text-gray-500">Holidays</p></div></div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-purple-600" /></div><div><p className="text-xl font-bold">{calendars.reduce((sum, item) => sum + item.specialDays.length, 0)}</p><p className="text-xs text-gray-500">Special Days</p></div></div>
      </div>

      {showForm && <Card title={editId ? 'Edit working calendar' : 'Add working calendar'}>
        <div className="grid gap-4 mb-4 md:grid-cols-2">
          <Input label="Calendar name *" value={calendarForm.name} onChange={(e) => setCalendarForm({ ...calendarForm, name: e.target.value })} />
          <Select label="Campus *" options={campusOpts} value={calendarForm.campusId} onChange={(e) => setCalendarForm({ ...calendarForm, campusId: typeof e === 'string' ? e : e.target.value })} />
          <div className="md:col-span-2"><MultiSelect label="Applicable staff types" options={staffOpts} value={calendarForm.staffTypes} onChange={(value) => setCalendarForm({ ...calendarForm, staffTypes: value })} /></div>
          <div className="md:col-span-2"><MultiSelect label="Weekly off days" options={dayOpts} value={calendarForm.weeklyOffDays} onChange={(value) => setCalendarForm({ ...calendarForm, weeklyOffDays: value })} /></div>
          <Select label="Saturday pattern" options={[{ value: 'none', label: 'Saturdays working (unless listed as off)' }, { value: 'all', label: 'All Saturdays off' }, { value: '2nd-4th', label: '2nd and 4th Saturday off' }, { value: '1st-3rd', label: '1st and 3rd Saturday off' }]} value={calendarForm.saturdayPattern} onChange={(e) => setCalendarForm({ ...calendarForm, saturdayPattern: (typeof e === 'string' ? e : e.target.value) as WorkingHolidayCalendarRecord['saturdayPattern'] })} />
          <Select label="Status" options={['Draft', 'Active', 'Inactive'].map((v) => ({ value: v, label: v }))} value={calendarForm.status} onChange={(e) => setCalendarForm({ ...calendarForm, status: (typeof e === 'string' ? e : e.target.value) as WorkingHolidayCalendarRecord['status'] })} />
          <Input label="Effective from" type="date" value={calendarForm.effectiveFrom} onChange={(e) => setCalendarForm({ ...calendarForm, effectiveFrom: e.target.value })} />
          <Input label="Effective to" type="date" value={calendarForm.effectiveTo} onChange={(e) => setCalendarForm({ ...calendarForm, effectiveTo: e.target.value })} />
        </div>
        <div className="flex gap-2"><Button onClick={saveCalendar}><Save className="w-4 h-4 mr-2" />{editId ? 'Update' : 'Create'}</Button><Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button></div>
      </Card>}

      <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search calendars..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /></div>

      <Card title="Calendars">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2 text-left">Name</th><th>Campus</th><th>Staff</th><th>Weekly offs</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredCalendars.map((item) => (
                <tr key={item.id} className={`border-t ${selectedId === item.id ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2"><button type="button" className="text-left font-semibold text-blue-700" onClick={() => setSelectedId(item.id)}>{item.name}{item.sample ? ' (sample)' : ''}</button><p className="text-xs text-gray-400">{item.id}</p></td>
                  <td>{PAYROLL_CAMPUSES.find((c) => c.value === item.campusId)?.label || item.campusId}</td>
                  <td>{item.staffTypes.join(', ') || '—'}</td>
                  <td>{item.weeklyOffDays.join(', ')}{item.saturdayPattern !== 'none' ? ` · Sat ${item.saturdayPattern}` : ''}</td>
                  <td><Badge variant={item.status === 'Active' ? 'success' : 'secondary'}>{item.status}</Badge></td>
                  <td>
                    <button type="button" className="p-1.5" title="Edit" onClick={() => { setCalendarForm({ ...item }); setEditId(item.id); setShowForm(true); }}><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button type="button" className="p-1.5" title="Clone" onClick={() => cloneCalendar(item)}><Copy className="w-4 h-4 text-gray-500" /></button>
                    <button type="button" className="p-1.5" title="Delete" onClick={() => deleteCalendar(item)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <>
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white">
          {([{ id: 'weekly-off', label: 'Weekly Off Patterns' }, { id: 'holidays', label: 'Holiday Calendar' }, { id: 'special-days', label: 'Special Working Days' }] as const).map((item) => (
            <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${activeTab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>
          ))}
        </div>
        {activeTab === 'weekly-off' && <Card title={`Weekly offs · ${selected.name}`}><div className="p-4 text-sm text-gray-700">
          <p>Off days: {selected.weeklyOffDays.join(', ') || 'None'}</p>
          <p>Saturday pattern: {selected.saturdayPattern}</p>
          <p>Staff types: {selected.staffTypes.join(', ') || '—'}</p>
          <p className="mt-2 text-xs text-gray-500">Edit the calendar to change weekly-off days. Working Saturdays are allowed.</p>
        </div></Card>}
        {activeTab === 'holidays' && <Card title="Holidays">
          <div className="grid gap-3 p-4 md:grid-cols-2">
            <Input label="Date *" type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} />
            <Input label="Holiday name *" value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} />
            <Select label="Type" options={['National', 'Festival', 'Institutional', 'Exam', 'Other'].map((v) => ({ value: v, label: v }))} value={holidayForm.type} onChange={(e) => setHolidayForm({ ...holidayForm, type: typeof e === 'string' ? e : e.target.value })} />
            <MultiSelect label="Holiday applicability" options={staffOpts} value={holidayForm.applicableTo} onChange={(value) => setHolidayForm({ ...holidayForm, applicableTo: value })} />
            <Select label="Treat as working day" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} value={holidayForm.treatAsWorking ? 'yes' : 'no'} onChange={(e) => setHolidayForm({ ...holidayForm, treatAsWorking: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
            <div className="flex items-end"><Button onClick={addHoliday}>Add holiday</Button></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2 text-left">Date</th><th>Name</th><th>Applies to</th><th></th></tr></thead><tbody>{selected.holidays.map((h) => <tr key={h.id} className="border-t"><td className="px-3 py-2">{h.date}</td><td>{h.name}</td><td>{h.applicableTo.join(', ') || '—'}</td><td><button type="button" onClick={() => persist(calendars.map((item) => item.id === selected.id ? { ...item, holidays: item.holidays.filter((row) => row.id !== h.id) } : item))}><Trash2 className="h-4 w-4 text-red-500" /></button></td></tr>)}</tbody></table></div>
        </Card>}
        {activeTab === 'special-days' && <Card title="Special days">
          <div className="grid gap-3 p-4 md:grid-cols-2">
            <Input label="Date *" type="date" value={specialForm.date} onChange={(e) => setSpecialForm({ ...specialForm, date: e.target.value })} />
            <Input label="Description *" value={specialForm.description} onChange={(e) => setSpecialForm({ ...specialForm, description: e.target.value })} />
            <Select label="Override" options={[{ value: 'Off-to-Working', label: 'Off → Working' }, { value: 'Working-to-Off', label: 'Working → Off' }]} value={specialForm.overrideType} onChange={(e) => setSpecialForm({ ...specialForm, overrideType: (typeof e === 'string' ? e : e.target.value) as WorkingSpecialDay['overrideType'] })} />
            <MultiSelect label="Special-day applicability" options={staffOpts} value={specialForm.appliesTo} onChange={(value) => setSpecialForm({ ...specialForm, appliesTo: value })} />
            <div className="flex items-end"><Button onClick={addSpecial}>Add special day</Button></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2 text-left">Date</th><th>Description</th><th>Type</th><th>Applies to</th></tr></thead><tbody>{selected.specialDays.map((s) => <tr key={s.id} className="border-t"><td className="px-3 py-2">{s.date}</td><td>{s.description}</td><td>{s.overrideType}</td><td>{s.appliesTo.join(', ') || '—'}</td></tr>)}</tbody></table></div>
        </Card>}
      </>}
    </div>
  );
}
