// ScholarshipDisbursement.tsx — Scholarship Disbursement (redesigned)
//
// What this screen covers
//   • Fee Waiver Settlement  — scholarship deducted from the student's fee account
//   • Bank Account Transfer  — scholarship transferred to the student / parent bank account
//   • Partial Disbursement   — releasing the scholarship in installments (term / monthly / quarterly / …)
//   • Govt. Fund Tracking    — government funds received vs applied
//   • Disbursement Schedule  — installment-wise tracker with progress
//
// Page sections (top → bottom)
//   1 Header · 2 KPI cards · 3 Tabs · 4 Filters + actions · 5 Main disbursement table
//   6 Process modals (6A fee waiver · 6B bank transfer · 6C partial schedule setup)
//   7 Disbursement schedule tracker · 8 Government fund tracker · 9 Charts & analytics · 10 Footer
//
// UI-only with mock data (no backend), consistent with the rest of the ERP.

import React, { useMemo, useState } from 'react';
import {
  Wallet, BadgeIndianRupee, Landmark, CheckCircle2, RefreshCw, Hourglass, Building2, School,
  AlertTriangle, CalendarClock, CreditCard, Search, RotateCcw, Download,
  Printer, Mail, ListChecks, Eye, Receipt, Settings2, ChevronDown, ChevronUp, Save,
  Plus, Trash2, FileText, ShieldCheck, TrendingUp, Info, Send
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Toggle } from '../../../components/ui/Toggle';

/* ================================================================ types */

type LucideIcon = React.ComponentType<{ className?: string }>;

type DisbMode = 'Fee Waiver' | 'Bank Transfer';
type ScholarType = 'Govt.' | 'Internal';
type DisbStatus = 'Full' | 'Partial' | 'Pending' | 'Overdue' | 'No Schedule';
type InstStatus = 'Disbursed' | 'Upcoming' | 'Cancelled' | 'Suspended';
type Frequency = 'One-Time' | 'Monthly' | 'Term-wise' | 'Quarterly' | 'Half-Yearly' | 'Custom';

interface Installment {
  no: number;
  name: string;
  amount: number;
  dueDate: string; // ISO yyyy-mm-dd
  mode: DisbMode;
  appliedOn?: string;
  journalNo?: string;
  status: InstStatus;
}

interface FeeRow {
  component: string;
  annual: number;
  waivedBefore: number;
}

interface BankDetails {
  holder: string;
  relation: string;
  bank: string;
  account: string;
  ifsc: string;
  accType: string;
  branch: string;
  pennyDrop: boolean;
  aadhaarLinked: boolean;
}

interface DisbursementRecord {
  id: string;
  disbNo: string;
  student: string;
  className: string;
  admissionNo: string;
  appNo: string;
  scheme: string;
  schemeShort: string;
  schemeType: ScholarType;
  sanctionLetter: string;
  nspRef?: string;
  govtSanctionNo?: string;
  portal?: string;
  total: number; // total scholarship sanctioned
  govtFundsReceived: number;
  govtFundsReceivedOn?: string;
  mode: DisbMode;
  frequency: Frequency;
  installments: Installment[];
  feeRows: FeeRow[];
  bank: BankDetails;
  category: string;
  remarks?: string;
}

/* ============================================================ utilities */

const INR = (n: number) => `₹ ${Math.round(n).toLocaleString('en-IN')}`;
const pct = (a: number, b: number) => (b <= 0 ? 0 : Math.round((a / b) * 1000) / 10);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** dd-MMM-yyyy (the date format used in every other finance screen). */
const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const isPast = (iso: string) => new Date(iso).getTime() < new Date(todayISO()).getTime();
const daysBetween = (iso: string) => Math.round((new Date(iso).getTime() - new Date(todayISO()).getTime()) / 86400000);

/** days until a due date, worded for the tracker */
const dueLabel = (iso: string) => {
  const d = daysBetween(iso);
  if (d === 0) return 'today';
  if (d > 0) return `in ${d} day${d === 1 ? '' : 's'}`;
  return `${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} overdue`;
};

let seq = 500;
const nextJournalNo = () => `JV-2025-${String(++seq).padStart(3, '0')}`;

/** Installment templates used by the schedule setup modal. */
const scheduleFor = (frequency: Frequency, total: number, startISO: string, split = 4): Omit<Installment, 'mode'>[] => {
  const start = new Date(startISO);
  const mk = (name: string, amount: number, due: Date) => ({
    no: 0,
    name,
    amount,
    dueDate: due.toISOString().slice(0, 10),
    status: 'Upcoming' as InstStatus
  });
  const pushMonth = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
  if (frequency === 'One-Time') return [mk('One-Time (Full)', total, start)];
  if (frequency === 'Monthly') {
    const each = Math.round(total / 12);
    return Array.from({ length: 12 }, (_, i) => {
      const due = pushMonth(start, i);
      const amount = i === 11 ? total - each * 11 : each;
      return mk(`${months[due.getMonth()]} ${String(due.getFullYear()).slice(2)} (Monthly ${i + 1}/12)`, amount, due);
    });
  }
  if (frequency === 'Term-wise') {
    const each = Math.round(total / 3);
    return [
    { ...mk('Term 1 (Apr-Jun)', each, new Date(start.getFullYear(), 3, 1)) },
    { ...mk('Term 2 (Jul-Sep)', each, new Date(start.getFullYear(), 6, 1)) },
    { ...mk('Term 3 (Oct-Mar)', total - each * 2, new Date(start.getFullYear(), 9, 1)) }];

  }
  if (frequency === 'Quarterly') {
    const each = Math.round(total / 4);
    return Array.from({ length: 4 }, (_, i) => {
      const due = pushMonth(start, i * 3);
      const amount = i === 3 ? total - each * 3 : each;
      return mk(`Quarter ${i + 1} (${months[due.getMonth()]} ${String(due.getFullYear()).slice(2)})`, amount, due);
    });
  }
  if (frequency === 'Half-Yearly') {
    const each = Math.round(total / 2);
    return [
    mk('Half-Year 1 (Apr-Sep)', each, new Date(start.getFullYear(), 3, 1)),
    mk('Half-Year 2 (Oct-Mar)', total - each, new Date(start.getFullYear(), 9, 1))];

  }
  // Custom — n equal parts, user sized
  const count = Math.max(2, Math.min(12, split));
  const each = Math.round(total / count);
  return Array.from({ length: count }, (_, i) => {
    const due = pushMonth(start, i);
    const amount = i === count - 1 ? total - each * (count - 1) : each;
    return mk(`Custom ${i + 1} of ${count}`, amount, due);
  });
};

/** Split an amount across fee heads, proportional to each head's remaining balance. */
const allocateToFeeHeads = (feeRows: FeeRow[], amount: number) =>
feeRows.map((row) => {
  const remainingAll = feeRows.reduce((n, r) => n + Math.max(0, r.annual - r.waivedBefore), 0);
  const remaining = Math.max(0, row.annual - row.waivedBefore);
  const share = remainingAll <= 0 ? 0 : Math.round((remaining / remainingAll) * amount);
  return { component: row.component, annual: row.annual, waivedBefore: row.waivedBefore, thisWaiver: Math.min(share, remaining) };
});

/* ============================================================ mock data */

const REASONS_PARTIAL = [
'Term 3 held back — marks below renewal criteria',
'Installment released after attendance confirmation',
'Partial release against pending fee clearance',
'Balance released on government fund receipt'];

const AUTHORIZERS = ['Principal — Mr. A. Sharma', 'Vice Principal — Mrs. R. Iyer', 'Director — Mr. S. Desai', 'Finance Head — Mrs. P. Gupta'];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'Minority', 'Girls', 'Sports', 'Merit'];
const CLASS_LIST = ['Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SCHEME_OPTIONS = [
'National Merit Scholarship (NSP)',
'School Merit Scholarship',
'Sports Excellence Award',
'NSP Cash Scholarship',
'Need-Based Scholarship',
'SC/ST Scholarship',
'State Scholarship'];

const bank = (holder: string, relation: string, acct: string, ifsc: string, bankName = 'State Bank of India'): BankDetails => ({
  holder,
  relation,
  bank: bankName,
  account: `XXXX XXXX XXXX ${acct.slice(-4)}`,
  ifsc,
  accType: 'Savings Account',
  branch: 'Main Branch, City',
  pennyDrop: true,
  aadhaarLinked: true
});

const feeStandard: FeeRow[] = [
{ component: 'Tuition Fee', annual: 20000, waivedBefore: 0 },
{ component: 'Exam Fee', annual: 3750, waivedBefore: 0 },
{ component: 'Activity Fee', annual: 2250, waivedBefore: 0 },
{ component: 'Transport Fee', annual: 1500, waivedBefore: 0 }];


const withWaived = (rows: FeeRow[], already: number) => {
  const out = rows.map((r) => ({ ...r }));
  let left = already;
  out.forEach((r) => {
    const take = Math.min(r.annual, left);
    r.waivedBefore = take;
    left -= take;
  });
  return out;
};

const emptyInstallments = (): Installment[] => [];

