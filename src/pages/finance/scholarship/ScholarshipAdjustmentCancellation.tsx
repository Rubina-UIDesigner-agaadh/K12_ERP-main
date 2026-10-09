// ScholarshipAdjustmentCancellation.tsx — Scholarship Cancellation (redesigned)
//
// Full cancellation and partial cancellation of sanctioned scholarships.
//
//   ❌ FULL CANCELLATION     — the entire scholarship is cancelled, every future installment
//                              stops, and the already-disbursed amount may or may not be
//                              recovered depending on the recovery policy chosen.
//   🔄 PARTIAL CANCELLATION  — Type A  cancel specific installments
//                              Type B  reduce the scholarship amount
//                              Type C  cancel specific fee components
//                              Type D  suspend temporarily (can be reinstated later)
//
// Page sections
//   1 Header · 2 KPI cards · 3 Tabs · 4 Filters + actions · 5 Active scholarships (cancellable)
//   6 Full cancellation modal · 7 Partial cancellation modal · 8 Cancellation history · 9 Footer
//
// UI-only with mock data (no backend), consistent with the rest of the ERP.

import React, { useMemo, useState } from 'react';
import {
  Ban, Users, XCircle, RefreshCw, IndianRupee, HandCoins, Hourglass, Search, RotateCcw,
  Download, Printer, Mail, Eye, FileText, Upload, AlertTriangle, Info, CheckCircle2, Save,
  ShieldAlert, Undo2, CalendarClock, ListChecks, Paperclip, Gavel, TrendingDown
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

/* ================================================================ types */

type ScholarType = 'Govt.' | 'Internal';
type DisbMode = 'Fee Waiver' | 'Bank Transfer';
type CancelType = 'Full' | 'Partial' | 'Suspend';
type PartialType = 'A' | 'B' | 'C' | 'D';
type RecoveryPolicy = 'full' | 'partial' | 'none' | 'settlement';
type InstStatus = 'Disbursed' | 'Upcoming' | 'Suspended' | 'Cancelled';

interface InstRow {
  no: number;
  name: string;
  amount: number;
  dueDate: string;
  status: InstStatus;
  mode: DisbMode;
  journalNo?: string;
}

interface FeeComponentRow {
  component: string;
  waiverPct: number;
  amount: number;
}

interface ActiveScholarship {
  id: string;
  schNo: string;
  student: string;
  className: string;
  admissionNo: string;
  appNo: string;
  scheme: string;
  schemeType: ScholarType;
  category: string;
  sanctionLetter: string;
  total: number;
  mode: DisbMode;
  frequency: string;
  installments: InstRow[];
  feeComponents: FeeComponentRow[];
}

interface CancelRecord {
  id: string;
  cancelNo: string;
  student: string;
  className: string;
  scheme: string;
  schemeType: ScholarType;
  cancelType: CancelType;
  partialType?: PartialType;
  amountCancelled: number;
  amountRecovered: number;
  reason: string;
  reasonDetail?: string;
  date: string;
  reversed: boolean;
  status: 'Completed' | 'Recovery Pending' | 'Suspended' | 'Reinstated';
  note?: string;
}

/* ============================================================ utilities */

const INR = (n: number) => `₹ ${Math.round(n).toLocaleString('en-IN')}`;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
};
const todayISO = () => new Date().toISOString().slice(0, 10);

const disbursedOf = (s: ActiveScholarship) =>
s.installments.filter((i) => i.status === 'Disbursed').reduce((n, i) => n + i.amount, 0);
const remainingOf = (s: ActiveScholarship) =>
s.installments.filter((i) => i.status === 'Upcoming').reduce((n, i) => n + i.amount, 0);
const pendingInsts = (s: ActiveScholarship) => s.installments.filter((i) => i.status === 'Upcoming' || i.status === 'Suspended');

/* ============================================================== reasons */

const REASONS = [
'Student withdrew / took TC from school',
'Student failed to meet renewal criteria (marks below minimum)',
'Student failed to meet attendance requirement',
'Disciplinary action — student expelled / suspended',
'False information provided in application',
'Student already receiving another scholarship (violation)',
'Parent income exceeded eligibility limit (discovered later)',
'Government cancelled the scheme',
'Government rejected application after school submission',
'Student opted out voluntarily',
'School budget constraints',
'Donor / sponsor withdrew funding',
"Student's category / eligibility changed",
'Student transferred to another school',
'Student expired (death — handled with compassion and sensitivity)',
'Other — specify below'];

const PARTIAL_REASONS = [
'Renewal criteria partially met',
'Attendance below requirement for one term',
'Fee component no longer applicable',
'Medical leave — temporary pause',
'Budget / donor funding reduced',
'Documents pending verification',
'Other — specify below'];

const AUTHORIZERS = ['Principal — Mr. A. Sharma', 'Vice Principal — Mrs. R. Iyer', 'Director — Mr. S. Desai'];
const CANCELLED_BY = 'Finance Manager — Mrs. P. Gupta';

/* ============================================================= mock data */

const fee = (waiverPct: number): FeeComponentRow[] => [
{ component: 'Tuition Fee', waiverPct, amount: 20000 },
{ component: 'Exam Fee', waiverPct, amount: 5000 },
{ component: 'Transport Fee', waiverPct, amount: 3000 },
{ component: 'Activity Fee', waiverPct, amount: 2500 }];


const ACTIVE_SEED: ActiveScholarship[] = [
{
  id: 'a1',
  schNo: 'SCH-2025-001',
  student: 'Rahul Kumar',
  className: 'Class 10-A',
  admissionNo: 'ADM-2022-045',
  appNo: 'APP-2025-001',
  scheme: 'National Merit Scholarship',
  schemeType: 'Govt.',
  category: 'OBC',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/001',
  total: 22500,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 7500, dueDate: '2025-04-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-045' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 7500, dueDate: '2025-07-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-089' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 7500, dueDate: '2025-10-01', status: 'Upcoming', mode: 'Fee Waiver' }],

  feeComponents: fee(50)
},
{
  id: 'a2',
  schNo: 'SCH-2025-002',
  student: 'Priya Sharma',
  className: 'Class 9-B',
  admissionNo: 'ADM-2023-112',
  appNo: 'APP-2025-002',
  scheme: 'School Merit Scholarship',
  schemeType: 'Internal',
  category: 'Merit',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/002',
  total: 15000,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 5000, dueDate: '2025-04-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-046' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 5000, dueDate: '2025-07-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-090' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 5000, dueDate: '2025-09-20', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-131' }],

  feeComponents: fee(50)
},
{
  id: 'a3',
  schNo: 'SCH-2025-003',
  student: 'Ravi Singh',
  className: 'Class 10-B',
  admissionNo: 'ADM-2022-088',
  appNo: 'APP-2025-003',
  scheme: 'Sports Excellence Award',
  schemeType: 'Internal',
  category: 'Sports',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/003',
  total: 9000,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 3000, dueDate: '2025-04-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-047' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 3000, dueDate: '2025-07-01', status: 'Upcoming', mode: 'Fee Waiver' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 3000, dueDate: '2025-10-01', status: 'Upcoming', mode: 'Fee Waiver' }],

  feeComponents: fee(40)
},
{
  id: 'a4',
  schNo: 'SCH-2025-004',
  student: 'Meera Joshi',
  className: 'Class 11-A',
  admissionNo: 'ADM-2021-014',
  appNo: 'APP-2025-004',
  scheme: 'NSP Scholarship',
  schemeType: 'Govt.',
  category: 'General',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/004',
  total: 12500,
  mode: 'Bank Transfer',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 4167, dueDate: '2025-04-01', status: 'Disbursed', mode: 'Bank Transfer', journalNo: 'JV-2025-060' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 4167, dueDate: '2025-07-01', status: 'Disbursed', mode: 'Bank Transfer', journalNo: 'JV-2025-091' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 4166, dueDate: '2025-10-01', status: 'Upcoming', mode: 'Bank Transfer' }],

  feeComponents: fee(50)
},
{
  id: 'a5',
  schNo: 'SCH-2025-005',
  student: 'Sita Patel',
  className: 'Class 8-A',
  admissionNo: 'ADM-2024-033',
  appNo: 'APP-2025-005',
  scheme: 'Need-Based Scholarship',
  schemeType: 'Internal',
  category: 'SC',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/005',
  total: 12000,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 4000, dueDate: '2025-04-01', status: 'Upcoming', mode: 'Fee Waiver' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 4000, dueDate: '2025-07-01', status: 'Upcoming', mode: 'Fee Waiver' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 4000, dueDate: '2025-10-01', status: 'Upcoming', mode: 'Fee Waiver' }],

  feeComponents: fee(45)
},
{
  id: 'a6',
  schNo: 'SCH-2025-006',
  student: 'Amit Verma',
  className: 'Class 7-C',
  admissionNo: 'ADM-2024-071',
  appNo: 'APP-2025-006',
  scheme: 'SC/ST Scholarship',
  schemeType: 'Govt.',
  category: 'ST',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/006',
  total: 18000,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 6000, dueDate: '2025-04-01', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-051' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 6000, dueDate: '2025-07-01', status: 'Upcoming', mode: 'Fee Waiver' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 6000, dueDate: '2025-10-01', status: 'Upcoming', mode: 'Fee Waiver' }],

  feeComponents: fee(50)
},
{
  id: 'a7',
  schNo: 'SCH-2025-007',
  student: 'Ananya Desai',
  className: 'Class 11-B',
  admissionNo: 'ADM-2021-078',
  appNo: 'APP-2025-007',
  scheme: 'State Scholarship',
  schemeType: 'Govt.',
  category: 'Girls',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/007',
  total: 16000,
  mode: 'Bank Transfer',
  frequency: 'Half-Yearly',
  installments: [
  { no: 1, name: 'Half-Year 1 (Apr-Sep)', amount: 8000, dueDate: '2025-06-01', status: 'Disbursed', mode: 'Bank Transfer', journalNo: 'JV-2025-074' },
  { no: 2, name: 'Half-Year 2 (Oct-Mar)', amount: 8000, dueDate: '2025-10-10', status: 'Upcoming', mode: 'Bank Transfer' }],

  feeComponents: fee(40)
},
{
  id: 'a8',
  schNo: 'SCH-2025-008',
  student: 'Mohit Rao',
  className: 'Class 8-B',
  admissionNo: 'ADM-2024-121',
  appNo: 'APP-2025-008',
  scheme: 'Need-Based Scholarship',
  schemeType: 'Internal',
  category: 'Minority',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/008',
  total: 9000,
  mode: 'Fee Waiver',
  frequency: 'Custom',
  installments: [
  { no: 1, name: 'Custom 1 of 3', amount: 3000, dueDate: '2025-04-15', status: 'Disbursed', mode: 'Fee Waiver', journalNo: 'JV-2025-055' },
  { no: 2, name: 'Custom 2 of 3', amount: 3000, dueDate: '2025-06-15', status: 'Suspended', mode: 'Fee Waiver' },
  { no: 3, name: 'Custom 3 of 3', amount: 3000, dueDate: '2025-11-15', status: 'Upcoming', mode: 'Fee Waiver' }],

  feeComponents: fee(35)
}];


