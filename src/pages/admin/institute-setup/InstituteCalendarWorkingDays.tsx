import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Edit2,
  Eye,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X
} from 'lucide-react';

type CalendarCategory = 'Academic Structure' | 'Holiday' | 'Event' | 'Exam' | 'Meeting' | 'Deadline' | 'Special Day';
type CalendarTab = 'Full Calendar' | 'Academic Structure' | 'Holidays' | 'Events' | 'Exams' | 'Deadlines';
type CalendarView = 'Month' | 'Week' | 'Day' | 'List';

interface CalendarEntry {
  id: number;
  name: string;
  type: string;
  category: CalendarCategory;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
  academicYear: string;
  color: string;
  audience: string;
  branches: string[];
  recurring: boolean;
  affectsAttendance: boolean;
  notifyParents: boolean;
  status: 'Active' | 'Inactive';
  meta: Record<string, string>;
}

interface CreateOption {
  name: string;
  detail: string;
  emoji: string;
  category: CalendarCategory;
  color: string;
}

interface CreateGroup {
  title: string;
  options: CreateOption[];
}

const createGroups: CreateGroup[] = [
  {
    title: 'ACADEMIC STRUCTURE',
    options: [
      { name: 'Academic Year', detail: 'Define AY start and end dates', emoji: '📅', category: 'Academic Structure', color: '#2563eb' },
      { name: 'Term / Semester', detail: 'Divide the year into terms', emoji: '📆', category: 'Academic Structure', color: '#2563eb' },
      { name: 'School Timing', detail: 'Set daily school hours', emoji: '🕐', category: 'Academic Structure', color: '#2563eb' },
      { name: 'Period Structure', detail: 'Set periods, breaks, and lunch timing', emoji: '📋', category: 'Academic Structure', color: '#2563eb' },
      { name: 'Working Days Pattern', detail: 'Set which days are school days', emoji: '📅', category: 'Academic Structure', color: '#2563eb' }
    ]
  },
  {
    title: 'HOLIDAYS & CLOSURES',
    options: [
      { name: 'National Holiday', detail: 'Republic Day, Independence Day, and more', emoji: '🇮🇳', category: 'Holiday', color: '#e74c3c' },
      { name: 'State / Regional Holiday', detail: 'State-specific holidays', emoji: '🏛️', category: 'Holiday', color: '#e74c3c' },
      { name: 'Religious / Festival Holiday', detail: 'Diwali, Eid, Christmas, and more', emoji: '🕌', category: 'Holiday', color: '#e74c3c' },
      { name: 'School-Declared Holiday', detail: 'School-declared closure', emoji: '🏫', category: 'Holiday', color: '#e74c3c' },
      { name: 'Emergency / Unplanned Closure', detail: 'Bandh, weather, or an emergency', emoji: '⚡', category: 'Holiday', color: '#e74c3c' },
      { name: 'Summer Vacation', detail: 'Define summer break dates', emoji: '☀️', category: 'Holiday', color: '#f39c12' },
      { name: 'Winter / Seasonal Break', detail: 'Define winter, Diwali, or seasonal break', emoji: '❄️', category: 'Holiday', color: '#f39c12' },
      { name: 'Compensatory Working Day', detail: 'Make up for a previous closure', emoji: '📅', category: 'Special Day', color: '#0f766e' }
    ]
  },
  {
    title: 'EXAMINATIONS',
    options: [
      { name: 'Unit Test / Periodic Test', detail: 'Schedule a unit or periodic test', emoji: '📝', category: 'Exam', color: '#8e44ad' },
      { name: 'Half-Yearly / Mid-Term Exam', detail: 'Schedule mid-term exam dates', emoji: '📋', category: 'Exam', color: '#8e44ad' },
      { name: 'Annual / Final Exam', detail: 'Schedule annual exam dates', emoji: '📋', category: 'Exam', color: '#8e44ad' },
      { name: 'Practical Examination', detail: 'Schedule practical exam dates', emoji: '🔬', category: 'Exam', color: '#8e44ad' },
      { name: 'Pre-Board / Preliminary Exam', detail: 'Schedule a mock board examination', emoji: '📋', category: 'Exam', color: '#8e44ad' },
      { name: 'Project / Assignment Deadline', detail: 'Set a project submission deadline', emoji: '📁', category: 'Exam', color: '#8e44ad' },
      { name: 'Board Exam Reference Date', detail: 'Add board exam dates for awareness', emoji: '🏛️', category: 'Exam', color: '#8e44ad' }
    ]
  },
  {
    title: 'EVENTS & ACTIVITIES',
    options: [
      { name: 'Cultural Event', detail: 'Annual Day, drama, or music show', emoji: '🎭', category: 'Event', color: '#27ae60' },
      { name: 'Sports Event', detail: 'Sports Day or inter-house competition', emoji: '⚽', category: 'Event', color: '#27ae60' },
      { name: 'Academic Event', detail: 'Science fair, quiz, or exhibition', emoji: '🔬', category: 'Event', color: '#27ae60' },
      { name: 'Trip / Excursion', detail: 'Educational trip or picnic', emoji: '🚌', category: 'Event', color: '#27ae60' },
      { name: 'Camp', detail: 'Nature or adventure camp', emoji: '🏕️', category: 'Event', color: '#27ae60' },
      { name: 'Ceremony / Function', detail: 'Prize distribution, investiture, or farewell', emoji: '🎖️', category: 'Event', color: '#27ae60' },
      { name: 'Health Camp / Medical Event', detail: 'Medical check-up or vaccination camp', emoji: '🏥', category: 'Event', color: '#27ae60' },
      { name: 'Safety Drill', detail: 'Fire, earthquake, or safety drill', emoji: '🚨', category: 'Event', color: '#27ae60' }
    ]
  },
  {
    title: 'MEETINGS & PARENT INTERACTION',
    options: [
      { name: 'Parent-Teacher Meeting (PTM)', detail: 'Schedule a PTM date', emoji: '👨‍👩‍👧', category: 'Meeting', color: '#2980b9' },
      { name: 'Open House Day', detail: 'Open house for parents', emoji: '🏠', category: 'Meeting', color: '#2980b9' },
      { name: 'Staff Meeting', detail: 'Monthly or special staff meeting', emoji: '👥', category: 'Meeting', color: '#2980b9' },
      { name: 'SMC / Board Meeting', detail: 'School Management Committee meeting', emoji: '🏛️', category: 'Meeting', color: '#2980b9' },
      { name: 'Parent / Student Orientation', detail: 'Orientation session for families', emoji: '🎓', category: 'Meeting', color: '#2980b9' }
    ]
  },
  {
    title: 'DEADLINES & REMINDERS',
    options: [
      { name: 'Fee Deadline', detail: 'Term fee due date', emoji: '💰', category: 'Deadline', color: '#e74c3c' },
      { name: 'Marks Entry Deadline', detail: 'Last date for teachers to enter marks', emoji: '📝', category: 'Deadline', color: '#e74c3c' },
      { name: 'Admission Important Date', detail: 'Important admission process date', emoji: '📋', category: 'Deadline', color: '#e74c3c' },
      { name: 'Government Submission Deadline', detail: 'UDISE, board, or government submission', emoji: '🏛️', category: 'Deadline', color: '#e74c3c' },
      { name: 'Report Card / Result Date', detail: 'Result announcement or report card date', emoji: '📊', category: 'Deadline', color: '#e74c3c' },
      { name: 'Custom Reminder / Alert', detail: 'Any other important reminder', emoji: '⚠️', category: 'Deadline', color: '#e74c3c' }
    ]
  },
  {
    title: 'SPECIAL DAYS',
    options: [
      { name: 'Half-Day School', detail: 'School runs for half a day', emoji: '🕐', category: 'Special Day', color: '#0f766e' },
      { name: 'Online / Virtual School Day', detail: 'School shifts to online mode', emoji: '💻', category: 'Special Day', color: '#0f766e' },
      { name: 'Modified Schedule Day', detail: 'Different timing or schedule for the day', emoji: '🔄', category: 'Special Day', color: '#0f766e' },
      { name: 'No Teaching Day', detail: 'School is open, but academic classes do not run', emoji: '📋', category: 'Special Day', color: '#0f766e' }
    ]
  }
];

const allCreateOptions = createGroups.flatMap((group) => group.options);
const academicYearOptions = ['2024-25', '2025-26', '2026-27', '2027-28'].map((year) => ({ value: year, label: year }));
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dateToInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const readDate = (value: string) => new Date(`${value}T00:00:00`);
const formatDate = (value: string) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(readDate(value)) : '—';

