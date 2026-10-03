import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, Check, CheckCircle2, ChevronDown, Clock3, Download, Eye, FileText,
  Filter, LayoutGrid, ListFilter, Paperclip, PauseCircle, Search, Send,
  ShieldCheck, Table2, UserRound, Users, X, XCircle, ArrowRight, AlertTriangle
} from 'lucide-react';

type Priority = 'Urgent' | 'Normal' | 'Comfortable';
type SubmissionStatus = 'In Progress' | 'Fully Approved' | 'Rejected' | 'On Hold' | 'Returned to Me';
type StepState = 'completed' | 'current' | 'waiting' | 'rejected' | 'skipped' | 'escalated';
type WorkflowStep = { role: string; person: string; state: StepState; mine?: boolean; note?: string };
type Comment = { id: string; author: string; role: string; time: string; text: string; system?: boolean };
type DataField = { label: string; value: string; previous?: string };
type WorkflowTask = {
  id: string; title: string; module: string; branch: string; requester: string; requesterRole: string;
  submitted: string; amount: string; priority: Priority; assignedTo: string; assignedRole: string;
  slaDueAt: number; currentStage: number; steps: WorkflowStep[]; description: string;
  data: DataField[]; comments: Comment[]; legacy?: boolean; submissionStatus?: SubmissionStatus; isNew?: boolean;
};

type Notification = { id: string; title: string; body: string; time: string; kind: 'approval' | 'return' | 'system'; read: boolean };

const CURRENT_USER = 'Rahul Sharma';
const minsFromNow = (minutes: number) => Date.now() + minutes * 60_000;

const START_PENDING: WorkflowTask[] = [
  {
    id: 'WF-2026-001284', title: 'Class 8 Mathematics — marks submission', module: 'Examinations', branch: 'Main Campus', requester: 'Priya Nair', requesterRole: 'Class Teacher', submitted: 'Today, 09:14 AM', amount: 'Class 8-A · 32 students', priority: 'Urgent', assignedTo: CURRENT_USER, assignedRole: 'HOD', slaDueAt: minsFromNow(145), currentStage: 1,
    steps: [{ role: 'Teacher', person: 'Priya Nair', state: 'completed', note: 'Submitted 09:14 AM' }, { role: 'HOD', person: CURRENT_USER, state: 'current', mine: true }, { role: 'Principal', person: 'Ananya Desai', state: 'waiting' }],
    description: 'Term assessment marks are ready for review. One changed mark is highlighted against the previously submitted score.',
    data: [{ label: 'Student', value: 'Aarav Mehta' }, { label: 'Class / subject', value: '8-A · Mathematics' }, { label: 'Assessment', value: 'Unit Test 2' }, { label: 'Obtained marks', value: '82 / 100', previous: '78' }, { label: 'Submitted by', value: 'Priya Nair · Class Teacher' }],
    comments: [{ id: 'c1', author: 'Priya Nair', role: 'Class Teacher', time: '09:16 AM', text: 'Please review the corrected entry. The paper was rechecked with the student.' }]
  },
  {
    id: 'WF-2026-001281', title: 'Science lab equipment purchase request', module: 'Procurement', branch: 'North Campus', requester: 'Karan Patel', requesterRole: 'Science HOD', submitted: 'Today, 08:42 AM', amount: '₹1,24,000 · 3 quotations', priority: 'Urgent', assignedTo: CURRENT_USER, assignedRole: 'HOD', slaDueAt: minsFromNow(-18), currentStage: 1,
    steps: [{ role: 'Teacher', person: 'Karan Patel', state: 'completed' }, { role: 'HOD', person: CURRENT_USER, state: 'current', mine: true }, { role: 'Principal', person: 'Ananya Desai', state: 'waiting' }],
    description: 'Purchase request for microscopes and safety equipment for the upcoming practical cycle.',
    data: [{ label: 'Requested by', value: 'Karan Patel · Science HOD' }, { label: 'Vendor', value: 'Apex Scientific Supplies' }, { label: 'Items', value: 'Microscopes × 6, safety kits × 12' }, { label: 'Total', value: '₹1,24,000' }, { label: 'Budget line', value: 'Science Lab · FY 2026-27' }],
    comments: [{ id: 'c2', author: 'System', role: 'Workflow', time: '10:05 AM', text: 'SLA was breached; next reminder has been sent.', system: true }]
  },
  {
    id: 'WF-2026-001279', title: 'Student transfer certificate — Riya Shah', module: 'Student Services', branch: 'Main Campus', requester: 'Mihir Vyas', requesterRole: 'Registrar', submitted: 'Yesterday, 03:20 PM', amount: 'Class 6-B · ADM-2021-0142', priority: 'Normal', assignedTo: CURRENT_USER, assignedRole: 'HOD', slaDueAt: minsFromNow(690), currentStage: 1,
    steps: [{ role: 'Registrar', person: 'Mihir Vyas', state: 'completed' }, { role: 'HOD', person: CURRENT_USER, state: 'current', mine: true }, { role: 'Principal', person: 'Ananya Desai', state: 'waiting' }],
    description: 'Transfer certificate request with fee clearance and library clearance attached.',
    data: [{ label: 'Student', value: 'Riya Shah · Class 6-B' }, { label: 'Admission no.', value: 'ADM-2021-0142' }, { label: 'Last attendance', value: '30 Sep 2026' }, { label: 'Clearance', value: 'Fee and library cleared' }],
    comments: []
  },
  {
    id: 'WF-2026-001272', title: 'Staff travel reimbursement — inter-school event', module: 'Finance', branch: 'South Campus', requester: 'Sonal Bhatt', requesterRole: 'Teacher', submitted: 'Yesterday, 01:10 PM', amount: '₹8,750 · 4 receipts', priority: 'Normal', assignedTo: CURRENT_USER, assignedRole: 'HOD', slaDueAt: minsFromNow(355), currentStage: 1,
    steps: [{ role: 'Teacher', person: 'Sonal Bhatt', state: 'completed' }, { role: 'HOD', person: CURRENT_USER, state: 'current', mine: true }, { role: 'Finance', person: 'Rahul Mehta', state: 'waiting' }],
    description: 'Travel reimbursement for the regional academic meet. Receipts and the event invite are attached.',
    data: [{ label: 'Claimant', value: 'Sonal Bhatt · English Department' }, { label: 'Event', value: 'Regional Academic Meet' }, { label: 'Claim total', value: '₹8,750' }, { label: 'Attachments', value: '4 receipts · 1 invitation' }],
    comments: []
  },
  {
    id: 'WF-2026-001264', title: 'Annual day stage and sound booking', module: 'Administration', branch: 'Main Campus', requester: 'Devang Joshi', requesterRole: 'Activities Coordinator', submitted: '30 Sep 2026, 04:05 PM', amount: '₹48,500 · event date 18 Oct', priority: 'Comfortable', assignedTo: CURRENT_USER, assignedRole: 'HOD', slaDueAt: minsFromNow(2_450), currentStage: 1,
    steps: [{ role: 'Coordinator', person: 'Devang Joshi', state: 'completed' }, { role: 'HOD', person: CURRENT_USER, state: 'current', mine: true }, { role: 'Principal', person: 'Ananya Desai', state: 'waiting' }],
    description: 'Venue equipment booking for the annual day program; the event plan and vendor quote are attached.',
    data: [{ label: 'Event', value: 'Annual Day 2026' }, { label: 'Vendor', value: 'Swar Events' }, { label: 'Booking date', value: '18 Oct 2026' }, { label: 'Request total', value: '₹48,500' }],
    comments: []
  }
];