const seed = (): DisbursementRecord[] => [
{
  id: 'r1',
  disbNo: 'DSB-2025-001',
  student: 'Rahul Kumar',
  className: 'Class 10-A',
  admissionNo: 'ADM-2022-045',
  appNo: 'APP-2025-001',
  scheme: 'National Merit Scholarship',
  schemeShort: 'National Merit Schol.',
  schemeType: 'Govt.',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/001',
  nspRef: 'NSP-2025-OBC-XXXXXXXXX',
  govtSanctionNo: 'MSJE/NSP/OBC/2025-26/XXXXX',
  portal: 'NSP Portal',
  total: 22500,
  govtFundsReceived: 22500,
  govtFundsReceivedOn: '2025-09-15',
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  category: 'OBC',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 7500, dueDate: '2025-04-01', mode: 'Fee Waiver', appliedOn: '2025-04-01', journalNo: 'JV-2025-045', status: 'Disbursed' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 7500, dueDate: '2025-07-01', mode: 'Fee Waiver', appliedOn: '2025-07-01', journalNo: 'JV-2025-089', status: 'Disbursed' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 7500, dueDate: '2025-10-01', mode: 'Fee Waiver', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 15000),
  bank: bank('Suresh Kumar', 'Father', 'XXXX7823', 'SBIN0007823')
},
{
  id: 'r2',
  disbNo: 'DSB-2025-002',
  student: 'Priya Sharma',
  className: 'Class 9-B',
  admissionNo: 'ADM-2023-112',
  appNo: 'APP-2025-002',
  scheme: 'School Merit Scholarship',
  schemeShort: 'School Merit Schol.',
  schemeType: 'Internal',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/002',
  total: 15000,
  govtFundsReceived: 0,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  category: 'Merit',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 5000, dueDate: '2025-04-01', mode: 'Fee Waiver', appliedOn: '2025-04-01', journalNo: 'JV-2025-046', status: 'Disbursed' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 5000, dueDate: '2025-07-01', mode: 'Fee Waiver', appliedOn: '2025-07-01', journalNo: 'JV-2025-090', status: 'Disbursed' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 5000, dueDate: '2025-09-20', mode: 'Fee Waiver', appliedOn: '2025-09-20', journalNo: 'JV-2025-131', status: 'Disbursed' }],

  feeRows: withWaived(feeStandard, 15000),
  bank: bank('Rakesh Sharma', 'Father', 'XXXX4411', 'HDFC0004411', 'HDFC Bank')
},
{
  id: 'r3',
  disbNo: 'DSB-2025-003',
  student: 'Ravi Singh',
  className: 'Class 10-B',
  admissionNo: 'ADM-2022-088',
  appNo: 'APP-2025-003',
  scheme: 'Sports Excellence Award',
  schemeShort: 'Sports Excellence',
  schemeType: 'Internal',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/003',
  total: 9000,
  govtFundsReceived: 0,
  mode: 'Bank Transfer',
  frequency: 'One-Time',
  category: 'Sports',
  installments: [
  { no: 1, name: 'One-Time (Full)', amount: 9000, dueDate: '2025-08-10', mode: 'Bank Transfer', appliedOn: '2025-08-10', journalNo: 'JV-2025-102', status: 'Disbursed' }],

  feeRows: withWaived(feeStandard, 0),
  bank: bank('Suresh Singh', 'Father', 'XXXX7823', 'SBIN0007823')
},
{
  id: 'r4',
  disbNo: 'DSB-2025-004',
  student: 'Meera Joshi',
  className: 'Class 11-A',
  admissionNo: 'ADM-2021-014',
  appNo: 'APP-2025-004',
  scheme: 'NSP Cash Scholarship',
  schemeShort: 'NSP Cash Schol.',
  schemeType: 'Govt.',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/004',
  nspRef: 'NSP-2025-GEN-YYYYYYYYY',
  govtSanctionNo: 'MSJE/NSP/GEN/2025-26/YYYYY',
  portal: 'NSP Portal',
  total: 12500,
  govtFundsReceived: 6250,
  govtFundsReceivedOn: '2025-09-05',
  mode: 'Bank Transfer',
  frequency: 'Half-Yearly',
  category: 'General',
  installments: [
  { no: 1, name: 'Half-Year 1 (Apr-Sep)', amount: 6250, dueDate: '2025-05-01', mode: 'Bank Transfer', appliedOn: '2025-05-01', journalNo: 'JV-2025-060', status: 'Disbursed' },
  { no: 2, name: 'Half-Year 2 (Oct-Mar)', amount: 6250, dueDate: '2025-10-05', mode: 'Bank Transfer', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 0),
  bank: bank('Anil Joshi', 'Father', 'XXXX2210', 'ICIC0002210', 'ICICI Bank')
},
{
  id: 'r5',
  disbNo: 'DSB-2025-005',
  student: 'Sita Patel',
  className: 'Class 8-A',
  admissionNo: 'ADM-2024-033',
  appNo: 'APP-2025-005',
  scheme: 'National Merit Scholarship',
  schemeShort: 'National Merit Schol.',
  schemeType: 'Govt.',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/005',
  nspRef: 'NSP-2025-SC-ZZZZZZZZZ',
  govtSanctionNo: 'MSJE/NSP/SC/2025-26/ZZZZZ',
  portal: 'NSP Portal',
  total: 22500,
  govtFundsReceived: 0,
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  category: 'SC',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 7500, dueDate: '2025-04-01', mode: 'Fee Waiver', status: 'Upcoming' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 7500, dueDate: '2025-07-01', mode: 'Fee Waiver', status: 'Upcoming' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 7500, dueDate: '2025-10-01', mode: 'Fee Waiver', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 0),
  bank: bank('Mahesh Patel', 'Father', 'XXXX9087', 'BARB0009087', 'Bank of Baroda')
},
{
  id: 'r6',
  disbNo: 'DSB-2025-006',
  student: 'Amit Verma',
  className: 'Class 7-C',
  admissionNo: 'ADM-2024-071',
  appNo: 'APP-2025-006',
  scheme: 'Need-Based Scholarship',
  schemeShort: 'Need-Based Schol.',
  schemeType: 'Internal',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/006',
  total: 12000,
  govtFundsReceived: 0,
  mode: 'Fee Waiver',
  frequency: 'Quarterly',
  category: 'OBC',
  installments: [
  { no: 1, name: 'Quarter 1 (Apr)', amount: 3000, dueDate: '2025-04-01', mode: 'Fee Waiver', appliedOn: '2025-04-02', journalNo: 'JV-2025-048', status: 'Disbursed' },
  { no: 2, name: 'Quarter 2 (Jul)', amount: 3000, dueDate: '2025-07-01', mode: 'Fee Waiver', status: 'Upcoming' },
  { no: 3, name: 'Quarter 3 (Oct)', amount: 3000, dueDate: '2025-10-01', mode: 'Fee Waiver', status: 'Upcoming' },
  { no: 4, name: 'Quarter 4 (Jan)', amount: 3000, dueDate: '2026-01-01', mode: 'Fee Waiver', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 4000),
  bank: bank('Ramesh Verma', 'Father', 'XXXX5566', 'PUNB0005566', 'Punjab National Bank')
},
{
  id: 'r7',
  disbNo: 'DSB-2025-007',
  student: 'Kavya Sharma',
  className: 'Class 9-C',
  admissionNo: 'ADM-2023-190',
  appNo: 'APP-2025-007',
  scheme: 'Merit Scholarship',
  schemeShort: 'Merit Scholarship',
  schemeType: 'Internal',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/007',
  total: 10000,
  govtFundsReceived: 0,
  mode: 'Bank Transfer',
  frequency: 'Custom',
  category: 'Merit',
  installments: emptyInstallments(),
  feeRows: withWaived(feeStandard, 0),
  bank: bank('Sanjay Sharma', 'Father', 'XXXX3344', 'SBIN0003344')
},
{
  id: 'r8',
  disbNo: 'DSB-2025-008',
  student: 'Vikram Patel',
  className: 'Class 12-A',
  admissionNo: 'ADM-2020-002',
  appNo: 'APP-2025-008',
  scheme: 'SC/ST Scholarship',
  schemeShort: 'SC/ST Scholarship',
  schemeType: 'Govt.',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/008',
  nspRef: 'NSP-2025-ST-WWWWWWWWW',
  govtSanctionNo: 'MSJE/NSP/ST/2025-26/WWWWW',
  portal: 'State Portal',
  total: 18000,
  govtFundsReceived: 18000,
  govtFundsReceivedOn: '2025-08-28',
  mode: 'Fee Waiver',
  frequency: 'Term-wise',
  category: 'ST',
  installments: [
  { no: 1, name: 'Term 1 (Apr-Jun)', amount: 6000, dueDate: '2025-04-01', mode: 'Fee Waiver', appliedOn: '2025-04-05', journalNo: 'JV-2025-051', status: 'Disbursed' },
  { no: 2, name: 'Term 2 (Jul-Sep)', amount: 6000, dueDate: '2025-07-01', mode: 'Fee Waiver', status: 'Upcoming' },
  { no: 3, name: 'Term 3 (Oct-Mar)', amount: 6000, dueDate: '2025-10-01', mode: 'Fee Waiver', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 6000),
  bank: bank('Bhavesh Patel', 'Father', 'XXXX1188', 'SBIN0001188')
},
{
  id: 'r9',
  disbNo: 'DSB-2025-009',
  student: 'Ananya Desai',
  className: 'Class 11-B',
  admissionNo: 'ADM-2021-078',
  appNo: 'APP-2025-009',
  scheme: 'State Scholarship',
  schemeShort: 'State Scholarship',
  schemeType: 'Govt.',
  sanctionLetter: 'XYZ/SCH/GOVT/2025-26/009',
  govtSanctionNo: 'GJ/SS/2025-26/0091',
  portal: 'State Portal',
  total: 16000,
  govtFundsReceived: 8000,
  govtFundsReceivedOn: '2025-09-02',
  mode: 'Bank Transfer',
  frequency: 'Half-Yearly',
  category: 'Girls',
  installments: [
  { no: 1, name: 'Half-Year 1 (Apr-Sep)', amount: 8000, dueDate: '2025-06-01', mode: 'Bank Transfer', appliedOn: '2025-06-03', journalNo: 'JV-2025-074', status: 'Disbursed' },
  { no: 2, name: 'Half-Year 2 (Oct-Mar)', amount: 8000, dueDate: '2025-10-10', mode: 'Bank Transfer', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 0),
  bank: bank('Nilesh Desai', 'Father', 'XXXX6699', 'UTIB0006699', 'Axis Bank')
},
{
  id: 'r10',
  disbNo: 'DSB-2025-010',
  student: 'Mohit Rao',
  className: 'Class 8-B',
  admissionNo: 'ADM-2024-121',
  appNo: 'APP-2025-010',
  scheme: 'Need-Based Scholarship',
  schemeShort: 'Need-Based Schol.',
  schemeType: 'Internal',
  sanctionLetter: 'XYZ/SCH/INT/2025-26/010',
  total: 9000,
  govtFundsReceived: 0,
  mode: 'Fee Waiver',
  frequency: 'Custom',
  category: 'Minority',
  installments: [
  { no: 1, name: 'Custom 1 of 3', amount: 3000, dueDate: '2025-04-15', mode: 'Fee Waiver', appliedOn: '2025-04-15', journalNo: 'JV-2025-055', status: 'Disbursed' },
  { no: 2, name: 'Custom 2 of 3', amount: 3000, dueDate: '2025-06-15', mode: 'Fee Waiver', appliedOn: '2025-06-15', journalNo: 'JV-2025-081', status: 'Disbursed' },
  { no: 3, name: 'Custom 3 of 3', amount: 3000, dueDate: '2025-11-15', mode: 'Fee Waiver', status: 'Upcoming' }],

  feeRows: withWaived(feeStandard, 6000),
  bank: bank('Imtiyaz Rao', 'Father', 'XXXX7788', 'SBIN0007788')
}];


/* ====================================================== derived helpers */

const disbursedOf = (r: DisbursementRecord) =>
r.installments.filter((i) => i.status === 'Disbursed').reduce((n, i) => n + i.amount, 0);

const remainingOf = (r: DisbursementRecord) => Math.max(0, r.total - disbursedOf(r));

const doneCount = (r: DisbursementRecord) => r.installments.filter((i) => i.status === 'Disbursed').length;

const totalCount = (r: DisbursementRecord) =>
r.installments.length || (r.frequency === 'Term-wise' ? 3 : r.frequency === 'Quarterly' ? 4 : r.frequency === 'Monthly' ? 12 : r.frequency === 'Half-Yearly' ? 2 : 1);

const nextInstallment = (r: DisbursementRecord): Installment | undefined =>
r.installments.find((i) => i.status === 'Upcoming' || i.status === 'Suspended');

const overdueInstallment = (r: DisbursementRecord) =>
r.installments.find((i) => i.status === 'Upcoming' && isPast(i.dueDate));

const statusOf = (r: DisbursementRecord): DisbStatus => {
  if (r.installments.length === 0) return 'No Schedule';
  if (overdueInstallment(r)) return 'Overdue';
  const disb = disbursedOf(r);
  if (disb >= r.total) return 'Full';
  if (disb > 0) return 'Partial';
  return 'Pending';
};

const instInfo = (r: DisbursementRecord) => {
  if (r.installments.length === 0) return 'Not scheduled';
  return `${doneCount(r)} of ${r.installments.length} done`;
};

const progressOf = (r: DisbursementRecord) => pct(disbursedOf(r), r.total);

/* ========================================================= sub-components */

type Tone = 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'gray';
const TONES: Record<Tone, { bg: string; text: string; ring: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'border-indigo-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'border-emerald-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'border-rose-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'border-sky-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'border-violet-200' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'border-gray-200' }
};

function KpiCard({
  icon: Icon, label, value, hint, tone = 'indigo', badge
}: {icon: LucideIcon;label: string;value: string;hint?: string;tone?: Tone;badge?: React.ReactNode;}) {
  const t = TONES[tone];
  return (
    <div className={`rounded-lg border ${t.ring} bg-white shadow-sm p-3`}>
      <div className="flex items-start gap-2">
        <span className={`w-8 h-8 rounded-lg ${t.bg} ${t.text} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{value}</p>
          {hint && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{hint}</p>}
          {badge}
        </div>
      </div>
    </div>);

}

const typeBadge = (t: ScholarType) =>
t === 'Govt.' ? <Badge variant="info">🏛️ Govt.</Badge> : <Badge variant="success">🏫 Internal</Badge>;

const modeBadge = (m: DisbMode) =>
m === 'Fee Waiver' ?
<Badge variant="primary">💸 Fee Waiver</Badge> :
<Badge variant="warning">🏦 Bank Transfer</Badge>;

const statusBadge = (s: DisbStatus | InstStatus) => {
  switch (s) {
    case 'Full':
    case 'Disbursed':
      return <Badge variant="success">✅ {s}</Badge>;
    case 'Partial':
      return <Badge variant="primary">🔄 Partial</Badge>;
    case 'Pending':
      return <Badge variant="warning">⏳ Pending</Badge>;
    case 'Overdue':
      return <Badge variant="danger">🔴 Overdue</Badge>;
    case 'No Schedule':
      return <Badge variant="secondary">⚠️ No Schedule</Badge>;
    case 'Upcoming':
      return <Badge variant="secondary">⏳ Upcoming</Badge>;
    case 'Cancelled':
      return <Badge variant="danger">❌ Cancelled</Badge>;
    default:
      return <Badge variant="warning">🔒 Suspended</Badge>;
  }
};

const TH = ({ children, className = '' }: {children?: React.ReactNode;className?: string;}) =>
<th className={`p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${className}`}>{children}</th>;

const TD = ({ children, className = '' }: {children?: React.ReactNode;className?: string;}) =>
<td className={`p-3 text-xs text-gray-700 ${className}`}>{children}</td>;

/** Dr / Cr preview used by both process modals. */
function JournalPreview({
  title, lines, narration, note
}: {title: string;lines: {account: string;debit?: number;credit?: number;hint?: string;}[];narration: string;note?: string;}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5" /> {title}
      </p>
      {note && <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 mb-2">✅ {note}</p>}
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

function ProgressBar({ value, tone = 'indigo' }: {value: number;tone?: string;}) {
  const color = tone === 'emerald' ? 'bg-emerald-500' : tone === 'amber' ? 'bg-amber-500' : tone === 'rose' ? 'bg-rose-500' : 'bg-indigo-600';
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>);

}

/* ================================================== 7 · schedule tracker */

const SEED_REF: DisbursementRecord[] = seed();

export function DisbursementTrackingTableSection({ record }: {record?: DisbursementRecord;}) {
  const row: DisbursementRecord = record || SEED_REF[0];
  const disb = disbursedOf(row);
  const remaining = remainingOf(row);
  const done = doneCount(row);
  const total = row.installments.length || totalCount(row);
  const progress = progressOf(row);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-sm font-semibold text-gray-900">
          {row.mode === 'Fee Waiver' ? '💸' : '🏦'} {row.student} — {row.scheme}
        </span>
        <span className="text-xs text-gray-500">Total Scholarship: {INR(row.total)}</span>
        <span className="text-xs text-gray-500">Mode: {row.frequency}</span>
        <span className="text-xs text-gray-500">Status: {statusBadge(statusOf(row))}</span>
      </div>

      {row.installments.length === 0 ?
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          No schedule set up yet for this scholarship. Use “Setup Schedule” to create the installments.
        </div> :

      <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <TH className="w-10">#</TH>
                <TH>Installment Name</TH>
                <TH className="text-right">Amount</TH>
                <TH>Due Date</TH>
                <TH>Mode</TH>
                <TH>Applied On</TH>
                <TH>Journal Entry</TH>
                <TH>Status</TH>
                <TH className="text-right">Action</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {row.installments.map((i) =>
            <tr key={i.no} className={i.status === 'Upcoming' && isPast(i.dueDate) ? 'bg-rose-50/40' : ''}>
                  <TD>{i.no}</TD>
                  <TD className="font-medium text-gray-800">{i.name}</TD>
                  <TD className="text-right">{INR(i.amount)}</TD>
                  <TD>{fmtDate(i.dueDate)}</TD>
                  <TD>{modeBadge(i.mode)}</TD>
                  <TD>{i.appliedOn ? fmtDate(i.appliedOn) : '—'}</TD>
                  <TD className="font-mono text-gray-500">{i.journalNo || '—'}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      {statusBadge(i.status)}
                      {i.status === 'Upcoming' &&
                  <span className={`text-[10px] ${isPast(i.dueDate) ? 'text-rose-600' : 'text-gray-400'}`}>
                          ({dueLabel(i.dueDate)})
                        </span>
                  }
                    </div>
                  </TD>
                  <TD className="text-right">
                    {i.status === 'Disbursed' ?
                <div className="inline-flex items-center gap-1">
                        <button className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" title="Receipt">
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </div> :

                <Button size="xs" variant="outline" leftIcon={<BadgeIndianRupee className="w-3 h-3" />}>
                        {isPast(i.dueDate) ? 'Disburse Now' : 'Disburse'}
                      </Button>
                }
                  </TD>
                </tr>
            )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <TD className="font-semibold">Total</TD>
                <TD />
                <TD className="text-right font-semibold">{INR(row.total)}</TD>
                <TD colSpan={6} className="text-xs text-gray-500">
                  Disbursed {INR(disb)} ({pct(disb, row.total)}%) · Remaining {INR(remaining)} ({pct(remaining, row.total)}%) ·{' '}
                  {done} of {total} installments
                </TD>
              </tr>
            </tfoot>
          </table>
        </div>
      }

      <div className="flex items-center gap-3">
        <ProgressBar value={progress} tone={progress >= 100 ? 'emerald' : progress > 0 ? 'amber' : 'indigo'} />
        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{progress}% disbursed</span>
      </div>
    </div>);

}

/* ================================================= 8 · govt fund tracker */

function GovtFundTracker({ records }: {records: DisbursementRecord[];}) {
  const rows = records.filter((r) => r.schemeType === 'Govt.');
  const received = rows.reduce((n, r) => n + r.govtFundsReceived, 0);
  const applied = rows.reduce((n, r) => n + disbursedOf(r), 0);
  const balance = Math.max(0, received - applied);
  return (
    <Card
      title="Government Fund Tracker"
      headerAction={
      <span className="text-xs text-gray-500">
          Received {INR(received)} · Applied {INR(applied)} · Balance {INR(balance)}
        </span>
      }>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <TH>Scheme / Portal</TH>
              <TH className="text-right">Funds Received</TH>
              <TH>Received On</TH>
              <TH className="text-right">Applied / Disbursed</TH>
              <TH className="text-right">Balance</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => {
              const disb = disbursedOf(r);
              const bal = r.govtFundsReceived - disb;
              return (
                <tr key={r.id}>
                  <TD>
                    <span className="font-medium text-gray-800">{r.scheme}</span>
                    <p className="text-[10px] text-gray-400">{r.portal || 'Govt. Portal'} · {r.govtSanctionNo || '—'}</p>
                  </TD>
                  <TD className="text-right">{INR(r.govtFundsReceived)}</TD>
                  <TD>{fmtDate(r.govtFundsReceivedOn)}</TD>
                  <TD className="text-right">{INR(disb)}</TD>
                  <TD className={`text-right font-medium ${bal > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{INR(bal)}</TD>
                  <TD>
                    {r.govtFundsReceived === 0 ?
                    <Badge variant="warning">Funds awaited</Badge> :
                    bal > 0 ?
                    <Badge variant="primary">Partially applied</Badge> :

                    <Badge variant="success">Fully applied</Badge>
                    }
                  </TD>
                </tr>);

            })}
            {rows.length === 0 && <tr><TD className="text-gray-500">No government scholarships in the current list.</TD></tr>}
          </tbody>
        </table>
      </div>
    </Card>);

}

