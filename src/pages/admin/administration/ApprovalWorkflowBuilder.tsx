import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowRight, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, Copy, Edit3, GitBranch, GripVertical, HelpCircle,
  History, LayoutDashboard, Lock, Plus, Search, Settings2, ShieldCheck, Trash2, X
} from 'lucide-react';

type WorkflowCategory = 'Academic' | 'Financial' | 'HR' | 'Administrative' | 'Student Services' | 'Custom';
type WorkflowStatus = 'Active' | 'Draft' | 'Frozen';
type Timing = 'Immediate' | 'Scheduled' | 'Manual';
type DeskSection = 'Dashboard' | 'Setup Desk' | 'Action Hub' | 'Audit Vault' | 'Help & Docs' | 'Settings';
type SaveStatus = 'Draft' | 'Active';
type GrandfatherChoice = 'new-only' | 'migrate-all';
type SortKey = 'name' | 'category' | 'steps' | 'version' | 'status' | 'createdBy' | 'modifiedOn';

type WorkflowStep = {
  id: string;
  role: string;
  action: string;
  slaHours: string;
  slaBreach: string;
  onReject: string;
  parallel: boolean;
  conditionEnabled: boolean;
  conditionText: string;
};
type WorkflowVersion = { version: number; modifiedOn: string; modifiedBy: string; summary: string };
type EmailRecipients = { initiator: boolean; currentApprover: boolean; allApprovers: boolean; fallback: boolean };
type WorkflowRules = { requirePrevious: boolean; blockSelfApproval: boolean; escalateOnBreach: boolean };
type Workflow = {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  year: string;
  steps: WorkflowStep[];
  version: number;
  createdBy: string;
  createdOn: string;
  modifiedOn: string;
  scopes: string[];
  triggerTiming: Timing;
  triggerAction: string;
  minAmount: string;
  maxAmount: string;
  fallbackUser: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  emailRecipients: EmailRecipients;
  rules: WorkflowRules;
  inProgress: number;
  frozenReason: string;
  versionHistory: WorkflowVersion[];
};
type AuditEvent = { id: string; time: string; actor: string; action: string; workflow: string; workflowId: string };

type DeskIcon = React.ComponentType<{ className?: string }>;
type PageSection = { label: DeskSection; icon: DeskIcon };

const CATEGORIES: WorkflowCategory[] = ['Academic', 'Financial', 'HR', 'Administrative', 'Student Services', 'Custom'];
const CATEGORY_STYLES: Record<WorkflowCategory, string> = {
  Academic: 'border-blue-200 bg-blue-100 text-blue-800',
  Financial: 'border-green-200 bg-green-100 text-green-800',
  HR: 'border-orange-200 bg-orange-100 text-orange-800',
  Administrative: 'border-purple-200 bg-purple-100 text-purple-800',
  'Student Services': 'border-yellow-200 bg-yellow-100 text-yellow-800',
  Custom: 'border-slate-200 bg-slate-100 text-slate-700'
};
const ROLE_COUNTS: Record<string, number> = {
  'Department HOD': 4,
  'Vice-Principal': 1,
  Principal: 1,
  'Finance Controller': 3,
  'Accounts Manager': 3,
  'Procurement Manager': 2,
  'HR Manager': 2,
  'Operations Director': 1,
  'Admissions Lead': 2,
  'Class Teacher': 8,
  'Exam Controller': 1,
  'Super Admin': 1,
  'Dean of Academics': 0
};
const APPROVER_ROLES = Object.keys(ROLE_COUNTS);
const SCOPE_OPTIONS = ['All Grades', 'Grade 1–5', 'Grade 6–8', 'Grade 9–10', 'Grade 11–12', 'All Branches', 'Ahmedabad Branch', 'Finance Department', 'Teaching Staff'];
const TRIGGER_ACTIONS = [
  'Admission exception', 'Class / subject change', 'Exam result publication', 'Fee concession request',
  'Fee refund request', 'Leave request', 'Purchase requisition', 'Purchase order', 'Scholarship disbursement',
  'Data lock override', 'Custom transaction'
];
const EMAIL_RECIPIENT_LABELS: Array<[keyof EmailRecipients, string]> = [
  ['initiator', 'Notify Initiator'], ['currentApprover', 'Notify Current Approver'],
  ['allApprovers', 'Notify All Approvers'], ['fallback', 'Notify Fallback on Escalation']
];
const PAGE_SECTIONS: PageSection[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Setup Desk', icon: Settings2 },
  { label: 'Action Hub', icon: Activity },
  { label: 'Audit Vault', icon: History },
  { label: 'Help & Docs', icon: HelpCircle },
  { label: 'Settings', icon: Settings2 }
];

