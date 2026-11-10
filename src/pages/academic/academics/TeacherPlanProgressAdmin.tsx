import React, { useMemo, useState } from 'react';
import { Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Printer, RefreshCw, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import {
  ACADEMIC_PLANNING_KEYS,
  CLASSES,
  DEFAULT_WEEKLY_PLANS,
  SUBJECTS,
  checkpointProgress,
  downloadPlanningCsv,
  ensurePlanCheckpoints,
  isPendingWeeklyPlan,
  loadPlanningCollection,
  mondayOfDate,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { EmptyState, SelectField, StatusPill } from './academicPlanningData';

const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return isoDate(date);
};
const formatShort = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const mondayOfIso = (iso: string) => mondayOfDate(new Date(`${iso}T00:00:00`));
const todayIso = () => isoDate(new Date());

type TeacherSummary = {
  teacher: string;
  department: string;
  periods: number;
  completed: number;
  average: number;
  withNotes: number;
  lagging: number;
  classes: string[];
  subjects: string[];
};

export function TeacherPlanProgressAdmin() {
  const [allWeekly, setAllWeekly] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const latestMonday = useMemo(() => {
    const dates = allWeekly.map((row) => row.date).sort();
    return dates.length ? mondayOfIso(dates[dates.length - 1]) : mondayOfDate();
  }, []);
  const [weekStart, setWeekStart] = useState(latestMonday);
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'plans' | 'pending'>('plans');
  const [openTeacher, setOpenTeacher] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<WeeklyTeachingItem | null>(null);
  const [remindNote, setRemindNote] = useState('');

  const weekEnd = addDays(weekStart, 5);

  const reload = () => {
    setAllWeekly(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  };

  const matchesFilters = (row: WeeklyTeachingItem) => {
    if (teacherFilter !== 'All Teachers' && row.teacher !== teacherFilter) return false;
    if (classFilter !== 'All Classes' && row.className !== classFilter) return false;
    if (subjectFilter !== 'All Subjects' && row.subject !== subjectFilter) return false;
    if (statusFilter !== 'All Statuses' && row.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [row.teacher, row.className, row.section, row.subject, row.chapter, row.topic, row.planNotes, row.progressNotes, row.room]
      .join(' ')
      .toLowerCase()
      .includes(q);
  };

  const weekRows = allWeekly.filter((row) => row.date >= weekStart && row.date <= weekEnd);
  const teachers = useMemo(() => Array.from(new Set(allWeekly.map((row) => row.teacher))).sort(), [allWeekly]);
  const pendingRows = allWeekly.filter((row) => isPendingWeeklyPlan(row, todayIso()) && matchesFilters(row));
  const filtered = (tab === 'pending' ? pendingRows : weekRows.filter(matchesFilters));

  const summaries: TeacherSummary[] = useMemo(() => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    filtered.forEach((row) => {
      const list = map.get(row.teacher) || [];
      list.push(row);
      map.set(row.teacher, list);
    });
    return [...map.entries()]
      .map(([teacher, rows]) => {
        const average = rows.length ? Math.round(rows.reduce((sum, item) => sum + checkpointProgress(item), 0) / rows.length) : 0;
        const completed = rows.filter((item) => checkpointProgress(item) >= 100 || item.status === 'Completed').length;
        const withNotes = rows.filter((item) => Boolean((item.planNotes || item.progressNotes || '').trim())).length;
        const lagging = rows.filter((item) => checkpointProgress(item) < 50 && item.status !== 'Completed').length;
        return {
          teacher,
          department: rows[0]?.department || '—',
          periods: rows.length,
          completed,
          average,
          withNotes,
          lagging,
          classes: Array.from(new Set(rows.map((r) => `${r.className}-${r.section}`))),
          subjects: Array.from(new Set(rows.map((r) => r.subject))),
        };
      })
      .sort((a, b) => a.average - b.average || a.teacher.localeCompare(b.teacher));
  }, [filtered]);

  const overallAvg = filtered.length ? Math.round(filtered.reduce((sum, item) => sum + checkpointProgress(item), 0) / filtered.length) : 0;
  const overallDone = filtered.filter((item) => checkpointProgress(item) >= 100 || item.status === 'Completed').length;
  const laggingTeachers = summaries.filter((s) => s.average < 75).length;

  const exportCsv = () => {
    downloadPlanningCsv(
      `teacher-plan-progress-admin-${weekStart}.csv`,
      filtered.map((row) => ({
        Teacher: row.teacher,
        Department: row.department,
        Date: row.date,
        Day: row.day,
        Period: row.periodNumber,
        Time: row.time,
        Class: `${row.className}-${row.section}`,
        Subject: row.subject,
        Chapter: row.chapter,
        Topic: row.topic,
        Status: row.status,
        'Progress %': checkpointProgress(row),
        Checkpoints: ensurePlanCheckpoints(row).map((checkpoint) => `${checkpoint.done ? '[x]' : '[ ]'} ${checkpoint.task}`).join('; '),
        Notes: row.planNotes || row.progressNotes || '',
        Room: row.room,
      })),
    );
  };

  const rowsFor = (teacher: string) =>
    filtered
      .filter((row) => row.teacher === teacher)
      .sort((a, b) => a.date.localeCompare(b.date) || a.periodNumber - b.periodNumber);

  const daysFor = (teacher: string) => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    rowsFor(teacher).forEach((item) => {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  };

  return (
    <div className="min-h-full space-y-5 bg-slate-50 p-4 md:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Curriculum & Academic Planning · Admin</p>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-900">
            <Users className="h-5 w-5 text-indigo-600" />
            Teacher Plan Progress — Admin
          </h1>
          <p className="text-sm text-slate-500">View every teacher’s checkpoints and notes. Same records teachers fill on Teacher Plan Progress.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={reload}><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </div>
      </header>

      {remindNote && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800">{remindNote}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTab('plans')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'plans' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Plans</button>
        <button type="button" onClick={() => setTab('pending')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Pending Plans{pendingRows.length ? ` (${pendingRows.length})` : ''}</button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {tab === 'plans' ? (
              <>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" />Previous</Button>
                <div className="min-w-44 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Plan dates</p>
                  <p className="text-sm font-bold text-slate-800">{formatShort(weekStart)} – {formatShort(weekEnd)}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next<ChevronRight className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setWeekStart(mondayOfDate())}><CalendarDays className="h-4 w-4" />Current</Button>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(latestMonday)}>Week with plans</Button>
              </>
            ) : (
              <p className="text-sm text-slate-500">Delayed or incomplete plans whose date has passed.</p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SelectField label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={['All Teachers', ...teachers]} />
          <SelectField label="Class" value={classFilter} onChange={setClassFilter} options={['All Classes', ...CLASSES]} />
          <SelectField label="Subject" value={subjectFilter} onChange={setSubjectFilter} options={['All Subjects', ...SUBJECTS]} />
          <SelectField label="Period status" value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Planned', 'Completed', 'Skipped', 'Postponed', 'Missed']} />
          <Input label="Search" placeholder="Teacher, class, topic, notes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Teachers', String(summaries.length), 'text-indigo-700'],
          [tab === 'pending' ? 'Pending periods' : 'Periods this week', String(filtered.length), 'text-slate-900'],
          ['Completed', `${overallDone}/${filtered.length || 0}`, 'text-emerald-700'],
          ['Average completion', `${overallAvg}%`, overallAvg < 75 ? 'text-amber-700' : 'text-emerald-700'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`text-xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      {tab === 'plans' && laggingTeachers > 0 && (
        <p className="text-sm text-amber-700">{laggingTeachers} teacher{laggingTeachers === 1 ? '' : 's'} below 75% completion this week.</p>
      )}

      {summaries.length === 0 ? (
        <Card>
          <EmptyState>{tab === 'pending' ? 'No delayed or incomplete plans for these filters.' : 'No teacher plan progress for these dates and filters. Open Teacher Plan Progress to enter updates, or jump to “Week with plans”.'}</EmptyState>
        </Card>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary) => {
            const open = openTeacher === summary.teacher;
            return (
              <Card key={summary.teacher}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setOpenTeacher(open ? null : summary.teacher)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${summary.average < 50 ? 'bg-red-500' : summary.average < 75 ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                      {initials(summary.teacher)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{summary.teacher}</p>
                      <p className="text-sm text-slate-500">
                        {summary.department} · {summary.classes.join(', ')} · {summary.subjects.join(', ')}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {summary.completed}/{summary.periods} complete · {summary.withNotes} with notes
                        {summary.lagging ? ` · ${summary.lagging} lagging` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs"><span>Completion</span><b>{summary.average}%</b></div>
                      <div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${summary.average < 50 ? 'bg-red-500' : summary.average < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${summary.average}%` }} /></div>
                    </div>
                    {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>

                {open && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    {daysFor(summary.teacher).map(([date, rows]) => (
                      <div key={date}>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{formatShort(date)}</p>
                        <div className="space-y-2">
                          {rows.map((item) => {
                            const checkpoints = ensurePlanCheckpoints(item);
                            const pct = checkpointProgress({ ...item, checkpoints });
                            return (
                              <div key={item.id} className={`rounded-xl border p-3 ${pct >= 100 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      Period {item.periodNumber} · {item.time} · {item.className}-{item.section} · {item.subject}
                                    </p>
                                    <p className="text-sm text-slate-500">{item.chapter || 'Chapter'}{item.topic ? `: ${item.topic}` : ''}{item.room ? ` · ${item.room}` : ''}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <StatusPill status={item.status} />
                                    <span className="text-sm font-semibold text-slate-800">{pct}%</span>
                                  </div>
                                </div>
                                <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Checkpoints</p>
                                  {checkpoints.map((checkpoint) => (
                                    <label key={checkpoint.id} className="flex items-start gap-2 text-sm text-slate-700">
                                      <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300" checked={checkpoint.done} readOnly disabled />
                                      <span className={checkpoint.done ? 'text-slate-500 line-through' : ''}>{checkpoint.task || 'Untitled checkpoint'}</span>
                                    </label>
                                  ))}
                                </div>
                                <p className="mt-2 text-sm text-slate-700">
                                  <span className="font-medium text-slate-500">Notes: </span>
                                  {(item.planNotes || item.progressNotes || '').trim() || <span className="italic text-slate-400">Not updated yet</span>}
                                </p>
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setViewItem(item)}><Eye className="h-4 w-4" />View</Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setRemindNote(`Reminder sent to ${item.teacher} for pending ${item.subject} plan · ${item.className}-${item.section} (${formatShort(item.date)}).`);
                                        window.setTimeout(() => setRemindNote(''), 4000);
                                      }}
                                    >
                                      <Bell className="h-4 w-4" />Remind
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        title={viewItem ? `${viewItem.teacher} · ${viewItem.className} ${viewItem.section} · ${viewItem.subject}` : 'Period'}
        size="lg"
        footer={<div className="flex justify-end"><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></div>}
      >
        {viewItem && (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold">{viewItem.day} {formatShort(viewItem.date)} · Period {viewItem.periodNumber} · {viewItem.time}</p>
              <p>{viewItem.chapter || 'Chapter'}{viewItem.topic ? ` · ${viewItem.topic}` : ''}</p>
              <p className="text-xs text-slate-500">{viewItem.room} · {viewItem.type} · {viewItem.department}</p>
            </div>
            <div className="flex items-center justify-between">
              <StatusPill status={viewItem.status} />
              <span className="font-semibold">{checkpointProgress(viewItem)}% complete</span>
            </div>
            <div className="space-y-1">
              <p className="mb-1 text-xs font-medium uppercase text-slate-400">Checkpoints</p>
              {ensurePlanCheckpoints(viewItem).map((checkpoint) => (
                <label key={checkpoint.id} className="flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300" checked={checkpoint.done} readOnly disabled />
                  <span className={checkpoint.done ? 'text-slate-500 line-through' : ''}>{checkpoint.task || 'Untitled checkpoint'}</span>
                </label>
              ))}
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-400">Notes</p>
              <p className="rounded-lg border border-slate-200 bg-white p-3">
                {(viewItem.planNotes || viewItem.progressNotes || '').trim() || 'No notes have been entered yet.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeacherPlanProgressAdmin;
