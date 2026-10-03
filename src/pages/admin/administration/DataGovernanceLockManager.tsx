import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  AlertTriangleIcon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  FilterIcon,
  HistoryIcon,
  InfoIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldIcon,
  TrashIcon,
  UnlockIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
  XIcon
} from 'lucide-react';

type LockStatus = 'locked' | 'open' | 'override';
type TabType = 'modules' | 'overrides' | 'persons' | 'history';
type HistoryAction =
  | 'LOCKED'
  | 'UNLOCKED'
  | 'OVERRIDE REQUESTED'
  | 'OVERRIDE GRANTED'
  | 'OVERRIDE DENIED'
  | 'OVERRIDE REVOKED'
  | 'OVERRIDE EXTENDED'
  | 'AUTO-LOCKED';
type ToastType = 'success' | 'error' | 'warning' | 'info';
type UnlockMode = 'permanent' | 'timed';
type DurationChoice = '1' | '2' | '4' | 'custom';

interface PageSeed {
  id: string;
  label: string;
  status: LockStatus;
  lockedAt?: string;
}

interface ModuleDefinition {
  id: string;
  label: string;
  heading: string;
  icon: string;
  pages: PageSeed[];
}

interface LockEntry {
  id: string;
  moduleId: string;
  moduleLabel: string;
  moduleHeading: string;
  moduleIcon: string;
  pageLabel: string;
  status: LockStatus;
  lockedAt: number | null;
  lockedBy: string;
  reason: string;
}

interface ApprovedPerson {
  id: string;
  name: string;
  role: string;
  moduleIds: string[];
  maxDurationHours: number | null;
}

interface StaffOption {
  id: string;
  name: string;
  role: string;
}

interface OverrideRequest {
  id: string;
  personId: string;
  entryId: string;
  reason: string;
  requestedAt: number;
  requestedDurationHours: number;
  status: 'pending' | 'approved' | 'denied';
}

interface ActiveOverride {
  id: string;
  entryId: string;
  moduleId: string;
  moduleLabel: string;
  pageLabel: string;
  personId: string;
  personName: string;
  personRole: string;
  reason: string;
  approvedBy: string;
  startedAt: number;
  expiresAt: number;
  durationHours: number;
}