const START_SUBMISSIONS: WorkflowTask[] = [
  { ...START_PENDING[0], id: 'WF-2026-001240', title: 'Class 8 Mathematics — marks submission', priority: 'Normal', submissionStatus: 'In Progress', assignedTo: 'Vice Principal', assignedRole: 'Vice Principal', legacy: true, isNew: false, steps: [{ role: 'Teacher', person: CURRENT_USER, state: 'completed' }, { role: 'HOD', person: 'Mihir Vyas', state: 'completed' }, { role: 'Principal', person: 'Ananya Desai', state: 'current' }] },
  { ...START_PENDING[1], id: 'WF-2026-001198', title: 'Computer lab projector replacement', priority: 'Comfortable', submissionStatus: 'Fully Approved', assignedTo: 'Completed', assignedRole: 'Operations', isNew: false, steps: [{ role: 'HOD', person: CURRENT_USER, state: 'completed' }, { role: 'Finance', person: 'Rahul Mehta', state: 'completed' }, { role: 'Principal', person: 'Ananya Desai', state: 'completed' }] },
  { ...START_PENDING[2], id: 'WF-2026-001177', title: 'Class 6 transfer certificate request', priority: 'Normal', submissionStatus: 'Returned to Me', assignedTo: CURRENT_USER, assignedRole: 'Requester', isNew: true, steps: [{ role: 'Registrar', person: CURRENT_USER, state: 'completed' }, { role: 'HOD', person: 'Rahul Sharma', state: 'rejected', note: 'Please attach the fee clearance.' }, { role: 'Requester', person: CURRENT_USER, state: 'current', mine: true }] },
  { ...START_PENDING[3], id: 'WF-2026-001152', title: 'Staff travel reimbursement — district workshop', priority: 'Normal', submissionStatus: 'Rejected', assignedTo: 'Completed', assignedRole: 'Finance', isNew: false, steps: [{ role: 'Teacher', person: CURRENT_USER, state: 'completed' }, { role: 'HOD', person: 'Mihir Vyas', state: 'completed' }, { role: 'Finance', person: 'Rahul Mehta', state: 'rejected' }] },
  { ...START_PENDING[4], id: 'WF-2026-001109', title: 'Library reading-corner furniture', priority: 'Comfortable', submissionStatus: 'On Hold', assignedTo: 'Procurement', assignedRole: 'Buyer', isNew: false, steps: [{ role: 'HOD', person: CURRENT_USER, state: 'completed' }, { role: 'Procurement', person: 'Karan Patel', state: 'current' }, { role: 'Finance', person: 'Rahul Mehta', state: 'waiting' }] }
];

const START_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Approval needed today', body: 'Science lab equipment purchase is overdue by 18 minutes.', time: 'Just now', kind: 'approval', read: false },
  { id: 'n2', title: 'Returned to you', body: 'Transfer certificate request needs fee clearance.', time: '18 min ago', kind: 'return', read: false },
  { id: 'n3', title: 'Workflow updated', body: 'Marks submission is now on version 2.', time: '1 hr ago', kind: 'system', read: false },
  { id: 'n4', title: 'Approval completed', body: 'Your projector request was fully approved.', time: 'Yesterday', kind: 'approval', read: true }
];

const PRIORITY_STYLES: Record<Priority, string> = {
  Urgent: 'border-red-200 bg-red-50 text-red-700',
  Normal: 'border-amber-200 bg-amber-50 text-amber-700',
  Comfortable: 'border-green-200 bg-green-50 text-green-700'
};
const STATUS_STYLES: Record<SubmissionStatus, string> = {
  'In Progress': 'border-amber-200 bg-amber-50 text-amber-700',
  'Fully Approved': 'border-green-200 bg-green-50 text-green-700',
  Rejected: 'border-red-200 bg-red-50 text-red-700',
  'On Hold': 'border-gray-200 bg-gray-100 text-gray-600',
  'Returned to Me': 'border-amber-200 bg-amber-50 text-amber-800'
};

