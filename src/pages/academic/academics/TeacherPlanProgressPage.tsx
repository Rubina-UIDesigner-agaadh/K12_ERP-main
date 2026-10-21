import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Eye, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_WEEKLY_PLANS,
  loadPlanningCollection,
  mondayOfDate,
  savePlanningCollection,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { EmptyState, SelectField, StatusPill, TextAreaField, TextField } from './academicPlanningData';

const SAMPLE_WEEK = '2025-11-24';
const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return isoDate(date); };
const formatShort = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const progressOf = (item: WeeklyTeachingItem) => item.progressPercent ?? (item.status === 'Completed' ? 100 : 0);

type TaskDraft = { notes: string; percent: string };

export function TeacherPlanProgressPage({ currentTeacher = 'Mr. R. Kumar' }: { currentTeacher?: string }) {
  const [allWeekly, setAllWeekly] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const teacher = currentTeacher;
  const [weekStart, setWeekStart] = useState(mondayOfDate());
  const [statusFilter, setStatusFilter] = useState('All Statuses');
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
  const visible = myWeekly.filter((item) => statusFilter === 'All Statuses' || item.status === statusFilter);
  const percent = myWeekly.length ? Math.round(myWeekly.reduce((sum, item) => sum + progressOf(item), 0) / myWeekly.length) : 0;
  const days = useMemo(() => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    visible.forEach((item) => {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  const draftOf = (item: WeeklyTeachingItem): TaskDraft => drafts[item.id] || { notes: item.progressNotes || '', percent: String(progressOf(item)) };
  const setDraft = (id: string, patch: Partial<TaskDraft>) => setDrafts((current) => {
    const item = allWeekly.find((row) => row.id === id);
    const base = current[id] || { notes: item?.progressNotes || '', percent: String(item ? progressOf(item) : 0) };
    return { ...current, [id]: { ...base, ...patch } };
  });

  const saveProgress = (item: WeeklyTeachingItem, complete = false) => {
    const draft = draftOf(item);
    const notes = draft.notes.trim();
    if (!complete && !notes) { flash('Write a description of what you completed before saving progress.'); return; }
    const progressPercent = complete ? 100 : Math.max(0, Math.min(100, Math.round(Number(draft.percent) || 0)));
    const updated: WeeklyTeachingItem = {
      ...item,
      progressNotes: notes || item.progressNotes || (complete ? 'Task marked complete.' : ''),
      progressPercent,
      status: progressPercent >= 100 ? 'Completed' : item.status === 'Completed' ? 'Planned' : item.status
    };
    persistWeekly(updated);
    setDrafts((current) => ({ ...current, [item.id]: { notes: updated.progressNotes || '', percent: String(progressPercent) } }));
    if (viewItem?.id === item.id) setViewItem(updated);
    flash(complete ? `${item.subject} marked complete.` : `${item.subject} progress saved at ${progressPercent}%.`);
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-slate-50 min-h-full">
      {toast && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{toast}</div>}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">{initials(teacher)}</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Teacher Plan Progress</h1>
            <p className="text-sm text-slate-500">Update each teaching task with what you completed and how much of it is done.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </div>
      </header>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" />Previous</Button>
            <div className="min-w-44 text-center">
              <p className="text-[10px] font-bold uppercase text-slate-400">Plan dates</p>
              <p className="text-sm font-bold text-slate-800">{formatShort(weekStart)} – {formatShort(addDays(weekStart, 5))}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next<ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setWeekStart(mondayOfDate())}><CalendarDays className="h-4 w-4" />Current</Button>
            <Button size="sm" variant="outline" onClick={() => setWeekStart(SAMPLE_WEEK)}>Sample dates (demo)</Button>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField label="Period status" value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Planned', 'Completed', 'Skipped', 'Postponed', 'Missed', 'Substituted']} />
            <div className="min-w-[220px] pb-1">
              <div className="mb-1 flex justify-between text-sm"><span>Completion</span><b>{percent}%</b></div>
              <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} /></div>
            </div>
          </div>
        </div>
      </Card>

      {days.length === 0 && (
        <Card>
          <EmptyState>No teaching periods are assigned for these dates. When a teaching plan is created, it will appear here to update progress.</EmptyState>
        </Card>
      )}

      {days.map(([date, rows]) => (
        <Card key={date} title={formatShort(date)}>
          <div className="space-y-3">
            {rows.sort((a, b) => a.periodNumber - b.periodNumber).map((item) => {
              const draft = draftOf(item);
              const progress = Number(draft.percent) || 0;
              return (
                <div key={item.id} className={`rounded-xl border p-4 ${progress >= 100 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">Period {item.periodNumber} · {item.time} · {item.className}-{item.section} · {item.subject}</p>
                      <p className="text-sm text-slate-500">{item.chapter || 'Chapter'}{item.topic ? `: ${item.topic}` : ''}{item.room ? ` · ${item.room}` : ''}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px]">
                    <TextAreaField
                      label="What did you complete?"
                      value={draft.notes}
                      onChange={(value) => setDraft(item.id, { notes: value })}
                      placeholder="Describe the portion of this task you completed..."
                      rows={3}
                    />
                    <TextField
                      label="% of task completed"
                      type="number"
                      min="0"
                      max="100"
                      value={draft.percent}
                      onChange={(value) => setDraft(item.id, { percent: value })}
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
            <TextAreaField
              label="What did you complete?"
              value={draftOf(viewItem).notes}
              onChange={(value) => setDraft(viewItem.id, { notes: value })}
              placeholder="Describe the portion of this task you completed..."
              rows={4}
            />
            <TextField
              label="% of task completed"
              type="number"
              min="0"
              max="100"
              value={draftOf(viewItem).percent}
              onChange={(value) => setDraft(viewItem.id, { percent: value })}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeacherPlanProgressPage;
