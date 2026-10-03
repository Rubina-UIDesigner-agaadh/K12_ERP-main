import React, { useMemo, useRef, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Printer, FileText, FileSpreadsheet, Eye, Trash2, BookOpen,
  CalendarDays, ArrowDownToLine, ArrowUpFromLine, Wallet, Landmark, Scale, X,
  CheckCircle, Pencil, Send, XCircle, Lock, Plus, Paperclip, Save, AlertTriangle,
  Info, ClipboardList, Building2,
} from 'lucide-react';

// ───────────────────────────── Types ─────────────────────────────
type EntryType = 'Receipt' | 'Payment' | 'Journal' | 'Contra' | 'Debit Note' | 'Credit Note';
type EntryStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Reversed';
interface JLine { account: string; desc: string; debit: number; credit: number }
interface DayEntry {
  id: string; date: string; voucherNo: string; type: EntryType; narration: string;
  lines: JLine[]; mode: string; bankAccount: string; chqRef: string; chqDate: string;
  party: string; module: string; tags: string[]; attachment: string;
  status: EntryStatus; branch: string; createdBy: string;
  approvedBy?: string;
  rejectReason?: string; rejectComment?: string; rejectedBy?: string;
  reversalOf?: string; reversedBy?: string; reversalReason?: string; reversalDate?: string;
}
interface FormLine { key: number; account: string; desc: string; debit: string; credit: string }
interface FormState {
  editId: string | null; type: EntryType; date: string; module: string; lines: FormLine[];
  mode: string; bankAccount: string; chqRef: string; chqDate: string;
  party: string; narration: string; tags: string[]; attachment: string; branch: string;
}

// ───────────────────────────── Master Data ─────────────────────────────
const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const CLOSED_FYS = ['FY 2024-25', 'FY 2023-24'];
const CLOSED_UPTO: Record<string, string> = { 'FY 2025-26': '2025-08-31' }; // Apr–Aug 2025 periods are closed
const OPEN_FROM: Record<string, string> = { 'FY 2025-26': '2025-09-01' }; // first open period
const BOOK_DATE: Record<string, string> = { 'FY 2025-26': '2025-09-27', 'FY 2024-25': '2025-03-31', 'FY 2023-24': '2024-03-31' };
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const BRANCH_WEIGHT: Record<string, number> = { 'Main Campus': 0.40, 'North Branch': 0.18, 'South Branch': 0.16, 'East Branch': 0.14, 'West Branch': 0.12 };
const ENTRY_TYPES: EntryType[] = ['Receipt', 'Payment', 'Journal', 'Contra', 'Debit Note', 'Credit Note'];
const MODES = ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'NEFT', 'RTGS', 'N/A'];
const BANK_MODES = ['Bank Transfer', 'Cheque', 'UPI', 'NEFT', 'RTGS'];
const REF_MODES = ['Cheque', 'NEFT', 'RTGS', 'UPI'];
const STATUSES: EntryStatus[] = ['Draft', 'Pending', 'Approved', 'Rejected', 'Reversed'];
const BANK_ACCOUNTS = [
  { id: 'SBI - Current A/c (XXXX 4521)', ledger: 'Bank A/c - SBI' },
  { id: 'HDFC - Savings A/c (XXXX 7823)', ledger: 'Bank A/c - HDFC' },
  { id: 'PNB - FD A/c (XXXX 1234)', ledger: 'Bank A/c - PNB' },
];
const REJECT_REASONS = ['Wrong Account Selected', 'Incorrect Amount', 'Missing Supporting Document', 'Duplicate Entry', 'Wrong Date', 'Other — specify below'];
const TAG_SUGGESTIONS = ['Fee', 'Salary', 'Utility', 'Grant', 'Refund', 'Adjustment', 'Sep-2025', 'Q2-2025'];
const CURRENT_USER = 'Ramesh Sharma';
const APPROVER = 'Priya Gupta (Finance Manager)';
const OPENING = { cash: 50000, bank: 300000 };

// Active accounts from Account Master (mock) — `common` = entry types where the account is shown first
const ACCOUNTS: { name: string; active: boolean; common: EntryType[] }[] = [
  { name: 'Cash A/c', active: true, common: ['Receipt', 'Payment', 'Contra'] },
  { name: 'Bank A/c - SBI', active: true, common: ['Receipt', 'Payment', 'Contra'] },
  { name: 'Bank A/c - HDFC', active: true, common: ['Receipt', 'Payment', 'Contra'] },
  { name: 'Bank A/c - PNB', active: true, common: ['Contra'] },
  { name: 'Tuition Fee A/c', active: true, common: ['Receipt', 'Credit Note'] },
  { name: 'Hostel Fee A/c', active: true, common: ['Receipt', 'Credit Note'] },
  { name: 'Transport Fee A/c', active: true, common: ['Receipt', 'Credit Note'] },
  { name: 'Exam Fee A/c', active: true, common: ['Receipt'] },
  { name: 'Library Fine A/c', active: true, common: ['Receipt'] },
  { name: 'Donation A/c', active: true, common: ['Receipt'] },
  { name: 'Grant A/c', active: true, common: ['Receipt'] },
  { name: 'Misc. Income A/c', active: true, common: ['Receipt'] },
  { name: 'Salary A/c', active: true, common: ['Payment', 'Journal'] },
  { name: 'Electricity A/c', active: true, common: ['Payment'] },
  { name: 'Water A/c', active: true, common: ['Payment'] },
  { name: 'Maintenance A/c', active: true, common: ['Payment'] },
  { name: 'Stationery A/c', active: true, common: ['Payment', 'Debit Note'] },
  { name: 'Transport Expense A/c', active: true, common: ['Payment'] },
  { name: 'Lab Equipment A/c', active: true, common: ['Payment'] },
  { name: 'Salary Advance A/c', active: true, common: ['Payment', 'Journal'] },
  { name: 'Depreciation A/c', active: true, common: ['Journal'] },
  { name: 'Accumulated Depreciation A/c', active: true, common: ['Journal'] },
  { name: 'Bad Debts A/c', active: true, common: ['Journal'] },
  { name: 'Fee Receivable A/c', active: true, common: ['Journal', 'Credit Note'] },
  { name: 'Accounts Payable A/c', active: true, common: ['Payment', 'Debit Note'] },
  { name: 'Salary Payable A/c', active: true, common: ['Journal'] },
  { name: 'Refund Payable A/c', active: true, common: ['Credit Note'] },
  { name: 'Purchase Returns A/c', active: true, common: ['Debit Note'] },
  { name: 'Old Suspense A/c', active: false, common: [] },
];
const ACTIVE_ACCOUNTS = ACCOUNTS.filter((a) => a.active);

