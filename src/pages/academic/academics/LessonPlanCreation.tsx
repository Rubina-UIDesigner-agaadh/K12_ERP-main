import React, { useMemo, useState } from 'react';
import { CheckCircle, Download, Eye, Printer, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_WEEKLY_PLANS,
  EmptyState,
  PageHeader,
  SelectField,
  TextAreaField,
  downloadPlanningCsv,
  loadPlanningCollection,
  savePlanningCollection,
  type WeeklyTeachingItem
} from './academicPlanningData';

type PrincipalDecision = 'Approved' | 'Rejected' | 'Returned for Revision';

const decisionTone = (decision?: string) => {
  if (decision === 'Approved') return 'success';
  if (decision === 'Rejected') return 'danger';
  if (decision === 'Returned for Revision') return 'warning';
  return 'info';
};

export function LessonPlanReview() {
  const [plans, setPlans] = useState<WeeklyTeachingItem[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const [search, setSearch] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [active, setActive] = useState<WeeklyTeachingItem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [toast, setToast] = useState('');

  const persist = (next: WeeklyTeachingItem[]) => {
    setPlans(next);
    savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next);
  };
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };

  const teachers = ['All Teachers', ...new Set(plans.map((plan) => plan.teacher))];

  const reviewStatus = (plan: WeeklyTeachingItem) => {
    if (!plan.planSubmitted) return 'Draft';
    if (plan.reviewDecision === 'Approved') return 'Approved';
    if (plan.reviewDecision === 'Rejected') return 'Rejected';
    if (plan.reviewDecision === 'Returned for Revision') return 'Sent for Review';
    return 'Pending';
  };

  const filtered = useMemo(() => plans.filter((plan) => {
    const status = reviewStatus(plan);
    const matchesTeacher = teacherFilter === 'All Teachers' || plan.teacher === teacherFilter;
    const matchesSearch = !search || `${plan.teacher} ${plan.className} ${plan.subject} ${plan.chapter} ${plan.topic}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesTeacher && matchesSearch && matchesStatus;
  }).sort((a, b) => b.date.localeCompare(a.date) || a.periodNumber - b.periodNumber), [plans, teacherFilter, search, statusFilter]);

  const pendingCount = plans.filter((plan) => reviewStatus(plan) === 'Pending').length;
  const approvedCount = plans.filter((plan) => reviewStatus(plan) === 'Approved').length;
  const rejectedCount = plans.filter((plan) => reviewStatus(plan) === 'Rejected').length;
  const returnedCount = plans.filter((plan) => reviewStatus(plan) === 'Sent for Review').length;

  const decide = (plan: WeeklyTeachingItem, decision: PrincipalDecision) => {
    if ((decision === 'Rejected' || decision === 'Returned for Revision') && !feedback.trim()) {
      flash('Add a comment before rejecting or sending for review.');
      return;
    }
    persist(plans.map((item) => item.id === plan.id ? {
      ...item,
      planSubmitted: decision === 'Returned for Revision' ? false : item.planSubmitted,
      reviewDecision: decision,
      reviewFeedback: feedback.trim()
    } : item));
    setActive(null);
    setFeedback('');
    flash(decision === 'Approved' ? `Teaching plan approved for ${plan.teacher}.` : decision === 'Rejected' ? `Teaching plan rejected for ${plan.teacher}.` : `Teaching plan sent back to ${plan.teacher} for review.`);
  };

  const exportRows = () => downloadPlanningCsv('teaching-plan-review.csv', filtered.map((plan) => ({
    Teacher: plan.teacher,
    Class: `${plan.className} ${plan.section}`,
    Subject: plan.subject,
    Chapter: plan.chapter,
    Topic: plan.topic,
    Date: plan.date,
    Period: plan.periodNumber,
    Status: reviewStatus(plan),
    Feedback: plan.reviewFeedback || ''
  })));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Lesson Plan Review"
        description="Principal review of teaching plans created on the Teaching Plan page. Approve, reject, or send a plan back for review."
        actions={<>
          <Button variant="outline" onClick={exportRows}><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </>}
      />

      {toast && <div className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><span>{toast}</span><button type="button" onClick={() => setToast('')} className="text-green-700"><X className="h-4 w-4" /></button></div>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Pending', value: pendingCount },
          { label: 'Approved', value: approvedCount },
          { label: 'Rejected', value: rejectedCount },
          { label: 'Sent for Review', value: returnedCount }
        ].map((card) => (
          <Card key={card.label}><p className="text-2xl font-bold text-slate-900">{card.value}</p><p className="text-xs text-slate-500">{card.label}</p></Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block min-w-[220px] flex-1">
            <span className="mb-1 block text-xs font-medium text-slate-600">Search teaching plans</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" placeholder="Teacher, class, chapter or topic" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </label>
          <SelectField label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={teachers} />
          <SelectField label="Status" value={statusFilter} onChange={setStatusFilter} options={['All', 'Pending', 'Approved', 'Rejected', 'Sent for Review', 'Draft']} />
        </div>
      </Card>

      <Card title="Teaching plans" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Chapter / Topic</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((plan) => (
                <tr key={plan.id} className="hover:bg-indigo-50/30">
                  <td className="px-4 py-3 font-medium text-slate-800">{plan.teacher}</td>
                  <td className="px-4 py-3">{plan.className} · {plan.section}</td>
                  <td className="px-4 py-3">{plan.subject}</td>
                  <td className="px-4 py-3">{plan.chapter || '—'}<p className="text-[11px] text-slate-400">{plan.topic || 'No topic'}</p></td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.date}<p className="text-[11px] text-slate-400">Period {plan.periodNumber} · {plan.time}</p></td>
                  <td className="px-4 py-3"><Badge variant={decisionTone(plan.reviewDecision) as 'success' | 'danger' | 'warning' | 'info'}>{reviewStatus(plan)}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="xs" variant="outline" onClick={() => { setActive(plan); setFeedback(plan.reviewFeedback || ''); }}><Eye className="h-3.5 w-3.5" />Review</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12"><EmptyState>No teaching plans match the selected filters. Submit a plan from Teaching Plan to appear here.</EmptyState></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `Review teaching plan — ${active.teacher}` : 'Review teaching plan'}
        size="lg"
        footer={active && reviewStatus(active) === 'Pending' ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setActive(null)}>Cancel</Button>
            <Button variant="outline" onClick={() => active && decide(active, 'Returned for Revision')}><RotateCcw className="h-4 w-4" />Send for Review</Button>
            <Button variant="danger" onClick={() => active && decide(active, 'Rejected')}><X className="h-4 w-4" />Reject</Button>
            <Button onClick={() => active && decide(active, 'Approved')}><CheckCircle className="h-4 w-4" />Approve</Button>
          </div>
        ) : (
          <div className="flex justify-end"><Button onClick={() => setActive(null)}>Close</Button></div>
        )}
      >
        {active && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <p><span className="text-slate-500">Teacher</span><br /><b>{active.teacher}</b></p>
              <p><span className="text-slate-500">Class</span><br /><b>{active.className} · {active.section}</b></p>
              <p><span className="text-slate-500">Subject</span><br /><b>{active.subject}</b></p>
              <p><span className="text-slate-500">Date / Period</span><br /><b>{active.date} · Period {active.periodNumber} ({active.time})</b></p>
              <p><span className="text-slate-500">Chapter</span><br /><b>{active.chapter || '—'}</b></p>
              <p><span className="text-slate-500">Topic</span><br /><b>{active.topic || '—'}</b></p>
              <p><span className="text-slate-500">Room</span><br /><b>{active.room || '—'}</b></p>
              <p><span className="text-slate-500">Type</span><br /><b>{active.type}</b></p>
            </div>
            {active.reviewFeedback && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Previous comment: {active.reviewFeedback}</p>}
            <TextAreaField label="Principal comment" value={feedback} onChange={setFeedback} placeholder="Required when rejecting or sending for review" />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LessonPlanReview;
