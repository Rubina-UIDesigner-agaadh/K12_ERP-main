import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { getChargeHeads } from './ChargeMaster';
import type { ChargeHead } from './ChargeMaster';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  FileText,
  GraduationCap,
  History,
  IndianRupee,
  Info,
  Mail,
  Phone,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Wallet,
  X } from
'lucide-react';

// ============================================================
// Charge Receipt — combined "Charge List" + "Charge Receipt".
// List of students / staff who have to pay charges → Collect Payment →
// their charges (add / edit / delete), payment and receipts.
// Mock data only (no backend). The ledger below is shared in memory with
// Charge Receipt Import, so imported payments update the dues shown here.
// ============================================================

// ---------------------------------------------------------------- types
export type PayerType = 'student' | 'staff';
export type PaymentMode = 'Cash' | 'Cheque' | 'DD' | 'Online' | 'NEFT' | 'RTGS' | 'UPI' | 'Card';

interface PayerBase {
  id: string;
  name: string;
  phone: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive';
}
export interface ChargeStudent extends PayerBase {
  type: 'student';
  grNo: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNo: string;
  fatherName: string;
  motherName: string;
}
export interface ChargeStaff extends PayerBase {
  type: 'staff';
  empCode: string;
  department: string;
  designation: string;
  staffType: 'Teaching' | 'Non-Teaching';
}
export type ChargePayer = ChargeStudent | ChargeStaff;

export interface PayerCharge {
  id: string;
  payerId: string;
  headId: string;
  headName: string;
  headCode: string;
  category: string;
  description: string;
  amount: number;
  paid: number;
  waived: number;
  dueDate: string;
  createdOn: string;
  createdBy: string;
}

export interface ReceiptLine {
  chargeId: string | null;
  headName: string;
  headCode: string;
  chargeAmount: number;
  discount: number;
  paid: number;
}

export interface ChargeReceiptRecord {
  id: string;
  receiptNo: string;
  payerId: string;
  date: string;
  time: string;
  lines: ReceiptLine[];
  total: number;
  discountTotal: number;
  paymentMode: PaymentMode;
  reference: string;
  bankName: string;
  chequeDate?: string;
  remarks: string;
  receivedBy: string;
  source: 'counter' | 'import';
}

interface PayerSummary {
  pending: PayerCharge[];
  due: number;
  overdue: number;
  lastPayment: string | null;
  receipts: number;
}

interface PaymentLineInput {
  charge: PayerCharge;
  discount: number;
  payNow: number;
}

interface PaymentInput {
  lines: PaymentLineInput[];
  date: string;
  mode: PaymentMode;
  reference: string;
  bankName: string;
  chequeDate: string;
  remarks: string;
}