const TYPE_META: Record<EntryType, { emoji: string; label: string; prefix: string; when: string; examples: string; tone: string }> = {
  Receipt: { emoji: '💰', label: 'Receipt Entry', prefix: 'RV', when: 'Money coming IN', examples: 'Student fee, grant received, donation', tone: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' },
  Payment: { emoji: '💸', label: 'Payment Entry', prefix: 'PV', when: 'Money going OUT', examples: 'Salary, bills, purchases', tone: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100' },
  Journal: { emoji: '📓', label: 'Journal Entry', prefix: 'JV', when: 'Internal adjustments', examples: 'Depreciation, adjustments, corrections', tone: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100' },
  Contra: { emoji: '🔄', label: 'Contra Entry', prefix: 'JV', when: 'Cash ↔ Bank transfer', examples: 'Cash deposited to bank or withdrawn', tone: 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100' },
  'Debit Note': { emoji: '📝', label: 'Debit Note', prefix: 'DN', when: 'Deducting from a party', examples: 'Vendor overcharged, return of goods', tone: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' },
  'Credit Note': { emoji: '📋', label: 'Credit Note', prefix: 'CN', when: 'Adding to a party', examples: 'Refund to student, excess fee returned', tone: 'bg-violet-50 border-violet-200 text-violet-800 hover:bg-violet-100' },
};
const TEMPLATE: Record<EntryType, [string, string]> = {
  Receipt: ['Cash A/c', 'Tuition Fee A/c'],
  Payment: ['Electricity A/c', 'Cash A/c'],
  Journal: ['', ''],
  Contra: ['Bank A/c - SBI', 'Cash A/c'],
  'Debit Note': ['Accounts Payable A/c', 'Purchase Returns A/c'],
  'Credit Note': ['Tuition Fee A/c', 'Refund Payable A/c'],
};
const DEFAULT_MODE: Record<EntryType, string> = { Receipt: 'Cash', Payment: 'Cash', Journal: 'N/A', Contra: 'Cash', 'Debit Note': 'N/A', 'Credit Note': 'N/A' };
const STATUS_META: Record<EntryStatus, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' | 'info'; who: string; actions: string }> = {
  Draft: { label: '💾 Draft', variant: 'default', who: 'Creator / Accountant', actions: '👁️ View · 📝 Edit · 🗑️ Delete · ✅ Submit for Approval' },
  Pending: { label: '⏳ Pending', variant: 'warning', who: 'Finance Manager / Principal', actions: '👁️ View · ✅ Approve · ❌ Reject (with reason)' },
  Approved: { label: '✅ Approved', variant: 'success', who: 'Finance Manager / Admin', actions: '👁️ View · 🖨️ Print Voucher · 🔄 Reverse' },
  Rejected: { label: '❌ Rejected', variant: 'danger', who: 'Creator / Accountant', actions: '👁️ View · 📝 Edit & Resubmit' },
  Reversed: { label: '🔄 Reversed', variant: 'info', who: 'All authorized users', actions: '👁️ View Original · 👁️ View Reversal Entry' },
};

// ───────────────────────────── Mock Entries ─────────────────────────────
const L = (account: string, debit: number, credit: number, desc = ''): JLine => ({ account, desc, debit, credit });
type Seed = Partial<DayEntry> & Pick<DayEntry, 'id' | 'date' | 'voucherNo' | 'type' | 'narration' | 'lines' | 'status' | 'branch'>;
const mk = (p: Seed): DayEntry => ({
  mode: 'N/A', bankAccount: '', chqRef: '', chqDate: '', party: '—', module: 'Manual',
  tags: [], attachment: '', createdBy: CURRENT_USER, ...p,
});
const SBI = BANK_ACCOUNTS[0].id;
const HDFC = BANK_ACCOUNTS[1].id;

const DAY_DATA: Record<string, DayEntry[]> = {
  'FY 2025-26': [
    mk({ id: '1', date: '2025-09-27', voucherNo: 'RV-2025-001', type: 'Receipt', narration: 'Fee from Rahul - X-A', lines: [L('Cash A/c', 15000, 0, 'Fee from Rahul'), L('Tuition Fee A/c', 0, 15000, 'Tuition Fee X-A')], mode: 'Cash', party: 'Rahul Kumar (X-A)', module: 'Fee Management', tags: ['Fee', 'Sep-2025'], attachment: 'fee-receipt-rahul.pdf', status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '2', date: '2025-09-27', voucherNo: 'PV-2025-001', type: 'Payment', narration: 'Electricity Bill Sep-25', lines: [L('Electricity A/c', 8000, 0, 'Sep-25 bill'), L('Cash A/c', 0, 8000, 'Paid in cash')], mode: 'Cash', party: 'Torrent Power Ltd.', tags: ['Utility', 'Sep-2025'], attachment: 'torrent-bill-sep25.pdf', status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '3', date: '2025-09-27', voucherNo: 'JV-2025-001', type: 'Journal', narration: 'Depreciation Sep-2025', lines: [L('Depreciation A/c', 5000, 0, 'Monthly depreciation'), L('Accumulated Depreciation A/c', 0, 5000, 'Furniture & equipment')], tags: ['Adjustment', 'Sep-2025'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '4', date: '2025-09-27', voucherNo: 'RV-2025-002', type: 'Receipt', narration: 'Hostel Fee - Priya IX', lines: [L('Bank A/c - SBI', 12000, 0, 'UPI collection'), L('Hostel Fee A/c', 0, 12000, 'Hostel fee Term 2')], mode: 'UPI', bankAccount: SBI, chqRef: 'UPI/270925/5521', party: 'Priya Singh (IX-B)', module: 'Hostel', tags: ['Fee', 'Sep-2025'], status: 'Pending', branch: 'North Branch' }),
    mk({ id: '5', date: '2025-09-27', voucherNo: 'PV-2025-002', type: 'Payment', narration: 'Vendor - ABC Company', lines: [L('Accounts Payable A/c', 25000, 0, 'Invoice INV-4471'), L('Bank A/c - SBI', 0, 25000, 'NEFT transfer')], mode: 'NEFT', bankAccount: SBI, chqRef: 'NEFT/SBIN/88120', party: 'ABC Company', tags: ['Sep-2025'], attachment: 'abc-invoice-4471.pdf', status: 'Pending', branch: 'South Branch', createdBy: 'Suresh Patel' }),
    mk({ id: '6', date: '2025-09-27', voucherNo: 'JV-2025-002', type: 'Journal', narration: 'Salary Adjustment', lines: [L('Salary A/c', 3000, 0, 'Arrears Aug-25'), L('Salary Payable A/c', 0, 3000, 'Payable next cycle')], module: 'Payroll', tags: ['Salary', 'Adjustment'], status: 'Draft', branch: 'West Branch' }),
    mk({ id: '7', date: '2025-09-26', voucherNo: 'RV-2025-003', type: 'Receipt', narration: 'Library Fine - Amit', lines: [L('Cash A/c', 200, 0, 'Fine collected'), L('Library Fine A/c', 0, 200, 'Late book return')], mode: 'Cash', party: 'Amit Verma (VIII-C)', module: 'Library', tags: ['Fee'], status: 'Rejected', rejectReason: 'Missing Supporting Document', rejectComment: 'Attach the library fine slip before resubmitting.', rejectedBy: APPROVER, branch: 'East Branch', createdBy: 'Anita Roy' }),
    mk({ id: '8', date: '2025-09-25', voucherNo: 'JV-2025-003', type: 'Contra', narration: 'Cash Deposited to Bank', lines: [L('Bank A/c - SBI', 20000, 0, 'Deposit slip 7781'), L('Cash A/c', 0, 20000, 'Cash deposited')], mode: 'Cash', bankAccount: SBI, party: 'Self', status: 'Reversed', approvedBy: APPROVER, reversedBy: '9', reversalReason: 'Deposit slip was posted twice — duplicate contra entry.', reversalDate: '2025-09-26', branch: 'Main Campus' }),
    mk({ id: '9', date: '2025-09-26', voucherNo: 'JV-2025-004', type: 'Journal', narration: 'Reversal of JV-2025-003 — Cash Deposited to Bank', lines: [L('Cash A/c', 20000, 0, 'Reversal of JV-2025-003'), L('Bank A/c - SBI', 0, 20000, 'Reversal of JV-2025-003')], party: 'Self', tags: ['Reversal'], status: 'Approved', approvedBy: APPROVER, reversalOf: '8', branch: 'Main Campus' }),
    mk({ id: '10', date: '2025-09-26', voucherNo: 'RV-2025-004', type: 'Receipt', narration: 'Transport Fee - Q2 Bus Route 4', lines: [L('Bank A/c - SBI', 30000, 0, 'Route 4 collection'), L('Transport Fee A/c', 0, 30000, 'Q2 transport fee')], mode: 'NEFT', bankAccount: SBI, chqRef: 'NEFT/HDFC/55310', party: 'Parents - Bus Route 4', module: 'Transport', tags: ['Fee', 'Q2-2025'], status: 'Approved', approvedBy: APPROVER, branch: 'North Branch' }),
    mk({ id: '11', date: '2025-09-26', voucherNo: 'PV-2025-003', type: 'Payment', narration: 'Water Bill Sep-25', lines: [L('Water A/c', 3500, 0, 'Sep-25 bill'), L('Cash A/c', 0, 3500, 'Paid in cash')], mode: 'Cash', party: 'AMC Water Dept.', tags: ['Utility', 'Sep-2025'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '12', date: '2025-09-26', voucherNo: 'PV-2025-007', type: 'Payment', narration: 'Stationery Purchase - Shree Books', lines: [L('Stationery A/c', 3500, 0, 'Registers & chalk'), L('Cash A/c', 0, 3500, 'Paid in cash')], mode: 'Cash', party: 'Shree Books', status: 'Pending', branch: 'Main Campus', createdBy: 'Anita Roy' }),
    mk({ id: '13', date: '2025-09-25', voucherNo: 'RV-2025-005', type: 'Receipt', narration: 'Exam Fee - Batch X (32 students)', lines: [L('Cash A/c', 16000, 0, 'Exam fee collection'), L('Exam Fee A/c', 0, 16000, 'Term 1 exam fee')], mode: 'Cash', party: 'Batch X (32 students)', module: 'Fee Management', tags: ['Fee'], status: 'Approved', approvedBy: APPROVER, branch: 'South Branch' }),
    mk({ id: '14', date: '2025-09-24', voucherNo: 'RV-2025-006', type: 'Receipt', narration: 'Donation - Alumni Meet', lines: [L('Bank A/c - HDFC', 51000, 0, 'Transfer received'), L('Donation A/c', 0, 51000, 'Alumni meet 2025')], mode: 'Bank Transfer', bankAccount: HDFC, party: 'Alumni Association', tags: ['Grant'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '15', date: '2025-09-24', voucherNo: 'PV-2025-004', type: 'Payment', narration: 'Lab Equipment - Sci-Mart', lines: [L('Lab Equipment A/c', 45000, 0, 'Physics lab kits'), L('Bank A/c - SBI', 0, 45000, 'RTGS payment')], mode: 'RTGS', bankAccount: SBI, chqRef: 'RTGS/SBIN/0931', party: 'Sci-Mart Supplies', status: 'Approved', approvedBy: APPROVER, branch: 'East Branch' }),
    mk({ id: '16', date: '2025-09-23', voucherNo: 'RV-2025-007', type: 'Receipt', narration: 'Hostel Fee - Term 2 Batch', lines: [L('Bank A/c - HDFC', 88000, 0, 'Batch collection'), L('Hostel Fee A/c', 0, 88000, 'Term 2 hostel fee')], mode: 'NEFT', bankAccount: HDFC, chqRef: 'NEFT/HDFC/55102', party: 'Hostel Batch - Term 2', module: 'Hostel', tags: ['Fee'], status: 'Approved', approvedBy: APPROVER, branch: 'North Branch' }),
    mk({ id: '17', date: '2025-09-22', voucherNo: 'PV-2025-005', type: 'Payment', narration: 'Bus Diesel - Patel Fills', lines: [L('Transport Expense A/c', 6200, 0, 'Diesel 70 L'), L('Cash A/c', 0, 6200, 'Paid in cash')], mode: 'Cash', party: 'Patel Fuels', module: 'Transport', status: 'Approved', approvedBy: APPROVER, branch: 'West Branch' }),
    mk({ id: '18', date: '2025-09-20', voucherNo: 'CN-2025-001', type: 'Credit Note', narration: 'Excess fee returned - Kriya (withdrawn)', lines: [L('Tuition Fee A/c', 12000, 0, 'Fee reversal'), L('Refund Payable A/c', 0, 12000, 'Refund due to parent')], party: 'Kriya Desai (VII-A)', module: 'Fee Management', tags: ['Refund'], status: 'Approved', approvedBy: APPROVER, branch: 'South Branch' }),
    mk({ id: '19', date: '2025-09-19', voucherNo: 'RV-2025-008', type: 'Receipt', narration: 'Misc. Income - Scrap Sale', lines: [L('Cash A/c', 1300, 0, 'Scrap sale'), L('Misc. Income A/c', 0, 1300, 'Old furniture scrap')], mode: 'Cash', party: 'Kabadi Traders', status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '20', date: '2025-09-18', voucherNo: 'DN-2025-001', type: 'Debit Note', narration: 'ABC Company overcharged - INV-4402', lines: [L('Accounts Payable A/c', 2500, 0, 'Excess billed'), L('Purchase Returns A/c', 0, 2500, 'Rate difference')], party: 'ABC Company', status: 'Approved', approvedBy: APPROVER, branch: 'South Branch' }),
    mk({ id: '21', date: '2025-09-16', voucherNo: 'RV-2025-010', type: 'Receipt', narration: 'Transport Fee - Route 9', lines: [L('Cash A/c', 5000, 0, 'Cash collection'), L('Transport Fee A/c', 0, 5000, 'Route 9 fee')], mode: 'Cash', party: 'Parents - Route 9', module: 'Transport', tags: ['Fee'], status: 'Approved', approvedBy: APPROVER, branch: 'West Branch' }),
    mk({ id: '22', date: '2025-09-15', voucherNo: 'PV-2025-006', type: 'Payment', narration: 'Salary Advance - Mr. Mehta', lines: [L('Salary Advance A/c', 10000, 0, 'Advance against Oct salary'), L('Bank A/c - SBI', 0, 10000, 'Cheque 000128')], mode: 'Cheque', bankAccount: SBI, chqRef: '000128', chqDate: '2025-09-15', party: 'Rakesh Mehta (Staff)', module: 'Payroll', tags: ['Salary'], status: 'Approved', approvedBy: APPROVER, branch: 'West Branch' }),
    mk({ id: '23', date: '2025-09-12', voucherNo: 'RV-2025-009', type: 'Receipt', narration: 'Tuition + Transport Fee - Sneha VII-B', lines: [L('Bank A/c - SBI', 18000, 0, 'UPI collection'), L('Tuition Fee A/c', 0, 15000, 'Tuition fee Q2'), L('Transport Fee A/c', 0, 3000, 'Transport fee Q2')], mode: 'UPI', bankAccount: SBI, chqRef: 'UPI/120925/1188', party: 'Sneha Reddy (VII-B)', module: 'Fee Management', tags: ['Fee', 'Q2-2025'], status: 'Approved', approvedBy: APPROVER, branch: 'East Branch' }),
    mk({ id: '24', date: '2025-09-10', voucherNo: 'JV-2025-005', type: 'Journal', narration: 'Provision for Doubtful Fees', lines: [L('Bad Debts A/c', 8000, 0, 'Provision Q2'), L('Fee Receivable A/c', 0, 8000, 'Doubtful receivables')], module: 'Fee Management', tags: ['Adjustment'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
  ],
  'FY 2024-25': [
    mk({ id: '101', date: '2024-09-27', voucherNo: 'RV-2024-101', type: 'Receipt', narration: 'Tuition Fee - Term 1 Batch', lines: [L('Cash A/c', 42000, 0), L('Tuition Fee A/c', 0, 42000)], mode: 'Cash', party: 'Term 1 Batch', module: 'Fee Management', tags: ['Fee'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '102', date: '2024-09-26', voucherNo: 'PV-2024-101', type: 'Payment', narration: 'Electricity Bill Sep-24', lines: [L('Electricity A/c', 7000, 0), L('Cash A/c', 0, 7000)], mode: 'Cash', party: 'Torrent Power Ltd.', tags: ['Utility'], status: 'Approved', approvedBy: APPROVER, branch: 'North Branch' }),
    mk({ id: '103', date: '2024-09-25', voucherNo: 'RV-2024-102', type: 'Receipt', narration: 'Govt Grant Q2', lines: [L('Bank A/c - SBI', 100000, 0), L('Grant A/c', 0, 100000)], mode: 'NEFT', bankAccount: SBI, chqRef: 'NEFT/GOV/2291', party: 'State Education Dept.', tags: ['Grant'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '104', date: '2024-09-24', voucherNo: 'PV-2024-102', type: 'Payment', narration: 'Teacher Salary Advance', lines: [L('Salary Advance A/c', 30000, 0), L('Bank A/c - SBI', 0, 30000)], mode: 'RTGS', bankAccount: SBI, chqRef: 'RTGS/SBIN/0412', party: 'Teaching Staff', module: 'Payroll', tags: ['Salary'], status: 'Approved', approvedBy: APPROVER, branch: 'East Branch' }),
    mk({ id: '105', date: '2024-09-23', voucherNo: 'JV-2024-101', type: 'Journal', narration: 'Depreciation - Sep 2024', lines: [L('Depreciation A/c', 4500, 0), L('Accumulated Depreciation A/c', 0, 4500)], tags: ['Adjustment'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '106', date: '2024-09-22', voucherNo: 'JV-2024-102', type: 'Contra', narration: 'Cash Withdrawal from Bank', lines: [L('Cash A/c', 25000, 0), L('Bank A/c - SBI', 0, 25000)], mode: 'Cheque', bankAccount: SBI, chqRef: '000077', chqDate: '2024-09-22', party: 'Self', status: 'Approved', approvedBy: APPROVER, branch: 'South Branch' }),
  ],
  'FY 2023-24': [
    mk({ id: '201', date: '2023-09-25', voucherNo: 'RV-2023-101', type: 'Receipt', narration: 'Tuition Fee - Term 1 Batch', lines: [L('Cash A/c', 38000, 0), L('Tuition Fee A/c', 0, 38000)], mode: 'Cash', party: 'Term 1 Batch', module: 'Fee Management', tags: ['Fee'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '202', date: '2023-09-22', voucherNo: 'PV-2023-101', type: 'Payment', narration: 'Electricity Bill Sep-23', lines: [L('Electricity A/c', 6500, 0), L('Cash A/c', 0, 6500)], mode: 'Cash', party: 'Torrent Power Ltd.', tags: ['Utility'], status: 'Approved', approvedBy: APPROVER, branch: 'Main Campus' }),
    mk({ id: '203', date: '2023-09-20', voucherNo: 'JV-2023-101', type: 'Journal', narration: 'Depreciation - Sep 2023', lines: [L('Depreciation A/c', 4000, 0), L('Accumulated Depreciation A/c', 0, 4000)], tags: ['Adjustment'], status: 'Approved', approvedBy: APPROVER, branch: 'North Branch' }),
  ],
};

// ───────────────────────────── Helpers ─────────────────────────────
const isCashAcc = (a: string) => a === 'Cash A/c';
const isBankAcc = (a: string) => a.startsWith('Bank A/c');
const drTotal = (e: DayEntry) => e.lines.reduce((s, l) => s + l.debit, 0);
const crTotal = (e: DayEntry) => e.lines.reduce((s, l) => s + l.credit, 0);
const shownDr = (e: DayEntry) => (e.type === 'Payment' ? 0 : drTotal(e));
const shownCr = (e: DayEntry) => (e.type === 'Receipt' ? 0 : crTotal(e));
const primaryAccount = (e: DayEntry) => {
  const pick = e.type === 'Payment' ? e.lines.find((l) => l.credit > 0) : e.lines.find((l) => l.debit > 0);
  return pick?.account || e.lines[0]?.account || '—';
};
const modeLabel = (m: string) => (m === 'Cash' ? '💵 Cash' : !m || m === 'N/A' ? '—' : `🏦 ${m}`);
const fyOf = (d: string) => {
  const y = parseInt(d.slice(0, 4), 10);
  const s = parseInt(d.slice(5, 7), 10) >= 4 ? y : y - 1;
  return `FY ${s}-${String(s + 1).slice(2)}`;
};
const toDate = (d: string) => new Date(`${d}T00:00:00`);
const periodOf = (d: string) => (d ? toDate(d).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—');
const fmtShort = (d: string) => toDate(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
const fmtLong = (d: string) => toDate(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const postsTo = (e: DayEntry) => {
  const books = ['General Ledger'];
  if (e.lines.some((l) => isCashAcc(l.account))) books.push('Cash Book');
  if (e.lines.some((l) => isBankAcc(l.account))) books.push('Bank Book');
  return books;
};
const partyLabel = (t: EntryType) => (t === 'Receipt' ? 'Received From' : t === 'Payment' ? 'Paid To' : 'Received From / Paid To');
const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent';

// ───────────────────────────── Main Page ─────────────────────────────
export function DayBook() {
  const [fy, setFy] = useState('FY 2025-26');
  const [entries, setEntries] = useState<DayEntry[]>(DAY_DATA['FY 2025-26']);
  const [branch, setBranch] = useState('All');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [fType, setFType] = useState('All');
  const [fMode, setFMode] = useState('All');
  const [fStatus, setFStatus] = useState('All');
  const [applied, setApplied] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [showGuide, setShowGuide] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null);
  const toastTimer = useRef<number>(0);

  const [viewId, setViewId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [formErr, setFormErr] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [reverseId, setReverseId] = useState<string | null>(null);
  const [reverseDate, setReverseDate] = useState('');
  const [reverseReason, setReverseReason] = useState('');
  const [modalErr, setModalErr] = useState('');

  const fyClosed = CLOSED_FYS.includes(fy);
  const notify = (msg: string, tone: 'ok' | 'err' = 'ok') => {
    setToast({ msg, tone });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  };

  const changeFy = (v: string) => {
    const y = v.slice(3, 7);
    setFy(v);
    setEntries(DAY_DATA[v] || []);
    setApplied(false);
    setDateFrom(`${y}-09-01`); setDateTo(`${y}-09-30`);
    notify(`Day Book loaded for ${v}${CLOSED_FYS.includes(v) ? ' — closed year (view only)' : ''}.`);
  };

  // ── Filtering ──
  const sorted = useMemo(() => entries.filter((e) => {
    if (branch !== 'All' && e.branch !== branch) return false;
    if (!applied) return true;
    if (search) {
      const q = search.toLowerCase();
      const hay = [e.voucherNo, e.narration, e.party, e.type, ...e.lines.map((l) => l.account), ...e.tags, String(drTotal(e))].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (dateFrom && e.date < dateFrom) return false;
    if (dateTo && e.date > dateTo) return false;
    if (fType !== 'All' && e.type !== fType) return false;
    if (fMode !== 'All' && e.mode !== fMode) return false;
    if (fStatus !== 'All' && e.status !== fStatus) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date)), [entries, branch, applied, search, dateFrom, dateTo, fType, fMode, fStatus]);

  const applyFilters = () => { setApplied(true); notify('Filters applied.'); };
  const resetFilters = () => {
    const y = fy.slice(3, 7);
    setSearch(''); setDateFrom(`${y}-09-01`); setDateTo(`${y}-09-30`);
    setFType('All'); setFMode('All'); setFStatus('All'); setBranch('All');
    setApplied(false);
  };
  const quickStatus = (s: string) => {
    setFStatus(s); setApplied(true);
    notify(s === 'All' ? 'Showing all statuses.' : `Showing ${s} entries.`);
  };

  // ── KPIs ──
  const receiptsTotal = sorted.filter((e) => e.type === 'Receipt').reduce((s, e) => s + shownDr(e), 0);
  const paymentsTotal = sorted.filter((e) => e.type === 'Payment').reduce((s, e) => s + shownCr(e), 0);
  const cashCount = sorted.filter((e) => e.mode === 'Cash').length;
  const bankCount = sorted.filter((e) => BANK_MODES.includes(e.mode)).length;
  const lastDay = sorted.length ? sorted[0].date : dateTo;

  // ── Workflow counts (branch-scoped, ignores other filters) ──
  const branchEntries = entries.filter((e) => branch === 'All' || e.branch === branch);
  const countOf = (s: EntryStatus) => branchEntries.filter((e) => e.status === s).length;

  // ── Day summary (posted = Approved / Reversed, incl. reversal entries) ──
  const scale = branch === 'All' ? 1 : BRANCH_WEIGHT[branch];
  const posted = branchEntries.filter((e) => e.status === 'Approved' || e.status === 'Reversed');
  const movement = (list: DayEntry[], pred: (a: string) => boolean) =>
    list.reduce((acc, e) => {
      e.lines.forEach((l) => { if (pred(l.account)) { acc.inn += l.debit; acc.out += l.credit; } });
      return acc;
    }, { inn: 0, out: 0 });
  const before = posted.filter((e) => e.date < lastDay);
  const onDay = posted.filter((e) => e.date === lastDay);
  const cashPrev = movement(before, isCashAcc);
  const bankPrev = movement(before, isBankAcc);
  const cashDay = movement(onDay, isCashAcc);
  const bankDay = movement(onDay, isBankAcc);
  const cashOpen = Math.round(OPENING.cash * scale) + cashPrev.inn - cashPrev.out;
  const bankOpen = Math.round(OPENING.bank * scale) + bankPrev.inn - bankPrev.out;
  const cashClose = cashOpen + cashDay.inn - cashDay.out;
  const bankClose = bankOpen + bankDay.inn - bankDay.out;
  const dayAll = branchEntries.filter((e) => e.date === lastDay);

  // ── Voucher numbering ──
  const nextVoucher = (type: EntryType, list: DayEntry[] = entries) => {
    const prefix = TYPE_META[type].prefix;
    const yr = fy.slice(3, 7);
    const re = new RegExp(`^${prefix}-${yr}-(\\d+)$`);
    const max = list.reduce((m, e) => {
      const hit = e.voucherNo.match(re);
      return hit ? Math.max(m, parseInt(hit[1], 10)) : m;
    }, 0);
    return `${prefix}-${yr}-${String(max + 1).padStart(3, '0')}`;
  };

  // ── Form handling ──
  const blankLines = (type: EntryType): FormLine[] => {
    const [a, b] = TEMPLATE[type];
    return [
      { key: 1, account: a, desc: '', debit: '', credit: '' },
      { key: 2, account: b, desc: '', debit: '', credit: '' },
    ];
  };
  const openNew = (type: EntryType) => {
    if (fyClosed) { notify(`${fy} is closed — new entries are not allowed.`, 'err'); return; }
    setForm({
      editId: null, type, date: BOOK_DATE[fy], module: 'Manual', lines: blankLines(type),
      mode: DEFAULT_MODE[type], bankAccount: SBI, chqRef: '', chqDate: '', party: '', narration: '',
      tags: [], attachment: '', branch: branch === 'All' ? 'Main Campus' : branch,
    });
    setFormErr(''); setTagDraft(''); setShowForm(true);
  };
  const openEdit = (e: DayEntry) => {
    setForm({
      editId: e.id, type: e.type, date: e.date, module: e.module,
      lines: e.lines.map((l, i) => ({ key: i + 1, account: l.account, desc: l.desc, debit: l.debit ? String(l.debit) : '', credit: l.credit ? String(l.credit) : '' })),
      mode: e.mode, bankAccount: e.bankAccount || SBI, chqRef: e.chqRef, chqDate: e.chqDate,
      party: e.party === '—' ? '' : e.party, narration: e.narration, tags: [...e.tags], attachment: e.attachment, branch: e.branch,
    });
    setFormErr(''); setTagDraft(''); setViewId(null); setShowForm(true);
  };
  const patchForm = (p: Partial<FormState>) => setForm((f) => (f ? { ...f, ...p } : f));
  const syncCashBankLine = (f: FormState, mode: string, bankId: string): FormLine[] => {
    if (f.type !== 'Receipt' && f.type !== 'Payment') return f.lines;
    const target = mode === 'Cash' ? 'Cash A/c' : BANK_MODES.includes(mode) ? (BANK_ACCOUNTS.find((b) => b.id === bankId)?.ledger || 'Bank A/c - SBI') : null;
    if (!target) return f.lines;
    const idx = f.lines.findIndex((l) => isCashAcc(l.account) || isBankAcc(l.account));
    return idx === -1 ? f.lines : f.lines.map((l, i) => (i === idx ? { ...l, account: target } : l));
  };
  const changeFormType = (t: EntryType) => setForm((f) => {
    if (!f) return f;
    const pristine = f.lines.every((l) => !l.debit && !l.credit);
    return { ...f, type: t, lines: pristine ? blankLines(t) : f.lines, mode: DEFAULT_MODE[t] };
  });
  const changeMode = (m: string) => setForm((f) => (f ? { ...f, mode: m, lines: syncCashBankLine(f, m, f.bankAccount) } : f));
  const changeBank = (b: string) => setForm((f) => (f ? { ...f, bankAccount: b, lines: syncCashBankLine(f, f.mode, b) } : f));
  const setLine = (key: number, p: Partial<FormLine>) => setForm((f) => (f ? {
    ...f,
    lines: f.lines.map((l) => {
      if (l.key !== key) return l;
      const n = { ...l, ...p };
      if (p.debit !== undefined && parseFloat(p.debit) > 0) n.credit = '';
      if (p.credit !== undefined && parseFloat(p.credit) > 0) n.debit = '';
      return n;
    }),
  } : f));
  const addLine = () => setForm((f) => (f ? { ...f, lines: [...f.lines, { key: Math.max(0, ...f.lines.map((l) => l.key)) + 1, account: '', desc: '', debit: '', credit: '' }] } : f));
  const removeLine = (key: number) => setForm((f) => (f && f.lines.length > 2 ? { ...f, lines: f.lines.filter((l) => l.key !== key) } : f));
  const addTag = (t: string) => {
    const tag = t.trim();
    if (!tag || !form) return;
    if (form.tags.includes(tag)) { setTagDraft(''); return; }
    patchForm({ tags: [...form.tags, tag] });
    setTagDraft('');
  };

  const fDr = form ? form.lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0) : 0;
  const fCr = form ? form.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0) : 0;
  const fDiff = fDr - fCr;
  const fBalanced = fDr > 0 && Math.abs(fDiff) < 0.005;

  const validate = (f: FormState, submit: boolean): string | null => {
    if (!f.date) return 'Date is required.';
    if (fyOf(f.date) !== fy) return `Date must fall within ${fy}.`;
    const lim = CLOSED_UPTO[fy];
    if (lim && f.date <= lim) return `Date falls in a closed accounting period (closed up to ${fmtLong(lim)}). Choose a date in an open period.`;
    const used = f.lines.filter((l) => l.account || l.debit || l.credit);
    if (!submit) return used.length || f.narration.trim() ? null : 'Add at least one line or a narration before saving a draft.';
    if (used.length < 2) return 'A journal entry needs at least 2 lines (one debit, one credit).';
    if (used.some((l) => !l.account)) return 'Every line with an amount needs an account.';
    const noAmt = used.find((l) => !(parseFloat(l.debit) > 0) && !(parseFloat(l.credit) > 0));
    if (noAmt) return `Line "${noAmt.account}" has no debit or credit amount.`;
    if (!used.some((l) => parseFloat(l.debit) > 0) || !used.some((l) => parseFloat(l.credit) > 0)) return 'The entry needs at least one debit line and one credit line.';
    if (!fBalanced) return `Total Debit (${inr(fDr)}) and Total Credit (${inr(fCr)}) differ by ${inr(Math.abs(fDiff))} — the difference must be ₹0 before submitting.`;
    const cashBankLines = used.filter((l) => isCashAcc(l.account) || isBankAcc(l.account));
    if ((f.type === 'Receipt' || f.type === 'Payment') && cashBankLines.length === 0) return `${TYPE_META[f.type].label} must include a Cash or Bank account line.`;
    if (f.type === 'Contra' && (cashBankLines.length !== used.length || cashBankLines.length < 2)) return 'Contra entries can only move money between Cash and Bank accounts.';
    if (BANK_MODES.includes(f.mode) && !f.bankAccount) return 'Select the bank account.';
    if (REF_MODES.includes(f.mode) && !f.chqRef.trim()) return `${f.mode === 'Cheque' ? 'Cheque' : 'Reference'} number is required for ${f.mode}.`;
    if (f.mode === 'Cheque' && !f.chqDate) return 'Cheque date is required for cheque payments.';
    if (f.type !== 'Journal' && f.type !== 'Contra' && !f.party.trim()) return `${partyLabel(f.type)} (party name) is required.`;
    if (!f.narration.trim()) return 'Narration (overall description) is required.';
    return null;
  };

  const saveEntry = (submit: boolean) => {
    if (!form) return;
    const err = validate(form, submit);
    if (err) { setFormErr(err); return; }
    const lines: JLine[] = form.lines
      .filter((l) => l.account || l.debit || l.credit)
      .map((l) => ({ account: l.account, desc: l.desc.trim(), debit: parseFloat(l.debit) || 0, credit: parseFloat(l.credit) || 0 }));
    const status: EntryStatus = submit ? 'Pending' : 'Draft';
    const base = {
      date: form.date, type: form.type, narration: form.narration.trim() || '(Draft — narration pending)', lines,
      mode: form.mode, bankAccount: BANK_MODES.includes(form.mode) ? form.bankAccount : '',
      chqRef: REF_MODES.includes(form.mode) ? form.chqRef.trim() : '', chqDate: form.mode === 'Cheque' ? form.chqDate : '',
      party: form.party.trim() || '—', module: form.module, tags: form.tags, attachment: form.attachment, branch: form.branch, status,
    };
    if (form.editId) {
      const old = entries.find((e) => e.id === form.editId);
      setEntries(entries.map((e) => (e.id === form.editId ? { ...e, ...base, rejectReason: undefined, rejectComment: undefined, rejectedBy: undefined } : e)));
      notify(`${old?.voucherNo} ${submit ? (old?.status === 'Rejected' ? 'edited & resubmitted for approval' : 'submitted for approval') : 'saved as draft'}.`);
    } else {
      const voucherNo = nextVoucher(form.type);
      setEntries([{ id: String(Date.now()), voucherNo, createdBy: CURRENT_USER, ...base }, ...entries]);
      notify(`${voucherNo} ${submit ? 'submitted for approval' : `saved as draft${fBalanced ? '' : ' (not balanced yet — fix before submitting)'}`}.`);
    }
    setShowForm(false); setForm(null);
  };

  // ── Row actions ──
  const isBalanced = (e: DayEntry) => e.lines.length >= 2 && drTotal(e) > 0 && drTotal(e) === crTotal(e);
  const submitEntry = (e: DayEntry, resubmit = false) => {
    if (!isBalanced(e)) { notify(`${e.voucherNo} is not balanced (Dr ${inr(drTotal(e))} vs Cr ${inr(crTotal(e))}) — open Edit and fix it first.`, 'err'); return; }
    setEntries(entries.map((x) => (x.id === e.id ? { ...x, status: 'Pending', rejectReason: undefined, rejectComment: undefined, rejectedBy: undefined } : x)));
    notify(`${e.voucherNo} ${resubmit ? 'resubmitted' : 'submitted'} for approval.`);
  };
  const approveEntry = (e: DayEntry) => {
    setEntries(entries.map((x) => (x.id === e.id ? { ...x, status: 'Approved', approvedBy: APPROVER } : x)));
    notify(`✅ ${e.voucherNo} approved — auto-posted to ${postsTo(e).join(', ')}.`);
  };
  const deleteDraft = (e: DayEntry) => {
    if (window.confirm(`Delete draft ${e.voucherNo}? This cannot be undone.`)) {
      setEntries(entries.filter((x) => x.id !== e.id));
      notify(`Draft ${e.voucherNo} deleted.`);
    }
  };
  const printVoucher = (e: DayEntry) => { notify(`Preparing voucher ${e.voucherNo} for printing...`); setTimeout(() => window.print(), 400); };
  const openReject = (e: DayEntry) => { setRejectId(e.id); setRejectReason(''); setRejectComment(''); setModalErr(''); };
  const openReverse = (e: DayEntry) => { setReverseId(e.id); setReverseDate(BOOK_DATE[fy] < e.date ? e.date : BOOK_DATE[fy]); setReverseReason(''); setModalErr(''); };

  const rejectEntry = entries.find((e) => e.id === rejectId) || null;
  const reverseEntry = entries.find((e) => e.id === reverseId) || null;
  const viewEntry = entries.find((e) => e.id === viewId) || null;

  const confirmReject = () => {
    if (!rejectEntry) return;
    if (!rejectReason) { setModalErr('Rejection reason is mandatory.'); return; }
    if (rejectReason.startsWith('Other') && !rejectComment.trim()) { setModalErr('Please specify the reason in Additional Comments.'); return; }
    setEntries(entries.map((x) => (x.id === rejectEntry.id ? { ...x, status: 'Rejected', rejectReason, rejectComment: rejectComment.trim(), rejectedBy: APPROVER } : x)));
    notify(`❌ ${rejectEntry.voucherNo} rejected — returned to ${rejectEntry.createdBy} (${rejectReason}).`);
    setRejectId(null);
  };
  const confirmReverse = () => {
    if (!reverseEntry) return;
    if (!reverseDate) { setModalErr('Reversal date is required.'); return; }
    if (reverseDate < reverseEntry.date) { setModalErr('Reversal date cannot be before the original entry date.'); return; }
    if (fyOf(reverseDate) !== fy) { setModalErr(`Reversal date must fall within ${fy}.`); return; }
    const lim = CLOSED_UPTO[fy];
    if (lim && reverseDate <= lim) { setModalErr(`Reversal date falls in a closed period (closed up to ${fmtLong(lim)}).`); return; }
    if (!reverseReason.trim()) { setModalErr('Reason for reversal is mandatory.'); return; }
    const id = String(Date.now());
    const voucherNo = nextVoucher('Journal');
    const counter: DayEntry = {
      id, date: reverseDate, voucherNo, type: 'Journal',
      narration: `Reversal of ${reverseEntry.voucherNo} — ${reverseEntry.narration}`,
      lines: reverseEntry.lines.map((l) => ({ account: l.account, desc: `Reversal of ${reverseEntry.voucherNo}`, debit: l.credit, credit: l.debit })),
      mode: 'N/A', bankAccount: reverseEntry.bankAccount, chqRef: '', chqDate: '', party: reverseEntry.party,
      module: reverseEntry.module, tags: ['Reversal'], attachment: '', status: 'Approved', branch: reverseEntry.branch,
      createdBy: CURRENT_USER, approvedBy: APPROVER, reversalOf: reverseEntry.id,
    };
    setEntries([counter, ...entries.map((x) => (x.id === reverseEntry.id ? { ...x, status: 'Reversed' as EntryStatus, reversedBy: id, reversalReason: reverseReason.trim(), reversalDate: reverseDate } : x))]);
    notify(`🔄 ${reverseEntry.voucherNo} reversed — counter entry ${voucherNo} created and posted.`);
    setReverseId(null);
  };

  // ── Export ──
  const doExport = (kind: 'pdf' | 'excel') => {
    if (kind === 'pdf') { notify('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Date,Voucher No,Type,Narration,Account,Payment Mode,Debit,Credit,Status,Branch,Module,Party,Tags,Created By\n';
    const rows = sorted.map((e) => [e.date, e.voucherNo, e.type, `"${e.narration}"`, `"${primaryAccount(e)}"`, e.mode, shownDr(e), shownCr(e), e.status, `"${e.branch}"`, `"${e.module}"`, `"${e.party}"`, `"${e.tags.join(' | ')}"`, `"${e.createdBy}"`].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `day-book-${fy.replace(/\s/g, '-')}.xls`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify(`Exported ${sorted.length} entries as Excel.`);
  };

  // ── Table rendering (shared by List & Branch-wise views) ──
  const actBtn = (key: string, label: string, title: string, onClick: () => void, tone: string, icon: React.ReactNode) => (
    <button key={key} title={title} onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium hover:bg-gray-100 whitespace-nowrap ${tone}`}>
      {icon}{label && <span>{label}</span>}
    </button>
  );
  const rowActions = (e: DayEntry) => {
    const view = actBtn('v', '', 'View entry', () => setViewId(e.id), 'text-gray-600', <Eye className="w-4 h-4" />);
    const print = actBtn('p', '', 'Print voucher (Finance Manager / Admin)', () => printVoucher(e), 'text-gray-600', <Printer className="w-4 h-4" />);
    switch (e.status) {
      case 'Draft':
        return [view,
          actBtn('e', 'Edit', 'Edit draft (Creator / Accountant)', () => openEdit(e), 'text-blue-600', <Pencil className="w-3.5 h-3.5" />),
          actBtn('d', 'Delete', 'Delete draft (Creator / Accountant)', () => deleteDraft(e), 'text-red-600', <Trash2 className="w-3.5 h-3.5" />),
          actBtn('s', 'Submit', 'Submit for approval (Creator / Accountant)', () => submitEntry(e), 'text-emerald-700', <Send className="w-3.5 h-3.5" />)];
      case 'Pending':
        return [view,
          actBtn('a', 'Approve', 'Approve (Finance Manager / Principal)', () => approveEntry(e), 'text-emerald-700', <CheckCircle className="w-3.5 h-3.5" />),
          actBtn('r', 'Reject', 'Reject with reason (Finance Manager / Principal)', () => openReject(e), 'text-red-600', <XCircle className="w-3.5 h-3.5" />)];
      case 'Approved':
        return e.reversalOf
          ? [view, print, actBtn('o', 'Original', 'View original (reversed) entry', () => setViewId(e.reversalOf || null), 'text-violet-700', <Eye className="w-3.5 h-3.5" />)]
          : [view, print, actBtn('rv', 'Reverse', 'Reverse with a counter entry (Finance Manager / Admin)', () => openReverse(e), 'text-amber-700', <RotateCcw className="w-3.5 h-3.5" />)];
      case 'Rejected':
        return [view,
          actBtn('e', 'Edit', 'Edit & resubmit (Creator / Accountant)', () => openEdit(e), 'text-blue-600', <Pencil className="w-3.5 h-3.5" />),
          actBtn('rs', 'Resubmit', 'Resubmit for approval without changes (Creator / Accountant)', () => submitEntry(e, true), 'text-emerald-700', <Send className="w-3.5 h-3.5" />)];
      default:
        return [
          actBtn('vo', 'Original', 'View original entry', () => setViewId(e.id), 'text-gray-700', <Eye className="w-3.5 h-3.5" />),
          actBtn('vr', 'Reversal', 'View reversal entry', () => setViewId(e.reversedBy || null), 'text-violet-700', <Eye className="w-3.5 h-3.5" />)];
    }
  };

  const renderTable = (rows: DayEntry[], showBranch: boolean) => {
    const cols = showBranch ? 12 : 11;
    const tDr = rows.reduce((s, e) => s + shownDr(e), 0);
    const tCr = rows.reduce((s, e) => s + shownCr(e), 0);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              {['#', 'Date', 'Voucher No.', 'Type', 'Narration', 'Account', 'Mode', ...(showBranch ? ['Branch'] : [])].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold uppercase text-xs tracking-wider whitespace-nowrap">{h}</th>
              ))}
              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Debit</th>
              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Credit</th>
              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Status</th>
              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((e, i) => (
              <tr key={e.id} className="hover:bg-gray-50 align-top">
                <td className="px-3 py-2.5 text-gray-500 text-xs">{i + 1}</td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{fmtShort(e.date)}</td>
                <td className="px-3 py-2.5 font-mono text-xs font-semibold text-blue-600 cursor-pointer hover:underline whitespace-nowrap" onClick={() => setViewId(e.id)}>{e.voucherNo}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">{TYPE_META[e.type].emoji} {e.type}</td>
                <td className="px-3 py-2.5 text-gray-800 min-w-[180px] max-w-[240px]">
                  <span className="block truncate" title={e.narration}>{e.narration}</span>
                  {e.status === 'Rejected' && e.rejectReason && <span className="block text-[11px] text-red-500">Reason: {e.rejectReason}</span>}
                  {e.reversalOf && <span className="block text-[11px] text-violet-600">↩ Counter entry (reversal)</span>}
                </td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{primaryAccount(e)}</td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{modeLabel(e.mode)}</td>
                {showBranch && <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap text-xs">{e.branch}</td>}
                <td className="px-3 py-2.5 text-right font-medium text-green-700 whitespace-nowrap">{shownDr(e) ? shownDr(e).toLocaleString('en-IN') : ''}</td>
                <td className="px-3 py-2.5 text-right font-medium text-red-600 whitespace-nowrap">{shownCr(e) ? shownCr(e).toLocaleString('en-IN') : ''}</td>
                <td className="px-3 py-2.5 whitespace-nowrap"><Badge variant={STATUS_META[e.status].variant}>{STATUS_META[e.status].label}</Badge></td>
                <td className="px-3 py-2.5"><div className="flex flex-wrap items-center gap-0.5">{rowActions(e)}</div></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={cols} className="px-4 py-10 text-center text-gray-500">No entries match your filters.</td></tr>
            )}
          </tbody>
          <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold">
            <tr>
              <td colSpan={showBranch ? 8 : 7} className="px-3 py-3 text-right text-gray-900">TOTAL</td>
              <td className="px-3 py-3 text-right text-green-700">{inr(tDr)}</td>
              <td className="px-3 py-3 text-right text-red-600">{inr(tCr)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const branchSections = branch === 'All' ? BRANCHES.slice(1) : [branch];
  const f = form;
  const fAccounts = f ? { common: ACTIVE_ACCOUNTS.filter((a) => a.common.includes(f.type)), others: ACTIVE_ACCOUNTS.filter((a) => !a.common.includes(f.type)) } : { common: [], others: [] };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" /> Day Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">Central hub for journal entry creation &amp; approval — every Receipt, Payment, Journal, Contra, Debit &amp; Credit Note</p>
        </div>
        <div className="w-44">
          <Select value={fy} onChange={(e) => changeFy(e.target.value)} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
        </div>
      </div>

      {toast && (
        <div className={`rounded-lg border px-4 py-3 text-sm flex items-center justify-between ${toast.tone === 'ok' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <span className="flex items-center gap-2">{toast.tone === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: CalendarDays, label: 'Viewing Date', value: lastDay ? fmtLong(lastDay) : '—', color: 'bg-blue-50 text-blue-600' },
          { icon: ArrowDownToLine, label: 'Total Receipts', value: inr(receiptsTotal), color: 'bg-emerald-50 text-emerald-600' },
          { icon: ArrowUpFromLine, label: 'Total Payments', value: inr(paymentsTotal), color: 'bg-amber-50 text-amber-600' },
          { icon: Wallet, label: 'Cash Transactions', value: String(cashCount), color: 'bg-green-50 text-green-600' },
          { icon: Landmark, label: 'Bank Transactions', value: String(bankCount), color: 'bg-violet-50 text-violet-600' },
          { icon: Scale, label: 'Total Entries', value: String(sorted.length), color: 'bg-gray-100 text-gray-600' },
        ].map((c) => (
          <Card key={c.label} className="p-4">
            <div className={`inline-flex p-2 rounded-lg mb-2 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <p className="text-[11px] text-gray-500 leading-tight">{c.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5 truncate">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Filters & Action Buttons ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Input label="🔍 Search" placeholder="Voucher no., narration, party, account, amount, tag..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <Select label="Entry Type" value={fType} onChange={(e) => setFType(e.target.value)} options={['All', ...ENTRY_TYPES].map((v) => ({ value: v, label: v }))} />
          <Select label="Payment Mode" value={fMode} onChange={(e) => setFMode(e.target.value)} options={['All', ...MODES].map((v) => ({ value: v, label: v }))} />
          <Select label="Status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} options={['All', ...STATUSES].map((v) => ({ value: v, label: v }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
        </div>
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100">
          <Button variant="primary" onClick={applyFilters}><Search className="w-4 h-4 mr-2" /> Search</Button>
          <Button variant="outline" onClick={resetFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
          <Button variant="secondary" onClick={() => openNew('Journal')} disabled={fyClosed}
            title={fyClosed ? `${fy} is closed — new entries are disabled.` : 'Create a Receipt, Payment, Journal, Contra, Debit or Credit Note'}>
            <Plus className="w-4 h-4 mr-2" /> New Journal Entry
          </Button>
          {fyClosed && <span className="text-xs text-amber-700 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> {fy} is closed — new entries are disabled. Switch to FY 2025-26 to create entries.</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
          <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </Card>

      {/* ── Approval Workflow ── */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">📊 Approval Workflow</h3>
            <p className="text-xs text-gray-500">Accountant creates → submits → Finance Manager / Principal approves or rejects → approved entries auto-post. Click a status to filter the table.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)}><Info className="w-4 h-4 mr-1" /> {showGuide ? 'Hide guide' : 'Entry types & permissions'}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {(['Draft', 'Pending', 'Approved'] as EntryStatus[]).map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="text-gray-400">→</span>}
              <button onClick={() => quickStatus(s)} className={`rounded-lg border px-3 py-2 font-medium transition-colors ${applied && fStatus === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'}`}>
                {STATUS_META[s].label} <b className="ml-1">{countOf(s)}</b>
              </button>
            </React.Fragment>
          ))}
          <span className="text-gray-400">→</span>
          <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-xs font-medium">📤 Auto-posts to GL · Cash Book · Bank Book</span>
          <span className="mx-1 h-6 w-px bg-gray-200" />
          {(['Rejected', 'Reversed'] as EntryStatus[]).map((s) => (
            <button key={s} onClick={() => quickStatus(s)} className={`rounded-lg border px-3 py-2 font-medium transition-colors ${applied && fStatus === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'}`}>
              {STATUS_META[s].label} <b className="ml-1">{countOf(s)}</b>
            </button>
          ))}
          {applied && fStatus !== 'All' && <Button variant="ghost" size="sm" onClick={() => quickStatus('All')}><X className="w-4 h-4 mr-1" /> Clear status</Button>}
        </div>
        {showGuide && (
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <p className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase text-gray-600">Why separate buttons for each entry type?</p>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {ENTRY_TYPES.map((t) => (
                    <tr key={t}>
                      <td className="px-4 py-2 font-medium whitespace-nowrap">{TYPE_META[t].emoji} {TYPE_META[t].label}</td>
                      <td className="px-4 py-2 text-gray-700">{TYPE_META[t].when}</td>
                      <td className="px-4 py-2 text-gray-500">{TYPE_META[t].examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <p className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase text-gray-600">Actions based on status</p>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {STATUSES.map((s) => (
                    <tr key={s}>
                      <td className="px-4 py-2 whitespace-nowrap"><Badge variant={STATUS_META[s].variant}>{STATUS_META[s].label}</Badge></td>
                      <td className="px-4 py-2 text-gray-700">{STATUS_META[s].actions}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{STATUS_META[s].who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* ── Day Book Table (List / Branch-wise) ── */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">Day Book Entries — {fy}</h3>
            <Badge variant="info">{sorted.length} entries · {branch === 'All' ? 'All Branches' : branch}</Badge>
          </div>
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
            {([['list', 'List View', ClipboardList], ['branch', 'Branch-wise View', Building2]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => setViewMode(k)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${viewMode === k ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
        {viewMode === 'list' ? renderTable(sorted, true) : (
          <div className="p-4 space-y-4 bg-gray-50/60">
            {branchSections.map((b) => {
              const rows = sorted.filter((e) => e.branch === b);
              return (
                <div key={b} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> {b}</span>
                    <span className="text-xs text-gray-600 flex flex-wrap gap-3">
                      <span>{rows.length} entries</span>
                      <span>Dr <b className="text-green-700">{inr(rows.reduce((s, e) => s + shownDr(e), 0))}</b></span>
                      <span>Cr <b className="text-red-600">{inr(rows.reduce((s, e) => s + shownCr(e), 0))}</b></span>
                      <span>⏳ {rows.filter((e) => e.status === 'Pending').length} pending</span>
                      <span>💾 {rows.filter((e) => e.status === 'Draft').length} draft</span>
                    </span>
                  </div>
                  {renderTable(rows, false)}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Day Summary ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 text-center border-b border-gray-200 bg-blue-50/40">
          <h3 className="font-bold text-gray-900">📊 Day Summary — {lastDay ? toDate(lastDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Posted entries only (Approved) · Branch: {branch === 'All' ? 'All Branches (Consolidated)' : branch} · Day Book = Cash Book + Bank Book + Journal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-4 space-y-1">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">💰 Opening Balance</p>
            <p className="text-sm flex justify-between"><span>💵 Cash Opening</span><b>{inr(cashOpen)}</b></p>
            <p className="text-sm flex justify-between"><span>🏦 Bank Opening</span><b>{inr(bankOpen)}</b></p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">📥 In &amp; 📤 Out</p>
            <p className="text-sm flex justify-between"><span>💵 Cash In / Out</span><b><span className="text-green-600">{cashDay.inn.toLocaleString('en-IN')}</span> / <span className="text-red-500">{cashDay.out.toLocaleString('en-IN')}</span></b></p>
            <p className="text-sm flex justify-between"><span>🏦 Bank In / Out</span><b><span className="text-green-600">{bankDay.inn.toLocaleString('en-IN')}</span> / <span className="text-red-500">{bankDay.out.toLocaleString('en-IN')}</span></b></p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">💰 Closing Balance</p>
            <p className="text-sm flex justify-between"><span>💵 Cash Closing</span><b className={cashClose < 0 ? 'text-red-600' : 'text-green-700'}>{inr(cashClose)}</b></p>
            <p className="text-sm flex justify-between"><span>🏦 Bank Closing</span><b className={bankClose < 0 ? 'text-red-600' : 'text-green-700'}>{inr(bankClose)}</b></p>
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-center gap-6 text-sm">
          <span>📋 Entries: <b>{dayAll.length}</b></span>
          <span>✅ Approved: <b className="text-green-600">{dayAll.filter((e) => e.status === 'Approved').length}</b></span>
          <span>⏳ Pending: <b className="text-amber-500">{dayAll.filter((e) => e.status === 'Pending').length}</b></span>
          <span>💾 Draft: <b className="text-gray-600">{dayAll.filter((e) => e.status === 'Draft').length}</b></span>
          <span>❌ Rejected: <b className="text-red-500">{dayAll.filter((e) => e.status === 'Rejected').length}</b></span>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Generated on: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: {CURRENT_USER} (Accountant) · {fy} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>EduManager School ERP · © 2026</span>
      </div>

      {/* ── View Entry Modal ── */}
      {viewEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> Voucher {viewEntry.voucherNo}
                <Badge variant={STATUS_META[viewEntry.status].variant}>{STATUS_META[viewEntry.status].label}</Badge>
              </h3>
              <button onClick={() => setViewId(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto custom-scrollbar text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {([
                  ['Entry Type', `${TYPE_META[viewEntry.type].emoji} ${TYPE_META[viewEntry.type].label}`],
                  ['Date', fmtLong(viewEntry.date)],
                  ['Financial Year', fyOf(viewEntry.date)],
                  ['Period', periodOf(viewEntry.date)],
                  ['Module / Source', viewEntry.module],
                  ['Branch', viewEntry.branch],
                  ['Payment Mode', modeLabel(viewEntry.mode)],
                  ['Bank Account', viewEntry.bankAccount || '—'],
                  ['Cheque / Ref No.', viewEntry.chqRef || '—'],
                  ['Cheque Date', viewEntry.chqDate ? fmtLong(viewEntry.chqDate) : '—'],
                  [partyLabel(viewEntry.type), viewEntry.party],
                  ['Created By', viewEntry.createdBy],
                  ['Approved By', viewEntry.approvedBy || '—'],
                  ['Tags', viewEntry.tags.length ? viewEntry.tags.join(', ') : '—'],
                  ['Attachment', viewEntry.attachment ? `📎 ${viewEntry.attachment}` : '—'],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{k}</span><span className="font-medium text-gray-900 text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">📋 Journal Entry Lines</p>
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr><th className="px-3 py-2 text-left">Line</th><th className="px-3 py-2 text-left">Account</th><th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2 text-right">Debit (Dr)</th><th className="px-3 py-2 text-right">Credit (Cr)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewEntry.lines.map((l, i) => (
                      <tr key={i}><td className="px-3 py-2 text-gray-500">{i + 1}</td><td className="px-3 py-2 font-medium">{l.account}</td><td className="px-3 py-2 text-gray-600">{l.desc || '—'}</td><td className="px-3 py-2 text-right text-green-700">{l.debit ? inr(l.debit) : ''}</td><td className="px-3 py-2 text-right text-red-600">{l.credit ? inr(l.credit) : ''}</td></tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-bold">
                    <tr><td colSpan={3} className="px-3 py-2 text-right">Totals</td><td className="px-3 py-2 text-right">{inr(drTotal(viewEntry))}</td><td className="px-3 py-2 text-right">{inr(crTotal(viewEntry))}</td></tr>
                  </tfoot>
                </table>
                <p className={`mt-2 text-xs font-semibold ${drTotal(viewEntry) === crTotal(viewEntry) ? 'text-green-700' : 'text-red-600'}`}>
                  {drTotal(viewEntry) === crTotal(viewEntry) ? '✅ Balanced — Debit = Credit' : `❌ Not balanced — difference ${inr(Math.abs(drTotal(viewEntry) - crTotal(viewEntry)))}`}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3"><span className="text-gray-500">Narration: </span><span className="text-gray-900">{viewEntry.narration}</span></div>
              {(viewEntry.status === 'Approved' || viewEntry.status === 'Reversed') && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">📤 Auto-posted to: {postsTo(viewEntry).map((b) => `${b} ✓`).join(' · ')}</div>
              )}
              {viewEntry.status === 'Rejected' && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                  <p className="font-semibold">❌ Rejected by {viewEntry.rejectedBy || '—'}</p>
                  <p>Reason: {viewEntry.rejectReason}</p>
                  {viewEntry.rejectComment && <p>Comments: {viewEntry.rejectComment}</p>}
                </div>
              )}
              {viewEntry.reversedBy && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800 flex flex-wrap items-center justify-between gap-2">
                  <span>🔄 Reversed on {viewEntry.reversalDate ? fmtLong(viewEntry.reversalDate) : '—'} — {viewEntry.reversalReason}</span>
                  <Button variant="outline" size="sm" onClick={() => setViewId(viewEntry.reversedBy || null)}><Eye className="w-4 h-4 mr-1" /> View Reversal Entry</Button>
                </div>
              )}
              {viewEntry.reversalOf && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800 flex flex-wrap items-center justify-between gap-2">
                  <span>↩ Counter entry created to reverse {entries.find((x) => x.id === viewEntry.reversalOf)?.voucherNo || 'the original entry'}</span>
                  <Button variant="outline" size="sm" onClick={() => setViewId(viewEntry.reversalOf || null)}><Eye className="w-4 h-4 mr-1" /> View Original</Button>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              {(viewEntry.status === 'Approved' || viewEntry.status === 'Reversed') && (
                <Button variant="outline" onClick={() => printVoucher(viewEntry)}><Printer className="w-4 h-4 mr-2" /> Print Voucher</Button>
              )}
              <Button variant="primary" onClick={() => setViewId(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── New / Edit Journal Entry Modal ── */}
      {showForm && f && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> {f.editId ? 'Edit Journal Entry' : 'New Journal Entry'} — Day Book
              </h3>
              <button onClick={() => { setShowForm(false); setForm(null); }} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
              {/* Section A: header fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                  <select value={f.type} disabled={!!f.editId} onChange={(e) => changeFormType(e.target.value as EntryType)} className={`${inputCls} disabled:bg-gray-100`}>
                    {ENTRY_TYPES.map((t) => <option key={t} value={t}>{TYPE_META[t].emoji} {TYPE_META[t].label}</option>)}
                  </select>
                  <p className="mt-1 text-[11px] text-gray-400">{f.editId ? 'Type is locked once a voucher number is assigned.' : 'Changes which accounts are shown first in the line dropdowns.'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No.</label>
                  <div className="relative">
                    <input readOnly value={f.editId ? (entries.find((e) => e.id === f.editId)?.voucherNo || '') : `Auto: ${nextVoucher(f.type)}`} className={`${inputCls} bg-gray-100 pr-24 font-mono`} />
                    <span className="absolute right-3 top-2 text-[11px] text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" /> Non-Editable</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={f.date} min={OPEN_FROM[fy]} max={`${parseInt(fy.slice(3, 7), 10) + 1}-03-31`} onChange={(e) => patchForm({ date: e.target.value })} className={inputCls} />
                  <p className="mt-1 text-[11px] text-gray-400">Cannot be in a closed accounting period{CLOSED_UPTO[fy] ? ` (closed up to ${fmtLong(CLOSED_UPTO[fy])})` : ''}.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
                  <div className="relative">
                    <input readOnly value={f.date ? fyOf(f.date) : '—'} className={`${inputCls} bg-gray-100`} />
                    <span className="absolute right-3 top-2 text-[11px] text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" /> Auto-filled</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <div className="relative">
                    <input readOnly value={periodOf(f.date)} className={`${inputCls} bg-gray-100`} />
                    <span className="absolute right-3 top-2 text-[11px] text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" /> Auto-filled</span>
                  </div>
                </div>
                <div>
                  <Select label="Branch" value={f.branch} onChange={(e) => patchForm({ branch: e.target.value })} options={BRANCHES.slice(1).map((b) => ({ value: b, label: b }))} />
                </div>
              </div>

              {/* Section B: journal lines */}
              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">📋 Journal Entry Lines</p>
                  <span className="text-[11px] text-gray-400">Only active accounts from Account Master are listed · enter an amount in Debit OR Credit per line</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                      <tr>
                        <th className="px-2 py-2 text-left w-12">Line</th>
                        <th className="px-2 py-2 text-left min-w-[200px]">Account Name</th>
                        <th className="px-2 py-2 text-left min-w-[180px]">Description</th>
                        <th className="px-2 py-2 text-right w-32">Debit (Dr)</th>
                        <th className="px-2 py-2 text-right w-32">Credit (Cr)</th>
                        <th className="px-2 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {f.lines.map((l, i) => (
                        <tr key={l.key}>
                          <td className="px-2 py-1.5 text-gray-500 text-center">{i + 1}</td>
                          <td className="px-2 py-1.5">
                            <select value={l.account} onChange={(e) => setLine(l.key, { account: e.target.value })} className={inputCls}>
                              <option value="">— Select account —</option>
                              <optgroup label={`Common for ${TYPE_META[f.type].label}`}>
                                {fAccounts.common.map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
                              </optgroup>
                              <optgroup label="All other active accounts">
                                {fAccounts.others.map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
                              </optgroup>
                            </select>
                          </td>
                          <td className="px-2 py-1.5"><input value={l.desc} onChange={(e) => setLine(l.key, { desc: e.target.value })} placeholder="Line description (optional)" className={inputCls} /></td>
                          <td className="px-2 py-1.5"><input type="number" min="0" value={l.debit} onChange={(e) => setLine(l.key, { debit: e.target.value })} placeholder="0" className={`${inputCls} text-right`} /></td>
                          <td className="px-2 py-1.5"><input type="number" min="0" value={l.credit} onChange={(e) => setLine(l.key, { credit: e.target.value })} placeholder="0" className={`${inputCls} text-right`} /></td>
                          <td className="px-2 py-1.5 text-center">
                            <button onClick={() => removeLine(l.key)} disabled={f.lines.length <= 2} title={f.lines.length <= 2 ? 'Minimum 2 lines' : 'Remove line'} className="p-1 rounded hover:bg-red-50 text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-2 py-2 text-center text-gray-400">+</td>
                        <td colSpan={5} className="px-2 py-2"><button onClick={addLine} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Another Line</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <span>Total Debit: <b className="text-green-700">{inr(fDr)}</b></span>
                    <span>Total Credit: <b className="text-red-600">{inr(fCr)}</b></span>
                    <span>Difference: <b>{inr(Math.abs(fDiff))}</b></span>
                  </div>
                  <span className={`text-sm font-semibold ${fBalanced ? 'text-green-700' : 'text-red-600'}`}>
                    {fBalanced ? '✅ Balanced — Ready to Submit' : `❌ ${inr(Math.abs(fDiff))} — Must be ZERO before submitting`}
                  </span>
                </div>
              </div>

              {/* Section C: payment details */}
              <div className="border-t border-gray-200 pt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <Select label="Payment Mode" value={f.mode} onChange={(e) => changeMode(e.target.value)} options={MODES.map((m) => ({ value: m, label: m }))} />
                  <p className="mt-1 text-[11px] text-gray-400">{f.mode === 'Cash' ? 'Posts to Cash Book on approval' : BANK_MODES.includes(f.mode) ? 'Posts to Bank Book on approval' : 'Non-cash adjustment (General Ledger only)'}</p>
                </div>
                {BANK_MODES.includes(f.mode) && (
                  <Select label="Bank Account" value={f.bankAccount} onChange={(e) => changeBank(e.target.value)} options={BANK_ACCOUNTS.map((b) => ({ value: b.id, label: b.id }))} />
                )}
                {REF_MODES.includes(f.mode) && (
                  <Input label={f.mode === 'Cheque' ? 'Cheque No.' : 'Reference No.'} value={f.chqRef} onChange={(e) => patchForm({ chqRef: e.target.value })} placeholder={f.mode === 'Cheque' ? 'e.g. 000129' : `e.g. ${f.mode}/SBIN/12345`} />
                )}
                {f.mode === 'Cheque' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date</label>
                    <input type="date" value={f.chqDate} onChange={(e) => patchForm({ chqDate: e.target.value })} className={inputCls} />
                  </div>
                )}
              </div>

              {/* Section D: party, narration, tags, attachment */}
              <div className="border-t border-gray-200 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={partyLabel(f.type)} value={f.party} onChange={(e) => patchForm({ party: e.target.value })} placeholder="Person or organization involved" />
                <Input label="Narration" value={f.narration} onChange={(e) => patchForm({ narration: e.target.value })} placeholder="Overall description of this journal entry" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(optional — for filtering &amp; reporting)</span></label>
                  <div className="flex flex-wrap items-center gap-2">
                    {f.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs text-blue-700">
                        {t}<button onClick={() => patchForm({ tags: f.tags.filter((x) => x !== t) })} title="Remove tag"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <select value="" onChange={(e) => addTag(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1 text-xs">
                      <option value="">Pick a tag ▾</option>
                      {TAG_SUGGESTIONS.filter((t) => !f.tags.includes(t)).map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagDraft); } }} placeholder="Custom tag" className="rounded-lg border border-gray-300 px-2 py-1 text-xs w-28" />
                    <button onClick={() => addTag(tagDraft)} className="text-xs font-medium text-blue-600 hover:text-blue-800">+ Add Tag</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) patchForm({ attachment: file.name }); e.target.value = ''; }} />
                  {f.attachment ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
                      <Paperclip className="w-4 h-4 text-gray-500" /> {f.attachment}
                      <button onClick={() => patchForm({ attachment: '' })} title="Remove attachment"><X className="w-3.5 h-3.5 text-gray-500" /></button>
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Paperclip className="w-4 h-4 mr-1" /> Upload Receipt / Bill / Proof</Button>
                  )}
                </div>
              </div>

              {formErr && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> {formErr}</div>}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => saveEntry(false)}><Save className="w-4 h-4 mr-2" /> Save as Draft</Button>
              <Button variant="primary" onClick={() => saveEntry(true)}><Send className="w-4 h-4 mr-2" /> Submit for Approval</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setForm(null); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-600" /> Reject Journal Entry — {rejectEntry.voucherNo}</h3>
              <button onClick={() => setRejectId(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="rounded-lg bg-gray-50 px-4 py-3 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Entry Details</p>
                <p className="flex justify-between"><span className="text-gray-500">Voucher No.</span><b>{rejectEntry.voucherNo}</b></p>
                <p className="flex justify-between"><span className="text-gray-500">Amount</span><b>{inr(drTotal(rejectEntry))}</b></p>
                <p className="flex justify-between"><span className="text-gray-500">Created By</span><b>{rejectEntry.createdBy}</b></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason <span className="text-red-500">(Mandatory)</span></label>
                <select value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setModalErr(''); }} className={inputCls}>
                  <option value="">Select Reason ▾</option>
                  {REJECT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments {rejectReason.startsWith('Other') && <span className="text-red-500">(required for “Other”)</span>}</label>
                <textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={3} className={inputCls} placeholder="Explain what needs to be corrected..." />
              </div>
              {modalErr && <p className="text-sm text-red-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {modalErr}</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="danger" onClick={confirmReject}><XCircle className="w-4 h-4 mr-2" /> Confirm Reject</Button>
              <Button variant="ghost" onClick={() => setRejectId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reverse Modal ── */}
      {reverseEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><RotateCcw className="w-5 h-5 text-amber-600" /> Reverse Journal Entry — {reverseEntry.voucherNo}</h3>
              <button onClick={() => setReverseId(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">⚠️ <b>WARNING:</b> This will create a COUNTER ENTRY to cancel the effect of the original entry.</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">Original Entry</p>
                  <p className="text-gray-600">Voucher No.: <b>{reverseEntry.voucherNo}</b></p>
                  <p className="text-gray-600 mb-2">Date: <b>{fmtLong(reverseEntry.date)}</b></p>
                  {reverseEntry.lines.map((l, i) => (
                    <p key={i} className="flex justify-between gap-2"><span>{l.debit ? 'Dr.' : 'Cr.'} {l.account}</span><b>{inr(l.debit || l.credit)}</b></p>
                  ))}
                </div>
                <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3">
                  <p className="text-xs font-bold uppercase text-violet-700 mb-2">Reversal Entry will be</p>
                  <p className="text-gray-600 mb-2">Voucher No.: <b>Auto: {nextVoucher('Journal')}</b></p>
                  {reverseEntry.lines.map((l, i) => (
                    <p key={i} className="flex justify-between gap-2"><span>{l.debit ? 'Cr.' : 'Dr.'} {l.account}</span><b>{inr(l.debit || l.credit)} <span className="font-normal text-gray-500">(opposite)</span></b></p>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reversal Date</label>
                <input type="date" value={reverseDate} min={reverseEntry.date} onChange={(e) => { setReverseDate(e.target.value); setModalErr(''); }} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reversal <span className="text-red-500">(Mandatory)</span></label>
                <textarea value={reverseReason} onChange={(e) => { setReverseReason(e.target.value); setModalErr(''); }} rows={3} className={inputCls} placeholder="Why is this entry being reversed?" />
              </div>
              {modalErr && <p className="text-sm text-red-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {modalErr}</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="primary" onClick={confirmReverse}><RotateCcw className="w-4 h-4 mr-2" /> Confirm Reversal</Button>
              <Button variant="ghost" onClick={() => setReverseId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
