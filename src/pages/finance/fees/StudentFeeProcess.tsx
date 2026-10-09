import React, { useRef, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import {
  Search,
  User,
  Printer,
  Eye,
  Receipt,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Download,
  ArrowLeft,
  X,
  XCircle,
  ChevronRight,
} from 'lucide-react'

// Student Fee Process = Fee Receipt & Discount List + student fee details on ONE page:
//   list of students (receipt & discount list)  →  click a student  →  that student's fee details

// ─── Types ───────────────────────────────────────────────────────────────────

interface Student {
  id: string
  regNo: string
  firstName: string
  lastName: string
  class: string
  division: string
  rollNo: number
  fatherName: string
  gender: string
  status: 'Active' | 'Inactive'
  year: string
  franchise: string
  centre: string
  batch: string
  feeStructure: string
  contact: string
}

type ReceiptStatus = 'Paid' | 'Unpaid' | 'Pending' | 'Partial'

interface FeeReceipt {
  id: string
  studentId: string
  receiptNo: string
  date: string
  feeHead: string
  term: string
  amount: number
  discount: number
  netAmount: number
  paidAmount: number
  balance: number
  paymentMode: string
  status: ReceiptStatus
  cancelNote?: string // set when the payment on this fee line was cancelled
}

// One row of the student list — amounts are derived from the student's fee lines
interface ListRow {
  student: Student
  terms: string[]
  amount: number
  discount: number
  finalAmount: number
  paidAmount: number
  status: 'Paid' | 'Partial' | 'Unpaid'
}

type ReceiptTab = 'all' | 'paid' | 'unpaid' | 'partial' | 'pending'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_STUDENTS: Student[] = [
  { id: 'STU001', regNo: 'REG-2024-001', firstName: 'Rahul', lastName: 'Sharma', class: '10', division: 'A', rollNo: 15, fatherName: 'Amit Sharma', gender: 'Male', status: 'Active', year: '2024-2025', franchise: 'Main Franchise', centre: 'Main Campus', batch: 'Morning', feeStructure: 'Regular + Transport', contact: '9876543210' },
  { id: 'STU002', regNo: 'REG-2024-002', firstName: 'Priya', lastName: 'Patel', class: '10', division: 'A', rollNo: 12, fatherName: 'Rajesh Patel', gender: 'Female', status: 'Active', year: '2024-2025', franchise: 'Main Franchise', centre: 'Main Campus', batch: 'Afternoon', feeStructure: 'Regular + Transport', contact: '9876543211' },
  { id: 'STU003', regNo: 'REG-2024-003', firstName: 'Arjun', lastName: 'Singh', class: '10', division: 'B', rollNo: 3, fatherName: 'Vikram Singh', gender: 'Male', status: 'Active', year: '2024-2025', franchise: 'North Franchise', centre: 'North Campus', batch: 'Morning', feeStructure: 'Regular', contact: '9876543212' },
  { id: 'STU004', regNo: 'REG-2024-004', firstName: 'Sneha', lastName: 'Reddy', class: '9', division: 'A', rollNo: 22, fatherName: 'Suresh Reddy', gender: 'Female', status: 'Active', year: '2024-2025', franchise: 'Main Franchise', centre: 'Main Campus', batch: 'Morning', feeStructure: 'Staff Ward', contact: '9876543213' },
  { id: 'STU005', regNo: 'REG-2024-005', firstName: 'Mohammed', lastName: 'Irfan', class: '9', division: 'B', rollNo: 8, fatherName: 'Ahmed Khan', gender: 'Male', status: 'Active', year: '2024-2025', franchise: 'North Franchise', centre: 'North Campus', batch: 'Afternoon', feeStructure: 'Regular', contact: '9876543214' },
  { id: 'STU006', regNo: 'REG-2024-006', firstName: 'Ananya', lastName: 'Gupta', class: '8', division: 'A', rollNo: 5, fatherName: 'Sanjay Gupta', gender: 'Female', status: 'Inactive', year: '2023-2024', franchise: 'Main Franchise', centre: 'Main Campus', batch: 'Afternoon', feeStructure: 'Regular', contact: '9876543215' },
  { id: 'STU007', regNo: 'REG-2024-007', firstName: 'Karthik', lastName: 'Nair', class: '8', division: 'B', rollNo: 18, fatherName: 'Ramesh Nair', gender: 'Male', status: 'Active', year: '2024-2025', franchise: 'North Franchise', centre: 'North Campus', batch: 'Afternoon', feeStructure: 'Regular', contact: '9876543216' },
  { id: 'STU008', regNo: 'REG-2024-008', firstName: 'Divya', lastName: 'Joshi', class: '10', division: 'A', rollNo: 9, fatherName: 'Prakash Joshi', gender: 'Female', status: 'Active', year: '2024-2025', franchise: 'Main Franchise', centre: 'Main Campus', batch: 'Morning', feeStructure: 'Regular + Transport', contact: '9876543217' },
]

// Fee lines per student (one receipt number per fee head & term). Student list totals are derived from these.
const MOCK_RECEIPTS: FeeReceipt[] = [
  // Rahul Sharma
  { id: '1', studentId: 'STU001', receiptNo: 'RCP-2024-001', date: '2024-04-05', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '2', studentId: 'STU001', receiptNo: 'RCP-2024-002', date: '2024-04-05', feeHead: 'Transport Fee', term: 'Term 1', amount: 10000, discount: 1000, netAmount: 9000, paidAmount: 9000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '3', studentId: 'STU001', receiptNo: 'RCP-2024-089', date: '2024-07-10', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 15000, balance: 10000, paymentMode: 'Cash', status: 'Partial' },
  { id: '4', studentId: 'STU001', receiptNo: 'RCP-2024-090', date: '2024-07-10', feeHead: 'Transport Fee', term: 'Term 2', amount: 10000, discount: 1000, netAmount: 9000, paidAmount: 0, balance: 9000, paymentMode: '-', status: 'Unpaid' },
  { id: '5', studentId: 'STU001', receiptNo: 'RCP-2024-150', date: '2024-10-05', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 0, balance: 25000, paymentMode: '-', status: 'Pending' },
  // Priya Patel
  { id: '6', studentId: 'STU002', receiptNo: 'RCP-2024-010', date: '2024-04-03', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '7', studentId: 'STU002', receiptNo: 'RCP-2024-011', date: '2024-04-03', feeHead: 'Transport Fee', term: 'Term 1', amount: 10000, discount: 1000, netAmount: 9000, paidAmount: 9000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '8', studentId: 'STU002', receiptNo: 'RCP-2024-080', date: '2024-07-05', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Cheque', status: 'Paid' },
  { id: '9', studentId: 'STU002', receiptNo: 'RCP-2024-081', date: '2024-07-05', feeHead: 'Transport Fee', term: 'Term 2', amount: 10000, discount: 1000, netAmount: 9000, paidAmount: 9000, balance: 0, paymentMode: 'Cheque', status: 'Paid' },
  { id: '10', studentId: 'STU002', receiptNo: 'RCP-2024-140', date: '2024-10-02', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  // Arjun Singh
  { id: '11', studentId: 'STU003', receiptNo: 'RCP-2024-020', date: '2024-04-08', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '12', studentId: 'STU003', receiptNo: 'RCP-2024-095', date: '2024-07-15', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 0, balance: 25000, paymentMode: '-', status: 'Unpaid' },
  { id: '13', studentId: 'STU003', receiptNo: 'RCP-2024-160', date: '2024-10-10', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 0, balance: 25000, paymentMode: '-', status: 'Pending' },
  // Sneha Reddy
  { id: '14', studentId: 'STU004', receiptNo: 'RCP-2024-030', date: '2024-04-10', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 2000, netAmount: 23000, paidAmount: 23000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '15', studentId: 'STU004', receiptNo: 'RCP-2024-031', date: '2024-04-10', feeHead: 'Lab Fee', term: 'Term 1', amount: 8000, discount: 0, netAmount: 8000, paidAmount: 8000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '16', studentId: 'STU004', receiptNo: 'RCP-2024-100', date: '2024-07-12', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 2000, netAmount: 23000, paidAmount: 23000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '17', studentId: 'STU004', receiptNo: 'RCP-2024-101', date: '2024-07-12', feeHead: 'Lab Fee', term: 'Term 2', amount: 8000, discount: 0, netAmount: 8000, paidAmount: 6000, balance: 2000, paymentMode: 'Cash', status: 'Partial' },
  { id: '18', studentId: 'STU004', receiptNo: 'RCP-2024-170', date: '2024-10-08', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 2000, netAmount: 23000, paidAmount: 0, balance: 23000, paymentMode: '-', status: 'Pending' },
  // Mohammed Irfan
  { id: '28', studentId: 'STU005', receiptNo: 'RCP-2024-025', date: '2024-04-09', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '29', studentId: 'STU005', receiptNo: 'RCP-2024-026', date: '2024-04-09', feeHead: 'Lab Fee', term: 'Term 1', amount: 5000, discount: 0, netAmount: 5000, paidAmount: 5000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '30', studentId: 'STU005', receiptNo: 'RCP-2024-097', date: '2024-07-11', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '31', studentId: 'STU005', receiptNo: 'RCP-2024-098', date: '2024-07-11', feeHead: 'Lab Fee', term: 'Term 2', amount: 5000, discount: 0, netAmount: 5000, paidAmount: 5000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '32', studentId: 'STU005', receiptNo: 'RCP-2024-165', date: '2024-10-04', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  // Ananya Gupta
  { id: '33', studentId: 'STU006', receiptNo: 'RCP-2023-040', date: '2023-04-12', feeHead: 'Tuition Fee', term: 'Term 1', amount: 22000, discount: 0, netAmount: 22000, paidAmount: 22000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '34', studentId: 'STU006', receiptNo: 'RCP-2023-041', date: '2023-04-12', feeHead: 'Activity Fee', term: 'Term 1', amount: 5000, discount: 0, netAmount: 5000, paidAmount: 5000, balance: 0, paymentMode: 'Cash', status: 'Paid' },
  { id: '35', studentId: 'STU006', receiptNo: 'RCP-2023-108', date: '2023-07-14', feeHead: 'Tuition Fee', term: 'Term 2', amount: 22000, discount: 0, netAmount: 22000, paidAmount: 8000, balance: 14000, paymentMode: 'Cash', status: 'Partial' },
  { id: '36', studentId: 'STU006', receiptNo: 'RCP-2023-185', date: '2023-10-14', feeHead: 'Tuition Fee', term: 'Term 3', amount: 21000, discount: 0, netAmount: 21000, paidAmount: 0, balance: 21000, paymentMode: '-', status: 'Unpaid' },
  // Karthik Nair
  { id: '19', studentId: 'STU007', receiptNo: 'RCP-2024-045', date: '2024-04-15', feeHead: 'Tuition Fee', term: 'Term 1', amount: 22000, discount: 0, netAmount: 22000, paidAmount: 0, balance: 22000, paymentMode: '-', status: 'Unpaid' },
  { id: '20', studentId: 'STU007', receiptNo: 'RCP-2024-046', date: '2024-04-15', feeHead: 'Activity Fee', term: 'Term 1', amount: 5000, discount: 0, netAmount: 5000, paidAmount: 0, balance: 5000, paymentMode: '-', status: 'Unpaid' },
  { id: '21', studentId: 'STU007', receiptNo: 'RCP-2024-110', date: '2024-07-15', feeHead: 'Tuition Fee', term: 'Term 2', amount: 22000, discount: 0, netAmount: 22000, paidAmount: 0, balance: 22000, paymentMode: '-', status: 'Unpaid' },
  { id: '22', studentId: 'STU007', receiptNo: 'RCP-2024-180', date: '2024-10-15', feeHead: 'Tuition Fee', term: 'Term 3', amount: 21000, discount: 0, netAmount: 21000, paidAmount: 0, balance: 21000, paymentMode: '-', status: 'Pending' },
  // Divya Joshi
  { id: '23', studentId: 'STU008', receiptNo: 'RCP-2024-050', date: '2024-04-06', feeHead: 'Tuition Fee', term: 'Term 1', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '24', studentId: 'STU008', receiptNo: 'RCP-2024-051', date: '2024-04-06', feeHead: 'Transport Fee', term: 'Term 1', amount: 9000, discount: 0, netAmount: 9000, paidAmount: 9000, balance: 0, paymentMode: 'Online', status: 'Paid' },
  { id: '25', studentId: 'STU008', receiptNo: 'RCP-2024-105', date: '2024-07-08', feeHead: 'Tuition Fee', term: 'Term 2', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 25000, balance: 0, paymentMode: 'Cheque', status: 'Paid' },
  { id: '26', studentId: 'STU008', receiptNo: 'RCP-2024-106', date: '2024-07-08', feeHead: 'Transport Fee', term: 'Term 2', amount: 9000, discount: 0, netAmount: 9000, paidAmount: 9000, balance: 0, paymentMode: 'Cheque', status: 'Paid' },
  { id: '27', studentId: 'STU008', receiptNo: 'RCP-2024-175', date: '2024-10-06', feeHead: 'Tuition Fee', term: 'Term 3', amount: 25000, discount: 0, netAmount: 25000, paidAmount: 0, balance: 25000, paymentMode: '-', status: 'Pending' },
]

// ─── Filter options (same filters as the former Fee Receipt & Discount List) ──

const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023']
const MASTER_FRANCHISES = ['All', 'Main Franchise', 'North Franchise']
const CENTRES = ['All', 'Main Campus', 'North Campus', 'South Campus']
const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const DIVISIONS = ['All', 'A', 'B', 'C']
const GENDERS = ['All', 'Male', 'Female', 'Other']
const ACTIVE_STATUS = ['All', 'Active', 'Inactive']
const BATCHES = ['All', 'Morning', 'Afternoon', 'Evening']
const TERMS = ['All', 'Term 1', 'Term 2', 'Term 3']

const DEFAULT_FILTERS = {
  academicYear: '2024-2025',
  masterFranchise: 'All',
  centre: 'All',
  class: 'All',
  division: 'All',
  gender: 'All',
  active: 'Active',
  search: '',
  batch: 'All',
  term: 'All',
}
type Filters = typeof DEFAULT_FILTERS

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const fullName = (s: Student) => `${s.firstName} ${s.lastName}`

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const displayDate = (iso: string) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

const rowStatus = (finalAmount: number, paid: number): ListRow['status'] =>
  finalAmount > 0 && paid >= finalAmount ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'

const termsLabel = (terms: string[]) =>
  terms.length === 0
    ? '—'
    : terms.length === 1
      ? terms[0]
      : `Term ${terms.map((t) => t.replace('Term ', '')).join(', ')}`

const modeText = (mode: string) => (mode && mode !== '-' ? mode : '—')

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c],
  )

const docShell = (title: string, body: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px}
.doc{max-width:760px;margin:0 auto;border:1px solid #d1d5db;border-radius:8px;padding:24px}
.doc.wide{max-width:1000px}
.hd{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:16px}
.hd h1{margin:0;font-size:20px;color:#1e3a8a}.hd p{margin:4px 0 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
.meta{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:13px;margin-bottom:16px}
.grid span{color:#6b7280}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
th{background:#f3f4f6}.num{text-align:right}
.total td{font-weight:bold;background:#eff6ff}
.small{font-size:12px;margin:10px 0}.warn{color:#b91c1c}
.foot{display:flex;justify-content:space-between;margin-top:36px;font-size:12px;color:#374151}
@media print{body{margin:0}.doc{border:none}}
</style></head><body>${body}</body></html>`

const studentGrid = (s: Student) => `<div class="grid">
<div><span>Student:</span> <strong>${escapeHtml(fullName(s))}</strong></div>
<div><span>Reg No:</span> ${escapeHtml(s.regNo)}</div>
<div><span>Class:</span> ${escapeHtml(s.class)}-${escapeHtml(s.division)} (Roll ${s.rollNo})</div>
<div><span>Centre:</span> ${escapeHtml(s.centre)} · ${escapeHtml(s.batch)}</div>
<div><span>Father:</span> ${escapeHtml(s.fatherName)}</div>
<div><span>Fee Structure:</span> ${escapeHtml(s.feeStructure)} · ${escapeHtml(s.year)}</div>
</div>`

// Single fee line → receipt (or due slip when nothing is paid on it)
const receiptDocument = (s: Student, r: FeeReceipt) => {
  const title = r.paidAmount > 0 ? 'Fee Receipt' : 'Fee Due Slip'
  return docShell(
    `${title} ${r.receiptNo}`,
    `<section class="doc">
<div class="hd"><h1>ABC International School</h1><p>${title}</p></div>
<div class="meta"><div><strong>No:</strong> ${escapeHtml(r.receiptNo)}</div><div><strong>Date:</strong> ${escapeHtml(displayDate(r.date))}</div><div><strong>Status:</strong> ${escapeHtml(r.status)}</div></div>
${studentGrid(s)}
<table><tbody>
<tr><td>Fee Head</td><td class="num">${escapeHtml(r.feeHead)} (${escapeHtml(r.term)})</td></tr>
<tr><td>Amount</td><td class="num">${inr(r.amount)}</td></tr>
<tr><td>Discount</td><td class="num">- ${inr(r.discount)}</td></tr>
<tr><td>Net Amount</td><td class="num">${inr(r.netAmount)}</td></tr>
<tr class="total"><td>Paid</td><td class="num">${inr(r.paidAmount)}</td></tr>
<tr><td>Balance</td><td class="num">${inr(r.balance)}</td></tr>
</tbody></table>
<p class="small">Payment Mode: <strong>${escapeHtml(modeText(r.paymentMode))}</strong></p>
${r.cancelNote ? `<p class="small warn">${escapeHtml(r.cancelNote)}</p>` : ''}
<div class="foot"><div>Printed on ${escapeHtml(displayDate(todayISO()))}</div><div>Authorised Signatory</div></div>
</section>`,
  )
}

// All fee lines currently shown in the detail view → fee statement
const statementDocument = (s: Student, list: FeeReceipt[], scope: string) => {
  const sum = (k: 'amount' | 'discount' | 'netAmount' | 'paidAmount' | 'balance') =>
    list.reduce((t, r) => t + r[k], 0)
  const rows = list
    .map(
      (r) =>
        `<tr><td>${escapeHtml(r.receiptNo)}</td><td>${escapeHtml(displayDate(r.date))}</td><td>${escapeHtml(r.feeHead)}</td><td>${escapeHtml(r.term)}</td><td class="num">${inr(r.amount)}</td><td class="num">${inr(r.discount)}</td><td class="num">${inr(r.netAmount)}</td><td class="num">${inr(r.paidAmount)}</td><td class="num">${inr(r.balance)}</td><td>${escapeHtml(modeText(r.paymentMode))}</td><td>${escapeHtml(r.status)}</td></tr>`,
    )
    .join('')
  return docShell(
    `Fee Statement - ${fullName(s)}`,
    `<section class="doc wide">
<div class="hd"><h1>ABC International School</h1><p>Student Fee Statement</p></div>
${studentGrid(s)}
<p class="small">Receipts: <strong>${escapeHtml(scope)}</strong> · Printed on ${escapeHtml(displayDate(todayISO()))}</p>
<table><thead><tr><th>Receipt No</th><th>Date</th><th>Fee Head</th><th>Term</th><th class="num">Amount</th><th class="num">Discount</th><th class="num">Net</th><th class="num">Paid</th><th class="num">Balance</th><th>Mode</th><th>Status</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr class="total"><td colspan="4">Total (${list.length})</td><td class="num">${inr(sum('amount'))}</td><td class="num">${inr(sum('discount'))}</td><td class="num">${inr(sum('netAmount'))}</td><td class="num">${inr(sum('paidAmount'))}</td><td class="num">${inr(sum('balance'))}</td><td colspan="2"></td></tr></tfoot>
</table>
<div class="foot"><div>Parent/Guardian</div><div>Authorised Signatory</div></div>
</section>`,
  )
}

// Prints only the given document (hidden iframe) instead of the whole page
const printDocument = (html: string) => {
  document.querySelectorAll('iframe[data-print-frame]').forEach((f) => f.remove())
  const frame = document.createElement('iframe')
  frame.setAttribute('data-print-frame', 'true')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
  document.body.appendChild(frame)
  const win = frame.contentWindow
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => {
    win.focus()
    win.print()
  }, 300)
}

const downloadCsv = (name: string, header: string, rows: (string | number)[][]) => {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [header, ...rows.map((r) => r.map(cell).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StudentFeeProcess() {
  const [receipts, setReceipts] = useState<FeeReceipt[]>(MOCK_RECEIPTS)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [appliedSearch, setAppliedSearch] = useState('')
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef<number | undefined>(undefined)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ReceiptTab>('all')
  const [viewReceipt, setViewReceipt] = useState<FeeReceipt | null>(null)
  const [cancelTarget, setCancelTarget] = useState<FeeReceipt | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelError, setCancelError] = useState('')

  const flash = (message: string) => {
    setNotice(message)
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
  }

  // ── List: filters (dropdowns apply instantly, search text applies on Search / Enter) ──

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setAppliedSearch('')
  }

  const matchesStudent = (s: Student, q: string) => {
    if (q) {
      const query = q.toLowerCase()
      const hit =
        fullName(s).toLowerCase().includes(query) ||
        s.regNo.toLowerCase().includes(query) ||
        s.contact.includes(query)
      if (!hit) return false
    }
    if (filters.academicYear !== 'All' && s.year !== filters.academicYear) return false
    if (filters.masterFranchise !== 'All' && s.franchise !== filters.masterFranchise) return false
    if (filters.centre !== 'All' && s.centre !== filters.centre) return false
    if (filters.class !== 'All' && s.class !== filters.class) return false
    if (filters.division !== 'All' && s.division !== filters.division) return false
    if (filters.gender !== 'All' && s.gender !== filters.gender) return false
    if (filters.active !== 'All' && s.status !== filters.active) return false
    if (filters.batch !== 'All' && s.batch !== filters.batch) return false
    return true
  }

  // Term filter narrows the amounts to that term's fee lines
  const buildRow = (s: Student): ListRow | null => {
    const lines = receipts.filter(
      (r) => r.studentId === s.id && (filters.term === 'All' || r.term === filters.term),
    )
    if (filters.term !== 'All' && lines.length === 0) return null
    const amount = lines.reduce((t, r) => t + r.amount, 0)
    const discount = lines.reduce((t, r) => t + r.discount, 0)
    const finalAmount = lines.reduce((t, r) => t + r.netAmount, 0)
    const paidAmount = lines.reduce((t, r) => t + r.paidAmount, 0)
    return {
      student: s,
      terms: Array.from(new Set(lines.map((r) => r.term))).sort(),
      amount,
      discount,
      finalAmount,
      paidAmount,
      status: rowStatus(finalAmount, paidAmount),
    }
  }

  const computeRows = (q: string) =>
    MOCK_STUDENTS.filter((s) => matchesStudent(s, q))
      .map(buildRow)
      .filter((r): r is ListRow => r !== null)

  const rows = computeRows(appliedSearch)
  const listTotals = rows.reduce(
    (t, r) => ({
      amount: t.amount + r.amount,
      discount: t.discount + r.discount,
      finalAmount: t.finalAmount + r.finalAmount,
      paidAmount: t.paidAmount + r.paidAmount,
    }),
    { amount: 0, discount: 0, finalAmount: 0, paidAmount: 0 },
  )

  const runSearch = () => {
    const q = filters.search.trim()
    setAppliedSearch(q)
    flash(`${computeRows(q).length} student fee record(s) found.`)
  }

  const exportList = () =>
    downloadCsv(
      'student-fee-receipt-discount-list.csv',
      'Reg No,First Name,Last Name,Fee Structure,Centre,Class,Term,Year,Amount,Discount,Final Amount,Paid Amount,Balance,Status',
      rows.map((r) => [
        r.student.regNo,
        r.student.firstName,
        r.student.lastName,
        r.student.feeStructure,
        r.student.centre,
        `${r.student.class}-${r.student.division}`,
        filters.term === 'All' ? termsLabel(r.terms) : filters.term,
        r.student.year,
        r.amount,
        r.discount,
        r.finalAmount,
        r.paidAmount,
        r.finalAmount - r.paidAmount,
        r.status,
      ]),
    )

  const openStudent = (id: string) => {
    setSelectedId(id)
    setActiveTab('all')
    setViewReceipt(null)
  }

  // ── Detail: selected student's fee lines ──

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === selectedId) || null
  const studentReceipts = selectedStudent ? receipts.filter((r) => r.studentId === selectedStudent.id) : []
  const filteredReceipts = studentReceipts.filter(
    (r) => activeTab === 'all' || r.status.toLowerCase() === activeTab,
  )
  const countOf = (status: ReceiptStatus) => studentReceipts.filter((r) => r.status === status).length
  const tabItems: { id: ReceiptTab; label: string }[] = [
    { id: 'all', label: `All Receipts (${studentReceipts.length})` },
    { id: 'paid', label: `Paid (${countOf('Paid')})` },
    { id: 'unpaid', label: `Unpaid (${countOf('Unpaid')})` },
    { id: 'partial', label: `Partial (${countOf('Partial')})` },
    { id: 'pending', label: `Pending (${countOf('Pending')})` },
  ]
  const activeTabLabel = tabItems.find((t) => t.id === activeTab)?.label || ''
  const studentTotals = studentReceipts.reduce(
    (t, r) => ({
      amount: t.amount + r.amount,
      discount: t.discount + r.discount,
      net: t.net + r.netAmount,
      paid: t.paid + r.paidAmount,
      balance: t.balance + r.balance,
    }),
    { amount: 0, discount: 0, net: 0, paid: 0, balance: 0 },
  )

  const exportStudentReceipts = () => {
    if (!selectedStudent) return
    downloadCsv(
      `fee-receipts-${selectedStudent.regNo}.csv`,
      'Receipt No,Date,Fee Head,Term,Amount,Discount,Net Amount,Paid,Balance,Mode,Status,Note',
      filteredReceipts.map((r) => [
        r.receiptNo,
        r.date,
        r.feeHead,
        r.term,
        r.amount,
        r.discount,
        r.netAmount,
        r.paidAmount,
        r.balance,
        modeText(r.paymentMode),
        r.status,
        r.cancelNote || '',
      ]),
    )
  }

  const printReceipt = (r: FeeReceipt) => {
    if (selectedStudent) printDocument(receiptDocument(selectedStudent, r))
  }

  const printAll = () => {
    if (selectedStudent && filteredReceipts.length > 0)
      printDocument(statementDocument(selectedStudent, filteredReceipts, activeTabLabel))
  }

  const openCancel = (r: FeeReceipt) => {
    setCancelTarget(r)
    setCancelReason('')
    setCancelError('')
  }

  // Cancelling a receipt reverses its payment; list totals update automatically
  const confirmCancel = () => {
    if (!cancelTarget) return
    const reason = cancelReason.trim()
    if (!reason) {
      setCancelError('Please enter a reason for cancelling this receipt.')
      return
    }
    const target = cancelTarget
    setReceipts((prev) =>
      prev.map((r) =>
        r.id !== target.id
          ? r
          : {
              ...r,
              paidAmount: 0,
              balance: r.netAmount,
              status: 'Unpaid',
              paymentMode: '-',
              cancelNote: `Payment of ${inr(target.paidAmount)} (${modeText(target.paymentMode)}) cancelled on ${displayDate(todayISO())} — ${reason}`,
            },
      ),
    )
    setCancelTarget(null)
    setCancelReason('')
    setCancelError('')
    setViewReceipt(null)
    flash(`Receipt ${target.receiptNo} cancelled — ${inr(target.paidAmount)} reversed. Paid amount and status updated.`)
  }

  // ── Badges ──

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Unpaid':
        return (
          <Badge variant="danger">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Pending':
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Partial':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const receiptColumns = [
    {
      key: 'receiptNo',
      header: 'Receipt No',
      render: (row: FeeReceipt) => (
        <div>
          <span className="font-mono text-sm text-blue-600">{row.receiptNo}</span>
          {row.cancelNote && <div className="text-[11px] text-red-600">Payment cancelled</div>}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row: FeeReceipt) => <span className="text-gray-700">{displayDate(row.date)}</span>,
    },
    {
      key: 'feeHead',
      header: 'Fee Head',
      render: (row: FeeReceipt) => <span className="font-medium text-gray-900">{row.feeHead}</span>,
    },
    {
      key: 'term',
      header: 'Term',
      render: (row: FeeReceipt) => <span className="text-gray-600">{row.term}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: FeeReceipt) => <span className="text-gray-700">{inr(row.amount)}</span>,
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (row: FeeReceipt) => (
        <span className={row.discount > 0 ? 'text-green-600' : 'text-gray-400'}>
          {row.discount > 0 ? `- ${inr(row.discount)}` : '—'}
        </span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Amount',
      render: (row: FeeReceipt) => <span className="font-medium text-gray-900">{inr(row.netAmount)}</span>,
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      render: (row: FeeReceipt) => (
        <span className={row.paidAmount > 0 ? 'font-medium text-green-600' : 'text-gray-400'}>
          {inr(row.paidAmount)}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (row: FeeReceipt) => (
        <span className={row.balance > 0 ? 'font-medium text-red-600' : 'text-gray-400'}>
          {inr(row.balance)}
        </span>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Mode',
      render: (row: FeeReceipt) => <span className="text-gray-600">{modeText(row.paymentMode)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: FeeReceipt) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: FeeReceipt) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="View Receipt" onClick={() => setViewReceipt(row)}>
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Print Receipt" onClick={() => printReceipt(row)}>
            <Printer className="w-4 h-4 text-gray-600" />
          </Button>
          {row.paidAmount > 0 && (
            <Button variant="ghost" size="sm" title="Cancel Receipt" onClick={() => openCancel(row)}>
              <XCircle className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const noticeBanner = notice && (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Student fee details (after selecting a student in the list)
  // ═══════════════════════════════════════════════════════════════════════════

  if (selectedStudent) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedId(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Fee Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">All fee receipts for {fullName(selectedStudent)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={printAll} disabled={filteredReceipts.length === 0}>
              <Printer className="w-4 h-4 mr-2" /> Print All
            </Button>
            <Button variant="outline" onClick={exportStudentReceipts} disabled={filteredReceipts.length === 0}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {noticeBanner}

        {/* Student Info Card */}
        <Card className="p-6 bg-white border-l-4 border-l-blue-500">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{fullName(selectedStudent)}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                <Badge variant="secondary">{selectedStudent.regNo}</Badge>
                <span>
                  Class: {selectedStudent.class}-{selectedStudent.division}
                </span>
                <span>Roll No: {selectedStudent.rollNo}</span>
                <span>Father: {selectedStudent.fatherName}</span>
                <span>Contact: {selectedStudent.contact}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                <span>Centre: {selectedStudent.centre}</span>
                <span>Batch: {selectedStudent.batch}</span>
                <span>Fee Structure: {selectedStudent.feeStructure}</span>
                <span>Year: {selectedStudent.year}</span>
              </div>
            </div>
            <Badge
              variant={selectedStudent.status === 'Active' ? 'success' : 'danger'}
              className="text-sm px-3 py-1"
            >
              {selectedStudent.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {([
              ['Total Fee', inr(studentTotals.amount), 'text-gray-900'],
              ['Discount', inr(studentTotals.discount), 'text-green-600'],
              ['Paid', inr(studentTotals.paid), 'text-blue-600'],
              ['Balance', inr(studentTotals.balance), studentTotals.balance > 0 ? 'text-red-600' : 'text-green-600'],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                <div className="text-xs text-gray-500">{label}</div>
                <div className={`text-lg font-semibold ${color}`}>{value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs & Table */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-0">
            <Table columns={receiptColumns} data={filteredReceipts} />
            {filteredReceipts.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No receipts found for &ldquo;{activeTabLabel}&rdquo;</p>
                <p className="text-gray-400 text-sm mt-1">Try selecting a different tab to view receipts.</p>
              </div>
            )}
          </div>

          {/* Totals for the current tab */}
          {filteredReceipts.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <span className="text-gray-500">Total Records:</span>{' '}
                  <span className="font-semibold text-gray-900">{filteredReceipts.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Net Amount:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    {inr(filteredReceipts.reduce((t, r) => t + r.netAmount, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Paid:</span>{' '}
                  <span className="font-semibold text-green-600">
                    {inr(filteredReceipts.reduce((t, r) => t + r.paidAmount, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Balance:</span>{' '}
                  <span className="font-semibold text-red-600">
                    {inr(filteredReceipts.reduce((t, r) => t + r.balance, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Receipt View Modal */}
        {viewReceipt && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" /> Receipt {viewReceipt.receiptNo}
                </h3>
                <button
                  onClick={() => setViewReceipt(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-2 text-sm">
                {([
                  ['Student', `${fullName(selectedStudent)} (${selectedStudent.regNo})`],
                  ['Class', `${selectedStudent.class}-${selectedStudent.division}`],
                  ['Date', displayDate(viewReceipt.date)],
                  ['Fee Head', viewReceipt.feeHead],
                  ['Term', viewReceipt.term || '—'],
                  ['Amount', inr(viewReceipt.amount)],
                  ['Discount', inr(viewReceipt.discount)],
                  ['Net Amount', inr(viewReceipt.netAmount)],
                  ['Paid', inr(viewReceipt.paidAmount)],
                  ['Balance', inr(viewReceipt.balance)],
                  ['Payment Mode', modeText(viewReceipt.paymentMode)],
                  ['Status', viewReceipt.status],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
                {viewReceipt.cancelNote && (
                  <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                    {viewReceipt.cancelNote}
                  </p>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                {viewReceipt.paidAmount > 0 && (
                  <Button variant="outline" onClick={() => openCancel(viewReceipt)}>
                    <XCircle className="w-4 h-4 mr-2 text-red-500" /> Cancel Receipt
                  </Button>
                )}
                <Button variant="outline" onClick={() => printReceipt(viewReceipt)}>
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button variant="primary" onClick={() => setViewReceipt(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Receipt Modal */}
        {cancelTarget && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-16">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Cancel Receipt {cancelTarget.receiptNo}</h3>
                <button
                  onClick={() => setCancelTarget(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700">
                  {inr(cancelTarget.paidAmount)} paid by {modeText(cancelTarget.paymentMode)} for{' '}
                  {cancelTarget.feeHead} ({cancelTarget.term}) will be reversed and the fee line becomes Unpaid.
                </div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value)
                    if (cancelError) setCancelError('')
                  }}
                  rows={3}
                  placeholder="e.g. Cheque bounced / duplicate entry"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {cancelError && <p className="text-xs text-red-600">{cancelError}</p>}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <Button variant="outline" onClick={() => setCancelTarget(null)}>
                  Keep Receipt
                </Button>
                <Button variant="danger" onClick={confirmCancel}>
                  Confirm Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Student list (Fee Receipt & Discount List)
  // ═══════════════════════════════════════════════════════════════════════════

  const selectField = (label: string, field: keyof Filters, options: string[]) => (
    <Select
      label={label}
      options={options.map((o) => ({ value: o, label: o }))}
      value={filters[field]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(field, e.target.value)}
    />
  )

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Student Fee Process
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fee receipts &amp; discounts for all students — select a student to view their fee details
          </p>
        </div>
        <Button variant="outline" onClick={exportList} disabled={rows.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {noticeBanner}

      {/* Filters Card */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {selectField('Academic Year', 'academicYear', ACADEMIC_YEARS)}
          {selectField('Master Franchise', 'masterFranchise', MASTER_FRANCHISES)}
          {selectField('Centre', 'centre', CENTRES)}
          {selectField('Class', 'class', CLASSES)}
          {selectField('Division', 'division', DIVISIONS)}
          {selectField('Gender', 'gender', GENDERS)}
          {selectField('Active Status', 'active', ACTIVE_STATUS)}
          {selectField('Batch', 'batch', BATCHES)}
          {selectField('Term', 'term', TERMS)}
          <div className="lg:col-span-3">
            <Input
              label="Search Student"
              placeholder="Search by Name, Reg No or Contact..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch()
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary" onClick={runSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-2">
          <h2 className="font-semibold text-gray-800">
            Fee Receipt &amp; Discount List{' '}
            <span className="text-sm font-normal text-gray-500">({rows.length} students)</span>
          </h2>
          <span className="text-xs text-gray-500">
            {filters.term === 'All' ? 'Amounts for all terms' : `Amounts for ${filters.term}`} · click a row to open
            the student&rsquo;s fee details
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Reg No</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Fee Structure</th>
                <th className="px-4 py-3">Centre</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Final Amount</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                  <tr
                    key={row.student.id}
                    className="bg-white hover:bg-blue-50/40 cursor-pointer transition-colors"
                    onClick={() => openStudent(row.student.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') openStudent(row.student.id)
                    }}
                    tabIndex={0}
                    title="Open fee details"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.student.regNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.student.firstName}</td>
                    <td className="px-4 py-3 text-gray-700">{row.student.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{row.student.feeStructure}</td>
                    <td className="px-4 py-3 text-gray-600">{row.student.centre}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.student.class}-{row.student.division}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {filters.term === 'All' ? termsLabel(row.terms) : filters.term}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.student.year}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{inr(row.amount)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{inr(row.discount)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{inr(row.finalAmount)}</td>
                    <td className="px-4 py-3 text-right font-medium text-blue-600">{inr(row.paidAmount)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={row.status === 'Paid' ? 'success' : row.status === 'Partial' ? 'warning' : 'danger'}
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openStudent(row.student.id)
                        }}
                      >
                        View Fees <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-900">
                <tr>
                  <td className="px-4 py-3" colSpan={8}>
                    Total ({rows.length} students)
                  </td>
                  <td className="px-4 py-3 text-right">{inr(listTotals.amount)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{inr(listTotals.discount)}</td>
                  <td className="px-4 py-3 text-right">{inr(listTotals.finalAmount)}</td>
                  <td className="px-4 py-3 text-right text-blue-600">{inr(listTotals.paidAmount)}</td>
                  <td className="px-4 py-3 text-center text-xs font-normal text-gray-500" colSpan={2}>
                    Balance {inr(listTotals.finalAmount - listTotals.paidAmount)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          {rows.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No students found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting the filters or search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
