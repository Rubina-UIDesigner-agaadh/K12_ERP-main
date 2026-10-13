import React, { useMemo, useState } from 'react';
import { Search, Calendar, Clock, Users, Save, X, BookOpen, ClipboardList, AlertTriangle, Printer, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: string;
  classes: string[];
  periodsPerWeek: number;
}

interface PeriodSlot {
  day: string;
  period: number;
  className: string;
  subject: string;
  room: string;
}

interface Allocation {
  className: string;
  subject: string;
  weekly: number;
  role: 'Subject teacher' | 'Class teacher';
}

interface Duty {
  id: string;
  title: string;
  when: string;
  daily: boolean;
  week: boolean;
  month: boolean;
  place: string;
}

const TEACHERS: Teacher[] = [
  { id: 'EMP001', name: 'Dr. Rajesh Kumar', subject: 'Mathematics', department: 'Mathematics', classes: ['10-A', '10-B', '9-A'], periodsPerWeek: 24 },
  { id: 'EMP002', name: 'Sarah Jenkins', subject: 'English', department: 'English', classes: ['8-A', '9-B', '10-A'], periodsPerWeek: 22 },
  { id: 'EMP005', name: 'David Wilson', subject: 'Physical Education', department: 'Sports', classes: ['6-A', '7-A', '8-A'], periodsPerWeek: 18 },
  { id: 'EMP011', name: 'Meera Patel', subject: 'Science', department: 'Science', classes: ['9-A', '9-B', '10-C'], periodsPerWeek: 24 },
  { id: 'EMP012', name: 'Anil Sharma', subject: 'Social Science', department: 'Social Studies', classes: ['8-B', '9-A'], periodsPerWeek: 20 }
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const CLASSES = ['6-A', '7-A', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '10-C'];
const SUBJECTS = ['Mathematics', 'English', 'Science', 'Social Science', 'Physical Education', 'Hindi', 'Computer', 'Library'];
const DEPARTMENTS = Array.from(new Set(TEACHERS.map((t) => t.department)));

const SEED_TT: Record<string, PeriodSlot[]> = {
  EMP001: [
    { day: 'Mon', period: 1, className: '10-A', subject: 'Mathematics', room: '101' },
    { day: 'Mon', period: 3, className: '10-B', subject: 'Mathematics', room: '102' },
    { day: 'Tue', period: 2, className: '9-A', subject: 'Mathematics', room: '201' },
    { day: 'Wed', period: 1, className: '10-A', subject: 'Mathematics', room: '101' },
    { day: 'Thu', period: 4, className: '10-B', subject: 'Mathematics', room: '102' },
    { day: 'Fri', period: 2, className: '9-A', subject: 'Mathematics', room: '201' }
  ],
  EMP002: [
    { day: 'Mon', period: 2, className: '8-A', subject: 'English', room: '105' },
    { day: 'Tue', period: 1, className: '10-A', subject: 'English', room: '101' },
    { day: 'Wed', period: 3, className: '9-B', subject: 'English', room: '204' }
  ],
  EMP011: [
    { day: 'Mon', period: 1, className: '9-A', subject: 'Science', room: 'Lab-1' },
    { day: 'Tue', period: 1, className: '10-A', subject: 'Science', room: 'Lab-1' }
  ]
};

const SEED_ALLOC: Record<string, Allocation[]> = {
  EMP001: [
    { className: '10-A', subject: 'Mathematics', weekly: 8, role: 'Class teacher' },
    { className: '10-B', subject: 'Mathematics', weekly: 8, role: 'Subject teacher' },
    { className: '9-A', subject: 'Mathematics', weekly: 8, role: 'Subject teacher' }
  ],
  EMP002: [
    { className: '8-A', subject: 'English', weekly: 7, role: 'Class teacher' },
    { className: '9-B', subject: 'English', weekly: 7, role: 'Subject teacher' },
    { className: '10-A', subject: 'English', weekly: 8, role: 'Subject teacher' }
  ]
};

const SEED_DUTY: Record<string, Duty[]> = {
  EMP001: [
    { id: 'd1', title: 'Assembly in-charge', when: 'Mon–Sat 07:40', daily: true, week: true, month: true, place: 'Ground' },
    { id: 'd2', title: 'Exam invigilation', when: 'Wed P3–P4', daily: false, week: true, month: false, place: 'Hall 2' },
    { id: 'd3', title: 'PTA desk', when: 'Last Saturday', daily: false, week: false, month: true, place: 'Reception' },
    { id: 'd1b', title: 'Corridor supervision', when: 'After Period 4', daily: true, week: true, month: false, place: 'Block A' }
  ],
  EMP002: [
    { id: 'd4', title: 'Library duty', when: 'Tue 12:45', daily: false, week: true, month: true, place: 'Library' },
    { id: 'd5', title: 'Bus dispersal', when: 'Every working day 15:10', daily: true, week: true, month: true, place: 'Gate 2' }
  ]
};

export function TeacherManagement() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [tab, setTab] = useState<'timetable' | 'allocation' | 'duties'>('timetable');
  const [dutyView, setDutyView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [timetable, setTimetable] = useState<Record<string, PeriodSlot[]>>(SEED_TT);
  const [alloc, setAlloc] = useState<Record<string, Allocation[]>>(SEED_ALLOC);
  const [duties, setDuties] = useState<Record<string, Duty[]>>(SEED_DUTY);
  const [draft, setDraft] = useState({ day: 'Mon', period: 1, className: '', subject: '', room: '' });
  const [slotPicker, setSlotPicker] = useState<{ day: string; period: number } | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [allocDraft, setAllocDraft] = useState<Allocation>({ className: '', subject: '', weekly: 6, role: 'Subject teacher' });
  const [dutyDraft, setDutyDraft] = useState({ title: '', when: '', place: '', daily: true, week: false, month: false });
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'setup'>('view');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEACHERS.filter((t) => {
      if (q && !`${t.name} ${t.id} ${t.subject} ${t.department} ${t.classes.join(' ')}`.toLowerCase().includes(q)) return false;
      if (deptFilter && t.department !== deptFilter) return false;
      if (subjectFilter && t.subject !== subjectFilter) return false;
      if (classFilter && !t.classes.includes(classFilter)) return false;
      return true;
    });
  }, [search, deptFilter, subjectFilter, classFilter]);

  const slots = selected ? (timetable[selected.id] ?? []) : [];
  const slotAt = (day: string, period: number) => slots.find((s) => s.day === day && s.period === period);
  const allocRows = selected ? (alloc[selected.id] ?? []) : [];
  const dutyRows = selected
    ? (duties[selected.id] ?? []).filter((d) => (dutyView === 'daily' ? d.daily : dutyView === 'weekly' ? d.week : d.month))
    : [];

  const teacherName = (id: string) => TEACHERS.find((t) => t.id === id)?.name || id;

  const findConflicts = (teacherId: string, day: string, period: number, className: string, room: string) => {
    const issues: string[] = [];
    Object.entries(timetable).forEach(([tid, list]) => {
      list.forEach((s) => {
        if (s.day !== day || s.period !== period) return;
        if (tid !== teacherId && s.className === className && className) {
          issues.push(`Class ${className} already has ${teacherName(tid)} on ${day} P${period} (${s.subject}).`);
        }
        if (tid !== teacherId && room && s.room === room) {
          issues.push(`Room ${room} is occupied by ${teacherName(tid)} (${s.className}) on ${day} P${period}.`);
        }
      });
    });
    const self = (timetable[teacherId] ?? []).find((s) => s.day === day && s.period === period);
    if (self && (self.className !== className || self.subject !== draft.subject)) {
      issues.push(`${teacherName(teacherId)} already has ${self.className} / ${self.subject} in this slot. Assigning will replace it.`);
    }
    const weekly = (timetable[teacherId] ?? []).filter((s) => !(s.day === day && s.period === period)).length + 1;
    const cap = TEACHERS.find((t) => t.id === teacherId)?.periodsPerWeek || 24;
    if (weekly > cap) {
      issues.push(`Weekly load would be ${weekly} periods (cap ${cap}).`);
    }
    return issues;
  };

  const openSlot = (day: string, period: number) => {
    if (!selected || mode !== 'setup') return;
    const existing = slotAt(day, period);
    setSlotPicker({ day, period });
    setDraft({
      day,
      period,
      className: existing?.className || selected.classes[0] || '',
      subject: existing?.subject || selected.subject,
      room: existing?.room || ''
    });
    setConflicts([]);
  };

  const addSlot = () => {
    if (!selected || !draft.className.trim() || !draft.subject.trim()) {
      setNotice('Select a class and subject for this slot.');
      return;
    }
    const issues = findConflicts(selected.id, draft.day, Number(draft.period), draft.className, draft.room);
    const blocking = issues.filter((i) => !i.includes('will replace'));
    setConflicts(issues);
    if (blocking.length > 0) {
      setNotice('Resolve conflicts before assigning this slot.');
      return;
    }
    setTimetable((prev) => {
      const current = (prev[selected.id] ?? []).filter((s) => !(s.day === draft.day && s.period === Number(draft.period)));
      return {
        ...prev,
        [selected.id]: [...current, { ...draft, period: Number(draft.period), subject: draft.subject || selected.subject }]
      };
    });
    setNotice(`Period ${draft.period} on ${draft.day} assigned: ${draft.className} / ${draft.subject}.`);
    setSlotPicker(null);
    setConflicts([]);
  };

  const clearSlot = (day: string, period: number) => {
    if (!selected) return;
    setTimetable((prev) => ({
      ...prev,
      [selected.id]: (prev[selected.id] ?? []).filter((s) => !(s.day === day && s.period === period))
    }));
    if (slotPicker?.day === day && slotPicker.period === period) setSlotPicker(null);
  };

  const runSearch = () => {
    setHasSearched(true);
    setSelected(null);
    setSlotPicker(null);
  };

  const printTimetable = () => {
    if (!selected) return;
    const rows = DAYS.map((day) => {
      const cells = PERIODS.map((p) => {
        const slot = (timetable[selected.id] ?? []).find((s) => s.day === day && s.period === p);
        return `<td>${slot ? `${slot.className}<br/>${slot.subject}${slot.room ? ` · ${slot.room}` : ''}` : '—'}</td>`;
      }).join('');
      return `<tr><th>${day}</th>${cells}</tr>`;
    }).join('');
    const html = `<!doctype html><html><head><title>Timetable — ${selected.name}</title>
<style>body{font-family:Arial,sans-serif;padding:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;text-align:center;font-size:12px}th{background:#f3f4f6}</style>
</head><body><h1>${selected.name} — Weekly Timetable</h1><p>${selected.id} · ${selected.department} · ${selected.subject}</p>
<table><thead><tr><th>Day</th>${PERIODS.map((p) => `<th>P${p}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const win = window.open('', '_blank');
    if (!win) {
      setNotice('Allow pop-ups to print the timetable.');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const downloadTimetable = () => {
    if (!selected) return;
    const header = ['Day', 'Period', 'Class', 'Subject', 'Room'];
    const lines = (timetable[selected.id] ?? []).map((s) => [s.day, String(s.period), s.className, s.subject, s.room]);
    const csv = [header, ...lines].map((cells) => cells.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selected.id}-timetable.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`Timetable downloaded for ${selected.name}.`);
  };

  const saveTeacherSetup = () => {
    if (!selected) return;
    setNotice(`Timetable, class/subject allocation and duties saved for ${selected.name}.`);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      <div>
        <p className="text-xs text-gray-500">Home → HR → Employee → Teacher's Management</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Teacher's Management</h1>
        <p className="text-sm text-gray-500">Set up and view any employee's timetable, class/subject allocation, and daily, weekly or monthly duties</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setMode('view')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'view' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'}`}>View</button>
          <button type="button" onClick={() => setMode('setup')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'setup' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'}`}>Setup</button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                placeholder="Search by name, ID or subject..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setHasSearched(true); setSelected(null); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setHasSearched(true); setSelected(null); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setHasSearched(true); setSelected(null); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All classes</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={runSearch}><Search className="w-4 h-4 mr-2" /> Search</Button>
            <Button variant="outline" onClick={() => { setSearch(''); setDeptFilter(''); setSubjectFilter(''); setClassFilter(''); setHasSearched(false); setSelected(null); }}>Reset</Button>
            {selected && (
              <Button variant="outline" onClick={() => { setSelected(null); setSlotPicker(null); setHasSearched(true); }}>Back to list</Button>
            )}
          </div>
        </div>

        {hasSearched && !selected && (
          <div className="divide-y divide-gray-100">
            {filtered.map((teacher) => (
              <button
                type="button"
                key={teacher.id}
                onClick={() => { setSelected(teacher); setDraft((d) => ({ ...d, subject: teacher.subject, className: teacher.classes[0] || '' })); setAllocDraft((d) => ({ ...d, subject: teacher.subject })); setSlotPicker(null); }}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-indigo-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                    {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.id} · {teacher.subject} · {teacher.department}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{teacher.classes.join(', ')}</p>
                  <p>{teacher.periodsPerWeek} periods / week</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No employees found.</p>}
          </div>
        )}

        {!hasSearched && !selected && (
          <div className="p-10 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2" />
            <p>Search to load the teacher / employee list</p>
          </div>
        )}

        {selected && (
          <div className="px-4 py-3 bg-indigo-50/60 text-sm text-indigo-900">
            Selected: <span className="font-semibold">{selected.name}</span> · {selected.id} · {selected.department}. Teacher list is hidden; filters stay above.
          </div>
        )}
      </div>

      {selected && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <div className="flex flex-wrap gap-2 border-b pb-3">
            {([
              ['timetable', 'Timetable', Calendar],
              ['allocation', 'Class / Subject', BookOpen],
              ['duties', 'Duties', ClipboardList]
            ] as const).map(([id, label, Icon]) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${tab === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === 'timetable' && (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Timetable — {selected.name}</h2>
                  <p className="text-sm text-gray-500">{mode === 'setup' ? 'Click a slot to choose class and subject, then assign' : 'Read-only weekly timetable'}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="info">{slots.length} periods placed</Badge>
                  <Button variant="outline" onClick={printTimetable}><Printer className="w-4 h-4 mr-1" /> Print</Button>
                  <Button variant="outline" onClick={downloadTimetable}><Download className="w-4 h-4 mr-1" /> Download</Button>
                  {mode === 'setup' && <Button onClick={saveTeacherSetup}><Save className="w-4 h-4 mr-1" /> Save</Button>}
                </div>
              </div>

              {mode === 'setup' && slotPicker && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-900">Assign {slotPicker.day} · Period {slotPicker.period}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <select value={draft.className} onChange={(e) => setDraft({ ...draft, className: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Select class</option>
                      {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Select subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input value={draft.room} onChange={(e) => setDraft({ ...draft, room: e.target.value })} placeholder="Room" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    <Button onClick={addSlot}><Save className="w-4 h-4 mr-1" /> Assign</Button>
                    <Button variant="outline" onClick={() => { clearSlot(slotPicker.day, slotPicker.period); setConflicts([]); }}>Clear slot</Button>
                  </div>
                  {conflicts.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-1">
                      <p className="font-medium flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Conflicts</p>
                      {conflicts.map((c) => <p key={c}>• {c}</p>)}
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left border-r">Day</th>
                      {PERIODS.map((p) => <th key={p} className="px-3 py-2 text-center">P{p}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr key={day} className="border-t">
                        <td className="px-3 py-2 font-medium bg-gray-50 border-r">{day}</td>
                        {PERIODS.map((p) => {
                          const slot = slotAt(day, p);
                          const active = slotPicker?.day === day && slotPicker.period === p;
                          return (
                            <td key={p} className="px-1 py-1 text-center align-top">
                              {slot ? (
                                mode === 'setup' ? (
                                <button type="button" onClick={() => openSlot(day, p)} className={`w-full rounded border px-1 py-1 ${active ? 'bg-indigo-100 border-indigo-400' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`}>
                                  <p className="font-semibold text-indigo-800">{slot.className}</p>
                                  <p className="text-[10px] text-gray-500">{slot.subject} · {slot.room}</p>
                                </button>
                                ) : (
                                <div className="w-full rounded border px-1 py-1 bg-indigo-50 border-indigo-200">
                                  <p className="font-semibold text-indigo-800">{slot.className}</p>
                                  <p className="text-[10px] text-gray-500">{slot.subject} · {slot.room}</p>
                                </div>
                                )
                              ) : mode === 'setup' ? (
                                <button type="button" onClick={() => openSlot(day, p)} className={`w-full min-h-[40px] rounded border border-dashed px-1 py-1 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 ${active ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}`}>
                                  +
                                </button>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {mode === 'setup' && <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Click any cell to pick class and subject. Conflicts show before assign (class clash, room clash, overload).</p>}
            </>
          )}

          {tab === 'allocation' && (
            <>
              <h2 className="text-lg font-semibold">Class / subject allocation — {selected.name}</h2>
              {mode === 'setup' && <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select className="px-3 py-2 border rounded-lg text-sm" value={allocDraft.className} onChange={(e) => setAllocDraft({ ...allocDraft, className: e.target.value })}>
                  <option value="">Class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="px-3 py-2 border rounded-lg text-sm" value={allocDraft.subject} onChange={(e) => setAllocDraft({ ...allocDraft, subject: e.target.value })}>
                  <option value="">Subject</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" className="px-3 py-2 border rounded-lg text-sm" placeholder="Weekly periods" value={allocDraft.weekly} onChange={(e) => setAllocDraft({ ...allocDraft, weekly: Number(e.target.value) || 0 })} />
                <select className="px-3 py-2 border rounded-lg text-sm" value={allocDraft.role} onChange={(e) => setAllocDraft({ ...allocDraft, role: e.target.value as Allocation['role'] })}>
                  <option>Subject teacher</option>
                  <option>Class teacher</option>
                </select>
                <Button onClick={() => {
                  if (!selected || !allocDraft.className || !allocDraft.subject) { setNotice('Enter class and subject.'); return; }
                  setAlloc((prev) => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), { ...allocDraft }] }));
                  setNotice(`Allocated ${allocDraft.subject} for ${allocDraft.className}.`);
                  setAllocDraft({ className: '', subject: selected.subject, weekly: 6, role: 'Subject teacher' });
                }}>Add allocation</Button>
              </div>}
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Class', 'Subject', 'Weekly periods', 'Role', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {allocRows.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No class/subject allocation yet.</td></tr>}
                  {allocRows.map((row, i) => (
                    <tr key={row.className + row.subject + i} className="border-t">
                      <td className="px-3 py-2">{row.className}</td>
                      <td className="px-3 py-2">{row.subject}</td>
                      <td className="px-3 py-2">{row.weekly}</td>
                      <td className="px-3 py-2"><Badge variant={row.role === 'Class teacher' ? 'info' : 'secondary'}>{row.role}</Badge></td>
                      <td className="px-3 py-2">{mode === 'setup' && <button type="button" className="text-red-600 text-xs" onClick={() => setAlloc((prev) => ({ ...prev, [selected.id]: (prev[selected.id] || []).filter((_, idx) => idx !== i) }))}>Remove</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === 'duties' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Duties — {selected.name}</h2>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDutyView('daily')} className={`px-3 py-1.5 rounded-lg text-sm ${dutyView === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Daily</button>
                  <button type="button" onClick={() => setDutyView('weekly')} className={`px-3 py-1.5 rounded-lg text-sm ${dutyView === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Weekly</button>
                  <button type="button" onClick={() => setDutyView('monthly')} className={`px-3 py-1.5 rounded-lg text-sm ${dutyView === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Monthly</button>
                </div>
              </div>
              {mode === 'setup' && <>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Duty title" value={dutyDraft.title} onChange={(e) => setDutyDraft({ ...dutyDraft, title: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg text-sm" placeholder="When" value={dutyDraft.when} onChange={(e) => setDutyDraft({ ...dutyDraft, when: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Place" value={dutyDraft.place} onChange={(e) => setDutyDraft({ ...dutyDraft, place: e.target.value })} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dutyDraft.daily} onChange={(e) => setDutyDraft({ ...dutyDraft, daily: e.target.checked })} /> Daily</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dutyDraft.week} onChange={(e) => setDutyDraft({ ...dutyDraft, week: e.target.checked })} /> Weekly</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dutyDraft.month} onChange={(e) => setDutyDraft({ ...dutyDraft, month: e.target.checked })} /> Monthly</label>
              </div>
              <Button onClick={() => {
                if (!selected || !dutyDraft.title) { setNotice('Enter a duty title.'); return; }
                setDuties((prev) => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), { id: `d${Date.now()}`, ...dutyDraft }] }));
                setNotice('Duty added.');
                setDutyDraft({ title: '', when: '', place: '', daily: true, week: false, month: false });
              }}>Add duty</Button>
              </>}
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Duty', 'When', 'Place', 'Cadence', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {dutyRows.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No {dutyView} duties.</td></tr>}
                  {dutyRows.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{d.title}</td>
                      <td className="px-3 py-2">{d.when}</td>
                      <td className="px-3 py-2">{d.place}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {[d.daily && 'Daily', d.week && 'Weekly', d.month && 'Monthly'].filter(Boolean).join(' · ')}
                      </td>
                      <td className="px-3 py-2">{mode === 'setup' && <button type="button" className="text-red-600 text-xs" onClick={() => { setDuties((prev) => ({ ...prev, [selected.id]: (prev[selected.id] || []).filter((x) => x.id !== d.id) })); setNotice('Duty removed.'); }}>Remove</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;