/* ========================================================= 9 · analytics */

function AnalyticsStrip({ records }: {records: DisbursementRecord[];}) {
  const monthly = useMemo(() => {
    const buckets: Record<string, number> = {};
    records.forEach((r) =>
    r.installments.forEach((i) => {
      if (i.status !== 'Disbursed' || !i.appliedOn) return;
      const d = new Date(i.appliedOn);
      const key = `${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      buckets[key] = (buckets[key] || 0) + i.amount;
    })
    );
    return Object.entries(buckets).sort((a, b) => (new Date(`01 ${a[0]}`).getTime() || 0) - (new Date(`01 ${b[0]}`).getTime() || 0)).slice(-6);
  }, [records]);

  const byMode = (['Fee Waiver', 'Bank Transfer'] as DisbMode[]).map((m) => ({
    label: m,
    value: records.reduce((n, r) => n + r.installments.filter((i) => i.status === 'Disbursed' && i.mode === m).reduce((s, i) => s + i.amount, 0), 0)
  }));
  const byType = (['Govt.', 'Internal'] as ScholarType[]).map((t) => ({
    label: t,
    value: records.filter((r) => r.schemeType === t).reduce((n, r) => n + disbursedOf(r), 0)
  }));
  const schemeTop = records.
  map((r) => ({ label: r.student, value: disbursedOf(r) })).
  sort((a, b) => b.value - a.value).
  slice(0, 5);

  const maxOf = (rows: {value: number;}[]) => Math.max(1, ...rows.map((r) => r.value));

  const Bars = ({ title, rows, tone }: {title: string;rows: {label: string;value: number;}[];tone: string;}) => {
    const max = maxOf(rows);
    return (
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{title}</p>
        <div className="space-y-2">
          {rows.map((r) =>
          <div key={r.label} className="flex items-center gap-2">
              <span className="w-28 text-[11px] text-gray-500 truncate">{r.label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full ${tone}`} style={{ width: `${(r.value / max) * 100}%` }} />
              </div>
              <span className="w-24 text-right text-[11px] font-medium text-gray-700">{INR(r.value)}</span>
            </div>
          )}
          {rows.length === 0 && <p className="text-xs text-gray-400">No disbursed amount yet.</p>}
        </div>
      </div>);

  };

  return (
    <Card title="Charts & Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Bars title="Monthly Disbursement" rows={monthly.map(([label, value]) => ({ label, value }))} tone="bg-indigo-500" />
        <Bars title="By Disbursement Mode" rows={byMode} tone="bg-emerald-500" />
        <Bars title="Top 5 Students (Disbursed)" rows={schemeTop} tone="bg-violet-500" />
      </div>
      <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" /> Government vs internal split — Govt. {INR(byType[0].value)} · Internal {INR(byType[1].value)}
      </p>
    </Card>);

}

/* ================================ 6A · process fee waiver settlement form */

