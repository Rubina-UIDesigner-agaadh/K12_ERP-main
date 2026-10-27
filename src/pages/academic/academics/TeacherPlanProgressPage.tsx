import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Eye, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_WEEKLY_PLANS,
  checkpointProgress,
  ensurePlanCheckpoints,
  isPendingWeeklyPlan,
  loadPlanningCollection,
  mondayOfDate,
  savePlanningCollection,
  type PlanCheckpoint,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { EmptyState, SelectField, StatusPill, TextAreaField } from './academicPlanningData';

const SAMPLE_WEEK = '2025-11-24';
const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return isoDate(date); };
const formatShort = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const todayIso = () => isoDate(new Date());

type TaskDraft = { notes: string; checkpoints: PlanCheckpoint[] };

const applyProgress = (item: WeeklyTeachingItem, checkpoints: PlanCheckpoint[], notes: string): WeeklyTeachingItem => {
  const progressPercent = checkpoints.length ? Math.round((checkpoints.filter((checkpoint) => checkpoint.done).length / checkpoints.length) * 100) : 0;
  return {
    ...item,
    checkpoints,
    planNotes: notes,
    progressNotes: notes,
    progressPercent,
    status: progressPercent >= 100 ? 'Completed' : item.status === 'Completed' ? 'Planned' : item.status,
  };
};