const HISTORY_SEED: CancelRecord[] = [
{ id: 'h1', cancelNo: 'CAN-2025-001', student: 'Arjun Nair', className: 'Class 12-A', scheme: 'Merit Scholarship', schemeType: 'Internal', cancelType: 'Full', amountCancelled: 15000, amountRecovered: 4000, reason: 'Student took TC', date: '2025-05-14', reversed: false, status: 'Completed' },
{ id: 'h2', cancelNo: 'CAN-2025-002', student: 'Sunita Rao', className: 'Class 11-C', scheme: 'NSP Scholarship', schemeType: 'Govt.', cancelType: 'Full', amountCancelled: 22500, amountRecovered: 7500, reason: 'False income info found', date: '2025-06-02', reversed: true, status: 'Completed', note: 'Recovered from final settlement / TC fee' },
{ id: 'h3', cancelNo: 'CAN-2025-003', student: 'Kiran Patel', className: 'Class 9-A', scheme: 'Need-Based Scholarship', schemeType: 'Internal', cancelType: 'Partial', partialType: 'A', amountCancelled: 4000, amountRecovered: 0, reason: 'Term 3 — Marks below minimum', date: '2025-06-20', reversed: false, status: 'Completed' },
{ id: 'h4', cancelNo: 'CAN-2025-004', student: 'Deepa Singh', className: 'Class 10-C', scheme: 'Sports Excellence', schemeType: 'Internal', cancelType: 'Partial', partialType: 'C', amountCancelled: 3000, amountRecovered: 0, reason: 'Transport fee component removed', date: '2025-07-08', reversed: false, status: 'Completed' },
{ id: 'h5', cancelNo: 'CAN-2025-005', student: 'Manish Kumar', className: 'Class 12-B', scheme: 'State Scholarship', schemeType: 'Govt.', cancelType: 'Suspend', amountCancelled: 5000, amountRecovered: 0, reason: 'Medical leave — temporary pause', date: '2025-07-19', reversed: false, status: 'Suspended' },
{ id: 'h6', cancelNo: 'CAN-2025-006', student: 'Farhan Sheikh', className: 'Class 11-A', scheme: 'School Merit Scholarship', schemeType: 'Internal', cancelType: 'Full', amountCancelled: 12000, amountRecovered: 12000, reason: 'Student transferred to another school', date: '2025-08-01', reversed: true, status: 'Completed' },
{ id: 'h7', cancelNo: 'CAN-2025-007', student: 'Neha Chauhan', className: 'Class 8-C', scheme: 'Need-Based Scholarship', schemeType: 'Internal', cancelType: 'Full', amountCancelled: 8000, amountRecovered: 0, reason: 'Parent income exceeded eligibility limit', date: '2025-08-12', reversed: false, status: 'Completed' },
{ id: 'h8', cancelNo: 'CAN-2025-008', student: 'Rohit Meena', className: 'Class 9-B', scheme: 'SC/ST Scholarship', schemeType: 'Govt.', cancelType: 'Full', amountCancelled: 5500, amountRecovered: 5500, reason: 'Government rejected application after submission', date: '2025-08-26', reversed: true, status: 'Completed' },
{ id: 'h9', cancelNo: 'CAN-2025-009', student: 'Ishita Roy', className: 'Class 7-A', scheme: 'Merit Scholarship', schemeType: 'Internal', cancelType: 'Partial', partialType: 'B', amountCancelled: 2500, amountRecovered: 0, reason: 'Scholarship amount reduced to 25% waiver', date: '2025-09-03', reversed: false, status: 'Completed' },
{ id: 'h10', cancelNo: 'CAN-2025-010', student: 'Devansh Patel', className: 'Class 10-A', scheme: 'NSP Scholarship', schemeType: 'Govt.', cancelType: 'Full', amountCancelled: 9000, amountRecovered: 0, reason: 'Student withdrew / took TC from school', date: '2025-09-11', reversed: false, status: 'Recovery Pending' },
{ id: 'h11', cancelNo: 'CAN-2025-011', student: 'Sneha Kulkarni', className: 'Class 12-C', scheme: 'Sports Excellence', schemeType: 'Internal', cancelType: 'Partial', partialType: 'D', amountCancelled: 1000, amountRecovered: 0, reason: 'Medical leave — temporary pause', date: '2025-09-15', reversed: false, status: 'Suspended' },
{ id: 'h12', cancelNo: 'CAN-2025-012', student: 'Yash Thakkar', className: 'Class 11-B', scheme: 'State Scholarship', schemeType: 'Govt.', cancelType: 'Full', amountCancelled: 6000, amountRecovered: 6000, reason: 'Student already receiving another scholarship', date: '2025-09-18', reversed: true, status: 'Completed' },
{ id: 'h13', cancelNo: 'CAN-2025-013', student: 'Tanvi Shah', className: 'Class 9-C', scheme: 'Need-Based Scholarship', schemeType: 'Internal', cancelType: 'Partial', partialType: 'A', amountCancelled: 500, amountRecovered: 0, reason: 'Documents pending verification — last installment held', date: '2025-09-22', reversed: false, status: 'Completed' },
{ id: 'h14', cancelNo: 'CAN-2025-014', student: 'Priyanka Soni', className: 'Class 10-D', scheme: 'Merit Scholarship', schemeType: 'Internal', cancelType: 'Full', amountCancelled: 1000, amountRecovered: 0, reason: 'Student opted out voluntarily', date: '2025-09-24', reversed: false, status: 'Completed' }];


const REINSTATED_SEED: CancelRecord[] = [
{ id: 'ri1', cancelNo: 'CAN-2025-005', student: 'Manish Kumar', className: 'Class 12-B', scheme: 'State Scholarship', schemeType: 'Govt.', cancelType: 'Suspend', amountCancelled: 5000, amountRecovered: 0, reason: 'Medical leave — reinstated after fitness certificate', date: '2025-07-19', reversed: false, status: 'Reinstated', note: 'Reinstated on 01-Sep-2025; Term 3 released.' },
{ id: 'ri2', cancelNo: 'CAN-2024-041', student: 'Priyanshu Jain', className: 'Class 10-B', scheme: 'Merit Scholarship', schemeType: 'Internal', cancelType: 'Suspend', amountCancelled: 4000, amountRecovered: 0, reason: 'Disciplinary review — cleared', date: '2024-11-08', reversed: false, status: 'Reinstated', note: 'Reinstated on 05-Jan-2025.' }];


/* ======================================================= small components */

const TH = ({ children, className = '' }: {children?: React.ReactNode;className?: string;}) =>
<th className={`p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${className}`}>{children}</th>;
const TD = ({ children, className = '' }: {children?: React.ReactNode;className?: string;}) =>
<td className={`p-3 text-xs text-gray-700 ${className}`}>{children}</td>;

const typeBadge = (t: ScholarType) =>
t === 'Govt.' ? <Badge variant="info">🏛️ Govt.</Badge> : <Badge variant="success">🏫 Internal</Badge>;

