import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Calendar, ChevronLeft, ChevronRight, Plus, Save, Trash2, X } from 'lucide-react';

type EntryKind = 'holiday' | 'block';

export const INSTITUTE_HOLIDAY_STORE = 'k12-institute-holiday-lists-v1';

interface CalendarItem {
  id: number;
  name: string;
  kind: EntryKind;
  startDate: string;
  endDate: string;
  allowUsers: string[];
  category?: string;
  paid?: boolean;
  recurrence?: 'One-time' | 'Annual';
}

interface HolidayList {
  id: string;
  name: string;
  academicYear: string;
  campus?: string;
  appliesTo?: string[];
  status?: 'Draft' | 'Active' | 'Inactive';
  effectiveFrom?: string;
  effectiveTo?: string;
  description?: string;
  items: CalendarItem[];
}

const academicYearOptions = ['2024-25', '2025-26', '2026-27', '2027-28'].map((year) => ({ value: year, label: year }));
const staffOptions = [
  { value: 'EMP001', label: 'Dr. Rajesh Kumar' },
  { value: 'EMP002', label: 'Priya Sharma' },
  { value: 'EMP003', label: 'Neeta Mishra' },
  { value: 'EMP004', label: 'Amit Rao' },
  { value: 'EMP005', label: 'Kavita Das' },
  { value: 'EMP006', label: 'Sarah Wilson' },
  { value: 'EMP007', label: 'Ramesh Patel' },
  { value: 'EMP008', label: 'Michael Chen' },
];

const dateToInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const readDate = (value: string) => new Date(`${value}T00:00:00`);
const formatDate = (value: string) => (value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(readDate(value)) : '—');
const dayHeadings = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const INITIAL_LISTS: HolidayList[] = [
  {
    id: 'HL-2026-MAIN',
    name: 'Main Campus Staff Holidays 2026–27',
    academicYear: '2026-27',
    campus: 'Main Campus',
    appliesTo: ['All Staff'],
    status: 'Active',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    items: [
      { id: 1, name: 'Gandhi Jayanti', kind: 'holiday', startDate: '2026-10-02', endDate: '2026-10-02', allowUsers: [], category: 'National', paid: true, recurrence: 'Annual' },
      { id: 2, name: 'Diwali Break', kind: 'holiday', startDate: '2026-11-08', endDate: '2026-11-12', allowUsers: [], category: 'Festival', paid: true, recurrence: 'One-time' },
      { id: 3, name: 'Staff training block', kind: 'block', startDate: '2026-09-12', endDate: '2026-09-13', allowUsers: ['EMP001', 'EMP002'] },
    ],
  },
];

