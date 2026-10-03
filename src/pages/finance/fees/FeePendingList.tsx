import React, { useState, Fragment } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  XCircle,
  Eye,
  Bell,
  Calendar,
  AlertTriangle,
  Send,
  MessageSquare,
} from 'lucide-react'

// --- Types ---
interface UnpaidFeeDetail {
  id: string
  feeHead: string
  amount: number
  dueDate: string
}

interface PendingStudent {
  id: string
  regNo: string
  firstName: string
  lastName: string
  feeStructure: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  amount: number
  discountAmount: number
  finalAmount: number
  paidAmount: number
  pendingAmount: number
  status: 'Overdue' | 'Due Soon' | 'Unpaid' | 'Partially Paid'
  unpaidDetails: UnpaidFeeDetail[]
}

// --- Mock Data ---
const MOCK_PENDING: PendingStudent[] = [
  {
    id: '1',
    regNo: 'REG-2024-015',
    firstName: 'Vikram',
    lastName: 'Singh',
    feeStructure: 'Regular',
    centre: 'Main Campus',
    class: '8',
    division: 'C',
    term: 'Term 2',
    year: '2024-2025',
    amount: 35000,
    discountAmount: 0,
    finalAmount: 35000,
    paidAmount: 10000,
    pendingAmount: 25000,
    status: 'Overdue',
    unpaidDetails: [
      {
        id: 'ud1',
        feeHead: 'Tuition Fee',
        amount: 15000,
        dueDate: '2024-08-15',
      },
      {
        id: 'ud2',
        feeHead: 'Transport Fee',
        amount: 10000,
        dueDate: '2024-08-15',
      },
    ],
  },
  {
    id: '2',
    regNo: 'REG-2024-022',
    firstName: 'Ananya',
    lastName: 'Gupta',
    feeStructure: 'Regular',
    centre: 'North Campus',
    class: '7',
    division: 'B',
    term: 'Term 2',
    year: '2024-2025',
    amount: 19300,
    discountAmount: 0,
    finalAmount: 19300,
    paidAmount: 0,
    pendingAmount: 19300,
    status: 'Unpaid',
    unpaidDetails: [
      {
        id: 'ud3',
        feeHead: 'Tuition Fee',
        amount: 12000,
        dueDate: '2024-09-01',
      },
      {
        id: 'ud4',
        feeHead: 'Development Fee',
        amount: 7300,
        dueDate: '2024-09-01',
      },
    ],
  },
  {
    id: '3',
    regNo: 'REG-2024-038',
    firstName: 'Arjun',
    lastName: 'Patel',
    feeStructure: 'OBC Concession',
    centre: 'South Campus',
    class: '10',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 22000,
    discountAmount: 2000,
    finalAmount: 20000,
    paidAmount: 15000,
    pendingAmount: 5000,
    status: 'Partially Paid',
    unpaidDetails: [
      {
        id: 'ud5',
        feeHead: 'Tuition Fee Balance',
        amount: 5000,
        dueDate: '2024-10-15',
      },
    ],
  },
  {
    id: '4',
    regNo: 'REG-2024-045',
    firstName: 'Sneha',
    lastName: 'Reddy',
    feeStructure: 'Regular',
    centre: 'Main Campus',
    class: '9',
    division: 'A',
    term: 'Term 3',
    year: '2024-2025',
    amount: 24500,
    discountAmount: 0,
    finalAmount: 24500,
    paidAmount: 0,
    pendingAmount: 24500,
    status: 'Due Soon',
    unpaidDetails: [
      {
        id: 'ud6',
        feeHead: 'Tuition Fee',
        amount: 15000,
        dueDate: '2024-12-10',
      },
      {
        id: 'ud7',
        feeHead: 'Transport Fee',
        amount: 9500,
        dueDate: '2024-12-10',
      },
    ],
  },
  {
    id: '5',
    regNo: 'REG-2024-051',
    firstName: 'Karan',
    lastName: 'Malhotra',
    feeStructure: 'Regular',
    centre: 'North Campus',
    class: '11',
    division: 'Commerce',
    term: 'Term 2',
    year: '2024-2025',
    amount: 28000,
    discountAmount: 0,
    finalAmount: 28000,
    paidAmount: 14000,
    pendingAmount: 14000,
    status: 'Overdue',
    unpaidDetails: [
      {
        id: 'ud8',
        feeHead: 'Tuition Fee Balance',
        amount: 14000,
        dueDate: '2024-08-30',
      },
    ],
  },
  {
    id: '6',
    regNo: 'REG-2024-063',
    firstName: 'Priya',
    lastName: 'Desai',
    feeStructure: 'Staff Ward',
    centre: 'Main Campus',
    class: '6',
    division: 'C',
    term: 'Term 2',
    year: '2024-2025',
    amount: 18000,
    discountAmount: 9000,
    finalAmount: 9000,
    paidAmount: 0,
    pendingAmount: 9000,
    status: 'Unpaid',
    unpaidDetails: [
      {
        id: 'ud9',
        feeHead: 'Tuition Fee (Discounted)',
        amount: 9000,
        dueDate: '2024-09-15',
      },
    ],
  },
  {
    id: '7',
    regNo: 'REG-2024-072',
    firstName: 'Rohan',
    lastName: 'Mehta',
    feeStructure: 'Regular',
    centre: 'South Campus',
    class: '12',
    division: 'Science',
    term: 'Term 2',
    year: '2024-2025',
    amount: 32000,
    discountAmount: 0,
    finalAmount: 32000,
    paidAmount: 16000,
    pendingAmount: 16000,
    status: 'Partially Paid',
    unpaidDetails: [
      {
        id: 'ud10',
        feeHead: 'Tuition Fee Balance',
        amount: 10000,
        dueDate: '2024-09-20',
      },
      {
        id: 'ud11',
        feeHead: 'Lab Fee',
        amount: 6000,
        dueDate: '2024-09-20',
      },
    ],
  },
  {
    id: '8',
    regNo: 'REG-2024-089',
    firstName: 'Kavya',
    lastName: 'Nair',
    feeStructure: 'Sibling Discount',
    centre: 'North Campus',
    class: '9',
    division: 'B',
    term: 'Term 2',
    year: '2024-2025',
    amount: 26000,
    discountAmount: 2600,
    finalAmount: 23400,
    paidAmount: 0,
    pendingAmount: 23400,
    status: 'Due Soon',
    unpaidDetails: [
      {
        id: 'ud12',
        feeHead: 'Tuition Fee (Discounted)',
        amount: 15400,
        dueDate: '2024-11-15',
      },
      {
        id: 'ud13',
        feeHead: 'Activity Fee',
        amount: 8000,
        dueDate: '2024-11-15',
      },
    ],
  },
]

