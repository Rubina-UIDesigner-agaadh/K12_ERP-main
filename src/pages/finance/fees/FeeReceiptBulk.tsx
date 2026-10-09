import React, { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Receipt,
  Users,
  IndianRupee,
  X,
  Printer,
  FileText,
  AlertCircle,
  User,
} from 'lucide-react'
// --- Types ---
interface BulkStudent {
  id: string
  regNo: string
  firstName: string
  lastName: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  amount: number
  discount: number
  finalAmount: number
  payingAmount: number
  paymentMode: string
  gender: string
  active: string
  batch: string
}
// --- Mock Data ---
const MOCK_STUDENTS: BulkStudent[] = [
  {
    id: '1',
    regNo: 'REG-2024-001',
    firstName: 'Aarav',
    lastName: 'Patel',
    centre: 'Main Campus',
    class: '10',
    division: 'A',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discount: 0,
    finalAmount: 25000,
    payingAmount: 25000,
    paymentMode: 'Cash',
    gender: 'Male',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '2',
    regNo: 'REG-2024-002',
    firstName: 'Isha',
    lastName: 'Sharma',
    centre: 'North Campus',
    class: '9',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 22000,
    discount: 2000,
    finalAmount: 20000,
    payingAmount: 20000,
    paymentMode: 'Online',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '3',
    regNo: 'REG-2024-003',
    firstName: 'Rohan',
    lastName: 'Verma',
    centre: 'Main Campus',
    class: '11',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 30000,
    discount: 0,
    finalAmount: 30000,
    payingAmount: 30000,
    paymentMode: 'Cheque',
    gender: 'Male',
    active: 'Active',
    batch: 'Afternoon',
  },
  {
    id: '4',
    regNo: 'REG-2024-004',
    firstName: 'Meera',
    lastName: 'Singh',
    centre: 'South Campus',
    class: '8',
    division: 'C',
    term: 'Term 1',
    year: '2024-2025',
    amount: 18000,
    discount: 0,
    finalAmount: 18000,
    payingAmount: 18000,
    paymentMode: 'UPI',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '5',
    regNo: 'REG-2024-005',
    firstName: 'Mohammed',
    lastName: 'Khan',
    centre: 'Main Campus',
    class: '10',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discount: 5000,
    finalAmount: 20000,
    payingAmount: 20000,
    paymentMode: 'Bank Transfer',
    gender: 'Male',
    active: 'Active',
    batch: 'Evening',
  },
  {
    id: '6',
    regNo: 'REG-2024-006',
    firstName: 'Priya',
    lastName: 'Joshi',
    centre: 'North Campus',
    class: '12',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 35000,
    discount: 0,
    finalAmount: 35000,
    payingAmount: 35000,
    paymentMode: 'Card',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
]
const PAYMENT_MODES = [
  'Cash',
  'Cheque',
  'Online',
  'UPI',
  'Card',
  'Bank Transfer',
]

// Payment reference details captured per student row (cheque / transaction / card)
interface PayRef {
  chequeNo?: string
  chequeDate?: string
  bankName?: string
  txnId?: string
  cardLast4?: string
  transferDate?: string
}

// One receipt produced by a bulk generation run
interface BulkReceipt {
  id: string
  receiptNo: string
  batchNo: string
  date: string
  studentId: string
  regNo: string
  studentName: string
  gender: string
  centre: string
  franchise: string
  className: string
  batch: string
  term: string
  year: string
  amount: number
  discount: number
  finalAmount: number
  paidBefore: number
  paidNow: number
  balanceAfter: number
  paymentMode: string
  ref: PayRef
  generatedBy: string
}

const GENERATED_BY = 'Admin'

// Centre → master franchise (Main & North Campus are under MF 1, South Campus under MF 2)
const FRANCHISE_OF_CENTRE: Record<string, string> = {
  'Main Campus': 'MF1',
  'North Campus': 'MF1',
  'South Campus': 'MF2',
}
const FRANCHISE_LABEL: Record<string, string> = { MF1: 'MF 1', MF2: 'MF 2' }

// Receipts from an earlier bulk run (sample history) — balances of these students start reduced
const SEED_RECEIPTS: BulkReceipt[] = [
  {
    id: 'br-41',
    receiptNo: 'BR-2024-00041',
    batchNo: 'BULK-2024-0007',
    date: '2024-07-18',
    studentId: '2',
    regNo: 'REG-2024-002',
    studentName: 'Isha Sharma',
    gender: 'Female',
    centre: 'North Campus',
    franchise: 'MF1',
    className: '9-B',
    batch: 'Morning',
    term: 'Term 1',
    year: '2024-2025',
    amount: 22000,
    discount: 2000,
    finalAmount: 20000,
    paidBefore: 0,
    paidNow: 10000,
    balanceAfter: 10000,
    paymentMode: 'Online',
    ref: { txnId: 'TXN88213409' },
    generatedBy: 'Fee Counter 1',
  },
  {
    id: 'br-42',
    receiptNo: 'BR-2024-00042',
    batchNo: 'BULK-2024-0007',
    date: '2024-07-18',
    studentId: '3',
    regNo: 'REG-2024-003',
    studentName: 'Rohan Verma',
    gender: 'Male',
    centre: 'Main Campus',
    franchise: 'MF1',
    className: '11-A',
    batch: 'Afternoon',
    term: 'Term 2',
    year: '2024-2025',
    amount: 30000,
    discount: 0,
    finalAmount: 30000,
    paidBefore: 0,
    paidNow: 15000,
    balanceAfter: 15000,
    paymentMode: 'Cheque',
    ref: { chequeNo: '004512', chequeDate: '2024-07-17', bankName: 'HDFC Bank' },
    generatedBy: 'Fee Counter 1',
  },
]

const paidSoFar = (receipts: BulkReceipt[], studentId: string) =>
  receipts.filter((r) => r.studentId === studentId).reduce((sum, r) => sum + r.paidNow, 0)

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const displayDate = (iso: string) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

// Next number in a "PREFIX-YYYY-000123" series
const nextSeq = (values: string[]) =>
  values.reduce((max, v) => Math.max(max, parseInt(v.split('-').pop() || '0', 10) || 0), 0) + 1

const refText = (mode: string, ref: PayRef = {}) => {
  const parts: string[] = []
  if (mode === 'Cheque') {
    if (ref.chequeNo) parts.push(`Cheque No ${ref.chequeNo}`)
    if (ref.chequeDate) parts.push(`dated ${displayDate(ref.chequeDate)}`)
    if (ref.bankName) parts.push(ref.bankName)
  } else if (mode === 'Online' || mode === 'UPI') {
    if (ref.txnId) parts.push(`Txn ${ref.txnId}`)
  } else if (mode === 'Card') {
    if (ref.cardLast4) parts.push(`Card ****${ref.cardLast4}`)
    if (ref.txnId) parts.push(`Txn ${ref.txnId}`)
  } else if (mode === 'Bank Transfer') {
    if (ref.bankName) parts.push(ref.bankName)
    if (ref.txnId) parts.push(`Txn ${ref.txnId}`)
    if (ref.transferDate) parts.push(`on ${displayDate(ref.transferDate)}`)
  }
  return parts.join(' · ')
}

// Amount in words (Indian numbering)
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
const twoDigits = (n: number) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`)
const threeDigits = (n: number) =>
  [Math.floor(n / 100) ? `${ONES[Math.floor(n / 100)]} Hundred` : '', n % 100 ? twoDigits(n % 100) : '']
    .filter(Boolean)
    .join(' ')
const amountInWords = (num: number): string => {
  let n = Math.floor(Math.abs(num))
  if (n === 0) return 'Zero'
  const crore = Math.floor(n / 10000000)
  n %= 10000000
  const lakh = Math.floor(n / 100000)
  n %= 100000
  const thousand = Math.floor(n / 1000)
  n %= 1000
  return [
    crore ? `${threeDigits(crore)} Crore` : '',
    lakh ? `${twoDigits(lakh)} Lakh` : '',
    thousand ? `${twoDigits(thousand)} Thousand` : '',
    n ? threeDigits(n) : '',
  ]
    .filter(Boolean)
    .join(' ')
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c],
  )

// Printable / downloadable HTML — one receipt per page
const receiptSection = (r: BulkReceipt) => {
  const ref = refText(r.paymentMode, r.ref)
  return `<section class="rc">
<div class="hd"><h1>ABC International School</h1><p>Fee Receipt (Bulk)</p></div>
<div class="meta"><div><strong>Receipt No:</strong> ${escapeHtml(r.receiptNo)}</div><div><strong>Date:</strong> ${escapeHtml(displayDate(r.date))}</div><div><strong>Batch:</strong> ${escapeHtml(r.batchNo)}</div></div>
<div class="grid">
<div><span>Student:</span> <strong>${escapeHtml(r.studentName)}</strong></div>
<div><span>Reg No:</span> ${escapeHtml(r.regNo)}</div>
<div><span>Class:</span> ${escapeHtml(r.className)}</div>
<div><span>Centre:</span> ${escapeHtml(r.centre)} (${escapeHtml(FRANCHISE_LABEL[r.franchise] || r.franchise)})</div>
<div><span>Term / Year:</span> ${escapeHtml(r.term)} · ${escapeHtml(r.year)}</div>
<div><span>Batch:</span> ${escapeHtml(r.batch)}</div>
</div>
<table><tbody>
<tr><td>Fee Amount (${escapeHtml(r.term)})</td><td class="num">${inr(r.amount)}</td></tr>
<tr><td>Discount</td><td class="num">- ${inr(r.discount)}</td></tr>
<tr><td>Net Payable</td><td class="num">${inr(r.finalAmount)}</td></tr>
<tr><td>Paid Earlier</td><td class="num">${inr(r.paidBefore)}</td></tr>
<tr class="total"><td>Amount Received (this receipt)</td><td class="num">${inr(r.paidNow)}</td></tr>
<tr><td>Balance After This Receipt</td><td class="num">${inr(r.balanceAfter)}</td></tr>
</tbody></table>
<p class="words"><strong>Rupees ${escapeHtml(amountInWords(r.paidNow))} Only</strong></p>
<p class="words">Payment Mode: <strong>${escapeHtml(r.paymentMode)}</strong>${ref ? ` · ${escapeHtml(ref)}` : ''}</p>
<div class="foot"><div>Generated by: ${escapeHtml(r.generatedBy)}</div><div>Authorised Signatory</div></div>
</section>`
}

const receiptsDocument = (title: string, list: BulkReceipt[]) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px}
.rc{max-width:720px;margin:0 auto 32px;border:1px solid #d1d5db;border-radius:8px;padding:24px;page-break-after:always}
.rc:last-child{page-break-after:auto}
.hd{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:16px}
.hd h1{margin:0;font-size:20px;color:#1e3a8a}.hd p{margin:4px 0 0;font-size:12px;color:#6b7280}
.meta{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:13px;margin-bottom:16px}
.grid span{color:#6b7280}
table{width:100%;border-collapse:collapse;font-size:13px}
td{border:1px solid #e5e7eb;padding:6px 8px}.num{text-align:right}
.total td{font-weight:bold;background:#eff6ff}
.words{font-size:12px;margin:10px 0}
.foot{display:flex;justify-content:space-between;margin-top:40px;font-size:12px;color:#374151}
@media print{body{margin:0}.rc{border:none;margin:0 auto}}
</style></head><body>${list.map(receiptSection).join('')}</body></html>`

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

const downloadFile = (fileName: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function FeeReceiptBulk() {
  // --- State ---
  const [bulkReceipts, setBulkReceipts] = useState<BulkReceipt[]>(SEED_RECEIPTS)
  // Paying amount starts at each student's outstanding balance
  const [students, setStudents] = useState<BulkStudent[]>(() =>
    MOCK_STUDENTS.map((s) => ({
      ...s,
      payingAmount: Math.max(0, s.finalAmount - paidSoFar(SEED_RECEIPTS, s.id)),
    })),
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [payRefs, setPayRefs] = useState<Record<string, PayRef>>({})
  const [genErrors, setGenErrors] = useState<string[]>([])
  const [lastBatch, setLastBatch] = useState<{ batchNo: string; count: number; total: number } | null>(null)
  const [viewStudentId, setViewStudentId] = useState<string | null>(null)
  const [viewReceipt, setViewReceipt] = useState<BulkReceipt | null>(null)
  const [receiptSel, setReceiptSel] = useState<Set<string>>(new Set())
  const [receiptBatch, setReceiptBatch] = useState('')
  const [receiptSearch, setReceiptSearch] = useState('')

  // Amount already received per student (from generated receipts)
  const paidMap = useMemo(() => {
    const m: Record<string, number> = {}
    bulkReceipts.forEach((r) => {
      m[r.studentId] = (m[r.studentId] || 0) + r.paidNow
    })
    return m
  }, [bulkReceipts])
  const balanceOf = (s: BulkStudent) => Math.max(0, s.finalAmount - (paidMap[s.id] || 0))
  // Filters
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: '',
    centre: '',
    class: '',
    division: '',
    gender: '',
    active: 'Active',
    search: '',
    batch: '',
    term: '',
  })
  // --- Handlers ---
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleResetFilters = () => {
    setFilters({
      academicYear: '2024-2025',
      masterFranchise: '',
      centre: '',
      class: '',
      division: '',
      gender: '',
      active: 'Active',
      search: '',
      batch: '',
      term: '',
    })
  }
  const toggleSelectAll = () => {
    const selectable = filteredStudents.filter((s) => balanceOf(s) > 0)
    if (selectable.length > 0 && selectable.every((s) => selectedIds.has(s.id))) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(selectable.map((s) => s.id)))
    }
  }
  const toggleSelect = (id: string) => {
    const st = students.find((s) => s.id === id)
    if (!st || balanceOf(st) <= 0) return
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }
  const handlePayingAmountChange = (id: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              // cannot collect more than the outstanding balance
              payingAmount: Math.min(numValue, balanceOf(s)),
            }
          : s,
      ),
    )
  }
  const handleRefChange = (id: string, field: keyof PayRef, value: string) => {
    setPayRefs((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }
  const handlePaymentModeChange = (id: string, value: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              paymentMode: value,
            }
          : s,
      ),
    )
  }
  const handleGenerateReceipts = () => {
    const chosen = students.filter((s) => selectedIds.has(s.id))
    if (chosen.length === 0) {
      setGenErrors(['Please select at least one student.'])
      return
    }
    const problems: string[] = []
    chosen.forEach((s) => {
      const name = `${s.firstName} ${s.lastName}`
      const bal = balanceOf(s)
      const ref = payRefs[s.id] || {}
      if (bal <= 0) problems.push(`${name}: fee is already fully paid.`)
      else if (!s.payingAmount || s.payingAmount <= 0)
        problems.push(`${name}: paying amount must be greater than ₹0.`)
      else if (s.payingAmount > bal)
        problems.push(`${name}: paying amount exceeds the balance of ${inr(bal)}.`)
      if (s.paymentMode === 'Card' && ref.cardLast4 && !/^\d{4}$/.test(ref.cardLast4))
        problems.push(`${name}: card last 4 digits must be exactly 4 numbers.`)
    })
    if (problems.length > 0) {
      setGenErrors(problems)
      return
    }
    const date = todayISO()
    const year = date.slice(0, 4)
    const batchNo = `BULK-${year}-${String(nextSeq(bulkReceipts.map((r) => r.batchNo))).padStart(4, '0')}`
    let receiptSeq = nextSeq(bulkReceipts.map((r) => r.receiptNo))
    const stamp = Date.now()
    const created: BulkReceipt[] = chosen.map((s) => {
      const paidBefore = paidMap[s.id] || 0
      const receipt: BulkReceipt = {
        id: `br-${stamp}-${s.id}`,
        receiptNo: `BR-${year}-${String(receiptSeq).padStart(5, '0')}`,
        batchNo,
        date,
        studentId: s.id,
        regNo: s.regNo,
        studentName: `${s.firstName} ${s.lastName}`,
        gender: s.gender,
        centre: s.centre,
        franchise: FRANCHISE_OF_CENTRE[s.centre] || '',
        className: `${s.class}-${s.division}`,
        batch: s.batch,
        term: s.term,
        year: s.year,
        amount: s.amount,
        discount: s.discount,
        finalAmount: s.finalAmount,
        paidBefore,
        paidNow: s.payingAmount,
        balanceAfter: s.finalAmount - paidBefore - s.payingAmount,
        paymentMode: s.paymentMode,
        ref: { ...(payRefs[s.id] || {}) },
        generatedBy: GENERATED_BY,
      }
      receiptSeq += 1
      return receipt
    })
    const total = created.reduce((sum, r) => sum + r.paidNow, 0)
    setBulkReceipts((prev) => [...created, ...prev])
    // next collection defaults to the remaining balance
    setStudents((prev) =>
      prev.map((s) => {
        const r = created.find((c) => c.studentId === s.id)
        return r ? { ...s, payingAmount: r.balanceAfter } : s
      }),
    )
    setPayRefs((prev) => {
      const next = { ...prev }
      created.forEach((r) => delete next[r.studentId])
      return next
    })
    setSelectedIds(new Set())
    setGenErrors([])
    setLastBatch({ batchNo, count: created.length, total })
    // focus the receipts section on the batch just generated
    setReceiptBatch(batchNo)
    setReceiptSearch('')
    setReceiptSel(new Set())
  }
  // --- Filtering ---
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.academicYear && s.year !== filters.academicYear) return false
      if (filters.masterFranchise && FRANCHISE_OF_CENTRE[s.centre] !== filters.masterFranchise)
        return false
      if (filters.centre && s.centre !== filters.centre) return false
      if (filters.class && s.class !== filters.class) return false
      if (filters.division && s.division !== filters.division) return false
      if (filters.gender && s.gender !== filters.gender) return false
      if (filters.active && s.active !== filters.active) return false
      if (filters.batch && s.batch !== filters.batch) return false
      if (filters.term && s.term !== filters.term) return false
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase()
        if (
          !fullName.includes(query) &&
          !s.regNo.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      return true
    })
  }, [students, filters])
  // --- Summary Calculations ---
  const selectedStudentsList = students.filter((s) => selectedIds.has(s.id))
  const totalPayingAmount = selectedStudentsList.reduce(
    (sum, s) => sum + s.payingAmount,
    0,
  )
  const selectableFiltered = filteredStudents.filter((s) => balanceOf(s) > 0)
  const allSelectableChecked =
    selectableFiltered.length > 0 && selectableFiltered.every((s) => selectedIds.has(s.id))
  const viewStudent = students.find((s) => s.id === viewStudentId) || null
  const viewPaid = viewStudent ? paidMap[viewStudent.id] || 0 : 0
  const viewBalance = viewStudent ? balanceOf(viewStudent) : 0
  const viewHistory = viewStudent ? bulkReceipts.filter((r) => r.studentId === viewStudent.id) : []
  const viewRef = viewStudent ? refText(viewStudent.paymentMode, payRefs[viewStudent.id]) : ''

  // --- Bulk generated receipts section ---
  const batchOptions = useMemo(
    () => Array.from(new Set(bulkReceipts.map((r) => r.batchNo))),
    [bulkReceipts],
  )
  const filteredReceipts = useMemo(() => {
    const q = receiptSearch.trim().toLowerCase()
    return bulkReceipts.filter((r) => {
      if (receiptBatch && r.batchNo !== receiptBatch) return false
      if (q && ![r.receiptNo, r.batchNo, r.studentName, r.regNo].some((v) => v.toLowerCase().includes(q)))
        return false
      return true
    })
  }, [bulkReceipts, receiptBatch, receiptSearch])
  const selectedReceipts = filteredReceipts.filter((r) => receiptSel.has(r.id))
  // bulk actions work on the ticked receipts, or on every listed receipt when none is ticked
  const actionReceipts = selectedReceipts.length > 0 ? selectedReceipts : filteredReceipts
  const allReceiptsChecked =
    filteredReceipts.length > 0 && filteredReceipts.every((r) => receiptSel.has(r.id))
  const toggleReceipt = (id: string) => {
    setReceiptSel((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleAllReceipts = () => {
    setReceiptSel(allReceiptsChecked ? new Set() : new Set(filteredReceipts.map((r) => r.id)))
  }
  const docTitle = (list: BulkReceipt[]) =>
    list.length === 1
      ? `Fee Receipt ${list[0].receiptNo}`
      : `Bulk Fee Receipts (${list.length})${receiptBatch ? ` - ${receiptBatch}` : ''}`
  const fileStem = () =>
    `${receiptBatch || `bulk-receipts-${todayISO()}`}${selectedReceipts.length > 0 ? '-selected' : ''}`
  const printReceipts = (list: BulkReceipt[]) => {
    if (list.length > 0) printDocument(receiptsDocument(docTitle(list), list))
  }
  const downloadReceipts = (list: BulkReceipt[], fileName: string) => {
    if (list.length > 0)
      downloadFile(fileName, receiptsDocument(docTitle(list), list), 'text/html;charset=utf-8')
  }
  const exportReceiptsCsv = (list: BulkReceipt[]) => {
    if (list.length === 0) return
    const header =
      'Receipt No,Batch No,Date,Reg No,Student,Class,Centre,Master Franchise,Term,Year,Final Amount,Paid Earlier,Paid Now,Balance After,Payment Mode,Reference,Generated By'
    const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
    const rows = list.map((r) =>
      [
        r.receiptNo, r.batchNo, r.date, r.regNo, r.studentName, r.className, r.centre,
        FRANCHISE_LABEL[r.franchise] || r.franchise, r.term, r.year, r.finalAmount, r.paidBefore,
        r.paidNow, r.balanceAfter, r.paymentMode, refText(r.paymentMode, r.ref), r.generatedBy,
      ]
        .map(cell)
        .join(','),
    )
    downloadFile(`${fileStem()}.csv`, `${header}\n${rows.join('\n')}`, 'text/csv;charset=utf-8')
  }
  const batchReceipts = (batchNo: string) => bulkReceipts.filter((r) => r.batchNo === batchNo)
  const scrollToReceipts = () => {
    const el = document.getElementById('bulk-generated-receipts')
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // --- Table Columns ---
  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={allSelectableChecked}
          onChange={toggleSelectAll}
          aria-label="Select all students with a balance"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (row: BulkStudent) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelect(row.id)}
          disabled={balanceOf(row) <= 0}
          title={balanceOf(row) <= 0 ? 'Fee fully paid' : 'Select for bulk receipt'}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      key: 'student',
      header: 'Student Details',
      render: (row: BulkStudent) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-xs text-gray-500">{row.regNo}</div>
        </div>
      ),
    },
    {
      key: 'academic',
      header: 'Academic Info',
      render: (row: BulkStudent) => (
        <div>
          <div className="text-sm text-gray-900">{row.centre}</div>
          <div className="text-xs text-gray-500">
            Class {row.class}-{row.division}
          </div>
        </div>
      ),
    },
    {
      key: 'feeInfo',
      header: 'Fee Info',
      render: (row: BulkStudent) => (
        <div>
          <div className="text-sm text-gray-900">{row.term}</div>
          <div className="text-xs text-gray-500">{row.year}</div>
        </div>
      ),
    },
    {
      key: 'amounts',
      header: 'Amounts',
      render: (row: BulkStudent) => (
        <div className="text-right">
          <div className="text-xs text-gray-500 line-through">
            ₹{row.amount.toLocaleString()}
          </div>
          {row.discount > 0 && (
            <div className="text-xs text-green-600">
              -₹{row.discount.toLocaleString()}
            </div>
          )}
          <div className="font-medium text-gray-900">
            ₹{row.finalAmount.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600">
            Paid: ₹{(paidMap[row.id] || 0).toLocaleString()}
          </div>
          <div
            className={`text-xs font-medium ${balanceOf(row) > 0 ? 'text-red-600' : 'text-green-600'}`}
          >
            Balance: ₹{balanceOf(row).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'payingAmount',
      header: 'Paying Amount',
      render: (row: BulkStudent) =>
        balanceOf(row) <= 0 ? (
          <Badge variant="success">Fully Paid</Badge>
        ) : (
          <div className="w-32">
            <Input
              type="number"
              min={0}
              max={balanceOf(row)}
              value={row.payingAmount}
              onChange={(e) => handlePayingAmountChange(row.id, e.target.value)}
              className="text-right"
            />
          </div>
        ),
    },
    {
      key: 'paymentMode',
      header: 'Payment Mode',
      render: (row: BulkStudent) => (
        <div className="w-48 space-y-2">
          <Select
            options={PAYMENT_MODES.map((m) => ({
              value: m,
              label: m,
            }))}
            value={row.paymentMode}
            onChange={(e) => handlePaymentModeChange(row.id, e.target.value)}
          />
          {row.paymentMode === 'Cheque' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input
                placeholder="Cheque No"
                className="text-sm"
                value={payRefs[row.id]?.chequeNo || ''}
                onChange={(e) => handleRefChange(row.id, 'chequeNo', e.target.value)}
              />
              <Input
                type="date"
                className="text-sm"
                value={payRefs[row.id]?.chequeDate || ''}
                onChange={(e) => handleRefChange(row.id, 'chequeDate', e.target.value)}
              />
              <Input
                placeholder="Bank Name"
                className="text-sm"
                value={payRefs[row.id]?.bankName || ''}
                onChange={(e) => handleRefChange(row.id, 'bankName', e.target.value)}
              />
            </div>
          )}
          {(row.paymentMode === 'Online' || row.paymentMode === 'UPI') && (
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <Input
                placeholder="Transaction ID"
                className="text-sm"
                value={payRefs[row.id]?.txnId || ''}
                onChange={(e) => handleRefChange(row.id, 'txnId', e.target.value)}
              />
            </div>
          )}
          {row.paymentMode === 'Card' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input
                placeholder="Card Last 4 Digits"
                maxLength={4}
                className="text-sm"
                value={payRefs[row.id]?.cardLast4 || ''}
                onChange={(e) => handleRefChange(row.id, 'cardLast4', e.target.value.replace(/\D/g, ''))}
              />
              <Input
                placeholder="Transaction ID"
                className="text-sm"
                value={payRefs[row.id]?.txnId || ''}
                onChange={(e) => handleRefChange(row.id, 'txnId', e.target.value)}
              />
            </div>
          )}
          {row.paymentMode === 'Bank Transfer' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input
                placeholder="Bank Name"
                className="text-sm"
                value={payRefs[row.id]?.bankName || ''}
                onChange={(e) => handleRefChange(row.id, 'bankName', e.target.value)}
              />
              <Input
                placeholder="Transaction ID"
                className="text-sm"
                value={payRefs[row.id]?.txnId || ''}
                onChange={(e) => handleRefChange(row.id, 'txnId', e.target.value)}
              />
              <Input
                type="date"
                className="text-sm"
                value={payRefs[row.id]?.transferDate || ''}
                onChange={(e) => handleRefChange(row.id, 'transferDate', e.target.value)}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: BulkStudent) => (
        <Button
          variant="ghost"
          size="sm"
          title="View Details"
          onClick={() => setViewStudentId(row.id)}
        >
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>
      ),
    },
  ]
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Bulk Fee Receipt
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate fee receipts for multiple students at once
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Student Name or Reg No..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <Select
            options={[
              {
                value: '2024-2025',
                label: '2024-2025',
              },
              {
                value: '2023-2024',
                label: '2023-2024',
              },
            ]}
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
            {showFilters ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Select
              label="Master Franchise"
              options={[
                {
                  value: '',
                  label: 'All',
                },
                {
                  value: 'MF1',
                  label: 'MF 1',
                },
                {
                  value: 'MF2',
                  label: 'MF 2',
                },
              ]}
              value={filters.masterFranchise}
              onChange={(e) =>
                handleFilterChange('masterFranchise', e.target.value)
              }
            />
            <Select
              label="Centre"
              options={[
                {
                  value: '',
                  label: 'All Centres',
                },
                {
                  value: 'Main Campus',
                  label: 'Main Campus',
                },
                {
                  value: 'North Campus',
                  label: 'North Campus',
                },
                {
                  value: 'South Campus',
                  label: 'South Campus',
                },
              ]}
              value={filters.centre}
              onChange={(e) => handleFilterChange('centre', e.target.value)}
            />
            <Select
              label="Class"
              options={[
                {
                  value: '',
                  label: 'All Classes',
                },
                {
                  value: '8',
                  label: 'Class 8',
                },
                {
                  value: '9',
                  label: 'Class 9',
                },
                {
                  value: '10',
                  label: 'Class 10',
                },
                {
                  value: '11',
                  label: 'Class 11',
                },
                {
                  value: '12',
                  label: 'Class 12',
                },
              ]}
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            />
            <Select
              label="Division"
              options={[
                {
                  value: '',
                  label: 'All Divisions',
                },
                {
                  value: 'A',
                  label: 'A',
                },
                {
                  value: 'B',
                  label: 'B',
                },
                {
                  value: 'C',
                  label: 'C',
                },
              ]}
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
            />
            <Select
              label="Gender"
              options={[
                {
                  value: '',
                  label: 'All Genders',
                },
                {
                  value: 'Male',
                  label: 'Male',
                },
                {
                  value: 'Female',
                  label: 'Female',
                },
                {
                  value: 'Other',
                  label: 'Other',
                },
              ]}
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            />
            <Select
              label="Active Status"
              options={[
                {
                  value: 'All',
                  label: 'All',
                },
                {
                  value: 'Active',
                  label: 'Active',
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                },
              ]}
              value={filters.active}
              onChange={(e) => handleFilterChange('active', e.target.value)}
            />
            <Select
              label="Batch"
              options={[
                {
                  value: '',
                  label: 'All Batches',
                },
                {
                  value: 'Morning',
                  label: 'Morning',
                },
                {
                  value: 'Afternoon',
                  label: 'Afternoon',
                },
                {
                  value: 'Evening',
                  label: 'Evening',
                },
              ]}
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
            />
            <Select
              label="Term"
              options={[
                {
                  value: '',
                  label: 'All Terms',
                },
                {
                  value: 'Term 1',
                  label: 'Term 1',
                },
                {
                  value: 'Term 2',
                  label: 'Term 2',
                },
                {
                  value: 'Term 3',
                  label: 'Term 3',
                },
                {
                  value: 'Annual',
                  label: 'Annual',
                },
              ]}
              value={filters.term}
              onChange={(e) => handleFilterChange('term', e.target.value)}
            />
            <div className="flex items-end gap-2 lg:col-span-2">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Generation result */}
      {lastBatch && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-green-800 text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>
              Batch <strong>{lastBatch.batchNo}</strong> generated: {lastBatch.count} receipt(s)
              totalling <strong>{inr(lastBatch.total)}</strong>.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => printReceipts(batchReceipts(lastBatch.batchNo))}
            >
              <Printer className="w-4 h-4 mr-1" /> Print Batch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadReceipts(batchReceipts(lastBatch.batchNo), `${lastBatch.batchNo}.html`)
              }
            >
              <Download className="w-4 h-4 mr-1" /> Download Batch
            </Button>
            <Button variant="ghost" size="sm" onClick={scrollToReceipts}>
              View Receipts
            </Button>
            <Button variant="ghost" size="sm" title="Dismiss" onClick={() => setLastBatch(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Validation errors */}
      {genErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Receipts not generated — please fix:
            </span>
            <button
              onClick={() => setGenErrors([])}
              className="p-1 hover:bg-red-100 rounded"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="list-disc pl-6 space-y-0.5">
            {genErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              <span className="font-medium text-lg">
                {selectedIds.size} Students Selected
              </span>
            </div>
            <div className="h-8 w-px bg-blue-200"></div>
            <div className="flex items-center gap-2 text-blue-900">
              <span className="text-sm text-blue-700">
                Total Paying Amount:
              </span>
              <span className="font-bold text-xl flex items-center">
                <IndianRupee className="w-5 h-5" />
                {totalPayingAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setSelectedIds(new Set())}>
              <X className="w-4 h-4 mr-2" />
              Clear Selection
            </Button>
            <Button variant="primary" onClick={handleGenerateReceipts}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Generate Bulk Receipts
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Students List</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tick students with a balance, adjust paying amount &amp; mode, then generate bulk receipts
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {filteredStudents.length} records found
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredStudents} />
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search filters.</p>
          </div>
        )}
      </Card>

      {/* Bulk Generated Receipts */}
      <Card className="overflow-hidden">
        <div
          id="bulk-generated-receipts"
          className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" /> Bulk Generated Receipts
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredReceipts.length} receipt(s) ·{' '}
              {inr(filteredReceipts.reduce((sum, r) => sum + r.paidNow, 0))} collected
              {selectedReceipts.length > 0 && ` · ${selectedReceipts.length} selected`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-60">
              <Input
                placeholder="Search receipt, batch or student..."
                value={receiptSearch}
                onChange={(e) => setReceiptSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div className="w-56">
              <Select
                options={[
                  { value: '', label: `All Batches (${bulkReceipts.length})` },
                  ...batchOptions.map((b) => ({
                    value: b,
                    label: `${b} (${batchReceipts(b).length})`,
                  })),
                ]}
                value={receiptBatch}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setReceiptBatch(e.target.value)
                  setReceiptSel(new Set())
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => printReceipts(actionReceipts)}
              disabled={actionReceipts.length === 0}
            >
              <Printer className="w-4 h-4 mr-1" />
              {selectedReceipts.length > 0 ? `Print Selected (${selectedReceipts.length})` : 'Print All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadReceipts(actionReceipts, `${fileStem()}.html`)}
              disabled={actionReceipts.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              {selectedReceipts.length > 0
                ? `Download Selected (${selectedReceipts.length})`
                : 'Download All'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportReceiptsCsv(actionReceipts)}
              disabled={actionReceipts.length === 0}
            >
              <FileText className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>
        </div>
        {filteredReceipts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Receipt className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">
              {bulkReceipts.length === 0 ? 'No bulk receipts generated yet' : 'No receipts match the search'}
            </p>
            <p className="text-sm">Select students above and click “Generate Bulk Receipts”.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      aria-label="Select all receipts"
                      checked={allReceiptsChecked}
                      onChange={toggleAllReceipts}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Receipt No</th>
                  <th className="px-4 py-3 text-left font-medium">Batch</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Class / Centre</th>
                  <th className="px-4 py-3 text-left font-medium">Term</th>
                  <th className="px-4 py-3 text-right font-medium">Paid Now</th>
                  <th className="px-4 py-3 text-right font-medium">Balance After</th>
                  <th className="px-4 py-3 text-left font-medium">Mode / Reference</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReceipts.map((r) => (
                  <tr
                    key={r.id}
                    className={receiptSel.has(r.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50'}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${r.receiptNo}`}
                        checked={receiptSel.has(r.id)}
                        onChange={() => toggleReceipt(r.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">{r.receiptNo}</td>
                    <td className="px-4 py-3 text-gray-600">{r.batchNo}</td>
                    <td className="px-4 py-3 text-gray-600">{displayDate(r.date)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{r.studentName}</div>
                      <div className="text-xs text-gray-500">{r.regNo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{r.className}</div>
                      <div className="text-xs text-gray-500">{r.centre}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.term}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      {inr(r.paidNow)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${r.balanceAfter > 0 ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {inr(r.balanceAfter)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{r.paymentMode}</div>
                      <div className="text-xs text-gray-500">{refText(r.paymentMode, r.ref) || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" title="View Receipt" onClick={() => setViewReceipt(r)}>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Print Receipt" onClick={() => printReceipts([r])}>
                          <Printer className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Download Receipt"
                          onClick={() => downloadReceipts([r], `${r.receiptNo}.html`)}
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View: student details + fee details */}
      <Modal
        isOpen={!!viewStudent}
        onClose={() => setViewStudentId(null)}
        title="Student & Fee Details"
        size="xl"
        footer={
          viewStudent && (
            <div className="flex justify-end gap-2">
              {viewBalance > 0 && (
                <Button
                  variant={selectedIds.has(viewStudent.id) ? 'outline' : 'primary'}
                  onClick={() => toggleSelect(viewStudent.id)}
                >
                  {selectedIds.has(viewStudent.id) ? 'Remove from Bulk Selection' : 'Add to Bulk Selection'}
                </Button>
              )}
              <Button variant="outline" onClick={() => setViewStudentId(null)}>
                Close
              </Button>
            </div>
          )
        }
      >
        {viewStudent && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">
                  {viewStudent.firstName} {viewStudent.lastName}
                </h4>
                <p className="text-sm text-gray-500">
                  {viewStudent.regNo} · Class {viewStudent.class}-{viewStudent.division}
                </p>
              </div>
              <Badge variant={viewStudent.active === 'Active' ? 'success' : 'danger'}>
                {viewStudent.active}
              </Badge>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Student Details
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {([
                  ['Reg No', viewStudent.regNo],
                  ['Gender', viewStudent.gender],
                  ['Academic Year', viewStudent.year],
                  ['Master Franchise', FRANCHISE_LABEL[FRANCHISE_OF_CENTRE[viewStudent.centre]] || '—'],
                  ['Centre', viewStudent.centre],
                  ['Class / Division', `${viewStudent.class}-${viewStudent.division}`],
                  ['Batch', viewStudent.batch],
                  ['Status', viewStudent.active],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500">{k}</div>
                    <div className="font-medium text-gray-900">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Fee Details
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {([
                  ['Term', viewStudent.term],
                  ['Fee Amount', inr(viewStudent.amount)],
                  ['Discount', inr(viewStudent.discount)],
                  ['Final Amount', inr(viewStudent.finalAmount)],
                  ['Paid So Far', inr(viewPaid)],
                  ['Balance', inr(viewBalance)],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="border border-gray-200 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500">{k}</div>
                    <div
                      className={`font-semibold ${
                        k === 'Balance' ? (viewBalance > 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-900'
                      }`}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {viewBalance > 0 ? (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                  Next receipt: <strong>{inr(viewStudent.payingAmount)}</strong> via{' '}
                  <strong>{viewStudent.paymentMode}</strong>
                  {viewRef ? ` · ${viewRef}` : ''}
                  {selectedIds.has(viewStudent.id) ? ' · selected for bulk generation' : ''}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  Fee fully paid for {viewStudent.term}.
                </div>
              )}
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Receipts Generated ({viewHistory.length})
              </h5>
              {viewHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No receipts generated yet for this student.</p>
              ) : (
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Receipt No</th>
                      <th className="px-3 py-2 text-left font-medium">Batch</th>
                      <th className="px-3 py-2 text-left font-medium">Date</th>
                      <th className="px-3 py-2 text-right font-medium">Paid</th>
                      <th className="px-3 py-2 text-left font-medium">Mode</th>
                      <th className="px-3 py-2 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewHistory.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2 text-blue-600 font-medium">{r.receiptNo}</td>
                        <td className="px-3 py-2 text-gray-600">{r.batchNo}</td>
                        <td className="px-3 py-2 text-gray-600">{displayDate(r.date)}</td>
                        <td className="px-3 py-2 text-right font-medium">{inr(r.paidNow)}</td>
                        <td className="px-3 py-2 text-gray-600">{r.paymentMode}</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center gap-1">
                            <Button variant="ghost" size="sm" title="View Receipt" onClick={() => setViewReceipt(r)}>
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Print Receipt" onClick={() => printReceipts([r])}>
                              <Printer className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt preview */}
      <Modal
        isOpen={!!viewReceipt}
        onClose={() => setViewReceipt(null)}
        title={viewReceipt ? `Receipt ${viewReceipt.receiptNo}` : 'Receipt'}
        size="lg"
        footer={
          viewReceipt && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => downloadReceipts([viewReceipt], `${viewReceipt.receiptNo}.html`)}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="outline" onClick={() => printReceipts([viewReceipt])}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="primary" onClick={() => setViewReceipt(null)}>
                Close
              </Button>
            </div>
          )
        }
      >
        {viewReceipt && (
          <div className="space-y-4 text-sm">
            <div className="text-center border-b-2 border-blue-600 pb-3">
              <h4 className="text-lg font-bold text-blue-900">ABC International School</h4>
              <p className="text-xs text-gray-500">Fee Receipt (Bulk)</p>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-xs">
              <span>
                <strong>Receipt No:</strong> {viewReceipt.receiptNo}
              </span>
              <span>
                <strong>Date:</strong> {displayDate(viewReceipt.date)}
              </span>
              <span>
                <strong>Batch:</strong> {viewReceipt.batchNo}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div>
                <span className="text-gray-500">Student:</span> <strong>{viewReceipt.studentName}</strong>
              </div>
              <div>
                <span className="text-gray-500">Reg No:</span> {viewReceipt.regNo}
              </div>
              <div>
                <span className="text-gray-500">Class:</span> {viewReceipt.className}
              </div>
              <div>
                <span className="text-gray-500">Centre:</span> {viewReceipt.centre} (
                {FRANCHISE_LABEL[viewReceipt.franchise] || viewReceipt.franchise})
              </div>
              <div>
                <span className="text-gray-500">Term / Year:</span> {viewReceipt.term} · {viewReceipt.year}
              </div>
              <div>
                <span className="text-gray-500">Batch:</span> {viewReceipt.batch}
              </div>
            </div>
            <table className="w-full text-xs border border-gray-200">
              <tbody className="divide-y divide-gray-100">
                {([
                  [`Fee Amount (${viewReceipt.term})`, inr(viewReceipt.amount)],
                  ['Discount', `- ${inr(viewReceipt.discount)}`],
                  ['Net Payable', inr(viewReceipt.finalAmount)],
                  ['Paid Earlier', inr(viewReceipt.paidBefore)],
                  ['Amount Received (this receipt)', inr(viewReceipt.paidNow)],
                  ['Balance After This Receipt', inr(viewReceipt.balanceAfter)],
                ] as [string, string][]).map(([k, v]) => (
                  <tr key={k} className={k.startsWith('Amount Received') ? 'bg-blue-50 font-semibold' : ''}>
                    <td className="px-3 py-2">{k}</td>
                    <td className="px-3 py-2 text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs">
              <strong>Rupees {amountInWords(viewReceipt.paidNow)} Only</strong>
            </p>
            <p className="text-xs">
              Payment Mode: <strong>{viewReceipt.paymentMode}</strong>
              {refText(viewReceipt.paymentMode, viewReceipt.ref)
                ? ` · ${refText(viewReceipt.paymentMode, viewReceipt.ref)}`
                : ''}
            </p>
            <div className="flex justify-between text-xs text-gray-500 pt-4">
              <span>Generated by: {viewReceipt.generatedBy}</span>
              <span>Authorised Signatory</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