interface LockHistoryItem {
  id: string;
  timestamp: number;
  actor: string;
  action: HistoryAction;
  entryId: string;
  moduleId: string;
  moduleLabel: string;
  pageLabel: string;
  details: string;
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface PersonFormState {
  staffId: string;
  name: string;
  role: string;
  moduleIds: string[];
  maxDurationHours: number | null;
}

const MODULES: ModuleDefinition[] = [
  {
    id: 'finance', label: 'Finance', heading: 'FINANCE MODULE', icon: '💰', pages: [
      { id: 'general-ledger', label: 'General Ledger', status: 'override', lockedAt: '2025-11-05T09:00:00' },
      { id: 'day-book', label: 'Day Book', status: 'locked', lockedAt: '2025-11-05T09:00:00' },
      { id: 'cash-book', label: 'Cash Book', status: 'locked', lockedAt: '2025-11-05T09:00:00' },
      { id: 'bank-book', label: 'Bank Book', status: 'locked', lockedAt: '2025-11-05T09:00:00' },
      { id: 'balance-sheet', label: 'Balance Sheet', status: 'locked', lockedAt: '2025-11-05T09:00:00' },
      { id: 'income-expenditure', label: 'Income & Expenditure', status: 'locked', lockedAt: '2025-11-05T09:00:00' }
    ]
  },
  {
    id: 'fees', label: 'Fee', heading: 'FEE MODULE', icon: '💸', pages: [
      { id: 'fee-collection', label: 'Fee Collection', status: 'open' },
      { id: 'fee-receipts', label: 'Fee Receipts', status: 'open' },
      { id: 'fee-concessions', label: 'Fee Concessions', status: 'locked', lockedAt: '2025-11-01T11:00:00' },
      { id: 'refunds', label: 'Refunds', status: 'open' }
    ]
  },
  {
    id: 'payroll', label: 'Payroll', heading: 'PAYROLL MODULE', icon: '👩‍🏫', pages: [
      { id: 'monthly-payroll', label: 'Monthly Payroll', status: 'override', lockedAt: '2025-11-07T09:00:00' },
      { id: 'salary-slips', label: 'Salary Slips', status: 'locked', lockedAt: '2025-11-07T09:00:00' },
      { id: 'salary-structure', label: 'Salary Structure', status: 'open' }
    ]
  },
  {
    id: 'attendance', label: 'Attendance', heading: 'ATTENDANCE MODULE', icon: '🕐', pages: [
      { id: 'employee-attendance', label: 'Employee Attendance', status: 'locked', lockedAt: '2025-11-05T09:00:00' },
      { id: 'student-attendance', label: 'Student Attendance', status: 'open' }
    ]
  },
  {
    id: 'examination', label: 'Examination', heading: 'EXAMINATION MODULE', icon: '📝', pages: [
      { id: 'marks-entry', label: 'Marks Entry', status: 'open' },
      { id: 'report-cards', label: 'Report Cards', status: 'locked', lockedAt: '2025-10-20T16:00:00' },
      { id: 'results-promotions', label: 'Results & Promotions', status: 'locked', lockedAt: '2025-10-20T16:00:00' }
    ]
  },
  {
    id: 'scholarship', label: 'Scholarship', heading: 'SCHOLARSHIP MODULE', icon: '🎓', pages: [
      { id: 'scholarship-applications', label: 'Scholarship Applications', status: 'open' },
      { id: 'disbursements', label: 'Disbursements', status: 'open' }
    ]
  },
  {
    id: 'expense', label: 'Expense', heading: 'EXPENSE MODULE', icon: '🧾', pages: [
      { id: 'vendor-bills', label: 'Vendor Bills', status: 'open' },
      { id: 'vendor-payments', label: 'Vendor Payments', status: 'locked', lockedAt: '2025-11-10T10:00:00' },
      { id: 'purchase-orders', label: 'Purchase Orders', status: 'open' }
    ]
  },
  {
    id: 'student-master', label: 'Student Master', heading: 'STUDENT MASTER', icon: '👤', pages: [
      { id: 'student-records', label: 'Student Records', status: 'open' },
      { id: 'tc-migration', label: 'TC / Migration', status: 'open' }
    ]
  },
  {
    id: 'hr', label: 'Staff / HR', heading: 'STAFF / HR MODULE', icon: '👩‍🏫', pages: [
      { id: 'staff-records', label: 'Staff Records', status: 'open' },
      { id: 'leave-management', label: 'Leave Management', status: 'open' }
    ]
  },
  {
    id: 'archive', label: 'Archive', heading: 'ARCHIVE MODULE', icon: '🗄️', pages: [
      { id: 'archive-management', label: 'Archive Management', status: 'open' },
      { id: 'cold-storage', label: 'Cold Storage', status: 'open' }
    ]
  }
];

const ALL_MODULE_IDS = MODULES.map((module) => module.id);

const INITIAL_LOCK_ENTRIES: LockEntry[] = MODULES.flatMap((module) =>
  module.pages.map((page) => ({
    id: page.id,
    moduleId: module.id,
    moduleLabel: module.label,
    moduleHeading: module.heading,
    moduleIcon: module.icon,
    pageLabel: page.label,
    status: page.status,
    lockedAt: page.lockedAt ? new Date(page.lockedAt).getTime() : null,
    lockedBy: page.status === 'open' ? '' : 'Super Admin',
    reason: page.status === 'open' ? '' : 'Period close / administrative lock'
  }))
);

const INITIAL_APPROVED_PERSONS: ApprovedPerson[] = [
  { id: 'person-priya', name: 'Mrs. Priya Gupta', role: 'Finance Manager', moduleIds: ['finance', 'fees', 'payroll', 'expense'], maxDurationHours: 4 },
  { id: 'person-ramesh', name: 'Mr. Ramesh Sharma', role: 'Accountant', moduleIds: ['finance', 'fees'], maxDurationHours: 2 },
  { id: 'person-sunita', name: 'Ms. Sunita Joshi', role: 'HR Manager', moduleIds: ['payroll', 'attendance', 'hr'], maxDurationHours: 4 },
  { id: 'person-vijay', name: 'Mr. Vijay Patel', role: 'Exam Controller', moduleIds: ['examination'], maxDurationHours: 2 },
  { id: 'person-principal', name: 'Mr. A. Sharma', role: 'Principal', moduleIds: ALL_MODULE_IDS, maxDurationHours: null }
];

const STAFF_DIRECTORY: StaffOption[] = [
  ...INITIAL_APPROVED_PERSONS.map(({ id, name, role }) => ({ id, name, role })),
  { id: 'staff-nisha', name: 'Ms. Nisha Mehta', role: 'Teacher' },
  { id: 'staff-arjun', name: 'Mr. Arjun Shah', role: 'Teacher' },
  { id: 'staff-kavita', name: 'Mrs. Kavita Desai', role: 'Office Administrator' }
];

const createInitialActiveOverrides = (): ActiveOverride[] => {
  const now = Date.now();
  return [
    {
      id: 'override-ledger-priya', entryId: 'general-ledger', moduleId: 'finance', moduleLabel: 'Finance', pageLabel: 'General Ledger',
      personId: 'person-priya', personName: 'Mrs. Priya Gupta', personRole: 'Finance Manager',
      reason: 'Wrong entry in JV-2025-089 — amount needs correction', approvedBy: 'Super Admin',
      startedAt: now - 37 * 60 * 1000, expiresAt: now + 83 * 60 * 1000, durationHours: 2
    },
    {
      id: 'override-payroll-sunita', entryId: 'monthly-payroll', moduleId: 'payroll', moduleLabel: 'Payroll', pageLabel: 'Monthly Payroll',
      personId: 'person-sunita', personName: 'Ms. Sunita Joshi', personRole: 'HR Manager',
      reason: 'Salary revision missed for two staff members', approvedBy: 'Super Admin',
      startedAt: now - 22 * 60 * 1000, expiresAt: now + 38 * 60 * 1000, durationHours: 1
    }
  ];
};

const createInitialRequests = (): OverrideRequest[] => [{
  id: 'request-fee-concession', personId: 'person-ramesh', entryId: 'fee-concessions',
  reason: 'A concession was applied to the wrong fee category and needs correction.',
  requestedAt: Date.now() - 12 * 60 * 1000, requestedDurationHours: 2, status: 'pending'
}];

const createInitialHistory = (): LockHistoryItem[] => {
  const now = Date.now();
  return [
    { id: 'history-1', timestamp: Date.parse('2025-11-27T16:15:00'), actor: 'System (Auto)', action: 'AUTO-LOCKED', entryId: 'general-ledger', moduleId: 'finance', moduleLabel: 'Finance', pageLabel: 'General Ledger', details: 'A previous two-hour override expired; the page was locked automatically.' },
    { id: 'history-2', timestamp: Date.parse('2025-11-07T09:00:00'), actor: 'Super Admin', action: 'LOCKED', entryId: 'monthly-payroll', moduleId: 'payroll', moduleLabel: 'Payroll', pageLabel: 'Monthly Payroll', details: 'Monthly payroll was locked after processing.' },
    { id: 'history-3', timestamp: Date.parse('2025-11-05T09:00:00'), actor: 'Super Admin', action: 'LOCKED', entryId: 'general-ledger', moduleId: 'finance', moduleLabel: 'Finance', pageLabel: 'General Ledger', details: 'October month-end closing.' },
    { id: 'history-4', timestamp: Date.parse('2025-11-01T14:00:00'), actor: 'Super Admin', action: 'OVERRIDE DENIED', entryId: 'general-ledger', moduleId: 'finance', moduleLabel: 'Finance', pageLabel: 'General Ledger', details: 'Request denied because the requestor was not approved for Finance.' },
    { id: 'history-5', timestamp: Date.parse('2025-10-20T16:00:00'), actor: 'Super Admin', action: 'LOCKED', entryId: 'report-cards', moduleId: 'examination', moduleLabel: 'Examination', pageLabel: 'Report Cards', details: 'Report cards were issued to students.' },
    { id: 'history-6', timestamp: now - 37 * 60 * 1000, actor: 'Super Admin', action: 'OVERRIDE GRANTED', entryId: 'general-ledger', moduleId: 'finance', moduleLabel: 'Finance', pageLabel: 'General Ledger', details: 'Two-hour timed override granted to Mrs. Priya Gupta.' },
    { id: 'history-7', timestamp: now - 22 * 60 * 1000, actor: 'Super Admin', action: 'OVERRIDE GRANTED', entryId: 'monthly-payroll', moduleId: 'payroll', moduleLabel: 'Payroll', pageLabel: 'Monthly Payroll', details: 'One-hour timed override granted to Ms. Sunita Joshi.' },
    { id: 'history-8', timestamp: now - 12 * 60 * 1000, actor: 'Mr. Ramesh Sharma', action: 'OVERRIDE REQUESTED', entryId: 'fee-concessions', moduleId: 'fees', moduleLabel: 'Fee', pageLabel: 'Fee Concessions', details: 'A concession was applied to the wrong fee category and needs correction.' }
  ];
};

const HISTORY_ACTIONS: HistoryAction[] = [
  'LOCKED', 'UNLOCKED', 'OVERRIDE REQUESTED', 'OVERRIDE GRANTED',
  'OVERRIDE DENIED', 'OVERRIDE REVOKED', 'OVERRIDE EXTENDED', 'AUTO-LOCKED'
];

function formatDate(timestamp: number | null): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function formatCountdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function getStatusLabel(status: LockStatus): string {
  if (status === 'locked') return 'Locked';
  if (status === 'override') return 'Override active';
  return 'Open';
}

function getStatusVariant(status: LockStatus): 'danger' | 'success' | 'warning' {
  if (status === 'locked') return 'danger';
  if (status === 'override') return 'warning';
  return 'success';
}

function getPersonScope(person: ApprovedPerson): string {
  if (person.moduleIds.length === MODULES.length) return 'All modules';
  return person.moduleIds
    .map((id) => MODULES.find((module) => module.id === id)?.label)
    .filter(Boolean)
    .join(', ');
}

function getEntryForHistory(entries: LockEntry[], entryId: string): LockEntry | undefined {
  return entries.find((entry) => entry.id === entryId);
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>): void {
  const csv = rows
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

function SummaryCard({
  title, value, description, icon, tone, onClick
}: {
  title: string; value: number; description: string; icon: React.ReactNode;
  tone: 'red' | 'green' | 'orange' | 'amber' | 'blue'; onClick: () => void;
}) {
  const tones = {
    red: 'border-red-200 bg-red-50 text-red-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700'
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tones[tone]}`}>
          {icon}
        </span>
      </div>
    </button>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function DataGovernanceLockManager() {
  const [entries, setEntries] = useState<LockEntry[]>(INITIAL_LOCK_ENTRIES);
  const [approvedPersons, setApprovedPersons] = useState<ApprovedPerson[]>(INITIAL_APPROVED_PERSONS);
  const [requests, setRequests] = useState<OverrideRequest[]>(createInitialRequests);
  const [activeOverrides, setActiveOverrides] = useState<ActiveOverride[]>(createInitialActiveOverrides);
  const [history, setHistory] = useState<LockHistoryItem[]>(createInitialHistory);
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2025-26');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LockStatus>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyActionFilter, setHistoryActionFilter] = useState('all');
  const [historyModuleFilter, setHistoryModuleFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyEntryFilter, setHistoryEntryFilter] = useState('');

  const [selectedEntry, setSelectedEntry] = useState<LockEntry | null>(null);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryAction, setEntryAction] = useState<'lock' | 'unlock'>('lock');
  const [lockReason, setLockReason] = useState('');
  const [unlockReason, setUnlockReason] = useState('');
  const [unlockMode, setUnlockMode] = useState<UnlockMode>('permanent');
  const [selectedOverridePersonId, setSelectedOverridePersonId] = useState('');
  const [durationChoice, setDurationChoice] = useState<DurationChoice>('2');
  const [customDuration, setCustomDuration] = useState('3');

  const [requestHours, setRequestHours] = useState<Record<string, number>>({});
  const [overrideRequestModalOpen, setOverrideRequestModalOpen] = useState(false);
  const [overrideRequestForm, setOverrideRequestForm] = useState({ personId: '', entryId: '', reason: '', durationHours: '2' });
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [personForm, setPersonForm] = useState<PersonFormState>({
    staffId: '', name: '', role: '', moduleIds: [], maxDurationHours: 2
  });
  const [personToRemove, setPersonToRemove] = useState<ApprovedPerson | null>(null);
  const [globalAction, setGlobalAction] = useState<'lock' | 'unlock' | null>(null);

  const expiryHandledRef = useRef<Set<string>>(new Set());

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((previous) => [...previous, { id, type, message }].slice(-4));
    window.setTimeout(() => setToasts((previous) => previous.filter((toast) => toast.id !== id)), 4500);
  }, []);

  const pushHistory = useCallback((items: Omit<LockHistoryItem, 'id'>[]) => {
    if (items.length === 0) return;
    const withIds = items.map((item, index) => ({
      ...item,
      id: `audit-${item.timestamp}-${index}-${Math.random().toString(36).slice(2, 7)}`
    }));
    setHistory((previous) => [...withIds, ...previous].slice(0, 1000));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const expired = activeOverrides.filter(
      (override) => override.expiresAt <= currentTime && !expiryHandledRef.current.has(override.id)
    );
    if (expired.length === 0) return;

    expired.forEach((override) => expiryHandledRef.current.add(override.id));
    const expiredIds = new Set(expired.map((override) => override.id));
    const expiredEntryIds = new Set(expired.map((override) => override.entryId));
    setActiveOverrides((previous) => previous.filter((override) => !expiredIds.has(override.id)));
    setEntries((previous) => previous.map((entry) =>
      expiredEntryIds.has(entry.id) && entry.status === 'override'
        ? { ...entry, status: 'locked' }
        : entry
    ));
    pushHistory(expired.map((override) => ({
      timestamp: currentTime,
      actor: 'System (Auto)',
      action: 'AUTO-LOCKED' as const,
      entryId: override.entryId,
      moduleId: override.moduleId,
      moduleLabel: override.moduleLabel,
      pageLabel: override.pageLabel,
      details: `${override.personName}'s ${override.durationHours}-hour override expired; the page automatically returned to locked state.`
    })));
    expired.forEach((override) => addToast('info', `${override.pageLabel} automatically locked after the override expired.`));
  }, [activeOverrides, currentTime, pushHistory, addToast]);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === 'pending'),
    [requests]
  );

  useEffect(() => {
    const unauthorized = requests.filter((request) => {
      if (request.status !== 'pending') return false;
      const person = approvedPersons.find((item) => item.id === request.personId);
      const entry = entries.find((item) => item.id === request.entryId);
      return !person || !entry || !person.moduleIds.includes(entry.moduleId);
    });
    if (unauthorized.length === 0) return;

    const timestamp = Date.now();
    const unauthorizedIds = new Set(unauthorized.map((request) => request.id));
    setRequests((previous) => previous.map((request) => unauthorizedIds.has(request.id)
      ? { ...request, status: 'denied' }
      : request
    ));
    pushHistory(unauthorized.flatMap((request) => {
      const entry = entries.find((item) => item.id === request.entryId);
      return entry ? [{
        timestamp,
        actor: 'System (Auto)',
        action: 'OVERRIDE DENIED' as const,
        entryId: entry.id,
        moduleId: entry.moduleId,
        moduleLabel: entry.moduleLabel,
        pageLabel: entry.pageLabel,
        details: 'Request automatically denied because the requestor is not approved for this module.'
      }] : [];
    }));
    unauthorized.forEach(() => addToast('warning', 'An override request was automatically denied because the person is not approved for that module.'));
  }, [requests, approvedPersons, entries, pushHistory, addToast]);

  const lockedCount = entries.filter((entry) => entry.status === 'locked').length;
  const openCount = entries.filter((entry) => entry.status === 'open').length;
  const notificationCount = pendingRequests.length + activeOverrides.length;

  const filteredEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesQuery = !query || [entry.moduleLabel, entry.pageLabel, entry.moduleHeading]
        .some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [entries, searchTerm, statusFilter]);

  const groupedEntries = useMemo(() => MODULES.map((module) => ({
    ...module,
    entries: filteredEntries.filter((entry) => entry.moduleId === module.id)
  })).filter((module) => module.entries.length > 0), [filteredEntries]);

  const filteredHistory = useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    const from = historyDateFrom ? new Date(`${historyDateFrom}T00:00:00`).getTime() : null;
    const to = historyDateTo ? new Date(`${historyDateTo}T23:59:59`).getTime() : null;
    return history.filter((item) => {
      const matchesAction = historyActionFilter === 'all' || item.action === historyActionFilter;
      const matchesModule = historyModuleFilter === 'all' || item.moduleId === historyModuleFilter;
      const matchesDateFrom = from === null || item.timestamp >= from;
      const matchesDateTo = to === null || item.timestamp <= to;
      const matchesEntry = !historyEntryFilter || item.entryId === historyEntryFilter;
      const matchesQuery = !query || [item.actor, item.moduleLabel, item.pageLabel, item.details, item.action]
        .some((value) => value.toLowerCase().includes(query));
      return matchesAction && matchesModule && matchesDateFrom && matchesDateTo && matchesEntry && matchesQuery;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [history, historyActionFilter, historyModuleFilter, historySearch, historyDateFrom, historyDateTo, historyEntryFilter]);

  const selectedEntryForModal = selectedEntry
    ? entries.find((entry) => entry.id === selectedEntry.id) || selectedEntry
    : null;
  const eligiblePeople = selectedEntryForModal
    ? approvedPersons.filter((person) => person.moduleIds.includes(selectedEntryForModal.moduleId))
    : [];
  const selectedOverridePerson = eligiblePeople.find((person) => person.id === selectedOverridePersonId) || null;
  const chosenDurationHours = durationChoice === 'custom' ? Number(customDuration) : Number(durationChoice);
  const selectedDurationIsValid = Boolean(
    selectedOverridePerson &&
    Number.isFinite(chosenDurationHours) &&
    chosenDurationHours >= 1 &&
    chosenDurationHours <= 24 &&
    (selectedOverridePerson.maxDurationHours === null || chosenDurationHours <= selectedOverridePerson.maxDurationHours)
  );

  const requestFormPerson = approvedPersons.find((person) => person.id === overrideRequestForm.personId) || null;
  const requestableEntries = requestFormPerson
    ? entries.filter((entry) => entry.status === 'locked' && requestFormPerson.moduleIds.includes(entry.moduleId))
    : [];
  const requestFormDuration = Number(overrideRequestForm.durationHours);
  const requestFormDurationLimit = requestFormPerson?.maxDurationHours ?? 24;
  const requestFormDurationIsValid = Boolean(
    requestFormPerson && Number.isFinite(requestFormDuration) && requestFormDuration >= 1 &&
    requestFormDuration <= 24 && (requestFormPerson.maxDurationHours === null || requestFormDuration <= requestFormDurationLimit)
  );

  const createHistoryItemsForEntries = (
    affectedEntries: LockEntry[],
    action: HistoryAction,
    actor: string,
    details: (entry: LockEntry) => string,
    timestamp = Date.now()
  ): Omit<LockHistoryItem, 'id'>[] => affectedEntries.map((entry) => ({
    timestamp,
    actor,
    action,
    entryId: entry.id,
    moduleId: entry.moduleId,
    moduleLabel: entry.moduleLabel,
    pageLabel: entry.pageLabel,
    details: details(entry)
  }));

  const startTimedOverride = (
    entry: LockEntry,
    person: ApprovedPerson,
    reason: string,
    hours: number,
    actor: string
  ) => {
    const startedAt = Date.now();
    const existing = activeOverrides.filter((override) => override.entryId === entry.id);
    const replacementEvents = existing.map((override) => ({
      timestamp: startedAt,
      actor,
      action: 'OVERRIDE REVOKED' as const,
      entryId: override.entryId,
      moduleId: override.moduleId,
      moduleLabel: override.moduleLabel,
      pageLabel: override.pageLabel,
      details: `Previous override for ${override.personName} was replaced by a new timed override.`
    }));
    const activeOverride: ActiveOverride = {
      id: `override-${entry.id}-${startedAt}`,
      entryId: entry.id,
      moduleId: entry.moduleId,
      moduleLabel: entry.moduleLabel,
      pageLabel: entry.pageLabel,
      personId: person.id,
      personName: person.name,
      personRole: person.role,
      reason,
      approvedBy: actor,
      startedAt,
      expiresAt: startedAt + hours * 60 * 60 * 1000,
      durationHours: hours
    };
    setActiveOverrides((previous) => [
      ...previous.filter((override) => override.entryId !== entry.id),
      activeOverride
    ]);
    setEntries((previous) => previous.map((item) => item.id === entry.id
      ? { ...item, status: 'override', lockedAt: item.lockedAt || startedAt, lockedBy: actor, reason }
      : item
    ));
    pushHistory([
      ...replacementEvents,
      {
        timestamp: startedAt,
        actor,
        action: 'OVERRIDE GRANTED',
        entryId: entry.id,
        moduleId: entry.moduleId,
        moduleLabel: entry.moduleLabel,
        pageLabel: entry.pageLabel,
        details: `${hours}-hour timed override granted to ${person.name}. Reason: ${reason}`
      }
    ]);
    addToast('success', `${person.name} now has ${hours} hour${hours === 1 ? '' : 's'} of access to ${entry.pageLabel}.`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentTime(Date.now());
    window.setTimeout(() => {
      setIsRefreshing(false);
      addToast('success', 'Lock status and countdowns refreshed.');
    }, 450);
  };

  const exportHistory = (items: LockHistoryItem[] = history) => {
    downloadCsv(`lock-history-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Date & Time', 'Who', 'Action', 'Module', 'Page', 'Details'],
      ...items.map((item) => [formatDateTime(item.timestamp), item.actor, item.action, item.moduleLabel, item.pageLabel, item.details])
    ]);
    addToast('success', 'Lock history exported as CSV.');
  };

  const exportPeople = () => {
    downloadCsv(`approved-override-persons-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Person', 'Role', 'Can Override', 'Maximum Duration'],
      ...approvedPersons.map((person) => [
        person.name,
        person.role,
        getPersonScope(person),
        person.maxDurationHours === null ? 'No limit' : `${person.maxDurationHours} hour(s)`
      ])
    ]);
    addToast('success', 'Approved override persons exported as CSV.');
  };

  const openOverrideRequestDialog = () => {
    const person = approvedPersons.find((candidate) => entries.some((entry) => entry.status === 'locked' && candidate.moduleIds.includes(entry.moduleId)));
    const firstEntry = person ? entries.find((entry) => entry.status === 'locked' && person.moduleIds.includes(entry.moduleId)) : undefined;
    const suggestedHours = person?.maxDurationHours !== null && person?.maxDurationHours !== undefined
      ? Math.min(2, person.maxDurationHours)
      : 2;
    setOverrideRequestForm({ personId: person?.id || '', entryId: firstEntry?.id || '', reason: '', durationHours: String(suggestedHours) });
    setOverrideRequestModalOpen(true);
  };

  const changeRequestPerson = (personId: string) => {
    const person = approvedPersons.find((candidate) => candidate.id === personId);
    const firstEntry = person ? entries.find((entry) => entry.status === 'locked' && person.moduleIds.includes(entry.moduleId)) : undefined;
    const suggestedHours = person?.maxDurationHours !== null && person?.maxDurationHours !== undefined
      ? Math.min(2, person.maxDurationHours)
      : 2;
    setOverrideRequestForm((previous) => ({
      ...previous,
      personId,
      entryId: firstEntry?.id || '',
      durationHours: String(suggestedHours)
    }));
  };

  const createOverrideRequest = () => {
    const person = approvedPersons.find((candidate) => candidate.id === overrideRequestForm.personId);
    const entry = entries.find((candidate) => candidate.id === overrideRequestForm.entryId);
    if (!person || !entry || entry.status !== 'locked' || !person.moduleIds.includes(entry.moduleId)) {
      addToast('error', 'Choose a locked page within the requestor’s approved module scope.');
      return;
    }
    if (overrideRequestForm.reason.trim().length < 10) {
      addToast('error', 'Add a reason of at least 10 characters.');
      return;
    }
    if (!requestFormDurationIsValid) {
      addToast('error', 'Choose a duration within the requestor’s approved maximum.');
      return;
    }
    if (requests.some((request) => request.status === 'pending' && request.personId === person.id && request.entryId === entry.id)) {
      addToast('warning', 'A pending request already exists for this person and page.');
      return;
    }

    const timestamp = Date.now();
    const request: OverrideRequest = {
      id: `request-${timestamp}`,
      personId: person.id,
      entryId: entry.id,
      reason: overrideRequestForm.reason.trim(),
      requestedAt: timestamp,
      requestedDurationHours: requestFormDuration,
      status: 'pending'
    };
    setRequests((previous) => [request, ...previous]);
    pushHistory([{
      timestamp,
      actor: person.name,
      action: 'OVERRIDE REQUESTED',
      entryId: entry.id,
      moduleId: entry.moduleId,
      moduleLabel: entry.moduleLabel,
      pageLabel: entry.pageLabel,
      details: `${requestFormDuration}-hour lock override requested. Reason: ${request.reason}`
    }]);
    setOverrideRequestModalOpen(false);
    setActiveTab('overrides');
    addToast('success', 'Override request submitted for Super Admin review.');
  };

  const openEntryAction = (entry: LockEntry, action: 'lock' | 'unlock') => {
    setSelectedEntry(entry);
    setEntryAction(action);
    setLockReason('');
    setUnlockReason('');
    setUnlockMode('permanent');
    const eligible = approvedPersons.filter((person) => person.moduleIds.includes(entry.moduleId));
    setSelectedOverridePersonId(eligible[0]?.id || '');
    setDurationChoice('2');
    setCustomDuration('3');
    setEntryModalOpen(true);
  };

  const closeEntryModal = () => {
    setEntryModalOpen(false);
    setSelectedEntry(null);
    setLockReason('');
    setUnlockReason('');
  };

  const confirmEntryAction = () => {
    if (!selectedEntryForModal) return;
    const entry = selectedEntryForModal;
    const timestamp = Date.now();

    if (entryAction === 'lock') {
      if (entry.status === 'locked') {
        closeEntryModal();
        return;
      }
      const displacedOverrides = activeOverrides.filter((override) => override.entryId === entry.id);
      setActiveOverrides((previous) => previous.filter((override) => override.entryId !== entry.id));
      setEntries((previous) => previous.map((item) => item.id === entry.id
        ? { ...item, status: 'locked', lockedAt: timestamp, lockedBy: 'Super Admin', reason: lockReason.trim() }
        : item
      ));
      pushHistory([
        ...displacedOverrides.map((override) => ({
          timestamp,
          actor: 'Super Admin',
          action: 'OVERRIDE REVOKED' as const,
          entryId: override.entryId,
          moduleId: override.moduleId,
          moduleLabel: override.moduleLabel,
          pageLabel: override.pageLabel,
          details: `Override for ${override.personName} ended when the page was locked.`
        })),
        {
          timestamp, actor: 'Super Admin', action: 'LOCKED', entryId: entry.id,
          moduleId: entry.moduleId, moduleLabel: entry.moduleLabel, pageLabel: entry.pageLabel,
          details: lockReason.trim() || 'Locked by Super Admin.'
        }
      ]);
      addToast('success', `${entry.pageLabel} is locked. View, export, and print remain available.`);
      closeEntryModal();
      return;
    }

    if (!unlockReason.trim()) {
      addToast('error', 'Enter a reason before unlocking or granting an override.');
      return;
    }

    if (unlockMode === 'permanent') {
      const displacedOverrides = activeOverrides.filter((override) => override.entryId === entry.id);
      setActiveOverrides((previous) => previous.filter((override) => override.entryId !== entry.id));
      setEntries((previous) => previous.map((item) => item.id === entry.id
        ? { ...item, status: 'open', lockedAt: null, lockedBy: '', reason: unlockReason.trim() }
        : item
      ));
      pushHistory([
        ...displacedOverrides.map((override) => ({
          timestamp,
          actor: 'Super Admin',
          action: 'OVERRIDE REVOKED' as const,
          entryId: override.entryId,
          moduleId: override.moduleId,
          moduleLabel: override.moduleLabel,
          pageLabel: override.pageLabel,
          details: `Override for ${override.personName} ended by permanent unlock.`
        })),
        {
          timestamp, actor: 'Super Admin', action: 'UNLOCKED', entryId: entry.id,
          moduleId: entry.moduleId, moduleLabel: entry.moduleLabel, pageLabel: entry.pageLabel,
          details: `Permanently unlocked for everyone. Reason: ${unlockReason.trim()}`
        }
      ]);
      addToast('success', `${entry.pageLabel} is permanently open for everyone.`);
      closeEntryModal();
      return;
    }

    if (!selectedOverridePerson || !selectedDurationIsValid) {
      addToast('error', 'Select an approved person and a duration within their allowed limit.');
      return;
    }
    startTimedOverride(entry, selectedOverridePerson, unlockReason.trim(), chosenDurationHours, 'Super Admin');
    closeEntryModal();
  };

  const setEntriesBulk = (action: 'lock' | 'unlock', ids: string[]) => {
    const idSet = new Set(ids);
    const changed = entries.filter((entry) => idSet.has(entry.id) && (
      action === 'lock' ? entry.status !== 'locked' : entry.status !== 'open'
    ));
    if (changed.length === 0) {
      addToast('info', action === 'lock' ? 'The selected pages are already locked.' : 'The selected pages are already open.');
      return;
    }
    const timestamp = Date.now();
    const changedIds = new Set(changed.map((entry) => entry.id));
    const affectedOverrides = activeOverrides.filter((override) => changedIds.has(override.entryId));
    setActiveOverrides((previous) => previous.filter((override) => !changedIds.has(override.entryId)));
    setEntries((previous) => previous.map((entry) => {
      if (!changedIds.has(entry.id)) return entry;
      return action === 'lock'
        ? { ...entry, status: 'locked', lockedAt: timestamp, lockedBy: 'Super Admin', reason: 'Bulk lock by Super Admin.' }
        : { ...entry, status: 'open', lockedAt: null, lockedBy: '', reason: 'Bulk permanent unlock by Super Admin.' };
    }));
    const overrideEvents = affectedOverrides.map((override) => ({
      timestamp,
      actor: 'Super Admin',
      action: 'OVERRIDE REVOKED' as const,
      entryId: override.entryId,
      moduleId: override.moduleId,
      moduleLabel: override.moduleLabel,
      pageLabel: override.pageLabel,
      details: `Override for ${override.personName} ended by bulk ${action}.`
    }));
    pushHistory([
      ...overrideEvents,
      ...createHistoryItemsForEntries(
        changed,
        action === 'lock' ? 'LOCKED' : 'UNLOCKED',
        'Super Admin',
        (entry) => action === 'lock' ? 'Bulk lock by Super Admin.' : 'Bulk permanent unlock by Super Admin.',
        timestamp
      )
    ]);
    setSelectedIds((previous) => previous.filter((id) => !changedIds.has(id)));
    addToast('success', `${changed.length} page${changed.length === 1 ? '' : 's'} ${action === 'lock' ? 'locked' : 'permanently unlocked'}.`);
  };

  const handleGlobalAction = () => {
    if (!globalAction) return;
    const action = globalAction;
    setGlobalAction(null);
    setEntriesBulk(action, entries.map((entry) => entry.id));
    setSelectedIds([]);
  };

  const revokeOverride = (override: ActiveOverride) => {
    const timestamp = Date.now();
    setActiveOverrides((previous) => previous.filter((item) => item.id !== override.id));
    setEntries((previous) => previous.map((entry) => entry.id === override.entryId && entry.status === 'override'
      ? { ...entry, status: 'locked' }
      : entry
    ));
    pushHistory([{
      timestamp, actor: 'Super Admin', action: 'OVERRIDE REVOKED', entryId: override.entryId,
      moduleId: override.moduleId, moduleLabel: override.moduleLabel, pageLabel: override.pageLabel,
      details: `Timed override for ${override.personName} was revoked before expiry.`
    }]);
    addToast('warning', `${override.pageLabel} was locked immediately and the override was revoked.`);
  };

  const extendOverride = (override: ActiveOverride) => {
    const person = approvedPersons.find((item) => item.id === override.personId);
    const nextDuration = override.durationHours + 1;
    if (person?.maxDurationHours !== null && person?.maxDurationHours !== undefined && nextDuration > person.maxDurationHours) {
      addToast('error', 'This extension would exceed the person’s approved maximum duration.');
      return;
    }
    if (nextDuration > 24) {
      addToast('error', 'A timed override cannot exceed 24 hours in this demo.');
      return;
    }
    const timestamp = Date.now();
    setActiveOverrides((previous) => previous.map((item) => item.id === override.id
      ? { ...item, expiresAt: item.expiresAt + 60 * 60 * 1000, durationHours: nextDuration }
      : item
    ));
    pushHistory([{
      timestamp, actor: 'Super Admin', action: 'OVERRIDE EXTENDED', entryId: override.entryId,
      moduleId: override.moduleId, moduleLabel: override.moduleLabel, pageLabel: override.pageLabel,
      details: `Override for ${override.personName} was extended by one hour; total duration is now ${nextDuration} hour${nextDuration === 1 ? '' : 's'}.`
    }]);
    addToast('success', `One hour added to ${override.personName}’s override.`);
  };

  const approveRequest = (request: OverrideRequest) => {
    const person = approvedPersons.find((item) => item.id === request.personId);
    const entry = getEntryForHistory(entries, request.entryId);
    if (!person || !entry || !person.moduleIds.includes(entry.moduleId)) {
      const timestamp = Date.now();
      setRequests((previous) => previous.map((item) => item.id === request.id ? { ...item, status: 'denied' } : item));
      if (entry) pushHistory([{
        timestamp, actor: 'Super Admin', action: 'OVERRIDE DENIED', entryId: entry.id,
        moduleId: entry.moduleId, moduleLabel: entry.moduleLabel, pageLabel: entry.pageLabel,
        details: `${person?.name || 'Requestor'} was not on the approved override list for ${entry.moduleLabel}. Request automatically denied.`
      }]);
      addToast('error', 'Request denied: the person is not approved for this module.');
      return;
    }
    if (entry.status !== 'locked') {
      addToast('warning', 'This page is no longer in a locked state; review the request before approving.');
      return;
    }
    const hours = requestHours[request.id] ?? request.requestedDurationHours;
    if (!Number.isFinite(hours) || hours < 1 || hours > 24 || (person.maxDurationHours !== null && hours > person.maxDurationHours)) {
      addToast('error', 'Choose a duration within the person’s approved maximum.');
      return;
    }
    setRequests((previous) => previous.map((item) => item.id === request.id ? { ...item, status: 'approved' } : item));
    startTimedOverride(entry, person, request.reason, hours, 'Super Admin');
  };

  const denyRequest = (request: OverrideRequest) => {
    const entry = getEntryForHistory(entries, request.entryId);
    const timestamp = Date.now();
    setRequests((previous) => previous.map((item) => item.id === request.id ? { ...item, status: 'denied' } : item));
    if (entry) pushHistory([{
      timestamp, actor: 'Super Admin', action: 'OVERRIDE DENIED', entryId: entry.id,
      moduleId: entry.moduleId, moduleLabel: entry.moduleLabel, pageLabel: entry.pageLabel,
      details: `Override request from ${approvedPersons.find((person) => person.id === request.personId)?.name || 'unknown requestor'} denied. Reason provided: ${request.reason}`
    }]);
    addToast('info', 'Override request denied.');
  };

  const openPersonDialog = (person?: ApprovedPerson) => {
    if (person) {
      setEditingPersonId(person.id);
      setPersonForm({
        staffId: person.id, name: person.name, role: person.role,
        moduleIds: [...person.moduleIds], maxDurationHours: person.maxDurationHours
      });
    } else {
      setEditingPersonId(null);
      setPersonForm({ staffId: '', name: '', role: '', moduleIds: [], maxDurationHours: 2 });
    }
    setPersonModalOpen(true);
  };

  const closePersonDialog = () => {
    setPersonModalOpen(false);
    setEditingPersonId(null);
  };

  const savePerson = () => {
    if (!personForm.staffId || !personForm.moduleIds.length) {
      addToast('error', 'Select a staff member and at least one module.');
      return;
    }
    const duplicate = approvedPersons.some((person) => person.id === personForm.staffId && person.id !== editingPersonId);
    if (duplicate) {
      addToast('error', 'This person is already on the approved override list.');
      return;
    }
    const staff = STAFF_DIRECTORY.find((item) => item.id === personForm.staffId);
    const updated: ApprovedPerson = {
      id: editingPersonId || personForm.staffId,
      name: staff?.name || personForm.name,
      role: staff?.role || personForm.role,
      moduleIds: personForm.moduleIds.length === MODULES.length ? ALL_MODULE_IDS : [...personForm.moduleIds],
      maxDurationHours: personForm.maxDurationHours
    };
    setApprovedPersons((previous) => editingPersonId
      ? previous.map((person) => person.id === editingPersonId ? updated : person)
      : [...previous, updated]
    );
    addToast('success', `${updated.name} ${editingPersonId ? 'updated' : 'added'} on the approved list.`);
    closePersonDialog();
  };

  const removePerson = () => {
    if (!personToRemove) return;
    if (activeOverrides.some((override) => override.personId === personToRemove.id)) {
      addToast('warning', 'Revoke this person’s active override before removing them.');
      setPersonToRemove(null);
      return;
    }
    setApprovedPersons((previous) => previous.filter((person) => person.id !== personToRemove.id));
    addToast('success', `${personToRemove.name} removed from the approved list.`);
    setPersonToRemove(null);
  };

  const openHistoryForEntry = (entry: LockEntry) => {
    setHistoryEntryFilter(entry.id);
    setHistorySearch('');
    setActiveTab('history');
  };

  const clearHistoryEntryFilter = () => setHistoryEntryFilter('');

  const renderToastIcon = (type: ToastType) => {
    if (type === 'success') return <CheckCircleIcon className="h-4 w-4 text-emerald-600" />;
    if (type === 'error') return <XCircleIcon className="h-4 w-4 text-red-600" />;
    if (type === 'warning') return <AlertTriangleIcon className="h-4 w-4 text-amber-600" />;
    return <InfoIcon className="h-4 w-4 text-blue-600" />;
  };

  const selectedVisibleCount = filteredEntries.filter((entry) => selectedIds.includes(entry.id)).length;
  const allVisibleSelected = filteredEntries.length > 0 && selectedVisibleCount === filteredEntries.length;

  return (
    <div className="min-h-full space-y-5 bg-gray-50 p-4 md:p-6">
      <div className="fixed right-4 top-4 z-[70] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`flex min-w-[280px] max-w-md items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg ${
            toast.type === 'success' ? 'border-emerald-200' : toast.type === 'error' ? 'border-red-200' : toast.type === 'warning' ? 'border-amber-200' : 'border-blue-200'
          }`} role="status">
            {renderToastIcon(toast.type)}
            <span className="flex-1 text-sm text-gray-700">{toast.message}</span>
            <button type="button" onClick={() => setToasts((previous) => previous.filter((item) => item.id !== toast.id))} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Dismiss notification">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <section className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ShieldIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">School ERP · Administration</p>
              <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">Data Governance &amp; Lock Manager</h1>
              <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                <span>Home</span><ChevronRightIcon className="h-3 w-3" /><span>Administration</span><ChevronRightIcon className="h-3 w-3" /><span className="font-medium text-gray-700">Lock Manager</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <label className="sr-only" htmlFor="lock-manager-fiscal-year">Fiscal year</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <select id="lock-manager-fiscal-year" value={selectedFiscalYear} onChange={(event) => setSelectedFiscalYear(event.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
                <option value="2025-26">FY: 2025-26</option>
                <option value="2024-25">FY: 2024-25</option>
                <option value="2023-24">FY: 2023-24</option>
              </select>
              <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <div className="relative">
              <button type="button" onClick={() => setNotificationOpen((open) => !open)} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50" aria-label={`${notificationCount} notifications`} aria-expanded={notificationOpen}>
                <BellIcon className="h-5 w-5" />
                {notificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{notificationCount}</span>}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div><p className="text-sm font-semibold text-gray-900">Notifications</p><p className="text-xs text-gray-500">Lock activity for Super Admin</p></div>
                    <button type="button" onClick={() => setNotificationOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100" aria-label="Close notifications"><XIcon className="h-4 w-4" /></button>
                  </div>
                  <div className="max-h-72 divide-y divide-gray-100 overflow-y-auto">
                    {pendingRequests.slice(0, 3).map((request) => {
                      const person = approvedPersons.find((item) => item.id === request.personId);
                      const entry = entries.find((item) => item.id === request.entryId);
                      return <button key={request.id} type="button" onClick={() => { setActiveTab('overrides'); setNotificationOpen(false); }} className="block w-full px-4 py-3 text-left hover:bg-gray-50">
                        <span className="flex items-start gap-2"><AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /><span><span className="block text-sm font-medium text-gray-800">Override request needs review</span><span className="mt-0.5 block text-xs text-gray-500">{person?.name || 'Staff member'} · {entry?.pageLabel || 'Module'}</span></span></span>
                      </button>;
                    })}
                    {activeOverrides.slice(0, 3).map((override) => <button key={override.id} type="button" onClick={() => { setActiveTab('overrides'); setNotificationOpen(false); }} className="block w-full px-4 py-3 text-left hover:bg-gray-50">
                      <span className="flex items-start gap-2"><ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /><span><span className="block text-sm font-medium text-gray-800">Timed override is running</span><span className="mt-0.5 block text-xs text-gray-500">{override.personName} · {override.pageLabel} · {formatCountdown(override.expiresAt - currentTime)}</span></span></span>
                    </button>)}
                    {notificationCount === 0 && <p className="px-4 py-8 text-center text-sm text-gray-500">No active lock notifications.</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600"><UserIcon className="h-4 w-4" /></span>
              <span><span className="block text-xs font-semibold text-gray-800">Admin</span><span className="block text-[10px] text-gray-500">Super Admin</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div><p className="text-sm font-semibold text-amber-900">Super Admin only</p><p className="mt-0.5 text-sm text-amber-800">Changes here affect data access across all modules. Locked pages remain available for viewing, export, and printing; create, edit, and delete are restricted.</p></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">Timers, approvals, and audit entries on this screen use local demo state.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" leftIcon={<PlusIcon className="h-4 w-4" />} onClick={openOverrideRequestDialog} disabled={!approvedPersons.some((person) => entries.some((entry) => entry.status === 'locked' && person.moduleIds.includes(entry.moduleId)))} title="Create a timed override request for an approved person">Create Override Request</Button>
              <Button variant="outline" size="sm" leftIcon={<LockIcon className="h-4 w-4" />} onClick={() => setGlobalAction('lock')}>Lock All Modules</Button>
              <Button variant="outline" size="sm" leftIcon={<UnlockIcon className="h-4 w-4" />} onClick={() => setGlobalAction('unlock')}>Unlock All</Button>
              <Button variant="outline" size="sm" leftIcon={<RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />} onClick={handleRefresh} disabled={isRefreshing}>{isRefreshing ? 'Refreshing…' : 'Refresh'}</Button>
              <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={() => exportHistory()}>Export Log</Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Lock manager summary">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="Total Locked" value={lockedCount} description="Pages locked for everyone" icon={<LockIcon className="h-5 w-5" />} tone="red" onClick={() => { setStatusFilter('locked'); setActiveTab('modules'); }} />
          <SummaryCard title="Unlocked" value={openCount} description="Open for normal use" icon={<UnlockIcon className="h-5 w-5" />} tone="green" onClick={() => { setStatusFilter('open'); setActiveTab('modules'); }} />
          <SummaryCard title="Active Overrides" value={activeOverrides.length} description="Timer currently running" icon={<ClockIcon className="h-5 w-5" />} tone="orange" onClick={() => setActiveTab('overrides')} />
          <SummaryCard title="Requests Pending" value={pendingRequests.length} description="Awaiting admin decision" icon={<AlertTriangleIcon className="h-5 w-5" />} tone="amber" onClick={() => setActiveTab('overrides')} />
          <SummaryCard title="Approved Persons" value={approvedPersons.length} description="Eligible for scoped access" icon={<UsersIcon className="h-5 w-5" />} tone="blue" onClick={() => setActiveTab('persons')} />
        </div>
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="mb-3 flex items-center gap-2"><InfoIcon className="h-4 w-4 text-blue-700" /><h2 className="text-sm font-semibold text-blue-900">How the simple lock system works</h2></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['01', 'Admin locks a page', 'Everyone can view and export; data changes are blocked.'],
            ['02', 'Approved person requests access', 'Only a person on the approved list can receive an override.'],
            ['03', 'Admin grants timed access', 'One person gets a limited, visible countdown.'],
            ['04', 'Timer expires', 'The page automatically locks again and an audit event is recorded.']
          ].map(([number, title, description]) => <div key={number} className="flex gap-3 rounded-lg bg-white/80 p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{number}</span>
            <div><p className="text-xs font-semibold text-gray-800">{title}</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p></div>
          </div>)}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto border-b border-gray-200">
          <div role="tablist" aria-label="Lock manager sections" className="flex min-w-max">
            {([
              { id: 'modules', label: 'All Modules & Pages', icon: <LockIcon className="h-4 w-4" />, count: entries.length },
              { id: 'overrides', label: 'Active Overrides', icon: <ClockIcon className="h-4 w-4" />, count: activeOverrides.length + pendingRequests.length },
              { id: 'persons', label: 'Override Persons', icon: <UsersIcon className="h-4 w-4" />, count: approvedPersons.length },
              { id: 'history', label: 'Lock History', icon: <HistoryIcon className="h-4 w-4" />, count: undefined }
            ] as Array<{ id: TabType; label: string; icon: React.ReactNode; count?: number }>).map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition sm:px-5 ${activeTab === tab.id ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                {tab.icon}<span>{tab.label}</span>
                {tab.count !== undefined && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div><h2 className="text-lg font-semibold text-gray-900">Module &amp; Page Lock Status</h2><p className="mt-1 text-sm text-gray-500">Manage locks at page level. An active override applies only to the named person.</p></div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" leftIcon={<LockIcon className="h-4 w-4" />} onClick={() => setEntriesBulk('lock', selectedIds)} disabled={selectedIds.length === 0}>Bulk Lock Selected</Button>
                  <Button variant="outline" size="sm" leftIcon={<UnlockIcon className="h-4 w-4" />} onClick={() => setEntriesBulk('unlock', selectedIds)} disabled={selectedIds.length === 0}>Bulk Unlock</Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input aria-label="Search modules and pages" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search module or page…" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-500"><FilterIcon className="h-4 w-4" />Status
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | LockStatus)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="all">All Status</option><option value="locked">Locked</option><option value="open">Open</option><option value="override">Override Active</option>
                  </select>
                </label>
                <span className="text-xs text-gray-500">{filteredEntries.length} of {entries.length} pages</span>
              </div>

              {filteredEntries.length === 0 ? <EmptyState icon={<SearchIcon className="h-5 w-5" />} title="No modules or pages found" description="Try a different search or status filter." /> : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-[760px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="w-12 px-4 py-3"><input type="checkbox" aria-label="Select all visible pages" checked={allVisibleSelected} onChange={(event) => setSelectedIds((previous) => event.target.checked ? Array.from(new Set([...previous, ...filteredEntries.map((entry) => entry.id)])) : previous.filter((id) => !filteredEntries.some((entry) => entry.id === id)))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
                        <th className="px-4 py-3">Module / Page</th>
                        <th className="px-4 py-3">Lock Status</th>
                        <th className="px-4 py-3">Locked Since</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    {groupedEntries.map((module) => (
                      <tbody key={module.id} className="divide-y divide-gray-100">
                        <tr className="bg-slate-50/80">
                          <td colSpan={5} className="px-4 py-2.5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700"><span className="text-base">{module.icon}</span>{module.heading}<span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500">{module.entries.length} shown</span></span><div className="flex items-center gap-2"><button type="button" onClick={() => setEntriesBulk('lock', entries.filter((entry) => entry.moduleId === module.id).map((entry) => entry.id))} className="rounded px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100">Lock module</button><button type="button" onClick={() => setEntriesBulk('unlock', entries.filter((entry) => entry.moduleId === module.id).map((entry) => entry.id))} className="rounded px-2 py-1 text-[11px] font-semibold text-gray-600 hover:bg-white">Unlock module</button></div></div></td>
                        </tr>
                        {module.entries.map((entry) => {
                          const activeOverride = activeOverrides.find((override) => override.entryId === entry.id);
                          return <tr key={entry.id} className="hover:bg-blue-50/30">
                            <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${entry.pageLabel}`} checked={selectedIds.includes(entry.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...previous, entry.id] : previous.filter((id) => id !== entry.id))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-2 pl-2"><span className="text-base">{entry.moduleIcon}</span><span className="font-medium text-gray-800">{entry.pageLabel}</span></div></td>
                            <td className="px-4 py-3"><div className="flex flex-col items-start gap-1"><Badge variant={getStatusVariant(entry.status)} className="inline-flex items-center gap-1">{entry.status === 'locked' ? <LockIcon className="h-3 w-3" /> : entry.status === 'override' ? <ClockIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}{getStatusLabel(entry.status)}</Badge>{activeOverride && <span className="text-[11px] text-gray-500">{activeOverride.personName} · {formatCountdown(activeOverride.expiresAt - currentTime)}</span>}</div></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(entry.lockedAt)}</td>
                            <td className="px-4 py-3"><div className="flex justify-end gap-1.5">
                              {entry.status === 'open' ? <Button variant="outline" size="xs" leftIcon={<LockIcon className="h-3.5 w-3.5" />} onClick={() => openEntryAction(entry, 'lock')}>Lock</Button> : <Button variant={entry.status === 'override' ? 'secondary' : 'primary'} size="xs" leftIcon={<UnlockIcon className="h-3.5 w-3.5" />} onClick={() => openEntryAction(entry, 'unlock')}>{entry.status === 'override' ? 'Manage' : 'Unlock'}</Button>}
                              <Button variant="ghost" size="xs" leftIcon={<EyeIcon className="h-3.5 w-3.5" />} onClick={() => openHistoryForEntry(entry)}>View Log</Button>
                            </div></td>
                          </tr>;
                        })}
                      </tbody>
                    ))}
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overrides' && (
            <div className="space-y-7">
              <section className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-lg font-semibold text-gray-900">Pending Override Requests</h2><p className="mt-1 text-sm text-gray-500">Approve only people already authorized for the requested module.</p></div><Badge variant="warning">{pendingRequests.length} pending</Badge></div>
                {pendingRequests.length === 0 ? <EmptyState icon={<CheckCircleIcon className="h-5 w-5" />} title="No pending requests" description="New requests will appear here for Super Admin review." /> : (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => {
                      const person = approvedPersons.find((item) => item.id === request.personId);
                      const entry = entries.find((item) => item.id === request.entryId);
                      const authorized = Boolean(person && entry && person.moduleIds.includes(entry.moduleId));
                      const maxHours = person?.maxDurationHours ?? 24;
                      const selectedHours = requestHours[request.id] ?? request.requestedDurationHours;
                      const durationOkay = Number.isFinite(selectedHours) && selectedHours >= 1 && selectedHours <= 24 && (person?.maxDurationHours === null || selectedHours <= maxHours);
                      const pageStillLocked = entry?.status === 'locked';
                      return <article key={request.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-gray-900">{person?.name || 'Unknown staff member'}</h3><Badge variant="secondary">{person?.role || 'Not in approved list'}</Badge>{authorized ? <Badge variant="success">Approved person</Badge> : <Badge variant="danger">Not authorized</Badge>}</div>
                            <p className="mt-2 text-sm text-gray-700"><span className="font-medium">Page:</span> {entry?.moduleLabel || 'Unknown module'} / {entry?.pageLabel || 'Unknown page'}</p>
                            <p className="mt-1 text-sm text-gray-700"><span className="font-medium">Reason:</span> {request.reason}</p>
                            <p className="mt-1 text-xs text-gray-500">Requested {formatDateTime(request.requestedAt)} · Requested duration {request.requestedDurationHours} hour{request.requestedDurationHours === 1 ? '' : 's'}</p>
                            {!authorized && <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">This person is not approved for this module. The request cannot be granted and must be denied.</p>}
                            {authorized && !pageStillLocked && <p className="mt-2 rounded-md border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-amber-700">This page is no longer locked, so the request cannot be approved.</p>}
                          </div>
                          <div className="flex flex-col gap-3 xl:w-[330px] xl:shrink-0">
                            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Grant access for</p><div className="flex flex-wrap gap-2">{[1, 2, 4].map((hours) => <button key={hours} type="button" disabled={hours > maxHours} onClick={() => setRequestHours((previous) => ({ ...previous, [request.id]: hours }))} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedHours === hours ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'} disabled:cursor-not-allowed disabled:opacity-40`}>{hours} hour{hours === 1 ? '' : 's'}</button>)}</div>
                              <label className="mt-2 flex items-center gap-2 text-xs text-gray-500">Custom hours (max {person?.maxDurationHours ?? 'no limit'})<input type="number" min="1" max={maxHours} value={selectedHours} onChange={(event) => setRequestHours((previous) => ({ ...previous, [request.id]: Number(event.target.value) }))} className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 outline-none focus:border-blue-500" /></label>
                            </div>
                            <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" size="sm" leftIcon={<XIcon className="h-4 w-4" />} onClick={() => denyRequest(request)}>Deny</Button><Button variant="primary" size="sm" leftIcon={<CheckIcon className="h-4 w-4" />} onClick={() => approveRequest(request)} disabled={!authorized || !pageStillLocked || !durationOkay}>Approve &amp; Grant</Button></div>
                          </div>
                        </div>
                      </article>;
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-lg font-semibold text-gray-900">Active Overrides</h2><p className="mt-1 text-sm text-gray-500">Only the person shown receives temporary edit access; all other users remain view-only.</p></div><Badge variant="warning">{activeOverrides.length} running</Badge></div>
                {activeOverrides.length === 0 ? <EmptyState icon={<ClockIcon className="h-5 w-5" />} title="No active overrides" description="Approved timed access appears here with a live countdown." /> : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {activeOverrides.map((override) => {
                      const remaining = Math.max(0, override.expiresAt - currentTime);
                      const total = Math.max(1, override.expiresAt - override.startedAt);
                      const progress = Math.max(0, Math.min(100, (remaining / total) * 100));
                      const person = approvedPersons.find((item) => item.id === override.personId);
                      const canExtend = (person?.maxDurationHours === null || person?.maxDurationHours === undefined || override.durationHours + 1 <= person.maxDurationHours) && override.durationHours < 24;
                      return <article key={override.id} className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
                        <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Timed override · {override.moduleLabel}</p><h3 className="mt-1 text-base font-semibold text-gray-900">{override.pageLabel}</h3></div><Badge variant="warning" className="shrink-0">{formatCountdown(remaining)}</Badge></div>
                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><div><p className="text-xs text-gray-500">Person</p><p className="font-medium text-gray-800">{override.personName} <span className="font-normal text-gray-500">({override.personRole})</span></p></div><div><p className="text-xs text-gray-500">Approved by</p><p className="font-medium text-gray-800">{override.approvedBy}</p></div><div><p className="text-xs text-gray-500">Started</p><p className="font-medium text-gray-800">{formatDateTime(override.startedAt)}</p></div><div><p className="text-xs text-gray-500">Expires</p><p className="font-medium text-gray-800">{formatDateTime(override.expiresAt)}</p></div></div>
                        <div className="mt-3 rounded-lg bg-white/80 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reason</p><p className="mt-1 text-sm text-gray-700">{override.reason}</p></div>
                        <div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-semibold text-gray-700">Time remaining</span><span className={`font-mono font-semibold ${remaining < 15 * 60 * 1000 ? 'text-red-600' : 'text-gray-700'}`}>{formatCountdown(remaining)}</span></div><div className="h-2 overflow-hidden rounded-full bg-orange-100"><div className={`h-full rounded-full transition-[width] duration-1000 ${remaining < 15 * 60 * 1000 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }} /></div><p className="mt-1 text-[11px] text-gray-500">At 00:00:00, the system automatically locks this page again and records the event.</p></div>
                        <div className="mt-4 flex flex-wrap justify-end gap-2"><Button variant="outline" size="sm" leftIcon={<ClockIcon className="h-4 w-4" />} onClick={() => extendOverride(override)} disabled={!canExtend} title={canExtend ? 'Add one hour' : 'Maximum approved duration reached'}>Extend by 1 hour</Button><Button variant="danger" size="sm" leftIcon={<XIcon className="h-4 w-4" />} onClick={() => revokeOverride(override)}>Revoke Override Now</Button></div>
                      </article>;
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'persons' && (
            <div className="space-y-6">
              <section>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-semibold text-gray-900">Approved Override Persons</h2><p className="mt-1 text-sm text-gray-500">Only listed active staff with matching module scope can receive a timed override.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={exportPeople}>Export List</Button><Button variant="primary" size="sm" leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => openPersonDialog()}>Add Person</Button></div></div>
                <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200"><table className="min-w-[760px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Person Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Can Override These Modules</th><th className="px-4 py-3">Max Duration</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{approvedPersons.map((person, index) => {
                  const hasActiveSession = activeOverrides.some((override) => override.personId === person.id);
                  return <tr key={person.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-500">{index + 1}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700"><UserIcon className="h-4 w-4" /></span><span className="font-medium text-gray-900">{person.name}</span></div></td><td className="px-4 py-3 text-gray-700">{person.role}</td><td className="max-w-sm px-4 py-3"><span className="text-gray-700">{getPersonScope(person)}</span></td><td className="px-4 py-3"><Badge variant={person.maxDurationHours === null ? 'primary' : 'secondary'}>{person.maxDurationHours === null ? 'No limit' : `${person.maxDurationHours} hour${person.maxDurationHours === 1 ? '' : 's'} max`}</Badge></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Button variant="ghost" size="xs" leftIcon={<PencilIcon className="h-3.5 w-3.5" />} onClick={() => openPersonDialog(person)}>Edit</Button><Button variant="ghost" size="xs" leftIcon={<TrashIcon className="h-3.5 w-3.5 text-red-500" />} onClick={() => setPersonToRemove(person)} disabled={hasActiveSession} title={hasActiveSession ? 'Revoke the active override first' : 'Remove person'}>Remove</Button></div></td></tr>;
                })}</tbody></table></div>
                {approvedPersons.length === 0 && <div className="mt-4"><EmptyState icon={<UsersIcon className="h-5 w-5" />} title="No approved persons" description="Add active staff and choose which modules they can access during an override." /></div>}
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" /><p>Anyone not on this list, or not approved for the specific module, cannot be granted override access. Audit records are retained and cannot be deleted from this screen.</p></div>
              </section>

            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-lg font-semibold text-gray-900">Lock History Log</h2><p className="mt-1 text-sm text-gray-500">Every lock, unlock, request, decision, revocation, extension, and automatic relock is recorded here.</p></div><Button variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={() => exportHistory(filteredHistory)}>Export filtered log</Button></div>
              {historyEntryFilter && <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800"><span>Showing history for <strong>{entries.find((entry) => entry.id === historyEntryFilter)?.pageLabel || historyEntryFilter}</strong></span><button type="button" onClick={clearHistoryEntryFilter} className="font-semibold underline underline-offset-2">Clear page filter</button></div>}
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2 xl:grid-cols-5">
                <label className="text-xs font-medium text-gray-500">Action<select value={historyActionFilter} onChange={(event) => setHistoryActionFilter(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"><option value="all">All Actions</option>{HISTORY_ACTIONS.map((action) => <option key={action} value={action}>{action}</option>)}</select></label>
                <label className="text-xs font-medium text-gray-500">Module<select value={historyModuleFilter} onChange={(event) => setHistoryModuleFilter(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"><option value="all">All Modules</option>{MODULES.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}</select></label>
                <label className="text-xs font-medium text-gray-500">From<input type="date" value={historyDateFrom} onChange={(event) => setHistoryDateFrom(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500" /></label>
                <label className="text-xs font-medium text-gray-500">To<input type="date" value={historyDateTo} onChange={(event) => setHistoryDateTo(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500" /></label>
                <label className="text-xs font-medium text-gray-500">Search log<input value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder="User, page, reason…" className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500" /></label>
              </div>
              {filteredHistory.length === 0 ? <EmptyState icon={<HistoryIcon className="h-5 w-5" />} title="No history entries found" description="Adjust the action, module, date, or search filters." /> : (
                <div className="overflow-x-auto rounded-lg border border-gray-200"><table className="min-w-[820px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Date &amp; Time</th><th className="px-4 py-3">Who</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Module / Page</th><th className="px-4 py-3">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredHistory.map((item, index) => <tr key={item.id} className="align-top hover:bg-gray-50"><td className="px-4 py-3 text-gray-400">{index + 1}</td><td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(item.timestamp)}</td><td className="px-4 py-3 font-medium text-gray-800">{item.actor}</td><td className="px-4 py-3"><Badge variant={item.action === 'LOCKED' || item.action === 'AUTO-LOCKED' ? 'danger' : item.action === 'UNLOCKED' || item.action === 'OVERRIDE GRANTED' ? 'success' : item.action === 'OVERRIDE DENIED' || item.action === 'OVERRIDE REVOKED' ? 'warning' : 'primary'}>{item.action}</Badge></td><td className="px-4 py-3"><span className="block font-medium text-gray-800">{item.moduleLabel}</span><span className="text-xs text-gray-500">{item.pageLabel}</span></td><td className="max-w-md px-4 py-3 text-gray-600">{item.details}</td></tr>)}</tbody></table></div>
              )}
              <p className="flex items-center gap-2 text-xs text-gray-500"><ShieldIcon className="h-3.5 w-3.5" /> Audit log is append-only in this interface; there is no delete or edit action.</p>
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={overrideRequestModalOpen} onClose={() => setOverrideRequestModalOpen(false)} title="Create Lock Override Request" size="lg">
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><p className="font-semibold text-blue-900">Request temporary edit access</p><p className="mt-1 text-sm text-blue-800">Choose an approved requestor and a locked page within their authorized module scope. The request will be added to the pending review queue and audit history.</p></div>
          <label className="block text-sm font-medium text-gray-700">Requestor<select value={overrideRequestForm.personId} onChange={(event) => changeRequestPerson(event.target.value)} className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"><option value="">Select an approved person</option>{approvedPersons.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select></label>
          <label className="block text-sm font-medium text-gray-700">Locked module / page<select value={overrideRequestForm.entryId} onChange={(event) => setOverrideRequestForm((previous) => ({ ...previous, entryId: event.target.value }))} disabled={!requestFormPerson || requestableEntries.length === 0} className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 disabled:bg-gray-100"><option value="">Select a locked page</option>{requestableEntries.map((entry) => <option key={entry.id} value={entry.id}>{entry.moduleLabel} / {entry.pageLabel}</option>)}</select>{requestFormPerson && requestableEntries.length === 0 && <span className="mt-1 block text-xs text-amber-700">This person has no currently locked pages in their approved module scope.</span>}</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-700">Requested duration (hours)<input type="number" min="1" max={requestFormDurationLimit} value={overrideRequestForm.durationHours} onChange={(event) => setOverrideRequestForm((previous) => ({ ...previous, durationHours: event.target.value }))} className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500" /><span className="mt-1 block text-xs text-gray-500">Maximum for this person: {requestFormPerson?.maxDurationHours === null ? '24 hours per request' : `${requestFormPerson?.maxDurationHours ?? '—'} hour(s)`}</span></label><div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600"><strong className="text-gray-800">Approval rule</strong><br />Submitting a request does not unlock the page. A Super Admin must review and approve it; all access is time-limited and audited.</div></div>
          <label className="block text-sm font-medium text-gray-700">Reason for override <span className="text-red-600">*</span><textarea value={overrideRequestForm.reason} onChange={(event) => setOverrideRequestForm((previous) => ({ ...previous, reason: event.target.value }))} rows={4} maxLength={500} placeholder="Explain what needs to be corrected and why temporary access is required." className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><span className="mt-1 block text-right text-xs text-gray-400">{overrideRequestForm.reason.length}/500 · minimum 10 characters</span></label>
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setOverrideRequestModalOpen(false)}>Cancel</Button><Button variant="primary" leftIcon={<PlusIcon className="h-4 w-4" />} onClick={createOverrideRequest} disabled={!requestFormPerson || !overrideRequestForm.entryId || !requestFormDurationIsValid || overrideRequestForm.reason.trim().length < 10}>Submit Request</Button></div>
        </div>
      </Modal>

      <Modal isOpen={entryModalOpen} onClose={closeEntryModal} title={entryAction === 'lock' ? `Lock ${selectedEntryForModal?.pageLabel || 'Module / Page'}` : `Unlock ${selectedEntryForModal?.pageLabel || 'Module / Page'}`} size="lg">
        {selectedEntryForModal && entryAction === 'lock' && <div className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><p className="font-semibold text-blue-900">You are about to lock {selectedEntryForModal.moduleLabel} / {selectedEntryForModal.pageLabel}</p><ul className="mt-2 space-y-1 text-sm text-blue-800"><li>✓ Users can still view, export, and print data.</li><li>✕ Create, edit, and delete actions are restricted.</li></ul></div>
          <label className="block text-sm font-medium text-gray-700">Lock reason <span className="font-normal text-gray-400">(optional)</span><textarea value={lockReason} onChange={(event) => setLockReason(event.target.value)} rows={3} placeholder="e.g. Month-end closing — October 2025" className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end"><Button variant="outline" onClick={closeEntryModal}>Cancel</Button><Button variant="primary" leftIcon={<LockIcon className="h-4 w-4" />} onClick={confirmEntryAction}>Confirm Lock</Button></div>
        </div>}

        {selectedEntryForModal && entryAction === 'unlock' && <div className="space-y-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="font-semibold text-amber-900">Choose how {selectedEntryForModal.pageLabel} should be unlocked.</p><p className="mt-1 text-sm text-amber-800">Permanent unlock opens the page for everyone. A timed override grants edit access only to one approved person and then auto-locks.</p></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setUnlockMode('permanent')} className={`rounded-lg border p-4 text-left transition ${unlockMode === 'permanent' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 bg-white hover:bg-gray-50'}`}><span className="flex items-center gap-2 font-semibold text-gray-900"><UnlockIcon className="h-4 w-4 text-blue-600" />Permanent unlock</span><span className="mt-1 block text-xs text-gray-500">Fully opens for everyone until locked again.</span></button>
            <button type="button" onClick={() => setUnlockMode('timed')} className={`rounded-lg border p-4 text-left transition ${unlockMode === 'timed' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 bg-white hover:bg-gray-50'}`}><span className="flex items-center gap-2 font-semibold text-gray-900"><ClockIcon className="h-4 w-4 text-orange-600" />Timed override</span><span className="mt-1 block text-xs text-gray-500">One pre-approved person; auto-locks when time ends.</span></button>
          </div>
          {unlockMode === 'timed' && <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-700">Approved person<select value={selectedOverridePersonId} onChange={(event) => setSelectedOverridePersonId(event.target.value)} className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"><option value="">Select from approved list</option>{eligiblePeople.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select></label>
            {eligiblePeople.length === 0 && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">There are no approved people for {selectedEntryForModal.moduleLabel}. Add an authorized person before granting a timed override.</p>}
            {selectedOverridePerson && <p className="text-xs text-gray-500">Authorized for: {getPersonScope(selectedOverridePerson)} · Maximum: {selectedOverridePerson.maxDurationHours === null ? 'No limit' : `${selectedOverridePerson.maxDurationHours} hour${selectedOverridePerson.maxDurationHours === 1 ? '' : 's'}`}</p>}
            <div><p className="mb-2 text-sm font-medium text-gray-700">Duration</p><div className="flex flex-wrap gap-2">{(['1', '2', '4'] as DurationChoice[]).map((choice) => {
              const hours = Number(choice);
              const disabled = Boolean(selectedOverridePerson && selectedOverridePerson.maxDurationHours !== null && hours > selectedOverridePerson.maxDurationHours);
              return <button key={choice} type="button" disabled={disabled} onClick={() => setDurationChoice(choice)} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${durationChoice === choice ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'} disabled:cursor-not-allowed disabled:opacity-40`}>{hours} hour{hours === 1 ? '' : 's'}</button>;
            })}<button type="button" onClick={() => setDurationChoice('custom')} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${durationChoice === 'custom' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'}`}>Custom</button></div>
              {durationChoice === 'custom' && <label className="mt-3 block text-xs font-medium text-gray-500">Custom hours<input type="number" min="1" max={selectedOverridePerson?.maxDurationHours ?? 24} value={customDuration} onChange={(event) => setCustomDuration(event.target.value)} className="mt-1 block w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500" /></label>}
              {!selectedDurationIsValid && selectedOverridePerson && <p className="mt-2 text-xs text-red-600">Choose 1–24 hours within this person’s approved maximum.</p>}
            </div>
          </div>}
          <label className="block text-sm font-medium text-gray-700">Unlock reason <span className="text-red-600">*</span><textarea value={unlockReason} onChange={(event) => setUnlockReason(event.target.value)} rows={3} placeholder="Explain why access is required. This reason is recorded in the audit log." className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end"><Button variant="outline" onClick={closeEntryModal}>Cancel</Button><Button variant="primary" leftIcon={unlockMode === 'timed' ? <ClockIcon className="h-4 w-4" /> : <UnlockIcon className="h-4 w-4" />} onClick={confirmEntryAction} disabled={!unlockReason.trim() || (unlockMode === 'timed' && !selectedDurationIsValid)}>{unlockMode === 'timed' ? 'Grant Timed Override' : 'Confirm Permanent Unlock'}</Button></div>
        </div>}
      </Modal>

      <Modal isOpen={personModalOpen} onClose={closePersonDialog} title={editingPersonId ? 'Edit Approved Override Person' : 'Add Person to Approved List'} size="lg">
        <div className="space-y-5">
          <label className="block text-sm font-medium text-gray-700">Select active staff member<select value={personForm.staffId} onChange={(event) => {
            const staff = STAFF_DIRECTORY.find((item) => item.id === event.target.value);
            setPersonForm((previous) => ({ ...previous, staffId: event.target.value, name: staff?.name || '', role: staff?.role || '' }));
          }} disabled={Boolean(editingPersonId)} className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 disabled:bg-gray-100"><option value="">Search / select staff</option>{STAFF_DIRECTORY.map((staff) => <option key={staff.id} value={staff.id}>{staff.name} · {staff.role}</option>)}</select></label>
          {personForm.name && <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"><span className="font-medium">{personForm.name}</span><span className="ml-2 text-gray-500">{personForm.role}</span></div>}
          <fieldset><legend className="mb-2 text-sm font-medium text-gray-700">Can override these modules <span className="text-red-600">*</span></legend><label className="mb-2 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"><input type="checkbox" checked={personForm.moduleIds.length === MODULES.length} onChange={(event) => setPersonForm((previous) => ({ ...previous, moduleIds: event.target.checked ? ALL_MODULE_IDS : [] }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />All Modules</label><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{MODULES.map((module) => <label key={module.id} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><input type="checkbox" checked={personForm.moduleIds.includes(module.id)} onChange={(event) => setPersonForm((previous) => ({ ...previous, moduleIds: event.target.checked ? Array.from(new Set([...previous.moduleIds, module.id])) : previous.moduleIds.filter((id) => id !== module.id) }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span>{module.icon} {module.label}</span></label>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-medium text-gray-700">Maximum override duration</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{([1, 2, 4, null] as Array<number | null>).map((hours) => <button key={hours === null ? 'none' : hours} type="button" onClick={() => setPersonForm((previous) => ({ ...previous, maxDurationHours: hours }))} className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${personForm.maxDurationHours === hours ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{hours === null ? 'No Limit' : `${hours} Hour${hours === 1 ? '' : 's'} max`}</button>)}</div><p className="mt-2 text-xs text-gray-500">A timed override still has an expiry. “No Limit” means no person-specific cap; a single session is limited to 24 hours in this demo.</p></fieldset>
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end"><Button variant="outline" onClick={closePersonDialog}>Cancel</Button><Button variant="primary" leftIcon={<CheckIcon className="h-4 w-4" />} onClick={savePerson} disabled={!personForm.staffId || personForm.moduleIds.length === 0}>{editingPersonId ? 'Save Changes' : 'Add to Approved List'}</Button></div>
        </div>
      </Modal>

      <Modal isOpen={Boolean(personToRemove)} onClose={() => setPersonToRemove(null)} title="Remove Approved Person" size="sm">
        <div className="space-y-4"><div className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3"><AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><p className="text-sm text-red-800">Remove <strong>{personToRemove?.name}</strong> from the approved override list? This will not delete existing audit history.</p></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPersonToRemove(null)}>Cancel</Button><Button variant="danger" leftIcon={<TrashIcon className="h-4 w-4" />} onClick={removePerson}>Remove Person</Button></div></div>
      </Modal>

      <Modal isOpen={Boolean(globalAction)} onClose={() => setGlobalAction(null)} title={globalAction === 'lock' ? 'Lock All Modules & Pages' : 'Unlock All Modules & Pages'} size="md">
        <div className="space-y-4"><div className={`rounded-lg border p-4 ${globalAction === 'lock' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}><p className={`font-semibold ${globalAction === 'lock' ? 'text-red-900' : 'text-amber-900'}`}>{globalAction === 'lock' ? 'This will lock every listed module page.' : 'This will permanently unlock every listed module page.'}</p><p className={`mt-1 text-sm ${globalAction === 'lock' ? 'text-red-800' : 'text-amber-800'}`}>{globalAction === 'lock' ? 'All active overrides will be revoked. Users will retain view, export, and print access.' : 'All active overrides will end and every page will become open for everyone.'} Each changed page is written to the history log.</p></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setGlobalAction(null)}>Cancel</Button><Button variant={globalAction === 'lock' ? 'danger' : 'primary'} leftIcon={globalAction === 'lock' ? <LockIcon className="h-4 w-4" /> : <UnlockIcon className="h-4 w-4" />} onClick={handleGlobalAction}>{globalAction === 'lock' ? 'Confirm Lock All' : 'Confirm Unlock All'}</Button></div></div>
      </Modal>
    </div>
  );
}
