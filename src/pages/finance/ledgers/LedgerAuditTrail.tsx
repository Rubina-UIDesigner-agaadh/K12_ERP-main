import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Printer, FileText, FileSpreadsheet, Eye, ShieldCheck, Mail, X,
  CheckCircle, Flag, Bell, FileDown,
} from 'lucide-react';

// ───────────────────────────── Types & Data ─────────────────────────────
type Change = [string, string, string];
interface AuditLog {
  id: string; ts: string; user: string; role: string; dept: string;
  action: string; page: string; record: string; voucher: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Success' | 'Failed' | 'Pending' | 'Flagged';
  ip: string; device: string; session: string; branch: string;
  recordType: string; accountAffected: string; fy: string; period: string;
  changes: Change[]; reason: string; prevAction: string; nextAction: string; flagged?: boolean;
}

const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const PAGES = ['All', 'General Ledger', 'Day Book', 'Cash Book', 'Bank Book', 'Income & Expenditure', 'Balance Sheet', 'Login', 'Audit Trail'];
const ACTION_TYPES = ['All', 'Created', 'Edited', 'Deleted', 'Approved', 'Rejected', 'Reversed', 'Viewed', 'Exported', 'Printed', 'Reconciled', 'Verified', 'Period', 'Login', 'Locked'];
const USERS = ['All', 'Ramesh Sharma', 'Priya Gupta', 'Suresh Patel', 'Anita Roy', 'Mr. Verma', 'Ms. Joshi', 'Unknown'];
const ROLES = ['All', 'Super Admin', 'Finance Manager', 'Accountant', 'Auditor', 'Principal'];
const SEVERITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['All', 'Success', 'Failed', 'Pending', 'Flagged'];