export function InstituteCalendarWorkingDays() {
  const [lists, setLists] = useState<HolidayList[]>(() => {
    try {
      const raw = localStorage.getItem(INSTITUTE_HOLIDAY_STORE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return INITIAL_LISTS;
  });
  const [listName, setListName] = useState('');
  const [listYear, setListYear] = useState('2026-27');
  const [listCampus, setListCampus] = useState('Main Campus');
  const [listStatus, setListStatus] = useState<'Draft' | 'Active' | 'Inactive'>('Draft');
  const [itemCategory, setItemCategory] = useState('Festival');
  const [itemPaid, setItemPaid] = useState('yes');
  const [itemRecurrence, setItemRecurrence] = useState<'One-time' | 'Annual'>('One-time');
  const [showCreateList, setShowCreateList] = useState(false);
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [panelKind, setPanelKind] = useState<EntryKind | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rangeMode, setRangeMode] = useState(false);
  const [allowUsers, setAllowUsers] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { localStorage.setItem(INSTITUTE_HOLIDAY_STORE, JSON.stringify(lists)); } catch { /* ignore */ }
  }, [lists]);

  const openList = lists.find((list) => list.id === openListId) ?? null;
  const monthTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(selectedYear, selectedMonth, 1));

  const visibleDates = useMemo(() => {
    const monthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstOffset = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7;
    const count = Math.ceil((firstOffset + monthDays) / 7) * 7;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(selectedYear, selectedMonth, index - firstOffset + 1);
      return { date: dateToInput(date), inMonth: date.getMonth() === selectedMonth };
    });
  }, [selectedYear, selectedMonth]);

  const itemsForDate = (date: string) => (openList?.items || []).filter((item) => item.startDate <= date && item.endDate >= date);

  const changeMonth = (offset: number) => {
    const next = new Date(selectedYear, selectedMonth + offset, 1);
    setSelectedMonth(next.getMonth());
    setSelectedYear(next.getFullYear());
  };

  const openYearFromList = (year: string) => Number(year.match(/\d{4}/)?.[0] || 2025);

  const saveList = () => {
    if (!listName.trim()) {
      setNotice('Name the holiday list.');
      return;
    }
    const id = `HL-${Date.now()}`;
    setLists((prev) => [...prev, { id, name: listName.trim(), academicYear: listYear, campus: listCampus, appliesTo: ['All Staff'], status: listStatus, effectiveFrom: `${listYear.slice(0, 4)}-04-01`, effectiveTo: `${Number(listYear.slice(0, 4)) + 1}-03-31`, items: [] }]);
    setListName('');
    setShowCreateList(false);
    setOpenListId(id);
    setSelectedYear(openYearFromList(listYear));
    setSelectedMonth(8);
    setNotice('');
  };

  const openPanel = (kind: EntryKind, date?: string, existing?: CalendarItem) => {
    setPanelKind(kind);
    if (existing) {
      setEditingId(existing.id);
      setItemName(existing.name);
      setStartDate(existing.startDate);
      setEndDate(existing.endDate);
      setRangeMode(existing.startDate !== existing.endDate);
      setAllowUsers(existing.allowUsers);
      return;
    }
    const day = date || dateToInput(new Date(selectedYear, selectedMonth, 1));
    setEditingId(null);
    setItemName('');
    setStartDate(day);
    setEndDate(day);
    setRangeMode(false);
    setAllowUsers([]);
  };

  const saveItem = () => {
    if (!openList) return;
    if (!itemName.trim() || !startDate) {
      setNotice('Enter a name and date.');
      return;
    }
    const end = rangeMode ? (endDate || startDate) : startDate;
    if (end < startDate) {
      setNotice('To date must be on or after From date.');
      return;
    }
    const nextItem: CalendarItem = {
      id: editingId ?? Math.max(0, ...openList.items.map((item) => item.id)) + 1,
      name: itemName.trim(),
      kind: panelKind || 'holiday',
      startDate,
      endDate: end,
      allowUsers: panelKind === 'block' ? allowUsers : [],
      category: panelKind === 'holiday' ? itemCategory : undefined,
      paid: panelKind === 'holiday' ? itemPaid === 'yes' : undefined,
      recurrence: panelKind === 'holiday' ? itemRecurrence : undefined,
    };
    setLists((prev) => prev.map((list) => {
      if (list.id !== openList.id) return list;
      const items = editingId
        ? list.items.map((item) => (item.id === editingId ? nextItem : item))
        : [...list.items, nextItem];
      return { ...list, items: items.sort((a, b) => a.startDate.localeCompare(b.startDate)) };
    }));
    setPanelKind(null);
    setNotice('');
  };

  const deleteItem = (id: number) => {
    if (!openList) return;
    setLists((prev) => prev.map((list) => (
      list.id === openList.id ? { ...list, items: list.items.filter((item) => item.id !== id) } : list
    )));
    setPanelKind(null);
  };

  if (!openList) {
    return (
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institute Calendar & Working Days</h1>
            <p className="text-sm text-gray-500">Create a holiday list for an academic year, then add holidays on the calendar</p>
          </div>
          <Button onClick={() => setShowCreateList(true)}><Plus className="h-4 w-4" /> Create Holiday List</Button>
        </div>

        {showCreateList && (
          <Card title="Create holiday list">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="List name" value={listName} onChange={(e) => setListName(e.target.value)} placeholder="e.g. Main Campus Staff Holidays 2026–27" />
              <Select label="Academic year" options={academicYearOptions} value={listYear} onChange={setListYear} />
              <Select label="Campus" options={[{ value: 'All campuses', label: 'All campuses' }, { value: 'Main Campus', label: 'Main Campus' }, { value: 'City Centre Branch', label: 'City Centre Branch' }, { value: 'North Zone Campus', label: 'North Zone Campus' }]} value={listCampus} onChange={setListCampus} />
              <Select label="Status" options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={listStatus} onChange={(value) => setListStatus(value as 'Draft' | 'Active' | 'Inactive')} />
            </div>
            {notice && <p className="mt-2 text-sm text-red-600">{notice}</p>}
            <div className="mt-4 flex gap-2">
              <Button onClick={saveList}><Save className="h-4 w-4" /> Save list</Button>
              <Button variant="outline" onClick={() => { setShowCreateList(false); setNotice(''); }}>Cancel</Button>
            </div>
          </Card>
        )}

        <Card title="Holiday lists">
          {lists.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No holiday lists yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">List</th>
                    <th className="px-3 py-2">Year</th>
                    <th className="px-3 py-2">Campus</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Holidays</th>
                    <th className="px-3 py-2">Leave blocks</th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((list) => (
                    <tr key={list.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="font-medium text-blue-700"
                          onClick={() => {
                            setOpenListId(list.id);
                            setSelectedYear(openYearFromList(list.academicYear));
                            setSelectedMonth(8);
                          }}
                        >
                          {list.name}
                        </button>
                      </td>
                      <td className="px-3 py-2">{list.academicYear}</td>
                      <td className="px-3 py-2">{list.campus || '—'}</td>
                      <td className="px-3 py-2">{list.status || 'Draft'}</td>
                      <td className="px-3 py-2">{list.items.filter((item) => item.kind === 'holiday').length}</td>
                      <td className="px-3 py-2">{list.items.filter((item) => item.kind === 'block').length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button type="button" className="mb-1 inline-flex items-center gap-1 text-sm text-blue-700" onClick={() => { setOpenListId(null); setPanelKind(null); }}>
            <ChevronLeft className="h-4 w-4" /> All holiday lists
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{openList.name}</h1>
          <p className="text-sm text-gray-500">Academic year {openList.academicYear}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => openPanel('holiday')}><Plus className="h-4 w-4" /> Add Holiday</Button>
          <Button variant="outline" onClick={() => openPanel('block')}><Plus className="h-4 w-4" /> Add Block Leaves</Button>
        </div>
      </div>

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          <h2 className="flex items-center gap-2 font-bold text-gray-900"><Calendar className="h-5 w-5 text-blue-600" /> Calendar</h2>
          <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
            <Button size="sm" variant="ghost" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="min-w-40 text-center text-sm font-semibold">{monthTitle}</span>
            <Button size="sm" variant="ghost" onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-7 gap-1">
            {dayHeadings.map((day) => <div key={day} className="rounded bg-gray-100 py-2 text-center text-[10px] font-bold tracking-wide text-gray-500">{day}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {visibleDates.map(({ date, inMonth }) => {
              const dayItems = itemsForDate(date);
              return (
                <div
                  key={date}
                  className={`min-h-[110px] cursor-pointer rounded-lg border p-1.5 ${inMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}`}
                  onClick={() => openPanel('holiday', date)}
                >
                  <p className={`px-1 text-xs font-bold ${inMonth ? 'text-gray-800' : 'text-gray-400'}`}>{readDate(date).getDate()}</p>
                  <div className="mt-1 space-y-1">
                    {dayItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`block w-full truncate rounded px-1.5 py-1 text-left text-[10px] font-semibold text-white ${item.kind === 'block' ? 'bg-amber-600' : 'bg-rose-600'}`}
                        onClick={(event) => { event.stopPropagation(); openPanel(item.kind, item.startDate, item); }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 border-t bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-600" /> Holiday</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-600" /> Block leave</span>
          <span>Click a date to add a holiday</span>
        </div>
      </Card>

      {panelKind && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setPanelKind(null); }}>
          <aside className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} {panelKind === 'block' ? 'Block Leaves' : 'Holiday'}</h2>
                <p className="text-xs text-gray-500">{panelKind === 'block' ? 'Block leave dates for selected staff' : 'Name the holiday and pick a day or a date range'}</p>
              </div>
              <button type="button" onClick={() => setPanelKind(null)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-5">
              <Input label={panelKind === 'block' ? 'Block leave name' : 'Holiday name'} value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder={panelKind === 'block' ? 'e.g. Exam duty block' : 'e.g. Diwali'} />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={rangeMode} onChange={(e) => { setRangeMode(e.target.checked); if (!e.target.checked) setEndDate(startDate); }} />
                Multiple days
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label={rangeMode ? 'From date' : 'Date'} type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (!rangeMode) setEndDate(e.target.value); }} />
                {rangeMode && <Input label="To date" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />}
              </div>
              {panelKind === 'holiday' && (
                <>
                  <Select label="Holiday category" options={['National', 'Festival', 'Institutional', 'Exam', 'Other'].map((item) => ({ value: item, label: item }))} value={itemCategory} onChange={setItemCategory} />
                  <Select label="Paid holiday" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value={itemPaid} onChange={setItemPaid} />
                  <Select label="Recurrence" options={[{ value: 'One-time', label: 'One-time' }, { value: 'Annual', label: 'Annual (proposed for later review)' }]} value={itemRecurrence} onChange={(value) => setItemRecurrence(value as 'One-time' | 'Annual')} />
                </>
              )}
              {panelKind === 'block' && (
                <>
                  <MultiSelect label="Allow Users" options={staffOptions} value={allowUsers} onChange={setAllowUsers} placeholder="Select staff" />
                  <p className="text-xs text-gray-500">A leave-block is not automatically a holiday or non-working day. Payroll previews do not count it as a holiday unless it is also saved as one.</p>
                </>
              )}
              {notice && <p className="text-sm text-red-600">{notice}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
              <Button variant="outline" onClick={() => setPanelKind(null)}>Cancel</Button>
              {editingId !== null && <Button variant="danger" onClick={() => deleteItem(editingId)}><Trash2 className="h-4 w-4" /> Delete</Button>}
              <Button onClick={saveItem}><Save className="h-4 w-4" /> Save</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default InstituteCalendarWorkingDays;