const todayLabel = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const timeLabel = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const makeStep = (role = 'Department HOD'): WorkflowStep => ({
  id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  action: 'Review & Approve',
  slaHours: '48',
  slaBreach: 'Send Reminder',
  onReject: 'Back to Initiator',
  parallel: false,
  conditionEnabled: false,
  conditionText: ''
});
const seedStep = (id: string, role: string, overrides: Partial<WorkflowStep> = {}): WorkflowStep => ({
  id, role, action: 'Review & Approve', slaHours: '48', slaBreach: 'Send Reminder',
  onReject: 'Back to Initiator', parallel: false, conditionEnabled: false, conditionText: '', ...overrides
});
const initialEmailRecipients = (): EmailRecipients => ({ initiator: true, currentApprover: true, allApprovers: false, fallback: true });
const initialRules = (): WorkflowRules => ({ requirePrevious: true, blockSelfApproval: true, escalateOnBreach: true });
const emptyWorkflow = (): Workflow => ({
  id: '', name: '', description: '', category: 'Academic', status: 'Draft', year: '2026-27',
  steps: [makeStep('Department HOD'), makeStep('Principal')], version: 1,
  createdBy: 'Admin User', createdOn: '', modifiedOn: '', scopes: ['All Grades'],
  triggerTiming: 'Immediate', triggerAction: 'Admission exception', minAmount: '', maxAmount: '', fallbackUser: 'Mr. Rajesh Kumar',
  emailEnabled: true, smsEnabled: false, emailRecipients: initialEmailRecipients(), rules: initialRules(),
  inProgress: 0, frozenReason: '', versionHistory: []
});

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    ...emptyWorkflow(), id: 'WF-1042', name: 'Class Promotion Exception', description: 'Review promotion and detention cases that fall outside the standard academic rules.',
    category: 'Academic', status: 'Active', year: '2026-27', version: 4, createdBy: 'Ananya Desai', createdOn: '12 Aug 2026', modifiedOn: '02 Oct 2026',
    scopes: ['All Grades', 'Grade 9–10'], triggerAction: 'Class / subject change', inProgress: 7,
    steps: [seedStep('wf1042-1', 'Department HOD', { slaHours: '24' }), seedStep('wf1042-2', 'Vice-Principal', { slaHours: '24', onReject: 'Step 1' }), seedStep('wf1042-3', 'Principal', { slaHours: '48' })],
    versionHistory: [
      { version: 1, modifiedOn: '12 Aug 2026', modifiedBy: 'Ananya Desai', summary: 'Initial draft created' },
      { version: 2, modifiedOn: '19 Aug 2026', modifiedBy: 'Ananya Desai', summary: 'Added Vice-Principal review' },
      { version: 3, modifiedOn: '10 Sep 2026', modifiedBy: 'Admin User', summary: 'Updated rejection routing and SLA' },
      { version: 4, modifiedOn: '02 Oct 2026', modifiedBy: 'Ananya Desai', summary: 'Current published version' }
    ]
  },
  {
    ...emptyWorkflow(), id: 'WF-1038', name: 'Fee Concession — High Value', description: 'Routes higher-value fee concessions through finance and school leadership.',
    category: 'Financial', status: 'Active', year: '2026-27', version: 3, createdBy: 'Rahul Mehta', createdOn: '08 Jun 2026', modifiedOn: '30 Sep 2026',
    scopes: ['All Branches'], triggerAction: 'Fee concession request', inProgress: 3,
    steps: [seedStep('wf1038-1', 'Accounts Manager', { slaHours: '24' }), seedStep('wf1038-2', 'Finance Controller', { slaHours: '24', parallel: true }), seedStep('wf1038-3', 'Principal', { slaHours: '48' })],
    versionHistory: [{ version: 1, modifiedOn: '08 Jun 2026', modifiedBy: 'Rahul Mehta', summary: 'Initial draft created' }, { version: 2, modifiedOn: '14 Jul 2026', modifiedBy: 'Admin User', summary: 'Added Finance Controller' }, { version: 3, modifiedOn: '30 Sep 2026', modifiedBy: 'Rahul Mehta', summary: 'Current published version' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-1034', name: 'Staff Leave Request', description: 'Teaching staff leave with a substitute-plan check and principal approval.',
    category: 'HR', status: 'Active', year: '2026-27', version: 2, createdBy: 'Neha Trivedi', createdOn: '01 Jul 2026', modifiedOn: '25 Sep 2026',
    scopes: ['Teaching Staff'], triggerAction: 'Custom transaction', inProgress: 1,
    steps: [seedStep('wf1034-1', 'Department HOD', { action: 'Review', slaHours: '24' }), seedStep('wf1034-2', 'Principal', { slaHours: '48' })],
    versionHistory: [{ version: 1, modifiedOn: '01 Jul 2026', modifiedBy: 'Neha Trivedi', summary: 'Initial published version' }, { version: 2, modifiedOn: '25 Sep 2026', modifiedBy: 'Neha Trivedi', summary: 'Updated SLA and fallback' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-1029', name: 'Exam Result Publication', description: 'Final validation and approval before examination results are released.',
    category: 'Academic', status: 'Draft', year: '2026-27', version: 1, createdBy: 'Jinal Shah', createdOn: '29 Sep 2026', modifiedOn: '02 Oct 2026',
    scopes: ['Grade 9–10', 'Grade 11–12'], triggerAction: 'Exam result publication', inProgress: 0,
    steps: [seedStep('wf1029-1', 'Dean of Academics', { action: 'Verify results', slaHours: '24' }), seedStep('wf1029-2', 'Principal', { action: 'Approve release', slaHours: '24' })],
    versionHistory: [{ version: 1, modifiedOn: '02 Oct 2026', modifiedBy: 'Jinal Shah', summary: 'Draft created — approver coverage needs review' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-1018', name: 'Data Lock Override Request', description: 'Admin review of timed edit access requests during a locked financial or academic period.',
    category: 'Administrative', status: 'Frozen', year: '2025-26', version: 5, createdBy: 'Karan Patel', createdOn: '15 Apr 2026', modifiedOn: '18 Sep 2026', frozenReason: 'Frozen during examination close.',
    scopes: ['Finance Department'], triggerAction: 'Data lock override', inProgress: 0,
    steps: [seedStep('wf1018-1', 'Finance Controller', { action: 'Validate request', slaHours: '4' }), seedStep('wf1018-2', 'Super Admin', { action: 'Grant timed override', slaHours: '4' })],
    versionHistory: [{ version: 3, modifiedOn: '21 Jun 2026', modifiedBy: 'Karan Patel', summary: 'Published' }, { version: 4, modifiedOn: '15 Aug 2026', modifiedBy: 'Admin User', summary: 'Updated approval guardrails' }, { version: 5, modifiedOn: '18 Sep 2026', modifiedBy: 'Karan Patel', summary: 'Frozen during examination close' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-1007', name: 'Scholarship Disbursement Review', description: 'Check eligibility, award documentation, and finance clearance before scholarship payment.',
    category: 'Student Services', status: 'Active', year: '2026-27', version: 2, createdBy: 'Mira Shah', createdOn: '04 Jul 2026', modifiedOn: '16 Sep 2026',
    scopes: ['All Branches'], triggerAction: 'Scholarship disbursement', inProgress: 5,
    steps: [seedStep('wf1007-1', 'Admissions Lead', { action: 'Verify eligibility' }), seedStep('wf1007-2', 'Accounts Manager', { action: 'Confirm payment details' }), seedStep('wf1007-3', 'Principal', { action: 'Approve award' })],
    versionHistory: [{ version: 1, modifiedOn: '04 Jul 2026', modifiedBy: 'Mira Shah', summary: 'Initial published version' }, { version: 2, modifiedOn: '16 Sep 2026', modifiedBy: 'Mira Shah', summary: 'Updated finance review step' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-1002', name: 'Purchase Requisition — Standard', description: 'Department request, procurement review, and budget approval for routine purchases.',
    category: 'Financial', status: 'Active', year: '2026-27', version: 4, createdBy: 'Rahul Mehta', createdOn: '18 May 2026', modifiedOn: '12 Sep 2026',
    scopes: ['All Branches'], triggerAction: 'Purchase requisition', inProgress: 12,
    steps: [seedStep('wf1002-1', 'Department HOD', { slaHours: '24' }), seedStep('wf1002-2', 'Procurement Manager', { slaHours: '24' }), seedStep('wf1002-3', 'Finance Controller', { slaHours: '48' })],
    versionHistory: [{ version: 2, modifiedOn: '10 Jul 2026', modifiedBy: 'Rahul Mehta', summary: 'Published' }, { version: 3, modifiedOn: '20 Aug 2026', modifiedBy: 'Admin User', summary: 'Updated spend controls' }, { version: 4, modifiedOn: '12 Sep 2026', modifiedBy: 'Rahul Mehta', summary: 'Current published version' }]
  },
  {
    ...emptyWorkflow(), id: 'WF-0996', name: 'Custom Document Approval', description: 'Reusable custom workflow for institution documents and administrative requests.',
    category: 'Custom', status: 'Draft', year: '2025-26', version: 1, createdBy: 'Admin User', createdOn: '02 Oct 2026', modifiedOn: '02 Oct 2026',
    scopes: ['All Branches'], triggerAction: 'Custom transaction', inProgress: 0,
    steps: [seedStep('wf0996-1', 'Department HOD'), seedStep('wf0996-2', 'Super Admin')],
    versionHistory: [{ version: 1, modifiedOn: '02 Oct 2026', modifiedBy: 'Admin User', summary: 'Draft created' }]
  }
];

const INITIAL_AUDIT: AuditEvent[] = [
  { id: 'audit-1', time: '02 Oct 2026 · 09:14', actor: 'Ananya Desai', action: 'Published version 4', workflow: 'Class Promotion Exception', workflowId: 'WF-1042' },
  { id: 'audit-2', time: '02 Oct 2026 · 08:52', actor: 'Jinal Shah', action: 'Saved draft', workflow: 'Exam Result Publication', workflowId: 'WF-1029' },
  { id: 'audit-3', time: '30 Sep 2026 · 16:32', actor: 'Rahul Mehta', action: 'Updated approver SLA', workflow: 'Fee Concession — High Value', workflowId: 'WF-1038' }
];

function CategoryBadge({ category }: { category: WorkflowCategory }) {
  return <span className={`inline-flex items-center rounded border px-2 py-1 text-[11px] font-semibold ${CATEGORY_STYLES[category]}`}>{category === 'Student Services' ? 'Student Svc' : category}</span>;
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const styles: Record<WorkflowStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700',
    Draft: 'bg-amber-50 text-amber-700',
    Frozen: 'bg-sky-100 text-sky-800'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>{status === 'Frozen' && <Lock className="h-3 w-3" />}{status}</span>;
}

function StatusToggle({ workflow, onToggle }: { workflow: Workflow; onToggle: (workflow: Workflow) => void }) {
  const trackStyle = workflow.status === 'Active' ? 'bg-emerald-500' : workflow.status === 'Draft' ? 'bg-amber-400' : 'bg-sky-200';
  const handleStyle = workflow.status === 'Active' ? 'translate-x-0' : 'translate-x-[22px]';
  const labelStyle = workflow.status === 'Active' ? 'text-emerald-600' : workflow.status === 'Draft' ? 'text-amber-600' : 'text-sky-700';
  return <div className="flex items-center justify-center gap-2">
    <button type="button" onClick={() => onToggle(workflow)} aria-label={`Change ${workflow.name} status from ${workflow.status}`} title={workflow.status === 'Active' ? 'Freeze workflow' : workflow.status === 'Frozen' ? 'Unfreeze workflow' : 'Publish workflow'} className={`relative h-[22px] w-11 rounded-full transition-colors ${trackStyle}`}>
      <span className={`absolute left-0.5 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow transition-transform ${handleStyle}`}>{workflow.status === 'Frozen' && <Lock className="h-2.5 w-2.5 text-sky-700" />}</span>
    </button>
    <span className={`min-w-[54px] text-[11px] font-bold ${labelStyle}`}>{workflow.status.toUpperCase()}</span>
  </div>;
}

function MetricCard({ label, value, hint, tone = 'indigo' }: { label: string; value: string | number; hint: string; tone?: 'indigo' | 'green' | 'amber' | 'blue' }) {
  const tones = { indigo: 'bg-indigo-50 text-indigo-700', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700' };
  return <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm"><p className="text-xs font-medium text-[#6B7280]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#111827]">{value}</p><p className={`mt-3 inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${tones[tone]}`}>{hint}</p></div>;
}

export function ApprovalWorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [activeSection, setActiveSection] = useState<DeskSection>('Setup Desk');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [yearFilter, setYearFilter] = useState('All years');
  const [sortKey, setSortKey] = useState<SortKey>('modifiedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [creationFrozen, setCreationFrozen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState(0);
  const [draft, setDraft] = useState<Workflow>(emptyWorkflow());
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [duplicateWarningDismissed, setDuplicateWarningDismissed] = useState(false);
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);
  const [draggingStepId, setDraggingStepId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT);
  const [previewWorkflow, setPreviewWorkflow] = useState<Workflow | null>(null);
  const [versionWorkflow, setVersionWorkflow] = useState<Workflow | null>(null);
  const [deleteWorkflow, setDeleteWorkflow] = useState<Workflow | null>(null);
  const [freezeWorkflow, setFreezeWorkflow] = useState<Workflow | null>(null);
  const [freezeReason, setFreezeReason] = useState('');
  const [publishWorkflow, setPublishWorkflow] = useState<Workflow | null>(null);
  const [publishFromDrawer, setPublishFromDrawer] = useState(false);
  const [blockedWorkflow, setBlockedWorkflow] = useState<Workflow | null>(null);
  const [grandfatherWorkflow, setGrandfatherWorkflow] = useState<Workflow | null>(null);
  const [grandfatherChoice, setGrandfatherChoice] = useState<GrandfatherChoice>('new-only');
  const [pendingSaveStatus, setPendingSaveStatus] = useState<SaveStatus>('Draft');
  const [drawerErrors, setDrawerErrors] = useState<string[]>([]);

  useEffect(() => {
    setSearching(true);
    const timer = window.setTimeout(() => { setDebouncedQuery(searchQuery); setSearching(false); }, 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setCurrentPage(1); }, [debouncedQuery, statusFilter, categoryFilter, yearFilter]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const recordAudit = (workflow: Workflow, action: string) => {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      time: `${todayLabel()} · ${timeLabel()}`,
      actor: 'Admin User', action, workflow: workflow.name || 'New workflow', workflowId: workflow.id || 'Pending'
    };
    setAuditEvents((previous) => [event, ...previous].slice(0, 200));
  };

  const visibleWorkflows = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    const filtered = workflows.filter((workflow) => {
      const matchesQuery = !query || `${workflow.name} ${workflow.category} ${workflow.createdBy} ${workflow.description}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All statuses' || workflow.status === statusFilter;
      const matchesCategory = categoryFilter === 'All categories' || workflow.category === categoryFilter;
      const matchesYear = yearFilter === 'All years' || workflow.year === yearFilter;
      return matchesQuery && matchesStatus && matchesCategory && matchesYear;
    });
    const valueFor = (workflow: Workflow): string | number => {
      if (sortKey === 'steps') return workflow.steps.length;
      if (sortKey === 'version') return workflow.version;
      return workflow[sortKey];
    };
    return [...filtered].sort((left, right) => {
      const a = valueFor(left);
      const b = valueFor(right);
      const comparison = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [workflows, debouncedQuery, statusFilter, categoryFilter, yearFilter, sortKey, sortDirection]);

  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(visibleWorkflows.length / pageSize));
  const pageWorkflows = visibleWorkflows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = visibleWorkflows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, visibleWorkflows.length);
  const activeCount = workflows.filter((workflow) => workflow.status === 'Active').length;
  const draftCount = workflows.filter((workflow) => workflow.status === 'Draft').length;
  const frozenCount = workflows.filter((workflow) => workflow.status === 'Frozen').length;
  const totalInProgress = workflows.reduce((sum, workflow) => sum + workflow.inProgress, 0);
  const years = Array.from(new Set(workflows.map((workflow) => workflow.year))).sort().reverse();

  const identityErrors = useMemo(() => {
    const errors: string[] = [];
    if (!draft.name.trim()) errors.push('Workflow name is required.');
    const duplicate = workflows.some((workflow) => workflow.id !== draft.id && workflow.name.trim().toLowerCase() === draft.name.trim().toLowerCase());
    if (draft.name.trim() && duplicate) errors.push('A workflow with this name already exists.');
    if (draft.description.length > 300) errors.push('Description must be 300 characters or fewer.');
    return errors;
  }, [draft.name, draft.description, draft.id, workflows]);
  const publishErrors = useMemo(() => {
    const errors = [...identityErrors];
    if (draft.steps.length === 0) errors.push('Add at least one approver step.');
    draft.steps.forEach((step, index) => {
      if ((ROLE_COUNTS[step.role] ?? 0) === 0) errors.push(`Step ${index + 1} has no active members for ${step.role}.`);
    });
    const circularIndex = draft.steps.findIndex((step, index) => {
      const target = step.onReject.match(/^Step (\d+)$/);
      return Boolean(target && Number(target[1]) >= index + 1);
    });
    if (circularIndex >= 0) errors.push(`Step ${circularIndex + 1} routes rejection to itself or a later step.`);
    if (!draft.fallbackUser) errors.push('Choose a mandatory fallback user.');
    return errors;
  }, [identityErrors, draft.steps, draft.fallbackUser]);
  const draftNameError = validationAttempted ? identityErrors[0] : '';

  const openNewWorkflow = () => {
    if (creationFrozen) { notify('Workflow creation is frozen during the active exam cycle.'); return; }
    setDraft(emptyWorkflow());
    setDrawerStep(0);
    setDrawerErrors([]);
    setValidationAttempted(false);
    setDuplicateWarningDismissed(false);
    setScopeDropdownOpen(false);
    setDrawerOpen(true);
  };

  const openEditor = (workflow: Workflow, initialStep = 0) => {
    if (workflow.status === 'Frozen') { notify('Frozen workflows must be unfrozen before they can be edited.'); return; }
    setDraft({ ...workflow, scopes: [...workflow.scopes], steps: workflow.steps.map((step) => ({ ...step })), emailRecipients: { ...workflow.emailRecipients }, rules: { ...workflow.rules }, versionHistory: [...workflow.versionHistory] });
    setDrawerStep(initialStep);
    setDrawerErrors([]);
    setValidationAttempted(false);
    setDuplicateWarningDismissed(false);
    setScopeDropdownOpen(false);
    setDrawerOpen(true);
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    if (creationFrozen) { notify('Workflow creation is frozen during the active exam cycle.'); return; }
    setDraft({ ...workflow, id: '', name: `${workflow.name} — Copy`, status: 'Draft', year: '2026-27', version: 1, createdBy: 'Admin User', createdOn: '', modifiedOn: '', inProgress: 0, frozenReason: '', scopes: [...workflow.scopes], steps: workflow.steps.map((step) => ({ ...step, id: `copy-${Date.now()}-${step.id}` })), versionHistory: [], emailRecipients: { ...workflow.emailRecipients }, rules: { ...workflow.rules } });
    setDrawerStep(0);
    setDrawerErrors([]);
    setValidationAttempted(false);
    setDuplicateWarningDismissed(false);
    setDrawerOpen(true);
  };

  const updateDraft = (patch: Partial<Workflow>) => setDraft((current) => ({ ...current, ...patch }));
  const updateStep = (stepId: string, patch: Partial<WorkflowStep>) => {
    setDuplicateWarningDismissed(false);
    setDraft((current) => ({ ...current, steps: current.steps.map((step) => step.id === stepId ? { ...step, ...patch } : step) }));
  };
  const addStep = () => {
    if (draft.steps.length >= 10) return;
    setDraft((current) => ({ ...current, steps: [...current.steps, makeStep()] }));
    setDuplicateWarningDismissed(false);
  };
  const removeStep = (stepId: string) => {
    setDraft((current) => ({ ...current, steps: current.steps.filter((step) => step.id !== stepId) }));
    setDuplicateWarningDismissed(false);
  };
  const reorderSteps = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setDraft((current) => {
      const next = [...current.steps];
      const fromIndex = next.findIndex((step) => step.id === fromId);
      const toIndex = next.findIndex((step) => step.id === toId);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...current, steps: next };
    });
    setDraggingStepId(null);
    setDuplicateWarningDismissed(false);
  };

  const toggleScope = (scope: string) => {
    setDraft((current) => {
      if (current.scopes.includes(scope)) return { ...current, scopes: current.scopes.filter((item) => item !== scope) };
      if (scope === 'All Grades' || scope === 'All Branches') return { ...current, scopes: [scope] };
      return { ...current, scopes: [...current.scopes.filter((item) => item !== 'All Grades' && item !== 'All Branches'), scope] };
    });
  };

  const performSave = (saveStatus: SaveStatus, grandfather: GrandfatherChoice = 'new-only') => {
    const existing = workflows.find((workflow) => workflow.id && workflow.id === draft.id);
    const savedAt = todayLabel();
    const nextVersion = existing ? existing.version + 1 : 1;
    const newId = existing?.id || `WF-${String(Date.now()).slice(-5)}`;
    const versionEntry: WorkflowVersion = {
      version: nextVersion,
      modifiedOn: savedAt,
      modifiedBy: 'Admin User',
      summary: existing
        ? `Version ${nextVersion} saved${existing.inProgress > 0 ? ` · ${grandfather === 'new-only' ? 'existing tasks stay on prior version' : 'in-progress tasks migrated'}` : ''}`
        : saveStatus === 'Active' ? 'Initial version published' : 'Draft created'
    };
    const saved: Workflow = {
      ...draft,
      id: newId,
      status: saveStatus,
      version: nextVersion,
      createdBy: existing?.createdBy || 'Admin User',
      createdOn: existing?.createdOn || savedAt,
      modifiedOn: savedAt,
      inProgress: existing?.inProgress || 0,
      frozenReason: '',
      versionHistory: [...(existing?.versionHistory || []), versionEntry]
    };
    setWorkflows((current) => existing
      ? current.map((workflow) => workflow.id === existing.id ? saved : workflow)
      : [saved, ...current]
    );
    recordAudit(saved, existing ? `Saved version ${nextVersion} as ${saveStatus}` : `Created ${saveStatus.toLowerCase()}`);
    setDrawerOpen(false);
    setActiveSection('Setup Desk');
    setValidationAttempted(false);
    setDrawerErrors([]);
    notify(saveStatus === 'Active' ? `${saved.name} published locally as version ${nextVersion}.` : `${saved.name} saved as a draft.`);
  };

  const requestDrawerSave = (saveStatus: SaveStatus) => {
    setValidationAttempted(true);
    const errors = saveStatus === 'Active' ? publishErrors : identityErrors;
    setDrawerErrors(errors);
    if (errors.length) {
      if (identityErrors.length) setDrawerStep(0);
      else if (saveStatus === 'Active' && publishErrors.some((error) => error.includes('Step') || error.includes('approver'))) setDrawerStep(1);
      else if (saveStatus === 'Active' && publishErrors.some((error) => error.includes('fallback'))) setDrawerStep(2);
      notify(errors[0]);
      return;
    }
    const existing = workflows.find((workflow) => workflow.id && workflow.id === draft.id);
    if (existing?.status === 'Active' && existing.inProgress > 0) {
      setPendingSaveStatus(saveStatus);
      setGrandfatherChoice('new-only');
      setGrandfatherWorkflow(existing);
      return;
    }
    performSave(saveStatus);
  };

  const requestPublishFromDrawer = () => {
    setValidationAttempted(true);
    setDrawerErrors(publishErrors);
    if (publishErrors.length) {
      if (identityErrors.length) setDrawerStep(0);
      else if (publishErrors.some((error) => error.includes('Step') || error.includes('approver'))) setDrawerStep(1);
      else setDrawerStep(2);
      notify(publishErrors[0]);
      return;
    }
    setPublishWorkflow(null);
    setPublishFromDrawer(true);
  };

  useEffect(() => {
    if (publishFromDrawer) setPublishWorkflow(null);
  }, [publishFromDrawer]);

  const completePublish = () => {
    if (publishFromDrawer) {
      setPublishFromDrawer(false);
      requestDrawerSave('Active');
      return;
    }
    if (!publishWorkflow) return;
    const target = publishWorkflow;
    const errors: string[] = [];
    if (!target.steps.length) errors.push('Add at least one approver step before publishing.');
    target.steps.forEach((step, index) => { if ((ROLE_COUNTS[step.role] ?? 0) === 0) errors.push(`Step ${index + 1} has no active members for ${step.role}.`); });
    if (errors.length) {
      setPublishWorkflow(null);
      openEditor(target, 1);
      setValidationAttempted(true);
      setDrawerErrors(errors);
      notify(errors[0]);
      return;
    }
    const nextStatus: WorkflowStatus = 'Active';
    const updated = { ...target, status: nextStatus, modifiedOn: todayLabel(), frozenReason: '' };
    setWorkflows((current) => current.map((workflow) => workflow.id === target.id ? updated : workflow));
    recordAudit(updated, target.status === 'Frozen' ? 'Unfroze workflow' : `Published version ${target.version}`);
    setPublishWorkflow(null);
    notify(target.status === 'Frozen' ? `${target.name} is active again.` : `${target.name} is now active.`);
  };

  const toggleWorkflowStatus = (workflow: Workflow) => {
    if (workflow.status === 'Active') {
      setFreezeWorkflow(workflow);
      setFreezeReason('');
      return;
    }
    setPublishFromDrawer(false);
    setPublishWorkflow(workflow);
  };

  const confirmFreeze = () => {
    if (!freezeWorkflow) return;
    if (freezeReason.trim().length < 10) { notify('Enter a freeze reason of at least 10 characters.'); return; }
    const target = freezeWorkflow;
    const updated = { ...target, status: 'Frozen' as const, frozenReason: freezeReason.trim(), modifiedOn: todayLabel() };
    setWorkflows((current) => current.map((workflow) => workflow.id === target.id ? updated : workflow));
    recordAudit(updated, 'Frozen with reason');
    setFreezeWorkflow(null);
    setFreezeReason('');
    notify(`${target.name} is frozen.`);
  };

  const changeToDraft = (workflow: Workflow) => {
    setPreviewWorkflow(null);
    if (workflow.inProgress > 0) { setBlockedWorkflow(workflow); return; }
    const updated = { ...workflow, status: 'Draft' as const, modifiedOn: todayLabel() };
    setWorkflows((current) => current.map((item) => item.id === workflow.id ? updated : item));
    recordAudit(updated, 'Reverted to draft');
    notify(`${workflow.name} returned to Draft.`);
  };

  const confirmDelete = () => {
    if (!deleteWorkflow) return;
    const target = deleteWorkflow;
    setWorkflows((current) => current.filter((workflow) => workflow.id !== target.id));
    recordAudit(target, 'Deleted workflow');
    setDeleteWorkflow(null);
    notify(`${target.name} removed from the local directory.`);
  };

  const confirmGrandfatheredSave = () => {
    setGrandfatherWorkflow(null);
    performSave(pendingSaveStatus, grandfatherChoice);
  };

  const setSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDirection('asc'); }
  };
  const sortMark = (key: SortKey) => sortKey === key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';

  const handlePageSection = (section: DeskSection) => setActiveSection(section);
  const duplicateStepIndex = draft.steps.findIndex((step, index) => index > 0 && step.role === draft.steps[index - 1].role);
  const circularStepIndex = draft.steps.findIndex((step, index) => {
    const target = step.onReject.match(/^Step (\d+)$/);
    return Boolean(target && Number(target[1]) >= index + 1);
  });
  const renderStepCard = (step: WorkflowStep, index: number) => {
    const activeMembers = ROLE_COUNTS[step.role] ?? 0;
    const stepHasError = validationAttempted && activeMembers === 0;
    return <div key={step.id} className="flex flex-col items-center">
      <div
        draggable
        onDragStart={() => setDraggingStepId(step.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => draggingStepId && reorderSteps(draggingStepId, step.id)}
        onDragEnd={() => setDraggingStepId(null)}
        className={`w-full rounded-lg border p-4 shadow-sm transition ${stepHasError ? 'border-red-300 bg-red-50' : step.parallel ? 'border-indigo-200 bg-indigo-50/40' : 'border-[#E5E7EB] bg-white'} ${draggingStepId === step.id ? 'rotate-1 opacity-50 shadow-xl' : ''}`}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <GripVertical className="h-4 w-4 cursor-grab text-gray-300" />
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500">Step {index + 1}</span>
          <span className="ml-auto flex items-center gap-2">{step.parallel && <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Parallel</span>}{step.conditionEnabled && <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">Condition</span>}</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-gray-600">Role
            <select value={step.role} onChange={(event) => updateStep(step.id, { role: event.target.value })} className={`mt-1 block h-9 w-full rounded-md border bg-white px-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500 ${stepHasError ? 'border-red-400' : 'border-gray-200'}`}>
              {APPROVER_ROLES.map((role) => <option key={role} value={role}>{role} ({ROLE_COUNTS[role]} active){ROLE_COUNTS[role] === 0 ? ' ⚠' : ''}</option>)}
            </select>
            <span className={`mt-1 block text-[11px] ${activeMembers === 0 ? 'font-semibold text-red-600' : activeMembers === 1 ? 'text-amber-600' : 'text-emerald-600'}`}>{activeMembers === 0 ? '⚠ 0 active members — workflow cannot be published' : `${activeMembers} active member${activeMembers === 1 ? '' : 's'} available`}</span>
          </label>
          <label className="text-xs font-medium text-gray-600">Action
            <select value={step.action} onChange={(event) => updateStep(step.id, { action: event.target.value })} className="mt-1 block h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"><option>Review &amp; Approve</option><option>Review</option><option>Verify</option><option>Approve</option><option>Acknowledge</option><option>Grant timed access</option></select>
          </label>
          <label className="text-xs font-medium text-gray-600">SLA
            <select value={step.slaHours} onChange={(event) => updateStep(step.id, { slaHours: event.target.value })} className="mt-1 block h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"><option value="4">4 hours</option><option value="8">8 hours</option><option value="24">24 hours</option><option value="48">48 hours</option><option value="72">72 hours</option></select>
          </label>
          <label className="text-xs font-medium text-gray-600">SLA breach
            <select value={step.slaBreach} onChange={(event) => updateStep(step.id, { slaBreach: event.target.value })} className="mt-1 block h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"><option>Send Reminder</option><option>Escalate to next approver</option><option>Notify fallback user</option><option>Mark SLA breached</option></select>
          </label>
          <label className="text-xs font-medium text-gray-600 sm:col-span-2">On Reject
            <select value={step.onReject} onChange={(event) => updateStep(step.id, { onReject: event.target.value })} className="mt-1 block h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"><option>Back to Initiator</option><option>Reject request</option><option>Previous step</option>{draft.steps.map((_, targetIndex) => <option key={`reject-${targetIndex}`} value={`Step ${targetIndex + 1}`}>Return to Step {targetIndex + 1}</option>)}</select>
          </label>
          {step.conditionEnabled && <label className="text-xs font-medium text-gray-600 sm:col-span-2">Condition / branch rule<input value={step.conditionText} onChange={(event) => updateStep(step.id, { conditionText: event.target.value })} placeholder="e.g. Amount exceeds ₹50,000" className="mt-1 block h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm outline-none focus:border-indigo-500" /></label>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <button type="button" onClick={() => updateStep(step.id, { parallel: !step.parallel })} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${step.parallel ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-100 text-gray-600'}`}><GitBranch className="mr-1 inline h-3 w-3" />Parallel</button>
          <button type="button" onClick={() => updateStep(step.id, { conditionEnabled: !step.conditionEnabled })} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${step.conditionEnabled ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-gray-200 bg-gray-100 text-gray-600'}`}>⑃ Condition</button>
          <button type="button" onClick={() => removeStep(step.id)} className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50" aria-label={`Remove step ${index + 1}`}><Trash2 className="h-3.5 w-3.5" />Remove</button>
        </div>
      </div>
      {index < draft.steps.length - 1 && <div className={`my-2 h-6 w-0.5 ${step.parallel || draft.steps[index + 1].parallel ? 'bg-indigo-400' : 'bg-gray-300'}`}><ArrowDown className="relative -left-[7px] top-4 h-4 w-4 text-gray-400" /></div>}
    </div>;
  };

  const renderSetupDesk = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard label="Active workflows" value={activeCount} hint="Published and routing requests" tone="green" />
        <MetricCard label="Drafts" value={draftCount} hint="Require review before publish" tone="amber" />
        <MetricCard label="Requests in progress" value={totalInProgress.toLocaleString()} hint="Across active workflows" tone="blue" />
        <MetricCard label="Frozen workflows" value={frozenCount} hint="Protected from edits" />
      </div>

      <section className="rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <div className="relative min-w-[220px] flex-1 xl:max-w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search workflows, categories, creators..." aria-label="Search workflows" className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-800 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
            {searching && <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" aria-label="Searching" />}
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="h-9 min-w-[126px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-indigo-600"><option>All statuses</option><option>Active</option><option>Draft</option><option>Frozen</option></select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category" className="h-9 min-w-[140px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-indigo-600"><option>All categories</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
          <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} aria-label="Filter by year" className="h-9 min-w-[120px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-indigo-600"><option>All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select>
          <button type="button" onClick={openNewWorkflow} disabled={creationFrozen} title={creationFrozen ? 'Workflow creation is frozen during the active exam cycle' : 'Create a new workflow'} className="ml-0 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:-translate-y-px hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none xl:ml-auto">
            {creationFrozen ? <Lock className="h-4 w-4" /> : <Plus className="h-[18px] w-[18px]" />}{creationFrozen ? 'Creation frozen' : 'Create New Workflow'}
          </button>
        </div>
        {creationFrozen && <p className="mt-2 text-xs text-gray-500">Workflow creation is frozen during the active exam cycle. Change this in Settings to enable new workflows.</p>}
      </section>

      <section className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3"><div><h2 className="text-sm font-semibold text-[#111827]">Workflow Directory</h2><p className="mt-0.5 text-xs text-[#6B7280]">Search, review, version, and maintain approval paths.</p></div><span className="text-xs text-[#6B7280]">{visibleWorkflows.length} workflows</span></div>
        {visibleWorkflows.length === 0 ? <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center"><div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-300"><GitBranch className="h-8 w-8" /></div><h3 className="text-base font-semibold text-gray-700">No workflows configured yet</h3><p className="mt-1 max-w-md text-sm text-gray-500">Click the button below to build your first approval path.</p><button type="button" disabled={creationFrozen} onClick={openNewWorkflow} className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"><Plus className="h-4 w-4" />Create workflow</button></div> : (
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full border-collapse text-left">
              <thead className="h-11 border-b border-[#E5E7EB] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6B7280]">
                <tr>
                  <th className="w-[60px] px-4 text-center">S.No</th>
                  <th className="min-w-[220px] px-3"><button type="button" onClick={() => setSort('name')} className="inline-flex items-center gap-1 hover:text-gray-900">Workflow Name <span>{sortMark('name')}</span></button></th>
                  <th className="w-[140px] px-3 text-center"><button type="button" onClick={() => setSort('category')} className="inline-flex items-center gap-1 hover:text-gray-900">Category <span>{sortMark('category')}</span></button></th>
                  <th className="w-[100px] px-3 text-center"><button type="button" onClick={() => setSort('steps')} className="inline-flex items-center gap-1 hover:text-gray-900">Total Steps <span>{sortMark('steps')}</span></button></th>
                  <th className="w-[120px] px-3 text-center"><button type="button" onClick={() => setSort('version')} className="inline-flex items-center gap-1 hover:text-gray-900">Current Version <span>{sortMark('version')}</span></button></th>
                  <th className="w-[150px] px-3 text-center"><button type="button" onClick={() => setSort('status')} className="inline-flex items-center gap-1 hover:text-gray-900">Status <span>{sortMark('status')}</span></button></th>
                  <th className="w-[150px] px-3"><button type="button" onClick={() => setSort('createdBy')} className="inline-flex items-center gap-1 hover:text-gray-900">Created By <span>{sortMark('createdBy')}</span></button></th>
                  <th className="w-[155px] px-3"><button type="button" onClick={() => setSort('modifiedOn')} className="inline-flex items-center gap-1 hover:text-gray-900">Last Modified <span>{sortMark('modifiedOn')}</span></button></th>
                  <th className="w-[120px] px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pageWorkflows.map((workflow, index) => <tr key={workflow.id} className={`group h-14 transition-colors hover:bg-[#F9FAFB] ${workflow.status === 'Draft' ? 'shadow-[inset_3px_0_0_#F59E0B]' : workflow.status === 'Frozen' ? 'bg-[#F0F9FF] text-gray-500' : 'bg-white'}`}>
                  <td className="px-4 text-center text-xs text-gray-500">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="relative px-3">
                    <button type="button" onClick={() => setPreviewWorkflow(workflow)} title={workflow.name} className="max-w-[300px] truncate text-left text-sm font-medium text-indigo-600 hover:underline">{workflow.name}</button>
                    <span className="ml-2 text-[10px] text-gray-400">{workflow.id}</span>
                    <div className="pointer-events-none absolute bottom-[calc(100%-2px)] left-1/2 z-30 hidden w-72 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-50 shadow-lg transition-opacity delay-500 group-hover:block"><strong>Approval path</strong><br />{workflow.steps.slice(0, 3).map((step, stepIndex) => `Step ${stepIndex + 1}: ${step.role}`).join(' → ') || 'No steps configured'}</div>
                  </td>
                  <td className="px-3 text-center"><CategoryBadge category={workflow.category} /></td>
                  <td className="px-3 text-center"><span className="inline-flex min-w-9 justify-center rounded-xl bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">{workflow.steps.length}</span></td>
                  <td className="px-3 text-center"><button type="button" onClick={() => setVersionWorkflow(workflow)} className="font-medium text-indigo-600 hover:underline">v{workflow.version}</button></td>
                  <td className="px-3 text-center"><StatusToggle workflow={workflow} onToggle={toggleWorkflowStatus} /></td>
                  <td className="px-3 text-sm text-gray-700">{workflow.createdBy}</td>
                  <td className="px-3 text-sm text-gray-600">{workflow.modifiedOn || 'Not saved'}</td>
                  <td className="px-3"><div className="flex items-center justify-center gap-1">
                    <button type="button" title={workflow.status === 'Frozen' ? 'Frozen — unfreeze to edit' : 'Edit workflow'} aria-label={`Edit ${workflow.name}`} disabled={workflow.status === 'Frozen'} onClick={() => openEditor(workflow)} className="grid h-7 w-7 place-items-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"><Settings2 className="h-4 w-4" /></button>
                    <button type="button" title={creationFrozen ? 'Creation is frozen during the active exam cycle' : 'Duplicate workflow'} aria-label={`Duplicate ${workflow.name}`} disabled={creationFrozen} onClick={() => duplicateWorkflow(workflow)} className="grid h-7 w-7 place-items-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"><Copy className="h-4 w-4" /></button>
                    <button type="button" title="Delete workflow" aria-label={`Delete ${workflow.name}`} onClick={() => setDeleteWorkflow(workflow)} className="grid h-7 w-7 place-items-center rounded text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
        {visibleWorkflows.length > 0 && <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-gray-500">Showing {rangeStart}–{rangeEnd} of {visibleWorkflows.length} workflows</span><div className="flex items-center gap-1"><button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="grid h-8 w-8 place-items-center rounded text-gray-600 hover:bg-gray-100 disabled:text-gray-300"><ChevronLeft className="h-4 w-4" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" key={page} onClick={() => setCurrentPage(page)} className={`h-8 min-w-8 rounded px-2 text-xs ${page === currentPage ? 'bg-indigo-600 font-semibold text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{page}</button>)}<button type="button" aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="grid h-8 w-8 place-items-center rounded text-gray-600 hover:bg-gray-100 disabled:text-gray-300"><ChevronRight className="h-4 w-4" /></button></div></div>}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400"><span>Version 2.4.1 · Local preview state</span><span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />Workflow changes are not published to a live service.</span></div>
    </div>
  );

  const renderDashboard = () => <div className="space-y-5">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Active workflows" value={activeCount} hint="Routing requests" tone="green" /><MetricCard label="Drafts to review" value={draftCount} hint="Needs a publishing decision" tone="amber" /><MetricCard label="Frozen workflows" value={frozenCount} hint="Protected during close periods" tone="blue" /><MetricCard label="Requests in progress" value={totalInProgress.toLocaleString()} hint="Across active workflows" /></div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-gray-900">Workflow coverage</h2><p className="mt-1 text-sm text-gray-500">Published approval paths by category.</p><div className="mt-4 space-y-3">{CATEGORIES.map((category) => { const count = workflows.filter((workflow) => workflow.category === category && workflow.status === 'Active').length; return <div key={category} className="flex items-center gap-3"><CategoryBadge category={category} /><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(count > 0 ? 10 : 0, count / Math.max(1, activeCount) * 100)}%` }} /></div><span className="w-6 text-right text-xs text-gray-500">{count}</span></div>; })}</div></section><section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-gray-900">Latest changes</h2><div className="mt-3 divide-y divide-gray-100">{auditEvents.slice(0, 5).map((event) => <div key={event.id} className="flex items-start gap-3 py-3"><span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-indigo-50 text-indigo-600"><History className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-800">{event.action}</p><p className="mt-0.5 truncate text-xs text-gray-500">{event.workflow} · {event.actor}</p></div><span className="text-[10px] text-gray-400">{event.time}</span></div>)}</div></section></div>
  </div>;

  const renderActionHub = () => {
    const actionable = workflows.filter((workflow) => workflow.status === 'Draft' || workflow.inProgress > 0);
    return <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-semibold text-gray-900">Action Hub</h2><p className="mt-1 text-sm text-gray-500">Drafts needing review and workflows with active tasks.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{actionable.length} items</span></div>{actionable.length === 0 ? <p className="py-10 text-center text-sm text-gray-500">No workflow actions are waiting.</p> : <div className="mt-4 divide-y divide-gray-100">{actionable.map((workflow) => <div key={workflow.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><button type="button" onClick={() => setPreviewWorkflow(workflow)} className="font-medium text-indigo-600 hover:underline">{workflow.name}</button><p className="mt-1 text-xs text-gray-500">{workflow.status === 'Draft' ? 'Draft requires validation before publishing.' : `${workflow.inProgress} tasks currently in progress.`}</p></div><CategoryBadge category={workflow.category} /><StatusBadge status={workflow.status} /><button type="button" onClick={() => openEditor(workflow, workflow.status === 'Draft' ? 1 : 0)} disabled={workflow.status === 'Frozen'} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300">Review</button></div>)}</div>}</section>;
  };

  const renderAuditVault = () => <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-indigo-600" /><div><h2 className="font-semibold text-gray-900">Audit Vault</h2><p className="mt-0.5 text-xs text-gray-500">Local, append-only record of workflow changes made in this preview.</p></div></div></div>{auditEvents.length === 0 ? <p className="p-8 text-center text-sm text-gray-500">No change events recorded yet.</p> : <div className="overflow-x-auto"><table className="min-w-[700px] w-full text-left text-sm"><thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Workflow</th><th className="px-4 py-3">Reference</th></tr></thead><tbody className="divide-y divide-gray-100">{auditEvents.map((event) => <tr key={event.id}><td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{event.time}</td><td className="px-4 py-3">{event.actor}</td><td className="px-4 py-3"><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{event.action}</span></td><td className="px-4 py-3 font-medium text-gray-800">{event.workflow}</td><td className="px-4 py-3 font-mono text-xs text-gray-500">{event.workflowId}</td></tr>)}</tbody></table></div>}</section>;

  const renderHelp = () => <section className="grid grid-cols-1 gap-4 lg:grid-cols-2"><div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-indigo-600" /><h2 className="font-semibold text-gray-900">Build a reliable workflow</h2></div><ol className="mt-4 space-y-3 text-sm text-gray-600">{['Define a unique name, category, trigger, and applicable scope.', 'Add approver steps, ownership, SLA timers, and rejection routes.', 'Select a mandatory fallback user and notification recipients.', 'Save as a draft, validate active role coverage, then publish.'].map((text, index) => <li key={text} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">{index + 1}</span><span className="pt-0.5">{text}</span></li>)}</ol></div><div className="rounded-lg border border-indigo-100 bg-indigo-50 p-5"><h2 className="font-semibold text-indigo-900">Guardrails</h2><ul className="mt-3 space-y-2 text-sm leading-relaxed text-indigo-800"><li>• A role with zero active members blocks publishing.</li><li>• Frozen workflows cannot be edited until unfrozen.</li><li>• Changes to active workflows with tasks in flight use a version handoff.</li><li>• Workflow changes in this build stay in local page state only.</li></ul></div></section>;

  const renderSettings = () => <section className="max-w-3xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-gray-900">Workflow creation controls</h2><p className="mt-1 text-sm leading-relaxed text-gray-500">Freeze new workflow creation during active examination cycles. Existing workflows remain visible; frozen workflows cannot be edited until they are unfrozen.</p></div><button type="button" role="switch" aria-checked={creationFrozen} onClick={() => setCreationFrozen((current) => !current)} className={`relative mt-1 h-6 w-12 rounded-full transition ${creationFrozen ? 'bg-sky-200' : 'bg-emerald-500'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${creationFrozen ? 'translate-x-7' : 'translate-x-1'}`} /></button></div><div className="mt-4 flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50 p-3 text-xs text-sky-800"><Lock className="h-4 w-4 shrink-0" />{creationFrozen ? 'Creation is frozen for this local preview.' : 'Creation is enabled. Toggle to simulate an exam-cycle freeze.'}</div></section>;

  return (
    <main className="min-h-full bg-[#F9FAFB] p-4 text-[#111827] md:p-6">
      <header className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-1 text-xs text-[#9CA3AF]"><span>Settings</span><ChevronRight className="h-3 w-3" /><span>Workflows</span><ChevronRight className="h-3 w-3" /><span className="font-medium text-indigo-600">Setup Desk</span></div>
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white"><GitBranch className="h-5 w-5" /></span><div><h1 className="text-xl font-semibold text-[#111827]">Workflow Setup Desk</h1><p className="mt-0.5 text-sm text-[#6B7280]">Build, validate, publish, and audit approval workflows.</p></div></div>
        </div>
        <div className="flex items-center gap-3 self-start rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 lg:self-auto"><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">AU</span><span><span className="block text-sm font-medium text-gray-800">Admin User</span><span className="block text-[11px] text-gray-500">Super Admin</span></span><ChevronDown className="h-4 w-4 text-gray-400" /><span className="ml-1 hidden h-7 border-l border-gray-200 sm:block" /><button type="button" onClick={() => notify('Logout is handled by the ERP shell.')} className="text-xs font-medium text-gray-500 hover:text-red-500">Logout</button></div>
      </header>

      <nav aria-label="Workflow workspace sections" className="mb-5 flex flex-wrap gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1 shadow-sm">
        {PAGE_SECTIONS.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => handlePageSection(label)} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${activeSection === label ? 'bg-indigo-50 font-medium text-indigo-700 shadow-[inset_3px_0_0_#4F46E5]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}><Icon className="h-4 w-4" />{label}</button>)}
      </nav>

      {activeSection === 'Setup Desk' && renderSetupDesk()}
      {activeSection === 'Dashboard' && renderDashboard()}
      {activeSection === 'Action Hub' && renderActionHub()}
      {activeSection === 'Audit Vault' && renderAuditVault()}
      {activeSection === 'Help & Docs' && renderHelp()}
      {activeSection === 'Settings' && renderSettings()}

      {drawerOpen && <>
        <button type="button" aria-label="Close workflow configurator" onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-[60] bg-slate-900/40" />
        <aside role="dialog" aria-modal="true" aria-label={draft.id ? `Edit ${draft.name}` : 'Create new workflow'} className="fixed inset-3 z-[61] mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl md:inset-8 md:h-[calc(100vh-4rem)]">
          <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
            <div className="min-w-0"><h2 className="truncate text-lg font-semibold text-gray-900">{draft.id ? `Edit: ${draft.name}` : 'Create New Workflow'}</h2><p className="mt-0.5 text-xs text-gray-500">{draft.id ? `V${draft.version} · Last saved ${draft.modifiedOn || 'not yet'}` : 'New approval path · Draft until saved'}</p></div>
            <button type="button" onClick={() => setDrawerOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded text-gray-500 hover:bg-gray-100" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="border-b border-gray-200 bg-white px-4 pt-3">
            <div className="grid grid-cols-4 gap-1">{['Identity', 'Approvers', 'Fallback', 'Rules'].map((label, index) => <button type="button" key={label} onClick={() => setDrawerStep(index)} className={`rounded-t-md px-1 py-2 text-xs font-medium transition ${drawerStep === index ? 'border-b-2 border-indigo-600 text-indigo-700' : index < drawerStep ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-700'}`}>{index < drawerStep ? '✓ ' : `${index + 1}  `}{label}</button>)}</div>
            <div className="h-0.5 bg-gray-100"><div className="h-0.5 bg-indigo-600 transition-all" style={{ width: `${((drawerStep + 1) / 4) * 100}%` }} /></div>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
            {drawerStep === 0 && <div className="space-y-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Step 1 · Workflow identity</p><p className="mt-1 text-sm text-gray-500">Define what starts this workflow and which users or records it covers.</p></div>
              <label className="block text-[13px] font-medium text-gray-700">Workflow Name <span className="text-red-500">*</span><div className="relative mt-1.5"><input maxLength={100} value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} placeholder="e.g. Fee concession — high value" className={`h-10 w-full rounded-md border px-3 pr-9 text-sm text-gray-900 outline-none focus:ring-4 ${draftNameError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-100'}`} />{draft.name.trim() && !identityErrors.some((error) => error.includes('already exists')) && <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />}</div>{draftNameError && <span className="mt-1 block text-xs text-red-600">{draftNameError}</span>}</label>
              <label className="block text-[13px] font-medium text-gray-700">Description <span className="text-gray-400">(optional)</span><textarea maxLength={300} rows={3} value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} placeholder="Describe when this approval path should be used..." className="mt-1.5 block min-h-20 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" /><span className="mt-1 block text-right text-[11px] text-gray-400">{draft.description.length} / 300</span></label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-[13px] font-medium text-gray-700">Category<select value={draft.category} onChange={(event) => updateDraft({ category: event.target.value as WorkflowCategory })} className="mt-1.5 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-600">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label className="block text-[13px] font-medium text-gray-700">Academic / Financial Year<select value={draft.year} onChange={(event) => updateDraft({ year: event.target.value })} className="mt-1.5 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-600"><option>2026-27</option><option>2025-26</option><option>2024-25</option></select></label></div>
              <div><div className="flex items-center justify-between"><label className="text-[13px] font-medium text-gray-700">Applicable Scope</label><button type="button" onClick={() => setScopeDropdownOpen((open) => !open)} className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-700">+ Add Scope</button></div><div className="mt-2 flex flex-wrap gap-2">{draft.scopes.length ? draft.scopes.map((scope) => <span key={scope} className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{scope}<button type="button" onClick={() => toggleScope(scope)} aria-label={`Remove ${scope}`} className="text-indigo-400 hover:text-indigo-700">×</button></span>) : <span className="text-xs text-gray-400">No scope selected yet.</span>}</div>{scopeDropdownOpen && <div className="mt-2 grid grid-cols-1 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg sm:grid-cols-2">{SCOPE_OPTIONS.map((scope) => <label key={scope} className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50"><input type="checkbox" checked={draft.scopes.includes(scope)} onChange={() => toggleScope(scope)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />{scope}</label>)}</div>}</div>
              <fieldset><legend className="text-[13px] font-medium text-gray-700">Trigger Timing</legend><div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">{(['Immediate', 'Scheduled', 'Manual'] as Timing[]).map((timing) => <label key={timing} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm ${draft.triggerTiming === timing ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><input type="radio" name="trigger-timing" checked={draft.triggerTiming === timing} onChange={() => updateDraft({ triggerTiming: timing })} className="h-4 w-4 accent-indigo-600" />{timing}</label>)}</div></fieldset>
              <label className="block text-[13px] font-medium text-gray-700">Triggering Action<select value={draft.triggerAction} onChange={(event) => updateDraft({ triggerAction: event.target.value })} className="mt-1.5 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-600">{TRIGGER_ACTIONS.map((action) => <option key={action}>{action}</option>)}</select></label>
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3 sm:grid-cols-2"><label className="text-xs font-medium text-gray-700">Minimum amount (₹)<input type="number" min="0" value={draft.minAmount} onChange={(event) => updateDraft({ minAmount: event.target.value })} placeholder="No minimum" className="mt-1 block h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm" /></label><label className="text-xs font-medium text-gray-700">Maximum amount (₹)<input type="number" min="0" value={draft.maxAmount} onChange={(event) => updateDraft({ maxAmount: event.target.value })} placeholder="No maximum" className="mt-1 block h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm" /></label><p className="text-[11px] leading-relaxed text-indigo-800 sm:col-span-2">Optional amount bands are applied to the selected triggering action in this workflow preview.</p></div>
            </div>}

            {drawerStep === 1 && <div className="space-y-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Step 2 · Approval chain</p><p className="mt-1 text-sm text-gray-500">Drag a step to reorder it. Up to ten approval steps can be configured.</p></div>
              {circularStepIndex >= 0 && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800"><AlertTriangle className="mr-1 inline h-4 w-4" />Circular dependency detected at Step {circularStepIndex + 1}. Route rejections to the initiator, rejection, or an earlier step.</div>}
              <div className="max-h-[600px] space-y-0 overflow-y-auto rounded-lg border border-gray-200 bg-[#F9FAFB] p-3">
                <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />START: Trigger fires <span className="mt-1 block text-xs font-normal text-green-700">{draft.triggerAction}</span></div>
                <div className="mx-auto h-5 w-0.5 bg-gray-300" />
                {draft.steps.map(renderStepCard)}
                <div className="flex justify-center py-2"><button type="button" disabled={draft.steps.length >= 10} onClick={addStep} className="inline-flex items-center gap-1 rounded-md border border-dashed border-indigo-400 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-300"><Plus className="h-3.5 w-3.5" />Add Step{draft.steps.length >= 10 ? ' · Limit reached' : ''}</button></div>
                <div className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700">END: Workflow Complete</div>
              </div>
              {duplicateStepIndex >= 0 && !duplicateWarningDismissed && <div className="flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 sm:flex-row sm:items-center"><p className="flex-1 text-xs text-amber-900"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />“{draft.steps[duplicateStepIndex].role}” appears in consecutive steps. The same role may review twice.</p><button type="button" onClick={() => setDuplicateWarningDismissed(true)} className="text-xs font-medium text-indigo-700 hover:underline">Yes, Keep Both</button><button type="button" onClick={() => removeStep(draft.steps[duplicateStepIndex + 1].id)} className="text-xs font-medium text-indigo-700 hover:underline">Remove Duplicate</button></div>}
            </div>}

            {drawerStep === 2 && <div className="space-y-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Step 3 · Fallback safety net</p><p className="mt-1 text-sm text-gray-500">A designated administrator receives tasks if an approver is unavailable.</p></div>
              <section className="rounded-lg border border-amber-200 bg-amber-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-amber-900"><ShieldCheck className="h-4 w-4" />Mandatory Fallback Safety Net</div><p className="mt-1 text-xs text-amber-800">This user receives tasks when an approver is unavailable or an escalation path fails.</p><div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-white p-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{draft.fallbackUser.split(' ').slice(-1)[0]?.slice(0, 1) || 'R'}</span><div><p className="text-sm font-medium text-gray-900">{draft.fallbackUser}</p><p className="text-xs text-gray-500">Super Admin</p></div></div><label className="text-xs font-medium text-indigo-700">Change<select value={draft.fallbackUser} onChange={(event) => updateDraft({ fallbackUser: event.target.value })} className="ml-2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-700"><option>Mr. Rajesh Kumar</option><option>Ms. Meera Patel</option><option>Mr. Amit Shah</option></select></label></div></section>
              <fieldset className="rounded-lg border border-gray-200 bg-gray-50 p-4"><legend className="px-1 text-xs font-semibold text-gray-700">Fallback activation triggers · always active</legend><div className="mt-1 space-y-3">{['Approver is on leave or unavailable', 'Approver role has no active members', 'SLA breach remains unresolved', 'Workflow cannot route to the assigned approver'].map((trigger) => <label key={trigger} className="flex items-start gap-2 text-xs text-gray-600"><input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 accent-indigo-600" /><span>{trigger}<em className="mt-0.5 block text-[10px] text-gray-400">Always active — cannot be disabled</em></span></label>)}</div></fieldset>
            </div>}

            {drawerStep === 3 && <div className="space-y-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Step 4 · Rules & notifications</p><p className="mt-1 text-sm text-gray-500">Set approval guardrails and choose who receives workflow updates.</p></div>
              <section className="rounded-lg border border-gray-200 p-4"><h3 className="text-sm font-semibold text-gray-800">Workflow Rules</h3><div className="mt-3 space-y-3">{([['requirePrevious', 'Require previous steps to complete before routing'], ['blockSelfApproval', 'Block initiators from approving their own request'], ['escalateOnBreach', 'Escalate automatically when an SLA is breached']] as Array<[keyof WorkflowRules, string]>).map(([key, label]) => <label key={key} className="flex items-center justify-between gap-4 text-xs text-gray-700"><span>{label}</span><button type="button" role="switch" aria-checked={draft.rules[key]} onClick={() => updateDraft({ rules: { ...draft.rules, [key]: !draft.rules[key] } })} className={`relative h-[22px] w-11 rounded-full transition ${draft.rules[key] ? 'bg-indigo-600' : 'bg-gray-300'}`}><span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${draft.rules[key] ? 'translate-x-0.5' : 'translate-x-[22px]'}`} /></button></label>)}</div></section>
              <section className="rounded-lg border border-gray-200 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-gray-800">Email Notifications</h3><p className="mt-0.5 text-xs text-gray-500">Send status and action reminders by email.</p></div><button type="button" role="switch" aria-checked={draft.emailEnabled} onClick={() => updateDraft({ emailEnabled: !draft.emailEnabled })} className={`relative h-[22px] w-11 rounded-full transition ${draft.emailEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}><span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${draft.emailEnabled ? 'translate-x-0.5' : 'translate-x-[22px]'}`} /></button></div>{draft.emailEnabled && <div className="mt-3 space-y-2 border-l-2 border-indigo-100 pl-4">{EMAIL_RECIPIENT_LABELS.map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs text-gray-700"><input type="checkbox" checked={draft.emailRecipients[key]} onChange={(event) => updateDraft({ emailRecipients: { ...draft.emailRecipients, [key]: event.target.checked } })} className="h-4 w-4 rounded border-gray-300 accent-indigo-600" />{label}</label>)}</div>}</section>
              <section className="rounded-lg border border-gray-200 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-gray-800">SMS Notifications</h3><p className="mt-0.5 text-xs text-gray-500">Text urgent approvers when an action is needed.</p></div><button type="button" role="switch" aria-checked={draft.smsEnabled} onClick={() => updateDraft({ smsEnabled: !draft.smsEnabled })} className={`relative h-[22px] w-11 rounded-full transition ${draft.smsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}><span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${draft.smsEnabled ? 'translate-x-0.5' : 'translate-x-[22px]'}`} /></button></div><p className="mt-2 text-xs italic text-gray-400">Requires SMS credits — top up in Settings.</p></section>
              {drawerErrors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 p-3"><p className="text-xs font-semibold text-red-800">Cannot publish — fix these issues first:</p><ul className="mt-1 list-inside list-disc text-xs text-red-700">{drawerErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
            </div>}
          </div>

          <footer className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-2"><button type="button" onClick={() => setDrawerOpen(false)} className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">Cancel</button><div className="flex flex-wrap gap-2"><button type="button" onClick={() => requestDrawerSave('Draft')} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Save Draft</button><button type="button" title={publishErrors.join(' ')} onClick={requestPublishFromDrawer} className={`rounded-md px-3 py-2 text-sm font-medium text-white ${validationAttempted && publishErrors.length ? 'border border-red-300 bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{validationAttempted && publishErrors.length ? 'Cannot Publish — Fix Errors First' : 'Save & Publish'}</button></div></div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400"><button type="button" disabled={drawerStep === 0} onClick={() => setDrawerStep((step) => Math.max(0, step - 1))} className="inline-flex items-center gap-1 hover:text-gray-700 disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" />Previous</button><span>Step {drawerStep + 1} of 4</span><button type="button" disabled={drawerStep === 3} onClick={() => setDrawerStep((step) => Math.min(3, step + 1))} className="inline-flex items-center gap-1 hover:text-gray-700 disabled:opacity-40">Next<ChevronRight className="h-3.5 w-3.5" /></button></div>
          </footer>
        </aside>
      </>}

      {publishWorkflow && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700"><CheckCircle2 className="h-6 w-6" /></div><h2 className="mt-3 text-center text-lg font-semibold text-gray-900">{publishWorkflow.status === 'Frozen' ? 'Unfreeze This Workflow?' : 'Publish This Workflow?'}</h2><p className="mt-2 text-center text-sm leading-relaxed text-gray-600">{publishWorkflow.status === 'Frozen' ? 'This workflow will resume routing for new requests.' : 'Publishing will make this workflow live for all assigned users immediately.'}</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setPublishWorkflow(null)} className="h-10 rounded-md border border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="button" onClick={completePublish} className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">{publishWorkflow.status === 'Frozen' ? 'Yes, Unfreeze' : 'Yes, Publish'} <ArrowRight className="ml-1 inline h-4 w-4" /></button></div></div></div>}

      {publishFromDrawer && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-6 w-6" /></div><h2 className="mt-3 text-center text-lg font-semibold text-gray-900">Publish This Workflow?</h2><p className="mt-2 text-center text-sm leading-relaxed text-gray-600">Publishing will make “{draft.name || 'this workflow'}” live for all assigned users immediately.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setPublishFromDrawer(false)} className="h-10 rounded-md border border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="button" onClick={completePublish} className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">Yes, Publish <ArrowRight className="ml-1 inline h-4 w-4" /></button></div></div></div>}

      {freezeWorkflow && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-700"><Lock className="h-6 w-6" /></div><h2 className="mt-3 text-center text-lg font-semibold text-gray-900">Why are you freezing this workflow?</h2><p className="mt-2 text-center text-sm text-gray-600">{freezeWorkflow.name} will stop routing new work until it is unfrozen.</p><textarea value={freezeReason} onChange={(event) => setFreezeReason(event.target.value)} maxLength={300} rows={3} placeholder="e.g., Exam grading cycle in progress..." className="mt-4 block w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" /><div className="mt-1 flex justify-between text-[11px] text-gray-400"><span className={freezeReason.trim().length > 0 && freezeReason.trim().length < 10 ? 'text-red-500' : ''}>Minimum 10 characters required</span><span>{freezeReason.length} / 300</span></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setFreezeWorkflow(null)} className="h-10 rounded-md border border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="button" onClick={confirmFreeze} className="h-10 rounded-md bg-sky-700 px-4 text-sm font-medium text-white hover:bg-sky-800">Freeze Workflow <Lock className="ml-1 inline h-4 w-4" /></button></div></div></div>}

      {blockedWorkflow && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600"><AlertTriangle className="h-6 w-6" /></div><h2 className="mt-3 text-center text-lg font-semibold text-gray-900">Action Blocked</h2><p className="mt-2 text-center text-sm leading-relaxed text-gray-600">Cannot revert to Draft. There are {blockedWorkflow.inProgress} tasks currently in progress in this workflow. Complete or re-route them first.</p><div className="mt-5 flex flex-wrap items-center justify-between gap-2"><button type="button" onClick={() => { setBlockedWorkflow(null); setActiveSection('Action Hub'); }} className="text-sm font-medium text-indigo-600 hover:underline">View In-Progress Tasks</button><button type="button" onClick={() => setBlockedWorkflow(null)} className="h-9 rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200">Got It</button></div></div></div>}

      {grandfatherWorkflow && <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700"><AlertTriangle className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-gray-900">Active Workflow Has In-Progress Tasks</h2><p className="mt-1 text-sm text-gray-600">There are {grandfatherWorkflow.inProgress} tasks currently in progress using V{grandfatherWorkflow.version}. Your changes will create V{grandfatherWorkflow.version + 1}.</p></div></div><p className="mt-4 text-sm font-medium text-gray-800">How should we handle the existing tasks?</p><div className="mt-3 space-y-3"><label className={`block cursor-pointer rounded-lg border-2 p-3 ${grandfatherChoice === 'new-only' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}><span className="flex items-center gap-2 text-sm font-medium text-gray-900"><input type="radio" name="grandfather-choice" checked={grandfatherChoice === 'new-only'} onChange={() => setGrandfatherChoice('new-only')} className="accent-indigo-600" />Apply V{grandfatherWorkflow.version + 1} to new tasks only (recommended)</span><span className="ml-6 mt-1 block text-xs text-gray-500">Existing tasks continue safely on V{grandfatherWorkflow.version}.</span><span className="ml-6 mt-2 inline-block rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">✓ RECOMMENDED · zero disruption</span></label><label className={`block cursor-pointer rounded-lg border p-3 ${grandfatherChoice === 'migrate-all' ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}><span className="flex items-center gap-2 text-sm font-medium text-gray-900"><input type="radio" name="grandfather-choice" checked={grandfatherChoice === 'migrate-all'} onChange={() => setGrandfatherChoice('migrate-all')} className="accent-indigo-600" />Migrate all tasks to V{grandfatherWorkflow.version + 1}</span><span className="ml-6 mt-1 block text-xs text-amber-700">This may change step assignments for {grandfatherWorkflow.inProgress} in-progress tasks.</span></label></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setGrandfatherWorkflow(null)} className="h-10 rounded-md border border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="button" onClick={confirmGrandfatheredSave} className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">Continue with V{grandfatherWorkflow.version + 1} <ArrowRight className="ml-1 inline h-4 w-4" /></button></div></div></div>}

      {versionWorkflow && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-200 px-5 py-4"><div><h2 className="font-semibold text-gray-900">Version History</h2><p className="mt-0.5 text-xs text-gray-500">{versionWorkflow.name} · Current V{versionWorkflow.version}</p></div><button type="button" onClick={() => setVersionWorkflow(null)} className="grid h-8 w-8 place-items-center rounded hover:bg-gray-100" aria-label="Close"><X className="h-4 w-4" /></button></div><div className="max-h-[65vh] overflow-y-auto p-5">{versionWorkflow.versionHistory.length === 0 ? <p className="text-sm text-gray-500">No version history yet.</p> : <div className="space-y-3">{[...versionWorkflow.versionHistory].reverse().map((version) => <div key={`${versionWorkflow.id}-${version.version}`} className="flex gap-3 rounded-lg border border-gray-200 p-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${version.version === versionWorkflow.version ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}><History className="h-4 w-4" /></span><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold text-gray-800">Version {version.version}{version.version === versionWorkflow.version && <span className="ml-2 text-[10px] font-medium text-emerald-600">CURRENT</span>}</span><span className="text-xs text-gray-400">{version.modifiedOn}</span></div><p className="mt-1 text-xs text-gray-600">{version.summary}</p><p className="mt-1 text-[11px] text-gray-400">Modified by {version.modifiedBy}</p></div></div>)}</div>}</div><div className="flex justify-end border-t border-gray-100 px-5 py-3"><button type="button" onClick={() => setVersionWorkflow(null)} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Close</button></div></div></div>}

      {previewWorkflow && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-gray-900">{previewWorkflow.name}</h2><p className="mt-1 text-xs text-gray-500">{previewWorkflow.id} · {previewWorkflow.category} · V{previewWorkflow.version}</p></div><button type="button" onClick={() => setPreviewWorkflow(null)} className="grid h-8 w-8 place-items-center rounded hover:bg-gray-100" aria-label="Close"><X className="h-4 w-4" /></button></div><div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={previewWorkflow.status} /><span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">{previewWorkflow.steps.length} steps</span><span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">{previewWorkflow.year}</span></div><p className="mt-3 text-sm leading-relaxed text-gray-600">{previewWorkflow.description || 'No description supplied.'}</p><div className="mt-4 rounded-lg bg-[#F9FAFB] p-4"><p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Approval sequence</p><div className="space-y-2">{previewWorkflow.steps.slice(0, 3).map((step, index) => <div key={step.id} className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-indigo-700 shadow-sm">{index + 1}</span><div className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2"><p className="text-sm font-medium text-gray-800">{step.role}</p><p className="text-[11px] text-gray-500">{step.action} · SLA {step.slaHours}h</p></div></div>)}{previewWorkflow.steps.length > 3 && <p className="pl-10 text-xs text-gray-500">+{previewWorkflow.steps.length - 3} more step(s)</p>}</div></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg border border-gray-200 p-3"><p className="text-gray-400">Created by</p><p className="mt-1 font-medium text-gray-800">{previewWorkflow.createdBy}</p></div><div className="rounded-lg border border-gray-200 p-3"><p className="text-gray-400">Last modified</p><p className="mt-1 font-medium text-gray-800">{previewWorkflow.modifiedOn || 'Not saved'}</p></div><div className="rounded-lg border border-gray-200 p-3"><p className="text-gray-400">Assigned scope</p><p className="mt-1 font-medium text-gray-800">{previewWorkflow.scopes.join(', ') || 'No scope'}</p></div><div className="rounded-lg border border-gray-200 p-3"><p className="text-gray-400">Tasks in progress</p><p className="mt-1 font-medium text-gray-800">{previewWorkflow.inProgress}</p></div></div><div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => changeToDraft(previewWorkflow)} disabled={previewWorkflow.status !== 'Active'} className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300">Revert to Draft</button><button type="button" onClick={() => { const workflow = previewWorkflow; setPreviewWorkflow(null); openEditor(workflow); }} disabled={previewWorkflow.status === 'Frozen'} className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"><Edit3 className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={() => setPreviewWorkflow(null)} className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">Done</button></div></div></div>}

      {deleteWorkflow && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"><div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600"><Trash2 className="h-6 w-6" /></div><h2 className="mt-3 text-center text-lg font-semibold text-gray-900">Delete workflow?</h2><p className="mt-2 text-center text-sm text-gray-600">Delete <strong>{deleteWorkflow.name}</strong> from this local workflow directory? Existing audit entries remain.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteWorkflow(null)} className="h-9 rounded-md border border-gray-200 px-4 text-sm text-gray-700">Cancel</button><button type="button" onClick={confirmDelete} className="h-9 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">Delete workflow</button></div></div></div>}

      {toast && <div role="status" className="fixed bottom-5 right-5 z-[100] flex max-w-md items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />{toast}<button type="button" onClick={() => setToast('')} aria-label="Dismiss notification" className="ml-2 text-gray-300 hover:text-white"><X className="h-3.5 w-3.5" /></button></div>}
    </main>
  );
}

export default ApprovalWorkflowBuilder;
