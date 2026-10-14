import React, { useEffect, useMemo, useState } from 'react';
import {
  Search, RotateCcw, Download, Printer, Eye, CheckCircle, XCircle, Mail,
  Play, SlidersHorizontal, FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { StudentApplicationDetail } from './StudentApplicationDetail';

export type AppStatus =
  | 'Draft' | 'Submitted' | 'Under Review' | 'Eligible' | 'Not Eligible'
  | 'Allotted' | 'Waitlisted' | 'Accepted' | 'Rejected';

export interface StreamApplication {
  id: string;
  name: string;
  photo: string;
  roll: string;
  classSec: string;
  pct: number;
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'EWS';
  p1: string;
  p2: string;
  p3: string;
  status: AppStatus;
  eligibility: 'Eligible' | 'Not Eligible' | 'Pending';
  allotted: string;
  submitted: string;
  year: string;
  round: string;
}

export type StreamDoc = {
  id: string;
  student: string;
  roll: string;
  type: string;
  uploaded: string;
  size: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  remarks: string;
};

export type StreamAuditEntry = {
  at: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  detail: string;
  ip: string;
};

export type StreamWaitRow = {
  pos: number;
  name: string;
  roll: string;
  cat: string;
  pct: number;
  stream: string;
  comb: string;
  why: string;
  date: string;
  round: string;
  notified: 'Yes' | 'No';
};

export type CounsellingRow = {
  name: string;
  cat: string;
  stream: string;
  comb: string;
  reason: string;
  by: string;
  date: string;
};

export type WaitMove = {
  at: string;
  student: string;
  action: string;
  stream: string;
  by: string;
};

export type StreamStore = {
  applications: StreamApplication[];
  docs: StreamDoc[];
  audit: StreamAuditEntry[];
  waitlist: StreamWaitRow[];
  counselling: CounsellingRow[];
  movements: WaitMove[];
  checklist: Record<string, boolean>;
  autoPromote: boolean;
  notifyWithin: string;
  responseWindow: string;
  noResponse: string;
  lastAllotment: string;
  currentRound: string;
  roundStatus: string;
};

export const STREAM_STORE_KEY = 'k12-stream-selection-v1';

export const STREAM_APPLICATIONS: StreamApplication[] = [
  { id: 'APP-2025-10042', name: 'Aarav Patel', photo: 'AP', roll: 'CBSE1001', classSec: '10 — A', pct: 91.2, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Accepted', eligibility: 'Eligible', allotted: 'Science', submitted: '05-06-2025 10:30', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10043', name: 'Diya Sharma', photo: 'DS', roll: 'CBSE1002', classSec: '10 — A', pct: 78.4, category: 'OBC', p1: 'Commerce', p2: 'Arts', p3: 'Vocational', status: 'Allotted', eligibility: 'Eligible', allotted: 'Commerce', submitted: '05-06-2025 11:12', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10044', name: 'Rohan Mehta', photo: 'RM', roll: 'CBSE1003', classSec: '10 — B', pct: 62.0, category: 'SC', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Waitlisted', eligibility: 'Eligible', allotted: '', submitted: '06-06-2025 09:05', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10045', name: 'Ananya Iyer', photo: 'AI', roll: 'CBSE1004', classSec: '10 — B', pct: 48.5, category: 'ST', p1: 'Arts', p2: 'Vocational', p3: 'Commerce', status: 'Not Eligible', eligibility: 'Not Eligible', allotted: '', submitted: '06-06-2025 14:22', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10046', name: 'Kabir Khan', photo: 'KK', roll: 'CBSE1005', classSec: '10 — C', pct: 84.1, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Under Review', eligibility: 'Pending', allotted: '', submitted: '07-06-2025 08:40', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10047', name: 'Meera Joshi', photo: 'MJ', roll: 'CBSE1006', classSec: '10 — C', pct: 71.8, category: 'EWS', p1: 'Commerce', p2: 'Science', p3: 'Arts', status: 'Eligible', eligibility: 'Eligible', allotted: '', submitted: '07-06-2025 16:18', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10048', name: 'Ishaan Gupta', photo: 'IG', roll: 'CBSE1007', classSec: '10 — A', pct: 55.3, category: 'OBC', p1: 'Vocational', p2: 'Arts', p3: 'Commerce', status: 'Submitted', eligibility: 'Pending', allotted: '', submitted: '08-06-2025 10:02', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10049', name: 'Sara Ali', photo: 'SA', roll: 'CBSE1008', classSec: '10 — B', pct: 88.0, category: 'General', p1: 'Science', p2: 'Arts', p3: 'Commerce', status: 'Draft', eligibility: 'Pending', allotted: '', submitted: '—', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10050', name: 'Vivaan Reddy', photo: 'VR', roll: 'CBSE1009', classSec: '10 — C', pct: 39.2, category: 'SC', p1: 'Arts', p2: 'Vocational', p3: 'Commerce', status: 'Rejected', eligibility: 'Eligible', allotted: 'Arts', submitted: '04-06-2025 12:11', year: '2025-26', round: 'Counselling' },
  { id: 'APP-2024-09011', name: 'Neha Shah', photo: 'NS', roll: 'CBSE0911', classSec: '10 — A', pct: 82.6, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Accepted', eligibility: 'Eligible', allotted: 'Science', submitted: '12-06-2024 09:40', year: '2024-25', round: 'Round 1' },
  { id: 'APP-2024-09012', name: 'Arjun Nair', photo: 'AN', roll: 'CBSE0912', classSec: '10 — B', pct: 67.4, category: 'OBC', p1: 'Commerce', p2: 'Arts', p3: 'Vocational', status: 'Allotted', eligibility: 'Eligible', allotted: 'Commerce', submitted: '13-06-2024 11:05', year: '2024-25', round: 'Round 1' }
];

const DEFAULT_DOCS: StreamDoc[] = [
  { id: 'D1', student: 'Aarav Patel', roll: 'CBSE1001', type: 'Class 10 Marksheet', uploaded: '05-06-2025', size: '2.1 MB', status: 'Verified', remarks: 'Clear scan' },
  { id: 'D2', student: 'Aarav Patel', roll: 'CBSE1001', type: 'Transfer Certificate', uploaded: '05-06-2025', size: '1.1 MB', status: 'Verified', remarks: '' },
  { id: 'D3', student: 'Diya Sharma', roll: 'CBSE1002', type: 'Caste Certificate', uploaded: '05-06-2025', size: '1.4 MB', status: 'Verified', remarks: '' },
  { id: 'D4', student: 'Rohan Mehta', roll: 'CBSE1003', type: 'Income Certificate', uploaded: '06-06-2025', size: '980 KB', status: 'Rejected', remarks: 'Unclear scan' },
  { id: 'D5', student: 'Rohan Mehta', roll: 'CBSE1003', type: 'Class 10 Marksheet', uploaded: '06-06-2025', size: '1.8 MB', status: 'Pending', remarks: '' },
  { id: 'D6', student: 'Ananya Iyer', roll: 'CBSE1004', type: 'Transfer Certificate', uploaded: '06-06-2025', size: '1.1 MB', status: 'Pending', remarks: '' },
  { id: 'D7', student: 'Kabir Khan', roll: 'CBSE1005', type: 'Class 10 Marksheet', uploaded: '07-06-2025', size: '2.0 MB', status: 'Pending', remarks: '' },
  { id: 'D8', student: 'Meera Joshi', roll: 'CBSE1006', type: 'EWS Certificate', uploaded: '07-06-2025', size: '1.2 MB', status: 'Pending', remarks: '' }
];

const DEFAULT_WAIT: StreamWaitRow[] = [
  { pos: 1, name: 'Rohan Mehta', roll: 'CBSE1003', cat: 'SC', pct: 62, stream: 'Science', comb: 'PCM', why: '1st Pref Full — All Category Seats Gone', date: '19-06-2025', round: 'Round 1', notified: 'Yes' },
  { pos: 2, name: 'Ishaan Gupta', roll: 'CBSE1007', cat: 'OBC', pct: 55.3, stream: 'Science', comb: 'PCB', why: '1st Pref Full', date: '19-06-2025', round: 'Round 1', notified: 'No' },
  { pos: 3, name: 'Meera Joshi', roll: 'CBSE1006', cat: 'EWS', pct: 71.8, stream: 'Commerce', comb: 'Commerce with Math', why: 'EWS seats exhausted', date: '19-06-2025', round: 'Round 1', notified: 'Yes' }
];

export function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function parseSubmitted(s: string): Date | null {
  if (!s || s === '—') return null;
  const m = s.match(/(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0));
}

export function downloadCsv(rows: (string | number)[][], name: string) {
  const blob = new Blob(['\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function streamMeets(pct: number, stream: string) {
  if (stream === 'Science') return pct >= 75;
  if (stream === 'Commerce') return pct >= 60;
  if (stream === 'Arts') return pct >= 45;
  return pct >= 40;
}

export function defaultStreamStore(): StreamStore {
  return {
    applications: STREAM_APPLICATIONS.map((a) => ({ ...a })),
    docs: DEFAULT_DOCS.map((d) => ({ ...d })),
    audit: [
      { at: '23-06-2025 10:12', actor: 'Admin Rao', role: 'Admin', action: 'Allotment Run', entity: 'Round 1', detail: 'Engine executed — 200 allotted', ip: '10.0.1.12' },
      { at: '22-06-2025 16:40', actor: 'Counsellor Mehta', role: 'Counsellor', action: 'Manual Allotment', entity: 'Kabir Khan', detail: 'Commerce — special case medical', ip: '10.0.1.44' },
      { at: '22-06-2025 11:05', actor: 'Verifier Shah', role: 'Verifier', action: 'Document Rejected', entity: 'Rohan Mehta', detail: 'Income certificate unclear scan', ip: '10.0.2.8' },
      { at: '21-06-2025 09:30', actor: 'System', role: 'System', action: 'Waitlist Promote', entity: 'Kabir Khan', detail: 'Seat freed in Science', ip: '—' },
      { at: '20-06-2025 14:18', actor: 'Admin Rao', role: 'Admin', action: 'Eligibility Run', entity: 'Batch 2025-26', detail: '258 eligible / 59 not eligible', ip: '10.0.1.12' },
      { at: '19-06-2025 18:02', actor: 'Priya Sharma', role: 'Student', action: 'Preference Submit', entity: 'Application APP-1001', detail: 'Science > Commerce > Arts', ip: '103.21.x.x' }
    ],
    waitlist: DEFAULT_WAIT.map((w) => ({ ...w })),
    counselling: [
      { name: 'Kabir Khan', cat: 'OBC', stream: 'Commerce', comb: 'Commerce with Math', reason: 'Special case — medical', by: 'Counsellor Mehta', date: '22-06-2025' },
      { name: 'Sara Ali', cat: 'SC', stream: 'Arts', comb: 'Humanities', reason: 'Parent request — verified', by: 'Counsellor Mehta', date: '22-06-2025' }
    ],
    movements: [
      { at: '21 Jun 2025', student: 'Kabir Khan', action: 'Promoted — Seat Freed', stream: 'Science', by: 'System (Auto)' },
      { at: '22 Jun 2025', student: 'Sara Ali', action: 'Removed — Student Withdrew', stream: 'Commerce', by: 'Admin' },
      { at: '23 Jun 2025', student: 'Diya Sharma', action: 'Seat Accepted', stream: 'Science', by: 'Student' }
    ],
    checklist: { apps: true, eligibility: true, seats: true, schedule: true, previous: true },
    autoPromote: true,
    notifyWithin: '2 Hours',
    responseWindow: '48 Hours',
    noResponse: 'Move to next',
    lastAllotment: '19 Jun 2025, 09:00',
    currentRound: 'Round 1',
    roundStatus: 'Completed'
  };
}

export function loadStreamStore(): StreamStore {
  try {
    const raw = window.localStorage.getItem(STREAM_STORE_KEY);
    if (!raw) {
      const seed = defaultStreamStore();
      window.localStorage.setItem(STREAM_STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    return { ...defaultStreamStore(), ...JSON.parse(raw) };
  } catch {
    return defaultStreamStore();
  }
}

export function saveStreamStore(store: StreamStore) {
  window.localStorage.setItem(STREAM_STORE_KEY, JSON.stringify(store));
}

export function patchStreamStore(mutator: (store: StreamStore) => void) {
  const store = loadStreamStore();
  mutator(store);
  saveStreamStore(store);
  return store;
}

export function pushAudit(store: StreamStore, action: string, entity: string, detail: string, actor = 'Admin Rao', role = 'Admin') {
  store.audit = [{ at: stamp(), actor, role, action, entity, detail, ip: '10.0.1.12' }, ...store.audit];
}

const STATUS_VARIANT: Record<AppStatus, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'primary'> = {
  Draft: 'default',
  Submitted: 'info',
  'Under Review': 'warning',
  Eligible: 'success',
  'Not Eligible': 'danger',
  Allotted: 'primary',
  Waitlisted: 'warning',
  Accepted: 'success',
  Rejected: 'danger'
};

const SUMMARY: { key: AppStatus | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'Total Received', color: 'bg-blue-600' },
  { key: 'Draft', label: 'Draft', color: 'bg-gray-500' },
  { key: 'Submitted', label: 'Submitted', color: 'bg-teal-600' },
  { key: 'Under Review', label: 'Under Review', color: 'bg-yellow-500' },
  { key: 'Eligible', label: 'Eligible', color: 'bg-green-600' },
  { key: 'Not Eligible', label: 'Not Eligible', color: 'bg-red-600' },
  { key: 'Allotted', label: 'Allotted', color: 'bg-purple-600' },
  { key: 'Waitlisted', label: 'Waitlisted', color: 'bg-orange-500' },
  { key: 'Accepted', label: 'Accepted', color: 'bg-emerald-800' },
  { key: 'Rejected', label: 'Rejected', color: 'bg-red-800' }
];

const pctColor = (pct: number) => pct >= 75 ? 'text-green-700 font-semibold' : pct >= 50 ? 'text-yellow-700 font-semibold' : 'text-red-600 font-semibold';

export function runEligibilityOn(app: StreamApplication): StreamApplication {
  const any = streamMeets(app.pct, app.p1) || streamMeets(app.pct, app.p2) || streamMeets(app.pct, app.p3);
  const locked = app.status === 'Allotted' || app.status === 'Accepted' || app.status === 'Waitlisted' || app.status === 'Rejected' || app.status === 'Draft';
  return {
    ...app,
    eligibility: any ? 'Eligible' : 'Not Eligible',
    status: locked ? app.status : any ? 'Eligible' : 'Not Eligible'
  };
}

export function ApplicationsDashboard() {
  const [store, setStore] = useState<StreamStore>(() => loadStreamStore());
  const [year, setYear] = useState('2025-26');
  const [stream, setStream] = useState('all');
  const [status, setStatus] = useState('all');
  const [eligibility, setEligibility] = useState('all');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [round, setRound] = useState('all');
  const [minPct, setMinPct] = useState(0);
  const [maxPct, setMaxPct] = useState(100);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'pct' | 'submitted' | 'status'>('submitted');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StreamApplication | null>(null);
  const [reasonModal, setReasonModal] = useState<{ ids: string[]; action: 'eligible' | 'not-eligible' | 'allot' | 'notify' | 'override' } | null>(null);
  const [reason, setReason] = useState('');
  const [allotStream, setAllotStream] = useState('Science');
  const [mailBody, setMailBody] = useState('Your stream selection application has an update. Please check the parent portal.');

  const persist = (next: StreamStore) => {
    saveStreamStore(next);
    setStore(next);
  };

  const applications = store.applications;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(`${to}T23:59:59`) : null;
    const rows = applications.filter((r) => {
      if (r.year !== year) return false;
      if (stream !== 'all' && r.p1 !== stream && r.p2 !== stream && r.p3 !== stream && r.allotted !== stream) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (eligibility !== 'all' && r.eligibility !== eligibility) return false;
      if (round !== 'all' && r.round !== round) return false;
      if (r.pct < minPct || r.pct > maxPct) return false;
      if (term && !`${r.name} ${r.roll} ${r.id}`.toLowerCase().includes(term)) return false;
      const submittedAt = parseSubmitted(r.submitted);
      if (fromDate && submittedAt && submittedAt < fromDate) return false;
      if (toDate && submittedAt && submittedAt > toDate) return false;
      if ((fromDate || toDate) && !submittedAt) return false;
      return true;
    });
    rows.sort((a, b) => {
      const av = sortBy === 'name' ? a.name : sortBy === 'pct' ? a.pct : sortBy === 'status' ? a.status : a.submitted;
      const bv = sortBy === 'name' ? b.name : sortBy === 'pct' ? b.pct : sortBy === 'status' ? b.status : b.submitted;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [applications, year, stream, status, eligibility, round, minPct, maxPct, search, sortBy, sortDir, from, to]);

  useEffect(() => { setPage(1); }, [year, stream, status, eligibility, round, minPct, maxPct, search, pageSize, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const colOn = (key: string) => !hiddenCols.includes(key);
  const toggleCol = (key: string) => setHiddenCols((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]);

  const reset = () => {
    setStream('all'); setStatus('all'); setEligibility('all'); setRound('all');
    setMinPct(0); setMaxPct(100); setFrom(''); setTo(''); setSearch(''); setSelected([]); setPage(1);
  };

  const updateApps = (ids: string[], mapper: (app: StreamApplication) => StreamApplication, auditAction: string, detail: string) => {
    const next = { ...store, applications: store.applications.map((a) => ids.includes(a.id) ? mapper(a) : a) };
    pushAudit(next, auditAction, ids.join(', '), detail);
    persist(next);
  };

  const runCheck = (ids: string[]) => {
    updateApps(ids, runEligibilityOn, 'Eligibility Run', `Eligibility re-checked for ${ids.length} application(s).`);
    setNotice(`Eligibility check completed for ${ids.length} student(s).`);
    setSelected([]);
  };

  const applyReasonAction = () => {
    if (!reasonModal) return;
    if (reasonModal.action !== 'notify' && reasonModal.action !== 'allot' && reason.trim().length < 8) {
      setNotice('A reason of at least 8 characters is required.');
      return;
    }
    if (reasonModal.action === 'eligible' || reasonModal.action === 'override') {
      updateApps(reasonModal.ids, (a) => ({ ...a, eligibility: 'Eligible', status: a.status === 'Draft' ? a.status : 'Eligible' }), 'Mark Eligible', reason || 'Override');
      setNotice(`Marked ${reasonModal.ids.length} student(s) eligible.`);
    } else if (reasonModal.action === 'not-eligible') {
      updateApps(reasonModal.ids, (a) => ({ ...a, eligibility: 'Not Eligible', status: 'Not Eligible' }), 'Mark Not Eligible', reason);
      setNotice(`Marked ${reasonModal.ids.length} student(s) not eligible.`);
    } else if (reasonModal.action === 'allot') {
      updateApps(reasonModal.ids, (a) => ({ ...a, status: 'Allotted', allotted: allotStream, eligibility: 'Eligible' }), 'Manual Allotment', `${allotStream} — ${reason || 'dashboard allot'}`);
      const nextWait = store.waitlist.filter((w) => !reasonModal.ids.some((id) => store.applications.find((a) => a.id === id)?.roll === w.roll));
      persist({ ...loadStreamStore(), waitlist: nextWait });
      setNotice(`Allotted ${allotStream} to ${reasonModal.ids.length} student(s).`);
    } else if (reasonModal.action === 'notify') {
      const next = { ...store };
      pushAudit(next, 'Notification', reasonModal.ids.join(', '), mailBody);
      persist(next);
      setNotice(`Notification sent to ${reasonModal.ids.length} student(s).`);
    }
    setReasonModal(null);
    setReason('');
    setSelected([]);
  };

  if (viewing) {
    return (
      <StudentApplicationDetail
        application={viewing}
        onBack={() => setViewing(null)}
        onChange={(updated) => {
          const next = { ...store, applications: store.applications.map((a) => a.id === updated.id ? updated : a) };
          persist(next);
          setViewing(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Applications</p>
          <h1 className="text-2xl font-bold text-gray-900">Student Applications</h1>
          <p className="text-sm text-gray-500">View and manage all stream selection applications</p>
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>2025-26</option>
          <option>2024-25</option>
          <option>2023-24</option>
        </select>
      </div>

      {notice && (
        <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>×</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {SUMMARY.map((card) => {
          const count = card.key === 'all' ? applications.filter((r) => r.year === year).length : applications.filter((r) => r.year === year && r.status === card.key).length;
          return (
            <button key={card.label} type="button" onClick={() => { setStatus(card.key === 'all' ? 'all' : card.key); setPage(1); }} className={`${card.color} text-white rounded-xl p-3 text-left`}>
              <p className="text-xs text-white/80">{card.label}</p>
              <p className="text-2xl font-bold">{count}</p>
            </button>
          );
        })}
        <button type="button" onClick={() => { setStatus('Submitted'); setPage(1); }} className="bg-amber-600 text-white rounded-xl p-3 text-left">
          <p className="text-xs text-white/80">Pending Response</p>
          <p className="text-2xl font-bold">{applications.filter((r) => r.year === year && (r.status === 'Submitted' || r.status === 'Under Review')).length}</p>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 gap-3 items-end border-b">
          <select value={stream} onChange={(e) => setStream(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {['all', 'Science', 'Commerce', 'Arts', 'Vocational'].map((o) => <option key={o} value={o}>{o === 'all' ? 'All Streams' : o}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Status</option>
            {SUMMARY.filter((s) => s.key !== 'all').map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={eligibility} onChange={(e) => setEligibility(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Eligibility</option>
            <option value="Eligible">Eligible</option>
            <option value="Not Eligible">Not Eligible</option>
            <option value="Pending">Pending</option>
          </select>
          <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {['all', 'Round 1', 'Round 2', 'Round 3'].map((o) => <option key={o} value={o}>{o === 'all' ? 'All Rounds' : o}</option>)}
          </select>
          <div className="text-xs text-gray-600">
            Marks {minPct}% – {maxPct}%
            <input type="range" min={0} max={100} value={minPct} onChange={(e) => setMinPct(Number(e.target.value))} className="w-full" />
            <input type="range" min={0} max={100} value={maxPct} onChange={(e) => setMaxPct(Number(e.target.value))} className="w-full" />
          </div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name / roll / admission" className="w-full pl-8 pr-2 py-2 border rounded-lg text-sm" />
            </div>
            <button type="button" onClick={reset} className="text-xs text-indigo-600 whitespace-nowrap"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset</button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-4 py-3 bg-indigo-50 border-b flex flex-wrap gap-2 items-center">
            <span className="text-sm text-indigo-800 font-medium">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => runCheck(selected)}><Play className="w-3.5 h-3.5 mr-1" /> Run Eligibility Check</Button>
            <Button size="sm" variant="outline" onClick={() => setReasonModal({ ids: selected, action: 'eligible' })}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark as Eligible</Button>
            <Button size="sm" variant="outline" onClick={() => setReasonModal({ ids: selected, action: 'not-eligible' })}><XCircle className="w-3.5 h-3.5 mr-1" /> Mark as Not Eligible</Button>
            <Button size="sm" variant="outline" onClick={() => setReasonModal({ ids: selected, action: 'notify' })}><Mail className="w-3.5 h-3.5 mr-1" /> Send Notification</Button>
            <Button size="sm" variant="outline" onClick={() => downloadCsv([['ID', 'Name', 'Roll', 'Status'], ...filtered.filter((r) => selected.includes(r.id)).map((r) => [r.id, r.name, r.roll, r.status])], 'selected-applications.csv')}><Download className="w-3.5 h-3.5 mr-1" /> Export Selected</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear Selection</Button>
          </div>
        )}

        <div className="px-4 py-2 flex flex-wrap items-center gap-3 text-sm border-b bg-gray-50">
          <label>Rows <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">{[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}</select></label>
          <label>Sort <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="border rounded px-2 py-1">
            <option value="name">Name</option><option value="pct">Aggregate %</option><option value="submitted">Submission Date</option><option value="status">Status</option>
          </select></label>
          <label>Order <select value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')} className="border rounded px-2 py-1"><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
          <label>Density <select value={density} onChange={(e) => setDensity(e.target.value as typeof density)} className="border rounded px-2 py-1"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>
          <span className="inline-flex items-center gap-1 text-gray-500"><SlidersHorizontal className="w-3.5 h-3.5" /> Columns</span>
          {['roll', 'p2', 'p3', 'allotted'].map((c) => (
            <label key={c} className="text-xs"><input type="checkbox" checked={colOn(c)} onChange={() => toggleCol(c)} className="mr-1" />{c}</label>
          ))}
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={() => downloadCsv([['ID', 'Student', 'Roll', '%', 'Status'], ...filtered.map((r) => [r.id, r.name, r.roll, r.pct, r.status])], 'applications.csv')}><FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel</Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="w-3.5 h-3.5 mr-1" /> Print / PDF</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" checked={pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))} onChange={(e) => setSelected(e.target.checked ? Array.from(new Set([...selected, ...pageRows.map((r) => r.id)])) : selected.filter((id) => !pageRows.some((r) => r.id === id)))} /></th>
                {['#', 'Student', 'Roll Number', 'Class & Section', 'Aggregate %', '1st Preference', '2nd Preference', '3rd Preference', 'Status', 'Eligibility', 'Allotted Stream', 'Submitted On', 'Actions'].map((h) =>
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageRows.length === 0 && (
                <tr><td colSpan={14} className="px-3 py-8 text-center text-gray-400">No applications match the current filters.</td></tr>
              )}
              {pageRows.map((row, idx) => (
                <tr key={row.id} className={`hover:bg-gray-50 ${density === 'compact' ? 'text-xs' : ''}`}>
                  <td className={density === 'compact' ? 'px-2 py-1' : 'px-3 py-2'}><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((s) => s.includes(row.id) ? s.filter((id) => id !== row.id) : [...s, row.id])} /></td>
                  <td className="px-3 py-2 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-2">
                    <button type="button" className="flex items-center gap-2 text-left" onClick={() => setViewing(row)}>
                      <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">{row.photo}</span>
                      <span className="font-medium text-indigo-700 hover:underline">{row.name}</span>
                    </button>
                  </td>
                  <td className="px-3 py-2">{colOn('roll') ? row.roll : '—'}</td>
                  <td className="px-3 py-2">{row.classSec}</td>
                  <td className={`px-3 py-2 ${pctColor(row.pct)}`}>{row.pct.toFixed(1)}%</td>
                  <td className="px-3 py-2"><Badge variant="info">{row.p1}</Badge></td>
                  <td className="px-3 py-2">{colOn('p2') ? <Badge variant="outline">{row.p2}</Badge> : '—'}</td>
                  <td className="px-3 py-2">{colOn('p3') ? <Badge variant="outline">{row.p3}</Badge> : '—'}</td>
                  <td className="px-3 py-2"><Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge></td>
                  <td className="px-3 py-2">{row.eligibility === 'Eligible' ? '✅ Eligible' : row.eligibility === 'Not Eligible' ? '❌ Not Eligible' : '⏳ Pending'}</td>
                  <td className="px-3 py-2">{colOn('allotted') ? (row.allotted || '—') : '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.submitted}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" title="View" onClick={() => setViewing(row)} className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                      <button type="button" title="Check" onClick={() => runCheck([row.id])} className="p-1.5 hover:bg-gray-100 rounded"><Play className="w-4 h-4" /></button>
                      <button type="button" title="Override" onClick={() => setReasonModal({ ids: [row.id], action: 'override' })} className="p-1.5 hover:bg-gray-100 rounded"><CheckCircle className="w-4 h-4" /></button>
                      <button type="button" title="Allot" onClick={() => { setAllotStream(row.p1); setReasonModal({ ids: [row.id], action: 'allot' }); }} className="p-1.5 hover:bg-gray-100 rounded text-indigo-600">🎯</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 text-sm border-t">
          <span>{filtered.length} applications</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="px-2 py-1">Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(reasonModal)}
        onClose={() => setReasonModal(null)}
        title={reasonModal?.action === 'notify' ? 'Send Notification' : reasonModal?.action === 'allot' ? 'Manual Allotment' : reasonModal?.action === 'not-eligible' ? 'Mark Not Eligible' : 'Mark Eligible'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReasonModal(null)}>Cancel</Button>
            <Button onClick={applyReasonAction}>Confirm</Button>
          </div>
        }>
        {reasonModal?.action === 'allot' && (
          <select value={allotStream} onChange={(e) => setAllotStream(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded-lg text-sm">
            {['Science', 'Commerce', 'Arts', 'Vocational'].map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
        {reasonModal?.action === 'notify' ? (
          <Textarea rows={4} value={mailBody} onChange={(e) => setMailBody(e.target.value)} />
        ) : (
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (min 8 characters)" />
        )}
      </Modal>
    </div>
  );
}

export default ApplicationsDashboard;