const cancelTypeBadge = (t: CancelType) =>
t === 'Full' ? <Badge variant="danger">❌ Full</Badge> : t === 'Partial' ? <Badge variant="primary">🔄 Partial</Badge> : <Badge variant="warning">🔒 Suspend</Badge>;

const statusBadge = (s: CancelRecord['status']) => {
  switch (s) {
    case 'Completed':
      return <Badge variant="success">Completed</Badge>;
    case 'Recovery Pending':
      return <Badge variant="warning">Recovery pending</Badge>;
    case 'Suspended':
      return <Badge variant="secondary">Suspended</Badge>;
    default:
      return <Badge variant="info">Reinstated</Badge>;
  }
};

const instBadge = (s: InstStatus) => {
  switch (s) {
    case 'Disbursed':
      return <Badge variant="success">✅ Disbursed</Badge>;
    case 'Upcoming':
      return <Badge variant="warning">⏳ Upcoming</Badge>;
    case 'Suspended':
      return <Badge variant="secondary">🔒 Suspended</Badge>;
    default:
      return <Badge variant="danger">❌ Cancelled</Badge>;
  }
};

function Panel({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-3">{children}</div>
    </div>);

}

function JournalPreview({
  title, lines, narration, note
}: {title: string;lines: {account: string;debit?: number;credit?: number;}[];narration: string;note?: string;}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5" /> {title}
      </p>
      {note && <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">⚠️ {note}</p>}
      <table className="w-full text-left text-xs">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <TH>Account</TH>
            <TH className="text-right">Debit</TH>
            <TH className="text-right">Credit</TH>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lines.map((l, i) =>
          <tr key={i}>
              <TD>{l.account}</TD>
              <TD className="text-right">{l.debit ? INR(l.debit) : ''}</TD>
              <TD className="text-right">{l.credit ? INR(l.credit) : ''}</TD>
            </tr>
          )}
        </tbody>
      </table>
      <p className="text-[11px] text-gray-500 mt-2">Narration: {narration}</p>
    </div>);

}

/* ================================================ 6 · FULL cancellation */

function FullCancelModal({
  scholarship, open, onClose, onConfirm
}: {
  scholarship: ActiveScholarship | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {reasons: string[];detail: string;date: string;policy: RecoveryPolicy;recoveryAmount: number;recoveryDeadline: string;reverseWaiver: boolean;notify: boolean;message: string;letter: boolean;authorizer: string;remarks: string;})=>void;
}) {
  const [reasons, setReasons] = useState<string[]>([]);
  const [detail, setDetail] = useState('');
  const [file, setFile] = useState('');
  const [date, setDate] = useState(todayISO());
  const [policy, setPolicy] = useState<RecoveryPolicy>('none');
  const [recoveryAmount, setRecoveryAmount] = useState(0);
  const [recoveryReason, setRecoveryReason] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reverseWaiver, setReverseWaiver] = useState(true);
  const [notify, setNotify] = useState(true);
  const [letter, setLetter] = useState(true);
  const [authorizer, setAuthorizer] = useState(AUTHORIZERS[0]);
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (open && scholarship) {
      setReasons([]);
      setDetail('');
      setFile('');
      setDate(todayISO());
      setPolicy('none');
      setRecoveryAmount(disbursedOf(scholarship));
      setRecoveryReason('');
      setDeadline('');
      setReverseWaiver(true);
      setNotify(true);
      setLetter(true);
      setAuthorizer(AUTHORIZERS[0]);
      setRemarks('');
      setMessage(
        `Dear Parent, this is to inform you that the ${scholarship.scheme} awarded to your ward ${scholarship.student} has been cancelled with effect from ${fmtDate(todayISO())}. Please contact the school finance team for further details. — School Finance Team`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scholarship?.id]);

  if (!scholarship) return null;
  const disb = disbursedOf(scholarship);
  const stopped = remainingOf(scholarship);
  const recoverable = policy === 'full' ? disb : policy === 'partial' ? Math.min(recoveryAmount, disb) : 0;
  const willReinstateFee = reverseWaiver && recoverable > 0;
  const pending = pendingInsts(scholarship);

  const toggleReason = (r: string) =>
  setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const canSubmit = reasons.length > 0 && authorizer.length > 0 && (policy !== 'partial' || recoveryAmount > 0);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`❌ Full Scholarship Cancellation — ${scholarship.student} · ${scholarship.scheme} · ${scholarship.schemeType === 'Govt.' ? '🏛️ Govt.' : '🏫 Internal'}`}
      size="xl"
      footer={
      <div className="flex flex-wrap items-center gap-2">
          <Button
          variant="danger"
          disabled={!canSubmit}
          leftIcon={<XCircle className="w-4 h-4" />}
          onClick={() =>
          onConfirm({ reasons, detail, date, policy, recoveryAmount: recoverable, recoveryDeadline: deadline, reverseWaiver, notify, message, letter, authorizer, remarks })
          }>

            Confirm Full Cancellation
          </Button>
          <Button variant="outline" leftIcon={<Save className="w-4 h-4" />} onClick={onClose}>Save Draft</Button>
          <Button variant="ghost" onClick={onClose}>Abort / Close</Button>
        </div>
      }>

      <div className="space-y-4">
        <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded px-3 py-2 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          WARNING: this will COMPLETELY CANCEL the scholarship. The action is audited and effectively irreversible —
          review the impact summary below carefully before confirming.
        </p>

        <Panel title="Panel 1 · Cancellation Impact Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-700">
            <p><span className="text-gray-500">Student Name:</span> <span className="font-medium">{scholarship.student}</span></p>
            <p><span className="text-gray-500">Class:</span> {scholarship.className} · <span className="text-gray-500">Adm:</span> {scholarship.admissionNo}</p>
            <p><span className="text-gray-500">Scholarship Scheme:</span> {scholarship.scheme}</p>
            <p><span className="text-gray-500">Sanction Letter No.:</span> {scholarship.sanctionLetter}</p>
          </div>
          <div className="mt-3 overflow-x-auto rounded-lg border border-rose-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50 border-b border-rose-200">
                <tr>
                  <TH>Impact</TH>
                  <TH className="text-right">Amount</TH>
                  <TH>Note</TH>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                <tr><TD>Total Scholarship Amount</TD><TD className="text-right">{INR(scholarship.total)}</TD><TD className="text-gray-500">As sanctioned</TD></tr>
                <tr><TD>Already Disbursed</TD><TD className="text-right">{INR(disb)}</TD><TD className="text-amber-700">Already given to student</TD></tr>
                <tr><TD>Pending Installments</TD><TD className="text-right">{INR(stopped)}</TD><TD className="text-rose-700">Will be STOPPED</TD></tr>
                <tr>
                  <TD>Amount to be Recovered</TD>
                  <TD className="text-right font-semibold">{INR(recoverable)}</TD>
                  <TD className="text-gray-500">Depends on the recovery policy chosen below</TD>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Panel 2 · Cancellation Reason (Mandatory)">
          <p className="text-xs text-gray-600 mb-2">Select one or more reasons:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
            {REASONS.map((r) =>
            <label key={r} className="flex items-start gap-2 text-xs text-gray-700">
                <input
                type="checkbox"
                className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={reasons.includes(r)}
                onChange={() => toggleReason(r)} />

                {r}
              </label>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Textarea label="Detailed Reason" rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Describe the background of this cancellation" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document</label>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                <Paperclip className="w-4 h-4" />
                {file || 'Upload — TC / Expulsion Letter / Govt. Letter'}
                <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} />

              </label>
            </div>
            <Input label="Cancellation Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </Panel>

        <Panel title="Panel 3 · Recovery of Already Disbursed Amount">
          <p className="text-xs text-gray-700 mb-3">
            Amount already disbursed: <span className="font-semibold">{INR(disb)}</span>
          </p>
          <div className="space-y-2 text-sm text-gray-800">
            <label className="flex items-start gap-2">
              <input type="radio" name="recovery" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={policy === 'full'} onChange={() => {setPolicy('full');setRecoveryAmount(disb);}} />
              <span>Recover full amount — student must pay back {INR(disb)}</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="recovery" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={policy === 'partial'} onChange={() => setPolicy('partial')} />
              <span className="flex flex-wrap items-center gap-2">
                Recover partial amount —
                <Input className="w-40" type="number" value={String(recoveryAmount)} onChange={(e) => setRecoveryAmount(Number(e.target.value) || 0)} />
                of {INR(disb)}
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="recovery" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={policy === 'none'} onChange={() => setPolicy('none')} />
              <span>No recovery — the disbursed amount is forgiven / written off</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="recovery" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={policy === 'settlement'} onChange={() => setPolicy('settlement')} />
              <span>Adjust in final settlement / TC fee</span>
            </label>
          </div>

          {policy !== 'none' &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <Input label="Recovery Reason" value={recoveryReason} onChange={(e) => setRecoveryReason(e.target.value)} placeholder="Why is the amount being recovered?" />
              <Input label="Recovery Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              <div className="self-end text-xs text-gray-500">
                Recovery pending amount: <span className="font-semibold text-amber-700">{INR(recoverable)}</span>
              </div>
            </div>
          }

          {scholarship.schemeType === 'Govt.' &&
          <p className="mt-3 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
              ⚠️ For government scholarships: report the cancellation to the government / NSP portal, return the unused
              government funds where applicable, and post the reversal journal entry shown below.
            </p>
          }
        </Panel>

        <Panel title="Panel 4 · Fee Account Reversal">
          <p className="text-xs text-gray-600 mb-2">
            A fee waiver was applied to the student fee account. Choose how the account must be corrected:
          </p>
          <div className="space-y-2 text-sm text-gray-800">
            <label className="flex items-start gap-2">
              <input type="radio" name="reverse" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={reverseWaiver} onChange={() => setReverseWaiver(true)} />
              <span>Yes — add {INR(recoverable)} back to the student’s fee balance (student owes it again)</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="reverse" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={!reverseWaiver} onChange={() => setReverseWaiver(false)} />
              <span>No — keep the fee waiver as is, no recovery</span>
            </label>
          </div>
          {willReinstateFee ?
          <div className="mt-3">
              <JournalPreview
              title="Journal Entry for Reversal"
              lines={[
              { account: 'Student Fee Receivable A/c', debit: recoverable },
              { account: 'Scholarship Expense A/c', credit: recoverable }]
              }
              narration={`Scholarship cancellation reversal — ${scholarship.student} — ${scholarship.scheme}`} />

            </div> :

          <p className="mt-3 text-[11px] text-gray-500">No reversal journal entry will be created.</p>
          }
        </Panel>

        <Panel title="Panel 5 · Future Installments Impact">
          {pending.length > 0 ?
          <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>Installment</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Status After Cancellation</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pending.map((i) =>
                <tr key={i.no}>
                      <TD>{i.name}</TD>
                      <TD className="text-right">{INR(i.amount)}</TD>
                      <TD className="text-rose-700">❌ CANCELLED — will NOT be disbursed</TD>
                    </tr>
                )}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <TD className="font-semibold">Total future scholarship stopped</TD>
                    <TD className="text-right font-semibold">{INR(stopped)}</TD>
                    <TD />
                  </tr>
                </tfoot>
              </table>
            </div> :

          <p className="text-xs text-gray-500">No pending installments — the full amount was already disbursed.</p>
          }
        </Panel>

        <Panel title="Panel 6 · Notifications & Communication">
          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">Notify Parent:</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="notify" className="text-indigo-600 focus:ring-indigo-500" checked={notify} onChange={() => setNotify(true)} />
                Yes — send cancellation notice via SMS &amp; Email
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="notify" className="text-indigo-600 focus:ring-indigo-500" checked={!notify} onChange={() => setNotify(false)} />
                No
              </label>
            </div>
            <Textarea label="Message to Parent" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">Generate Cancellation Letter:</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="letter" className="text-indigo-600 focus:ring-indigo-500" checked={letter} onChange={() => setLetter(true)} />
                Yes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="letter" className="text-indigo-600 focus:ring-indigo-500" checked={!letter} onChange={() => setLetter(false)} />
                No
              </label>
            </div>
          </div>
        </Panel>

        <Panel title="Panel 7 · Authorization">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancelled By</label>
              <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                {CANCELLED_BY} <span className="text-gray-400">🔒 auto</span>
              </div>
            </div>
            <Select label="Authorized By *" options={AUTHORIZERS.map((a) => ({ value: a, label: a }))} value={authorizer} onChange={(v) => setAuthorizer(v)} />
            <Input label="Authorization Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks / digital sign reference" />
          </div>
        </Panel>

        <p className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 rounded px-2 py-1.5">
          Confirming will: stop all future installments + {willReinstateFee ? 'reverse the fee waiver + create a reversal journal entry + ' : ''}
          {notify ? 'notify the parent + ' : ''}update the audit log.
        </p>
      </div>
    </Modal>);

}

