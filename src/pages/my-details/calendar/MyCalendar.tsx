// MyCalendar.tsx — School Calendar
//
// Opened from the Calendar icon in the header (and from My Details ▸ Calendar).
// Month / week / agenda views over the institute calendar: exams, holidays,
// events, meetings, sports, fee dues and PTMs — with a day detail panel.
import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Download,
  Search,
  MapPin,
  Clock,
  Users,
  Filter,
  PartyPopper,
  GraduationCap,
  Banknote,
  Trophy,
  Presentation,
  BookOpen,
  Landmark
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

type CalCategory =
  | 'Holiday'
  | 'Examination'
  | 'Event'
  | 'Meeting'
  | 'Sports'
  | 'Fee Due'
  | 'PTM'
  | 'Academic';

interface CalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: CalCategory;
  time?: string;
  venue?: string;
  audience?: string;
  status: 'Confirmed' | 'Tentative' | 'Completed';
}

const CAT_META: Record<CalCategory, { dot: string; chip: string; icon: React.ElementType }> = {
  Holiday: { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200', icon: PartyPopper },
  Examination: { dot: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: GraduationCap },
  Event: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: BookOpen },
  Meeting: { dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700 border-sky-200', icon: Users },
  Sports: { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Trophy },
  'Fee Due': { dot: 'bg-orange-500', chip: 'bg-orange-50 text-orange-700 border-orange-200', icon: Banknote },
  PTM: { dot: 'bg-purple-500', chip: 'bg-purple-50 text-purple-700 border-purple-200', icon: Presentation },
  Academic: { dot: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 border-teal-200', icon: Landmark }
};

const EVENTS: CalEvent[] = [
  { id: 'c1', date: '2025-09-05', title: "Teacher's Day Celebration", category: 'Event', time: '09:00 AM', venue: 'Auditorium', audience: 'Whole school', status: 'Completed' },
  { id: 'c2', date: '2025-09-08', title: 'Term 1 Unit Test begins', category: 'Examination', time: '08:30 AM', venue: 'Exam Halls', audience: 'Classes 6-10', status: 'Completed' },
  { id: 'c3', date: '2025-09-12', title: 'Unit Test — Mathematics (8A, 8B, 9A)', category: 'Examination', time: '09:00 AM', venue: 'Room 204', audience: 'Class 8A, 8B, 9A', status: 'Completed' },
  { id: 'c4', date: '2025-09-15', title: 'Fee Due — Term 1 instalment 2', category: 'Fee Due', venue: 'Accounts Office', audience: 'All parents', status: 'Completed' },
  { id: 'c5', date: '2025-09-17', title: 'Staff Academic Review Meeting', category: 'Meeting', time: '03:30 PM', venue: 'Conference Room A', audience: 'Teaching staff', status: 'Confirmed' },
  { id: 'c6', date: '2025-09-20', title: 'Inter-house Cricket Finals', category: 'Sports', time: '10:00 AM', venue: 'Main Ground', audience: 'Classes 6-10', status: 'Confirmed' },
  { id: 'c7', date: '2025-09-25', title: 'Curriculum Progress Review', category: 'Academic', time: '02:00 PM', venue: 'Room 101', audience: 'Departments Heads', status: 'Confirmed' },
  { id: 'c8', date: '2025-09-28', title: 'Parent-Teacher Meeting — Class 8', category: 'PTM', time: '09:00 AM', venue: 'Respective Classrooms', audience: 'Class 8 parents', status: 'Completed' },
  { id: 'c9', date: '2025-09-29', title: 'Marks Entry Window Opens', category: 'Examination', time: '10:00 AM', venue: 'ERP', audience: 'Subject Teachers', status: 'Completed' },
  { id: 'c10', date: '2025-09-30', title: 'Unit Test — Science (8A)', category: 'Examination', time: '09:00 AM', venue: 'Room 204', audience: 'Class 8A', status: 'Confirmed' },
  { id: 'c11', date: '2025-09-30', title: 'Monthly Fee Collection Review', category: 'Meeting', time: '04:00 PM', venue: 'Accounts Office', audience: 'Accounts & Admin', status: 'Confirmed' },
  { id: 'c12', date: '2025-10-02', title: 'Gandhi Jayanti — Holiday', category: 'Holiday', venue: '—', audience: 'Whole school', status: 'Confirmed' },
  { id: 'c13', date: '2025-10-06', title: 'Annual Sports Day Practice', category: 'Sports', time: '07:30 AM', venue: 'Main Ground', audience: 'Classes 6-10', status: 'Confirmed' },
  { id: 'c14', date: '2025-10-10', title: 'HOD Meeting — Term 1 Results', category: 'Meeting', time: '03:00 PM', venue: 'Conference Room B', audience: 'HODs', status: 'Confirmed' },
  { id: 'c15', date: '2025-10-14', title: 'Report Card Preparation Begins', category: 'Academic', time: '10:00 AM', venue: 'ERP', audience: 'Class Teachers', status: 'Tentative' },
  { id: 'c16', date: '2025-10-18', title: 'Annual Sports Day', category: 'Event', time: '08:00 AM', venue: 'Main Ground', audience: 'Whole school', status: 'Confirmed' },
  { id: 'c17', date: '2025-10-20', title: 'Fee Due — Transport Fee (Oct)', category: 'Fee Due', venue: 'Accounts Office', audience: 'Transport users', status: 'Confirmed' },
  { id: 'c18', date: '2025-10-25', title: 'PTM — Class 9 & 10', category: 'PTM', time: '09:30 AM', venue: 'Respective Classrooms', audience: 'Class 9 & 10 parents', status: 'Tentative' },
  { id: 'c19', date: '2025-10-31', title: 'Diwali Break Begins', category: 'Holiday', venue: '—', audience: 'Whole school', status: 'Confirmed' },
  { id: 'c20', date: '2025-11-03', title: 'Children’s Day Assembly', category: 'Event', time: '08:15 AM', venue: 'Auditorium', audience: 'Whole school', status: 'Tentative' }
];

const TODAY = '2025-09-30';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const ALL_CATS = Object.keys(CAT_META) as CalCategory[];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export function MyCalendar() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(8); // September
  const [view, setView] = useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [catFilter, setCatFilter] = useState<'All' | CalCategory>('All');
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>(TODAY);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const visible = useMemo(
    () =>
      EVENTS.filter(
        (e) =>
          (catFilter === 'All' || e.category === catFilter) &&
          (!search || `${e.title} ${e.venue || ''} ${e.audience || ''}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [catFilter, search]
  );

  const monthEvents = useMemo(
    () => visible.filter((e) => Number(e.date.slice(5, 7)) === month + 1 && Number(e.date.slice(0, 4)) === year),
    [visible, month, year]
  );

  const eventsOn = (day: string) => monthEvents.filter((e) => e.date === day);
  const dayList = visible.filter((e) => e.date === selectedDay);

  const grid = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(iso(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const visibleCells = useMemo(() => {
    if (view !== 'Week') return grid;
    const start = Math.floor(grid.indexOf(selectedDay) / 7) * 7;
    return grid.slice(start, start + 7);
  }, [grid, view, selectedDay]);

  const shift = (delta: number) => {
    const m = month + delta;
    if (m < 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else if (m > 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth(m);
  };

  const monthHolidays = monthEvents.filter((e) => e.category === 'Holiday').length;
  const monthExams = monthEvents.filter((e) => e.category === 'Examination').length;
  const workingDays = new Date(year, month + 1, 0).getDate() - monthHolidays;

  const upcoming = visible
    .filter((e) => e.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const dayLabel = (d: string) => {
    const [y, m, dd] = d.split('-').map(Number);
    return `${dd} ${MONTH_NAMES[m - 1].slice(0, 3)} ${y} · ${WEEKDAYS[new Date(y, m - 1, dd).getDay()]}`;
  };

  const legendAndKpis = (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {[
        { label: 'Events this month', value: monthEvents.length, tone: 'text-slate-900' },
        { label: 'Holidays', value: monthHolidays, tone: 'text-rose-700' },
        { label: 'Examinations', value: monthExams, tone: 'text-indigo-700' },
        { label: 'Working days', value: workingDays, tone: 'text-emerald-700' }
      ].map((k) => (
        <Card key={k.label} className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</p>
          <p className={`text-xl font-bold mt-1 ${k.tone}`}>{k.value}</p>
          <p className="text-[10px] text-slate-400">{MONTH_NAMES[month]} {year}</p>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <CalendarDays className="w-7 h-7 text-indigo-600 mt-0.5" />
          <div>
            <nav className="text-[11px] text-slate-500">
              My Details &nbsp;/&nbsp; Calendar &nbsp;/&nbsp; <span className="text-slate-700 font-medium">School Calendar</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
              School Calendar
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-0.5">
                AY: 2025-26
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              Exams, holidays, events and fee dates for the whole institute — Main Branch
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => notify('Calendar printed — current month view sent to the print queue.')}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => notify('Calendar exported as PDF / Excel.')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button size="sm" onClick={() => notify('New event form opened — pick a date on the calendar to prefill it.')}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>
      </div>

      {legendAndKpis}

      {/* toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => shift(-1)} title="Previous month">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setMonth(8); setYear(2025); setSelectedDay(TODAY); }}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => shift(1)} title="Next month">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              aria-label="Month"
              className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Year"
              className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            {(['Month', 'Week', 'Agenda'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 text-xs font-semibold ${view === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, venue or audience..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as 'All' | CalCategory)}
              aria-label="Category"
              className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              <option value="All">All categories</option>
              {ALL_CATS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          {ALL_CATS.map((c) => {
            const M = CAT_META[c];
            return (
              <button
                key={c}
                onClick={() => setCatFilter(catFilter === c ? 'All' : c)}
                className={`flex items-center gap-1.5 text-[11px] ${catFilter === c ? 'font-bold text-slate-900' : 'text-slate-600'}`}
              >
                <span className={`w-2 h-2 rounded-full ${M.dot}`} /> {c}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* calendar body */}
        <div className="xl:col-span-2 space-y-4">
          {(view === 'Month' || view === 'Week') && (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  {MONTH_NAMES[month]} {year}
                  {view === 'Week' && <span className="text-[11px] font-normal text-slate-500"> — week of {dayLabel(selectedDay)}</span>}
                </h2>
                <span className="text-[11px] text-slate-500">{monthEvents.length} event(s) shown</span>
              </div>
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="p-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {w}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {visibleCells.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} className="min-h-[92px] border-b border-r border-slate-100 bg-slate-50/40" />;
                  const list = eventsOn(cell);
                  const isToday = cell === TODAY;
                  const isSelected = cell === selectedDay;
                  const dayNum = Number(cell.slice(8, 10));
                  return (
                    <button
                      key={cell}
                      onClick={() => setSelectedDay(cell)}
                      className={`min-h-[92px] border-b border-r border-slate-100 p-2 text-left align-top transition-colors ${
                        isSelected ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-300' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                          isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
                        }`}
                      >
                        {dayNum}
                      </span>
                      <span className="mt-1 block space-y-0.5">
                        {list.slice(0, 2).map((e) => (
                          <span key={e.id} className={`block truncate rounded px-1 py-0.5 text-[10px] border ${CAT_META[e.category].chip}`}>
                            {e.title}
                          </span>
                        ))}
                        {list.length > 2 && (
                          <span className="block text-[10px] text-slate-500">+{list.length - 2} more</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {(view === 'Agenda' || view === 'Week') && (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Agenda</h2>
                <span className="text-[11px] text-slate-500">{visible.length} event(s)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {visible
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((e) => {
                    const M = CAT_META[e.category];
                    const I = M.icon;
                    return (
                      <div key={e.id} className="p-4 flex items-start gap-3">
                        <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${M.chip}`}>
                          <I className="w-4 h-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>{dayLabel(e.date)}</span>
                            {e.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {e.time}
                              </span>
                            )}
                            {e.venue && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {e.venue}
                              </span>
                            )}
                            {e.audience && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {e.audience}
                              </span>
                            )}
                          </p>
                        </div>
                        <Badge variant={e.status === 'Confirmed' ? 'success' : e.status === 'Tentative' ? 'warning' : 'outline'}>
                          {e.status}
                        </Badge>
                      </div>
                    );
                  })}
                {visible.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No events match the filters.</p>}
              </div>
            </Card>
          )}
        </div>

        {/* side rail */}
        <div className="space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">{dayLabel(selectedDay)}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {dayList.map((e) => {
                const M = CAT_META[e.category];
                const I = M.icon;
                return (
                  <div key={e.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${M.chip}`}>
                        <I className="w-3.5 h-3.5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">{e.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {e.time ? `${e.time} · ` : ''}{e.venue || '—'}
                        </p>
                        {e.audience && <p className="text-[10px] text-slate-500">For: {e.audience}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {dayList.length === 0 && (
                <p className="p-8 text-center text-xs text-slate-500">No events on this day.</p>
              )}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Upcoming</h2>
              <span className="text-[11px] text-slate-500">next 6</span>
            </div>
            <div className="divide-y divide-slate-100">
              {upcoming.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelectedDay(e.date);
                    setMonth(Number(e.date.slice(5, 7)) - 1);
                    setYear(Number(e.date.slice(0, 4)));
                  }}
                  className="w-full text-left p-4 hover:bg-slate-50"
                >
                  <p className="text-xs font-semibold text-slate-800">{e.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${CAT_META[e.category].dot}`} />
                    {dayLabel(e.date)} {e.time ? `· ${e.time}` : ''}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">{toast}</div>
      )}
    </div>
  );
}

export default MyCalendar;