const initialCalendarEntries: CalendarEntry[] = [
  { id: 1, name: 'Unit Test 1', type: 'Unit Test / Periodic Test', category: 'Exam', startDate: '2025-09-02', endDate: '2025-09-02', startTime: '10:00', endTime: '13:00', venue: '', description: 'Periodic assessment for the term.', academicYear: '2025-26', color: '#8e44ad', audience: 'Specific Classes', branches: [], recurring: false, affectsAttendance: false, notifyParents: true, status: 'Active', meta: { classes: 'Classes 6–10', suspendsClasses: 'Yes' } },
  { id: 2, name: 'Cultural Event', type: 'Cultural Event', category: 'Event', startDate: '2025-09-06', endDate: '2025-09-06', startTime: '09:00', endTime: '13:00', venue: 'School Auditorium', description: 'Student cultural program.', academicYear: '2025-26', color: '#27ae60', audience: 'All Students', branches: [], recurring: false, affectsAttendance: false, notifyParents: true, status: 'Active', meta: {} },
  { id: 3, name: 'Parent-Teacher Meeting — Term 1', type: 'Parent-Teacher Meeting (PTM)', category: 'Meeting', startDate: '2025-09-10', endDate: '2025-09-10', startTime: '09:00', endTime: '13:00', venue: 'All Classrooms — Main Block', description: 'Discuss student progress and Term 1 performance.', academicYear: '2025-26', color: '#2980b9', audience: 'Parents and Staff', branches: [], recurring: false, affectsAttendance: false, notifyParents: true, status: 'Active', meta: { organizer: 'Principal + Class Teachers' } },
  { id: 4, name: 'School Holiday', type: 'School-Declared Holiday', category: 'Holiday', startDate: '2025-09-18', endDate: '2025-09-18', startTime: '', endTime: '', venue: '', description: 'Institute-declared holiday in the sample calendar.', academicYear: '2025-26', color: '#e74c3c', audience: 'Everyone', branches: [], recurring: false, affectsAttendance: true, notifyParents: true, status: 'Active', meta: {} },
  { id: 5, name: 'Fee Deadline', type: 'Fee Deadline', category: 'Deadline', startDate: '2025-09-22', endDate: '2025-09-22', startTime: '', endTime: '', venue: '', description: 'Last date to pay the term fee without a late fine.', academicYear: '2025-26', color: '#e74c3c', audience: 'Finance Team and Parents', branches: [], recurring: false, affectsAttendance: false, notifyParents: true, status: 'Active', meta: { responsible: 'Finance Manager', alertBefore: '7 days' } },
  { id: 6, name: 'Half-Yearly Examination', type: 'Half-Yearly / Mid-Term Exam', category: 'Exam', startDate: '2025-09-25', endDate: '2025-09-25', startTime: '10:00', endTime: '13:00', venue: 'Exam Halls', description: 'Half-yearly examination schedule.', academicYear: '2025-26', color: '#8e44ad', audience: 'Applicable Classes', branches: [], recurring: false, affectsAttendance: false, notifyParents: true, status: 'Active', meta: { classes: 'Classes 6–12', suspendsClasses: 'Yes' } },
  { id: 7, name: 'Gandhi Jayanti', type: 'National Holiday', category: 'Holiday', startDate: '2025-10-02', endDate: '2025-10-02', startTime: '', endTime: '', venue: '', description: 'National holiday.', academicYear: '2025-26', color: '#e74c3c', audience: 'Everyone', branches: [], recurring: true, affectsAttendance: true, notifyParents: true, status: 'Active', meta: {} },
  { id: 8, name: 'Republic Day', type: 'National Holiday', category: 'Holiday', startDate: '2025-01-26', endDate: '2025-01-26', startTime: '', endTime: '', venue: '', description: 'Recurring national holiday.', academicYear: '2024-25', color: '#e74c3c', audience: 'Everyone', branches: [], recurring: true, affectsAttendance: true, notifyParents: true, status: 'Active', meta: {} },
  { id: 9, name: 'Independence Day', type: 'National Holiday', category: 'Holiday', startDate: '2024-08-15', endDate: '2024-08-15', startTime: '', endTime: '', venue: '', description: 'Recurring national holiday.', academicYear: '2024-25', color: '#e74c3c', audience: 'Everyone', branches: [], recurring: true, affectsAttendance: true, notifyParents: true, status: 'Active', meta: {} },
  { id: 10, name: 'Holi', type: 'Religious / Festival Holiday', category: 'Holiday', startDate: '2025-03-14', endDate: '2025-03-14', startTime: '', endTime: '', venue: '', description: 'Recurring festival holiday.', academicYear: '2024-25', color: '#e74c3c', audience: 'Everyone', branches: [], recurring: true, affectsAttendance: true, notifyParents: true, status: 'Active', meta: {} }
];

function makeEntry(option: CreateOption, academicYear: string, date = '2025-09-01'): CalendarEntry {
  return {
    id: 0,
    name: '',
    type: option.name,
    category: option.category,
    startDate: date,
    endDate: date,
    startTime: option.category === 'Event' || option.category === 'Meeting' || option.category === 'Exam' ? '09:00' : '',
    endTime: option.category === 'Event' || option.category === 'Meeting' || option.category === 'Exam' ? '13:00' : '',
    venue: '',
    description: '',
    academicYear,
    color: option.color,
    audience: 'Everyone — Students + Staff',
    branches: [],
    recurring: false,
    affectsAttendance: option.category === 'Holiday',
    notifyParents: true,
    status: 'Active',
    meta: {}
  };
}