/* ============================================= 7 · PARTIAL cancellation */

function PartialCancelModal({
  scholarship, open, onClose, onConfirm
}: {
  scholarship: ActiveScholarship | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {type: PartialType;selected: number[];newTotal: number;reducedFrom: number;keptComponents: string[];cancelledComponents: string[];suspendFrom: string;suspendUntil: string;indefinite: boolean;autoReinstate: string;reason: string;detail: string;notify: boolean;letter: boolean;authorizer: string;amount: number;})=>void;
}) {
  const [type, setType] = useState<PartialType>('A');
  const [selected, setSelected] = useState<number[]>([]);
  const [newTotal, setNewTotal] = useState(0);
  const [suspendFrom, setSuspendFrom] = useState(todayISO());
  const [suspendUntil, setSuspendUntil] = useState('');
  const [indefinite, setIndefinite] = useState(false);
  const [autoReinstate, setAutoReinstate] = useState('');
  const [keep, setKeep] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [notify, setNotify] = useState(true);
  const [letter, setLetter] = useState(true);
  const [authorizer, setAuthorizer] = useState(AUTHORIZERS[0]);

  React.useEffect(() => {
    if (open && scholarship) {
      setType('A');
      setSelected([]);
      setNewTotal(Math.round(scholarship.total / 2));
      setSuspendFrom(todayISO());
      setSuspendUntil('');
      setIndefinite(false);
      setAutoReinstate('');
      setKeep(scholarship.feeComponents.reduce<Record<string, boolean>>((acc, c) => {acc[c.component] = true;return acc;}, {}));
      setReason('');
      setDetail('');
      setNotify(true);
      setLetter(true);
      setAuthorizer(AUTHORIZERS[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scholarship?.id]);

  if (!scholarship) return null;

  const pending = pendingInsts(scholarship);
  const cancelledAmount = selected.reduce((n, no) => n + (scholarship.installments.find((i) => i.no === no)?.amount || 0), 0);
  const typeA_continues = scholarship.total - cancelledAmount;
  const typeB_cancelled = Math.max(0, scholarship.total - newTotal);
  const typeC_cancelled = scholarship.feeComponents.filter((c) => !keep[c.component]).reduce((n, c) => n + c.amount, 0);
  const typeC_kept = scholarship.total - typeC_cancelled;
  const suspendAmount = pending.filter((i) => i.status !== 'Cancelled').reduce((n, i) => n + i.amount, 0);
  const effectiveAmount =
  type === 'A' ? cancelledAmount : type === 'B' ? typeB_cancelled : type === 'C' ? typeC_cancelled : suspendAmount;
  const keptComponents = scholarship.feeComponents.filter((c) => keep[c.component]).map((c) => c.component);
  const cancelledComponents = scholarship.feeComponents.filter((c) => !keep[c.component]).map((c) => c.component);

  const canSubmit =
  reason !== '' && authorizer !== '' &&
  (type === 'A' ? selected.length > 0 : type === 'B' ? newTotal < scholarship.total && newTotal > 0 : type === 'C' ? cancelledComponents.length > 0 : true);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`🔄 Partial Scholarship Cancellation — ${scholarship.student} · ${scholarship.scheme} · ${scholarship.schemeType === 'Govt.' ? '🏛️ Govt.' : '🏫 Internal'}`}
      size="xl"
      footer={
      <div className="flex flex-wrap items-center gap-2">
          <Button
          disabled={!canSubmit}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={() =>
          onConfirm({
            type, selected, newTotal, reducedFrom: scholarship.total, keptComponents, cancelledComponents,
            suspendFrom, suspendUntil, indefinite, autoReinstate, reason, detail, notify, letter, authorizer, amount: effectiveAmount
          })
          }>

            Confirm Partial Cancellation
          </Button>
          <Button variant="outline" leftIcon={<Save className="w-4 h-4" />} onClick={onClose}>Save Draft</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }>

      <div className="space-y-4">
        <p className="text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded px-3 py-2 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          PARTIAL CANCELLATION means only SOME installments, an amount reduction, some fee components or a temporary
          suspension is applied. The remaining scholarship continues as normal.
        </p>

        <Panel title="Panel 1 · Select Partial Cancellation Type">
          <div className="space-y-2">
            {([
            { key: 'A' as PartialType, title: 'TYPE A: Cancel Specific Installments', hint: 'Cancel only selected future installments — other installments continue' },
            { key: 'B' as PartialType, title: 'TYPE B: Reduce Scholarship Amount', hint: 'Reduce the scholarship percentage / amount — the student still gets a scholarship' },
            { key: 'C' as PartialType, title: 'TYPE C: Cancel Specific Fee Components', hint: 'Remove the scholarship from certain fee heads (e.g. keep tuition, drop transport)' },
            { key: 'D' as PartialType, title: 'TYPE D: Suspend Temporarily', hint: 'Pause the scholarship for a defined period — can be reinstated later' }]).
            map((opt) =>
            <label
              key={opt.key}
              className={`block rounded-lg border p-3 cursor-pointer ${type === opt.key ? 'border-indigo-300 bg-indigo-50/40' : 'border-gray-200 hover:bg-gray-50'}`}>

                <span className="flex items-center gap-2">
                  <input
                  type="radio"
                  name="partial-type"
                  className="text-indigo-600 focus:ring-indigo-500"
                  checked={type === opt.key}
                  onChange={() => setType(opt.key)} />

                  <span className="text-sm font-semibold text-gray-800">{opt.title}</span>
                </span>
                <p className="text-[11px] text-gray-600 mt-1 ml-6">{opt.hint}</p>
              </label>
            )}
          </div>
        </Panel>

        {type === 'A' &&
        <Panel title="Panel 2A · Cancel Specific Installments">
            <p className="text-xs text-gray-600 mb-2">Select the installments to CANCEL:</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH className="w-16">Select</TH>
                    <TH>Installment</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Due Date</TH>
                    <TH>Status</TH>
                    <TH>Action</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scholarship.installments.map((i) =>
                <tr key={i.no}>
                      <TD>
                        {i.status === 'Disbursed' ?
                    <span className="text-emerald-600">✅</span> :

                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selected.includes(i.no)}
                      onChange={() => setSelected((prev) => (prev.includes(i.no) ? prev.filter((x) => x !== i.no) : [...prev, i.no]))} />

                    }
                      </TD>
                      <TD className="font-medium text-gray-800">{i.name}</TD>
                      <TD className="text-right">{INR(i.amount)}</TD>
                      <TD>{fmtDate(i.dueDate)}</TD>
                      <TD>{instBadge(i.status)}</TD>
                      <TD className="text-gray-500">{i.status === 'Disbursed' ? '🔒 Already paid — can only be recovered' : '☑️ Selectable'}</TD>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Installments selected to cancel</p>
                <p className="font-semibold text-gray-900">
                  {selected.length > 0 ? selected.map((no) => scholarship.installments.find((i) => i.no === no)?.name).join(', ') : '—'} · {INR(cancelledAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Scholarship that continues</p>
                <p className="font-semibold text-emerald-700">{INR(typeA_continues)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Scholarship being cancelled</p>
                <p className="font-semibold text-rose-700">{INR(cancelledAmount)}</p>
              </div>
            </div>
          </Panel>
        }

        {type === 'B' &&
        <Panel title="Panel 2B · Reduce Scholarship Amount">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Scholarship</label>
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  {INR(scholarship.total)} 🔒 from master
                </div>
              </div>
              <Input label="Reduce To" type="number" value={String(newTotal)} onChange={(e) => setNewTotal(Number(e.target.value) || 0)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reduced % of sanction</label>
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  {scholarship.total > 0 ? Math.round((newTotal / scholarship.total) * 100) : 0}% of {INR(scholarship.total)}
                </div>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>Installment</TH>
                    <TH className="text-right">Earlier</TH>
                    <TH className="text-right">Now</TH>
                    <TH>Impact</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scholarship.installments.map((i) => {
                  const share = scholarship.total > 0 ? newTotal / scholarship.total : 1;
                  const now = i.status === 'Disbursed' ? i.amount : Math.round(i.amount * share);
                  return (
                    <tr key={i.no}>
                        <TD>{i.name}</TD>
                        <TD className="text-right">{INR(i.amount)}</TD>
                        <TD className="text-right">{INR(now)}</TD>
                        <TD className={now === i.amount ? 'text-gray-500' : 'text-amber-700'}>
                          {i.status === 'Disbursed' ? 'Already disbursed (unchanged)' : now === i.amount ? 'Unchanged' : `REDUCED by ${INR(i.amount - now)}`}
                        </TD>
                      </tr>);

                })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <TD className="font-semibold">New total</TD>
                    <TD className="text-right font-semibold">{INR(scholarship.total)}</TD>
                    <TD className="text-right font-semibold">{INR(newTotal)}</TD>
                    <TD className="text-rose-700 font-semibold">Cancelled {INR(typeB_cancelled)}</TD>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>
        }

        {type === 'C' &&
        <Panel title="Panel 2C · Cancel Specific Fee Components">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>Fee Component</TH>
                    <TH className="text-right">Waiver %</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Keep or Cancel?</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scholarship.feeComponents.map((c) =>
                <tr key={c.component}>
                      <TD className="font-medium text-gray-800">{c.component}</TD>
                      <TD className="text-right">{c.waiverPct}%</TD>
                      <TD className="text-right">{INR(c.amount)}</TD>
                      <TD>
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-2">
                            <input
                          type="radio"
                          name={`keep-${c.component}`}
                          className="text-indigo-600 focus:ring-indigo-500"
                          checked={keep[c.component] !== false}
                          onChange={() => setKeep((prev) => ({ ...prev, [c.component]: true }))} />

                            Keep
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                          type="radio"
                          name={`keep-${c.component}`}
                          className="text-indigo-600 focus:ring-indigo-500"
                          checked={keep[c.component] === false}
                          onChange={() => setKeep((prev) => ({ ...prev, [c.component]: false }))} />

                            Cancel
                          </label>
                        </div>
                      </TD>
                    </tr>
                )}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <TD className="font-semibold">Scholarship retained / cancelled</TD>
                    <TD colSpan={2} className="text-right font-semibold">{INR(typeC_kept)} retained</TD>
                    <TD className="font-semibold text-rose-700">{INR(typeC_cancelled)} cancelled</TD>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>
        }

        {type === 'D' &&
        <Panel title="Panel 2D · Temporary Suspension">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Suspend From" type="date" value={suspendFrom} onChange={(e) => setSuspendFrom(e.target.value)} />
              <Input label="Suspend Until (expected reinstatement)" type="date" value={suspendUntil} disabled={indefinite} onChange={(e) => setSuspendUntil(e.target.value)} />
              <div className="self-end">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={indefinite} onChange={(e) => setIndefinite(e.target.checked)} />
                  Suspend indefinitely — until manual reinstatement
                </label>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>Installment during suspension</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Status</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pending.map((i) =>
                <tr key={i.no}>
                      <TD>{i.name}</TD>
                      <TD className="text-right">{INR(i.amount)}</TD>
                      <TD className="text-amber-700">🔒 SUSPENDED (not cancelled — can be resumed)</TD>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Input label="Suspension Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Student on medical leave — scholarship paused" />
              <Select
              label="Auto-Reinstate?"
              options={[
              { value: '', label: 'Manual only' },
              { value: '2026-01-01', label: 'Yes — on 01-Jan-2026' },
              { value: '2025-12-01', label: 'Yes — on 01-Dec-2025' }]}
              value={autoReinstate}
              onChange={(v) => setAutoReinstate(v)} />

            </div>
          </Panel>
        }

        {type !== 'D' &&
        <Panel title="Panel 3 · Cancellation Reason">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
              label="Reason *"
              options={[{ value: '', label: '— Select —' }, ...PARTIAL_REASONS.map((r) => ({ value: r, label: r }))]}
              value={reason}
              onChange={(v) => setReason(v)} />

              <Input label="Details" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Additional context for the audit trail" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document</label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </Panel>
        }

        <Panel title="Panel 4 · Journal Entry for Partial Cancellation">
          {effectiveAmount > 0 && scholarship.mode === 'Fee Waiver' ?
          <JournalPreview
            title="Reversal — only if the fee waiver was already applied for the cancelled part"
            lines={[
            { account: 'Student Fee Receivable A/c', debit: effectiveAmount },
            { account: 'Scholarship Expense A/c', credit: effectiveAmount }]
            }
            narration={`Partial cancellation — ${type === 'A' ? selected.map((no) => scholarship.installments.find((i) => i.no === no)?.name).join(', ') : type === 'B' ? 'amount reduced' : type === 'C' ? `components: ${cancelledComponents.join(', ')}` : 'suspension'} — ${scholarship.student} — ${scholarship.scheme}`} /> :

          <p className="text-xs text-gray-500">
            No reversal journal entry is required for this selection
            {scholarship.mode === 'Bank Transfer' ? ' (bank transfer mode — no fee ledger impact)' : ''}.
          </p>
          }
          {type === 'D' &&
          <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
              Suspension does not post any journal entry — installments are held, not cancelled. On reinstatement the held
              installments are released with their original amounts.
            </p>
          }
        </Panel>

        <Panel title="Panel 5 · Notification & Authorization">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">Notify Parent:</span>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="p-notify" className="text-indigo-600 focus:ring-indigo-500" checked={notify} onChange={() => setNotify(true)} />
                  Yes
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="p-notify" className="text-indigo-600 focus:ring-indigo-500" checked={!notify} onChange={() => setNotify(false)} />
                  No
                </label>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">Generate Partial Cancellation Letter:</span>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="p-letter" className="text-indigo-600 focus:ring-indigo-500" checked={letter} onChange={() => setLetter(true)} />
                  Yes
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="p-letter" className="text-indigo-600 focus:ring-indigo-500" checked={!letter} onChange={() => setLetter(false)} />
                  No
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancelled By</label>
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  {CANCELLED_BY} <span className="text-gray-400">🔒 auto</span>
                </div>
              </div>
              <Select label="Authorized By *" options={AUTHORIZERS.map((a) => ({ value: a, label: a }))} value={authorizer} onChange={(v) => setAuthorizer(v)} />
            </div>
          </div>
        </Panel>
      </div>
    </Modal>);

}

/* ============================================================ page */

export function ScholarshipAdjustmentCancellation() {
  const [active, setActive] = useState<ActiveScholarship[]>(() => ACTIVE_SEED);
  const [history, setHistory] = useState<CancelRecord[]>(() => HISTORY_SEED);
  const [reinstated, setReinstated] = useState<CancelRecord[]>(() => REINSTATED_SEED);
  const [tab, setTab] = useState<'Active' | 'Full' | 'Partial' | 'History' | 'Recovery' | 'Reinstated'>('Active');
  const [toast, setToast] = useState<string | null>(null);

  const [q, setQ] = useState('');
  const [schemeF, setSchemeF] = useState('All');
  const [typeF, setTypeF] = useState('All');
  const [cancelTypeF, setCancelTypeF] = useState('All');
  const [classF, setClassF] = useState('All');
  const [reasonF, setReasonF] = useState('');
  const [from, setFrom] = useState('2025-04-01');
  const [to, setTo] = useState('2026-03-31');

  const [selected, setSelected] = useState<string[]>([]);
  const [fullFor, setFullFor] = useState<ActiveScholarship | null>(null);
  const [partialFor, setPartialFor] = useState<ActiveScholarship | null>(null);
  const [viewFor, setViewFor] = useState<ActiveScholarship | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const schemeNames = useMemo(() => Array.from(new Set(ACTIVE_SEED.map((s) => s.scheme))), []);
  const classNames = useMemo(() => Array.from(new Set(ACTIVE_SEED.map((s) => s.className))), []);

  const filteredActive = useMemo(
    () =>
    active.filter((s) => {
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        if (!`${s.student} ${s.schNo} ${s.scheme} ${s.admissionNo}`.toLowerCase().includes(needle)) return false;
      }
      if (schemeF !== 'All' && s.scheme !== schemeF) return false;
      if (typeF !== 'All' && s.schemeType !== typeF) return false;
      if (classF !== 'All' && s.className !== classF) return false;
      return true;
    }),
    [active, q, schemeF, typeF, classF]
  );

  const filteredHistory = useMemo(
    () =>
    history.filter((h) => {
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        if (!`${h.student} ${h.cancelNo} ${h.scheme} ${h.reason}`.toLowerCase().includes(needle)) return false;
      }
      if (schemeF !== 'All' && h.scheme !== schemeF) return false;
      if (typeF !== 'All' && h.schemeType !== typeF) return false;
      if (cancelTypeF !== 'All' && h.cancelType !== cancelTypeF) return false;
      if (reasonF && !h.reason.toLowerCase().includes(reasonF.toLowerCase())) return false;
      if (h.date < from || h.date > to) return false;
      return true;
    }),
    [history, q, schemeF, typeF, cancelTypeF, reasonF, from, to]
  );

  const kpis = useMemo(() => {
    const fullCount = history.filter((h) => h.cancelType === 'Full').length;
    const partialCount = history.filter((h) => h.cancelType === 'Partial').length;
    const cancelled = history.reduce((n, h) => n + h.amountCancelled, 0);
    const recovered = history.reduce((n, h) => n + h.amountRecovered, 0);
    return {
      activeCount: active.length,
      fullCount,
      partialCount,
      cancelled,
      recovered,
      pendingRecovery: Math.max(0, cancelled - recovered),
      suspended: history.filter((h) => h.cancelType === 'Suspend').length
    };
  }, [active, history]);

  const allSelected = filteredActive.length > 0 && filteredActive.every((s) => selected.includes(s.id));
  const toggleAll = () => setSelected(allSelected ? [] : filteredActive.map((s) => s.id));
  const toggleOne = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const resetFilters = () => {
    setQ('');
    setSchemeF('All');
    setTypeF('All');
    setCancelTypeF('All');
    setClassF('All');
    setReasonF('');
    setFrom('2025-04-01');
    setTo('2026-03-31');
  };

  const applyFullCancellation = (
  s: ActiveScholarship,
  payload: {reasons: string[];detail: string;date: string;policy: string;recoveryAmount: number;reverseWaiver: boolean;notify: boolean;authorizer: string;}) => {
    const stopped = remainingOf(s);
    setActive((prev) => prev.filter((x) => x.id !== s.id));
    setHistory((prev) => [
    {
      id: `h-${Date.now()}`,
      cancelNo: `CAN-2025-${String(prev.length + 1).padStart(3, '0')}`,
      student: s.student,
      className: s.className,
      scheme: s.scheme,
      schemeType: s.schemeType,
      cancelType: 'Full',
      amountCancelled: stopped,
      amountRecovered: payload.recoveryAmount,
      reason: payload.reasons[0] || 'Cancelled',
      reasonDetail: payload.detail,
      date: payload.date,
      reversed: payload.reverseWaiver && payload.recoveryAmount > 0,
      status: payload.recoveryAmount > 0 && payload.policy !== 'settlement' ? 'Recovery Pending' : 'Completed',
      note: `${payload.policy === 'none' ? 'No recovery' : `Recovery ${INR(payload.recoveryAmount)}`} · stopped ${INR(stopped)} · authorized by ${payload.authorizer}`
    },
    ...prev]
    );
    setFullFor(null);
    setSelected((prev) => prev.filter((id) => id !== s.id));
    setToast(
      `Full cancellation recorded for ${s.student} · stopped ${INR(stopped)}` +
      (payload.recoveryAmount > 0 ? ` · recovery ${INR(payload.recoveryAmount)}` : ' · no recovery') +
      (payload.notify ? ' · parent notified' : '') +
      (payload.reverseWaiver && payload.recoveryAmount > 0 ? ' · fee waiver reversed' : '')
    );
  };

  const applyPartialCancellation = (
  s: ActiveScholarship,
  payload: {type: PartialType;selected: number[];newTotal: number;amount: number;reason: string;detail: string;notify: boolean;shouldSuspend: boolean;authorizer: string;keptComponents: string[];cancelledComponents: string[];indefinite: boolean;autoReinstate: string;}
  ) => {
    if (payload.type === 'D') {
      // suspension: keep the scholarship, hold the pending installments
      setActive((prev) => prev.map((x) => (x.id === s.id ? { ...x, installments: x.installments.map((i) => (i.status === 'Upcoming' ? { ...i, status: 'Suspended' as InstStatus } : i)) } : x)));
      setToast(`Scholarship suspended for ${s.student} · held installments ${INR(payload.amount)}${payload.indefinite ? ' · indefinitely' : ''}${payload.notify ? ' · parent notified' : ''}`);
      setPartialFor(null);
      return;
    }
    let changed: ActiveScholarship = s;
    let label = '';
    if (payload.type === 'A') {
      changed = { ...s, installments: s.installments.map((i) => (i.status !== 'Disbursed' && payload.selected.includes(i.no) ? { ...i, status: 'Cancelled' as InstStatus } : i)) };
      label = `installments ${payload.selected.join(', ')} stopped`;
    } else if (payload.type === 'B') {
      const share = s.total > 0 ? payload.newTotal / s.total : 1;
      changed = {
        ...s,
        installments: s.installments.map((i) => (i.status === 'Upcoming' ? { ...i, amount: Math.round(i.amount * share) } : i)),
        total: payload.newTotal
      };
      label = `amount reduced to ${INR(payload.newTotal)}`;
    } else {
      changed = { ...s, feeComponents: s.feeComponents.map((c) => ({ ...c, waiverPct: payload.cancelledComponents.includes(c.component) ? 0 : c.waiverPct })) };
      label = `components cancelled: ${payload.cancelledComponents.join(', ') || '—'}`;
    }
    setActive((prev) => prev.map((x) => (x.id === s.id ? changed : x)));
    setHistory((prev) => [
    {
      id: `h-${Date.now()}`,
      cancelNo: `CAN-2025-${String(prev.length + 1).padStart(3, '0')}`,
      student: s.student,
      className: s.className,
      scheme: s.scheme,
      schemeType: s.schemeType,
      cancelType: 'Partial',
      partialType: payload.type,
      amountCancelled: payload.amount,
      amountRecovered: 0,
      reason: payload.reason || 'Partial cancellation',
      reasonDetail: payload.detail,
      date: todayISO(),
      reversed: false,
      status: 'Completed',
      note: `${label} · authorized by ${payload.authorizer}`
    },
    ...prev]
    );
    setPartialFor(null);
    setToast(
      `Partial cancellation recorded for ${s.student} — ${label} · ${INR(payload.amount)}${payload.notify ? ' · parent notified' : ''}`
    );
  };

  const reinstate = (record: CancelRecord) => {
    setHistory((prev) => prev.filter((h) => h.id !== record.id));
    setReinstated((prev) => [{ ...record, status: 'Reinstated', date: todayISO(), note: (record.note || '') + ' Reinstated by Finance Manager.' }, ...prev]);
    setToast(`${record.student} reinstated — held installments released`);
  };

  const exportCsv = () => {
    const rows = filteredHistory.map((h) => [h.cancelNo, h.student, h.scheme, h.cancelType, h.amountCancelled, h.amountRecovered, h.reason, h.date].join(','));
    const csv = ['Cancel No.,Student,Scheme,Type,Amount Cancelled,Amount Recovered,Reason,Date', ...rows].join('\n');
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scholarship-cancellations-${todayISO()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast(`Exported ${filteredHistory.length} cancellation record(s)`);
    } catch {
      setToast(`Export prepared for ${filteredHistory.length} cancellation record(s)`);
    }
  };

  const tabDefs: {key: typeof tab;label: string;count: number;}[] = [
  { key: 'Active', label: '📋 Active Scholarships (Ready to Cancel)', count: kpis.activeCount },
  { key: 'Full', label: '❌ Full Cancellations (History)', count: kpis.fullCount },
  { key: 'Partial', label: '🔄 Partial Cancellations (History)', count: kpis.partialCount },
  { key: 'History', label: '📋 Cancellation History', count: history.length },
  { key: 'Recovery', label: '⚠️ Pending Recovery', count: history.filter((h) => h.amountCancelled - h.amountRecovered > 0).length },
  { key: 'Reinstated', label: '🔄 Reinstated', count: reinstated.length }];


  const historyTable = (rows: CancelRecord[], showReinstate: boolean) =>
  <Card title="Cancellation History" headerAction={<span className="text-xs text-gray-500">{rows.length} record(s)</span>} noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <TH className="w-10">#</TH>
              <TH>Cancel No.</TH>
              <TH>Student Name</TH>
              <TH>Scheme Name</TH>
              <TH>Cancel Type</TH>
              <TH className="text-right">Amount Cancelled</TH>
              <TH className="text-right">Amount Recovered</TH>
              <TH className="text-right">Pending Recovery</TH>
              <TH>Reason</TH>
              <TH>Date</TH>
              <TH>Status</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((h, idx) =>
          <tr key={h.id} className="hover:bg-gray-50">
                <TD>{idx + 1}</TD>
                <TD className="font-mono text-gray-600">{h.cancelNo}</TD>
                <TD>
                  <span className="font-medium text-gray-800">{h.student}</span>
                  <p className="text-[10px] text-gray-400">{h.className}</p>
                </TD>
                <TD>{h.schemeType === 'Govt.' ? '🏛️' : '🏫'} {h.scheme}</TD>
                <TD>
                  {cancelTypeBadge(h.cancelType)}
                  {h.partialType && <span className="text-[10px] text-gray-400 ml-1">Type {h.partialType}</span>}
                </TD>
                <TD className="text-right">{INR(h.amountCancelled)}</TD>
                <TD className="text-right">{INR(h.amountRecovered)}</TD>
                <TD className={`text-right font-medium ${h.amountCancelled - h.amountRecovered > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
                  {INR(Math.max(0, h.amountCancelled - h.amountRecovered))}
                </TD>
                <TD className="max-w-[220px]">
                  <span className="text-gray-700">{h.reason}</span>
                  {h.note && <p className="text-[10px] text-gray-400">{h.note}</p>}
                </TD>
                <TD>{fmtDate(h.date)}</TD>
                <TD>{statusBadge(h.status)}</TD>
                <TD>
                  <div className="flex items-center justify-end gap-1">
                    <button
                  type="button"
                  title="View cancellation"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setToast(`${h.cancelNo} · ${h.student} · ${h.reason}${h.reversed ? ' · journal reversal posted' : ''}`)}>

                      <Eye className="w-4 h-4" />
                    </button>
                    {showReinstate &&
                <button
                  type="button"
                  title="Reinstate scholarship"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                  onClick={() => reinstate(h)}>

                        <Undo2 className="w-4 h-4" />
                      </button>
                }
                  </div>
                </TD>
              </tr>
          )}
            {rows.length === 0 &&
          <tr><TD colSpan={12} className="text-center text-gray-500 py-8">No records in this view.</TD></tr>
          }
          </tbody>
        </table>
      </div>
    </Card>;


  return (
    <div className="space-y-6 py-6">
      {/* ------------------------------------------------ 1 · header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Scholarship Cancellation</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Full cancellation &amp; partial cancellation (installments · amount reduction · fee components · suspension)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">FY 2025-26</Badge>
          <Button size="sm" variant="outline" leftIcon={<Mail className="w-4 h-4" />} onClick={() => setToast('Cancellation notices queued (SMS + Email)')}>
            Notify Parents
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => setToast('Print preview prepared')}>
            Print
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------ 2 · KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
        { icon: Users, label: '📋 Active Scholarships (This Year)', value: `${kpis.activeCount}`, hint: 'In the cancellable list', tone: 'indigo' },
        { icon: XCircle, label: '❌ Fully Cancelled (This Year)', value: `${kpis.fullCount}`, hint: 'Full cancellations recorded', tone: 'rose' },
        { icon: RefreshCw, label: '🔄 Partially Cancelled (This Year)', value: `${kpis.partialCount}`, hint: `+${kpis.suspended} suspended`, tone: 'amber' },
        { icon: IndianRupee, label: '💰 Amount Cancelled (This Year)', value: INR(kpis.cancelled), hint: 'Across all cancellations', tone: 'violet' },
        { icon: HandCoins, label: '💰 Amount Recovered (This Year)', value: INR(kpis.recovered), hint: 'Recovered from students', tone: 'emerald' },
        { icon: Hourglass, label: '🔄 Pending Recovery', value: INR(kpis.pendingRecovery), hint: 'To be recovered from students', tone: 'gray' }].
        map((k) => {
          const Icon = k.icon;
          const toneRing: Record<string, string> = {
            indigo: 'border-indigo-200 text-indigo-600 bg-indigo-50',
            rose: 'border-rose-200 text-rose-600 bg-rose-50',
            amber: 'border-amber-200 text-amber-600 bg-amber-50',
            violet: 'border-violet-200 text-violet-600 bg-violet-50',
            emerald: 'border-emerald-200 text-emerald-600 bg-emerald-50',
            gray: 'border-gray-200 text-gray-600 bg-gray-50'
          };
          return (
            <div key={k.label} className={`rounded-lg border ${toneRing[k.tone].split(' ')[0]} bg-white shadow-sm p-3`}>
              <div className="flex items-start gap-2">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneRing[k.tone].split(' ').slice(1).join(' ')}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 leading-tight">{k.label}</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{k.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{k.hint}</p>
                </div>
              </div>
            </div>);

        })}
      </div>

      {/* ------------------------------------------------ 3 · tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-stretch overflow-x-auto border-b border-gray-200">
          {tabDefs.map((t) =>
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
            tab === t.key ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }>

              {t.label}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
            </button>
          )}
        </div>

        {/* ------------------------------------- 4 · filters + actions */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <Input
              placeholder="Search student / scholarship no. / scheme / reason"
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              value={q}
              onChange={(e) => setQ(e.target.value)} />

            <Select label="Scheme" options={[{ value: 'All', label: 'All Schemes' }, ...schemeNames.map((s) => ({ value: s, label: s }))]} value={schemeF} onChange={(v) => setSchemeF(v)} />
            <Select label="Type" options={[{ value: 'All', label: 'All Types' }, { value: 'Govt.', label: '🏛️ Govt.' }, { value: 'Internal', label: '🏫 Internal' }]} value={typeF} onChange={(v) => setTypeF(v)} />
            <Select label="Cancellation Type" options={[{ value: 'All', label: 'All' }, { value: 'Full', label: '❌ Full' }, { value: 'Partial', label: '🔄 Partial' }, { value: 'Suspend', label: '🔒 Suspend' }]} value={cancelTypeF} onChange={(v) => setCancelTypeF(v)} />
            <Select label="Class" options={[{ value: 'All', label: 'All Classes' }, ...classNames.map((c) => ({ value: c, label: c }))]} value={classF} onChange={(v) => setClassF(v)} />
            <Input label="Reason contains" value={reasonF} onChange={(e) => setReasonF(e.target.value)} placeholder="e.g. TC, marks, income" />
            <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <div className="flex items-end gap-2 xl:col-span-2">
              <Button variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={resetFilters}>Reset</Button>
              <Button leftIcon={<Search className="w-4 h-4" />} onClick={() => setToast(`${tab === 'Active' ? filteredActive.length : filteredHistory.length} record(s) match the filters`)}>
                Search
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Actions</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="danger" leftIcon={<XCircle className="w-4 h-4" />} onClick={() => setFullFor(filteredActive[0] || active[0])}>
                ❌ Full Cancel
              </Button>
              <Button size="sm" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setPartialFor(filteredActive[0] || active[0])}>
                🔄 Partial Cancel
              </Button>
              <Button size="sm" variant="outline" leftIcon={<ListChecks className="w-4 h-4" />} onClick={() => setToast(`${selected.length} scholarship(s) selected — pick Full Cancel or Partial Cancel to continue`)}>
                ☑️ Bulk Action{selected.length > 0 ? ` (${selected.length})` : ''}
              </Button>
              <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={exportCsv}>📥 Export</Button>
              <Button size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => setToast('Print preview prepared')}>🖨️ Print</Button>
              <Button size="sm" variant="outline" leftIcon={<Mail className="w-4 h-4" />} onClick={() => setToast('Cancellation notices sent to parents')}>📧 Notify Parents</Button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------- 5 · active scholarships table */}
      {tab === 'Active' &&
      <Card
        title="Active Scholarships (Cancellable)"
        headerAction={<span className="text-xs text-gray-500">{filteredActive.length} record(s) · {selected.length} selected</span>}
        noPadding>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <TH className="w-10">
                    <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={allSelected}
                    onChange={toggleAll} />

                  </TH>
                  <TH>Schol. No.</TH>
                  <TH>Student Name</TH>
                  <TH>Scheme Name</TH>
                  <TH>Type</TH>
                  <TH className="text-right">Total Amount</TH>
                  <TH className="text-right">Disbursed</TH>
                  <TH className="text-right">Remaining</TH>
                  <TH>Installments</TH>
                  <TH className="text-right">Actions</TH>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredActive.map((s) => {
                  const disb = disbursedOf(s);
                  const remaining = remainingOf(s);
                  const suspended = s.installments.some((i) => i.status === 'Suspended');
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <TD>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selected.includes(s.id)}
                          onChange={() => toggleOne(s.id)} />

                      </TD>
                      <TD className="font-mono text-gray-600">{s.schNo}</TD>
                      <TD>
                        <span className="font-medium text-gray-800">{s.student}</span>
                        <p className="text-[10px] text-gray-400">{s.className} · {s.admissionNo}</p>
                      </TD>
                      <TD>
                        {s.schemeType === 'Govt.' ? '🏛️' : '🏫'} {s.scheme}
                        <p className="text-[10px] text-gray-400">{s.sanctionLetter}</p>
                      </TD>
                      <TD>{typeBadge(s.schemeType)}</TD>
                      <TD className="text-right">{INR(s.total)}</TD>
                      <TD className="text-right">{INR(disb)}</TD>
                      <TD className={`text-right font-medium ${remaining > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>{INR(remaining)}</TD>
                      <TD>
                        <span className="text-gray-700">
                          {s.installments.filter((i) => i.status === 'Disbursed').length} of {s.installments.length} done
                        </span>
                        {suspended && <p className="text-[10px] text-amber-700">🔒 has suspended installment</p>}
                      </TD>
                      <TD>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="View"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                            onClick={() => setViewFor(s)}>

                            <Eye className="w-4 h-4" />
                          </button>
                          <Button size="xs" variant="danger" leftIcon={<XCircle className="w-3 h-3" />} onClick={() => setFullFor(s)}>
                            Full Cancel
                          </Button>
                          <Button size="xs" variant="outline" leftIcon={<RefreshCw className="w-3 h-3" />} onClick={() => setPartialFor(s)}>
                            Partial Cancel
                          </Button>
                          {remaining === 0 && <span className="text-[10px] text-gray-400">(no remaining)</span>}
                        </div>
                      </TD>
                    </tr>);

                })}
                {filteredActive.length === 0 &&
                <tr><TD colSpan={10} className="text-center text-gray-500 py-8">No cancellable scholarships match the filters.</TD></tr>
                }
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* ----------------------------- 8 · history views */}
      {tab === 'Full' && historyTable(filteredHistory.filter((h) => h.cancelType === 'Full'), false)}
      {tab === 'Partial' && historyTable(filteredHistory.filter((h) => h.cancelType === 'Partial'), false)}
      {tab === 'History' && historyTable(filteredHistory, false)}
      {tab === 'Recovery' && historyTable(filteredHistory.filter((h) => h.amountCancelled - h.amountRecovered > 0), true)}
      {tab === 'Reinstated' && historyTable(reinstated, false)}

      {/* analytics strip */}
      <Card title="Cancellation Analytics">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Amount Cancelled by Type</p>
            <div className="space-y-2">
              {(['Full', 'Partial', 'Suspend'] as CancelType[]).map((t) => {
                const total = history.filter((h) => h.cancelType === t).reduce((n, h) => n + h.amountCancelled, 0);
                const max = Math.max(1, ...(['Full', 'Partial', 'Suspend'] as CancelType[]).map((x) => history.filter((h) => h.cancelType === x).reduce((n, h) => n + h.amountCancelled, 0)));
                return (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-20 text-[11px] text-gray-500">{t}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full ${t === 'Full' ? 'bg-rose-500' : t === 'Partial' ? 'bg-amber-500' : 'bg-gray-400'}`} style={{ width: `${(total / max) * 100}%` }} />
                    </div>
                    <span className="w-24 text-right text-[11px] font-medium text-gray-700">{INR(total)}</span>
                  </div>);

              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Recovery Position</p>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p className="flex items-center gap-2"><IndianRupee className="w-3.5 h-3.5 text-gray-400" /> Cancelled: <span className="font-semibold">{INR(kpis.cancelled)}</span></p>
              <p className="flex items-center gap-2"><HandCoins className="w-3.5 h-3.5 text-emerald-500" /> Recovered: <span className="font-semibold text-emerald-700">{INR(kpis.recovered)}</span></p>
              <p className="flex items-center gap-2"><Hourglass className="w-3.5 h-3.5 text-amber-500" /> Pending: <span className="font-semibold text-amber-700">{INR(kpis.pendingRecovery)}</span></p>
              <p className="flex items-center gap-2"><TrendingDown className="w-3.5 h-3.5 text-gray-400" /> Recovery rate: <span className="font-semibold">{kpis.cancelled > 0 ? Math.round((kpis.recovered / kpis.cancelled) * 100) : 0}%</span></p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Top Cancellation Reasons</p>
            <div className="space-y-1.5 text-xs text-gray-700">
              {Object.entries(
                history.reduce<Record<string, number>>((acc, h) => {
                  const key = h.reason.split('—')[0].split('(')[0].trim().slice(0, 42);
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {})
              ).
              sort((a, b) => b[1] - a[1]).
              slice(0, 4).
              map(([reason, count]) =>
              <p key={reason} className="flex items-center justify-between gap-2">
                  <span className="truncate">{reason}</span>
                  <span className="font-semibold">{count}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------ 9 · footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <span>
          Cancelling a scholarship stops future installments, may reverse the applied fee waiver and always writes an audit-trail entry.
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Gavel className="w-3.5 h-3.5 text-gray-400" /> Authorization by Principal is mandatory</span>
          <span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5 text-gray-400" /> Suspended scholarships can be reinstated</span>
        </span>
      </div>

      {/* ------------------------------------------------------- modals */}
      <FullCancelModal
        scholarship={fullFor}
        open={!!fullFor}
        onClose={() => setFullFor(null)}
        onConfirm={(payload) => fullFor && applyFullCancellation(fullFor, payload)} />

      <PartialCancelModal
        scholarship={partialFor}
        open={!!partialFor}
        onClose={() => setPartialFor(null)}
        onConfirm={(payload) =>
        partialFor &&
        applyPartialCancellation(partialFor, {
          ...payload,
          shouldSuspend: payload.type === 'D'
        })
        } />

      <Modal
        isOpen={!!viewFor}
        onClose={() => setViewFor(null)}
        title={`👁️ ${viewFor?.schNo || ''} — ${viewFor?.student || ''}`}
        size="lg"
        footer={<Button variant="outline" onClick={() => setViewFor(null)}>Close</Button>}>

        {viewFor &&
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-700">
              <p><span className="text-gray-500">Student:</span> {viewFor.student} · {viewFor.className}</p>
              <p><span className="text-gray-500">Admission No.:</span> {viewFor.admissionNo}</p>
              <p><span className="text-gray-500">Scheme:</span> {viewFor.scheme}</p>
              <p><span className="text-gray-500">Type:</span> {typeBadge(viewFor.schemeType)}</p>
              <p><span className="text-gray-500">Sanction Letter:</span> {viewFor.sanctionLetter}</p>
              <p><span className="text-gray-500">Mode / Frequency:</span> {viewFor.mode} · {viewFor.frequency}</p>
              <p><span className="text-gray-500">Total:</span> <span className="font-semibold">{INR(viewFor.total)}</span></p>
              <p><span className="text-gray-500">Disbursed / Remaining:</span> {INR(disbursedOf(viewFor))} / {INR(remainingOf(viewFor))}</p>
            </div>
            <Panel title="Installment Position">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>#</TH>
                    <TH>Installment</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Due Date</TH>
                    <TH>Status</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {viewFor.installments.map((i) =>
                <tr key={i.no}>
                      <TD>{i.no}</TD>
                      <TD>{i.name}</TD>
                      <TD className="text-right">{INR(i.amount)}</TD>
                      <TD>{fmtDate(i.dueDate)}</TD>
                      <TD>{instBadge(i.status)}</TD>
                    </tr>
                )}
                </tbody>
              </table>
            </Panel>
            <Panel title="Fee Components Under Scholarship">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH>Component</TH>
                    <TH className="text-right">Waiver %</TH>
                    <TH className="text-right">Amount</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {viewFor.feeComponents.map((c) =>
                <tr key={c.component}>
                      <TD>{c.component}</TD>
                      <TD className="text-right">{c.waiverPct}%</TD>
                      <TD className="text-right">{INR(c.amount)}</TD>
                    </tr>
                )}
                </tbody>
              </table>
            </Panel>
          </div>
        }
      </Modal>

      {toast &&
      <div className="fixed bottom-5 right-5 z-50 max-w-lg rounded-lg bg-gray-900 text-white text-sm px-4 py-2.5 shadow-lg">
          {toast}
        </div>
      }
    </div>);

}

export default ScholarshipAdjustmentCancellation;