function priorityLabel(priority: Priority) {
  return priority === 'Urgent' ? '🔴 URGENT' : priority === 'Normal' ? '🟡 NORMAL' : '🟢 COMFORTABLE';
}
function slaText(task: WorkflowTask, now: number) {
  const minutes = Math.ceil((task.slaDueAt - now) / 60_000);
  if (minutes <= 0) return `OVERDUE · ${Math.abs(minutes)}m`;
  if (minutes < 60) return `${minutes}m remaining`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`;
  return `${Math.floor(minutes / 1_440)}d ${Math.floor((minutes % 1_440) / 60)}h remaining`;
}
function slaTone(task: WorkflowTask, now: number) {
  const minutes = Math.ceil((task.slaDueAt - now) / 60_000);
  return minutes <= 0 ? 'text-red-700 bg-red-50' : minutes < 240 ? 'text-red-700' : minutes < 1_440 ? 'text-amber-600' : 'text-emerald-600';
}
function escapeCsv(value: string) { return `"${String(value).replace(/"/g, '""')}"`; }

export function UnifiedApprovalInbox() {
  const [pending, setPending] = useState(START_PENDING);
  const [submissions, setSubmissions] = useState(START_SUBMISSIONS);
  const [notifications, setNotifications] = useState(START_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'pending' | 'submissions'>('pending');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [profileTaskId, setProfileTaskId] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [decisionComment, setDecisionComment] = useState('');
  const [decisionError, setDecisionError] = useState('');
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [delegateTo, setDelegateTo] = useState('Mihir Vyas');
  const [successMessage, setSuccessMessage] = useState('');
  const [toast, setToast] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = window.setTimeout(() => { setSelectedTask(null); setSuccessMessage(''); setDecision(null); }, 1500);
    return () => window.clearTimeout(timer);
  }, [successMessage]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const breachedCount = pending.filter((task) => task.slaDueAt < now).length;
  const filteredPending = useMemo(() => pending.filter((task) => {
    const text = `${task.id} ${task.title} ${task.requester} ${task.module} ${task.branch}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (moduleFilter === 'All modules' || task.module === moduleFilter) && (priorityFilter === 'All priorities' || task.priority === priorityFilter) && (statusFilter === 'All statuses' || (statusFilter === 'Overdue' ? task.slaDueAt < now : statusFilter === 'On hold' ? task.assignedRole === 'On hold' : task.assignedRole !== 'On hold'));
  }), [pending, query, moduleFilter, priorityFilter, statusFilter, now]);
  const filteredSubmissions = submissions.filter((task) => {
    const text = `${task.id} ${task.title} ${task.module} ${task.submissionStatus}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (moduleFilter === 'All modules' || task.module === moduleFilter) && (statusFilter === 'All statuses' || task.submissionStatus === statusFilter);
  });
  const activeTask = selectedTask ? pending.find((task) => task.id === selectedTask.id) || submissions.find((task) => task.id === selectedTask.id) || selectedTask : null;
  const modules = Array.from(new Set([...pending, ...submissions].map((task) => task.module)));
  const activeFilters = [moduleFilter !== 'All modules' ? `Module: ${moduleFilter}` : '', priorityFilter !== 'All priorities' ? `Priority: ${priorityFilter}` : '', statusFilter !== 'All statuses' ? `Status: ${statusFilter}` : '', query ? `Search: ${query}` : ''].filter(Boolean);

  const clearFilters = () => { setQuery(''); setModuleFilter('All modules'); setPriorityFilter('All priorities'); setStatusFilter('All statuses'); };
  const toastMessage = (message: string) => setToast(message);
  const openTask = (task: WorkflowTask, startDecision?: 'approve' | 'reject') => {
    setSelectedTask(task); setCommentDraft(''); setDecisionComment(''); setDecisionError(''); setDecision(startDecision || null); setSuccessMessage(''); setDelegateOpen(false);
  };
  const notifyDecision = (title: string, body: string) => setNotifications((current) => [{ id: `n-${Date.now()}`, title, body, time: 'Just now', kind: 'approval', read: false }, ...current]);

  const finishDecision = (task: WorkflowTask, action: 'approve' | 'reject', reason = '') => {
    if (action === 'reject' && reason.trim().length < 10) { setDecisionError('Please add a short reason (at least 10 characters) before returning this task.'); return; }
    if (action === 'approve') {
      setPending((current) => current.filter((item) => item.id !== task.id));
      setSubmissions((current) => [{ ...task, submissionStatus: 'Fully Approved', assignedTo: 'Completed', assignedRole: 'Completed', steps: task.steps.map((step, index) => index <= task.currentStage ? { ...step, state: 'completed' } : step) }, ...current]);
      setSuccessMessage(`Approved! Forwarding to ${task.steps[task.currentStage + 1]?.person || 'the next approver'}…`);
      notifyDecision('Approval recorded', `${task.title} was approved and forwarded.`);
    } else {
      setPending((current) => current.filter((item) => item.id !== task.id));
      setSubmissions((current) => [{ ...task, submissionStatus: 'Returned to Me', assignedTo: task.requester, assignedRole: 'Requester', isNew: true, comments: [...task.comments, { id: `c-${Date.now()}`, author: CURRENT_USER, role: 'HOD', time: 'Just now', text: reason }] }, ...current]);
      setSuccessMessage('Returned to requester with your comment.');
      notifyDecision('Task returned', `${task.title} was returned with your comment.`);
    }
    setSelectedIds((current) => current.filter((id) => id !== task.id));
  };

  const changeTaskState = (task: WorkflowTask, status: SubmissionStatus, message: string) => {
    setPending((current) => current.filter((item) => item.id !== task.id));
    setSubmissions((current) => [{ ...task, submissionStatus: status, assignedTo: status === 'On Hold' ? 'Paused by you' : delegateTo, assignedRole: status === 'On Hold' ? 'On Hold' : 'Delegate', isNew: false }, ...current]);
    notifyDecision(message, `${task.title} · ${status}`);
    setSelectedTask(null); setDelegateOpen(false); toastMessage(`${task.id} ${status.toLowerCase()} in this preview.`);
  };

  const bulkDecision = (action: 'approve' | 'reject') => {
    const ids = new Set(selectedIds);
    const selectedTasks = pending.filter((task) => ids.has(task.id));
    if (!selectedTasks.length) return;
    if (action === 'reject') {
      const reason = window.prompt('Add a rejection / return reason (required):', 'Please update the supporting information.');
      if (!reason || reason.trim().length < 10) { toastMessage('Bulk return cancelled — add a reason of at least 10 characters.'); return; }
      setSubmissions((current) => [...selectedTasks.map((task) => ({ ...task, submissionStatus: 'Returned to Me' as const, assignedTo: task.requester, assignedRole: 'Requester', isNew: true, comments: [...task.comments, { id: `c-${Date.now()}-${task.id}`, author: CURRENT_USER, role: 'HOD', time: 'Just now', text: reason }] })), ...current]);
      setPending((current) => current.filter((task) => !ids.has(task.id)));
      toastMessage(`${selectedTasks.length} selected task(s) returned in this preview.`);
    } else {
      setSubmissions((current) => [...selectedTasks.map((task) => ({ ...task, submissionStatus: 'Fully Approved' as const, assignedTo: 'Completed', assignedRole: 'Completed' })), ...current]);
      setPending((current) => current.filter((task) => !ids.has(task.id)));
      toastMessage(`${selectedTasks.length} selected task(s) approved in this preview.`);
    }
    setSelectedIds([]);
  };

  const exportTasks = (tasks: WorkflowTask[]) => {
    const rows = [['ID', 'Request', 'Module', 'Branch', 'Requester', 'Priority', 'Assigned To', 'Status', 'SLA'], ...tasks.map((task) => [task.id, task.title, task.module, task.branch, task.requester, task.priority, task.assignedTo, task.submissionStatus || 'Pending', slaText(task, now)])];
    const csv = rows.map((row) => row.map((value) => escapeCsv(String(value))).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'my-workflow-hub.csv'; anchor.click(); URL.revokeObjectURL(url);
    toastMessage('Workflow list downloaded as CSV.');
  };

  const pushComment = () => {
    if (!activeTask || !commentDraft.trim()) return;
    const comment: Comment = { id: `c-${Date.now()}`, author: CURRENT_USER, role: 'HOD', time: 'Just now', text: commentDraft.trim() };
    setPending((current) => current.map((task) => task.id === activeTask.id ? { ...task, comments: [...task.comments, comment] } : task));
    setSubmissions((current) => current.map((task) => task.id === activeTask.id ? { ...task, comments: [...task.comments, comment] } : task));
    setCommentDraft(''); toastMessage('Comment added to the task thread.');
  };
  const markAllRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  const selectedCount = selectedIds.filter((id) => filteredPending.some((task) => task.id === id)).length;

  const renderPriority = (priority: Priority) => <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider ${PRIORITY_STYLES[priority]}`}>{priorityLabel(priority)}</span>;
  const renderSla = (task: WorkflowTask) => <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums ${slaTone(task, now)} ${task.slaDueAt < now ? 'animate-pulse' : ''}`}><Clock3 className="h-3.5 w-3.5" />{slaText(task, now)}</span>;

  const renderMiniProgress = (task: WorkflowTask) => (
    <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
      <div className="flex items-center">
        {task.steps.slice(0, 4).map((step, index) => <React.Fragment key={`${task.id}-${step.role}`}>
          <div className="flex shrink-0 flex-col items-center gap-1">
            <span className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] ${step.state === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : step.state === 'current' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.18)] animate-pulse' : step.state === 'rejected' ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300 bg-gray-200 text-gray-400'}`}>{step.state === 'completed' ? '✓' : step.state === 'current' ? '●' : step.state === 'rejected' ? '×' : ''}</span>
            <span className="max-w-14 truncate text-[9px] text-gray-400">{step.role}</span>
            {step.mine && <span className="text-[9px] font-bold text-indigo-600">(YOU)</span>}
          </div>
          {index < Math.min(task.steps.length, 4) - 1 && <span className={`mx-1 mb-4 h-0.5 flex-1 ${step.state === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
        </React.Fragment>)}
      </div>
    </div>
  );

  const renderTaskCard = (task: WorkflowTask) => (
    <article key={task.id} className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-center justify-between gap-2">
        {renderPriority(task.priority)}
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{task.currentStage + 1 < task.steps.length ? `Step ${task.currentStage + 1} of ${task.steps.length}` : 'Final Approval'}</span>
      </div>
      <button type="button" className="mt-2 text-left text-[15px] font-semibold leading-snug text-gray-900 hover:text-indigo-700" onClick={() => openTask(task)}>{task.title}</button>
      <div className="mt-2 space-y-1 text-[13px] text-gray-600">
        <p className="flex items-center gap-1.5"><button type="button" className="inline-flex items-center gap-1 hover:text-indigo-700" onClick={() => setProfileTaskId(profileTaskId === task.id ? null : task.id)}><UserRound className="h-3.5 w-3.5" />{task.requester} ({task.requesterRole})</button><span>· {task.branch}</span></p>
        {profileTaskId === task.id && <div className="absolute z-20 mt-1 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-xl"><p className="font-semibold text-gray-900">{task.requester}</p><p className="mt-1 text-gray-500">{task.requesterRole} · {task.branch}</p><p className="mt-1 text-gray-500">Recent request: {task.title}</p></div>}
        <p className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{task.module} · {task.amount}</p>
        <p className="text-xs text-gray-400">Submitted {task.submitted}</p>
      </div>
      <div className="mt-2">{renderSla(task)}</div>
      {renderMiniProgress(task)}
      <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
        <button type="button" onClick={() => openTask(task, 'approve')} className="min-h-10 rounded-md border border-green-200 bg-green-50 px-3 text-[13px] font-medium text-green-800 transition-colors hover:bg-green-100">✓ Quick Approve</button>
        <button type="button" onClick={() => openTask(task)} className="ml-auto min-h-10 rounded-md border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50">◉ View &amp; Review</button>
      </div>
    </article>
  );

  const renderPendingTable = () => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-[980px] w-full text-left text-xs">
        <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500"><tr><th className="w-10 p-3"><input aria-label="Select all visible tasks" type="checkbox" checked={filteredPending.length > 0 && filteredPending.every((task) => selectedIds.includes(task.id))} onChange={(event) => setSelectedIds(event.target.checked ? filteredPending.map((task) => task.id) : [])} /></th><th className="p-3">Priority</th><th className="p-3">Request</th><th className="p-3">Requester</th><th className="p-3">Module / Branch</th><th className="p-3">SLA Countdown</th><th className="p-3">Stage</th><th className="p-3 text-right">Action</th></tr></thead>
        <tbody className="divide-y divide-gray-100">{filteredPending.map((task) => <tr key={task.id} className={`hover:bg-gray-50 ${task.slaDueAt < now ? 'bg-red-50/60' : ''}`}><td className="p-3"><input aria-label={`Select ${task.id}`} type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => setSelectedIds((current) => current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])} /></td><td className="p-3"><span className="inline-flex items-center gap-2 font-semibold"><span className={`h-2 w-2 rounded-full ${task.priority === 'Urgent' ? 'bg-red-500' : task.priority === 'Normal' ? 'bg-amber-500' : 'bg-green-500'}`} />{task.priority.toUpperCase()}</span></td><td className="p-3"><button type="button" onClick={() => openTask(task)} className="max-w-[270px] truncate text-left font-semibold text-gray-900 hover:text-indigo-700">{task.title}<span className="mt-0.5 block font-mono text-[10px] font-normal text-gray-400">{task.id}</span></button></td><td className="p-3 text-gray-700">{task.requester}<span className="block text-[10px] text-gray-400">{task.requesterRole}</span></td><td className="p-3 text-gray-600">{task.module}<span className="block text-[10px] text-gray-400">{task.branch}</span></td><td className={`p-3 ${task.slaDueAt < now ? 'bg-red-50' : ''}`}>{renderSla(task)}</td><td className="p-3 text-gray-600">{task.assignedRole}</td><td className="p-3 text-right"><button type="button" onClick={() => openTask(task)} className="min-h-9 rounded-md border border-gray-200 px-3 font-medium text-gray-700 hover:bg-gray-50">Review</button></td></tr>)}{!filteredPending.length && <tr><td colSpan={8} className="p-10 text-center text-sm text-gray-500">No approvals match these filters.</td></tr>}</tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-full bg-[#F9FAFB] pb-24 text-gray-900">
      <style>{`@keyframes hubPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,.4) } 50% { box-shadow: 0 0 0 8px rgba(239,68,68,0) } } @keyframes hubFlash { 0% { background:#FEF9C3 } 100% { background:transparent } } .hub-flash { animation: hubFlash 600ms ease-out }`}</style>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:px-6">
        <h1 className="text-base font-semibold">My Workflow Hub</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} className="relative grid h-11 w-11 place-items-center rounded-full text-gray-700 hover:bg-gray-100"><Bell className="h-[22px] w-[22px]" />{unreadCount > 0 && <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white" style={{ animation: 'hubPulse 1.5s ease infinite' }}>{unreadCount}</span>}</button>
            {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-200 px-4 py-3"><h2 className="text-sm font-semibold">Notifications</h2><button type="button" onClick={markAllRead} className="text-xs font-medium text-indigo-600 hover:underline">Mark all as read</button></div><div className="max-h-[390px] overflow-y-auto">{notifications.map((item) => <button type="button" key={item.id} onClick={() => { setNotifications((current) => current.map((n) => n.id === item.id ? { ...n, read: true } : n)); setNotificationsOpen(false); if (item.kind !== 'system' && pending[0]) openTask(pending[0]); }} className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50 ${item.read ? 'bg-white' : 'bg-indigo-50/40'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.read ? 'bg-transparent' : 'bg-indigo-600'}`} /><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.kind === 'return' ? 'bg-amber-100 text-amber-700' : item.kind === 'system' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.kind === 'return' ? <AlertTriangle className="h-4 w-4" /> : item.kind === 'system' ? <ShieldCheck className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</span><span className="min-w-0"><span className="block text-[13px] font-semibold text-gray-900">{item.title}</span><span className="mt-0.5 block text-xs leading-relaxed text-gray-600">{item.body}</span><span className="mt-1 block text-[11px] text-gray-400">{item.time}</span></span></button>)}</div><button type="button" onClick={() => { markAllRead(); setNotificationsOpen(false); }} className="w-full border-t border-gray-100 px-4 py-3 text-center text-[13px] font-medium text-indigo-600 hover:bg-gray-50">View All Notifications</button></div>}
          </div>
          <button type="button" className="flex min-h-11 items-center gap-2 rounded-full px-2 hover:bg-gray-50"><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">RS</span><span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Rahul Sharma</span><span className="block text-[10px] text-gray-500">HOD · Main Campus</span></span><ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" /></button>
        </div>
      </header>

      <main className="space-y-5 p-4 md:p-6">
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-5" aria-label="Workflow summary">
          {[
            { label: 'Pending My Approval', count: pending.length, icon: '⏳', bg: 'bg-amber-100', action: () => setActiveTab('pending'), tone: 'text-gray-900' },
            { label: 'Approved by Me', count: 23 + submissions.filter((task) => task.submissionStatus === 'Fully Approved').length, icon: '✅', bg: 'bg-green-100', action: () => { setActiveTab('submissions'); setStatusFilter('Fully Approved'); }, tone: 'text-gray-900' },
            { label: 'Rejected by Me', count: 2 + submissions.filter((task) => task.submissionStatus === 'Rejected').length, icon: '❌', bg: 'bg-red-100', action: () => { setActiveTab('submissions'); setStatusFilter('Rejected'); }, tone: 'text-gray-900' },
            { label: 'My Submissions', count: 8 + submissions.length, icon: '📤', bg: 'bg-blue-100', action: () => setActiveTab('submissions'), tone: 'text-gray-900' },
            { label: 'SLA Breached', count: breachedCount, icon: '🔥', bg: 'bg-red-100', action: () => { setActiveTab('pending'); setStatusFilter('Overdue'); }, tone: 'text-red-600', danger: breachedCount > 0 }
          ].map((card) => <button type="button" key={card.label} onClick={card.action} className={`group min-h-[150px] rounded-xl border bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 md:p-4 ${card.danger ? 'border-red-200' : 'border-gray-200'} ${card.label === 'SLA Breached' ? 'col-span-2 xl:col-span-1' : ''}`}><span className={`grid h-9 w-9 place-items-center rounded-[10px] text-lg md:h-11 md:w-11 ${card.bg} ${card.label === 'SLA Breached' && card.count > 0 ? 'animate-pulse' : ''}`}>{card.icon}</span><span className={`mt-3 block text-[22px] font-bold leading-none md:text-[28px] ${card.tone} ${card.label === 'SLA Breached' && card.count > 0 ? 'hub-flash' : ''}`}>{card.count}</span><span className="mt-1 block text-[12px] font-medium text-gray-500">{card.label}</span></button>)}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-gray-200 px-2 md:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">{([{ id: 'pending', label: 'Pending My Approval', count: pending.length }, { id: 'submissions', label: 'My Submissions', count: submissions.length }] as const).map((tab) => <button type="button" key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }} className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[13px] font-medium transition-colors md:px-5 md:text-sm ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>{tab.label}<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">{tab.count}</span></button>)}</div>
            {activeTab === 'pending' && <div className="hidden items-center gap-1 py-2 md:flex"><button type="button" onClick={() => setView('cards')} className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs ${view === 'cards' ? 'border-indigo-200 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}><LayoutGrid className="h-3.5 w-3.5" />Cards</button><button type="button" onClick={() => setView('table')} className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs ${view === 'table' ? 'border-indigo-200 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}><Table2 className="h-3.5 w-3.5" />Table</button></div>}
          </div>
          <div className="space-y-4 p-3 md:p-5">
            <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setFilterOpen((open) => !open)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"><ListFilter className="h-4 w-4" />Filters <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} /></button><div className="relative min-w-[200px] flex-1 md:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, IDs, requesters…" className="h-10 w-full rounded-md border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div><button type="button" onClick={() => exportTasks(activeTab === 'pending' ? filteredPending : filteredSubmissions)} className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"><Download className="h-4 w-4" />Export</button></div>
            {filterOpen && <div className="flex flex-wrap items-end gap-3 rounded-b-lg border border-gray-200 bg-gray-50 p-4"><label className="flex flex-col gap-1 text-xs text-gray-600">Module<select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="h-9 min-w-40 rounded-md border border-gray-300 bg-white px-2 text-xs"><option>All modules</option>{modules.map((module) => <option key={module}>{module}</option>)}</select></label><label className="flex flex-col gap-1 text-xs text-gray-600">Priority<select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="h-9 min-w-36 rounded-md border border-gray-300 bg-white px-2 text-xs"><option>All priorities</option><option>Urgent</option><option>Normal</option><option>Comfortable</option></select></label><label className="flex flex-col gap-1 text-xs text-gray-600">Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 min-w-36 rounded-md border border-gray-300 bg-white px-2 text-xs"><option>All statuses</option><option>Overdue</option><option>On hold</option><option>In Progress</option><option>Fully Approved</option><option>Rejected</option><option>Returned to Me</option></select></label>{activeFilters.map((filter) => <span key={filter} className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 py-1 pl-2 pr-1 text-xs text-indigo-600">{filter}<button type="button" onClick={() => filter.startsWith('Module:') ? setModuleFilter('All modules') : filter.startsWith('Priority:') ? setPriorityFilter('All priorities') : filter.startsWith('Status:') ? setStatusFilter('All statuses') : setQuery('')} aria-label={`Remove ${filter}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-indigo-100"><X className="h-3 w-3" /></button></span>)}{activeFilters.length > 0 && <button type="button" onClick={clearFilters} className="ml-auto text-xs font-medium text-red-500">Clear All</button>}</div>}

            {activeTab === 'pending' ? (view === 'table' ? renderPendingTable() : <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">{filteredPending.map(renderTaskCard)}{!filteredPending.length && <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 py-14 text-center text-sm text-gray-500">No pending tasks match. Try clearing the filters.</div>}</div>) : <div className="overflow-x-auto rounded-xl border border-gray-200"><table className="min-w-[820px] w-full text-left text-xs"><thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500"><tr><th className="p-3">Task</th><th className="p-3">Status</th><th className="p-3">Module</th><th className="p-3">Updated</th><th className="p-3">Owner</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredSubmissions.map((task) => <tr key={task.id} className={`transition-colors ${task.submissionStatus === 'Returned to Me' ? 'bg-red-50/50 shadow-[inset_3px_0_0_#EF4444]' : task.submissionStatus === 'Fully Approved' ? 'bg-green-50/40 shadow-[inset_3px_0_0_#10B981]' : 'bg-white'}`}><td className="p-3"><button type="button" onClick={() => openTask(task)} className="text-left font-semibold text-gray-900 hover:text-indigo-700">{task.title}{task.isNew && <span className="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white animate-pulse">NEW</span>}{task.legacy && <span title="This task is running on an older version of the workflow. No action required." className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">V1 (Legacy)</span>}<span className="mt-1 block font-mono text-[10px] font-normal text-gray-400">{task.id}</span></button></td><td className="p-3"><span className={`rounded border px-2 py-1 text-[11px] font-semibold ${STATUS_STYLES[task.submissionStatus || 'In Progress']}`}>{task.submissionStatus}</span></td><td className="p-3 text-gray-600">{task.module}</td><td className="p-3 text-gray-600">{task.submitted}</td><td className="p-3 text-gray-600">{task.assignedTo}</td><td className="p-3"><button type="button" onClick={() => openTask(task)} className="min-h-9 rounded-md border border-gray-200 px-3 text-xs hover:bg-gray-50">View</button></td></tr>)}{!filteredSubmissions.length && <tr><td colSpan={6} className="p-10 text-center text-sm text-gray-500">No submissions match these filters.</td></tr>}</tbody></table></div>}
          </div>
        </section>
      </main>

      {selectedCount > 0 && activeTab === 'pending' && <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-white shadow-2xl md:gap-3 md:px-5"><span className="mr-1 inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium"><Check className="h-4 w-4" />{selectedCount} item{selectedCount === 1 ? '' : 's'} selected</span><button type="button" onClick={() => bulkDecision('approve')} className="min-h-10 rounded-md bg-emerald-500 px-3 text-xs font-semibold hover:bg-emerald-600">✓ Approve All ({selectedCount})</button><button type="button" onClick={() => bulkDecision('reject')} className="min-h-10 rounded-md bg-red-500 px-3 text-xs font-semibold hover:bg-red-600">✕ Reject All ({selectedCount})</button><button type="button" onClick={() => setSelectedIds([])} className="min-h-10 px-2 text-xs text-gray-300 hover:text-white">Deselect</button></div>}

      {activeTask && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 md:items-center md:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedTask(null); }}><section role="dialog" aria-modal="true" aria-label={`Task detail ${activeTask.id}`} className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-none bg-white shadow-2xl md:h-[min(92vh,900px)] md:rounded-2xl"><div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 md:px-6"><div><button type="button" onClick={() => setSelectedTask(null)} className="mb-2 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-indigo-600 md:hidden">← Back</button><span className="rounded bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600">{activeTask.id}</span><h2 className="mt-2 text-lg font-bold text-gray-900">{activeTask.title}</h2><p className="mt-1 text-xs text-gray-500">{activeTask.module} · {activeTask.branch} · {activeTask.requester}</p></div><button type="button" onClick={() => setSelectedTask(null)} className="hidden h-10 w-10 place-items-center rounded-full hover:bg-gray-100 md:grid" aria-label="Close task detail"><X className="h-5 w-5" /></button></div>
        {successMessage ? <div className="flex flex-1 flex-col items-center justify-center bg-green-50 p-8 text-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-12 w-12" /></span><h3 className="mt-5 text-2xl font-bold text-green-800">Decision recorded</h3><p className="mt-2 text-sm text-green-700">{successMessage}</p></div> : <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-xs md:grid-cols-4"><div><span className="text-gray-400">Requester</span><p className="mt-1 font-medium text-gray-800">{activeTask.requester}</p></div><div><span className="text-gray-400">Submitted</span><p className="mt-1 font-medium text-gray-800">{activeTask.submitted}</p></div><div><span className="text-gray-400">Amount / scope</span><p className="mt-1 font-medium text-gray-800">{activeTask.amount}</p></div><div><span className="text-gray-400">SLA remaining</span><p className={`mt-1 font-semibold ${slaTone(activeTask, now)}`}>{slaText(activeTask, now)}</p></div></div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-5"><h3 className="mb-4 text-[10px] font-bold uppercase tracking-[.08em] text-gray-400">Workflow Progress</h3><div className="flex items-start">{activeTask.steps.map((step, index) => <React.Fragment key={`${activeTask.id}-${step.role}`}><div className="flex w-24 shrink-0 flex-col items-center text-center"><span className={`grid h-8 w-8 place-items-center rounded-full border-2 ${step.state === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : step.state === 'current' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_5px_rgba(79,70,229,.18)] animate-pulse' : step.state === 'rejected' ? 'border-red-500 bg-red-500 text-white' : step.state === 'skipped' ? 'border-gray-300 bg-gray-100 text-gray-500' : step.state === 'escalated' ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white text-transparent'}`}>{step.state === 'completed' ? '✓' : step.state === 'rejected' ? '×' : step.state === 'skipped' ? '↪' : step.state === 'escalated' ? '!' : step.state === 'current' ? '•' : ''}</span><span className="mt-2 text-[13px] font-semibold text-gray-700">{step.role}</span><span className="mt-0.5 text-[11px] text-gray-500">{step.person}</span>{step.mine && <span className="mt-1 text-[11px] font-bold text-indigo-600">(YOU)</span>}<span className="mt-1 text-[10px] italic text-gray-400">{step.note || (step.state === 'completed' ? 'Completed' : step.state === 'current' ? 'Awaiting your decision' : 'Waiting')}</span></div>{index < activeTask.steps.length - 1 && <div className={`mt-[15px] h-0.5 min-w-5 flex-1 ${step.state === 'completed' ? 'bg-emerald-500' : 'border-t border-dashed border-gray-300'}`} />}</React.Fragment>)}</div><div className="mt-4 border-t border-dashed border-gray-200 pt-3"><div className="flex items-center justify-between text-xs"><span className="font-medium text-gray-600">SLA for current step</span><span className={`font-semibold ${slaTone(activeTask, now)}`}>{slaText(activeTask, now)}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200"><div className={`h-full rounded-full ${activeTask.slaDueAt < now ? 'bg-red-500' : activeTask.slaDueAt - now < 4 * 60_000 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: activeTask.slaDueAt < now ? '100%' : activeTask.slaDueAt - now < 4 * 60_000 ? '78%' : '42%' }} /></div></div></div>
          <div><h3 className="mb-3 text-sm font-semibold text-gray-700">📊 Submitted Data</h3><div className="max-h-[240px] overflow-auto rounded-lg border border-gray-200"><table className="w-full text-left text-xs"><thead className="bg-gray-50 text-gray-500"><tr><th className="p-3">Field</th><th className="p-3">Submitted value</th><th className="p-3">Change</th></tr></thead><tbody className="divide-y divide-gray-100">{activeTask.data.map((field) => <tr key={field.label} className="odd:bg-white even:bg-gray-50"><td className="p-3 font-medium text-gray-600">{field.label}</td><td className={`p-3 ${field.previous ? 'bg-yellow-50 font-semibold text-gray-900' : 'text-gray-800'}`} title={field.previous ? `Changed from ${field.previous} → ${field.value}` : undefined}>{field.value}</td><td className="p-3 text-gray-500">{field.previous ? `${field.previous} → ${field.value}` : '—'}</td></tr>)}</tbody></table></div>{activeTask.legacy && <p className="mt-2 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-600">ℹ️ This task uses V1 of the workflow. The current version is V2.</p>}</div>
          <div><h3 className="text-sm font-semibold text-gray-700">💬 Comments &amp; Activity</h3><div className="mt-3 space-y-3">{activeTask.comments.map((comment) => <div key={comment.id} className="flex gap-2.5">{!comment.system && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">{comment.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>}<div className={`min-w-0 flex-1 rounded-lg border p-3 ${comment.system ? 'border-transparent bg-transparent italic text-gray-400' : 'rounded-tl-none border-gray-100 bg-gray-50'}`}><p className="text-xs font-semibold text-gray-700">{comment.system ? '– System –' : comment.author}<span className="ml-1 font-normal text-gray-400">{comment.time}</span></p><p className="mt-1 text-[13px] leading-relaxed text-gray-700">{comment.text}</p></div></div>)}{activeTask.comments.length === 0 && <p className="text-xs text-gray-400">No comments yet. Add context for the next approver.</p>}</div><div className="mt-3 overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"><textarea value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} rows={3} placeholder="Write a comment or @mention a colleague…" className="w-full resize-none border-0 p-3 text-[13px] outline-none" /><div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2"><button type="button" onClick={() => toastMessage('Attachment picker is ready in this preview.')} className="inline-flex min-h-9 items-center gap-1 text-xs text-gray-500 hover:text-indigo-600"><Paperclip className="h-4 w-4" />Attach</button><button type="button" disabled={!commentDraft.trim()} onClick={pushComment} className="inline-flex min-h-9 items-center gap-1 rounded-md bg-indigo-600 px-4 text-xs font-semibold text-white disabled:bg-gray-300"><Send className="h-3.5 w-3.5" />Send</button></div></div></div>
        </div>}
        {!successMessage && activeTask.assignedTo === CURRENT_USER && !activeTask.submissionStatus && <div className="sticky bottom-0 border-t-2 border-gray-200 bg-gray-50 px-4 py-4 md:px-6"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.08em] text-gray-400">Your Decision</p>{decision ? <div className="rounded-xl border border-indigo-200 bg-white p-4"><h3 className="font-semibold text-gray-900">{decision === 'approve' ? '⚠ Confirm Approval' : '⚠ Confirm Return'}</h3><p className="mt-1 text-sm text-gray-600">{decision === 'approve' ? `This will forward the task to: ${activeTask.steps[activeTask.currentStage + 1]?.person || 'the next step'}.` : 'This will return the task to the requester with your comment.'}</p>{decision === 'reject' && <textarea value={decisionComment} onChange={(event) => setDecisionComment(event.target.value)} maxLength={500} rows={2} placeholder="Add a comment (required for rejection)…" className="mt-3 w-full rounded-md border border-gray-200 p-2 text-sm outline-none focus:border-indigo-500" />}<p className="mt-1 text-right text-[11px] text-gray-400">{decisionComment.length}/500</p>{decisionError && <p className="mt-1 text-xs text-red-600">{decisionError}</p>}<div className="mt-4 flex justify-between gap-2"><button type="button" onClick={() => { setDecision(null); setDecisionError(''); }} className="min-h-11 px-4 text-sm text-gray-600">← Back</button><button type="button" onClick={() => finishDecision(activeTask, decision, decisionComment)} className={`min-h-11 rounded-lg px-4 text-sm font-semibold text-white ${decision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>{decision === 'approve' ? '✓ Yes, Approve Now' : '↩ Return Task'}</button></div></div> : <><div className="flex gap-2"><button type="button" onClick={() => setDecision('approve')} className="min-h-11 flex-1 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[.98]">✓ APPROVE &amp; FORWARD</button><button type="button" onClick={() => { setDecision('reject'); setDecisionComment(''); setDecisionError(''); }} className="min-h-11 flex-1 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 hover:bg-red-100">✕ REJECT &amp; RETURN</button></div><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => changeTaskState(activeTask, 'On Hold', 'Task placed on hold')} className="min-h-10 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700"><PauseCircle className="mr-1 inline h-4 w-4" />Put On Hold</button><button type="button" onClick={() => setDelegateOpen((open) => !open)} className="min-h-10 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700"><Users className="mr-1 inline h-4 w-4" />Delegate to Colleague</button></div>{delegateOpen && <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-3"><select value={delegateTo} onChange={(event) => setDelegateTo(event.target.value)} className="min-h-10 flex-1 rounded-md border border-gray-200 px-3 text-xs"><option>Mihir Vyas</option><option>Ananya Desai</option><option>Priya Nair</option></select><button type="button" onClick={() => changeTaskState(activeTask, 'In Progress', `Delegated to ${delegateTo}`)} className="min-h-10 rounded-md bg-indigo-600 px-4 text-xs font-semibold text-white">Confirm Delegate</button></div>}</>}</div>}
      </section></div>}

      {toast && <div role="status" className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{toast}<button type="button" onClick={() => setToast('')} aria-label="Dismiss" className="ml-2 text-gray-300"><X className="h-3.5 w-3.5" /></button></div>}
    </div>
  );
}

export default UnifiedApprovalInbox;