function downloadText(filename: string, text: string, mime = 'text/csv') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InstituteCalendarWorkingDays() {
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [board, setBoard] = useState('CBSE');
  const [activeTab, setActiveTab] = useState<CalendarTab>('Full Calendar');
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState('2025-09-01');
  const [calendarView, setCalendarView] = useState<CalendarView>('Month');
  const [entries, setEntries] = useState<CalendarEntry[]>(initialCalendarEntries);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isParentPreviewOpen, setIsParentPreviewOpen] = useState(false);
  const [copyFromYear, setCopyFromYear] = useState('2024-25');
  const [copyToYear, setCopyToYear] = useState('2025-26');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeOption, setActiveOption] = useState<CreateOption>(allCreateOptions[8]);
  const [form, setForm] = useState<CalendarEntry>(() => makeEntry(allCreateOptions[8], '2025-26'));
  const [formMeta, setFormMeta] = useState<Record<string, string>>({});
  const [rangeMode, setRangeMode] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [filters, setFilters] = useState({ Holidays: true, Events: true, Exams: true, PTM: true, Deadlines: true, 'Working Days': true });
  const [summary, setSummary] = useState({ workingDays: 227, holidays: 58, events: 24, exams: 18, meetings: 12, deadlines: 5 });
  const [workingDays, setWorkingDays] = useState(weekdays.map((day, index) => ({ day, working: index < 5 || index === 5, start: index === 5 ? '07:30' : '07:45', end: index === 5 ? '12:30' : '14:30' })));
  const [saturdayPattern, setSaturdayPattern] = useState('Alternate Saturdays — 2nd & 4th Saturday off');
  const [academicSettings, setAcademicSettings] = useState({
    startDate: '2025-04-01', endDate: '2026-03-31', firstStudentDay: '2025-04-14', staffReporting: '2025-04-07', lastStudentDay: '2026-03-20', termCount: '2 Terms', displayFormat: '2025-26', schoolStart: '07:45', schoolEnd: '14:30', firstRecess: '10:30', lunchStart: '12:30', lunchEnd: '13:00', periodCount: '8', periodMinutes: '45'
  });

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 3200);
  };
  const activeEntries = useMemo(() => entries.filter((entry) => entry.academicYear === academicYear && entry.status === 'Active'), [entries, academicYear]);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(selectedYear, selectedMonth, 1));
  const visibleDates = useMemo(() => {
    const monthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstOffset = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7;
    if (calendarView === 'Month') {
      const count = Math.ceil((firstOffset + monthDays) / 7) * 7;
      return Array.from({ length: count }, (_, index) => {
        const date = new Date(selectedYear, selectedMonth, index - firstOffset + 1);
        return { date: dateToInput(date), inMonth: date.getMonth() === selectedMonth };
      });
    }
    if (calendarView === 'List') {
      return Array.from({ length: monthDays }, (_, index) => ({ date: dateToInput(new Date(selectedYear, selectedMonth, index + 1)), inMonth: true }));
    }
    const focus = readDate(selectedDate);
    const start = new Date(focus);
    if (calendarView === 'Week') start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const count = calendarView === 'Week' ? 7 : 1;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { date: dateToInput(date), inMonth: date.getMonth() === selectedMonth };
    });
  }, [selectedYear, selectedMonth, selectedDate, calendarView]);

  const changeMonth = (offset: number) => {
    const next = new Date(selectedYear, selectedMonth + offset, 1);
    setSelectedMonth(next.getMonth());
    setSelectedYear(next.getFullYear());
    setSelectedDate(dateToInput(next));
  };
  const moveCalendar = (offset: number) => {
    if (calendarView === 'Month' || calendarView === 'List') { changeMonth(offset); return; }
    const next = readDate(selectedDate);
    next.setDate(next.getDate() + offset * (calendarView === 'Week' ? 7 : 1));
    setSelectedDate(dateToInput(next));
    setSelectedMonth(next.getMonth());
    setSelectedYear(next.getFullYear());
  };
  const entryCoversDate = (entry: CalendarEntry, date: string) => entry.startDate <= date && entry.endDate >= date;
  const categoryFilterIsVisible = (category: CalendarCategory) => {
    if (category === 'Holiday') return filters.Holidays;
    if (category === 'Event') return filters.Events;
    if (category === 'Exam') return filters.Exams;
    if (category === 'Meeting') return filters.PTM;
    if (category === 'Deadline') return filters.Deadlines;
    if (category === 'Special Day') return filters['Working Days'];
    return false;
  };
  const entriesForDate = (date: string) => activeEntries.filter((entry) => entry.category !== 'Academic Structure' && entryCoversDate(entry, date) && categoryFilterIsVisible(entry.category));
  const weekdayStatus = (dateText: string) => {
    const date = readDate(dateText);
    const dayIndex = (date.getDay() + 6) % 7;
    if (activeEntries.some((entry) => entry.category === 'Holiday' && entryCoversDate(entry, dateText))) return { label: 'Holiday', tone: 'bg-rose-100 text-rose-700', emoji: '🏖️' };
    if (dayIndex === 5) {
      if (!workingDays[dayIndex].working || saturdayPattern.includes('All Saturdays off')) return { label: 'Weekly Off', tone: 'bg-red-100 text-red-700', emoji: '🔴' };
      if (saturdayPattern.includes('Alternate')) {
        const saturdayInMonth = Math.ceil(date.getDate() / 7);
        if (saturdayInMonth === 2 || saturdayInMonth === 4) return { label: 'Alternate Saturday off', tone: 'bg-blue-100 text-blue-700', emoji: '🔵' };
      }
      return { label: 'Saturday (Half Day)', tone: 'bg-blue-100 text-blue-700', emoji: '🔵' };
    }
    if (!workingDays[dayIndex].working) return { label: 'Weekly Off', tone: 'bg-red-100 text-red-700', emoji: '🔴' };
    return { label: 'Working Day', tone: 'bg-green-100 text-green-700', emoji: '🟢' };
  };
  const labelForEntry = (entry: CalendarEntry) => entry.category === 'Exam' ? '📝' : entry.category === 'Meeting' ? '👥' : entry.category === 'Event' ? '🎉' : entry.category === 'Deadline' ? '📋' : entry.category === 'Holiday' ? '🏖️' : '📅';
  const openCreatePanel = (option: CreateOption, date = selectedDate) => {
    const nextForm = makeEntry(option, academicYear, date);
    if (option.name === 'Academic Year') {
      nextForm.name = academicYear;
      nextForm.startDate = academicSettings.startDate;
      nextForm.endDate = academicSettings.endDate;
    }
    setActiveOption(option);
    setForm(nextForm);
    setFormMeta({ ...(option.name === 'Academic Year' ? academicSettings : {}) });
    setRangeMode(option.name.includes('Vacation') || option.name.includes('Break') || option.category === 'Exam' && option.name.includes('Half-Yearly'));
    setEditingId(null);
    setIsCreateMenuOpen(false);
    setIsCreatePanelOpen(true);
  };
  const openHolidayForDate = (date: string) => {
    const option = allCreateOptions.find((item) => item.name === 'School-Declared Holiday') || allCreateOptions[8];
    setSelectedDate(date);
    setSelectedMonth(readDate(date).getMonth());
    setSelectedYear(readDate(date).getFullYear());
    openCreatePanel(option, date);
    setForm((previous) => ({ ...previous, name: '', startDate: date, endDate: date, type: 'School-Declared Holiday', category: 'Holiday', affectsAttendance: true }));
  };
  const openEditPanel = (entry: CalendarEntry) => {
    const option = allCreateOptions.find((item) => item.name === entry.type) || allCreateOptions.find((item) => item.category === entry.category) || allCreateOptions[8];
    setActiveOption(option);
    setForm({ ...entry, meta: { ...entry.meta } });
    setFormMeta({ ...entry.meta });
    setRangeMode(entry.startDate !== entry.endDate);
    setEditingId(entry.id);
    setIsCreatePanelOpen(true);
  };
  const updateForm = (key: keyof CalendarEntry, value: string | boolean) => setForm((previous) => ({ ...previous, [key]: value } as CalendarEntry));
  const updateMeta = (key: string, value: string) => setFormMeta((previous) => ({ ...previous, [key]: value }));
  const changeStartDate = (value: string) => setForm((previous) => ({ ...previous, startDate: value, endDate: rangeMode ? previous.endDate : value }));
  const saveEntry = (addAnother = false) => {
    if (!form.name.trim() || !form.startDate) { notify('Enter a name and date before saving.', 'error'); return; }
    if (form.endDate && form.startDate > form.endDate) { notify('The end date must be on or after the start date.', 'error'); return; }
    const normalized: CalendarEntry = { ...form, endDate: form.endDate || form.startDate, academicYear: form.type === 'Academic Year' ? form.name.trim() : form.academicYear || academicYear, meta: { ...formMeta } };
    if (editingId !== null) {
      setEntries((previous) => previous.map((entry) => entry.id === editingId ? { ...normalized, id: editingId } : entry).sort((a, b) => a.startDate.localeCompare(b.startDate)));
      notify(`${normalized.name} updated on the institute calendar.`);
    } else {
      const id = Math.max(0, ...entries.map((entry) => entry.id)) + 1;
      setEntries((previous) => [...previous, { ...normalized, id }].sort((a, b) => a.startDate.localeCompare(b.startDate)));
      setSummary((previous) => ({
        ...previous,
        holidays: previous.holidays + (normalized.category === 'Holiday' ? 1 : 0),
        events: previous.events + (normalized.category === 'Event' ? 1 : 0),
        exams: previous.exams + (normalized.category === 'Exam' ? 1 : 0),
        meetings: previous.meetings + (normalized.category === 'Meeting' ? 1 : 0),
        deadlines: previous.deadlines + (normalized.category === 'Deadline' ? 1 : 0),
        workingDays: previous.workingDays - (normalized.category === 'Holiday' && normalized.affectsAttendance ? 1 : 0)
      }));
      notify(`${normalized.name} added to the ${normalized.category === 'Academic Structure' ? 'academic structure' : 'institute calendar'}.`);
    }
    if (normalized.type === 'Academic Year') {
      setAcademicYear(normalized.name);
      setAcademicSettings((previous) => ({ ...previous, ...formMeta, startDate: normalized.startDate, endDate: normalized.endDate }));
      if (formMeta.board) setBoard(formMeta.board);
      if (formMeta.saturdayPattern) setSaturdayPattern(formMeta.saturdayPattern);
    }
    if (normalized.type === 'School Timing' || normalized.type === 'Period Structure') {
      setAcademicSettings((previous) => ({
        ...previous,
        schoolStart: formMeta.classesStart || previous.schoolStart,
        schoolEnd: formMeta.classesEnd || previous.schoolEnd,
        firstRecess: formMeta.recess || previous.firstRecess,
        lunchStart: formMeta.lunchStart || previous.lunchStart,
        lunchEnd: formMeta.lunchEnd || previous.lunchEnd,
        periodCount: formMeta.periodCount || previous.periodCount,
        periodMinutes: formMeta.periodMinutes || previous.periodMinutes
      }));
    }
    if (normalized.type === 'Working Days Pattern' && formMeta.saturdayPattern) setSaturdayPattern(formMeta.saturdayPattern);
    if (addAnother) {
      const nextForm = makeEntry(activeOption, academicYear, normalized.startDate);
      setForm(nextForm);
      setFormMeta({});
      setEditingId(null);
      setRangeMode(false);
    } else setIsCreatePanelOpen(false);
  };
  const deleteEntry = (entry: CalendarEntry) => {
    setEntries((previous) => previous.filter((item) => item.id !== entry.id));
    notify(`${entry.name} removed from the calendar.`);
  };
  const copyRecurringEntries = () => {
    const fromYear = Number(copyFromYear.match(/\d{4}/)?.[0] || 2024);
    const toYear = Number(copyToYear.match(/\d{4}/)?.[0] || 2025);
    const offset = toYear - fromYear;
    const recurring = entries.filter((entry) => entry.academicYear === copyFromYear && entry.recurring);
    const copies = recurring.map((entry, index) => {
      const start = readDate(entry.startDate); start.setFullYear(start.getFullYear() + offset);
      const end = readDate(entry.endDate); end.setFullYear(end.getFullYear() + offset);
      return { ...entry, id: Math.max(0, ...entries.map((item) => item.id)) + index + 1, startDate: dateToInput(start), endDate: dateToInput(end), academicYear: copyToYear };
    });
    setEntries((previous) => [...previous, ...copies].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    setIsCopyModalOpen(false);
    notify(`${copies.length} recurring calendar items copied to ${copyToYear}.`);
  };
  const exportCalendar = () => {
    const rows = [['Name', 'Type', 'Category', 'Start Date', 'End Date', 'Start Time', 'End Time', 'Venue', 'Academic Year', 'Audience', 'Description'], ...activeEntries.map((entry) => [entry.name, entry.type, entry.category, entry.startDate, entry.endDate, entry.startTime, entry.endTime, entry.venue, entry.academicYear, entry.audience, entry.description])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadText(`institute-calendar-${academicYear}.csv`, csv);
    notify('Calendar exported as CSV.');
  };
  const saveAcademicSettings = () => { notify(`Academic structure for ${academicYear} saved.`); };

  const tabItems: { name: CalendarTab; emoji: string }[] = [
    { name: 'Full Calendar', emoji: '📅' }, { name: 'Academic Structure', emoji: '⚙️' }, { name: 'Holidays', emoji: '🏖️' }, { name: 'Events', emoji: '🎉' }, { name: 'Exams', emoji: '📝' }, { name: 'Deadlines', emoji: '📋' }
  ];
  const listEntries = activeEntries.filter((entry) => {
    if (activeTab === 'Holidays') return entry.category === 'Holiday';
    if (activeTab === 'Events') return entry.category === 'Event' || entry.category === 'Meeting';
    if (activeTab === 'Exams') return entry.category === 'Exam';
    if (activeTab === 'Deadlines') return entry.category === 'Deadline';
    return false;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const monthTitle = calendarView === 'Day' ? formatDate(selectedDate) : calendarView === 'Week' ? `${formatDate(visibleDates[0]?.date || selectedDate)} – ${formatDate(visibleDates[6]?.date || visibleDates[0]?.date || selectedDate)}` : monthName;
  const dayHeadings = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="min-h-screen space-y-5 bg-gray-50/70 p-4 md:p-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Calendar className="h-5 w-5" /></span><div><div className="flex flex-wrap items-center gap-2 text-xs text-gray-500"><span className="font-semibold text-gray-800">🏫 School ERP</span><span>|</span><span className="font-semibold text-gray-800">📅 Institute Calendar</span><span>|</span><span>AY: {academicYear}</span></div><div className="mt-1 flex items-center gap-2 text-xs text-gray-500"><span>Home</span><ChevronRight className="h-3 w-3" /><span>Institute Setup</span><ChevronRight className="h-3 w-3" /><span className="text-gray-800">Institute Calendar</span></div></div></div>
          <div className="flex items-center gap-3"><Select label="AY" className="w-32" options={academicYearOptions} value={academicYear} onChange={(event) => { setAcademicYear(event.target.value); const year = Number(event.target.value.slice(0, 4)); setSelectedYear(year); setSelectedMonth(8); setSelectedDate(`${year}-09-01`); }} /><button className="rounded-lg border p-2 text-gray-500" aria-label="Notifications">🔔</button><span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">👤 Admin</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative"><Button onClick={() => setIsCreateMenuOpen((open) => !open)}><Plus className="h-4 w-4" /> CREATE <span className="text-xs">▼</span></Button>
            {isCreateMenuOpen && <div className="absolute left-0 top-full z-50 mt-2 max-h-[75vh] w-[min(720px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-gray-900">Create Calendar Item</h2><p className="text-xs text-gray-500">43 options · Choose an item to open its setup panel</p></div><button onClick={() => setIsCreateMenuOpen(false)} aria-label="Close create menu"><X className="h-4 w-4" /></button></div>
              <div className="space-y-5">{createGroups.map((group) => <section key={group.title}><h3 className="mb-2 border-b pb-2 text-xs font-bold tracking-wide text-gray-500">{group.title}</h3><div className="grid gap-2 sm:grid-cols-2">{group.options.map((option) => <button key={option.name} onClick={() => openCreatePanel(option)} className="flex gap-3 rounded-lg border border-gray-100 p-3 text-left hover:border-blue-300 hover:bg-blue-50"><span className="text-lg">{option.emoji}</span><span className="min-w-0"><strong className="block text-xs text-gray-800">{option.name}</strong><span className="mt-1 block text-[11px] text-gray-500">{option.detail}</span></span></button>)}</div></section>)}</div>
            </div>}
          </div>
          <Button variant="outline" onClick={() => setIsCopyModalOpen(true)}><Copy className="h-4 w-4" /> Copy from Last Year</Button>
          <Button variant="outline" onClick={exportCalendar}><Download className="h-4 w-4" /> Export Calendar</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" onClick={() => notify('Calendar is synced with attendance, exams, fee, and parent portal modules.', 'info')}><RefreshCw className="h-4 w-4" /> Sync with Modules</Button>
          <Button variant="outline" onClick={() => setIsParentPreviewOpen(true)}><Eye className="h-4 w-4" /> Parent View Preview</Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900"><span><strong>AY:</strong> {academicYear}</span><span><strong>Board:</strong> {board}</span><span><strong>Working Days So Far:</strong> 142</span><span><strong>Remaining:</strong> 85</span></div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          { label: 'TOTAL WORKING DAYS', period: 'THIS YEAR', value: `${summary.workingDays} days`, note: '↓ from previous year', emoji: '📅', tone: 'bg-blue-50 text-blue-700' },
          { label: 'TOTAL HOLIDAYS', period: 'THIS YEAR', value: `${summary.holidays} days`, note: 'incl. summer break', emoji: '🏖️', tone: 'bg-amber-50 text-amber-700' },
          { label: 'EVENTS SCHEDULED', period: 'THIS YEAR', value: `${summary.events} events`, note: '', emoji: '🎉', tone: 'bg-green-50 text-green-700' },
          { label: 'EXAM DATES', period: 'THIS YEAR', value: `${summary.exams} dates`, note: '', emoji: '📝', tone: 'bg-violet-50 text-violet-700' },
          { label: 'MEETINGS & PTM', period: 'SCHEDULED', value: String(summary.meetings), note: '', emoji: '👥', tone: 'bg-sky-50 text-sky-700' },
          { label: 'DEADLINES', period: 'THIS MONTH', value: String(summary.deadlines), note: '⚠️ Review', emoji: '📋', tone: 'bg-rose-50 text-rose-700' }
        ].map((item) => <Card key={item.label} className="min-h-[118px]"><div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>{item.emoji}</span><div className="min-w-0"><p className="text-[10px] font-bold tracking-wide text-gray-500">{item.label}</p><p className="text-[10px] text-gray-400">{item.period}</p><p className="mt-2 text-xl font-bold text-gray-900">{item.value}</p>{item.note && <p className="mt-1 text-[10px] text-gray-500">{item.note}</p>}</div></div></Card>)}
      </section>

      <nav className="overflow-x-auto rounded-xl border bg-white p-1"><div className="flex min-w-max gap-1">{tabItems.map((tab) => <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${activeTab === tab.name ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}><span>{tab.emoji}</span>{tab.name}</button>)}</div></nav>

      {activeTab === 'Full Calendar' && <div className="space-y-4">
        <Card noPadding>
          <div className="flex flex-col gap-4 border-b p-4 xl:flex-row xl:items-center xl:justify-between">
            <div><h2 className="flex items-center gap-2 font-bold text-gray-900"><Calendar className="h-5 w-5 text-blue-600" /> INSTITUTE CALENDAR — AY {academicYear}</h2><p className="mt-1 text-xs text-gray-500">Click any date to add a holiday; select an existing item to view or edit it.</p></div>
            <div className="flex flex-wrap items-center gap-2"><Select label="View" className="w-32" options={(['Month', 'Week', 'Day', 'List'] as CalendarView[]).map((view) => ({ value: view, label: view }))} value={calendarView} onChange={(event) => setCalendarView(event.target.value as CalendarView)} /><div className="flex items-center gap-2 rounded-lg border px-2 py-1"><Button size="sm" variant="ghost" onClick={() => moveCalendar(-1)} aria-label="Previous period"><ChevronLeft className="h-4 w-4" /></Button><span className="min-w-40 text-center text-sm font-semibold">{monthTitle}</span><Button size="sm" variant="ghost" onClick={() => moveCalendar(1)} aria-label="Next period"><ChevronRight className="h-4 w-4" /></Button></div></div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b bg-gray-50 px-4 py-3">{(Object.keys(filters) as (keyof typeof filters)[]).map((filter) => <label key={filter} className="flex items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={filters[filter]} onChange={(event) => setFilters((previous) => ({ ...previous, [filter]: event.target.checked }))} className="rounded border-gray-300 text-blue-600" />{filter}</label>)}</div>
          {calendarView === 'List' ? <div className="divide-y">{visibleDates.map(({ date }) => { const dayItems = entriesForDate(date); const status = weekdayStatus(date); return <div key={date} className="flex flex-wrap items-center gap-3 px-4 py-3"><button onClick={() => openHolidayForDate(date)} className="min-w-40 text-left"><span className="font-semibold">{formatDate(date)}</span><span className="ml-2 text-xs text-gray-400">{status.emoji} {status.label}</span></button><div className="flex flex-1 flex-wrap gap-2">{dayItems.map((item) => <button key={item.id} onClick={() => openEditPanel(item)} className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: item.color }}>{labelForEntry(item)} {item.name}</button>)}{!dayItems.length && <span className="text-xs text-gray-400">No scheduled items</span>}</div><Button size="xs" variant="outline" onClick={() => openHolidayForDate(date)}><Plus className="h-3.5 w-3.5" /> Add Holiday</Button></div>; })}</div> : <div className="p-3">
            {calendarView === 'Day' ? <div className="rounded bg-gray-100 py-2 text-center text-xs font-bold tracking-wide text-gray-500">{new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(readDate(visibleDates[0]?.date || selectedDate))}</div> : <div className="grid grid-cols-7 gap-1">{dayHeadings.map((day) => <div key={day} className="rounded bg-gray-100 py-2 text-center text-[10px] font-bold tracking-wide text-gray-500">{day}</div>)}</div>}
            <div className={`mt-1 grid gap-1 ${calendarView === 'Day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
              {visibleDates.map(({ date, inMonth }) => {
                const dayItems = entriesForDate(date);
                const dateObj = readDate(date);
                const status = weekdayStatus(date);
                const dateNumber = dateObj.getDate();
                return <div key={date} onClick={() => openHolidayForDate(date)} className={`min-h-[118px] cursor-pointer overflow-hidden rounded-lg border p-1.5 ${inMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'} ${date === selectedDate ? 'ring-1 ring-blue-300' : ''}`}>
                  <div className="flex items-center justify-between gap-1"><button onClick={(event) => { event.stopPropagation(); openHolidayForDate(date); }} className={`rounded-md px-2 py-1 text-xs font-bold ${inMonth ? 'text-gray-800 hover:bg-blue-50' : 'text-gray-400'}`} aria-label={`Add holiday on ${formatDate(date)}`}>{dateNumber}</button><span className="text-[9px]" title={status.label}>{status.emoji}</span></div>
                  {filters['Working Days'] && <span className={`mb-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] ${status.tone}`}>{status.label}</span>}
                  <div className="space-y-1">{dayItems.slice(0, 3).map((item) => <button key={item.id} onClick={(event) => { event.stopPropagation(); openEditPanel(item); }} className="block w-full truncate rounded px-1.5 py-1 text-left text-[10px] font-semibold text-white" style={{ backgroundColor: item.color }} title={`${item.name} · ${item.type}`}>{labelForEntry(item)} {item.name}</button>)}{dayItems.length > 3 && <span className="block px-1 text-[9px] text-gray-500">+{dayItems.length - 3} more</span>}</div>
                </div>;
              })}
            </div>
          </div>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50 px-4 py-3 text-xs text-gray-500"><div className="flex flex-wrap gap-x-4 gap-y-1"><span>🟢 Working Day</span><span>🔴 Sunday / Weekly Off</span><span>🔵 Saturday (Alt.)</span><span>🏖️ Holiday</span><span>📝 Exam</span><span>👥 Meeting / PTM</span><span>🎉 Event</span><span>📋 Deadline</span></div><span>➕ Click any date to add a holiday · Click an item to view/edit</span></div>
        </Card>
      </div>}

      {activeTab === 'Academic Structure' && <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Academic Year Setup" headerAction={<Button size="sm" onClick={() => openCreatePanel(createGroups[0].options[0])}><Plus className="h-4 w-4" /> Create Academic Year</Button>}>
            <div className="grid gap-3 sm:grid-cols-2"><Input label="Academic Year Name" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} /><Select label="Display Format" options={['2025-26', '2025-2026', 'AY 2025-26'].map((value) => ({ value, label: value }))} value={academicSettings.displayFormat} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, displayFormat: event.target.value }))} /><Input label="Start Date" type="date" value={academicSettings.startDate} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, startDate: event.target.value }))} /><Input label="End Date" type="date" value={academicSettings.endDate} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, endDate: event.target.value }))} /><Input label="First Day for Students" type="date" value={academicSettings.firstStudentDay} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, firstStudentDay: event.target.value }))} /><Input label="Staff Reporting Date" type="date" value={academicSettings.staffReporting} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, staffReporting: event.target.value }))} /><Input label="Last Day for Students" type="date" value={academicSettings.lastStudentDay} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, lastStudentDay: event.target.value }))} /><Select label="Number of Terms" options={['2 Terms', '3 Terms', '2 Semesters', 'Annual'].map((value) => ({ value, label: value }))} value={academicSettings.termCount} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, termCount: event.target.value }))} /><Select label="Board" options={['CBSE', 'Gujarat State Board', 'ICSE', 'Other'].map((value) => ({ value, label: value }))} value={board} onChange={(event) => setBoard(event.target.value)} /></div>
            <div className="mt-4 flex flex-wrap gap-2">{weekdays.map((day, index) => <label key={day} className="flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs"><input type="checkbox" checked={workingDays[index].working} onChange={(event) => setWorkingDays((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, working: event.target.checked } : item))} />{day.slice(0, 3)}</label>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><Select label="Saturday Pattern" options={['All Saturdays working', 'Alternate Saturdays — 2nd & 4th Saturday off', 'All Saturdays off'].map((value) => ({ value, label: value }))} value={saturdayPattern} onChange={(event) => setSaturdayPattern(event.target.value)} /><div className="flex items-end"><Button onClick={saveAcademicSettings}><Save className="h-4 w-4" /> Save Academic Year</Button></div></div>
          </Card>
          <Card title="School Timing & Period Structure" headerAction={<Button size="sm" variant="outline" onClick={() => openCreatePanel(createGroups[0].options[2])}><Plus className="h-4 w-4" /> Add Timing</Button>}>
            <div className="grid gap-3 sm:grid-cols-2"><Input label="Classes Start" type="time" value={academicSettings.schoolStart} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, schoolStart: event.target.value }))} /><Input label="Classes End" type="time" value={academicSettings.schoolEnd} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, schoolEnd: event.target.value }))} /><Input label="First Recess" type="time" value={academicSettings.firstRecess} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, firstRecess: event.target.value }))} /><Input label="Lunch Start" type="time" value={academicSettings.lunchStart} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, lunchStart: event.target.value }))} /><Input label="Lunch End" type="time" value={academicSettings.lunchEnd} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, lunchEnd: event.target.value }))} /><Input label="Periods per Day" type="number" value={academicSettings.periodCount} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, periodCount: event.target.value }))} /><Input label="Period Duration (minutes)" type="number" value={academicSettings.periodMinutes} onChange={(event) => setAcademicSettings((previous) => ({ ...previous, periodMinutes: event.target.value }))} /></div>
            <p className="mt-3 text-xs text-gray-500">Period Structure and Working Days Pattern are also available from the Create menu.</p>
          </Card>
        </div>
        <Card title="Terms / Semesters" headerAction={<Button size="sm" onClick={() => openCreatePanel(createGroups[0].options[1])}><Plus className="h-4 w-4" /> Add Term / Semester</Button>}>
          {activeEntries.filter((entry) => entry.category === 'Academic Structure' && entry.type === 'Term / Semester').length ? <div className="grid gap-3 md:grid-cols-2">{activeEntries.filter((entry) => entry.category === 'Academic Structure' && entry.type === 'Term / Semester').map((entry) => <div key={entry.id} className="rounded-xl border p-4"><div className="flex justify-between gap-2"><strong>{entry.name}</strong><button onClick={() => openEditPanel(entry)} className="text-blue-700"><Edit2 className="h-4 w-4" /></button></div><p className="mt-2 text-xs text-gray-500">{formatDate(entry.startDate)} – {formatDate(entry.endDate)}</p><p className="mt-1 text-xs text-gray-500">{entry.description}</p></div>)}</div> : <p className="text-sm text-gray-500">No terms are configured yet. Use “Add Term / Semester” to create one.</p>}
        </Card>
      </div>}

      {['Holidays', 'Events', 'Exams', 'Deadlines'].includes(activeTab) && <Card title={`${activeTab} — AY ${academicYear}`} headerAction={<Button size="sm" onClick={() => { const option = activeTab === 'Holidays' ? createGroups[1].options[0] : activeTab === 'Events' ? createGroups[3].options[0] : activeTab === 'Exams' ? createGroups[2].options[0] : createGroups[5].options[0]; openCreatePanel(option); }}><Plus className="h-4 w-4" /> Create {activeTab === 'Holidays' ? 'Holiday' : activeTab.slice(0, -1)}</Button>}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-gray-500">Select an item to view or edit its calendar details.</p><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input aria-label={`Search ${activeTab.toLowerCase()}`} placeholder="Search calendar items…" className="rounded-lg border py-2 pl-9 pr-3 text-sm" onChange={(event) => updateMeta('listSearch', event.target.value)} /></div></div>
        {listEntries.filter((entry) => !formMeta.listSearch || `${entry.name} ${entry.type}`.toLowerCase().includes(formMeta.listSearch.toLowerCase())).length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Date</th><th className="px-3 py-3">Name</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Audience</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead><tbody className="divide-y">{listEntries.filter((entry) => !formMeta.listSearch || `${entry.name} ${entry.type}`.toLowerCase().includes(formMeta.listSearch.toLowerCase())).map((entry) => <tr key={entry.id}><td className="whitespace-nowrap px-3 py-3">{formatDate(entry.startDate)}{entry.endDate !== entry.startDate && ` – ${formatDate(entry.endDate)}`}</td><td className="px-3 py-3"><button onClick={() => openEditPanel(entry)} className="text-left font-semibold text-blue-700 hover:underline">{entry.name}</button><span className="mt-1 block text-xs text-gray-500">{entry.description}</span></td><td className="px-3 py-3"><Badge variant={entry.category === 'Holiday' ? 'warning' : entry.category === 'Exam' ? 'info' : entry.category === 'Deadline' ? 'danger' : 'success'}>{entry.type}</Badge></td><td className="px-3 py-3">{entry.audience}</td><td className="px-3 py-3"><Badge variant="success">{entry.status}</Badge></td><td className="px-3 py-3"><div className="flex gap-1"><Button size="xs" variant="outline" onClick={() => openEditPanel(entry)}><Edit2 className="h-3.5 w-3.5" /> Edit</Button><Button size="xs" variant="ghost" className="text-red-600" onClick={() => deleteEntry(entry)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}</tbody></table></div> : <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">No {activeTab.toLowerCase()} have been added for {academicYear}.</div>}
      </Card>}

      {isCreatePanelOpen && <div className="fixed inset-0 z-[70] bg-gray-950/40" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCreatePanelOpen(false); }}>
        <aside className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-2xl flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={`${editingId ? 'Edit' : 'Create'} ${activeOption.name}`}>
          <div className="flex items-start justify-between border-b px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{activeOption.emoji} {activeOption.category}</p><h2 className="mt-1 text-lg font-bold text-gray-900">{editingId ? 'Edit' : activeOption.category === 'Holiday' ? 'Add' : 'Create'} {activeOption.category === 'Holiday' && editingId === null ? 'Holiday' : activeOption.name}</h2><p className="mt-1 text-xs text-gray-500">{activeOption.detail}</p></div><button onClick={() => setIsCreatePanelOpen(false)} aria-label="Close form"><X className="h-5 w-5" /></button></div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div className="grid gap-4 sm:grid-cols-2"><Input label={activeOption.category === 'Academic Structure' && form.type === 'Academic Year' ? 'Academic Year Name' : activeOption.category === 'Holiday' ? 'Holiday Name' : `${activeOption.category} Name`} value={form.name} onChange={(event) => updateForm('name', event.target.value)} /><Select label="Academic Year" options={academicYearOptions} value={form.academicYear} onChange={(event) => updateForm('academicYear', event.target.value)} /></div>
            {activeOption.category === 'Academic Structure' && form.type === 'Academic Year' && <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"><h3 className="mb-3 text-sm font-bold">Academic Year Details</h3><div className="grid gap-3 sm:grid-cols-2"><Select label="Display Format" options={['2025-26', '2025-2026', 'AY 2025-26'].map((value) => ({ value, label: value }))} value={formMeta.displayFormat || academicSettings.displayFormat} onChange={(event) => updateMeta('displayFormat', event.target.value)} /><Input label="Start Date" type="date" value={form.startDate} onChange={(event) => changeStartDate(event.target.value)} /><Input label="End Date" type="date" value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} /><Input label="First Day for Students" type="date" value={formMeta.firstStudentDay || academicSettings.firstStudentDay} onChange={(event) => updateMeta('firstStudentDay', event.target.value)} /><Input label="Staff Reporting Date" type="date" value={formMeta.staffReporting || academicSettings.staffReporting} onChange={(event) => updateMeta('staffReporting', event.target.value)} /><Input label="Last Day for Students" type="date" value={formMeta.lastStudentDay || academicSettings.lastStudentDay} onChange={(event) => updateMeta('lastStudentDay', event.target.value)} /><Select label="Number of Terms" options={['2 Terms', '3 Terms', '2 Semesters', 'Annual'].map((value) => ({ value, label: value }))} value={formMeta.termCount || academicSettings.termCount} onChange={(event) => updateMeta('termCount', event.target.value)} /><Select label="Board" options={['CBSE', 'Gujarat State Board', 'ICSE', 'Other'].map((value) => ({ value, label: value }))} value={formMeta.board || board} onChange={(event) => updateMeta('board', event.target.value)} /></div><div className="mt-3 flex flex-wrap gap-2">{weekdays.map((day, index) => <label key={day} className="flex items-center gap-1 rounded border bg-white px-2 py-1 text-xs"><input type="checkbox" checked={workingDays[index].working} onChange={(event) => setWorkingDays((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, working: event.target.checked } : item))} />{day.slice(0, 3)}</label>)}</div><Select className="mt-3" label="Saturday Pattern" options={['All Saturdays working', 'Alternate Saturdays — 2nd & 4th Saturday off', 'All Saturdays off'].map((value) => ({ value, label: value }))} value={formMeta.saturdayPattern || saturdayPattern} onChange={(event) => updateMeta('saturdayPattern', event.target.value)} /></section>}
            {activeOption.category === 'Academic Structure' && form.type === 'Term / Semester' && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Term Start Date" type="date" value={form.startDate} onChange={(event) => changeStartDate(event.target.value)} /><Input label="Term End Date" type="date" value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} /><Input label="Term Number" type="number" value={formMeta.termNumber || '1'} onChange={(event) => updateMeta('termNumber', event.target.value)} /><Input label="Working Days (auto-calculated)" value={formMeta.workingDays || '112'} onChange={(event) => updateMeta('workingDays', event.target.value)} /><Select label="Exam at End of Term?" options={['Yes — Half-Yearly Exam', 'No'].map((value) => ({ value, label: value }))} value={formMeta.examAtEnd || 'Yes — Half-Yearly Exam'} onChange={(event) => updateMeta('examAtEnd', event.target.value)} /><Select label="Report Card?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={formMeta.reportCard || 'Yes'} onChange={(event) => updateMeta('reportCard', event.target.value)} /><Input label="Fee Due Date" type="date" value={formMeta.feeDueDate || ''} onChange={(event) => updateMeta('feeDueDate', event.target.value)} /></section>}
            {activeOption.category === 'Academic Structure' && (form.type === 'School Timing' || form.type === 'Period Structure') && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Applicable From" type="date" value={form.startDate} onChange={(event) => changeStartDate(event.target.value)} /><Input label="Applicable To" type="date" value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} /><Input label="Gate Opening" type="time" value={formMeta.gateOpening || '07:00'} onChange={(event) => updateMeta('gateOpening', event.target.value)} /><Input label="Assembly Start" type="time" value={formMeta.assemblyStart || '07:30'} onChange={(event) => updateMeta('assemblyStart', event.target.value)} /><Input label="Classes Start" type="time" value={formMeta.classesStart || '07:45'} onChange={(event) => updateMeta('classesStart', event.target.value)} /><Input label="First Recess" type="time" value={formMeta.recess || '10:30'} onChange={(event) => updateMeta('recess', event.target.value)} /><Input label="Lunch Start" type="time" value={formMeta.lunchStart || '12:30'} onChange={(event) => updateMeta('lunchStart', event.target.value)} /><Input label="Lunch End" type="time" value={formMeta.lunchEnd || '13:00'} onChange={(event) => updateMeta('lunchEnd', event.target.value)} /><Input label="Classes End" type="time" value={formMeta.classesEnd || '14:30'} onChange={(event) => updateMeta('classesEnd', event.target.value)} /><Input label="Periods per Day" type="number" value={formMeta.periodCount || '8'} onChange={(event) => updateMeta('periodCount', event.target.value)} /><Input label="Period Duration (minutes)" type="number" value={formMeta.periodMinutes || '45'} onChange={(event) => updateMeta('periodMinutes', event.target.value)} /><Input label="Lunch / Break Duration (minutes)" type="number" value={formMeta.breakMinutes || '30'} onChange={(event) => updateMeta('breakMinutes', event.target.value)} /></section>}
            {activeOption.category === 'Academic Structure' && form.type === 'Working Days Pattern' && <><div className="grid grid-cols-2 gap-2 rounded-xl border p-4 sm:grid-cols-4">{weekdays.map((day, index) => <label key={day} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={workingDays[index].working} onChange={(event) => setWorkingDays((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, working: event.target.checked } : item))} />{day}</label>)}</div><Select className="mt-3" label="Saturday Pattern" options={['All Saturdays working', 'Alternate Saturdays — 2nd & 4th Saturday off', 'All Saturdays off'].map((value) => ({ value, label: value }))} value={formMeta.saturdayPattern || saturdayPattern} onChange={(event) => updateMeta('saturdayPattern', event.target.value)} /></>}
            {activeOption.category !== 'Academic Structure' && <>
              <div className="rounded-xl border border-gray-100 p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Date & Schedule</h3>{activeOption.category !== 'Deadline' && <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={rangeMode} onChange={(event) => { setRangeMode(event.target.checked); if (!event.target.checked) updateForm('endDate', form.startDate); }} />Multiple days / date range</label>}</div><div className="grid gap-3 sm:grid-cols-2"><Input label={rangeMode ? 'From Date' : 'Date'} type="date" value={form.startDate} onChange={(event) => changeStartDate(event.target.value)} />{rangeMode && <Input label="To Date" type="date" value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} />}{['Event', 'Meeting', 'Exam'].includes(activeOption.category) && <><Input label="Start Time" type="time" value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} /><Input label="End Time" type="time" value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} /></>}</div><p className="mt-2 text-xs text-gray-500">{form.startDate ? new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(readDate(form.startDate)) : 'Day of week is calculated automatically'}</p></div>
              {activeOption.category === 'Holiday' && <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4"><h3 className="mb-3 text-sm font-bold">Holiday Settings</h3><div className="grid gap-3 sm:grid-cols-2"><Select label="Holiday Type" options={['National Holiday', 'State / Regional Holiday', 'Religious / Festival Holiday', 'School-Declared Holiday', 'Emergency / Unplanned Closure', 'Summer Vacation', 'Winter / Seasonal Break', 'Compensatory Working Day'].map((value) => ({ value, label: value }))} value={form.type} onChange={(event) => updateForm('type', event.target.value)} /><Select label="Applicable To" options={['Everyone — Students + Staff', 'Students Only', 'Staff Only', 'Specific Classes'].map((value) => ({ value, label: value }))} value={form.audience} onChange={(event) => updateForm('audience', event.target.value)} /><Select label="Applicable Branches" options={['All Branches', 'Main Campus', 'City Centre Branch', 'North Zone Campus'].map((value) => ({ value, label: value }))} value={formMeta.branch || 'All Branches'} onChange={(event) => updateMeta('branch', event.target.value)} /><Select label="Recurring Every Year?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={form.recurring ? 'Yes' : 'No'} onChange={(event) => updateForm('recurring', event.target.value === 'Yes')} /><Select label="Affects Attendance Calculation?" options={['Yes — exclude from working days', 'No — count as working'].map((value) => ({ value, label: value }))} value={form.affectsAttendance ? 'Yes — exclude from working days' : 'No — count as working'} onChange={(event) => updateForm('affectsAttendance', event.target.value.startsWith('Yes'))} /><Select label="Notify Parents / Staff?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={form.notifyParents ? 'Yes' : 'No'} onChange={(event) => updateForm('notifyParents', event.target.value === 'Yes')} /></div><Input className="mt-3" label="Notification Message" value={formMeta.notificationMessage || ''} onChange={(event) => updateMeta('notificationMessage', event.target.value)} placeholder="School will remain closed on this date…" /><div className="mt-3 grid gap-3 sm:grid-cols-2"><Input label="Color on Calendar" type="color" value={form.color} onChange={(event) => updateForm('color', event.target.value)} /><Input label="Attach Circular (optional)" type="file" accept=".pdf,image/*" onChange={(event) => updateMeta('circular', event.target.files?.[0]?.name || '')} /></div></div>}
              {activeOption.category === 'Holiday' && form.type.includes('Emergency') && <section className="grid gap-3 rounded-xl border border-red-200 bg-red-50/40 p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Emergency Closure Details</h3><Select label="Closure Confirmed?" options={['Confirmed', 'Provisional — pending approval'].map((value) => ({ value, label: value }))} value={formMeta.closureStatus || 'Confirmed'} onChange={(event) => updateMeta('closureStatus', event.target.value)} /><Input label="Compensatory Working Day" type="date" value={formMeta.compensatoryDate || ''} onChange={(event) => updateMeta('compensatoryDate', event.target.value)} /><Input label="Closure Reason / Incident" value={formMeta.closureReason || ''} onChange={(event) => updateMeta('closureReason', event.target.value)} /><Select label="Send Immediate Alert?" options={['Yes — SMS, email, and app', 'No'].map((value) => ({ value, label: value }))} value={formMeta.immediateAlert || 'Yes — SMS, email, and app'} onChange={(event) => updateMeta('immediateAlert', event.target.value)} /></section>}
              {activeOption.category === 'Holiday' && (form.type.includes('Vacation') || form.type.includes('Break')) && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Vacation / Break Details</h3><Select label="Break Type" options={['Summer Vacation', 'Winter Break', 'Diwali Break', 'Seasonal Break'].map((value) => ({ value, label: value }))} value={formMeta.breakType || (form.type.includes('Summer') ? 'Summer Vacation' : 'Winter Break')} onChange={(event) => updateMeta('breakType', event.target.value)} /><Select label="Staff Working During Break?" options={['No — full staff break', 'Yes — limited staff duties', 'Administrative staff only'].map((value) => ({ value, label: value }))} value={formMeta.staffBreak || 'No — full staff break'} onChange={(event) => updateMeta('staffBreak', event.target.value)} /><Input label="Staff Reporting / Reopening Date" type="date" value={formMeta.staffReopening || ''} onChange={(event) => updateMeta('staffReopening', event.target.value)} /><Select label="Notify Families Before Break?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={form.notifyParents ? 'Yes' : 'No'} onChange={(event) => updateForm('notifyParents', event.target.value === 'Yes')} /></section>}
              {activeOption.category === 'Holiday' && form.type.includes('Compensatory') && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Compensatory Working Day</h3><Input label="Linked Closure / Reason" value={formMeta.linkedClosure || ''} onChange={(event) => updateMeta('linkedClosure', event.target.value)} /><Select label="School Timing" options={['Regular timing', 'Half day'].map((value) => ({ value, label: value }))} value={formMeta.compensatoryTiming || 'Regular timing'} onChange={(event) => updateMeta('compensatoryTiming', event.target.value)} /></section>}
              {activeOption.category === 'Event' && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Venue" value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} placeholder="School Ground / Auditorium" /><Input label="Organizer / In-charge" value={formMeta.organizer || ''} onChange={(event) => updateMeta('organizer', event.target.value)} /><Select label="School Day Status" options={['Regular classes + event', 'No regular classes', 'Half day'].map((value) => ({ value, label: value }))} value={formMeta.schoolDayStatus || 'Regular classes + event'} onChange={(event) => updateMeta('schoolDayStatus', event.target.value)} /><Select label="Invite / Notify Parents?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={form.notifyParents ? 'Yes' : 'No'} onChange={(event) => updateForm('notifyParents', event.target.value === 'Yes')} /><Input label="Applicable Classes / Audience" value={form.audience} onChange={(event) => updateForm('audience', event.target.value)} /><Input label="Attach Event Circular" type="file" accept=".pdf,image/*" onChange={(event) => updateMeta('attachment', event.target.files?.[0]?.name || '')} /></section>}
              {activeOption.category === 'Event' && (form.type.includes('Trip') || form.type.includes('Excursion')) && <section className="grid gap-3 rounded-xl border border-green-200 bg-green-50/40 p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Trip / Excursion Details</h3><Input label="Destination" value={formMeta.destination || ''} onChange={(event) => updateMeta('destination', event.target.value)} /><Input label="Transport / Bus Details" value={formMeta.transport || ''} onChange={(event) => updateMeta('transport', event.target.value)} /><Input label="Applicable Classes" value={formMeta.tripClasses || 'All Classes'} onChange={(event) => updateMeta('tripClasses', event.target.value)} /><Input label="Teacher In-charge" value={formMeta.tripTeacher || ''} onChange={(event) => updateMeta('tripTeacher', event.target.value)} /><Input label="Accompanying Staff" value={formMeta.accompanyingStaff || ''} onChange={(event) => updateMeta('accompanyingStaff', event.target.value)} /><Input label="Student Fee (optional)" type="number" value={formMeta.tripFee || ''} onChange={(event) => updateMeta('tripFee', event.target.value)} /><Select label="Parent Permission Required?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={formMeta.permissionRequired || 'Yes'} onChange={(event) => updateMeta('permissionRequired', event.target.value)} /><Input label="Permission Deadline" type="date" value={formMeta.permissionDeadline || ''} onChange={(event) => updateMeta('permissionDeadline', event.target.value)} /></section>}
              {activeOption.category === 'Exam' && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Applicable Classes" value={formMeta.classes || 'All Classes'} onChange={(event) => updateMeta('classes', event.target.value)} /><Select label="Session" options={['Morning — 10:00 AM to 01:00 PM', 'Afternoon', 'Custom timing'].map((value) => ({ value, label: value }))} value={formMeta.session || 'Morning — 10:00 AM to 01:00 PM'} onChange={(event) => updateMeta('session', event.target.value)} /><Select label="Regular Class Suspended?" options={['Yes — no regular teaching', 'No — regular classes continue'].map((value) => ({ value, label: value }))} value={formMeta.suspendsClasses || 'Yes — no regular teaching'} onChange={(event) => updateMeta('suspendsClasses', event.target.value)} /><Select label="Exam Hall Booking" options={['Yes — block exam halls', 'No — skip booking'].map((value) => ({ value, label: value }))} value={formMeta.examHall || 'No — skip booking'} onChange={(event) => updateMeta('examHall', event.target.value)} /><Input label="Marks Entry Deadline" type="date" value={formMeta.marksDeadline || ''} onChange={(event) => updateMeta('marksDeadline', event.target.value)} /><Input label="Result Declaration Date" type="date" value={formMeta.resultDate || ''} onChange={(event) => updateMeta('resultDate', event.target.value)} /><Input label="Report Card Distribution" type="date" value={formMeta.reportDate || ''} onChange={(event) => updateMeta('reportDate', event.target.value)} /><Input label="Upload Timetable / Circular" type="file" accept=".pdf,image/*" onChange={(event) => updateMeta('attachment', event.target.files?.[0]?.name || '')} /></section>}
              {activeOption.category === 'Meeting' && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Venue" value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} /><Input label="Organizer" value={formMeta.organizer || ''} onChange={(event) => updateMeta('organizer', event.target.value)} /><Select label="Is Regular School On?" options={['Normal classes + meeting', 'School open, no academic classes', 'Half day'].map((value) => ({ value, label: value }))} value={formMeta.schoolStatus || 'School open, no academic classes'} onChange={(event) => updateMeta('schoolStatus', event.target.value)} /><Select label="Invite / Notify Parents?" options={['Yes — SMS + Email', 'No'].map((value) => ({ value, label: value }))} value={form.notifyParents ? 'Yes — SMS + Email' : 'No'} onChange={(event) => updateForm('notifyParents', event.target.value.startsWith('Yes'))} /><Input label="Audience / Classes" value={form.audience} onChange={(event) => updateForm('audience', event.target.value)} /></section>}
              {activeOption.category === 'Deadline' && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Select label="Critical?" options={['Yes — alert if approaching', 'No'].map((value) => ({ value, label: value }))} value={formMeta.critical || 'Yes — alert if approaching'} onChange={(event) => updateMeta('critical', event.target.value)} /><Select label="Alert Before" options={['7 days', '3 days', '1 day'].map((value) => ({ value, label: value }))} value={formMeta.alertBefore || '7 days'} onChange={(event) => updateMeta('alertBefore', event.target.value)} /><Input label="Responsible Person" value={formMeta.responsible || ''} onChange={(event) => updateMeta('responsible', event.target.value)} /><Select label="Notify Parents?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={form.notifyParents ? 'Yes' : 'No'} onChange={(event) => updateForm('notifyParents', event.target.value === 'Yes')} /><Input label="Action Link (optional)" value={formMeta.actionLink || ''} onChange={(event) => updateMeta('actionLink', event.target.value)} /></section>}
              {activeOption.category === 'Special Day' && <><section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Select label="School Timing" options={['Regular timing', 'Half day', 'Short day', 'Online / virtual'].map((value) => ({ value, label: value }))} value={formMeta.timing || 'Regular timing'} onChange={(event) => updateMeta('timing', event.target.value)} /><Input label="Applicable Classes / Audience" value={form.audience} onChange={(event) => updateForm('audience', event.target.value)} /><Input label="Compensatory Day (if applicable)" type="date" value={formMeta.compensatoryDate || ''} onChange={(event) => updateMeta('compensatoryDate', event.target.value)} /></section>{(form.type.includes('Half-Day') || form.type.includes('Modified')) && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Modified Timing</h3><Input label="School Starts" type="time" value={formMeta.modifiedStart || '07:45'} onChange={(event) => updateMeta('modifiedStart', event.target.value)} /><Input label="School Ends" type="time" value={formMeta.modifiedEnd || '12:00'} onChange={(event) => updateMeta('modifiedEnd', event.target.value)} /><Input label="Last Teaching Period" type="text" value={formMeta.lastPeriod || ''} onChange={(event) => updateMeta('lastPeriod', event.target.value)} /></section>}{form.type.includes('Online') && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-sm font-bold">Online / Virtual Day</h3><Input label="Platform / LMS" value={formMeta.platform || ''} onChange={(event) => updateMeta('platform', event.target.value)} /><Input label="Join Link / Instructions" value={formMeta.joinLink || ''} onChange={(event) => updateMeta('joinLink', event.target.value)} /><Select label="Attendance Method" options={['LMS attendance', 'Teacher marked', 'Not required'].map((value) => ({ value, label: value }))} value={formMeta.onlineAttendance || 'LMS attendance'} onChange={(event) => updateMeta('onlineAttendance', event.target.value)} /></section>}{form.type.includes('No Teaching') && <section className="rounded-xl border p-4"><h3 className="mb-2 text-sm font-bold">No Teaching Day</h3><Input label="Reason / Staff Activity" value={formMeta.noTeachingReason || ''} onChange={(event) => updateMeta('noTeachingReason', event.target.value)} /></section>}{form.type.includes('Compensatory') && <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><Input label="Linked Closure / Reason" value={formMeta.linkedClosure || ''} onChange={(event) => updateMeta('linkedClosure', event.target.value)} /><Select label="Working Day Timing" options={['Regular timing', 'Half day'].map((value) => ({ value, label: value }))} value={formMeta.compensatoryTiming || 'Regular timing'} onChange={(event) => updateMeta('compensatoryTiming', event.target.value)} /></section>}</>}
              <div className="grid gap-3 sm:grid-cols-2"><Input label="Color on Calendar" type="color" value={form.color} onChange={(event) => updateForm('color', event.target.value)} /><Select label="Status" options={['Active', 'Inactive'].map((value) => ({ value, label: value }))} value={form.status} onChange={(event) => updateForm('status', event.target.value)} /></div>
              <Input label={activeOption.category === 'Holiday' ? 'Notes / Reason' : 'Description / Agenda'} value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
            </>}
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t bg-gray-50 px-5 py-4"><Button variant="outline" onClick={() => setIsCreatePanelOpen(false)}>Cancel</Button>{editingId !== null && <Button variant="danger" onClick={() => { const entry = entries.find((item) => item.id === editingId); if (entry) deleteEntry(entry); setIsCreatePanelOpen(false); }}><Trash2 className="h-4 w-4" /> Delete</Button>}{activeOption.category !== 'Academic Structure' && editingId === null && <Button variant="outline" onClick={() => saveEntry(true)}>Save &amp; Add Another</Button>}<Button onClick={() => saveEntry(false)}><Save className="h-4 w-4" /> {activeOption.category === 'Holiday' ? 'Save Holiday' : activeOption.category === 'Academic Structure' ? 'Save Setup' : `Save ${activeOption.category}`}</Button></div>
        </aside>
      </div>}

      {isCopyModalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/50 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Copy from Last Year</h2><p className="mt-1 text-sm text-gray-500">Copy recurring holidays and calendar dates into a new academic year.</p></div><button onClick={() => setIsCopyModalOpen(false)} aria-label="Close copy dialog"><X className="h-5 w-5" /></button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Select label="Copy From" options={academicYearOptions} value={copyFromYear} onChange={(event) => setCopyFromYear(event.target.value)} /><Select label="Copy To" options={academicYearOptions} value={copyToYear} onChange={(event) => setCopyToYear(event.target.value)} /></div><p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Only items marked “Recurring Every Year” are copied. Existing entries are kept.</p><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setIsCopyModalOpen(false)}>Cancel</Button><Button onClick={copyRecurringEntries}><Copy className="h-4 w-4" /> Copy Recurring Items</Button></div></div></div>}
      {isParentPreviewOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-bold">Parent Calendar Preview</h2><p className="text-xs text-gray-500">Only parent-visible dates and notices are shown.</p></div><button onClick={() => setIsParentPreviewOpen(false)} aria-label="Close parent preview"><X className="h-5 w-5" /></button></div><div className="space-y-3 p-5">{activeEntries.filter((entry) => entry.notifyParents).sort((a, b) => a.startDate.localeCompare(b.startDate)).map((entry) => <div key={entry.id} className="flex gap-3 rounded-lg border p-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} /><div><p className="font-semibold">{entry.name}</p><p className="text-xs text-gray-500">{formatDate(entry.startDate)}{entry.endDate !== entry.startDate && ` – ${formatDate(entry.endDate)}`} · {entry.type}</p>{entry.description && <p className="mt-1 text-sm text-gray-600">{entry.description}</p>}</div></div>)}</div><div className="flex justify-end border-t px-5 py-4"><Button onClick={() => setIsParentPreviewOpen(false)}>Close Preview</Button></div></div></div>}
      {message && <div className={`fixed bottom-5 right-5 z-[100] flex max-w-md items-center gap-2 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${message.type === 'success' ? 'bg-gray-900' : message.type === 'error' ? 'bg-red-700' : 'bg-blue-700'}`}>{message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}{message.text}<button onClick={() => setMessage(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button></div>}
    </div>
  );
}
