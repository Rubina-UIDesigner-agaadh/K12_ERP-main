export interface ArchiveRetrievalItem {
  id: string;
  name: string;
  module: string;
  sizeMB: number;
  costINR: number;
  sourceRecordId?: string;
  reference?: string;
  type?: string;
  description?: string;
  date?: string;
  amount?: string;
  period?: string;
  student?: string;
}

export type RetrievalStatus = 'Queued' | 'In Progress' | 'Complete' | 'Cancelled';

export interface ArchiveRetrievalRequest {
  id: string;
  items: ArchiveRetrievalItem[];
  speed: 'Expedited' | 'Standard' | 'Bulk';
  accessHours: number;
  reason: string;
  requestedBy: string;
  approval: string;
  costINR: number;
  status: RetrievalStatus;
  progress: number;
  requestedAt: string;
  completedAt?: string;
  expiresAt?: string;
  notificationEmail?: boolean;
  notificationInApp?: boolean;
  notificationSms?: boolean;
  attachmentName?: string;
}

export interface ArchiveRetrievedRecord {
  id: string;
  reference: string;
  title: string;
  module: string;
  type: string;
  date: string;
  amount: string;
  period: string;
  student?: string;
  fileName: string;
  retrievedAt: string;
  retrievalId: string;
  costINR: number;
}

export interface ArchiveWorkflowState {
  version: 1;
  retrievals: ArchiveRetrievalRequest[];
  retrievedRecords: ArchiveRetrievedRecord[];
  coldPushQueue: string[];
  deletionRequests: { fileId: string; requestedAt: string; status: 'Pending Approval' }[];
}

const STORAGE_KEY = 'k12-archive-workflow-v1';
const CHANGE_EVENT = 'k12-archive-workflow-change';

const emptyState = (): ArchiveWorkflowState => ({
  version: 1,
  retrievals: [],
  retrievedRecords: [],
  coldPushQueue: [],
  deletionRequests: []
});

export function loadArchiveWorkflowState(): ArchiveWorkflowState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ArchiveWorkflowState>;
    return {
      version: 1,
      retrievals: Array.isArray(parsed.retrievals) ? parsed.retrievals : [],
      retrievedRecords: Array.isArray(parsed.retrievedRecords) ? parsed.retrievedRecords : [],
      coldPushQueue: Array.isArray(parsed.coldPushQueue) ? parsed.coldPushQueue : [],
      deletionRequests: Array.isArray(parsed.deletionRequests) ? parsed.deletionRequests : []
    };
  } catch {
    return emptyState();
  }
}

export function saveArchiveWorkflowState(state: ArchiveWorkflowState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: 1 }));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // The page remains usable in private-browsing modes where storage is blocked.
  }
}

export function updateArchiveWorkflowState(
  updater: (state: ArchiveWorkflowState) => ArchiveWorkflowState
): ArchiveWorkflowState {
  const next = updater(loadArchiveWorkflowState());
  saveArchiveWorkflowState(next);
  return next;
}

export function subscribeToArchiveWorkflowState(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function nextRetrievalId(state = loadArchiveWorkflowState()): string {
  const year = new Date().getFullYear();
  const prior = state.retrievals
    .map((request) => Number(request.id.match(/-(\d+)$/)?.[1] || 0))
    .reduce((max, value) => Math.max(max, value), 0);
  return `RETR-${year}-${String(prior + 1).padStart(3, '0')}`;
}

export function enqueueRetrieval(
  request: Omit<ArchiveRetrievalRequest, 'id' | 'status' | 'progress' | 'requestedAt'>
): ArchiveRetrievalRequest {
  const state = loadArchiveWorkflowState();
  const created: ArchiveRetrievalRequest = {
    ...request,
    id: nextRetrievalId(state),
    status: 'Queued',
    progress: 0,
    requestedAt: new Date().toISOString()
  };
  saveArchiveWorkflowState({ ...state, retrievals: [created, ...state.retrievals] });
  return created;
}

export function setRetrievalProgress(id: string, progress: number): ArchiveWorkflowState {
  return updateArchiveWorkflowState((state) => ({
    ...state,
    retrievals: state.retrievals.map((request) =>
      request.id === id
        ? { ...request, progress: Math.max(0, Math.min(100, progress)), status: progress > 0 ? 'In Progress' : request.status }
        : request
    )
  }));
}

export function completeRetrieval(id: string): ArchiveWorkflowState {
  const state = loadArchiveWorkflowState();
  const now = new Date();
  let completedRequest: ArchiveRetrievalRequest | undefined;
  const retrievals = state.retrievals.map((request) => {
    if (request.id !== id) return request;
    const expiry = new Date(now.getTime() + request.accessHours * 60 * 60 * 1000).toISOString();
    completedRequest = { ...request, status: 'Complete', progress: 100, completedAt: now.toISOString(), expiresAt: expiry };
    return completedRequest;
  });
  if (!completedRequest) return state;
  const additions: ArchiveRetrievedRecord[] = completedRequest.items.map((item) => ({
    id: item.sourceRecordId || `${completedRequest!.id}-${item.id}`,
    reference: item.reference || item.name,
    title: item.description || item.name,
    module: item.module,
    type: item.type || 'Archive File',
    date: item.date || now.toLocaleDateString('en-GB'),
    amount: item.amount || '—',
    period: item.period || 'Cold Storage',
    student: item.student,
    fileName: item.name,
    retrievedAt: now.toISOString(),
    retrievalId: completedRequest!.id,
    costINR: item.costINR
  }));
  const refreshedIds = new Set(additions.map((record) => record.id));
  const retrievedRecords = [...additions, ...state.retrievedRecords.filter((record) => !refreshedIds.has(record.id))];
  const next = { ...state, retrievals, retrievedRecords };
  saveArchiveWorkflowState(next);
  return next;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | undefined | null>>): void {
  if (typeof document === 'undefined') return;
  const escape = (value: string | number | undefined | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadJson(filename: string, data: unknown): void {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function formatArchiveDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}