// --- Filter Options ---
const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023']
const MASTER_FRANCHISES = ['All', 'Main Franchise', 'North Franchise']
const CENTRES = ['All', 'Main Campus', 'North Campus', 'South Campus']
const CLASSES = ['All', '6', '7', '8', '9', '10', '11', '12']
const DIVISIONS = ['All', 'A', 'B', 'C', 'Science', 'Commerce']
const GENDERS = ['All', 'Male', 'Female', 'Other']
const ACTIVE_STATUS = ['All', 'Active', 'Inactive']
const BATCHES = ['All', 'Morning', 'Afternoon', 'Evening']
const TERMS = ['All', 'Term 1', 'Term 2', 'Term 3', 'Annual']
const FEE_STATUS = ['All', 'Partially Paid', 'Unpaid', 'Overdue', 'Due Soon']

export function FeePendingList() {
  // --- State ---
  const [filters, setFilters] = useState({
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
    feeStatus: 'All',
  })

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [activeReminderPanel, setActiveReminderPanel] = useState<string | null>(
    null,
  )

  // Reminder Form State
  const [reminderModes, setReminderModes] = useState({
    sms: true,
    email: true,
    whatsapp: false,
  })
  const [reminderRecipient, setReminderRecipient] = useState('both')
  const [reminderMessage, setReminderMessage] = useState('')

  // --- Handlers ---
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleReset = () => {
    setFilters({
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
      feeStatus: 'All',
    })
  }

  const toggleRow = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null)
      setActiveReminderPanel(null)
    } else {
      setExpandedRowId(id)
      setActiveReminderPanel(null)
    }
  }

  const openReminderPanel = (student: PendingStudent, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveReminderPanel(student.id)
    setReminderMessage(
      `Dear Parent, this is a reminder that a fee amount of ₹${student.pendingAmount.toLocaleString()} is pending for your ward ${student.firstName} ${student.lastName} (Class ${student.class}-${student.division}). Please arrange to pay at the earliest to avoid late fees. Regards, School Admin.`,
    )
  }

  const handleSendReminder = (student: PendingStudent) => {
    console.log('Sending reminder to:', student.firstName, student.lastName)
    console.log('Modes:', reminderModes)
    console.log('Recipient:', reminderRecipient)
    console.log('Message:', reminderMessage)
    setActiveReminderPanel(null)
    alert(
      `Reminder sent successfully to ${student.firstName} ${student.lastName}'s parents!`,
    )
  }

  // --- Filter Logic ---
  const filteredPending = MOCK_PENDING.filter((student) => {
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const nameMatch = `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(query)
      const regMatch = student.regNo.toLowerCase().includes(query)
      if (!nameMatch && !regMatch) return false
    }
    if (filters.academicYear !== 'All' && student.year !== filters.academicYear)
      return false
    if (filters.centre !== 'All' && student.centre !== filters.centre)
      return false
    if (filters.class !== 'All' && student.class !== filters.class) return false
    if (filters.division !== 'All' && student.division !== filters.division)
      return false
    if (filters.term !== 'All' && student.term !== filters.term) return false
    if (filters.feeStatus !== 'All' && student.status !== filters.feeStatus)
      return false
    return true
  })

  // --- Helpers ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Overdue':
        return <Badge variant="danger">Overdue</Badge>
      case 'Due Soon':
        return <Badge variant="info">Due Soon</Badge>
      case 'Unpaid':
        return <Badge variant="danger">Unpaid</Badge>
      case 'Partially Paid':
        return <Badge variant="warning">Partially Paid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Pending List</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage unpaid and partially paid student fees
        </p>
      </div>

      {/* Filters Card */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Academic Year"
            options={ACADEMIC_YEARS.map((y) => ({
              value: y,
              label: y,
            }))}
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          />
          <Select
            label="Master Franchise"
            options={MASTER_FRANCHISES.map((f) => ({
              value: f,
              label: f,
            }))}
            value={filters.masterFranchise}
            onChange={(e) =>
              handleFilterChange('masterFranchise', e.target.value)
            }
          />
          <Select
            label="Centre"
            options={CENTRES.map((c) => ({
              value: c,
              label: c,
            }))}
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
          />
          <Select
            label="Class"
            options={CLASSES.map((c) => ({
              value: c,
              label: c === 'All' ? 'All Classes' : `Class ${c}`,
            }))}
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
          />
          <Select
            label="Division"
            options={DIVISIONS.map((d) => ({
              value: d,
              label: d === 'All' ? 'All Divisions' : d,
            }))}
            value={filters.division}
            onChange={(e) => handleFilterChange('division', e.target.value)}
          />
          <Select
            label="Gender"
            options={GENDERS.map((g) => ({
              value: g,
              label: g,
            }))}
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          />
          <Select
            label="Active Status"
            options={ACTIVE_STATUS.map((s) => ({
              value: s,
              label: s,
            }))}
            value={filters.active}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          />
          <Select
            label="Batch"
            options={BATCHES.map((b) => ({
              value: b,
              label: b,
            }))}
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
          />
          <Select
            label="Term"
            options={TERMS.map((t) => ({
              value: t,
              label: t,
            }))}
            value={filters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
          />
          <Select
            label="Fee Status"
            options={FEE_STATUS.map((s) => ({
              value: s,
              label: s,
            }))}
            value={filters.feeStatus}
            onChange={(e) => handleFilterChange('feeStatus', e.target.value)}
          />
          <div className="lg:col-span-2">
            <Input
              label="Search Student"
              placeholder="Search by Name or Reg No..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden">
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
                <th className="px-4 py-3 text-right">Pending Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPending.map((student) => (
                <Fragment key={student.id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      expandedRowId === student.id ? 'bg-blue-50/30' : 'bg-white'
                    }`}
                    onClick={() => toggleRow(student.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {student.regNo}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {student.firstName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {student.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {student.feeStructure}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.centre}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {student.class}-{student.division}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.term}</td>
                    <td className="px-4 py-3 text-gray-600">{student.year}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{student.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      ₹{student.discountAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ₹{student.finalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600">
                      ₹{student.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      ₹{student.pendingAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusBadge(student.status)}
                        {expandedRowId === student.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Panel */}
                  {expandedRowId === student.id && (
                    <tr>
                      <td colSpan={14} className="p-0 border-b border-gray-200">
                        <div className="bg-blue-50/30 p-6 shadow-inner">
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-4 gap-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Class {student.class}-{student.division} | Reg
                                  No: {student.regNo}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {student.paidAmount > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={<Eye className="w-4 h-4" />}
                                  >
                                    View Receipt
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  leftIcon={<XCircle className="w-4 h-4" />}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  leftIcon={<Bell className="w-4 h-4" />}
                                  onClick={(e) => openReminderPanel(student, e)}
                                >
                                  Send Reminder
                                </Button>
                              </div>
                            </div>

                            {/* Unpaid Details Table */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />{' '}
                                Unpaid Fee Details
                              </h4>
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                      <th className="px-4 py-2 font-medium text-gray-700">
                                        Fee Head
                                      </th>
                                      <th className="px-4 py-2 font-medium text-gray-700">
                                        Due Date
                                      </th>
                                      <th className="px-4 py-2 font-medium text-gray-700 text-right">
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {student.unpaidDetails.map((detail) => (
                                      <tr key={detail.id}>
                                        <td className="px-4 py-2 text-gray-800">
                                          {detail.feeHead}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(
                                              detail.dueDate,
                                            ).toLocaleDateString('en-IN')}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium text-red-600">
                                          ₹{detail.amount.toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="bg-red-50/50 font-bold">
                                      <td
                                        colSpan={2}
                                        className="px-4 py-2 text-right text-gray-900"
                                      >
                                        Total Pending:
                                      </td>
                                      <td className="px-4 py-2 text-right text-red-600">
                                        ₹
                                        {student.pendingAmount.toLocaleString()}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Send Reminder Inline Panel */}
                            {activeReminderPanel === student.id && (
                              <div className="mt-6 border border-indigo-100 bg-indigo-50/50 rounded-lg p-5 animate-in fade-in slide-in-from-top-4">
                                <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" /> Compose
                                  Reminder
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                  {/* Communication Mode */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Mode of Communication
                                    </label>
                                    <div className="flex flex-col gap-2">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={reminderModes.sms}
                                          onChange={(e) =>
                                            setReminderModes({
                                              ...reminderModes,
                                              sms: e.target.checked,
                                            })
                                          }
                                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          SMS
                                        </span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={reminderModes.email}
                                          onChange={(e) =>
                                            setReminderModes({
                                              ...reminderModes,
                                              email: e.target.checked,
                                            })
                                          }
                                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          Email
                                        </span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={reminderModes.whatsapp}
                                          onChange={(e) =>
                                            setReminderModes({
                                              ...reminderModes,
                                              whatsapp: e.target.checked,
                                            })
                                          }
                                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          WhatsApp
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  {/* Recipient */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Recipient
                                    </label>
                                    <div className="flex flex-col gap-2">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`recipient-${student.id}`}
                                          value="mother"
                                          checked={
                                            reminderRecipient === 'mother'
                                          }
                                          onChange={(e) =>
                                            setReminderRecipient(e.target.value)
                                          }
                                          className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          Mother
                                        </span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`recipient-${student.id}`}
                                          value="father"
                                          checked={
                                            reminderRecipient === 'father'
                                          }
                                          onChange={(e) =>
                                            setReminderRecipient(e.target.value)
                                          }
                                          className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          Father
                                        </span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`recipient-${student.id}`}
                                          value="both"
                                          checked={reminderRecipient === 'both'}
                                          onChange={(e) =>
                                            setReminderRecipient(e.target.value)
                                          }
                                          className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          Both Parents
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Message Preview */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Preview
                                  </label>
                                  <textarea
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                                    value={reminderMessage}
                                    onChange={(e) =>
                                      setReminderMessage(e.target.value)
                                    }
                                  />
                                </div>

                                <div className="flex justify-end gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setActiveReminderPanel(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    leftIcon={<Send className="w-4 h-4" />}
                                    onClick={() => handleSendReminder(student)}
                                  >
                                    Send Reminder
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}

              {filteredPending.length === 0 && (
                <tr>
                  <td
                    colSpan={14}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No pending fees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}