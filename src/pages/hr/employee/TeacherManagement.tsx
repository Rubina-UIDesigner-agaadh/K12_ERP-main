import React, { useState } from 'react';
import { Search, Calendar, Clock, Users, Save, X } from 'lucide-react';
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

const TEACHERS: Teacher[] = [
  { id: 'EMP001', name: 'Dr. Rajesh Kumar', subject: 'Mathematics', department: 'Mathematics', classes: ['10-A', '10-B', '9-A'], periodsPerWeek: 24 },
  { id: 'EMP002', name: 'Sarah Jenkins', subject: 'English', department: 'English', classes: ['8-A', '9-B', '10-A'], periodsPerWeek: 22 },
  { id: 'EMP005', name: 'David Wilson', subject: 'Physical Education', department: 'Sports', classes: ['6-A', '7-A', '8-A'], periodsPerWeek: 18 },
  { id: 'EMP011', name: 'Meera Patel', subject: 'Science', department: 'Science', classes: ['9-A', '9-B', '10-C'], periodsPerWeek: 24 },
  { id: 'EMP012', name: 'Anil Sharma', subject: 'Social Science', department: 'Social Studies', classes: ['8-B', '9-A'], periodsPerWeek: 20 }
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

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
  ]
};

export function TeacherManagement() {
  const [search, setSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [timetable, setTimetable] = useState<Record<string, PeriodSlot[]>>(SEED_TT);
  const [draft, setDraft] = useState({ day: 'Mon', period: 1, className: '', subject: '', room: '' });
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = TEACHERS.filter((t) =>
    `${t.name} ${t.id} ${t.subject} ${t.department}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  const slots = selected ? (timetable[selected.id] ?? []) : [];
  const slotAt = (day: string, period: number) => slots.find((s) => s.day === day && s.period === period);

  const addSlot = () => {
    if (!selected || !draft.className.trim()) {
      setNotice('Select a teacher and enter a class.');
      return;
    }
    setTimetable((prev) => {
      const current = (prev[selected.id] ?? []).filter((s) => !(s.day === draft.day && s.period === Number(draft.period)));
      return {
        ...prev,
        [selected.id]: [...current, { ...draft, period: Number(draft.period), subject: draft.subject || selected.subject }]
      };
    });
    setNotice(`Period ${draft.period} on ${draft.day} assigned to ${selected.name}.`);
  };

  const clearSlot = (day: string, period: number) => {
    if (!selected) return;
    setTimetable((prev) => ({
      ...prev,
      [selected.id]: (prev[selected.id] ?? []).filter((s) => !(s.day === day && s.period === period))
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher's Management</h1>
        <p className="text-sm text-gray-500">Search a teacher, then manage their weekly timetable</p>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setHasSearched(true); }}
              placeholder="Search teacher by name, ID or subject..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <Button onClick={() => setHasSearched(true)}><Search className="w-4 h-4 mr-2" /> Search</Button>
        </div>

        {hasSearched && (
          <div className="divide-y divide-gray-100">
            {filtered.map((teacher) => (
              <button
                type="button"
                key={teacher.id}
                onClick={() => { setSelected(teacher); setDraft((d) => ({ ...d, subject: teacher.subject })); }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-indigo-50 ${selected?.id === teacher.id ? 'bg-indigo-50' : ''}`}
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
            {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No teachers found.</p>}
          </div>
        )}

        {!hasSearched && (
          <div className="p-10 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2" />
            <p>Search to load the teacher list</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Timetable — {selected.name}
              </h2>
              <p className="text-sm text-gray-500">{selected.subject} · Assigned classes: {selected.classes.join(', ')}</p>
            </div>
            <Badge variant="info">{slots.length} periods placed</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <select value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={draft.period} onChange={(e) => setDraft({ ...draft, period: Number(e.target.value) })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {PERIODS.map((p) => <option key={p} value={p}>Period {p}</option>)}
            </select>
            <input value={draft.className} onChange={(e) => setDraft({ ...draft, className: e.target.value })} placeholder="Class e.g. 10-A" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Subject" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input value={draft.room} onChange={(e) => setDraft({ ...draft, room: e.target.value })} placeholder="Room" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <Button onClick={addSlot}><Save className="w-4 h-4 mr-1" /> Assign</Button>
          </div>

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
                      return (
                        <td key={p} className="px-1 py-1 text-center align-top">
                          {slot ? (
                            <button type="button" onClick={() => clearSlot(day, p)} className="w-full rounded bg-indigo-50 border border-indigo-200 px-1 py-1 hover:bg-red-50" title="Click to clear">
                              <p className="font-semibold text-indigo-800">{slot.className}</p>
                              <p className="text-[10px] text-gray-500">{slot.room}</p>
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
          <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Click an assigned cell to clear it. Free periods stay blank.</p>
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;