// ---------------------------------------------------------------- date helpers
const pad2 = (n: number) => String(n).padStart(2, '0');
const isoOf = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const todayIso = () => isoOf(new Date());
const dayOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoOf(d);
};
const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
export const formatDate = (iso: string | null | undefined) =>
iso ?
new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) :
'—';
const daysBetween = (fromIso: string, toIso: string) =>
Math.round((new Date(`${toIso}T00:00:00`).getTime() - new Date(`${fromIso}T00:00:00`).getTime()) / 86400000);
const sessionLabel = () => {
  const d = new Date();
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${pad2((y + 1) % 100)}`;
};
export const inr = (n: number) => `₹${Math.round(n * 100) / 100 === Math.round(n) ? Math.round(n).toLocaleString('en-IN') : n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ---------------------------------------------------------------- masters (branch / franchise)
const BRANCHES = ['Main Campus', 'North Campus', 'South Campus'];
// Centre → master franchise (same mapping as Fee Receipt Bulk / Fee Refund)
const FRANCHISE_OF_BRANCH: Record<string, string> = {
  'Main Campus': 'MF1',
  'North Campus': 'MF1',
  'South Campus': 'MF2'
};
const FRANCHISE_LABEL: Record<string, string> = { MF1: 'MF 1', MF2: 'MF 2' };
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const CASHIER = 'Mr. Rajesh Kumar (Accounts)';
const SCHOOL_NAME = 'ABC International School';

// ---------------------------------------------------------------- mock people
export const CHARGE_STUDENTS: ChargeStudent[] = [
{ id: 'STU001', type: 'student', name: 'Rahul Sharma', grNo: 'GR-1001', admissionNo: 'ADM-2024-001', className: '10', section: 'A', rollNo: '15', fatherName: 'Suresh Sharma', motherName: 'Anita Sharma', phone: '9876543210', email: 'suresh.sharma@email.com', branch: 'Main Campus', status: 'Active' },
{ id: 'STU002', type: 'student', name: 'Priya Patel', grNo: 'GR-1002', admissionNo: 'ADM-2024-002', className: '9', section: 'B', rollNo: '08', fatherName: 'Raj Patel', motherName: 'Meena Patel', phone: '9876543211', email: 'raj.patel@email.com', branch: 'North Campus', status: 'Active' },
{ id: 'STU003', type: 'student', name: 'Amit Kumar', grNo: 'GR-1005', admissionNo: 'ADM-2024-005', className: '10', section: 'A', rollNo: '12', fatherName: 'Vijay Kumar', motherName: 'Sunita Kumar', phone: '9876543212', email: 'vijay.kumar@email.com', branch: 'Main Campus', status: 'Active' },
{ id: 'STU004', type: 'student', name: 'Sneha Gupta', grNo: 'GR-1008', admissionNo: 'ADM-2024-008', className: '8', section: 'C', rollNo: '05', fatherName: 'Krishna Gupta', motherName: 'Lakshmi Gupta', phone: '9876543213', email: 'krishna.gupta@email.com', branch: 'South Campus', status: 'Active' },
{ id: 'STU005', type: 'student', name: 'Vikram Singh', grNo: 'GR-1012', admissionNo: 'ADM-2024-012', className: '12', section: 'A', rollNo: '21', fatherName: 'Harpreet Singh', motherName: 'Jasleen Kaur', phone: '9876543214', email: 'harpreet.singh@email.com', branch: 'Main Campus', status: 'Active' },
{ id: 'STU006', type: 'student', name: 'Ananya Iyer', grNo: 'GR-1015', admissionNo: 'ADM-2024-015', className: '7', section: 'B', rollNo: '03', fatherName: 'Ramesh Iyer', motherName: 'Lalitha Iyer', phone: '9876543215', email: 'ramesh.iyer@email.com', branch: 'North Campus', status: 'Active' },
{ id: 'STU007', type: 'student', name: 'Rohan Mehta', grNo: 'GR-1022', admissionNo: 'ADM-2024-022', className: '11', section: 'C', rollNo: '18', fatherName: 'Nilesh Mehta', motherName: 'Kavita Mehta', phone: '9876543216', email: 'nilesh.mehta@email.com', branch: 'South Campus', status: 'Active' },
{ id: 'STU008', type: 'student', name: 'Kavya Reddy', grNo: 'GR-1028', admissionNo: 'ADM-2024-028', className: '6', section: 'A', rollNo: '09', fatherName: 'Srinivas Reddy', motherName: 'Padma Reddy', phone: '9876543217', email: 'srinivas.reddy@email.com', branch: 'Main Campus', status: 'Active' },
{ id: 'STU009', type: 'student', name: 'Ishaan Joshi', grNo: 'GR-1031', admissionNo: 'ADM-2024-031', className: '9', section: 'A', rollNo: '11', fatherName: 'Prakash Joshi', motherName: 'Neha Joshi', phone: '9876543218', email: 'prakash.joshi@email.com', branch: 'South Campus', status: 'Active' },
{ id: 'STU010', type: 'student', name: 'Diya Shah', grNo: 'GR-1036', admissionNo: 'ADM-2024-036', className: '5', section: 'B', rollNo: '04', fatherName: 'Hitesh Shah', motherName: 'Rupal Shah', phone: '9876543219', email: 'hitesh.shah@email.com', branch: 'North Campus', status: 'Active' },
{ id: 'STU011', type: 'student', name: 'Arjun Nair', grNo: 'GR-1040', admissionNo: 'ADM-2024-040', className: '12', section: 'B', rollNo: '07', fatherName: 'Suresh Nair', motherName: 'Latha Nair', phone: '9876543220', email: 'suresh.nair@email.com', branch: 'Main Campus', status: 'Active' },
{ id: 'STU012', type: 'student', name: 'Meera Kapoor', grNo: 'GR-1044', admissionNo: 'ADM-2024-044', className: '8', section: 'A', rollNo: '14', fatherName: 'Rajiv Kapoor', motherName: 'Sonia Kapoor', phone: '9876543221', email: 'rajiv.kapoor@email.com', branch: 'North Campus', status: 'Active' }];


export const CHARGE_STAFF: ChargeStaff[] = [
{ id: 'STF001', type: 'staff', name: 'Rajesh Verma', empCode: 'EMP-1001', department: 'Mathematics', designation: 'PGT Mathematics', staffType: 'Teaching', phone: '9825011001', email: 'rajesh.verma@abcschool.edu', branch: 'Main Campus', status: 'Active' },
{ id: 'STF002', type: 'staff', name: 'Neha Kulkarni', empCode: 'EMP-1003', department: 'Science', designation: 'TGT Science', staffType: 'Teaching', phone: '9825011003', email: 'neha.kulkarni@abcschool.edu', branch: 'North Campus', status: 'Active' },
{ id: 'STF003', type: 'staff', name: 'Anil Deshmukh', empCode: 'EMP-1007', department: 'Administration', designation: 'Office Assistant', staffType: 'Non-Teaching', phone: '9825011007', email: 'anil.deshmukh@abcschool.edu', branch: 'Main Campus', status: 'Active' },
{ id: 'STF004', type: 'staff', name: 'Farah Khan', empCode: 'EMP-1010', department: 'Library', designation: 'Librarian', staffType: 'Non-Teaching', phone: '9825011010', email: 'farah.khan@abcschool.edu', branch: 'South Campus', status: 'Active' },
{ id: 'STF005', type: 'staff', name: 'Sunil Yadav', empCode: 'EMP-1014', department: 'Transport', designation: 'Bus Driver', staffType: 'Non-Teaching', phone: '9825011014', email: 'sunil.yadav@abcschool.edu', branch: 'South Campus', status: 'Active' },
{ id: 'STF006', type: 'staff', name: 'Pooja Iyer', empCode: 'EMP-1018', department: 'English', designation: 'PRT English', staffType: 'Teaching', phone: '9825011018', email: 'pooja.iyer@abcschool.edu', branch: 'North Campus', status: 'Active' },
{ id: 'STF007', type: 'staff', name: 'Karan Malhotra', empCode: 'EMP-1021', department: 'Sports', designation: 'PE Teacher', staffType: 'Teaching', phone: '9825011021', email: 'karan.malhotra@abcschool.edu', branch: 'Main Campus', status: 'Active' },
{ id: 'STF008', type: 'staff', name: 'Sunita Rao', empCode: 'EMP-1025', department: 'Accounts', designation: 'Accountant', staffType: 'Non-Teaching', phone: '9825011025', email: 'sunita.rao@abcschool.edu', branch: 'Main Campus', status: 'Active' }];


export const ALL_CHARGE_PAYERS: ChargePayer[] = [...CHARGE_STUDENTS, ...CHARGE_STAFF];
const DEPARTMENTS = Array.from(new Set(CHARGE_STAFF.map((s) => s.department))).sort();

// ---------------------------------------------------------------- mock charges & receipts (heads = Charge Master)
const HEAD = {
  libFine: { headId: '1', headName: 'Library Fine (Per Day)', headCode: 'LIB-FINE-01', category: 'Income' },
  idCard: { headId: '2', headName: 'ID Card Replacement', headCode: 'IDR-001', category: 'Income' },
  labDeposit: { headId: '3', headName: 'Lab Caution Deposit', headCode: 'LAB-DEP-01', category: 'Liability' },
  labBreak: { headId: '4', headName: 'Lab Equipment Breakage', headCode: 'LAB-BRK-01', category: 'Income' },
  tcFee: { headId: '5', headName: 'Transfer Certificate Fee', headCode: 'TC-FEE-01', category: 'Income' },
  discipline: { headId: '6', headName: 'Discipline Fine', headCode: 'DISC-FINE-01', category: 'Income' },
  transport: { headId: '7', headName: 'Transport Damage', headCode: 'TRN-DMG-01', category: 'Income' },
  dupMarksheet: { headId: '8', headName: 'Duplicate Marksheet', headCode: 'DUP-MS-01', category: 'Income' },
  libDeposit: { headId: '9', headName: 'Library Deposit', headCode: 'LIB-DEP-01', category: 'Liability' }
};
type HeadRef = typeof HEAD.libFine;
const seedCharge = (
id: string, payerId: string, head: HeadRef, amount: number, paid: number, dueIn: number,
description: string, createdBy: string, createdAgo: number)
: PayerCharge => ({
  id, payerId, ...head, amount, paid, waived: 0, dueDate: dayOffset(dueIn),
  createdOn: dayOffset(-createdAgo), createdBy, description
});

const SEED_CHARGES: PayerCharge[] = [
seedCharge('CHG-001', 'STU001', HEAD.labBreak, 500, 0, -12, 'Chemistry lab – test tube rack broken during practical', 'Lab Incharge', 20),
seedCharge('CHG-002', 'STU001', HEAD.libFine, 75, 0, 7, "15 days late return – 'Wings of Fire'", 'Librarian', 3),
seedCharge('CHG-003', 'STU001', HEAD.idCard, 250, 0, 10, 'Lost ID card – replacement issued', 'Admin Office', 2),
seedCharge('CHG-004', 'STU002', HEAD.libDeposit, 1000, 500, -5, 'Library membership deposit (refundable)', 'Librarian', 30),
seedCharge('CHG-005', 'STU003', HEAD.discipline, 500, 0, -2, 'Damaged classroom notice board', 'Discipline Committee', 9),
seedCharge('CHG-006', 'STU003', HEAD.dupMarksheet, 200, 0, 14, 'Duplicate Class 9 marksheet', 'Exam Cell', 1),
seedCharge('CHG-007', 'STU004', HEAD.transport, 1500, 0, 5, 'Bus seat cover torn (Route 4)', 'Transport Dept', 6),
seedCharge('CHG-008', 'STU005', HEAD.labDeposit, 5000, 0, -30, 'Class 12 lab caution deposit', 'Accounts', 45),
seedCharge('CHG-009', 'STU005', HEAD.tcFee, 500, 0, 3, 'Transfer certificate request', 'Admin Office', 2),
seedCharge('CHG-010', 'STU006', HEAD.libFine, 40, 0, 6, '8 days late return', 'Librarian', 2),
seedCharge('CHG-011', 'STU007', HEAD.labBreak, 1200, 600, -8, 'Physics lab – voltmeter damaged', 'Lab Incharge', 18),
seedCharge('CHG-012', 'STU008', HEAD.idCard, 250, 0, -1, 'ID card damaged', 'Admin Office', 7),
seedCharge('CHG-013', 'STU009', HEAD.transport, 750, 0, 9, 'Bus window glass cracked', 'Transport Dept', 4),
seedCharge('CHG-014', 'STU010', HEAD.dupMarksheet, 200, 0, 20, 'Duplicate Class 4 report card', 'Exam Cell', 1),
seedCharge('CHG-015', 'STU011', HEAD.labDeposit, 5000, 5000, -35, 'Class 12 lab caution deposit', 'Accounts', 50),
seedCharge('CHG-016', 'STU011', HEAD.discipline, 300, 0, -4, 'Misuse of lab equipment', 'Discipline Committee', 8),
seedCharge('CHG-017', 'STU012', HEAD.libFine, 60, 60, -20, '12 days late return', 'Librarian', 28),
seedCharge('CHG-101', 'STF001', HEAD.libFine, 90, 0, 5, '18 days late return – reference book', 'Librarian', 3),
seedCharge('CHG-102', 'STF002', HEAD.labBreak, 2500, 0, -6, 'Microscope objective lens damaged', 'Lab Incharge', 12),
seedCharge('CHG-103', 'STF003', HEAD.idCard, 250, 0, 12, 'Staff ID card replacement', 'Admin Office', 2),
seedCharge('CHG-104', 'STF004', HEAD.libDeposit, 1000, 0, 15, 'Staff library deposit', 'Accounts', 1),
seedCharge('CHG-105', 'STF005', HEAD.idCard, 250, 0, -3, 'Lost staff ID card', 'Admin Office', 10),
seedCharge('CHG-106', 'STF005', HEAD.libFine, 35, 0, 2, '7 days late return', 'Librarian', 2),
seedCharge('CHG-107', 'STF006', HEAD.libFine, 120, 60, -1, '24 days late return', 'Librarian', 14),
seedCharge('CHG-108', 'STF007', HEAD.idCard, 250, 0, 8, 'Staff ID card replacement', 'Admin Office', 3),
seedCharge('CHG-109', 'STF007', HEAD.libFine, 25, 0, 4, '5 days late return', 'Librarian', 1),
seedCharge('CHG-110', 'STF008', HEAD.libFine, 50, 50, -25, '10 days late return', 'Librarian', 32)];


const seedReceipt = (
seq: number, payerId: string, chargeId: string, head: HeadRef, chargeAmount: number, paid: number,
daysAgo: number, mode: PaymentMode, reference: string, receivedBy: string)
: ChargeReceiptRecord => ({
  id: `RCPT-SEED-${seq}`,
  receiptNo: `CHR-${new Date().getFullYear()}-${String(seq).padStart(5, '0')}`,
  payerId,
  date: dayOffset(-daysAgo),
  time: '11:30 am',
  lines: [{ chargeId, headName: head.headName, headCode: head.headCode, chargeAmount, discount: 0, paid }],
  total: paid,
  discountTotal: 0,
  paymentMode: mode,
  reference,
  bankName: mode === 'Cash' ? '' : 'HDFC Bank',
  remarks: '',
  receivedBy,
  source: 'counter'
});

const SEED_RECEIPTS: ChargeReceiptRecord[] = [
seedReceipt(123, 'STF008', 'CHG-110', HEAD.libFine, 50, 50, 30, 'Cash', '', CASHIER),
seedReceipt(122, 'STF006', 'CHG-107', HEAD.libFine, 120, 60, 9, 'Online', 'NEFT-992310', CASHIER),
seedReceipt(121, 'STU012', 'CHG-017', HEAD.libFine, 60, 60, 25, 'Cash', '', CASHIER),
seedReceipt(120, 'STU007', 'CHG-011', HEAD.labBreak, 1200, 600, 10, 'Cash', '', CASHIER),
seedReceipt(119, 'STU002', 'CHG-004', HEAD.libDeposit, 1000, 500, 15, 'UPI', 'UPI-448812', CASHIER),
seedReceipt(118, 'STU011', 'CHG-015', HEAD.labDeposit, 5000, 5000, 40, 'Cheque', 'CHQ-004512', CASHIER)];


// ---------------------------------------------------------------- shared in-memory ledger
interface ChargeLedger {
  charges: PayerCharge[];
  receipts: ChargeReceiptRecord[];
  reminders: Record<string, {count: number;last: string;}>;
  nextSeq: number;
}
const ledger: ChargeLedger = {
  charges: SEED_CHARGES,
  receipts: SEED_RECEIPTS,
  reminders: {
    STU001: { count: 2, last: dayOffset(-3) },
    STU005: { count: 1, last: dayOffset(-10) },
    STF002: { count: 1, last: dayOffset(-2) }
  },
  nextSeq: 124
};

export const chargeBalance = (c: PayerCharge) => Math.max(0, Math.round((c.amount - c.paid - c.waived) * 100) / 100);
export const nextChargeReceiptNo = () => `CHR-${new Date().getFullYear()}-${String(ledger.nextSeq++).padStart(5, '0')}`;
export const payerCode = (p: ChargePayer) => p.type === 'student' ? p.grNo : p.empCode;
export const payerSubtitle = (p: ChargePayer) =>
p.type === 'student' ? `Class ${p.className}-${p.section} · ${p.branch}` : `${p.department} · ${p.designation} · ${p.branch}`;

/** Finds a student by Admission No / GR No, or a staff member by Employee Code (case-insensitive). */
export function findChargePayer(code: string): ChargePayer | undefined {
  const q = code.trim().toLowerCase();
  if (!q) return undefined;
  return ALL_CHARGE_PAYERS.find((p) =>
  p.type === 'student' ?
  p.admissionNo.toLowerCase() === q || p.grNo.toLowerCase() === q :
  p.empCode.toLowerCase() === q
  );
}

/** Current pending balance of a payer (reads the shared ledger). */
export function getPayerDue(payerId: string): number {
  return ledger.charges.filter((c) => c.payerId === payerId).reduce((s, c) => s + chargeBalance(c), 0);
}

/** True when a payment reference (UTR / cheque / UPI id) was already used on an earlier charge receipt. */
export function isChargeReferenceUsed(reference: string): boolean {
  const q = reference.trim().toLowerCase();
  return !!q && q !== '-' && ledger.receipts.some((r) => r.reference.trim().toLowerCase() === q);
}

export interface ChargePaymentPosting {
  payerId: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  reference: string;
  chargeHint: string;
  remarks: string;
}

/**
 * Posts payments (used by Charge Receipt Import): each amount is allocated to the payer's pending
 * charges — matching charge head first, then oldest due date. Any excess is kept as an advance line.
 */
export function postChargePayments(entries: ChargePaymentPosting[]): ChargeReceiptRecord[] {
  let charges = [...ledger.charges];
  const created: ChargeReceiptRecord[] = [];
  entries.forEach((e, idx) => {
    const hint = e.chargeHint.trim().toLowerCase();
    const matches = (c: PayerCharge) =>
    !!hint && (c.headName.toLowerCase().includes(hint) || c.headCode.toLowerCase() === hint);
    const pending = charges.
    filter((c) => c.payerId === e.payerId && chargeBalance(c) > 0).
    sort((a, b) => Number(matches(b)) - Number(matches(a)) || a.dueDate.localeCompare(b.dueDate));
    let remaining = Math.round(e.amount * 100) / 100;
    const lines: ReceiptLine[] = [];
    pending.forEach((c) => {
      if (remaining <= 0) return;
      const pay = Math.min(chargeBalance(c), remaining);
      charges = charges.map((x) => x.id === c.id ? { ...x, paid: x.paid + pay } : x);
      lines.push({ chargeId: c.id, headName: c.headName, headCode: c.headCode, chargeAmount: c.amount, discount: 0, paid: pay });
      remaining = Math.round((remaining - pay) * 100) / 100;
    });
    if (remaining > 0) {
      lines.push({ chargeId: null, headName: 'Advance (unallocated)', headCode: 'ADVANCE', chargeAmount: 0, discount: 0, paid: remaining });
    }
    created.push({
      id: `RCPT-${Date.now()}-${idx}`,
      receiptNo: nextChargeReceiptNo(),
      payerId: e.payerId,
      date: e.date,
      time: nowTime(),
      lines,
      total: e.amount,
      discountTotal: 0,
      paymentMode: e.mode,
      reference: e.reference,
      bankName: '',
      remarks: e.remarks,
      receivedBy: 'Charge Receipt Import',
      source: 'import'
    });
  });
  ledger.charges = charges;
  ledger.receipts = [...[...created].reverse(), ...ledger.receipts];
  return created;
}

// ---------------------------------------------------------------- documents (print / download)
const ESC_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (ch) => ESC_MAP[ch]);

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const twoDigits = (n: number) => n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;
const threeDigits = (n: number) =>
[Math.floor(n / 100) ? `${ONES[Math.floor(n / 100)]} Hundred` : '', n % 100 ? twoDigits(n % 100) : ''].filter(Boolean).join(' ');
export function numberToWords(value: number): string {
  const n = Math.round(value);
  if (n === 0) return 'Zero';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor(n % 10000000 / 100000);
  const thousand = Math.floor(n % 100000 / 1000);
  const rest = n % 1000;
  return [
  crore ? `${threeDigits(crore)} Crore` : '',
  lakh ? `${twoDigits(lakh)} Lakh` : '',
  thousand ? `${twoDigits(thousand)} Thousand` : '',
  rest ? threeDigits(rest) : ''].
  filter(Boolean).join(' ');
}

const DOC_STYLE = `body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px}
.doc{max-width:760px;margin:0 auto 24px;border:1px solid #d1d5db;border-radius:8px;padding:24px}
.hd{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:16px}
.hd h1{margin:0;font-size:20px;color:#1e3a8a}.hd p{margin:4px 0 0;font-size:12px;color:#6b7280}
.meta{display:flex;justify-content:space-between;font-size:13px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:13px;margin-bottom:16px}
.grid span{color:#6b7280}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
th{background:#f3f4f6}.num{text-align:right}
.total td{font-weight:bold;background:#eff6ff}
.note{font-size:12px;margin:10px 0}
.foot{display:flex;justify-content:space-between;margin-top:40px;font-size:12px;color:#374151}
.pb{page-break-after:always}
@media print{body{margin:0}.doc{border:none}}`;

const htmlPage = (title: string, body: string) =>
`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${DOC_STYLE}</style></head><body>${body}</body></html>`;

const payerGridHtml = (p: ChargePayer) =>
p.type === 'student' ?
`<div><span>Student:</span> <strong>${esc(p.name)}</strong></div>
<div><span>GR No / Adm No:</span> ${esc(p.grNo)} / ${esc(p.admissionNo)}</div>
<div><span>Class:</span> ${esc(`${p.className}-${p.section}`)} (Roll ${esc(p.rollNo)})</div>
<div><span>Branch:</span> ${esc(p.branch)} (${esc(FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[p.branch]])})</div>
<div><span>Parent:</span> ${esc(p.fatherName)}</div>
<div><span>Contact:</span> ${esc(p.phone)}</div>` :
`<div><span>Staff:</span> <strong>${esc(p.name)}</strong></div>
<div><span>Employee Code:</span> ${esc(p.empCode)}</div>
<div><span>Department:</span> ${esc(p.department)}</div>
<div><span>Designation:</span> ${esc(p.designation)}</div>
<div><span>Branch:</span> ${esc(p.branch)} (${esc(FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[p.branch]])})</div>
<div><span>Contact:</span> ${esc(p.phone)}</div>`;

export function chargeReceiptHtml(r: ChargeReceiptRecord, p: ChargePayer | undefined): string {
  const rows = r.lines.
  map((l, i) =>
  `<tr><td>${i + 1}</td><td>${esc(l.headName)}${l.headCode ? ` <small>(${esc(l.headCode)})</small>` : ''}</td><td class="num">${esc(l.chargeAmount ? inr(l.chargeAmount) : '—')}</td><td class="num">${esc(l.discount ? inr(l.discount) : '—')}</td><td class="num">${esc(inr(l.paid))}</td></tr>`
  ).
  join('');
  const ref = r.reference ? ` (Ref: ${esc(r.reference)}${r.chequeDate ? `, dated ${esc(formatDate(r.chequeDate))}` : ''})` : '';
  return htmlPage(
    `Charge Receipt ${r.receiptNo}`,
    `<div class="doc"><div class="hd"><h1>${SCHOOL_NAME}</h1><p>Charge Receipt</p></div>
<div class="meta"><div><strong>Receipt No:</strong> ${esc(r.receiptNo)}</div><div><strong>Date:</strong> ${esc(formatDate(r.date))} ${esc(r.time)}</div></div>
<div class="grid">${p ? payerGridHtml(p) : ''}
<div><span>Payment Mode:</span> ${esc(r.paymentMode)}${ref}</div>${r.bankName ? `<div><span>Bank:</span> ${esc(r.bankName)}</div>` : ''}</div>
<table><thead><tr><th style="width:36px">#</th><th>Charge Head</th><th class="num">Charge Amount</th><th class="num">Discount</th><th class="num">Paid</th></tr></thead>
<tbody>${rows}<tr class="total"><td></td><td colspan="3">Total Paid</td><td class="num">${esc(inr(r.total))}</td></tr></tbody></table>
<p class="note"><strong>Rupees ${esc(numberToWords(r.total))} Only</strong></p>
${r.remarks ? `<p class="note">Remarks: ${esc(r.remarks)}</p>` : ''}
<div class="foot"><div>Received by: ${esc(r.receivedBy)}</div><div>Authorised Signatory</div></div></div>`
  );
}

const statementHtml = (items: {payer: ChargePayer;pending: PayerCharge[];}[]) =>
htmlPage(
  'Charge Statement',
  items.
  map(({ payer, pending }, idx) => {
    const total = pending.reduce((s, c) => s + chargeBalance(c), 0);
    const rows = pending.length ?
    pending.
    map((c, i) =>
    `<tr><td>${i + 1}</td><td>${esc(c.headName)}<br><small>${esc(c.description)}</small></td><td>${esc(formatDate(c.dueDate))}</td><td class="num">${esc(inr(c.amount))}</td><td class="num">${esc(inr(c.paid + c.waived))}</td><td class="num">${esc(inr(chargeBalance(c)))}</td></tr>`
    ).
    join('') :
    '<tr><td colspan="6">No pending charges.</td></tr>';
    return `<div class="doc${idx < items.length - 1 ? ' pb' : ''}"><div class="hd"><h1>${SCHOOL_NAME}</h1><p>Statement of Pending Charges — ${esc(formatDate(todayIso()))}</p></div>
<div class="grid">${payerGridHtml(payer)}</div>
<table><thead><tr><th style="width:36px">#</th><th>Charge Head</th><th>Due Date</th><th class="num">Amount</th><th class="num">Paid / Waived</th><th class="num">Balance</th></tr></thead>
<tbody>${rows}<tr class="total"><td></td><td colspan="4">Total Due</td><td class="num">${esc(inr(total))}</td></tr></tbody></table>
<p class="note">Please pay the pending charges at the accounts counter on or before the due date.</p></div>`;
  }).
  join('')
);

export const tableHtml = (title: string, headers: string[], rows: (string | number)[][]) =>
htmlPage(
  title,
  `<div class="doc" style="max-width:1100px"><div class="hd"><h1>${SCHOOL_NAME}</h1><p>${esc(title)} — ${esc(formatDate(todayIso()))}</p></div>
<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.
  map((r) => `<tr>${r.map((c) => `<td${typeof c === 'number' ? ' class="num"' : ''}>${esc(typeof c === 'number' ? inr(c) : c)}</td>`).join('')}</tr>`).
  join('')}</tbody></table></div>`
);

/** Prints only the given document (hidden iframe) instead of the whole page. */
export function printHtml(html: string) {
  document.querySelectorAll('iframe[data-print-frame]').forEach((f) => f.remove());
  const frame = document.createElement('iframe');
  frame.setAttribute('data-print-frame', 'true');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
}

export function downloadText(fileName: string, content: string, type = 'text/html;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v: unknown) => {
  const t = String(v ?? '');
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};
export const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\n');
const safeName = (s: string) => s.replace(/[^\w-]+/g, '-');

// ---------------------------------------------------------------- small UI pieces
const initials = (name: string) =>
name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function Avatar({ name, type, size = 'md' }: {name: string;type: PayerType;size?: 'md' | 'lg';}) {
  return (
    <div
      className={`${size === 'lg' ? 'w-14 h-14 text-lg' : 'w-9 h-9 text-xs'} rounded-full flex items-center justify-center font-semibold shrink-0 ${
      type === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`
      }>

      {initials(name)}
    </div>);

}

function DueStatusBadge({ due, overdue }: {due: number;overdue: number;}) {
  if (due <= 0) return <Badge variant="success">Clear</Badge>;
  if (overdue > 0) return <Badge variant="danger">Overdue</Badge>;
  return <Badge variant="warning">Due</Badge>;
}

function chargeStatus(c: PayerCharge): {label: string;variant: 'success' | 'danger' | 'warning' | 'info' | 'default';} {
  const bal = chargeBalance(c);
  if (bal <= 0) return { label: c.waived > 0 && c.paid === 0 ? 'Waived' : 'Paid', variant: 'success' };
  if (c.dueDate < todayIso()) return { label: 'Overdue', variant: 'danger' };
  if (c.paid + c.waived > 0) return { label: 'Partial', variant: 'info' };
  return { label: 'Pending', variant: 'warning' };
}

const PAYMENT_MODES: {value: PaymentMode;label: string;}[] = [
{ value: 'Cash', label: 'Cash' },
{ value: 'Cheque', label: 'Cheque' },
{ value: 'DD', label: 'Demand Draft (DD)' },
{ value: 'Online', label: 'Online / NEFT / RTGS' },
{ value: 'UPI', label: 'UPI' },
{ value: 'Card', label: 'Debit / Credit Card' }];

const referenceLabel = (mode: PaymentMode) =>
mode === 'Cheque' ? 'Cheque Number' : mode === 'DD' ? 'DD Number' : 'Transaction Reference';

// ---------------------------------------------------------------- receipt preview (in-app)
function ReceiptPreview({ receipt, payer }: {receipt: ChargeReceiptRecord;payer: ChargePayer | undefined;}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-semibold">{SCHOOL_NAME}</p>
          <p className="text-xs text-blue-100">Charge Receipt</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-100">Receipt No.</p>
          <p className="font-semibold" data-testid="receipt-no">{receipt.receiptNo}</p>
        </div>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">{payer?.type === 'staff' ? 'Staff' : 'Student'}</p>
            <p className="font-medium text-gray-900">{payer?.name || '—'}</p>
            <p className="text-xs text-gray-500">{payer ? `${payerCode(payer)} · ${payerSubtitle(payer)}` : ''}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-gray-900">{formatDate(receipt.date)} {receipt.time}</p>
            <p className="text-xs text-gray-500">
              {receipt.paymentMode}
              {receipt.reference ? ` · ${receipt.reference}` : ''}
            </p>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Charge</th>
              <th className="px-2 py-1.5 text-right font-medium">Discount</th>
              <th className="px-2 py-1.5 text-right font-medium">Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receipt.lines.map((l, i) =>
            <tr key={i}>
                <td className="px-2 py-1.5 text-gray-800">{l.headName}</td>
                <td className="px-2 py-1.5 text-right text-green-700">{l.discount ? inr(l.discount) : '—'}</td>
                <td className="px-2 py-1.5 text-right text-gray-900">{inr(l.paid)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-green-800 font-medium">Amount Paid</span>
          <span className="text-xl font-bold text-green-700">{inr(receipt.total)}</span>
        </div>
        <p className="text-xs text-gray-500">Rupees {numberToWords(receipt.total)} Only</p>
        {receipt.remarks && <p className="text-xs text-gray-600">Remarks: {receipt.remarks}</p>}
        <p className="text-xs text-gray-400">Received by {receipt.receivedBy}</p>
      </div>
    </div>);

}

// ---------------------------------------------------------------- Add / Edit charge modal
interface ChargeFormResult {
  head: ChargeHead | undefined;
  amount: number;
  dueDate: string;
  description: string;
}

function ChargeFormModal({
  mode,
  payer,
  charge,
  onClose,
  onSave






}: {mode: 'add' | 'edit';payer: ChargePayer;charge?: PayerCharge;onClose: () => void;onSave: (result: ChargeFormResult) => void;}) {
  // Active Charge Master heads applicable to this student (class) / staff member
  const heads = useMemo(
    () =>
    getChargeHeads().filter(
      (h) =>
      h.isActive && (
      h.applicableTo === 'Both' || h.applicableTo === (payer.type === 'student' ? 'Students' : 'Staff')) && (
      payer.type === 'staff' || h.applicableClasses.includes(`Class ${payer.className}`))
    ),
    [payer]
  );
  const [headId, setHeadId] = useState(charge?.headId || '');
  const [amount, setAmount] = useState(charge ? String(charge.amount) : '');
  const [dueDate, setDueDate] = useState(charge?.dueDate || dayOffset(7));
  const [description, setDescription] = useState(charge?.description || '');
  const [error, setError] = useState('');
  const head = heads.find((h) => h.id === headId) || (charge ? getChargeHeads().find((h) => h.id === charge.headId) : undefined);
  const settled = charge ? charge.paid + charge.waived : 0;

  const pickHead = (id: string) => {
    setHeadId(id);
    const h = heads.find((x) => x.id === id);
    setAmount(h && !h.isVariable ? String(h.defaultAmount) : '');
    setError('');
  };

  const save = () => {
    const value = Number(amount);
    let msg = '';
    if (mode === 'add' && !head) msg = 'Select a charge head.';else
    if (!(value > 0)) msg = 'Enter an amount greater than 0.';else
    if (
    head?.isVariable &&
    head.minAmount !== undefined &&
    head.maxAmount !== undefined && (
    value < head.minAmount || value > head.maxAmount))

    msg = `Amount for ${head.name} must be between ${inr(head.minAmount)} and ${inr(head.maxAmount)}.`;else
    if (value < settled) msg = `Amount can't be less than the ${inr(settled)} already paid / waived.`;else
    if (!dueDate) msg = 'Select a due date.';
    setError(msg);
    if (msg) return;
    onSave({ head, amount: value, dueDate, description: description.trim() });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'add' ? `Add New Charge — ${payer.name}` : `Edit Charge — ${charge?.headName}`}
      size="lg"
      footer={
      <div className="flex items-center justify-end gap-3">
          {error &&
        <p className="mr-auto text-sm text-red-600 flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
        }
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save}>
            {mode === 'add' ?
          <>
                <Plus className="w-4 h-4" />
                Add Charge
              </> :

          <>
                <CheckCircle2 className="w-4 h-4" />
                Save Changes
              </>
          }
          </Button>
        </div>
      }>

      <div className="space-y-4">
        {mode === 'add' ?
        <Select
          label="Charge Head *"
          value={headId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => pickHead(e.target.value)}
          options={[
          { value: '', label: heads.length ? 'Select a charge from Charge Master' : 'No active charge heads applicable' },
          ...heads.map((h) => ({
            value: h.id,
            label: `${h.name} (${h.code}) — ${h.isVariable ? `${inr(h.minAmount || 0)} to ${inr(h.maxAmount || 0)}` : inr(h.defaultAmount)}`
          }))]
          } /> :


        <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Charge Head</p>
            <p className="font-medium text-gray-900">
              {charge?.headName} <span className="text-xs text-gray-500 font-mono">{charge?.headCode}</span>
            </p>
          </div>
        }

        {head &&
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p>{head.description}</p>
              <p>
                {head.category} · {head.frequency} · {head.isRefundable ? 'Refundable' : 'Non-refundable'}
                {head.isTaxable ? ` · ${head.taxPercent}% ${(head.taxType || 'GST').toUpperCase()} included in the amount` : ''}
              </p>
              <p>
                {head.isVariable ?
              `Variable amount: enter between ${inr(head.minAmount || 0)} and ${inr(head.maxAmount || 0)}` :
              `Default amount ${inr(head.defaultAmount)} — you can change it below`}
              </p>
            </div>
          </div>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount (₹) *"
            type="number"
            min={0}
            placeholder={head?.isVariable ? `${head.minAmount}–${head.maxAmount}` : 'Enter amount'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            helperText={settled > 0 ? `${inr(settled)} already paid / waived` : undefined} />

          <Input label="Due Date *" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / Remarks</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Physics lab – voltmeter damaged"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------- Collect payment modal
function PaymentModal({
  payer,
  charges: initialCharges,
  onClose,
  onConfirm






}: {payer: ChargePayer;charges: PayerCharge[];onClose: () => void;onConfirm: (input: PaymentInput) => ChargeReceiptRecord;}) {
  const [charges] = useState(initialCharges);
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [lines, setLines] = useState(() =>
  charges.map((c) => ({ chargeId: c.id, discount: '', payNow: String(chargeBalance(c)) }))
  );
  const [form, setForm] = useState({
    date: todayIso(),
    mode: 'Cash' as PaymentMode,
    reference: '',
    chequeDate: '',
    bankName: '',
    remarks: ''
  });
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<ChargeReceiptRecord | null>(null);

  const computed: PaymentLineInput[] = charges.map((c, i) => ({
    charge: c,
    discount: Math.max(0, Number(lines[i].discount) || 0),
    payNow: Math.max(0, Number(lines[i].payNow) || 0)
  }));
  const totals = computed.reduce(
    (t, l) => ({ balance: t.balance + chargeBalance(l.charge), discount: t.discount + l.discount, payNow: t.payNow + l.payNow }),
    { balance: 0, discount: 0, payNow: 0 }
  );
  const setLine = (i: number, key: 'discount' | 'payNow', value: string) =>
  setLines((prev) => prev.map((l, idx) => idx === i ? { ...l, [key]: value } : l));

  const validate = () => {
    for (let i = 0; i < charges.length; i++) {
      if (Number(lines[i].discount) < 0 || Number(lines[i].payNow) < 0) return 'Amounts cannot be negative.';
      const l = computed[i];
      if (l.discount + l.payNow > chargeBalance(l.charge) + 0.001)
      return `${l.charge.headName}: discount + amount paying (${inr(l.discount + l.payNow)}) is more than the balance ${inr(chargeBalance(l.charge))}.`;
    }
    if (totals.payNow + totals.discount <= 0) return 'Enter the amount being paid.';
    if (!form.date) return 'Select the payment date.';
    if (form.date > todayIso()) return 'Payment date cannot be in the future.';
    if (form.mode !== 'Cash' && !form.reference.trim()) return `${referenceLabel(form.mode)} is required for ${form.mode} payments.`;
    return '';
  };

  const goReview = () => {
    const msg = validate();
    setError(msg);
    if (!msg) setStep('review');
  };

  const confirm = () => {
    const r = onConfirm({ ...form, lines: computed.filter((l) => l.payNow + l.discount > 0) });
    setReceipt(r);
    setStep('success');
  };

  const title = step === 'details' ? 'Collect Payment' : step === 'review' ? 'Review Payment' : 'Payment Successful';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`${title} — ${payer.name}`}
      size="xl"
      footer={
      <div className="flex items-center justify-between gap-3">
          {step === 'details' &&
        <>
              {error ?
          <p className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </p> :

          <span />
          }
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={goReview}>
                  Review Payment
                </Button>
              </div>
            </>
        }
          {step === 'review' &&
        <>
              <Button variant="outline" onClick={() => setStep('details')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button variant="primary" onClick={confirm}>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Payment
              </Button>
            </>
        }
          {step === 'success' && receipt &&
        <>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => printHtml(chargeReceiptHtml(receipt, payer))}>
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </Button>
                <Button
              variant="outline"
              onClick={() => downloadText(`Charge-Receipt-${safeName(receipt.receiptNo)}.html`, chargeReceiptHtml(receipt, payer))}>

                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </>
        }
        </div>
      }>

      {step === 'details' &&
      <div className="space-y-5">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Charge</th>
                  <th className="px-3 py-2 text-right font-medium">Balance</th>
                  <th className="px-3 py-2 text-right font-medium w-32">Discount (₹)</th>
                  <th className="px-3 py-2 text-right font-medium w-36">Paying Now (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {charges.map((c, i) =>
              <tr key={c.id}>
                    <td className="px-3 py-2">
                      <p className="text-gray-900">{c.headName}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(c.dueDate)}</p>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">{inr(chargeBalance(c))}</td>
                    <td className="px-3 py-2">
                      <input
                    type="number"
                    min={0}
                    aria-label={`Discount for ${c.headName}`}
                    value={lines[i].discount}
                    placeholder="0"
                    onChange={(e) => setLine(i, 'discount', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </td>
                    <td className="px-3 py-2">
                      <input
                    type="number"
                    min={0}
                    aria-label={`Paying now for ${c.headName}`}
                    value={lines[i].payNow}
                    onChange={(e) => setLine(i, 'payNow', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-blue-50 font-medium">
                <tr>
                  <td className="px-3 py-2 text-gray-700">Total</td>
                  <td className="px-3 py-2 text-right">{inr(totals.balance)}</td>
                  <td className="px-3 py-2 text-right text-green-700">{inr(totals.discount)}</td>
                  <td className="px-3 py-2 text-right text-blue-700" data-testid="paying-total">
                    {inr(totals.payNow)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
            label="Payment Date *"
            type="date"
            max={todayIso()}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />

            <Select
            label="Payment Mode *"
            value={form.mode}
            options={PAYMENT_MODES}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, mode: e.target.value as PaymentMode, reference: '', chequeDate: '', bankName: '' })
            } />

          </div>
          {form.mode !== 'Cash' &&
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
            label={`${referenceLabel(form.mode)} *`}
            value={form.reference}
            placeholder={form.mode === 'UPI' ? 'e.g. UPI-4587123' : 'Enter reference'}
            onChange={(e) => setForm({ ...form, reference: e.target.value })} />

              {(form.mode === 'Cheque' || form.mode === 'DD') &&
          <Input
            label={`${form.mode} Date`}
            type="date"
            value={form.chequeDate}
            onChange={(e) => setForm({ ...form, chequeDate: e.target.value })} />

          }
              <Input
            label="Bank Name"
            value={form.bankName}
            placeholder="e.g. HDFC Bank"
            onChange={(e) => setForm({ ...form, bankName: e.target.value })} />

            </div>
        }
          <Input
          label="Remarks (optional)"
          value={form.remarks}
          placeholder="Any note for this payment"
          onChange={(e) => setForm({ ...form, remarks: e.target.value })} />

        </div>
      }

      {step === 'review' &&
      <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar name={payer.name} type={payer.type} />
            <div>
              <p className="font-medium text-gray-900">{payer.name}</p>
              <p className="text-xs text-gray-500">
                {payerCode(payer)} · {payerSubtitle(payer)}
              </p>
            </div>
          </div>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Charge</th>
                <th className="px-3 py-2 text-right font-medium">Discount</th>
                <th className="px-3 py-2 text-right font-medium">Paying Now</th>
                <th className="px-3 py-2 text-right font-medium">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {computed.
            filter((l) => l.payNow + l.discount > 0).
            map((l) =>
            <tr key={l.charge.id}>
                    <td className="px-3 py-2">{l.charge.headName}</td>
                    <td className="px-3 py-2 text-right text-green-700">{l.discount ? inr(l.discount) : '—'}</td>
                    <td className="px-3 py-2 text-right">{inr(l.payNow)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {inr(chargeBalance(l.charge) - l.discount - l.payNow)}
                    </td>
                  </tr>
            )}
            </tbody>
            <tfoot className="bg-blue-50">
              <tr>
                <td className="px-3 py-2 font-medium" colSpan={2}>
                  Total Payable
                </td>
                <td className="px-3 py-2 text-right text-lg font-bold text-blue-700">{inr(totals.payNow)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg text-sm">
            <div>
              <span className="text-gray-500">Payment Mode:</span> {form.mode}
            </div>
            <div>
              <span className="text-gray-500">Date:</span> {formatDate(form.date)}
            </div>
            {form.reference &&
          <div>
                <span className="text-gray-500">{referenceLabel(form.mode)}:</span> {form.reference}
              </div>
          }
            {form.bankName &&
          <div>
                <span className="text-gray-500">Bank:</span> {form.bankName}
              </div>
          }
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            Please verify the details. A receipt will be generated and the charges will be updated.
          </div>
        </div>
      }

      {step === 'success' && receipt &&
      <div className="space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Receipt {receipt.receiptNo} generated</p>
          </div>
          <ReceiptPreview receipt={receipt} payer={payer} />
        </div>
      }
    </Modal>);

}

// ---------------------------------------------------------------- filters
const EMPTY_STUDENT_FILTERS = { masterFranchise: '', branch: '', className: '', section: '', grNo: '', search: '' };
const EMPTY_STAFF_FILTERS = { masterFranchise: '', branch: '', department: '', designation: '', staffType: '', empCode: '', search: '' };
type DuesFilter = 'with' | 'charged' | 'all' | 'clear';

const branchOptionsFor = (mf: string) => BRANCHES.filter((b) => !mf || FRANCHISE_OF_BRANCH[b] === mf);
const textMatch = (fields: string[], query: string) => {
  const q = query.trim().toLowerCase();
  return !q || fields.some((f) => f.toLowerCase().includes(q));
};

// ============================================================ MAIN COMPONENT
export function ChargeReceipt() {
  const location = useLocation();
  const chargeReceiptMode = (location.state as { chargeReceiptMode?: string } | null)?.chargeReceiptMode;
  const postingMode = chargeReceiptMode === 'post-new-charge';
  const collectMode = chargeReceiptMode === 'collect-charge';
  // shared ledger → local state (synced back so Charge Receipt Import and later visits see changes)
  const [charges, setCharges] = useState<PayerCharge[]>(() => ledger.charges);
  const [receipts, setReceipts] = useState<ChargeReceiptRecord[]>(() => ledger.receipts);
  const [reminders, setReminders] = useState(() => ledger.reminders);
  useEffect(() => {
    ledger.charges = charges;
  }, [charges]);
  useEffect(() => {
    ledger.receipts = receipts;
  }, [receipts]);
  useEffect(() => {
    ledger.reminders = reminders;
  }, [reminders]);

  const [payerType, setPayerType] = useState<PayerType>('student');
  const [studentFilters, setStudentFilters] = useState(EMPTY_STUDENT_FILTERS);
  const [staffFilters, setStaffFilters] = useState(EMPTY_STAFF_FILTERS);
  const [duesFilter, setDuesFilter] = useState<DuesFilter>(postingMode ? 'all' : collectMode ? 'charged' : 'with');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePayerId, setActivePayerId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'pending' | 'history'>('pending');
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
  const [chargeModal, setChargeModal] = useState<{mode: 'add' | 'edit';chargeId?: string;} | null>(null);
  const [deleteChargeId, setDeleteChargeId] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<ChargeReceiptRecord | null>(null);
  const [bulkCollectOpen, setBulkCollectOpen] = useState(false);
  const [notice, setNotice] = useState<{type: 'success' | 'info';text: string;} | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  // ---------------- per-payer summary
  const summaries = useMemo(() => {
    const map: Record<string, PayerSummary> = {};
    ALL_CHARGE_PAYERS.forEach((p) => {
      map[p.id] = { pending: [], due: 0, overdue: 0, lastPayment: null, receipts: 0 };
    });
    const today = todayIso();
    charges.forEach((c) => {
      const s = map[c.payerId];
      const bal = chargeBalance(c);
      if (!s || bal <= 0) return;
      s.pending.push(c);
      s.due += bal;
      if (c.dueDate < today) s.overdue += bal;
    });
    receipts.forEach((r) => {
      const s = map[r.payerId];
      if (!s) return;
      s.receipts += 1;
      if (!s.lastPayment || r.date > s.lastPayment) s.lastPayment = r.date;
    });
    Object.values(map).forEach((s) => s.pending.sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
    return map;
  }, [charges, receipts]);

  // ---------------- list
  const listRows = useMemo(() => {
    const base: ChargePayer[] = payerType === 'student' ? CHARGE_STUDENTS : CHARGE_STAFF;
    const rows = base.filter((p) => {
      const s = summaries[p.id];
      if (duesFilter === 'with' && s.due <= 0) return false;
      if (duesFilter === 'charged' && !charges.some((charge) => charge.payerId === p.id)) return false;
      if (duesFilter === 'clear' && s.due > 0) return false;
      if (p.type === 'student') {
        const f = studentFilters;
        if (f.masterFranchise && FRANCHISE_OF_BRANCH[p.branch] !== f.masterFranchise) return false;
        if (f.branch && p.branch !== f.branch) return false;
        if (f.className && p.className !== f.className) return false;
        if (f.section && p.section !== f.section) return false;
        if (f.grNo.trim() && !p.grNo.toLowerCase().includes(f.grNo.trim().toLowerCase())) return false;
        return textMatch(
          [p.name, p.grNo, p.admissionNo, p.rollNo, p.fatherName, p.motherName, p.phone, p.email, p.branch,
          `Class ${p.className}-${p.section}`, `${p.className}${p.section}`],
          f.search
        );
      }
      const f = staffFilters;
      if (f.masterFranchise && FRANCHISE_OF_BRANCH[p.branch] !== f.masterFranchise) return false;
      if (f.branch && p.branch !== f.branch) return false;
      if (f.department && p.department !== f.department) return false;
      if (f.designation && p.designation !== f.designation) return false;
      if (f.staffType && p.staffType !== f.staffType) return false;
      if (f.empCode.trim() && !p.empCode.toLowerCase().includes(f.empCode.trim().toLowerCase())) return false;
      return textMatch([p.name, p.empCode, p.department, p.designation, p.staffType, p.phone, p.email, p.branch], f.search);
    });
    return rows.sort((a, b) => summaries[b.id].due - summaries[a.id].due || a.name.localeCompare(b.name));
  }, [payerType, studentFilters, staffFilters, duesFilter, summaries, charges]);

  const listTotalDue = listRows.reduce((s, p) => s + summaries[p.id].due, 0);
  const selectedRows = listRows.filter((p) => selectedIds.includes(p.id));
  const typeWord = payerType === 'student' ? 'student' : 'staff member';

  const switchType = (t: PayerType) => {
    setPayerType(t);
    setSelectedIds([]);
  };
  const resetFilters = () => {
    setStudentFilters(EMPTY_STUDENT_FILTERS);
    setStaffFilters(EMPTY_STAFF_FILTERS);
    setDuesFilter(postingMode ? 'all' : collectMode ? 'charged' : 'with');
    setSelectedIds([]);
  };
  const setStudentFilter = (key: keyof typeof EMPTY_STUDENT_FILTERS, value: string) =>
  setStudentFilters((prev) => {
    const next = { ...prev, [key]: value };
    if (key === 'masterFranchise' && next.branch && !branchOptionsFor(value).includes(next.branch)) next.branch = '';
    return next;
  });
  const setStaffFilter = (key: keyof typeof EMPTY_STAFF_FILTERS, value: string) =>
  setStaffFilters((prev) => {
    const next = { ...prev, [key]: value };
    if (key === 'masterFranchise' && next.branch && !branchOptionsFor(value).includes(next.branch)) next.branch = '';
    if (key === 'department') next.designation = '';
    return next;
  });

  const toggleRow = (id: string) =>
  setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const allRowsSelected = listRows.length > 0 && listRows.every((p) => selectedIds.includes(p.id));
  const toggleAllRows = () => setSelectedIds(allRowsSelected ? [] : listRows.map((p) => p.id));

  // ---------------- actions (list + detail)
  const sendReminders = (payers: ChargePayer[]) => {
    const withDues = payers.filter((p) => summaries[p.id].due > 0);
    if (!withDues.length) {
      setNotice({ type: 'info', text: 'No pending charges — no reminder needed.' });
      return;
    }
    const today = todayIso();
    setReminders((prev) => {
      const next = { ...prev };
      withDues.forEach((p) => {
        next[p.id] = { count: (prev[p.id]?.count || 0) + 1, last: today };
      });
      return next;
    });
    const first = withDues[0];
    const to = first.type === 'student' ? `${first.fatherName} (${first.phone})` : `${first.name} (${first.phone})`;
    setNotice({
      type: 'success',
      text:
      withDues.length === 1 ?
      `Reminder sent to ${to} for ${inr(summaries[first.id].due)} pending.` :
      `Reminders sent to ${withDues.length} ${first.type === 'student' ? 'parents' : 'staff members'} for pending charges.`
    });
  };

  const exportList = (rows: ChargePayer[]) => {
    const header =
    payerType === 'student' ?
    ['GR No', 'Admission No', 'Student Name', 'Class', 'Section', 'Branch', 'Master Franchise', 'Father Name', 'Phone', 'Pending Charges', 'Total Due', 'Overdue', 'Last Payment'] :
    ['Employee Code', 'Staff Name', 'Department', 'Designation', 'Staff Type', 'Branch', 'Master Franchise', 'Phone', 'Email', 'Pending Charges', 'Total Due', 'Overdue', 'Last Payment'];
    const data = rows.map((p) => {
      const s = summaries[p.id];
      const tail = [s.pending.length, s.due, s.overdue, s.lastPayment || ''];
      return p.type === 'student' ?
      [p.grNo, p.admissionNo, p.name, p.className, p.section, p.branch, FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[p.branch]], p.fatherName, p.phone, ...tail] :
      [p.empCode, p.name, p.department, p.designation, p.staffType, p.branch, FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[p.branch]], p.phone, p.email, ...tail];
    });
    downloadText(`charge-dues-${payerType}-${todayIso()}.csv`, toCsv([header, ...data]), 'text/csv;charset=utf-8');
  };

  const printList = () => {
    const header =
    payerType === 'student' ?
    ['GR No', 'Student', 'Class', 'Branch', 'Father / Phone', 'Pending', 'Total Due', 'Last Payment'] :
    ['Emp Code', 'Staff', 'Department', 'Branch', 'Phone', 'Pending', 'Total Due', 'Last Payment'];
    const rows = listRows.map((p) => {
      const s = summaries[p.id];
      return p.type === 'student' ?
      [p.grNo, p.name, `${p.className}-${p.section}`, p.branch, `${p.fatherName} / ${p.phone}`, String(s.pending.length), s.due, formatDate(s.lastPayment)] :
      [p.empCode, p.name, `${p.department} (${p.designation})`, p.branch, p.phone, String(s.pending.length), s.due, formatDate(s.lastPayment)];
    });
    printHtml(tableHtml(`Pending Charges — ${payerType === 'student' ? 'Students' : 'Staff'}`, header, rows));
  };

  const printStatements = (payers: ChargePayer[]) =>
  printHtml(statementHtml(payers.map((p) => ({ payer: p, pending: summaries[p.id].pending }))));

  const openPayer = (id: string, tab: 'pending' | 'history' = 'pending') => {
    setActivePayerId(id);
    setDetailTab(tab);
    setSelectedChargeIds([]);
  };
  const backToList = () => {
    setActivePayerId(null);
    setSelectedChargeIds([]);
  };

  // ---------------- detail data
  const activePayer = activePayerId ? ALL_CHARGE_PAYERS.find((p) => p.id === activePayerId) || null : null;
  const activeSummary = activePayer ? summaries[activePayer.id] : null;
  const pendingCharges = activeSummary ? activeSummary.pending : [];
  const payerCharges = activePayer ? charges.filter((c) => c.payerId === activePayer.id) : [];
  const payerReceipts = activePayer ? receipts.filter((r) => r.payerId === activePayer.id) : [];
  const detailTotals = payerCharges.reduce(
    (t, c) => ({ charged: t.charged + c.amount, paid: t.paid + c.paid, waived: t.waived + c.waived, due: t.due + chargeBalance(c) }),
    { charged: 0, paid: 0, waived: 0, due: 0 }
  );
  const selectedCharges = pendingCharges.filter((c) => selectedChargeIds.includes(c.id));
  const selectedDue = selectedCharges.reduce((s, c) => s + chargeBalance(c), 0);
  const allChargesSelected = pendingCharges.length > 0 && pendingCharges.every((c) => selectedChargeIds.includes(c.id));
  const editingCharge = chargeModal?.chargeId ? charges.find((c) => c.id === chargeModal.chargeId) : undefined;
  const chargeToDelete = deleteChargeId ? charges.find((c) => c.id === deleteChargeId) : undefined;
  const today = todayIso();

  const saveCharge = (result: ChargeFormResult) => {
    if (!activePayer || !chargeModal) return;
    if (chargeModal.mode === 'add' && result.head) {
      const head = result.head;
      const newCharge: PayerCharge = {
        id: `CHG-${Date.now()}`,
        payerId: activePayer.id,
        headId: head.id,
        headName: head.name,
        headCode: head.code,
        category: head.category,
        description: result.description || head.description,
        amount: result.amount,
        paid: 0,
        waived: 0,
        dueDate: result.dueDate,
        createdOn: todayIso(),
        createdBy: CASHIER
      };
      setCharges((prev) => [...prev, newCharge]);
      setNotice({ type: 'success', text: `${head.name} (${inr(result.amount)}) added for ${activePayer.name}.` });
    } else if (chargeModal.mode === 'edit' && chargeModal.chargeId) {
      const id = chargeModal.chargeId;
      setCharges((prev) =>
      prev.map((c) => c.id === id ? { ...c, amount: result.amount, dueDate: result.dueDate, description: result.description } : c)
      );
      setNotice({ type: 'success', text: `Charge updated — new amount ${inr(result.amount)}.` });
    }
    setDetailTab('pending');
    setChargeModal(null);
  };

  const confirmDelete = () => {
    if (!chargeToDelete) return;
    setCharges((prev) => prev.filter((c) => c.id !== chargeToDelete.id));
    setSelectedChargeIds((prev) => prev.filter((id) => id !== chargeToDelete.id));
    setNotice({ type: 'success', text: `${chargeToDelete.headName} (${inr(chargeToDelete.amount)}) deleted.` });
    setDeleteChargeId(null);
  };

  const confirmPayment = (input: PaymentInput): ChargeReceiptRecord => {
    const payerId = activePayer ? activePayer.id : '';
    const receipt: ChargeReceiptRecord = {
      id: `RCPT-${Date.now()}`,
      receiptNo: nextChargeReceiptNo(),
      payerId,
      date: input.date,
      time: nowTime(),
      lines: input.lines.map((l) => ({
        chargeId: l.charge.id,
        headName: l.charge.headName,
        headCode: l.charge.headCode,
        chargeAmount: l.charge.amount,
        discount: l.discount,
        paid: l.payNow
      })),
      total: input.lines.reduce((s, l) => s + l.payNow, 0),
      discountTotal: input.lines.reduce((s, l) => s + l.discount, 0),
      paymentMode: input.mode,
      reference: input.reference.trim(),
      bankName: input.bankName.trim(),
      chequeDate: input.chequeDate || undefined,
      remarks: input.remarks.trim(),
      receivedBy: CASHIER,
      source: 'counter'
    };
    setCharges((prev) =>
    prev.map((c) => {
      const l = input.lines.find((x) => x.charge.id === c.id);
      return l ? { ...c, paid: c.paid + l.payNow, waived: c.waived + l.discount } : c;
    })
    );
    setReceipts((prev) => [receipt, ...prev]);
    setSelectedChargeIds([]);
    return receipt;
  };

  const payerOf = (r: ChargeReceiptRecord) => ALL_CHARGE_PAYERS.find((p) => p.id === r.payerId);

  /** Bulk collection (#16): many payers paid in one go — one receipt per payer. */
  const confirmBulkCollect = (
  records: ChargeReceiptRecord[],
  allocations: {chargeId: string;paid: number;discount: number;}[]) =>
  {
    if (!records.length) return;
    setReceipts((prev) => [...records, ...prev]);
    setCharges((prev) =>
    prev.map((c) => {
      const a = allocations.find((x) => x.chargeId === c.id);
      return a ? { ...c, paid: c.paid + a.paid, waived: c.waived + a.discount } : c;
    })
    );
    setSelectedIds([]);
    setSelectedChargeIds([]);
    setNotice({
      type: 'success',
      text: `${records.length} charge receipt(s) generated for ${records.length} payer(s) — collected ${inr(
        records.reduce((s, r) => s + r.total, 0)
      )} via ${records[0].paymentMode}.`
    });
  };

  // ============================================================ RENDER
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Charge Receipt
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Students and staff who have to pay charges — collect payments, add, edit or delete charges
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Session {sessionLabel()}
          </Badge>
          {!activePayer &&
          <>
              <Button variant="outline" onClick={() => exportList(listRows)} disabled={!listRows.length}>
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" onClick={printList} disabled={!listRows.length}>
                <Printer className="w-4 h-4" />
                Print List
              </Button>
            </>
          }
        </div>
      </div>

      {postingMode && !activePayer &&
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Select a student below to add a new charge. The list is showing all students so you can choose who the charge applies to.
      </div>
      }
      {collectMode && !activePayer &&
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        Showing students who have at least one charge applied, including charges that have already been settled.
      </div>
      }
      {notice &&
      <div
        role="status"
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm ${
        notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`
        }>

          <span className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            {notice.text}
          </span>
          <button onClick={() => setNotice(null)} className="p-1 rounded hover:bg-black/5" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* ======================================================= LIST VIEW */}
      {!activePayer &&
      <>
          {/* Filters */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
              label="Search For"
              value={payerType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => switchType(e.target.value as PayerType)}
              options={[
              { value: 'student', label: 'Student' },
              { value: 'staff', label: 'Staff' }]
              } />

              <div className="md:col-span-3">
                <Input
                label={payerType === 'student' ? 'Search Student' : 'Search Staff'}
                placeholder={
                payerType === 'student' ?
                'Search by name, GR no, admission no, roll no, class, parent name, phone or email' :
                'Search by name, employee code, department, designation, phone or email'
                }
                value={payerType === 'student' ? studentFilters.search : staffFilters.search}
                onChange={(e) =>
                payerType === 'student' ? setStudentFilter('search', e.target.value) : setStaffFilter('search', e.target.value)
                }
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
              {payerType === 'student' ?
            <>
                  <Select
                label="Master Franchise"
                value={studentFilters.masterFranchise}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStudentFilter('masterFranchise', e.target.value)}
                options={[{ value: '', label: 'All' }, { value: 'MF1', label: 'MF 1' }, { value: 'MF2', label: 'MF 2' }]} />

                  <Select
                label="Branch"
                value={studentFilters.branch}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStudentFilter('branch', e.target.value)}
                options={[{ value: '', label: 'All Branches' }, ...branchOptionsFor(studentFilters.masterFranchise).map((b) => ({ value: b, label: b }))]} />

                  <Select
                label="Class"
                value={studentFilters.className}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStudentFilter('className', e.target.value)}
                options={[{ value: '', label: 'All Classes' }, ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))]} />

                  <Select
                label="Section"
                value={studentFilters.section}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStudentFilter('section', e.target.value)}
                options={[{ value: '', label: 'All Sections' }, ...SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))]} />

                  <Input
                label="GR No"
                placeholder="e.g. GR-1001"
                value={studentFilters.grNo}
                onChange={(e) => setStudentFilter('grNo', e.target.value)} />

                </> :

            <>
                  <Select
                label="Master Franchise"
                value={staffFilters.masterFranchise}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffFilter('masterFranchise', e.target.value)}
                options={[{ value: '', label: 'All' }, { value: 'MF1', label: 'MF 1' }, { value: 'MF2', label: 'MF 2' }]} />

                  <Select
                label="Branch"
                value={staffFilters.branch}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffFilter('branch', e.target.value)}
                options={[{ value: '', label: 'All Branches' }, ...branchOptionsFor(staffFilters.masterFranchise).map((b) => ({ value: b, label: b }))]} />

                  <Select
                label="Department"
                value={staffFilters.department}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffFilter('department', e.target.value)}
                options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />

                  <Select
                label="Designation"
                value={staffFilters.designation}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffFilter('designation', e.target.value)}
                options={[
                { value: '', label: 'All Designations' },
                ...Array.from(
                  new Set(
                    CHARGE_STAFF.filter((s) => !staffFilters.department || s.department === staffFilters.department).map(
                      (s) => s.designation
                    )
                  )
                ).
                sort().
                map((d) => ({ value: d, label: d }))]
                } />

                  <Select
                label="Staff Type"
                value={staffFilters.staffType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffFilter('staffType', e.target.value)}
                options={[{ value: '', label: 'All Types' }, { value: 'Teaching', label: 'Teaching' }, { value: 'Non-Teaching', label: 'Non-Teaching' }]} />

                  <Input
                label="Employee Code"
                placeholder="e.g. EMP-1001"
                value={staffFilters.empCode}
                onChange={(e) => setStaffFilter('empCode', e.target.value)} />

                </>
            }
              <Select
              label="Dues"
              value={duesFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDuesFilter(e.target.value as DuesFilter)}
              options={[
              { value: 'with', label: 'Has Pending Charges' },
              { value: 'charged', label: 'Has Charges Applied' },
              { value: 'all', label: 'All' },
              { value: 'clear', label: 'No Pending Charges' }]
              } />

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600" data-testid="result-summary">
                {listRows.length} {payerType === 'student' ? 'student' : 'staff'}
                {payerType === 'student' && listRows.length !== 1 ? 's' : ''} found · Total due{' '}
                <span className="font-semibold text-red-600">{inr(listTotalDue)}</span>
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Bulk actions */}
          {selectedRows.length > 0 &&
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                {selectedRows.length} {typeWord}
                {selectedRows.length > 1 && payerType === 'student' ? 's' : ''} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                variant="primary"
                size="sm"
                onClick={() => setBulkCollectOpen(true)}
                title="Collect from all selected payers and generate receipts together">
                  <Users className="w-4 h-4" />
                  Bulk Collect ({selectedRows.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => printStatements(selectedRows)}>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportList(selectedRows)}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => sendReminders(selectedRows)}>
                  <Bell className="w-4 h-4" />
                  Send Reminder
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
        }

          {/* List */}
          <Card noPadding className="overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              {payerType === 'student' ?
            <GraduationCap className="w-4 h-4 text-blue-600" /> :

            <Briefcase className="w-4 h-4 text-purple-600" />
            }
              <h3 className="font-semibold text-gray-800">
                {postingMode ? `${payerType === 'student' ? 'Students' : 'Staff'} — Select to Post a Charge` : collectMode ? `${payerType === 'student' ? 'Students' : 'Staff'} with Charges Applied` : `${payerType === 'student' ? 'Students' : 'Staff'} with charges`}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left" data-testid="payer-table">
                <thead className="bg-gray-100 text-gray-600 border-b">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={allRowsSelected}
                      onChange={toggleAllRows}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                    </th>
                    <th className="px-4 py-3 font-medium">{payerType === 'student' ? 'GR No' : 'Emp Code'}</th>
                    <th className="px-4 py-3 font-medium">{payerType === 'student' ? 'Student' : 'Staff'}</th>
                    <th className="px-4 py-3 font-medium">{payerType === 'student' ? 'Class' : 'Department'}</th>
                    <th className="px-4 py-3 font-medium">Branch</th>
                    <th className="px-4 py-3 font-medium">{payerType === 'student' ? 'Parent / Contact' : 'Contact'}</th>
                    <th className="px-4 py-3 font-medium text-center">Pending</th>
                    <th className="px-4 py-3 font-medium text-right">Total Due</th>
                    <th className="px-4 py-3 font-medium">Last Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listRows.map((p) => {
                  const s = summaries[p.id];
                  const rem = reminders[p.id];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50" data-payer={p.id}>
                        <td className="px-4 py-3">
                          <input
                          type="checkbox"
                          aria-label={`Select ${p.name}`}
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleRow(p.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{payerCode(p)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={p.name} type={p.type} />
                            <div>
                              <p className="font-medium text-gray-900" data-testid="payer-name">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {p.type === 'student' ? `Adm ${p.admissionNo} · Roll ${p.rollNo}` : `${p.designation} · ${p.staffType}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {p.type === 'student' ? `${p.className}-${p.section}` : p.department}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-900">{p.branch}</p>
                          <p className="text-xs text-gray-500">{FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[p.branch]]}</p>
                        </td>
                        <td className="px-4 py-3">
                          {p.type === 'student' && <p className="text-gray-900">{p.fatherName}</p>}
                          <p className="text-xs text-blue-600">{p.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                          className={`inline-flex min-w-[1.75rem] justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          s.pending.length ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`
                          }>

                            {s.pending.length}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-red-600" data-testid="payer-due">
                          {inr(s.due)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(s.lastPayment)}</td>
                        <td className="px-4 py-3">
                          <DueStatusBadge due={s.due} overdue={s.overdue} />
                          {rem &&
                        <p className="text-[11px] text-gray-400 mt-1">
                              {rem.count} reminder{rem.count > 1 ? 's' : ''} · {formatDate(rem.last)}
                            </p>
                        }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="primary" size="xs" onClick={() => { openPayer(p.id); if (postingMode) setChargeModal({ mode: 'add' }); }}>
                              {postingMode ? <Plus className="w-3.5 h-3.5" /> : <IndianRupee className="w-3.5 h-3.5" />}
                              {postingMode ? 'Add Charge' : collectMode && s.due <= 0 ? 'View Charges' : 'Collect Payment'}
                            </Button>
                            <Button variant="ghost" size="xs" title="Receipt history" onClick={() => openPayer(p.id, 'history')}>
                              <History className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="xs"
                            title="Send reminder"
                            disabled={s.due <= 0}
                            onClick={() => sendReminders([p])}>

                              <Bell className="w-4 h-4 text-orange-500" />
                            </Button>
                            <Button variant="ghost" size="xs" title="Print statement" onClick={() => printStatements([p])}>
                              <Printer className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
                {listRows.length > 0 &&
              <tfoot className="bg-gray-50 border-t">
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-right font-medium text-gray-700">
                        Total ({listRows.length})
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {listRows.reduce((n, p) => n + summaries[p.id].pending.length, 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600" data-testid="list-total">
                        {inr(listTotalDue)}
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
              }
              </table>
            </div>
            {listRows.length === 0 &&
          <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No {payerType === 'student' ? 'students' : 'staff'} found</p>
                <p className="text-sm">Try changing the filters, or choose “All” under Dues.</p>
              </div>
          }
          </Card>
        </>
      }

      {/* ============================================ GENERATED RECEIPTS REGISTER (#16) */}
      {!activePayer &&
      <GeneratedReceiptsSection
        receipts={receipts}
        onView={(r) => setViewReceipt(r)}
        onPrint={(r) => printHtml(chargeReceiptHtml(r, payerOf(r)))}
        onDownload={(r) =>
        downloadText(`Charge-Receipt-${safeName(r.receiptNo)}.html`, chargeReceiptHtml(r, payerOf(r)))
        } />

      }

      {/* ======================================================= DETAIL VIEW */}
      {activePayer && activeSummary &&
      <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" onClick={backToList}>
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => sendReminders([activePayer])} disabled={activeSummary.due <= 0}>
                <Bell className="w-4 h-4" />
                Send Reminder
              </Button>
              <Button variant="outline" onClick={() => printStatements([activePayer])}>
                <Printer className="w-4 h-4" />
                Print Statement
              </Button>
            </div>
          </div>

          {/* Payer info */}
          <Card>
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Avatar name={activePayer.name} type={activePayer.type} size="lg" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900" data-testid="detail-name">
                      {activePayer.name}
                    </h2>
                    <Badge variant={activePayer.type === 'student' ? 'primary' : 'secondary'}>
                      {activePayer.type === 'student' ? 'Student' : 'Staff'}
                    </Badge>
                    <Badge variant="success">{activePayer.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {activePayer.type === 'student' ?
                  `GR No ${activePayer.grNo} · Adm No ${activePayer.admissionNo} · Class ${activePayer.className}-${activePayer.section} · Roll ${activePayer.rollNo}` :
                  `Emp Code ${activePayer.empCode} · ${activePayer.designation} · ${activePayer.staffType}`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {activePayer.branch} ({FRANCHISE_LABEL[FRANCHISE_OF_BRANCH[activePayer.branch]]})
                    </span>
                    {activePayer.type === 'student' ?
                  <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        {activePayer.fatherName} / {activePayer.motherName}
                      </span> :

                  <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {activePayer.department}
                      </span>
                  }
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {activePayer.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {activePayer.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-[460px]">
                {[
              { label: 'Total Charged', value: detailTotals.charged, cls: 'text-gray-900' },
              { label: 'Paid', value: detailTotals.paid, cls: 'text-green-600' },
              { label: 'Waived', value: detailTotals.waived, cls: 'text-blue-600' },
              { label: 'Balance Due', value: detailTotals.due, cls: 'text-red-600' }].
              map((t) =>
              <div key={t.label} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">{t.label}</p>
                    <p className={`text-lg font-bold ${t.cls}`} data-testid={`tile-${t.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {inr(t.value)}
                    </p>
                  </div>
              )}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card noPadding>
            <div className="flex border-b border-gray-200 px-4">
              {[
            { id: 'pending' as const, label: 'Pending Charges', count: pendingCharges.length, icon: FileText },
            { id: 'history' as const, label: 'Receipt History', count: payerReceipts.length, icon: History }].
            map((t) =>
            <button
              key={t.id}
              onClick={() => setDetailTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              detailTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

                  <t.icon className="w-4 h-4" />
                  {t.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${detailTab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {t.count}
                  </span>
                </button>
            )}
            </div>

            {detailTab === 'pending' &&
          <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    {selectedCharges.length ?
                <>
                        <span className="font-medium text-gray-900">{selectedCharges.length} selected</span> ·{' '}
                        <span className="font-semibold text-blue-700">{inr(selectedDue)}</span>
                      </> :

                'Select the charges to collect'}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setChargeModal({ mode: 'add' })}>
                      <Plus className="w-4 h-4" />
                      Add New Charge
                    </Button>
                    <Button variant="primary" disabled={!selectedCharges.length} onClick={() => setPaymentOpen(true)}>
                      <Wallet className="w-4 h-4" />
                      Collect Payment
                    </Button>
                  </div>
                </div>

                {pendingCharges.length > 0 ?
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm" data-testid="charges-table">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-3 py-2.5 w-10">
                            <input
                        type="checkbox"
                        aria-label="Select all charges"
                        checked={allChargesSelected}
                        onChange={() => setSelectedChargeIds(allChargesSelected ? [] : pendingCharges.map((c) => c.id))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                          </th>
                          <th className="px-3 py-2.5 text-left font-medium">Charge Head</th>
                          <th className="px-3 py-2.5 text-left font-medium">Category</th>
                          <th className="px-3 py-2.5 text-left font-medium">Due Date</th>
                          <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                          <th className="px-3 py-2.5 text-right font-medium">Paid / Waived</th>
                          <th className="px-3 py-2.5 text-right font-medium">Balance</th>
                          <th className="px-3 py-2.5 text-left font-medium">Status</th>
                          <th className="px-3 py-2.5 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pendingCharges.map((c) => {
                    const st = chargeStatus(c);
                    const overdueDays = c.dueDate < today ? daysBetween(c.dueDate, today) : 0;
                    const selected = selectedChargeIds.includes(c.id);
                    return (
                      <tr key={c.id} className={selected ? 'bg-blue-50/60' : 'hover:bg-gray-50'} data-charge={c.id}>
                              <td className="px-3 py-2.5">
                                <input
                            type="checkbox"
                            aria-label={`Select ${c.headName}`}
                            checked={selected}
                            onChange={() =>
                            setSelectedChargeIds((prev) =>
                            prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                            )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                              </td>
                              <td className="px-3 py-2.5">
                                <p className="text-gray-900" data-testid="charge-head">
                                  {c.headName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <span className="font-mono">{c.headCode}</span>
                                  {c.description ? ` · ${c.description}` : ''}
                                </p>
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge variant={c.category === 'Liability' ? 'warning' : 'default'}>
                                  {c.category === 'Liability' ? 'Deposit' : c.category}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5">
                                <p className="text-gray-700">{formatDate(c.dueDate)}</p>
                                {overdueDays > 0 && <p className="text-xs text-red-600">{overdueDays} days overdue</p>}
                              </td>
                              <td className="px-3 py-2.5 text-right text-gray-900" data-testid="charge-amount">
                                {inr(c.amount)}
                              </td>
                              <td className="px-3 py-2.5 text-right text-green-700">
                                {c.paid + c.waived > 0 ? inr(c.paid + c.waived) : '—'}
                              </td>
                              <td className="px-3 py-2.5 text-right font-semibold text-red-600" data-testid="charge-balance">
                                {inr(chargeBalance(c))}
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge variant={st.variant}>{st.label}</Badge>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1">
                                  <button
                              title="Edit amount"
                              onClick={() => setChargeModal({ mode: 'edit', chargeId: c.id })}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">

                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                              title={c.paid + c.waived > 0 ? 'Charges with payments cannot be deleted' : 'Delete charge'}
                              disabled={c.paid + c.waived > 0}
                              onClick={() => setDeleteChargeId(c.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>);

                  })}
                      </tbody>
                      <tfoot className="bg-gray-50 font-medium">
                        <tr>
                          <td colSpan={4} className="px-3 py-2.5 text-right text-gray-700">
                            Total
                          </td>
                          <td className="px-3 py-2.5 text-right">{inr(pendingCharges.reduce((s, c) => s + c.amount, 0))}</td>
                          <td className="px-3 py-2.5 text-right text-green-700">
                            {inr(pendingCharges.reduce((s, c) => s + c.paid + c.waived, 0))}
                          </td>
                          <td className="px-3 py-2.5 text-right text-red-600" data-testid="pending-total">
                            {inr(activeSummary.due)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div> :

            <div className="p-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                    <p className="font-medium text-gray-700">No pending charges</p>
                    <p className="text-sm">Use “Add New Charge” to raise a charge for {activePayer.name}.</p>
                  </div>
            }
              </div>
          }

            {detailTab === 'history' &&
          <div className="p-4">
                {payerReceipts.length > 0 ?
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm" data-testid="receipts-table">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-3 py-2.5 text-left font-medium">Receipt No</th>
                          <th className="px-3 py-2.5 text-left font-medium">Date</th>
                          <th className="px-3 py-2.5 text-left font-medium">Charges</th>
                          <th className="px-3 py-2.5 text-left font-medium">Mode</th>
                          <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                          <th className="px-3 py-2.5 text-left font-medium">Received By</th>
                          <th className="px-3 py-2.5 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payerReceipts.map((r) =>
                  <tr key={r.id} className="hover:bg-gray-50" data-receipt={r.receiptNo}>
                            <td className="px-3 py-2.5 font-medium text-gray-900">
                              {r.receiptNo}
                              {r.source === 'import' &&
                      <Badge variant="info" className="ml-2">
                                  Imported
                                </Badge>
                      }
                            </td>
                            <td className="px-3 py-2.5 text-gray-600">
                              {formatDate(r.date)} <span className="text-xs text-gray-400">{r.time}</span>
                            </td>
                            <td className="px-3 py-2.5 text-gray-700">{r.lines.map((l) => l.headName).join(', ')}</td>
                            <td className="px-3 py-2.5 text-gray-700">
                              {r.paymentMode}
                              {r.reference && <p className="text-xs text-gray-400">{r.reference}</p>}
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{inr(r.total)}</td>
                            <td className="px-3 py-2.5 text-gray-600">{r.receivedBy}</td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="xs" title="View receipt" onClick={() => setViewReceipt(r)}>
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                          variant="ghost"
                          size="xs"
                          title="Print receipt"
                          onClick={() => printHtml(chargeReceiptHtml(r, activePayer))}>

                                  <Printer className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                          variant="ghost"
                          size="xs"
                          title="Download receipt"
                          onClick={() =>
                          downloadText(`Charge-Receipt-${safeName(r.receiptNo)}.html`, chargeReceiptHtml(r, activePayer))
                          }>

                                  <Download className="w-4 h-4 text-gray-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                  )}
                      </tbody>
                    </table>
                  </div> :

            <div className="p-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                    <Receipt className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-gray-700">No receipts yet</p>
                    <p className="text-sm">Receipts generated for {activePayer.name} will appear here.</p>
                  </div>
            }
              </div>
          }
          </Card>
        </>
      }

      {/* ======================================================= MODALS */}
      {bulkCollectOpen &&
      <BulkCollectModal
        payers={ALL_CHARGE_PAYERS}
        charges={charges}
        initialSelectedIds={selectedIds}
        onClose={() => setBulkCollectOpen(false)}
        onConfirm={confirmBulkCollect} />

      }

      {activePayer && chargeModal &&
      <ChargeFormModal
        mode={chargeModal.mode}
        payer={activePayer}
        charge={editingCharge}
        onClose={() => setChargeModal(null)}
        onSave={saveCharge} />

      }

      {chargeToDelete &&
      <Modal
        isOpen
        onClose={() => setDeleteChargeId(null)}
        title="Delete Charge"
        size="md"
        footer={
        <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteChargeId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
        }>

          <p className="text-sm text-gray-700">
            Delete <strong>{chargeToDelete.headName}</strong> ({inr(chargeToDelete.amount)}, due {formatDate(chargeToDelete.dueDate)})
            {activePayer ? ` for ${activePayer.name}` : ''}? This cannot be undone.
          </p>
        </Modal>
      }

      {activePayer && paymentOpen &&
      <PaymentModal
        payer={activePayer}
        charges={selectedCharges}
        onClose={() => setPaymentOpen(false)}
        onConfirm={confirmPayment} />

      }

      {viewReceipt &&
      <Modal
        isOpen
        onClose={() => setViewReceipt(null)}
        title={`Receipt ${viewReceipt.receiptNo}`}
        size="lg"
        footer={
        <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => printHtml(chargeReceiptHtml(viewReceipt, payerOf(viewReceipt)))}>
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
            variant="outline"
            onClick={() =>
            downloadText(`Charge-Receipt-${safeName(viewReceipt.receiptNo)}.html`, chargeReceiptHtml(viewReceipt, payerOf(viewReceipt)))
            }>

                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="primary" onClick={() => setViewReceipt(null)}>
                Close
              </Button>
            </div>
        }>

          <ReceiptPreview receipt={viewReceipt} payer={payerOf(viewReceipt)} />
        </Modal>
      }
    </div>);

}

// ============================================================ BULK COLLECTION (#16)
/** One payer row inside the bulk collection modal. */
interface BulkRow {
  payerId: string;
  amount: string;
  discount: string;
}

const ALLOCATION_STEP = 0.01;

function BulkCollectModal({
  payers,
  charges,
  initialSelectedIds,
  onClose,
  onConfirm
}: {
  payers: ChargePayer[];
  charges: PayerCharge[];
  initialSelectedIds: string[];
  onClose: () => void;
  onConfirm: (
    records: ChargeReceiptRecord[],
    allocations: { chargeId: string; paid: number; discount: number }[]
  ) => void;
}) {
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [payerQuery, setPayerQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [rows, setRows] = useState<Record<string, BulkRow>>({});
  const [form, setForm] = useState({
    date: todayIso(),
    mode: 'Cash' as PaymentMode,
    reference: '',
    bankName: '',
    chequeDate: '',
    remarks: 'Bulk counter collection'
  });
  const [error, setError] = useState('');
  const [created, setCreated] = useState<ChargeReceiptRecord[]>([]);

  const pendingCharges = (payerId: string) =>
    charges.
    filter((c) => c.payerId === payerId && chargeBalance(c) > 0).
    sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const dueOf = (payerId: string) => pendingCharges(payerId).reduce((s, c) => s + chargeBalance(c), 0);

  const rowOf = (payerId: string): BulkRow => {
    if (rows[payerId]) return rows[payerId];
    const due = dueOf(payerId);
    return { payerId, amount: due ? String(Math.round(due * 100) / 100) : '0', discount: '0' };
  };

  const setRow = (payerId: string, patch: Partial<BulkRow>) =>
  setRows((prev) => ({ ...prev, [payerId]: { ...rowOf(payerId), ...patch } }));

  const togglePayer = (payerId: string) => {
    setSelectedIds((prev) =>
    prev.includes(payerId) ? prev.filter((id) => id !== payerId) : [...prev, payerId]
    );
    setRows((prev) =>
    prev[payerId] ?
    prev :
    {
      ...prev,
      [payerId]: {
        payerId,
        amount: String(Math.round(dueOf(payerId) * 100) / 100),
        discount: '0'
      }
    }
    );
  };

  /** Splits one payer's collection across the oldest pending charges first. */
  const allocate = (payerId: string, pay: number, disc: number): ReceiptLine[] => {
    let remainingPay = Math.round(pay * 100) / 100;
    let remainingDisc = Math.round(disc * 100) / 100;
    const lines: ReceiptLine[] = [];
    pendingCharges(payerId).forEach((c) => {
      if (remainingPay <= 0 && remainingDisc <= 0) return;
      const bal = chargeBalance(c);
      const d = Math.max(0, Math.min(bal, remainingDisc));
      const p = Math.max(0, Math.min(bal - d, remainingPay));
      if (p <= 0 && d <= 0) return;
      lines.push({
        chargeId: c.id,
        headName: c.headName,
        headCode: c.headCode,
        chargeAmount: c.amount,
        discount: Math.round(d * 100) / 100,
        paid: Math.round(p * 100) / 100
      });
      remainingDisc = Math.round((remainingDisc - d) * 100) / 100;
      remainingPay = Math.round((remainingPay - p) * 100) / 100;
    });
    if (remainingPay > 0) {
      lines.push({
        chargeId: null,
        headName: 'Advance (unallocated)',
        headCode: 'ADVANCE',
        chargeAmount: 0,
        discount: 0,
        paid: Math.round(remainingPay * 100) / 100
      });
    }
    return lines;
  };

  const selectedPayers = payers.filter((p) => selectedIds.includes(p.id));
  const plan = selectedPayers.map((p) => {
    const r = rowOf(p.id);
    const due = dueOf(p.id);
    const pay = Math.max(0, Number(r.amount || 0));
    const disc = Math.max(0, Number(r.discount || 0));
    return { payer: p, due, pay, disc, lines: allocate(p.id, pay, disc) };
  });
  const grandPay = plan.reduce((s, r) => s + r.pay, 0);
  const grandDisc = plan.reduce((s, r) => s + r.disc, 0);

  const validate = () => {
    if (selectedPayers.length === 0) return 'Select at least one student or staff member to collect from.';
    if (!form.date) return 'Select the collection date.';
    if (form.date > todayIso()) return 'Collection date cannot be in the future.';
    for (const r of plan) {
      if (r.pay + r.disc <= 0) return `Enter the amount being collected for ${r.payer.name}.`;
      if (r.pay + r.disc > r.due + ALLOCATION_STEP)
        return `${r.payer.name}: collected amount cannot exceed the pending balance of ${inr(r.due)}.`;
    }
    if (grandPay + grandDisc <= 0) return 'Nothing to collect — enter at least one amount.';
    if (form.mode !== 'Cash' && !form.reference.trim())
      return `${form.mode === 'Cheque' || form.mode === 'DD' ? 'Cheque / DD number' : 'Transaction reference'} is required for ${form.mode} collections.`;
    return '';
  };

  const goReview = () => {
    const msg = validate();
    setError(msg);
    if (!msg) setStep('review');
  };

  const confirm = () => {
    const records: ChargeReceiptRecord[] = [];
    const allocations: { chargeId: string; paid: number; discount: number }[] = [];
    plan.forEach((r, i) => {
      const lines = r.lines.filter((l) => l.paid + l.discount > 0);
      if (!lines.length) return;
      records.push({
        id: `RCPT-${Date.now()}-${i}`,
        receiptNo: nextChargeReceiptNo(),
        payerId: r.payer.id,
        date: form.date,
        time: nowTime(),
        lines,
        total: Math.round(lines.reduce((s, l) => s + l.paid, 0) * 100) / 100,
        discountTotal: Math.round(lines.reduce((s, l) => s + l.discount, 0) * 100) / 100,
        paymentMode: form.mode,
        reference: form.reference.trim(),
        bankName: form.bankName.trim(),
        chequeDate: form.chequeDate || undefined,
        remarks: form.remarks.trim(),
        receivedBy: CASHIER,
        source: 'counter'
      });
      lines.forEach((l) => {
        if (l.chargeId) allocations.push({ chargeId: l.chargeId, paid: l.paid, discount: l.discount });
      });
    });
    onConfirm(records, allocations);
    setCreated(records);
    setStep('success');
  };

  const referenceLabel = (mode: PaymentMode) =>
  mode === 'Cheque' || mode === 'DD' ? 'Cheque / DD number' : 'Transaction reference';

  const title =
  step === 'details' ?
  `Bulk Collect — ${selectedPayers.length} ${selectedPayers.length === 1 ? 'payer' : 'payers'}` :
  step === 'review' ? 'Review Bulk Collection' : 'Bulk Collection Completed';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      size="xl"
      footer={
      <div className="flex items-center justify-between gap-3">
          {step === 'details' &&
        <>
              {error ?
          <p className="text-sm text-rose-600 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </p> :

          <span className="text-sm text-gray-500">
                  {selectedPayers.length} selected · collecting {inr(grandPay + grandDisc)}
                </span>
          }
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={goReview}>
                  Review Collection
                </Button>
              </div>
            </>
        }
          {step === 'review' &&
        <>
              <Button variant="outline" onClick={() => setStep('details')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button variant="primary" onClick={confirm}>
                <CheckCircle2 className="w-4 h-4" />
                Collect &amp; Generate {plan.filter((r) => r.pay + r.disc > 0).length} Receipt(s)
              </Button>
            </>
        }
          {step === 'success' &&
        <>
              <Button
            variant="outline"
            onClick={() =>
            printHtml(
              tableHtml(
                'Bulk Charge Collection — Receipts Generated',
                ['Receipt No', 'Payer', 'Code', 'Charges', 'Mode', 'Reference', 'Total Paid'],
                created.map((r) => {
                  const p = payers.find((x) => x.id === r.payerId);
                  return [
                  r.receiptNo,
                  p ? p.name : '—',
                  p ? payerCode(p) : '—',
                  String(r.lines.length),
                  r.paymentMode,
                  r.reference || '—',
                  inr(r.total)];

                })
              )
            )}>
                <Printer className="w-4 h-4" />
                Print Summary
              </Button>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </>
        }
        </div>
      }>

      {step === 'details' &&
      <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
            label="Collection Date"
            value={form.date}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, date: e.target.value })}
            options={[todayIso(), dayOffset(-1), dayOffset(-2)].map((d) => ({ value: d, label: formatDate(d) }))} />

            <Select
            label="Payment Mode"
            value={form.mode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, mode: e.target.value as PaymentMode })
            }
            options={['Cash', 'UPI', 'Card', 'Online', 'NEFT', 'RTGS', 'Cheque', 'DD'].map((m) => ({ value: m, label: m }))} />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                {referenceLabel(form.mode)}
                {form.mode !== 'Cash' && ' *'}
              </label>
              <input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })
              }
              placeholder={form.mode === 'Cash' ? 'Optional for cash' : 'UTR / Cheque / UPI reference'}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            {(form.mode === 'Cheque' || form.mode === 'DD' || form.mode === 'NEFT' || form.mode === 'RTGS') &&
          <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Bank Name</label>
                <input
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="Bank / branch"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
          }
            {(form.mode === 'Cheque' || form.mode === 'DD') &&
          <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Cheque Date</label>
                <input
              type="date"
              value={form.chequeDate}
              onChange={(e) => setForm({ ...form, chequeDate: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
          }
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Remarks</label>
              <input
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Narration for the receipts"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Select students / staff and enter the amount collected from each
              </p>
              <div className="flex items-center gap-2">
                <input
                value={payerQuery}
                onChange={(e) => setPayerQuery(e.target.value)}
                placeholder="Search name, GR / employee code…"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                setSelectedIds(
                  payers.

                  filter((p) => dueOf(p.id) > 0).

                  filter((p) =>
                  !payerQuery.trim() ||
                  `${p.name} ${payerCode(p)} ${p.branch}`.
                  toLowerCase().
                  includes(payerQuery.trim().toLowerCase())
                  ).

                  map((p) => p.id)
                )
                }>
                  Select all with dues
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                  Clear
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-600 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 w-10"></th>
                    <th className="px-3 py-2 font-medium">Payer</th>
                    <th className="px-3 py-2 font-medium">Class / Dept</th>
                    <th className="px-3 py-2 font-medium text-right">Pending</th>
                    <th className="px-3 py-2 font-medium text-right w-32">Paying Now (₹)</th>
                    <th className="px-3 py-2 font-medium text-right w-28">Discount (₹)</th>
                    <th className="px-3 py-2 font-medium">Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payers.

                filter((p) => selectedIds.includes(p.id) || dueOf(p.id) > 0).

                filter((p) =>
                !payerQuery.trim() ||
                `${p.name} ${payerCode(p)} ${p.branch}`.
                toLowerCase().
                includes(payerQuery.trim().toLowerCase())
                ).

                map((p) => {
                  const on = selectedIds.includes(p.id);
                  const r = rowOf(p.id);
                  const due = dueOf(p.id);
                  const lines = allocate(p.id, Number(r.amount || 0), Number(r.discount || 0));
                  return (
                    <tr key={p.id} className={on ? 'bg-blue-50/40' : ''}>
                        <td className="px-3 py-2">
                          <input
                          type="checkbox"
                          aria-label={`Select ${p.name}`}
                          checked={on}
                          onChange={() => togglePayer(p.id)} />

                        </td>
                        <td className="px-3 py-2">
                          <p className="text-gray-900 font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            {payerCode(p)} · {payerSubtitle(p)}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {p.type === 'student' ? `Class ${p.className}-${p.section}` : p.department}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900">{inr(due)}</td>
                        <td className="px-3 py-2">
                          <input
                          type="number"
                          min={0}
                          disabled={!on}
                          aria-label={`Amount for ${p.name}`}
                          value={on ? r.amount : ''}
                          onChange={(e) => setRow(p.id, { amount: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-right text-sm disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                        </td>
                        <td className="px-3 py-2">
                          <input
                          type="number"
                          min={0}
                          disabled={!on}
                          aria-label={`Discount for ${p.name}`}
                          value={on ? r.discount : ''}
                          onChange={(e) => setRow(p.id, { discount: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-right text-sm disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {on && lines.length ?
                        <>
                              {lines[0].headName}
                              {lines.length > 1 ? ` + ${lines.length - 1} more charge(s)` : ''}
                            </> :
                        <span className="text-gray-400">—</span>}
                        </td>
                      </tr>);

                })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-800">
                  <tr>
                    <td className="px-3 py-2" colSpan={4}>
                      {selectedPayers.length} payer(s) selected
                    </td>
                    <td className="px-3 py-2 text-right" data-testid="bulk-pay-total">{inr(grandPay)}</td>
                    <td className="px-3 py-2 text-right text-emerald-700">{inr(grandDisc)}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {plan.filter((r) => r.pay + r.disc > 0).length} receipt(s) will be generated
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      }

      {step === 'review' &&
      <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
          ['Collection Date', formatDate(form.date)],
          ['Payment Mode', form.mode],
          ['Reference', form.reference || '—'],
          ['Receipts to Generate', String(plan.filter((r) => r.pay + r.disc > 0).length)]].
          map(([k, v]) =>
          <div key={k} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <p className="text-xs uppercase tracking-wider text-gray-500">{k}</p>
                <p className="font-semibold text-gray-900">{v}</p>
              </div>
          )}
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Payer</th>
                  <th className="px-3 py-2 text-left font-medium">Charges covered</th>
                  <th className="px-3 py-2 text-right font-medium">Discount</th>
                  <th className="px-3 py-2 text-right font-medium">Collecting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plan.

              filter((r) => r.pay + r.disc > 0).

              map((r) =>
              <tr key={r.payer.id}>
                    <td className="px-3 py-2">
                      <p className="text-gray-900">{r.payer.name}</p>
                      <p className="text-xs text-gray-500">{payerCode(r.payer)}</p>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">
                      {r.lines.map((l) => l.headName).join(', ') || '—'}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-700">{inr(r.disc)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">{inr(r.pay)}</td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-blue-50 font-semibold">
                <tr>
                  <td className="px-3 py-2 text-gray-700" colSpan={2}>
                    Total across {plan.filter((r) => r.pay + r.disc > 0).length} payer(s)
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-700">{inr(grandDisc)}</td>
                  <td className="px-3 py-2 text-right text-blue-800">{inr(grandPay)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            Each payer gets an individual receipt; amounts are allocated to the oldest pending charge first.
          </p>
        </div>
      }

      {step === 'success' &&
      <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">
              {created.length} charge receipt(s) generated and recorded on the page — total{' '}
              {inr(created.reduce((s, r) => s + r.total, 0))}.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Receipt No</th>
                  <th className="px-3 py-2 text-left font-medium">Payer</th>
                  <th className="px-3 py-2 text-left font-medium">Code</th>
                  <th className="px-3 py-2 text-right font-medium">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {created.map((r) => {
                const p = payers.find((x) => x.id === r.payerId);
                return (
                  <tr key={r.id}>
                      <td className="px-3 py-2 font-mono text-blue-700">{r.receiptNo}</td>
                      <td className="px-3 py-2 text-gray-900">{p ? p.name : '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{p ? payerCode(p) : '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{inr(r.total)}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </div>
      }
    </Modal>);

}

function GeneratedReceiptsSection({
  receipts,
  onView,
  onPrint,
  onDownload
}: {
  receipts: ChargeReceiptRecord[];
  onView: (r: ChargeReceiptRecord) => void;
  onPrint: (r: ChargeReceiptRecord) => void;
  onDownload: (r: ChargeReceiptRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [expanded, setExpanded] = useState(true);

  const rows = receipts.
  filter((r) => modeFilter === 'all' || r.paymentMode === modeFilter).
  filter((r) => sourceFilter === 'all' || r.source === sourceFilter).
  filter((r) => {
    if (!query.trim()) return true;
    const p = ALL_CHARGE_PAYERS.find((x) => x.id === r.payerId);
    const q = query.trim().toLowerCase();
    return (
      r.receiptNo.toLowerCase().includes(q) ||
      r.reference.toLowerCase().includes(q) ||
      (p ? `${p.name} ${payerCode(p)}`.toLowerCase().includes(q) : false));

  }).
  sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const total = rows.reduce((s, r) => s + r.total, 0);
  const discount = rows.reduce((s, r) => s + r.discountTotal, 0);

  return (
    <Card noPadding className="overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Generated Charge Receipts</h3>
            <p className="text-xs text-gray-500">
              {rows.length} receipt(s) · collected {inr(total)} · discounts {inr(discount)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search receipt no, payer, reference…"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <Select
            value={modeFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModeFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Modes' },
            ...['Cash', 'UPI', 'Card', 'Online', 'NEFT', 'RTGS', 'Cheque', 'DD'].map((m) => ({ value: m, label: m }))].
            map((o) => ({ value: o.value, label: o.label }))} />

          <Select
            value={sourceFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSourceFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Sources' },
            { value: 'counter', label: 'Counter Collected' },
            { value: 'import', label: 'Imported / Other' }]} />

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
            printHtml(
              tableHtml(
                'Generated Charge Receipts',
                ['Receipt No', 'Date', 'Time', 'Payer', 'Code', 'Mode', 'Reference', 'Charges', 'Total Paid'],
                rows.map((r) => {
                  const p = ALL_CHARGE_PAYERS.find((x) => x.id === r.payerId);
                  return [
                  r.receiptNo,
                  formatDate(r.date),
                  r.time,
                  p ? p.name : '—',
                  p ? payerCode(p) : '—',
                  r.paymentMode,
                  r.reference || '—',
                  String(r.lines.length),
                  inr(r.total)];

                })
              )
            )}>
            <Printer className="w-4 h-4" />
            Print Register
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
            downloadText(
              `Charge-Receipt-Register-${todayIso()}.csv`,
              toCsv([
              ['Receipt No', 'Date', 'Time', 'Payer', 'Code', 'Mode', 'Reference', 'Charges', 'Discount', 'Total Paid'],
              ...rows.map((r) => {
                const p = ALL_CHARGE_PAYERS.find((x) => x.id === r.payerId);
                return [
                r.receiptNo,
                r.date,
                r.time,
                p ? p.name : '—',
                p ? payerCode(p) : '—',
                r.paymentMode,
                r.reference,
                r.lines.length,
                r.discountTotal,
                r.total];

              })]),
              'text/csv;charset=utf-8'
            )
            }>
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      {expanded &&
      <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" data-testid="generated-receipts">
            <thead className="bg-gray-100 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Receipt No</th>
                <th className="px-4 py-3 font-medium">Date / Time</th>
                <th className="px-4 py-3 font-medium">Payer</th>
                <th className="px-4 py-3 font-medium">Charges</th>
                <th className="px-4 py-3 font-medium">Mode / Reference</th>
                <th className="px-4 py-3 font-medium text-right">Discount</th>
                <th className="px-4 py-3 font-medium text-right">Total Paid</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => {
              const p = ALL_CHARGE_PAYERS.find((x) => x.id === r.payerId);
              return (
                <tr key={r.id} className="hover:bg-gray-50" data-receipt={r.receiptNo}>
                    <td className="px-4 py-3 font-mono text-blue-700">{r.receiptNo}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(r.date)}
                      <span className="block text-xs text-gray-400">{r.time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium">{p ? p.name : '—'}</p>
                      <p className="text-xs text-gray-500">
                        {p ? `${payerCode(p)} · ${payerSubtitle(p)}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {r.lines.length} charge(s)
                      <span className="block text-gray-400">{r.lines[0] ? r.lines[0].headName : ''}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.paymentMode}
                      <span className="block text-xs text-gray-400 font-mono">{r.reference || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-700">
                      {r.discountTotal ? inr(r.discountTotal) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{inr(r.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.source === 'counter' ? 'success' : 'info'}>
                        {r.source === 'counter' ? 'Counter' : 'Imported'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(r)} title="View receipt">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onPrint(r)} title="Print receipt">
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDownload(r)} title="Download receipt">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>);

            })}
              {!rows.length &&
            <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No receipts match the selected filters.
                  </td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      }
    </Card>);

}

export default ChargeReceipt;