function FeeWaiverModal({
  record, open, onClose, onConfirm
}: {record: DisbursementRecord | null;open: boolean;onClose: () => void;onConfirm: (amount: number, date: string, ref: string, details: string) => void;}) {
  const [mode, setMode] = useState<DisbMode>('Fee Waiver');
  const [amountType, setAmountType] = useState<'full' | 'partial'>('full');
  const [partial, setPartial] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [allocMode, setAllocMode] = useState<'auto' | 'custom'>('auto');
  const [date, setDate] = useState(todayISO());
  const [ref, setRef] = useState('Term 3 Disbursement — Oct 2025');
  const [authorizer, setAuthorizer] = useState(AUTHORIZERS[0]);
  const [post, setPost] = useState({ journal: true, fee: true, receipt: true, notify: true, tracker: true, status: true, print: false });

  React.useEffect(() => {
    if (open) {
      setMode('Fee Waiver');
      setAmountType('full');
      setPartial(0);
      setReason('');
      setAllocMode('auto');
      setDate(todayISO());
      setRef('Term 3 Disbursement — Oct 2025');
      setAuthorizer(AUTHORIZERS[0]);
    }
  }, [open, record?.id]);

  if (!record) return null;
  const disb = disbursedOf(record);
  const remaining = remainingOf(record);
  const amount = amountType === 'full' ? remaining : Math.min(partial || 0, remaining);
  const nextNo = doneCount(record) + 1;
  const totalInst = record.installments.length || totalCount(record);
  const alloc = allocateToFeeHeads(record.feeRows, amount);
  const annualTotal = record.feeRows.reduce((n, r) => n + r.annual, 0);
  const waivedBefore = record.feeRows.reduce((n, r) => n + r.waivedBefore, 0);
  const studentPays = Math.max(0, annualTotal - waivedBefore - amount);
  const isGovt = record.schemeType === 'Govt.';

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`💸 Process Fee Waiver Settlement — ${record.student} · ${record.scheme} · ${record.schemeType === 'Govt.' ? '🏛️ Govt.' : '🏫 Internal'}`}
      size="xl"
      footer={
      <div className="flex flex-wrap items-center gap-2">
          <Button leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={() => onConfirm(amount, date, ref, `Processed By: Mrs. P. Gupta — Finance Manager · Authorized By: ${authorizer}`)}>
            Confirm &amp; Process Waiver
          </Button>
          <Button variant="outline" leftIcon={<Save className="w-4 h-4" />} onClick={onClose}>Save as Draft</Button>
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setMode('Bank Transfer')}>
            Change to Bank Transfer
          </Button>
          <Button variant="ghost" leftIcon={<Eye className="w-4 h-4" />} onClick={() => setAllocMode('custom')}>
            Preview Journal Entry
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      }>

      <div className="space-y-4">
        {/* Panel 1 — student & scholarship overview */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 1 · Student &amp; Scholarship Overview</p>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-700">
            <p><span className="text-gray-500">Student Name:</span> <span className="font-medium">{record.student}</span></p>
            <p><span className="text-gray-500">Class:</span> {record.className} · <span className="text-gray-500">Adm:</span> {record.admissionNo}</p>
            <p><span className="text-gray-500">Scheme:</span> {record.scheme} {isGovt ? '(NSP)' : ''}</p>
            <p><span className="text-gray-500">App No:</span> {record.appNo}</p>
            <p><span className="text-gray-500">Scholarship Type:</span> {isGovt ? `🏛️ Government — ${record.portal || 'Govt. Portal'}` : '🏫 Internal — School Funded'}</p>
            <p><span className="text-gray-500">Sanction Letter:</span> {record.sanctionLetter}</p>
            {isGovt && <p><span className="text-gray-500">NSP Ref. No.:</span> {record.nspRef || '—'}</p>}
            {isGovt && <p><span className="text-gray-500">Govt. Sanction No.:</span> {record.govtSanctionNo || '—'}</p>}
            <p className="inline-flex items-center gap-1.5">
              <span className="text-gray-500">Total Scholarship:</span>
              <span className="font-semibold">{INR(record.total)}</span>
              <span className="text-gray-400">(from Scholarship Master — 🔒 Read Only)</span>
            </p>
            <p>
              <span className="text-gray-500">Govt. Funds Rcvd.:</span>{' '}
              {record.govtFundsReceived > 0 ?
              <span className="text-emerald-700 font-medium">✅ {INR(record.govtFundsReceived)} received on {fmtDate(record.govtFundsReceivedOn)}</span> :

              <span className="text-amber-700">Awaiting funds</span>}
            </p>
          </div>
        </div>

        {/* Panel 2 — disbursement type selection */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 2 · Disbursement Type Selection</p>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-gray-600 mb-1">How do you want to disburse this scholarship?</p>
            {([
            { key: 'Fee Waiver' as DisbMode, title: '💸 OPTION A: FEE WAIVER SETTLEMENT', lines: ['Scholarship amount is DEDUCTED from the student’s fee account', 'Student pays REDUCED fee', 'No money transferred to student/parent bank account', 'School adjusts fee in the ERP — simple and fast'] },
            { key: 'Bank Transfer' as DisbMode, title: '🏦 OPTION B: BANK ACCOUNT TRANSFER', lines: ['Scholarship amount TRANSFERRED to student/parent bank account', 'Student still pays full fee separately (or fee already collected)', 'Money physically moves to their bank', 'Use for cash scholarships / govt. DBT cases'] }]).
            map((opt) =>
            <label
              key={opt.key}
              className={`block rounded-lg border p-3 cursor-pointer ${mode === opt.key ? 'border-indigo-300 bg-indigo-50/40' : 'border-gray-200 hover:bg-gray-50'}`}>

                <span className="flex items-center gap-2">
                  <input
                  type="radio"
                  name="disb-mode"
                  className="text-indigo-600 focus:ring-indigo-500"
                  checked={mode === opt.key}
                  onChange={() => setMode(opt.key)} />

                  <span className="text-sm font-semibold text-gray-800">{opt.title}</span>
                </span>
                <ul className="mt-2 ml-6 space-y-0.5 text-[11px] text-gray-600 list-disc">
                  {opt.lines.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </label>
            )}
          </div>
        </div>

        {/* Panel 3 — amount, full or partial */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 3 · Disbursement Amount — Full or Partial?</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Total Scholarship Amount</p>
                <p className="font-semibold text-gray-900">{INR(record.total)} <span className="text-gray-400 font-normal">🔒</span></p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Already Disbursed</p>
                <p className="font-semibold text-gray-900">{INR(disb)} <span className="text-gray-400 font-normal">(Installments {doneCount(record) > 0 ? `1${doneCount(record) > 1 ? `–${doneCount(record)}` : ''}` : '—'})</span></p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Remaining to Disburse</p>
                <p className="font-semibold text-indigo-700">{INR(remaining)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="radio" name="amt-type" className="text-indigo-600 focus:ring-indigo-500" checked={amountType === 'full'} onChange={() => setAmountType('full')} />
                Full Remaining Amount — <span className="font-semibold">{INR(remaining)}</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="radio" name="amt-type" className="text-indigo-600 focus:ring-indigo-500" checked={amountType === 'partial'} onChange={() => setAmountType('partial')} />
                Partial Amount — enter amount below
              </label>
            </div>

            {amountType === 'partial' &&
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Partial Amount to Disburse" type="number" value={String(partial)} onChange={(e) => setPartial(Number(e.target.value) || 0)} />
                <Input label="Reason for Partial" placeholder="e.g. Marks verification pending" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="self-end">
                  <p className="text-xs text-gray-500">This Installment No.</p>
                  <p className="text-sm font-semibold text-gray-800">{nextNo} of {totalInst} <span className="text-gray-400 font-normal">🔒 auto</span></p>
                </div>
              </div>
            }
            {amountType === 'full' &&
            <p className="text-xs text-gray-500">
              This Installment No.: <span className="font-semibold text-gray-800">{nextNo} of {totalInst}</span> 🔒 auto-calculated
            </p>
            }
          </div>
        </div>

        {/* Panel 4 — fee waiver details */}
        {mode === 'Fee Waiver' &&
        <div className="rounded-lg border border-gray-200">
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 4 · Fee Waiver Details</p>
            </div>
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-gray-700">Student’s current fee account:</p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <TH>Fee Component</TH>
                      <TH className="text-right">Total Fee (Annual)</TH>
                      <TH className="text-right">Already Waived</TH>
                      <TH className="text-right">This Waiver (Now)</TH>
                      <TH className="text-right">Remaining After</TH>
                      <TH className="text-right">Student Still Pays</TH>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {alloc.map((a) =>
                  <tr key={a.component}>
                        <TD>{a.component}</TD>
                        <TD className="text-right">{INR(a.annual)}</TD>
                        <TD className="text-right">{INR(a.waivedBefore)}</TD>
                        <TD className="text-right font-medium text-indigo-700">{INR(a.thisWaiver)}</TD>
                        <TD className="text-right">{INR(Math.max(0, a.annual - a.waivedBefore - a.thisWaiver))}</TD>
                        <TD className="text-right">{INR(Math.max(0, a.annual - a.waivedBefore - a.thisWaiver))}</TD>
                      </tr>
                  )}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <TD className="font-semibold">TOTAL</TD>
                      <TD className="text-right font-semibold">{INR(annualTotal)}</TD>
                      <TD className="text-right font-semibold">{INR(waivedBefore)}</TD>
                      <TD className="text-right font-semibold text-indigo-700">{INR(amount)}</TD>
                      <TD className="text-right font-semibold">{INR(Math.max(0, annualTotal - waivedBefore - amount))}</TD>
                      <TD className="text-right font-semibold">{INR(studentPays)}</TD>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-gray-600">Fee components to apply waiver:</p>
                <label className="flex items-center gap-2 text-xs text-gray-800">
                  <input type="radio" name="alloc" className="text-indigo-600 focus:ring-indigo-500" checked={allocMode === 'auto'} onChange={() => setAllocMode('auto')} />
                  As per Scholarship Master — auto-allocated
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-800">
                  <input type="radio" name="alloc" className="text-indigo-600 focus:ring-indigo-500" checked={allocMode === 'custom'} onChange={() => setAllocMode('custom')} />
                  Custom — manually select which fee head to apply the waiver to
                </label>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">Journal Entry Preview</p>
                {isGovt ?
              <>
                    <JournalPreview
                  title="🏛️ Step 1 — Recognizing Govt. Funds Already Received"
                  note={`Already recorded when funds received from govt. (JV-2025-098)`}
                  lines={[
                  { account: 'Bank Account', debit: record.govtFundsReceived },
                  { account: 'Govt. Scholarship Payable A/c', credit: record.govtFundsReceived }]
                  }
                  narration="Government scholarship funds received — NSP 2025-26" />

                    <JournalPreview
                  title="🏛️ Step 2 — Applying Waiver to Student Fee (This Transaction)"
                  lines={[
                  { account: 'Govt. Scholarship Payable A/c', debit: amount },
                  { account: 'Student Fee Receivable A/c', credit: amount }]
                  }
                  narration={`Term ${nextNo} scholarship waiver — ${record.student} — NSP 2025-26`} />
                  </> :

              <JournalPreview
                title="🏫 Internal Scholarship — Fee Waiver"
                lines={[
                { account: 'Scholarship Expense A/c', debit: amount },
                { account: 'Student Fee Receivable A/c', credit: amount }]
                }
                narration={`Term ${nextNo} scholarship waiver — ${record.student} — ${record.scheme}`} />
              }
              </div>
            </div>
          </div>
        }

        {/* Panel 5 — date & reference */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 5 · Disbursement Date &amp; Reference</p>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Disbursement Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Reference Note" value={ref} onChange={(e) => setRef(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
              <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                Mrs. P. Gupta — Finance Manager <span className="text-gray-400">🔒 auto</span>
              </div>
            </div>
            <Select label="Authorized By" options={AUTHORIZERS.map((a) => ({ value: a, label: a }))} value={authorizer} onChange={(v) => setAuthorizer(v)} />
          </div>
        </div>

        {/* Panel 6 — post disbursement actions */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 6 · Post-Disbursement Actions</p>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-gray-600">After processing, automatically:</p>
            {([
            ['journal', 'Create journal entry in Ledger Module'],
            ['fee', 'Update student’s fee account in Fee Module'],
            ['receipt', `Generate scholarship receipt (Installment ${nextNo} of ${totalInst})`],
            ['notify', 'Send notification to parent via SMS & Email'],
            ['tracker', 'Update disbursement tracker'],
            ['status', 'Update scholarship status to ✅ Fully Disbursed (if last installment)'],
            ['print', 'Print receipt immediately']] as [keyof typeof post, string][]).
            map(([key, label]) =>
            <Toggle key={key} size="sm" label={label} checked={post[key]} onChange={(v) => setPost((p) => ({ ...p, [key]: v }))} />
            )}
          </div>
        </div>
      </div>
    </Modal>);

}

/* ================================ 6B · process bank account transfer form */

function BankTransferModal({
  record, open, onClose, onConfirm
}: {record: DisbursementRecord | null;open: boolean;onClose: () => void;onConfirm: (amount: number, date: string, method: string, toParent: boolean) => void;}) {
  const [amountType, setAmountType] = useState<'full' | 'partial'>('full');
  const [partial, setPartial] = useState(0);
  const [toWhom, setToWhom] = useState<'student' | 'parent'>('parent');
  const [payMode, setPayMode] = useState('NEFT');
  const [fromAcct, setFromAcct] = useState('SBI — Current A/c XXXX4521');
  const [applyWaiver, setApplyWaiver] = useState<'yes' | 'no'>('no');
  const [date, setDate] = useState(todayISO());
  const [editingBank, setEditingBank] = useState(false);
  const [bankDraft, setBankDraft] = useState<BankDetails | null>(null);

  React.useEffect(() => {
    if (open && record) {
      setAmountType('full');
      setPartial(0);
      setToWhom('parent');
      setPayMode('NEFT');
      setDate(todayISO());
      setApplyWaiver('no');
      setEditingBank(false);
      setBankDraft(record.bank);
    }
  }, [open, record?.id]);

  if (!record) return null;
  const b = bankDraft || record.bank;
  const remaining = remainingOf(record);
  const amount = amountType === 'full' ? remaining : Math.min(partial || 0, remaining);
  const isGovt = record.schemeType === 'Govt.';
  const feeDue = record.feeRows.reduce((n, r) => n + r.annual, 0);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`🏦 Process Bank Account Transfer — ${record.student} · ${record.scheme} · ${isGovt ? '🏛️ Govt.' : '🏫 Internal'}`}
      size="xl"
      footer={
      <div className="flex flex-wrap items-center gap-2">
          <Button leftIcon={<Landmark className="w-4 h-4" />} onClick={() => onConfirm(amount, date, payMode, toWhom === 'parent')}>
            Confirm &amp; Transfer
          </Button>
          <Button variant="outline" leftIcon={<Save className="w-4 h-4" />} onClick={onClose}>Save Draft</Button>
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={onClose}>Change to Fee Waiver</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      }>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 1 &amp; 2 · Student Overview + Disbursement Type (Option B — Bank Transfer)</p>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-700">
            <p><span className="text-gray-500">Student:</span> <span className="font-medium">{record.student}</span> · {record.className}</p>
            <p><span className="text-gray-500">Admission No:</span> {record.admissionNo} · <span className="text-gray-500">App No:</span> {record.appNo}</p>
            <p><span className="text-gray-500">Scheme:</span> {record.scheme}</p>
            <p><span className="text-gray-500">Sanction Letter:</span> {record.sanctionLetter}</p>
            <p><span className="text-gray-500">Total Scholarship:</span> <span className="font-semibold">{INR(record.total)}</span> 🔒</p>
            <p><span className="text-gray-500">Disbursement Mode:</span> 🏦 Bank Account Transfer</p>
          </div>
        </div>

        {/* Panel 3 — amount */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 3 · Amount to Transfer</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Total Scholarship Amount</p>
                <p className="font-semibold text-gray-900">{INR(record.total)} <span className="text-gray-400 font-normal">🔒</span></p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Already Transferred</p>
                <p className="font-semibold text-gray-900">{INR(disbursedOf(record))}</p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                <p className="text-gray-500">Remaining to Transfer</p>
                <p className="font-semibold text-indigo-700">{INR(remaining)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="radio" name="bank-amt" className="text-indigo-600 focus:ring-indigo-500" checked={amountType === 'full'} onChange={() => setAmountType('full')} />
                Full Remaining Amount — <span className="font-semibold">{INR(remaining)}</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="radio" name="bank-amt" className="text-indigo-600 focus:ring-indigo-500" checked={amountType === 'partial'} onChange={() => setAmountType('partial')} />
                Partial Amount
                {amountType === 'partial' &&
              <Input className="w-40" type="number" value={String(partial)} onChange={(e) => setPartial(Number(e.target.value) || 0)} />
              }
              </label>
            </div>
          </div>
        </div>

        {/* Panel 4 — bank details */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 4 · Bank Account Details (Transfer Destination)</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-800">
              <span className="text-xs text-gray-500">Transfer To:</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="to-whom" className="text-indigo-600 focus:ring-indigo-500" checked={toWhom === 'student'} onChange={() => setToWhom('student')} />
                Student’s Bank Account
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="to-whom" className="text-indigo-600 focus:ring-indigo-500" checked={toWhom === 'parent'} onChange={() => setToWhom('parent')} />
                Parent’s Bank Account
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Account Holder" value={b.holder} readOnly />
              <Input label="Bank Name" value={b.bank} readOnly />
              <Input label="Account No." value={b.account} readOnly />
              <Input label="IFSC Code" value={b.ifsc} readOnly />
              <Input label="Account Type" value={b.accType} readOnly />
              <Input label="Bank Branch" value={b.branch} readOnly />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                ✅ Account Verified: PENNY DROP verified — Account is Active &amp; Valid
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                ✅ Aadhaar Linked
              </span>
              <Button size="xs" variant="outline" leftIcon={<Settings2 className="w-3 h-3" />} onClick={() => setEditingBank((v) => !v)}>
                {editingBank ? 'Close' : 'Edit Bank Details'}
              </Button>
              <Button size="xs" variant="outline" leftIcon={<RefreshCw className="w-3 h-3" />}>Re-verify Account</Button>
            </div>

            {editingBank &&
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                Editing bank details changes the transfer destination — the change is audited against this disbursement.
              </p>
            }

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <Select label="Payment Mode" options={['NEFT', 'RTGS', 'IMPS', 'UPI', 'Cheque', 'Cash'].map((m) => ({ value: m, label: m }))} value={payMode} onChange={(v) => setPayMode(v)} />
              <Select
                label="From Bank A/c (School)"
                options={['SBI — Current A/c XXXX4521', 'HDFC — Current A/c XXXX8899', 'BOB — Current A/c XXXX3344'].map((a) => ({ value: a, label: a }))}
                value={fromAcct}
                onChange={(v) => setFromAcct(v)} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Ref No.</label>
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500">
                  Auto-generated after transfer
                </div>
              </div>
            </div>

            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              NOTE: For Government Scholarships, the Govt. transfers DIRECTLY to the student bank via DBT. The school
              transfers only for internal scholarships or when the school has received the funds and must disburse them.
            </p>
          </div>
        </div>

        {/* Panel 5 — fee account impact */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 5 · Fee Account Impact (Bank Transfer Mode)</p>
          </div>
          <div className="p-3 space-y-3 text-xs text-gray-700">
            <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              ⚠️ When the scholarship is transferred to the bank, the student’s fee account is NOT automatically reduced —
              the student still pays the full fee, and the scholarship money is sent separately to their bank.
            </p>
            <div className="space-y-1.5">
              <p>Do you also want to apply a fee waiver in the student account?</p>
              <label className="flex items-start gap-2">
                <input type="radio" name="also-waiver" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={applyWaiver === 'yes'} onChange={() => setApplyWaiver('yes')} />
                <span>Yes — apply waiver in fee account (student pays reduced fee) — transfer to bank NOT required; use fee waiver mode instead</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="also-waiver" className="mt-0.5 text-indigo-600 focus:ring-indigo-500" checked={applyWaiver === 'no'} onChange={() => setApplyWaiver('no')} />
                <span>No — transfer scholarship to bank, student pays the full fee separately</span>
              </label>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 space-y-0.5">
              <p>Student’s current fee position</p>
              <p>Total Fee Due: <span className="font-medium">{INR(feeDue)}</span></p>
              <p>Already Paid: <span className="font-medium text-emerald-700">{INR(feeDue)}</span> ✅ (student has already paid the full fee)</p>
              <p>Scholarship: <span className="font-medium">{INR(amount)}</span> → will be transferred to the bank account instead of the fee ledger</p>
            </div>
          </div>
        </div>

        {/* Panel 6 — journal preview */}
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 6 · Journal Entry Preview (Bank Transfer)</p>
          </div>
          <div className="p-3 space-y-2">
            {isGovt ?
            <JournalPreview
              title="🏛️ Govt. Scholarship — Cash Component (School disburses)"
              note="Step 1 — Govt. funds already received in school bank: Dr. Bank ₹ · Cr. Govt. Schol. Payable ₹"
              lines={[
              { account: 'Govt. Scholarship Payable A/c', debit: amount },
              { account: 'Bank Account (School)', credit: amount }]
              }
              narration={`Government scholarship transferred to student bank — ${record.student} — ${record.scheme}`} /> :

            <JournalPreview
              title="🏫 Internal Scholarship — Bank Transfer"
              lines={[
              { account: 'Scholarship Expense A/c', debit: amount },
              { account: 'Bank Account (School)', credit: amount }]
              }
              narration={`Sports / internal scholarship transferred to bank — ${record.student} — ${record.scheme}`} />
            }
          </div>
        </div>
      </div>
    </Modal>);

}

/* ============================ 6C · setup partial disbursement schedule */

function ScheduleSetupModal({
  record, open, onClose, onSave
}: {record: DisbursementRecord | null;open: boolean;onClose: () => void;onSave: (installments: Installment[], frequency: Frequency, mode: DisbMode, reminders: { days: number; enabled: boolean })=>void;}) {
  const [mode, setMode] = useState<DisbMode>('Fee Waiver');
  const [frequency, setFrequency] = useState<Frequency>('Term-wise');
  const [startDate, setStartDate] = useState('2025-04-01');
  const [rows, setRows] = useState<Installment[]>([]);
  const [customCount, setCustomCount] = useState(6);
  const [allowPerMode, setAllowPerMode] = useState(true);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);
  const [conditional, setConditional] = useState(false);
  const [conditionType, setConditionType] = useState('Minimum Marks %');
  const [minMarks, setMinMarks] = useState('75');
  const [checkTiming, setCheckTiming] = useState('Before Each Installment');
  const [remindEnabled, setRemindEnabled] = useState(true);
  const [remindDays, setRemindDays] = useState('7');
  const [notify, setNotify] = useState('SMS + Email');

  React.useEffect(() => {
    if (open && record) {
      setMode(record.mode);
      setFrequency(record.frequency);
      setRows(record.installments.length > 0 ? record.installments.map((i) => ({ ...i })) : build(record.frequency, record.mode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, record?.id]);

  function build(freq: Frequency, m: DisbMode, count = customCount): Installment[] {
    if (!record) return [];
    return scheduleFor(freq, remainingOf(record) || record.total, startDate, count).map((i, idx) => ({
      ...i,
      no: idx + 1,
      mode: m,
      status: 'Upcoming' as InstStatus
    }));
  }

  if (!record) return null;
  const totalScheduled = rows.reduce((n, r) => n + r.amount, 0);
  const remaining = remainingOf(record);

  const regenerate = (freq: Frequency, m: DisbMode, count = customCount) => {
    setFrequency(freq);
    setRows(build(freq, m, count));
  };

  const patchRow = (no: number, partial: Partial<Installment>) =>
  setRows((prev) => prev.map((r) => (r.no === no ? { ...r, ...partial } : r)));

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`🔄 Setup Partial Disbursement Schedule — ${record.student} · ${record.scheme} · ${record.schemeType === 'Govt.' ? '🏛️ Govt.' : '🏫 Internal'}`}
      size="xl"
      footer={
      <div className="flex flex-wrap items-center gap-2">
          <Button leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={() => onSave(rows, frequency, mode, { days: Number(remindDays) || 0, enabled: remindEnabled })}>
            Save Schedule
          </Button>
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />} onClick={onClose}>Preview Schedule</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      }>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 1 · Scholarship Overview</p>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
              <p className="text-gray-500">Total Scholarship</p>
              <p className="font-semibold text-gray-900">{INR(record.total)} <span className="text-gray-400 font-normal">🔒</span></p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
              <p className="text-gray-500">Already Disbursed</p>
              <p className="font-semibold text-gray-900">{INR(disbursedOf(record))}</p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
              <p className="text-gray-500">To Be Scheduled</p>
              <p className="font-semibold text-indigo-700">{INR(remaining)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 2 · Disbursement Mode Selection</p>
          </div>
          <div className="p-3 space-y-1.5 text-sm text-gray-800">
            <label className="flex items-center gap-2">
              <input type="radio" name="sched-mode" className="text-indigo-600 focus:ring-indigo-500" checked={mode === 'Fee Waiver'} onChange={() => setMode('Fee Waiver')} />
              💸 Fee Waiver Settlement — deduct from student fee account
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="sched-mode" className="text-indigo-600 focus:ring-indigo-500" checked={mode === 'Bank Transfer'} onChange={() => setMode('Bank Transfer')} />
              🏦 Bank Account Transfer — transfer to student / parent bank
            </label>
            <label className="flex items-center gap-2 text-gray-400">
              <input type="radio" name="sched-mode" disabled className="text-indigo-600" />
              🔀 Mixed — some installments as fee waiver, some as bank transfer (enable per-installment mode below)
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 3 · Frequency Selection</p>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-800">
            {(['One-Time', 'Monthly', 'Term-wise', 'Quarterly', 'Half-Yearly', 'Custom'] as Frequency[]).map((f) =>
            <label key={f} className="flex items-center gap-2">
                <input
                type="radio"
                name="freq"
                className="text-indigo-600 focus:ring-indigo-500"
                checked={frequency === f}
                onChange={() => regenerate(f, mode)} />

                {f === 'One-Time' ? 'One-Time — full amount at once' : f === 'Monthly' ? 'Monthly — 12 equal installments' : f === 'Term-wise' ? 'Term-wise — 3 installments per year' : f === 'Quarterly' ? 'Quarterly — 4 equal installments' : f === 'Half-Yearly' ? 'Half-Yearly — 2 equal installments' : 'Custom — define your own schedule below'}
              </label>
            )}
            <label className="flex items-center gap-2 text-gray-400">
              <input type="radio" name="freq" disabled className="text-indigo-600" />
              Conditional — release only after conditions are met
            </label>
            <div className="flex items-center gap-3">
              <Input label="Schedule Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              {frequency === 'Custom' &&
              <Input label="No. of Installments" type="number" value={String(customCount)} onChange={(e) => setCustomCount(Number(e.target.value) || 2)} />
              }
              <Button variant="outline" size="sm" className="self-end" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => regenerate(frequency, mode)}>
                Recalculate
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 4 · Installment Schedule Setup</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TH className="w-12">Inst.</TH>
                    <TH>Installment Name</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Due Date</TH>
                    <TH>Mode</TH>
                    <TH className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((r) =>
                  <tr key={r.no}>
                      <TD>{r.no}</TD>
                      <TD>
                        <Input value={r.name} onChange={(e) => patchRow(r.no, { name: e.target.value })} />
                      </TD>
                      <TD>
                        <Input
                        type="number"
                        className="w-32"
                        value={String(r.amount)}
                        readOnly={!allowCustomAmount}
                        onChange={(e) => patchRow(r.no, { amount: Number(e.target.value) || 0 })} />

                      </TD>
                      <TD>
                        <Input type="date" value={r.dueDate} onChange={(e) => patchRow(r.no, { dueDate: e.target.value })} />
                      </TD>
                      <TD>
                        <Select
                        options={[{ value: 'Fee Waiver', label: '💸 Fee Waiver' }, { value: 'Bank Transfer', label: '🏦 Bank Transfer' }]}
                        value={r.mode}
                        onChange={(v) => patchRow(r.no, { mode: v as DisbMode })} />

                      </TD>
                      <TD>
                        <button
                        type="button"
                        className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setRows((prev) => prev.filter((x) => x.no !== r.no).map((x, i) => ({ ...x, no: i + 1 })))}>

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TD>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <TD className="font-semibold" >TOTAL</TD>
                    <TD />
                    <TD className="text-right font-semibold">{INR(totalScheduled)}</TD>
                    <TD colSpan={3} className={`text-xs ${totalScheduled === remaining ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {totalScheduled === remaining ?
                    'Matches the remaining scholarship amount ✅' :
                    `Difference of ${INR(Math.abs(remaining - totalScheduled))} vs remaining ${INR(remaining)}`}
                    </TD>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Toggle size="sm" label="Allow different disbursement mode per installment" checked={allowPerMode} onChange={setAllowPerMode} />
              <Toggle size="sm" label="Allow custom amount per installment" checked={allowCustomAmount} onChange={setAllowCustomAmount} />
              <Toggle size="sm" label="Add performance condition before releasing each installment" checked={conditional} onChange={setConditional} />
              <Button size="xs" variant="outline" leftIcon={<Plus className="w-3 h-3" />} onClick={() => setRows((prev) => [...prev, { no: prev.length + 1, name: `Custom ${prev.length + 1}`, amount: 0, dueDate: startDate, mode, status: 'Upcoming' }])}>
                Add Installment
              </Button>
            </div>

            {conditional &&
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                label="Condition Type"
                options={['Minimum Marks %', 'Attendance %', 'No Disciplinary Action', 'Fee Clearance', 'Custom Condition'].map((c) => ({ value: c, label: c }))}
                value={conditionType}
                onChange={(v) => setConditionType(v)} />

                <Input label="Minimum Marks Required (for release)" value={minMarks} onChange={(e) => setMinMarks(e.target.value)} />
                <Select
                label="Condition Check Timing"
                options={['Before Each Installment', 'Before Final Installment', 'Manual Verification'].map((c) => ({ value: c, label: c }))}
                value={checkTiming}
                onChange={(v) => setCheckTiming(v)} />

              </div>
            }
          </div>
        </div>

        <div className="rounded-lg border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Panel 5 · Reminder &amp; Notification Settings</p>
          </div>
          <div className="p-3 space-y-3 text-sm text-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500">Auto-remind Finance Team before disbursement:</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="remind" className="text-indigo-600 focus:ring-indigo-500" checked={remindEnabled} onChange={() => setRemindEnabled(true)} />
                Yes — remind
              </label>
              <Input className="w-20" type="number" value={remindDays} onChange={(e) => setRemindDays(e.target.value)} />
              <span className="text-xs text-gray-500">days before due date</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="remind" className="text-indigo-600 focus:ring-indigo-500" checked={!remindEnabled} onChange={() => setRemindEnabled(false)} />
                No
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500">Notify Parent after each disbursement:</span>
              {['SMS + Email', 'SMS Only', 'Email Only', 'No'].map((n) =>
              <label key={n} className="inline-flex items-center gap-2">
                  <input type="radio" name="notify" className="text-indigo-600 focus:ring-indigo-500" checked={notify === n} onChange={() => setNotify(n)} />
                  {n}
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>);

}

/* ============================================== view (read-only) modal */

function ViewModal({ record, open, onClose }: {record: DisbursementRecord | null;open: boolean;onClose: () => void;}) {
  if (!record) return null;
  const isGovt = record.schemeType === 'Govt.';
  return (
    <Modal isOpen={open} onClose={onClose} title={`👁️ ${record.disbNo} — ${record.student}`} size="xl"
    footer={<Button variant="outline" onClick={onClose}>Close</Button>}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-700">
          <p><span className="text-gray-500">Disbursement No.:</span> <span className="font-medium">{record.disbNo}</span></p>
          <p><span className="text-gray-500">Student:</span> {record.student} · {record.className} · {record.admissionNo}</p>
          <p><span className="text-gray-500">Scheme:</span> {record.scheme} ({record.schemeType})</p>
          <p><span className="text-gray-500">Application No.:</span> {record.appNo}</p>
          <p><span className="text-gray-500">Sanction Letter:</span> {record.sanctionLetter}</p>
          {isGovt && <p><span className="text-gray-500">Govt. Sanction No.:</span> {record.govtSanctionNo || '—'}</p>}
          <p><span className="text-gray-500">Mode:</span> {modeBadge(record.mode)}</p>
          <p><span className="text-gray-500">Frequency:</span> {record.frequency}</p>
          <p><span className="text-gray-500">Total Scholarship:</span> <span className="font-semibold">{INR(record.total)}</span></p>
          <p><span className="text-gray-500">Disbursed / Remaining:</span> {INR(disbursedOf(record))} / {INR(remainingOf(record))}</p>
          <p><span className="text-gray-500">Category:</span> {record.category}</p>
          <p><span className="text-gray-500">Status:</span> {statusBadge(statusOf(record))}</p>
        </div>
        <DisbursementTrackingTableSection record={record} />
      </div>
    </Modal>);

}

/* =============================================================== page */

export function ScholarshipDisbursement() {
  const [records, setRecords] = useState<DisbursementRecord[]>(() => seed());
  const [tab, setTab] = useState<'All' | 'Fee Waiver' | 'Bank Transfer' | 'Partial' | 'Pending' | 'Done'>('All');
  const [toast, setToast] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('2025-04-01');
  const [to, setTo] = useState('2026-03-31');
  const [scheme, setScheme] = useState('All');
  const [type, setType] = useState('All');
  const [modeF, setModeF] = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [classF, setClassF] = useState('All');
  const [categoryF, setCategoryF] = useState('All');
  const [instNoF, setInstNoF] = useState('All');

  // selection + modals
  const [selected, setSelected] = useState<string[]>([]);
  const [waiverFor, setWaiverFor] = useState<DisbursementRecord | null>(null);
  const [bankFor, setBankFor] = useState<DisbursementRecord | null>(null);
  const [scheduleFor, setScheduleFor] = useState<DisbursementRecord | null>(null);
  const [viewFor, setViewFor] = useState<DisbursementRecord | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [trackerId, setTrackerId] = useState<string>(records[0]?.id || '');
  const [trackerOpen, setTrackerOpen] = useState(true);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(
    () =>
    records.filter((r) => {
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        const hay = `${r.student} ${r.disbNo} ${r.scheme} ${r.admissionNo} ${r.appNo}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (scheme !== 'All' && r.scheme !== scheme) return false;
      if (type !== 'All' && r.schemeType !== type) return false;
      if (modeF !== 'All' && r.mode !== modeF) return false;
      if (classF !== 'All' && r.className !== classF) return false;
      if (categoryF !== 'All' && r.category !== categoryF) return false;
      const st = statusOf(r);
      if (statusF !== 'All' && st !== statusF) return false;
      if (instNoF !== 'All') {
        const no = Number(instNoF);
        if (!r.installments.some((i) => i.no === no)) return false;
      }
      const dates = r.installments.map((i) => i.dueDate).sort();
      if (dates.length > 0 && (dates[0] > to || dates[dates.length - 1] < from)) return false;
      return true;
    }),
    [records, q, scheme, type, modeF, classF, categoryF, statusF, instNoF, from, to]
  );

  const byTab = useMemo(() => {
    switch (tab) {
      case 'Fee Waiver':
        return filtered.filter((r) => r.mode === 'Fee Waiver');
      case 'Bank Transfer':
        return filtered.filter((r) => r.mode === 'Bank Transfer');
      case 'Partial':
        return filtered.filter((r) => statusOf(r) === 'Partial');
      case 'Pending':
        return filtered.filter((r) => ['Pending', 'Overdue', 'No Schedule'].includes(statusOf(r)));
      case 'Done':
        return filtered.filter((r) => statusOf(r) === 'Full');
      default:
        return filtered;
    }
  }, [filtered, tab]);

  const kpis = useMemo(() => {
    const sanctioned = records.reduce((n, r) => n + r.total, 0);
    const waiverDisb = records.reduce((n, r) => n + r.installments.filter((i) => i.status === 'Disbursed' && i.mode === 'Fee Waiver').reduce((s, i) => s + i.amount, 0), 0);
    const bankDisb = records.reduce((n, r) => n + r.installments.filter((i) => i.status === 'Disbursed' && i.mode === 'Bank Transfer').reduce((s, i) => s + i.amount, 0), 0);
    const full = records.filter((r) => statusOf(r) === 'Full').length;
    const partial = records.filter((r) => statusOf(r) === 'Partial').length;
    const pendingAmt = records.reduce((n, r) => n + remainingOf(r), 0);
    const govtDisb = records.filter((r) => r.schemeType === 'Govt.').reduce((n, r) => n + disbursedOf(r), 0);
    const internalDisb = records.filter((r) => r.schemeType === 'Internal').reduce((n, r) => n + disbursedOf(r), 0);
    const overdue = records.reduce(
      (n, r) => n + r.installments.filter((i) => i.status === 'Upcoming' && isPast(i.dueDate)).reduce((s, i) => s + i.amount, 0),
      0
    );
    const thisMonth = new Date().getMonth();
    const dueMonth = records.reduce(
      (n, r) =>
      n + r.installments.filter((i) => i.status === 'Upcoming' && new Date(i.dueDate).getMonth() === thisMonth).reduce((s, i) => s + i.amount, 0),
      0
    );
    const fundsReceived = records.reduce((n, r) => n + r.govtFundsReceived, 0);
    const advanceAdjusted = 30000;
    return { sanctioned, waiverDisb, bankDisb, full, partial, pendingAmt, govtDisb, internalDisb, overdue, dueMonth, fundsReceived, advanceAdjusted };
  }, [records]);

  const totals = useMemo(
    () => ({
      total: byTab.reduce((n, r) => n + r.total, 0),
      disbursed: byTab.reduce((n, r) => n + disbursedOf(r), 0),
      remaining: byTab.reduce((n, r) => n + remainingOf(r), 0)
    }),
    [byTab]
  );

  /* ------------------------------------------------------------ actions */

  const pushJournalToInstallment = (record: DisbursementRecord, amount: number, date: string, mode: DisbMode, note?: string): DisbursementRecord => {
    const idx = record.installments.findIndex((i) => i.status === 'Upcoming' || i.status === 'Suspended');
    const journalNo = nextJournalNo();
    let installments: Installment[];
    if (idx === -1) {
      // no schedule yet — create a one-time installment for the amount released now
      installments = [
      ...record.installments,
      { no: record.installments.length + 1, name: `Ad-hoc Release (${note || 'manual'})`, amount, dueDate: date, mode, appliedOn: date, journalNo, status: 'Disbursed' }];

    } else {
      installments = record.installments.map((i, n) =>
      n === idx ? { ...i, mode, appliedOn: date, journalNo, status: 'Disbursed' as InstStatus, amount: amount > 0 ? amount : i.amount } : i
      );
    }
    return { ...record, installments };
  };

  const afterDisbursement = (record: DisbursementRecord, amount: number, mode: DisbMode, message: string) => {
    const next = pushJournalToInstallment(record, amount, todayISO(), mode);
    const rest = next.installments.filter((i) => i.status === 'Upcoming');
    setRecords((prev) => prev.map((r) => (r.id === next.id ? next : r)));
    setToast(
      `${message} · ${INR(amount)} · ${mode} · journal ${next.installments.filter((i) => i.journalNo).slice(-1)[0]?.journalNo || '—'}` +
      (rest.length === 0 ? ' · scholarship fully disbursed ✅' : ` · ${rest.length} installment(s) still pending`)
    );
  };

  const bulkDisburse = () => {
    const targets = records.filter((r) => selected.includes(r.id));
    const skipped: string[] = [];
    targets.forEach((r) => {
      const next = nextInstallment(r);
      if (!next) {
        skipped.push(r.student);
        return;
      }
      const next2 = pushJournalToInstallment(r, next.amount, todayISO(), next.mode || r.mode);
      setRecords((prev) => prev.map((x) => (x.id === r.id ? next2 : x)));
    });
    setBulkOpen(false);
    setSelected([]);
    setToast(
      `Bulk disbursement processed for ${targets.length - skipped.length} scholarship(s)` +
      (skipped.length ? ` · skipped (no pending installment): ${skipped.join(', ')}` : '')
    );
  };

  const exportCsv = () => {
    const header = ['Disb. No.', 'Student', 'Class', 'Scheme', 'Type', 'Mode', 'Total', 'Disbursed', 'Remaining', 'Installments', 'Status'];
    const lines = byTab.map((r) =>
    [r.disbNo, r.student, r.className, r.scheme, r.schemeType, r.mode, r.total, disbursedOf(r), remainingOf(r), instInfo(r), statusOf(r)].join(',')
    );
    const csv = [header.join(','), ...lines].join('\n');
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scholarship-disbursement-${todayISO()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast(`Exported ${byTab.length} row(s) to CSV`);
    } catch {
      setToast(`Export prepared for ${byTab.length} row(s)`);
    }
  };

  const resetFilters = () => {
    setQ('');
    setFrom('2025-04-01');
    setTo('2026-03-31');
    setScheme('All');
    setType('All');
    setModeF('All');
    setStatusF('All');
    setClassF('All');
    setCategoryF('All');
    setInstNoF('All');
  };

  const allSelected = byTab.length > 0 && byTab.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : byTab.map((r) => r.id));
  const toggleOne = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const trackerRow = records.find((r) => r.id === trackerId) || records[0];

  const tabDefs: {key: typeof tab;label: string;count: number;}[] = [
  { key: 'All', label: '📋 All', count: filtered.length },
  { key: 'Fee Waiver', label: '💸 Fee Waiver Settlement', count: filtered.filter((r) => r.mode === 'Fee Waiver').length },
  { key: 'Bank Transfer', label: '🏦 Bank Transfer', count: filtered.filter((r) => r.mode === 'Bank Transfer').length },
  { key: 'Partial', label: '🔄 Partial Disbursement', count: filtered.filter((r) => statusOf(r) === 'Partial').length },
  { key: 'Pending', label: '⏳ Pending', count: filtered.filter((r) => ['Pending', 'Overdue', 'No Schedule'].includes(statusOf(r))).length },
  { key: 'Done', label: '✅ Done', count: filtered.filter((r) => statusOf(r) === 'Full').length }];


  /* ------------------------------------------------------------- render */

  return (
    <div className="space-y-6 py-6">
      {/* ------------------------------------------------- 1 · header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Scholarship Disbursement</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Fee waiver settlement · bank transfer · partial (installment) disbursement · govt. fund tracking
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">FY 2025-26</Badge>
          <Button size="sm" variant="outline" leftIcon={<Mail className="w-4 h-4" />} onClick={() => setToast('Parent notifications queued (SMS + Email)')}>
            Notify Parents
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => setToast('Print preview prepared for the current list')}>
            Print
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------- 2 · KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <KpiCard icon={BadgeIndianRupee} label="💰 Total Scholarship Sanctioned" value={INR(kpis.sanctioned)} hint="Approved scholarships this FY" tone="indigo" />
        <KpiCard icon={Wallet} label="💸 Fee Waiver Disbursed" value={INR(kpis.waiverDisb)} hint="Applied to student fee accounts" tone="emerald" />
        <KpiCard icon={Landmark} label="🏦 Bank Transfer Disbursed" value={INR(kpis.bankDisb)} hint="Transferred to student / parent bank" tone="sky" />
        <KpiCard icon={CheckCircle2} label="✅ Fully Disbursed Students" value={`${kpis.full} Students`} hint="Received 100% of the scholarship" tone="emerald" />
        <KpiCard icon={RefreshCw} label="🔄 Partially Disbursed Students" value={`${kpis.partial} Students`} hint="Some installments released" tone="amber" />
        <KpiCard icon={Hourglass} label="⏳ Pending Disbursement" value={INR(kpis.pendingAmt)} hint="Yet to be disbursed" tone="rose" badge={<Badge variant="danger">Action</Badge>} />
        <KpiCard icon={Building2} label="🏛️ Govt. Scholarships Disbursed" value={INR(kpis.govtDisb)} hint="Government schemes" tone="violet" />
        <KpiCard icon={School} label="🏫 Internal Scholarships Disbursed" value={INR(kpis.internalDisb)} hint="School funded schemes" tone="indigo" />
        <KpiCard icon={AlertTriangle} label="🔴 Overdue Installments" value={INR(kpis.overdue)} hint="Past due date, not disbursed" tone="rose" badge={<Badge variant="danger">Urgent</Badge>} />
        <KpiCard icon={CalendarClock} label="📅 Due This Month" value={INR(kpis.dueMonth)} hint="Installments due now" tone="amber" />
        <KpiCard icon={Landmark} label="🏛️ Govt. Funds Received" value={INR(kpis.fundsReceived)} hint="Received in school bank" tone="sky" />
        <KpiCard icon={CreditCard} label="💳 Advance Adjusted" value={INR(kpis.advanceAdjusted)} hint="Advance fee adjusted vs scholarship" tone="gray" />
      </div>

      {/* ------------------------------------------------- 3 · tabs */}
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
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.count}
              </span>
            </button>
          )}
        </div>

        {/* ------------------------------------------- 4 · filters + actions */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <Input
              placeholder="Search student / disbursement no. / scheme / admission no."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              value={q}
              onChange={(e) => setQ(e.target.value)} />

            <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <Select label="Scheme" options={[{ value: 'All', label: 'All Schemes' }, ...SCHEME_OPTIONS.map((s) => ({ value: s, label: s }))]} value={scheme} onChange={(v) => setScheme(v)} />
            <Select label="Type" options={[{ value: 'All', label: 'All Types' }, { value: 'Govt.', label: '🏛️ Govt.' }, { value: 'Internal', label: '🏫 Internal' }]} value={type} onChange={(v) => setType(v)} />
            <Select label="Disbursement Mode" options={[{ value: 'All', label: 'All Modes' }, { value: 'Fee Waiver', label: '💸 Fee Waiver' }, { value: 'Bank Transfer', label: '🏦 Bank Transfer' }]} value={modeF} onChange={(v) => setModeF(v)} />
            <Select label="Status" options={['All', 'Full', 'Partial', 'Pending', 'Overdue', 'No Schedule'].map((s) => ({ value: s, label: s === 'All' ? 'All Statuses' : s }))} value={statusF} onChange={(v) => setStatusF(v)} />
            <Select label="Class" options={[{ value: 'All', label: 'All Classes' }, ...CLASS_LIST.map((c) => ({ value: c, label: c }))]} value={classF} onChange={(v) => setClassF(v)} />
            <Select label="Category" options={[{ value: 'All', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]} value={categoryF} onChange={(v) => setCategoryF(v)} />
            <Select label="Installment No." options={[{ value: 'All', label: 'All Installments' }, ...['1', '2', '3', '4'].map((n) => ({ value: n, label: `Installment ${n}` }))]} value={instNoF} onChange={(v) => setInstNoF(v)} />
            <div className="flex items-end gap-2">
              <Button variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={resetFilters}>Reset</Button>
              <Button leftIcon={<Search className="w-4 h-4" />} onClick={() => setToast(`${byTab.length} record(s) match the current filters`)}>Search</Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Actions</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" leftIcon={<Wallet className="w-4 h-4" />} onClick={() => setWaiverFor(byTab.find((r) => r.mode === 'Fee Waiver') || records[0])}>
                💸 Process Fee Waiver
              </Button>
              <Button size="sm" leftIcon={<Landmark className="w-4 h-4" />} onClick={() => setBankFor(byTab.find((r) => r.mode === 'Bank Transfer') || records[0])}>
                🏦 Process Bank Transfer
              </Button>
              <Button size="sm" variant="outline" leftIcon={<Settings2 className="w-4 h-4" />} onClick={() => setScheduleFor(byTab[0] || records[0])}>
                🔄 Setup Partial Schedule
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ListChecks className="w-4 h-4" />}
                disabled={selected.length === 0}
                onClick={() => setBulkOpen(true)}>

                ☑️ Bulk Disburse{selected.length > 0 ? ` (${selected.length})` : ''}
              </Button>
              <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={exportCsv}>📥 Export</Button>
              <Button size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => setToast('Print preview prepared')}>🖨️ Print</Button>
              <Button size="sm" variant="outline" leftIcon={<Send className="w-4 h-4" />} onClick={() => setToast('Reminder sent to parents of pending installments')}>
                📧 Notify Parents
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- 5 · main disbursement table */}
      <Card
        title={`Disbursements — ${tab === 'All' ? 'All' : tab}`}
        headerAction={<span className="text-xs text-gray-500">{byTab.length} record(s) · {selected.length} selected</span>}
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
                <TH>Disb. No.</TH>
                <TH>Student Name</TH>
                <TH>Scheme Name</TH>
                <TH>Type</TH>
                <TH>Disb. Mode</TH>
                <TH className="text-right">Total Scholarship</TH>
                <TH className="text-right">Disbursed So Far</TH>
                <TH className="text-right">Remaining Amount</TH>
                <TH>Installment Info</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {byTab.map((r) => {
                const st = statusOf(r);
                const disb = disbursedOf(r);
                const remaining = remainingOf(r);
                const overdue = !!overdueInstallment(r);
                return (
                  <tr key={r.id} className={overdue ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-gray-50'}>
                    <TD>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selected.includes(r.id)}
                        onChange={() => toggleOne(r.id)} />

                    </TD>
                    <TD className="font-mono text-gray-600">{r.disbNo}</TD>
                    <TD>
                      <span className="font-medium text-gray-800">{r.student}</span>
                      <p className="text-[10px] text-gray-400">{r.className} · {r.admissionNo}</p>
                    </TD>
                    <TD>
                      <span>{r.schemeType === 'Govt.' ? '🏛️' : '🏫'} {r.schemeShort}</span>
                      <p className="text-[10px] text-gray-400">{r.appNo}</p>
                    </TD>
                    <TD>{typeBadge(r.schemeType)}</TD>
                    <TD>{modeBadge(r.mode)}</TD>
                    <TD className="text-right">{INR(r.total)}</TD>
                    <TD className="text-right">{INR(disb)}</TD>
                    <TD className={`text-right font-medium ${remaining > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>{INR(remaining)}</TD>
                    <TD>
                      <span className="text-gray-700">{instInfo(r)}</span>
                      <div className="mt-1 w-24"><ProgressBar value={progressOf(r)} tone={progressOf(r) >= 100 ? 'emerald' : 'indigo'} /></div>
                    </TD>
                    <TD>{statusBadge(st)}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => setViewFor(r)}>

                          <Eye className="w-4 h-4" />
                        </button>

                        {st === 'Full' &&
                        <button
                          type="button"
                          title="Receipt"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => setToast(`Receipt generated for ${r.student} — ${INR(disb)}`)}>

                            <Receipt className="w-4 h-4" />
                          </button>
                        }

                        {(st === 'Partial' || st === 'Pending' || st === 'Overdue' || st === 'No Schedule') &&
                        <Button
                          size="xs"
                          variant={st === 'Overdue' ? 'danger' : 'outline'}
                          leftIcon={<BadgeIndianRupee className="w-3 h-3" />}
                          onClick={() => (r.mode === 'Bank Transfer' ? setBankFor(r) : setWaiverFor(r))}>

                            {st === 'Overdue' ? 'Disburse Now' : st === 'Partial' ? 'Disburse Next' : 'Disburse'}
                          </Button>
                        }

                        {st !== 'Full' && st !== 'No Schedule' &&
                        <button
                          type="button"
                          title="Schedule"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => setScheduleFor(r)}>

                            <Settings2 className="w-4 h-4" />
                          </button>
                        }

                        {st === 'No Schedule' &&
                        <Button size="xs" variant="outline" leftIcon={<Settings2 className="w-3 h-3" />} onClick={() => setScheduleFor(r)}>
                          Setup Schedule
                        </Button>
                        }

                        {st === 'Overdue' &&
                        <button
                          type="button"
                          title="Overdue alert"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          onClick={() => setToast(`Overdue installment alert raised for ${r.student}`)}>

                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        }
                      </div>
                    </TD>
                  </tr>);

              })}
              {byTab.length === 0 &&
              <tr>
                  <TD colSpan={12} className="text-center text-gray-500 py-8">No disbursement records match the current filters.</TD>
                </tr>
              }
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <TD />
                <TD colSpan={5} className="font-semibold text-gray-700">TOTALS ({byTab.length} records)</TD>
                <TD className="text-right font-semibold">{INR(totals.total)}</TD>
                <TD className="text-right font-semibold">{INR(totals.disbursed)}</TD>
                <TD className="text-right font-semibold">{INR(totals.remaining)}</TD>
                <TD colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* --------------------------------------- 7 · schedule tracker */}
      <Card
        title="Disbursement Schedule Tracker"
        headerAction={
        <div className="flex items-center gap-2">
            <Select
            options={records.map((r) => ({ value: r.id, label: `${r.disbNo} · ${r.student}` }))}
            value={trackerId}
            className="w-64"
            onChange={(v) => setTrackerId(v)} />

            <button
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setTrackerOpen((v) => !v)}>

              {trackerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        }>

        {trackerOpen && trackerRow ? <DisbursementTrackingTableSection record={trackerRow} /> : null}
      </Card>

      {/* --------------------------------------- 8 · government fund tracker */}
      <GovtFundTracker records={records} />

      {/* --------------------------------------- 9 · charts & analytics */}
      <AnalyticsStrip records={records} />

      {/* --------------------------------------- 10 · footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <span>
          Amounts are in INR. Journal entries are created in the Ledger module; receipts in Scholarship Documents &amp; Receipts.
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Fee waiver &amp; transfer post to the student fee ledger</span>
          <span className="inline-flex items-center gap-1"><Info className="w-3.5 h-3.5 text-gray-400" /> Client-side demo data</span>
        </span>
      </div>

      {/* ------------------------------------------------------- modals */}
      <FeeWaiverModal
        record={waiverFor}
        open={!!waiverFor}
        onClose={() => setWaiverFor(null)}
        onConfirm={(amount, date, ref, details) => {
          if (!waiverFor) return;
          afterDisbursement(waiverFor, amount, 'Fee Waiver', `Fee waiver processed for ${waiverFor.student} — ${ref}`);
          setWaiverFor(null);
          void date;
          void details;
        }} />

      <BankTransferModal
        record={bankFor}
        open={!!bankFor}
        onClose={() => setBankFor(null)}
        onConfirm={(amount, date, method, toParent) => {
          if (!bankFor) return;
          afterDisbursement(bankFor, amount, 'Bank Transfer', `Bank transfer (${method}${toParent ? ' → parent account' : ' → student account'}) for ${bankFor.student}`);
          setBankFor(null);
          void date;
        }} />

      <ScheduleSetupModal
        record={scheduleFor}
        open={!!scheduleFor}
        onClose={() => setScheduleFor(null)}
        onSave={(installments, frequency, mode, reminders) => {
          if (!scheduleFor) return;
          const next: DisbursementRecord = { ...scheduleFor, installments, frequency, mode };
          setRecords((prev) => prev.map((r) => (r.id === next.id ? next : r)));
          setTrackerId(next.id);
          setToast(
            `Schedule saved for ${next.student} — ${installments.length} installment(s), ${INR(installments.reduce((n, i) => n + i.amount, 0))}` +
            (reminders.enabled ? ` · reminder ${reminders.days} day(s) before due date` : '')
          );
          setScheduleFor(null);
        }} />

      <ViewModal record={viewFor} open={!!viewFor} onClose={() => setViewFor(null)} />

      <Modal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="☑️ Bulk Disbursement"
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={bulkDisburse}>
              Process {selected.length} Disbursement(s)
            </Button>
          </>
        }>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            The next pending installment of each selected scholarship will be disbursed on {fmtDate(todayISO())} using the
            mode already set on that scholarship.
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <TH>Student</TH>
                  <TH>Mode</TH>
                  <TH className="text-right">Next Installment</TH>
                  <TH>Due Date</TH>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.filter((r) => selected.includes(r.id)).map((r) => {
                  const nxt = nextInstallment(r);
                  return (
                    <tr key={r.id}>
                      <TD>{r.student}</TD>
                      <TD>{modeBadge(r.mode)}</TD>
                      <TD className="text-right">{nxt ? INR(nxt.amount) : '—'}</TD>
                      <TD>{nxt ? fmtDate(nxt.dueDate) : 'No pending installment'}</TD>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {toast &&
      <div className="fixed bottom-5 right-5 z-50 max-w-md rounded-lg bg-gray-900 text-white text-sm px-4 py-2.5 shadow-lg">
          {toast}
        </div>
      }
    </div>);

}

export default ScholarshipDisbursement;