export function TeacherPlanProgressPage({ currentTeacher = 'Mr. R. Kumar' }: { currentTeacher?: string }) {
  const [allWeekly, setAllWeekly] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const teacher = currentTeacher;
  const [weekStart, setWeekStart] = useState(mondayOfDate());
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [tab, setTab] = useState<'plans' | 'pending'>('plans');
  const [toast, setToast] = useState('');
  const [viewItem, setViewItem] = useState<WeeklyTeachingItem | null>(null);
  const [drafts, setDrafts] = useState<Record<string, TaskDraft>>({});

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 3500); };

  const persistWeekly = (updated: WeeklyTeachingItem) => {
    const next = allWeekly.some((row) => row.id === updated.id) ? allWeekly.map((row) => row.id === updated.id ? updated : row) : [updated, ...allWeekly];
    savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next);
    setAllWeekly(next);
  };

  const myWeekly = allWeekly.filter((row) => row.teacher === teacher && row.date >= weekStart && row.date <= addDays(weekStart, 5));
  const pendingRows = allWeekly.filter((row) => row.teacher === teacher && isPendingWeeklyPlan(row, todayIso()));
  const visible = (tab === 'pending' ? pendingRows : myWeekly).filter((item) => statusFilter === 'All Statuses' || item.status === statusFilter);
  const percent = myWeekly.length ? Math.round(myWeekly.reduce((sum, item) => sum + checkpointProgress(item), 0) / myWeekly.length) : 0;
  const days = useMemo(() => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    visible.forEach((item) => {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  const draftOf = (item: WeeklyTeachingItem): TaskDraft => drafts[item.id] || { notes: item.planNotes || item.progressNotes || '', checkpoints: ensurePlanCheckpoints(item) };
  const setDraft = (id: string, patch: Partial<TaskDraft>) => setDrafts((current) => {
    const item = allWeekly.find((row) => row.id === id);
    const base = current[id] || { notes: item?.planNotes || item?.progressNotes || '', checkpoints: item ? ensurePlanCheckpoints(item) : [] };
    return { ...current, [id]: { ...base, ...patch } };
  });

  const persistDraft = (item: WeeklyTeachingItem, nextDraft: TaskDraft, flashText: string) => {
    const updated = applyProgress(item, nextDraft.checkpoints, nextDraft.notes.trim());
    persistWeekly(updated);
    setDrafts((current) => ({ ...current, [item.id]: { notes: updated.planNotes || '', checkpoints: updated.checkpoints || nextDraft.checkpoints } }));
    if (viewItem?.id === item.id) setViewItem(updated);
    flash(flashText);
  };

  const toggleCheckpoint = (item: WeeklyTeachingItem, checkpointId: string) => {
    const draft = draftOf(item);
    const checkpoints = draft.checkpoints.map((checkpoint) => checkpoint.id === checkpointId ? { ...checkpoint, done: !checkpoint.done } : checkpoint);
    const next = { ...draft, checkpoints };
    setDraft(item.id, next);
    const pct = checkpoints.length ? Math.round((checkpoints.filter((checkpoint) => checkpoint.done).length / checkpoints.length) * 100) : 0;
    persistDraft(item, next, `${item.subject} progress is now ${pct}%.`);
  };

  const saveProgress = (item: WeeklyTeachingItem, complete = false) => {
    const draft = draftOf(item);
    const checkpoints = complete ? draft.checkpoints.map((checkpoint) => ({ ...checkpoint, done: true })) : draft.checkpoints;
    persistDraft(item, { ...draft, checkpoints }, complete ? `${item.subject} marked complete.` : `${item.subject} progress saved.`);
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-slate-50 min-h-full">
      {toast && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{toast}</div>}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">{initials(teacher)}</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Teacher Plan Progress</h1>
            <p className="text-sm text-slate-500">Tick checkpoints as you complete them. Progress is calculated from checked tasks.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTab('plans')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'plans' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Plans</button>
        <button type="button" onClick={() => setTab('pending')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Pending Plans{pendingRows.length ? ` (${pendingRows.length})` : ''}</button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {tab === 'plans' && (
              <>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" />Previous</Button>
                <div className="min-w-44 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Plan dates</p>
                  <p className="text-sm font-bold text-slate-800">{formatShort(weekStart)} – {formatShort(addDays(weekStart, 5))}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next<ChevronRight className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setWeekStart(mondayOfDate())}><CalendarDays className="h-4 w-4" />Current</Button>
                <Button size="sm" variant="outline" onClick={() => setWeekStart(SAMPLE_WEEK)}>Sample dates (demo)</Button>
              </>
            )}
            {tab === 'pending' && <p className="text-sm text-slate-500">Delayed or incomplete plans whose date has passed.</p>}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField label="Period status" value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Planned', 'Completed', 'Skipped', 'Postponed', 'Missed', 'Substituted']} />
            {tab === 'plans' && (
              <div className="min-w-[220px] pb-1">
                <div className="mb-1 flex justify-between text-sm"><span>Completion</span><b>{percent}%</b></div>
                <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} /></div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {days.length === 0 && (
        <Card>
          <EmptyState>{tab === 'pending' ? 'No delayed or incomplete plans.' : 'No teaching periods are assigned for these dates. When a teaching plan is created, it will appear here to update progress.'}</EmptyState>
        </Card>
      )}

      {days.map(([date, rows]) => (
        <Card key={date} title={formatShort(date)}>
          <div className="space-y-3">
            {rows.sort((a, b) => a.periodNumber - b.periodNumber).map((item) => {
              const draft = draftOf(item);
              const progress = draft.checkpoints.length ? Math.round((draft.checkpoints.filter((checkpoint) => checkpoint.done).length / draft.checkpoints.length) * 100) : 0;
              return (
                <div key={item.id} className={`rounded-xl border p-4 ${progress >= 100 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">Period {item.periodNumber} · {item.time} · {item.className}-{item.section} · {item.subject}</p>
                      <p className="text-sm text-slate-500">{item.chapter || 'Chapter'}{item.topic ? `: ${item.topic}` : ''}{item.room ? ` · ${item.room}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <StatusPill status={item.status} />
                      <p className="mt-1 text-sm font-semibold text-slate-800">{progress}%</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Checkpoints</p>
                    {draft.checkpoints.map((checkpoint) => (
                      <label key={checkpoint.id} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={checkpoint.done}
                          onChange={() => toggleCheckpoint(item, checkpoint.id)}
                        />
                        <span className={checkpoint.done ? 'text-slate-500 line-through' : ''}>{checkpoint.task || 'Untitled checkpoint'}</span>
                      </label>
                    ))}
                    {!draft.checkpoints.length && <p className="text-sm italic text-slate-400">No checkpoints were added to this plan.</p>}
                  </div>
                  <div className="mt-4">
                    <TextAreaField
                      label="Notes"
                      value={draft.notes}
                      onChange={(value) => setDraft(item.id, { notes: value })}
                      placeholder="Notes for this plan..."
                      rows={3}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setViewItem(item)}><Eye className="h-4 w-4" />View</Button>
                    <Button size="sm" onClick={() => saveProgress(item)}>Save Progress</Button>
                    <Button size="sm" variant="outline" onClick={() => saveProgress(item, true)}><CheckCircle className="h-4 w-4" />Mark Complete</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      <Modal
        isOpen={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        title={viewItem ? `${viewItem.className} ${viewItem.section} · ${viewItem.subject}` : 'Task'}
        size="lg"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>{viewItem ? <Button onClick={() => saveProgress(viewItem)}>Save Progress</Button> : null}</div>}
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold">{viewItem.day} {formatShort(viewItem.date)} · Period {viewItem.periodNumber} · {viewItem.time}</p>
              <p>{viewItem.chapter || 'Chapter'}{viewItem.topic ? ` · ${viewItem.topic}` : ''}</p>
              <p className="text-xs text-slate-500">{viewItem.room} · {viewItem.type}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Checkpoints</p>
              {draftOf(viewItem).checkpoints.map((checkpoint) => (
                <label key={checkpoint.id} className="flex items-start gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={checkpoint.done}
                    onChange={() => toggleCheckpoint(viewItem, checkpoint.id)}
                  />
                  <span className={checkpoint.done ? 'text-slate-500 line-through' : ''}>{checkpoint.task || 'Untitled checkpoint'}</span>
                </label>
              ))}
            </div>
            <TextAreaField
              label="Notes"
              value={draftOf(viewItem).notes}
              onChange={(value) => setDraft(viewItem.id, { notes: value })}
              placeholder="Notes for this plan..."
              rows={4}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeacherPlanProgressPage;