const AUD_DATA: Record<string, AuditLog[]> = {
  'FY 2025-26': [
    { id: 'AUD-2025-00001', ts: '2025-09-27T09:01', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '✅ Created Journal Entry', page: 'General Ledger', record: 'Cash A/c', voucher: 'JV-2025-001', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'Main Campus', recordType: 'Journal Entry', accountAffected: 'Cash Account', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '—', '✅ Draft Created'], ['Debit Account', '—', 'Cash Account'], ['Credit Account', '—', 'Tuition Fee Revenue'], ['Amount', '—', '₹ 15,000']], reason: '', prevAction: '—', nextAction: 'AUD-2025-00002' },
    { id: 'AUD-2025-00002', ts: '2025-09-27T09:15', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '✅ Submitted for Approval', page: 'General Ledger', record: 'JV-2025-001', voucher: 'JV-2025-001', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'Main Campus', recordType: 'Journal Entry', accountAffected: 'Cash Account', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '📝 Draft', '⏳ Pending Approval']], reason: '', prevAction: 'AUD-2025-00001', nextAction: 'AUD-2025-00003' },
    { id: 'AUD-2025-00003', ts: '2025-09-27T09:30', user: 'Priya Gupta', role: 'Finance Manager', dept: 'Finance', action: '✅ Approved Journal Entry', page: 'General Ledger', record: 'JV-2025-001', voucher: 'JV-2025-001', severity: 'Low', status: 'Success', ip: '192.168.1.12', device: 'Edge 119 — Windows 11', session: 'SES-20250927-00012', branch: 'Main Campus', recordType: 'Journal Entry', accountAffected: 'Cash Account', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '⏳ Pending Approval', '✅ Approved']], reason: 'Verified against fee receipt register.', prevAction: 'AUD-2025-00002', nextAction: 'AUD-2025-00017' },
    { id: 'AUD-2025-00017', ts: '2025-09-27T09:45', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '📥 Exported Day Book Excel', page: 'Day Book', record: 'Sep-2025 Day Book', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'All Branches', recordType: 'Report', accountAffected: '—', fy: 'FY 2025-26', period: 'Sep 2025', changes: [], reason: '', prevAction: 'AUD-2025-00003', nextAction: 'AUD-2025-00004' },
    { id: 'AUD-2025-00018', ts: '2025-09-27T10:05', user: 'Anita Roy', role: 'Finance Manager', dept: 'Finance', action: '📝 Edited Day Book Entry', page: 'Day Book', record: 'PV-2025-009', voucher: 'PV-2025-009', severity: 'Medium', status: 'Success', ip: '192.168.1.19', device: 'Safari 17 — macOS 14', session: 'SES-20250927-00021', branch: 'South Branch', recordType: 'Day Book Entry', accountAffected: 'Maintenance A/c', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Amount', '₹ 2,000', '₹ 2,500'], ['Narration', 'Repair work', 'Repair work - Block B']], reason: 'Amount corrected as per work order.', prevAction: 'AUD-2025-00004', nextAction: 'AUD-2025-00005' },
    { id: 'AUD-2025-00004', ts: '2025-09-27T10:00', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '📝 Edited Cash Entry', page: 'Cash Book', record: 'RV-2025-005', voucher: 'RV-2025-005', severity: 'Medium', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'Main Campus', recordType: 'Cash Entry', accountAffected: 'Exam Fee A/c', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Amount', '₹ 4,500', '₹ 5,000'], ['Narration', 'Exam Fee batch', 'Exam Fee - Batch X (32 students)']], reason: 'Batch count corrected.', prevAction: 'AUD-2025-00017', nextAction: 'AUD-2025-00005' },
    { id: 'AUD-2025-00005', ts: '2025-09-27T10:15', user: 'Priya Gupta', role: 'Finance Manager', dept: 'Finance', action: '✅ Approved Cash Entry', page: 'Cash Book', record: 'RV-2025-005', voucher: 'RV-2025-005', severity: 'Low', status: 'Success', ip: '192.168.1.12', device: 'Edge 119 — Windows 11', session: 'SES-20250927-00012', branch: 'Main Campus', recordType: 'Cash Entry', accountAffected: 'Exam Fee A/c', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '⏳ Pending', '✅ Approved']], reason: '', prevAction: 'AUD-2025-00004', nextAction: 'AUD-2025-00006' },
    { id: 'AUD-2025-00006', ts: '2025-09-27T10:45', user: 'Suresh Patel', role: 'Accountant', dept: 'Finance', action: '🗑️ Deleted Journal Entry', page: 'General Ledger', record: 'JV-2025-002', voucher: 'JV-2025-002', severity: 'High', status: 'Success', ip: '192.168.1.51', device: 'Chrome 117 — Ubuntu 22.04', session: 'SES-20250927-00045', branch: 'Main Campus', recordType: 'Journal Entry', accountAffected: 'Cash Account', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '✅ Approved', '🗑️ Deleted'], ['Debit Account', 'Cash Account', '—'], ['Credit Account', 'Tuition Fee Revenue', '—'], ['Amount', '₹ 15,000', '—'], ['Narration', 'Fee from Rahul Kumar', '—']], reason: 'Duplicate entry — already recorded in RV-2025-001.', prevAction: 'AUD-2025-00003', nextAction: 'AUD-2025-00007' },
    { id: 'AUD-2025-00007', ts: '2025-09-27T11:00', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '🔄 Reversed Entry', page: 'General Ledger', record: 'JV-2025-003', voucher: 'JV-2025-003', severity: 'High', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'North Branch', recordType: 'Journal Entry', accountAffected: 'Bank Account - SBI', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Entry Status', '✅ Approved', '🔄 Reversed'], ['Contra Voucher', '—', 'JV-2025-003R']], reason: 'Wrong bank account selected.', prevAction: 'AUD-2025-00006', nextAction: 'AUD-2025-00008' },
    { id: 'AUD-2025-00008', ts: '2025-09-27T11:30', user: 'Anita Roy', role: 'Finance Manager', dept: 'Finance', action: '🔄 Bank Reconciliation Done', page: 'Bank Book', record: 'SBI A/c Sep-25', voucher: '—', severity: 'Medium', status: 'Success', ip: '192.168.1.19', device: 'Safari 17 — macOS 14', session: 'SES-20250927-00021', branch: 'Main Campus', recordType: 'Bank Reconciliation', accountAffected: 'Bank Account - SBI', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Reconciliation Status', '🔴 Not Reconciled', '🟡 Partially Reconciled'], ['Items Reconciled', '0', '5']], reason: '', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00009', ts: '2025-09-27T12:00', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '📥 Exported Balance Sheet PDF', page: 'Balance Sheet', record: 'FY 2025-26', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'All Branches', recordType: 'Report', accountAffected: '—', fy: 'FY 2025-26', period: 'As on 30-Sep-2025', changes: [], reason: '', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00010', ts: '2025-09-27T12:30', user: 'Unknown', role: '—', dept: '—', action: '🚨 Failed Login Attempt', page: 'Login', record: 'Finance Module', voucher: '—', severity: 'Critical', status: 'Failed', ip: '10.0.0.25', device: 'Unknown Device', session: '—', branch: 'Main Campus', recordType: 'Security', accountAffected: '—', fy: 'FY 2025-26', period: 'Sep 2025', changes: [], reason: '3 failed attempts from same IP within 10 minutes.', prevAction: '—', nextAction: '—', flagged: true },
    { id: 'AUD-2025-00011', ts: '2025-09-27T13:00', user: 'Suresh Patel', role: 'Accountant', dept: 'Finance', action: '💰 Cash Verification Done', page: 'Cash Book', record: 'Cash A/c Sep-25', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.51', device: 'Chrome 117 — Ubuntu 22.04', session: 'SES-20250927-00045', branch: 'Main Campus', recordType: 'Cash Verification', accountAffected: 'Cash in Hand', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Book Balance', '₹ 58,500', '₹ 58,500'], ['Physical Cash', '—', '₹ 58,500'], ['Difference', '—', '₹ 0 ✅']], reason: '', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00012', ts: '2025-09-27T14:00', user: 'Priya Gupta', role: 'Finance Manager', dept: 'Finance', action: '🔒 Accounting Period Closed', page: 'General Ledger', record: 'Sep-2025 Period', voucher: '—', severity: 'High', status: 'Success', ip: '192.168.1.12', device: 'Edge 119 — Windows 11', session: 'SES-20250927-00012', branch: 'All Branches', recordType: 'Accounting Period', accountAffected: '—', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Period Status', '🟢 Open', '🔒 Closed']], reason: 'Month-end closing completed.', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00013', ts: '2025-09-27T15:00', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '📊 Generated I&E Report', page: 'Income & Expenditure', record: 'Apr-Sep 2025', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 118 — Windows 11', session: 'SES-20250927-00041', branch: 'All Branches', recordType: 'Report', accountAffected: '—', fy: 'FY 2025-26', period: 'Apr-Sep 2025', changes: [], reason: '', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00014', ts: '2025-09-27T16:00', user: 'Anita Roy', role: 'Finance Manager', dept: 'Finance', action: '⚠️ Modified Approved Entry', page: 'Bank Book', record: 'PV-2025-010', voucher: 'PV-2025-010', severity: 'Critical', status: 'Success', ip: '192.168.1.19', device: 'Safari 17 — macOS 14', session: 'SES-20250927-00021', branch: 'Main Campus', recordType: 'Bank Entry', accountAffected: 'Accounts Payable', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Amount', '₹ 45,000', '₹ 50,000'], ['Party', 'ABC Co', 'ABC Vendors Pvt Ltd']], reason: 'Invoice amount verified against vendor bill.', prevAction: 'AUD-2025-00008', nextAction: '—', flagged: true },
    { id: 'AUD-2025-00015', ts: '2025-09-27T16:30', user: 'Admin User', role: 'Super Admin', dept: 'Administration', action: '🔒 Locked Audit Log', page: 'Audit Trail', record: 'Sep-2025 Log', voucher: '—', severity: 'High', status: 'Success', ip: '192.168.1.2', device: 'Chrome 119 — Windows 11', session: 'SES-20250927-00001', branch: 'All Branches', recordType: 'Audit Log', accountAffected: '—', fy: 'FY 2025-26', period: 'Sep 2025', changes: [['Log Status', '🔓 Unlocked', '🔒 Locked']], reason: 'Monthly audit freeze.', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2025-00016', ts: '2025-09-26T23:45', user: 'Suresh Patel', role: 'Accountant', dept: 'Finance', action: '🔐 User Login', page: 'Login', record: 'Finance Module', voucher: '—', severity: 'Medium', status: 'Success', ip: '192.168.1.51', device: 'Chrome 117 — Ubuntu 22.04', session: 'SES-20250926-00099', branch: 'Main Campus', recordType: 'Security', accountAffected: '—', fy: 'FY 2025-26', period: 'Sep 2025', changes: [], reason: '', prevAction: '—', nextAction: '—', flagged: true },
  ],
  'FY 2024-25': [
    { id: 'AUD-2024-0101', ts: '2024-09-27T10:10', user: 'Ramesh Sharma', role: 'Accountant', dept: 'Finance', action: '✅ Created Bank Entry', page: 'Bank Book', record: 'RV-2024-110', voucher: 'RV-2024-110', severity: 'Low', status: 'Success', ip: '192.168.1.45', device: 'Chrome 112 — Windows 10', session: 'SES-20240927-00012', branch: 'Main Campus', recordType: 'Bank Entry', accountAffected: 'Grant A/c', fy: 'FY 2024-25', period: 'Sep 2024', changes: [['Amount', '—', '₹ 1,50,000']], reason: '', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2024-0102', ts: '2024-09-27T11:25', user: 'Priya Gupta', role: 'Finance Manager', dept: 'Finance', action: '✅ Approved Bank Entry', page: 'Bank Book', record: 'RV-2024-110', voucher: 'RV-2024-110', severity: 'Low', status: 'Success', ip: '192.168.1.12', device: 'Edge 112 — Windows 10', session: 'SES-20240927-00003', branch: 'Main Campus', recordType: 'Bank Entry', accountAffected: 'Grant A/c', fy: 'FY 2024-25', period: 'Sep 2024', changes: [['Entry Status', '⏳ Pending', '✅ Approved']], reason: '', prevAction: 'AUD-2024-0101', nextAction: '—' },
    { id: 'AUD-2024-0103', ts: '2024-09-27T14:40', user: 'Ms. Joshi', role: 'Auditor', dept: 'Audit', action: '📥 Exported Audit Log Excel', page: 'Audit Trail', record: 'Sep-2024 Log', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.77', device: 'Firefox 115 — Windows 10', session: 'SES-20240927-00055', branch: 'All Branches', recordType: 'Report', accountAffected: '—', fy: 'FY 2024-25', period: 'Sep 2024', changes: [], reason: 'Quarterly audit review.', prevAction: '—', nextAction: '—' },
    { id: 'AUD-2024-0104', ts: '2024-09-27T17:05', user: 'Mr. Verma', role: 'Principal', dept: 'Administration', action: '👁️ Viewed Balance Sheet', page: 'Balance Sheet', record: 'FY 2024-25', voucher: '—', severity: 'Low', status: 'Success', ip: '192.168.1.5', device: 'Safari 16 — iPadOS 16', session: 'SES-20240927-00061', branch: 'All Branches', recordType: 'Report', accountAffected: '—', fy: 'FY 2024-25', period: 'As on 30-Sep-2024', changes: [], reason: '', prevAction: '—', nextAction: '—' },
  ],
};

const sevBadge = (s: string) =>
  s === 'Low' ? <Badge variant="success">🟢 Low</Badge>
    : s === 'Medium' ? <Badge variant="warning">🟡 Medium</Badge>
      : s === 'High' ? <Badge variant="danger">🔴 High</Badge>
        : <Badge variant="danger">🚨 Critical</Badge>;
const stBadge = (s: string) =>
  s === 'Success' ? <Badge variant="success">✅ Success</Badge>
    : s === 'Failed' ? <Badge variant="danger">❌ Failed</Badge>
      : s === 'Pending' ? <Badge variant="warning">⏳ Pending</Badge>
        : <Badge variant="warning">⚠️ Flagged</Badge>;

// ───────────────────────────── Main Page ─────────────────────────────
export function LedgerAuditTrail() {
  const [fy, setFy] = useState('FY 2025-26');
  const [branch, setBranch] = useState('All');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [page, setPageF] = useState('All');
  const [actionType, setActionType] = useState('All');
  const [user, setUser] = useState('All');
  const [role, setRole] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [ipFilter, setIpFilter] = useState('');
  const [applied, setApplied] = useState(false);
  const [tab, setTab] = useState('All');
  const [logs, setLogs] = useState<AuditLog[]>(AUD_DATA['FY 2025-26']);
  const [locked, setLocked] = useState(false);
  const [viewLog, setViewLog] = useState<AuditLog | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const changeFy = (v: string) => {
    setFy(v); setLogs(AUD_DATA[v] || []); setApplied(false); setTab('All'); setUser('All');
    setDateFrom(v === 'FY 2025-26' ? '2025-09-01' : '2024-09-01');
    setDateTo(v === 'FY 2025-26' ? '2025-09-30' : '2024-09-30');
    showToast(`Audit logs loaded for ${v}.`);
  };

  const matchAction = (a: string) => {
    if (actionType === 'All') return true;
    if (actionType === 'Period') return /Period|Financial Year/i.test(a);
    if (actionType === 'Verified') return /Verification|Verified/i.test(a);
    return a.toLowerCase().includes(actionType.toLowerCase());
  };

  const base = useMemo(() => logs.filter((l) => {
    if (branch !== 'All' && l.branch !== branch && l.branch !== 'All Branches') return false;
    if (tab === '⚠️ Flagged') return !!l.flagged;
    if (tab !== 'All' && l.page !== tab) return false;
    if (applied) {
      if (search) {
        const q = search.toLowerCase();
        if (![l.user, l.action, l.record, l.voucher, l.ip].some((f) => f.toLowerCase().includes(q))) return false;
      }
      const d = l.ts.slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      if (page !== 'All' && l.page !== page) return false;
      if (!matchAction(l.action)) return false;
      if (user !== 'All' && l.user !== user) return false;
      if (role !== 'All' && l.role !== role) return false;
      if (severity !== 'All' && l.severity !== severity) return false;
      if (status !== 'All' && l.status !== status) return false;
      if (ipFilter && !l.ip.includes(ipFilter)) return false;
    }
    return true;
  }), [logs, branch, tab, applied, search, dateFrom, dateTo, page, actionType, user, role, severity, status, ipFilter]);

  const alerts = useMemo(() => {
    const list: { log: AuditLog; text: string; tone: string }[] = [];
    const failed = logs.filter((l) => l.status === 'Failed');
    if (failed.length >= 1) failed.forEach((l) => list.push({ log: l, text: `🚨 Failed login from IP ${l.ip}`, tone: 'text-red-600 bg-red-50 border-red-200' }));
    logs.filter((l) => l.flagged && l.status !== 'Failed').forEach((l) => list.push({ log: l, text: l.action.includes('Modified') ? `🚨 ${l.action.replace('⚠️ ', '')} — ${l.voucher}` : l.action.includes('Login') ? `🔴 Login outside business hours — ${l.user}` : `🟡 ${l.action} — ${l.record}`, tone: l.action.includes('Modified') || l.status === 'Failed' ? 'text-red-600 bg-red-50 border-red-200' : 'text-amber-700 bg-amber-50 border-amber-200' }));
    const highDel = logs.filter((l) => /Deleted/i.test(l.action));
    if (highDel.length >= 2) list.push({ log: highDel[0], text: `🔴 ${highDel.length} entries deleted in 2 days — review bulk deletions`, tone: 'text-red-600 bg-red-50 border-red-200' });
    return list.slice(0, 7);
  }, [logs]);

  const toggleFlag = (l: AuditLog) => {
    setLogs(logs.map((x) => (x.id === l.id ? { ...x, flagged: !x.flagged, status: !x.flagged ? 'Flagged' : 'Success' } : x)));
    showToast(l.flagged ? `Flag removed from ${l.id}.` : `${l.id} flagged as suspicious.`);
    if (viewLog?.id === l.id) setViewLog({ ...l, flagged: !l.flagged, status: !l.flagged ? 'Flagged' : 'Success' });
  };
  const doExport = (kind: string) => {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Log ID,Date & Time,User,Role,Action,Page,Record,Voucher,Severity,Status,IP,Branch\n';
    const rows = base.map((l) => [l.id, l.ts, `"${l.user}"`, l.role, `"${l.action}"`, `"${l.page}"`, `"${l.record}"`, l.voucher, l.severity, l.status, l.ip, `"${l.branch}"`].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-trail-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${base.length} audit logs as ${kind.toUpperCase()}.`);
  };
  const resetFilters = () => {
    setSearch(''); setPageF('All'); setActionType('All'); setUser('All'); setRole('All');
    setSeverity('All'); setStatus('All'); setIpFilter(''); setBranch('All'); setTab('All'); setApplied(false);
  };

  const fmtTs = (ts: string) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const tabs = ['All', 'General Ledger', 'Day Book', 'Cash Book', 'Bank Book', 'Income & Expenditure', 'Balance Sheet', '⚠️ Flagged'];
  const tabCount = (t: string) => (t === '⚠️ Flagged' ? logs.filter((l) => l.flagged).length : t === 'All' ? logs.length : logs.filter((l) => l.page === t).length);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" /> Audit Trail — Ledger Module
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tamper-proof activity log of every action across ledger pages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select value={fy} onChange={(e) => changeFy(e.target.value)} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
          </div>
          <Badge variant={locked ? 'success' : 'warning'}>{locked ? '🔒 Locked' : '🔓 Unlocked'}</Badge>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {toast}</span>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Suspicious Activity & Alerts ── */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-red-500" /> Suspicious Activity &amp; Alerts</h3>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm ${a.tone}`}>
              <span className="text-gray-700">{a.text}</span>
              <Button variant="outline" size="sm" onClick={() => setViewLog(a.log)}>🔍 Review</Button>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-sm text-gray-400">No suspicious activity detected. 🎉</p>}
        </div>
      </Card>

      {/* ── Filters ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Input label="Search" placeholder="User, action, voucher, record, IP..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <Select label="Page / Module" value={page} onChange={(e) => setPageF(e.target.value)} options={PAGES.map((v) => ({ value: v, label: v }))} />
          <Select label="Action Type" value={actionType} onChange={(e) => setActionType(e.target.value)} options={ACTION_TYPES.map((v) => ({ value: v, label: v }))} />
          <Select label="User" value={user} onChange={(e) => setUser(e.target.value)} options={USERS.map((v) => ({ value: v, label: v }))} />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)} options={ROLES.map((v) => ({ value: v, label: v }))} />
          <Select label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} options={SEVERITIES.map((v) => ({ value: v, label: v }))} />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES.map((v) => ({ value: v, label: v }))} />
          <Input label="IP Address" value={ipFilter} onChange={(e) => setIpFilter(e.target.value)} placeholder="e.g. 192.168.1" />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => { setApplied(true); showToast('Filters applied.'); }}><Search className="w-4 h-4 mr-2" /> Search</Button>
            <Button variant="outline" onClick={resetFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset Filters</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
            <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
            <Button variant="outline" onClick={() => showToast('Audit report emailed to external-audit@school.in.')}><Mail className="w-4 h-4 mr-2" /> Email Report</Button>
            <Button variant={locked ? 'outline' : 'danger'} onClick={() => { setLocked(!locked); showToast(!locked ? 'Audit log LOCKED — records are now read-only.' : 'Audit log unlocked (Super Admin action).'); }}>
              {locked ? '🔓 Unlock Audit Log' : '🔒 Lock Audit Log'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap border-b border-gray-200">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {t} <span className={`ml-1 text-[10px] rounded-full px-1.5 py-0.5 ${tab === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{tabCount(t)}</span>
          </button>
        ))}
      </div>

      {/* ── Main Audit Table ── */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Audit Log — {tab === '⚠️ Flagged' ? 'Flagged Activities' : tab}</h3>
          <Badge variant="info">{base.length} records · Branch: {branch === 'All' ? 'All' : branch}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 font-semibold uppercase text-xs">#</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Date &amp; Time</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">User</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Role</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Action Performed</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Page / Module</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Record</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Voucher / Ref</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Branch</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-center">Severity</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-center">Status</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {base.map((l, i) => (
                <tr key={l.id} className={`hover:bg-gray-50 ${l.flagged ? 'bg-red-50/40' : ''}`}>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{i + 1}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{fmtTs(l.ts)}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => { setUser(l.user); setApplied(true); showToast(`Filtered: actions by ${l.user}.`); }}>{l.user}</td>
                  <td className="px-3 py-2.5 text-gray-600">{l.role}</td>
                  <td className="px-3 py-2.5 text-gray-800">{l.action}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{l.page}</td>
                  <td className="px-3 py-2.5 text-gray-600 max-w-[140px] truncate" title={l.record}>{l.record}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-blue-600">{l.voucher !== '—' ? l.voucher : '—'}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap text-xs">{l.branch}</td>
                  <td className="px-3 py-2.5 text-center">{sevBadge(l.severity)}</td>
                  <td className="px-3 py-2.5 text-center">{stBadge(l.status)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" title="View Full Detail" onClick={() => setViewLog(l)}><Eye className="w-4 h-4 text-gray-500" /></Button>
                      <Button variant="ghost" size="sm" title={l.flagged ? 'Unflag' : 'Flag as Suspicious'} onClick={() => toggleFlag(l)}>
                        <Flag className={`w-4 h-4 ${l.flagged ? 'text-red-500 fill-red-100' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {base.length === 0 && <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-500">No audit logs match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Page Generated On: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Verma (Super Admin) · {fy} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>🔐 Audit Records: Tamper-Proof &amp; Immutable · EduManager School ERP · © 2026</span>
      </div>

      {/* ── Audit Detail Drilldown ── */}
      {viewLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Audit Log Detail — {viewLog.id}</h3>
              <button onClick={() => setViewLog(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5 max-h-[62vh] overflow-y-auto custom-scrollbar">
              {/* Basic */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">📋 Basic Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {([
                    ['Audit Log ID', viewLog.id], ['Date & Time', fmtTs(viewLog.ts)], ['Page / Module', viewLog.page],
                    ['Action Type', viewLog.action], ['Severity', viewLog.severity], ['Status', viewLog.status], ['Branch', viewLog.branch],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
                  ))}
                </div>
              </div>
              {/* User */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">👤 User Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {([
                    ['User Name', viewLog.user], ['Role', viewLog.role], ['Department', `${viewLog.dept} Department`],
                    ['IP Address', viewLog.ip], ['Device / Browser', viewLog.device], ['Session ID', viewLog.session],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
                  ))}
                </div>
              </div>
              {/* Record */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">📄 Record Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {([
                    ['Record Type', viewLog.recordType], ['Voucher No.', viewLog.voucher], ['Account Affected', viewLog.accountAffected],
                    ['Financial Year', viewLog.fy], ['Period', viewLog.period],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
                  ))}
                </div>
              </div>
              {/* Changes */}
              {viewLog.changes.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">🔄 Change Details (Before vs After)</p>
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Field</th>
                        <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Before</th>
                        <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewLog.changes.map((c) => (
                        <tr key={c[0]}>
                          <td className="px-3 py-2 font-medium text-gray-800">{c[0]}</td>
                          <td className="px-3 py-2 text-red-600">{c[1]}</td>
                          <td className="px-3 py-2 text-green-700">{c[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Reason + related */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">📝 Reason / Remarks</p>
                  <p className="text-gray-700 italic">{viewLog.reason || 'No reason recorded.'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">🔗 Related Records</p>
                  <p className="text-gray-700">Previous: {viewLog.prevAction}</p>
                  <p className="text-gray-700">Next: {viewLog.nextAction}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print This Log</Button>
              <Button variant="outline" onClick={() => showToast(`${viewLog.id} exported.`)}><FileDown className="w-4 h-4 mr-2" /> Export</Button>
              <Button variant={viewLog.flagged ? 'outline' : 'danger'} onClick={() => toggleFlag(viewLog)}>
                <Flag className={`w-4 h-4 mr-2 ${viewLog.flagged ? '' : 'fill-white/20'}`} /> {viewLog.flagged ? 'Unflag' : 'Flag as Suspicious'}
              </Button>
              <Button variant="primary" onClick={() => setViewLog(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
