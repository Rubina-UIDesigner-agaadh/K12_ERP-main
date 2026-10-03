import React, { useMemo, useState, Fragment } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  IndianRupee,
  Plus,
  X,
  Trash2,
} from 'lucide-react'

// --- Types ---
interface FeeHead {
  name: string
  amount: number
}

interface RefundRequest {
  id: string
  regNo: string
  firstName: string
  lastName: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  refundAmount: number
  status: 'Pending' | 'Approved' | 'Rejected'
  gender: string
  active: string
  batch: string
  originalReceiptNo: string
  reason: string
  feeHeads: FeeHead[]
}

interface NewRefundForm {
  regNo: string
  firstName: string
  lastName: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  gender: string
  active: string
  batch: string
  originalReceiptNo: string
  reason: string
  feeHeads: FeeHead[]
}

// --- Mock Data ---
const MOCK_REFUNDS: RefundRequest[] = [
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
    refundAmount: 5000,
    status: 'Pending',
    gender: 'Male',
    active: 'Active',
    batch: 'Morning',
    originalReceiptNo: 'RCP-2024-1001',
    reason: 'Double payment made online',
    feeHeads: [{ name: 'Tuition Fee', amount: 5000 }],
  },
  {
    id: '2',
    regNo: 'REG-2024-045',
    firstName: 'Sneha',
    lastName: 'Gupta',
    centre: 'North Campus',
    class: '8',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    refundAmount: 15000,
    status: 'Approved',
    gender: 'Female',
    active: 'Inactive',
    batch: 'Morning',
    originalReceiptNo: 'RCP-2024-0892',
    reason: 'Student withdrawal (TC issued)',
    feeHeads: [
      { name: 'Tuition Fee', amount: 10000 },
      { name: 'Transport Fee', amount: 5000 },
    ],
  },
  {
    id: '3',
    regNo: 'REG-2024-112',
    firstName: 'Rohan',
    lastName: 'Verma',
    centre: 'Main Campus',
    class: '11',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    refundAmount: 2000,
    status: 'Pending',
    gender: 'Male',
    active: 'Active',
    batch: 'Afternoon',
    originalReceiptNo: 'RCP-2024-2105',
    reason: 'Excess fee collected for lab',
    feeHeads: [{ name: 'Lab Fee', amount: 2000 }],
  },
  {
    id: '4',
    regNo: 'REG-2024-078',
    firstName: 'Priya',
    lastName: 'Joshi',
    centre: 'South Campus',
    class: '9',
    division: 'C',
    term: 'Term 1',
    year: '2024-2025',
    refundAmount: 8000,
    status: 'Rejected',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
    originalReceiptNo: 'RCP-2024-0554',
    reason: 'Scholarship applied late',
    feeHeads: [{ name: 'Tuition Fee', amount: 8000 }],
  },
  {
    id: '5',
    regNo: 'REG-2024-201',
    firstName: 'Mohammed',
    lastName: 'Khan',
    centre: 'Main Campus',
    class: '12',
    division: 'A',
    term: 'Annual',
    year: '2024-2025',
    refundAmount: 3000,
    status: 'Pending',
    gender: 'Male',
    active: 'Active',
    batch: 'Evening',
    originalReceiptNo: 'RCP-2024-3012',
    reason: 'Transport route changed to closer zone',
    feeHeads: [{ name: 'Transport Fee', amount: 3000 }],
  },
]

const EMPTY_FORM: NewRefundForm = {
  regNo: '',
  firstName: '',
  lastName: '',
  centre: '',
  class: '',
  division: '',
  term: '',
  year: '2024-2025',
  gender: '',
  active: 'Active',
  batch: '',
  originalReceiptNo: '',
  reason: '',
  feeHeads: [{ name: '', amount: 0 }],
}

// Centre → master franchise (Main & North Campus are under MF 1, South Campus under MF 2)
const FRANCHISE_OF_CENTRE: Record<string, string> = {
  'Main Campus': 'MF1',
  'North Campus': 'MF1',
  'South Campus': 'MF2',
}

// --- Validation ---
function validateForm(form: NewRefundForm): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!form.regNo.trim()) errors.regNo = 'GR number is required'
  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required'
  if (!form.centre) errors.centre = 'Centre is required'
  if (!form.class) errors.class = 'Class is required'
  if (!form.division) errors.division = 'Division is required'
  if (!form.term) errors.term = 'Term is required'
  if (!form.year) errors.year = 'Academic year is required'
  if (!form.gender) errors.gender = 'Gender is required'
  if (!form.batch) errors.batch = 'Batch is required'
  if (!form.originalReceiptNo.trim())
    errors.originalReceiptNo = 'Receipt number is required'
  if (!form.reason.trim()) errors.reason = 'Reason is required'
  if (form.feeHeads.length === 0)
    errors.feeHeads = 'At least one fee head is required'
  form.feeHeads.forEach((fh, i) => {
    if (!fh.name.trim())
      errors[`feeHead_name_${i}`] = 'Fee head name is required'
    if (!fh.amount || fh.amount <= 0)
      errors[`feeHead_amount_${i}`] = 'Amount must be greater than 0'
  })
  return errors
}

export function FeeRefund() {
  // --- State ---
  const [refunds, setRefunds] = useState<RefundRequest[]>(MOCK_REFUNDS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [showNewRefundPanel, setShowNewRefundPanel] = useState(false)
  const [newRefundForm, setNewRefundForm] = useState<NewRefundForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: '',
    centre: '',
    class: '',
    division: '',
    gender: '',
    active: 'All',
    search: '',
    batch: '',
    term: '',
  })

  // --- Derived ---
  const totalRefundInForm = newRefundForm.feeHeads.reduce(
    (sum, fh) => sum + (Number(fh.amount) || 0),
    0,
  )

  // --- Filter Handlers ---
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      academicYear: '2024-2025',
      masterFranchise: '',
      centre: '',
      class: '',
      division: '',
      gender: '',
      active: 'All',
      search: '',
      batch: '',
      term: '',
    })
  }

  // --- Selection Handlers ---
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRefunds.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredRefunds.map((r) => r.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // --- Status Handlers ---
  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    )
  }

  const handleBulkAction = (newStatus: 'Approved' | 'Rejected') => {
    if (selectedIds.size === 0) return
    setRefunds((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) ? { ...r, status: newStatus } : r,
      ),
    )
    setSelectedIds(new Set())
    alert(`Successfully ${newStatus.toLowerCase()} ${selectedIds.size} requests.`)
  }

  // --- New Refund Form Handlers ---
  const handleOpenNewRefund = () => {
    setNewRefundForm(EMPTY_FORM)
    setFormErrors({})
    setFormSubmitted(false)
    setShowNewRefundPanel(true)
  }

  const handleCloseNewRefund = () => {
    setShowNewRefundPanel(false)
    setNewRefundForm(EMPTY_FORM)
    setFormErrors({})
    setFormSubmitted(false)
  }

  const handleFormChange = (field: keyof NewRefundForm, value: string) => {
    setNewRefundForm((prev) => ({ ...prev, [field]: value }))
    if (formSubmitted) {
      const updated = { ...newRefundForm, [field]: value }
      setFormErrors(validateForm(updated))
    }
  }

  const handleFeeHeadChange = (
    index: number,
    field: 'name' | 'amount',
    value: string,
  ) => {
    const updated = newRefundForm.feeHeads.map((fh, i) =>
      i === index
        ? { ...fh, [field]: field === 'amount' ? Number(value) : value }
        : fh,
    )
    setNewRefundForm((prev) => ({ ...prev, feeHeads: updated }))
    if (formSubmitted) {
      setFormErrors(validateForm({ ...newRefundForm, feeHeads: updated }))
    }
  }

  const handleAddFeeHead = () => {
    const updated = [...newRefundForm.feeHeads, { name: '', amount: 0 }]
    setNewRefundForm((prev) => ({ ...prev, feeHeads: updated }))
  }

  const handleRemoveFeeHead = (index: number) => {
    if (newRefundForm.feeHeads.length === 1) return
    const updated = newRefundForm.feeHeads.filter((_, i) => i !== index)
    setNewRefundForm((prev) => ({ ...prev, feeHeads: updated }))
    if (formSubmitted) {
      setFormErrors(validateForm({ ...newRefundForm, feeHeads: updated }))
    }
  }

  const handleSubmitNewRefund = () => {
    setFormSubmitted(true)
    const errors = validateForm(newRefundForm)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const newId = String(Date.now())
    const newRefund: RefundRequest = {
      id: newId,
      regNo: newRefundForm.regNo.trim(),
      firstName: newRefundForm.firstName.trim(),
      lastName: newRefundForm.lastName.trim(),
      centre: newRefundForm.centre,
      class: newRefundForm.class,
      division: newRefundForm.division,
      term: newRefundForm.term,
      year: newRefundForm.year,
      gender: newRefundForm.gender,
      active: newRefundForm.active,
      batch: newRefundForm.batch,
      originalReceiptNo: newRefundForm.originalReceiptNo.trim(),
      reason: newRefundForm.reason.trim(),
      feeHeads: newRefundForm.feeHeads,
      refundAmount: totalRefundInForm,
      status: 'Pending',
    }

    setRefunds((prev) => [newRefund, ...prev])
    handleCloseNewRefund()
  }

  // --- Filtering ---
  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      if (filters.academicYear && r.year !== filters.academicYear) return false
      if (
        filters.masterFranchise &&
        FRANCHISE_OF_CENTRE[r.centre] !== filters.masterFranchise
      )
        return false
      if (filters.centre && r.centre !== filters.centre) return false
      if (filters.class && r.class !== filters.class) return false
      if (filters.division && r.division !== filters.division) return false
      if (filters.gender && r.gender !== filters.gender) return false
      if (filters.active !== 'All' && r.active !== filters.active) return false
      if (filters.batch && r.batch !== filters.batch) return false
      if (filters.term && r.term !== filters.term) return false
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
        if (!fullName.includes(query) && !r.regNo.toLowerCase().includes(query))
          return false
      }
      return true
    })
  }, [refunds, filters])

  // --- Summary Calculations ---
  const totalRequests = refunds.length
  const pendingCount = refunds.filter((r) => r.status === 'Pending').length
  const approvedCount = refunds.filter((r) => r.status === 'Approved').length
  const rejectedCount = refunds.filter((r) => r.status === 'Rejected').length
  const totalRefundAmount = refunds
    .filter((r) => r.status === 'Approved')
    .reduce((sum, r) => sum + r.refundAmount, 0)

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-blue-600" />
            Fee Refund
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Process and manage fee refund requests
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenNewRefund}>
          <Plus className="w-4 h-4 mr-2" />
          New Refund Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500 mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">{totalRequests}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500 mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500 mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500 mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-indigo-500 bg-indigo-50">
          <div className="text-sm text-indigo-700 mb-1">Total Refunded</div>
          <div className="text-2xl font-bold text-indigo-900 flex items-center">
            <IndianRupee className="w-5 h-5" />
            {totalRefundAmount.toLocaleString()}
          </div>
        </Card>
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
              { value: '2024-2025', label: '2024-2025' },
              { value: '2023-2024', label: '2023-2024' },
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
                { value: '', label: 'All' },
                { value: 'MF1', label: 'MF 1' },
                { value: 'MF2', label: 'MF 2' },
              ]}
              value={filters.masterFranchise}
              onChange={(e) =>
                handleFilterChange('masterFranchise', e.target.value)
              }
            />
            <Select
              label="Centre"
              options={[
                { value: '', label: 'All Centres' },
                { value: 'Main Campus', label: 'Main Campus' },
                { value: 'North Campus', label: 'North Campus' },
                { value: 'South Campus', label: 'South Campus' },
              ]}
              value={filters.centre}
              onChange={(e) => handleFilterChange('centre', e.target.value)}
            />
            <Select
              label="Class"
              options={[
                { value: '', label: 'All Classes' },
                { value: '8', label: 'Class 8' },
                { value: '9', label: 'Class 9' },
                { value: '10', label: 'Class 10' },
                { value: '11', label: 'Class 11' },
                { value: '12', label: 'Class 12' },
              ]}
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            />
            <Select
              label="Division"
              options={[
                { value: '', label: 'All Divisions' },
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
              ]}
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
            />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'All Genders' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            />
            <Select
              label="Active Status"
              options={[
                { value: 'All', label: 'All' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={filters.active}
              onChange={(e) => handleFilterChange('active', e.target.value)}
            />
            <Select
              label="Batch"
              options={[
                { value: '', label: 'All Batches' },
                { value: 'Morning', label: 'Morning' },
                { value: 'Afternoon', label: 'Afternoon' },
                { value: 'Evening', label: 'Evening' },
              ]}
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
            />
            <Select
              label="Term"
              options={[
                { value: '', label: 'All Terms' },
                { value: 'Term 1', label: 'Term 1' },
                { value: 'Term 2', label: 'Term 2' },
                { value: 'Term 3', label: 'Term 3' },
                { value: 'Annual', label: 'Annual' },
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

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="font-medium text-lg">
              {selectedIds.size} Requests Selected
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setSelectedIds(new Set())}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleBulkAction('Rejected')}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Selected
            </Button>
            <Button
              variant="primary"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleBulkAction('Approved')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Content: Table + Side Panel */}
      <div className={`flex gap-6 ${showNewRefundPanel ? 'items-start' : ''}`}>
        {/* Table */}
        <div className={`flex-1 min-w-0 ${showNewRefundPanel ? 'w-0' : 'w-full'}`}>
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Refund Requests</h3>
              <span className="text-sm text-gray-500">
                {filteredRefunds.length} records found
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.size === filteredRefunds.length &&
                          filteredRefunds.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3">Student Details</th>
                    <th className="px-4 py-3">Academic Info</th>
                    <th className="px-4 py-3">Term / Year</th>
                    <th className="px-4 py-3">Refund Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRefunds.map((row) => (
                    <Fragment key={row.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(row.id)}
                            onChange={() => toggleSelect(row.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {row.firstName} {row.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{row.regNo}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{row.centre}</div>
                          <div className="text-xs text-gray-500">
                            Class {row.class}-{row.division}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{row.term}</div>
                          <div className="text-xs text-gray-500">{row.year}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-red-600 flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {row.refundAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              row.status === 'Pending'
                                ? 'warning'
                                : row.status === 'Approved'
                                  ? 'success'
                                  : 'danger'
                            }
                          >
                            {row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedRowId(
                                  expandedRowId === row.id ? null : row.id,
                                )
                              }
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            {row.status === 'Pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(row.id, 'Approved')
                                  }
                                  title="Approve"
                                  className="hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(row.id, 'Rejected')
                                  }
                                  title="Reject"
                                  className="hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Panel */}
                      {expandedRowId === row.id && (
                        <tr>
                          <td colSpan={7} className="p-0 border-b border-gray-200">
                            <div className="bg-blue-50/30 p-6 border-l-4 border-blue-500 shadow-inner">
                              <h4 className="font-semibold text-gray-900 mb-4">
                                Refund Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-xs text-gray-500 block">
                                      Original Receipt No
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {row.originalReceiptNo}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">
                                      Reason for Refund
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {row.reason}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">
                                      Batch
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {row.batch}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">
                                      Gender
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {row.gender}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">
                                      Active Status
                                    </span>
                                    <Badge
                                      variant={
                                        row.active === 'Active'
                                          ? 'success'
                                          : 'danger'
                                      }
                                    >
                                      {row.active}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 block mb-2">
                                    Fee Heads Breakdown
                                  </span>
                                  <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Fee Head
                                          </th>
                                          <th className="px-3 py-2 text-right font-medium text-gray-600">
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {row.feeHeads.map((head, idx) => (
                                          <tr key={idx}>
                                            <td className="px-3 py-2 text-gray-800">
                                              {head.name}
                                            </td>
                                            <td className="px-3 py-2 text-right font-medium text-gray-900">
                                              ₹{head.amount.toLocaleString()}
                                            </td>
                                          </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-bold">
                                          <td className="px-3 py-2 text-right text-gray-700">
                                            Total Refund:
                                          </td>
                                          <td className="px-3 py-2 text-right text-red-600">
                                            ₹{row.refundAmount.toLocaleString()}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRefunds.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No refund requests found</p>
                <p className="text-sm">Try adjusting your search filters.</p>
              </div>
            )}
          </Card>
        </div>

        {/* New Refund Request Side Panel */}
        {showNewRefundPanel && (
          <div className="w-full max-w-lg flex-shrink-0">
            <Card className="sticky top-4 overflow-hidden shadow-xl border border-blue-200">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-white" />
                  <h2 className="text-base font-semibold text-white">
                    New Refund Request
                  </h2>
                </div>
                <button
                  onClick={handleCloseNewRefund}
                  className="text-blue-200 hover:text-white transition-colors rounded-full p-1 hover:bg-blue-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[80vh] p-5 space-y-5">
                {/* Student Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200 uppercase tracking-wide">
                    Student Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        GR Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. REG-2024-001"
                        value={newRefundForm.regNo}
                        onChange={(e) => handleFormChange('regNo', e.target.value)}
                      />
                      {formErrors.regNo && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.regNo}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="First name"
                          value={newRefundForm.firstName}
                          onChange={(e) =>
                            handleFormChange('firstName', e.target.value)
                          }
                        />
                        {formErrors.firstName && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Last name"
                          value={newRefundForm.lastName}
                          onChange={(e) =>
                            handleFormChange('lastName', e.target.value)
                          }
                        />
                        {formErrors.lastName && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Select
                          label="Gender *"
                          options={[
                            { value: '', label: 'Select Gender' },
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                            { value: 'Other', label: 'Other' },
                          ]}
                          value={newRefundForm.gender}
                          onChange={(e) =>
                            handleFormChange('gender', e.target.value)
                          }
                        />
                        {formErrors.gender && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.gender}
                          </p>
                        )}
                      </div>
                      <div>
                        <Select
                          label="Active Status *"
                          options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                          ]}
                          value={newRefundForm.active}
                          onChange={(e) =>
                            handleFormChange('active', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200 uppercase tracking-wide">
                    Academic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Select
                        label="Centre *"
                        options={[
                          { value: '', label: 'Select Centre' },
                          { value: 'Main Campus', label: 'Main Campus' },
                          { value: 'North Campus', label: 'North Campus' },
                          { value: 'South Campus', label: 'South Campus' },
                        ]}
                        value={newRefundForm.centre}
                        onChange={(e) =>
                          handleFormChange('centre', e.target.value)
                        }
                      />
                      {formErrors.centre && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.centre}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Select
                          label="Class *"
                          options={[
                            { value: '', label: 'Select Class' },
                            { value: '8', label: 'Class 8' },
                            { value: '9', label: 'Class 9' },
                            { value: '10', label: 'Class 10' },
                            { value: '11', label: 'Class 11' },
                            { value: '12', label: 'Class 12' },
                          ]}
                          value={newRefundForm.class}
                          onChange={(e) =>
                            handleFormChange('class', e.target.value)
                          }
                        />
                        {formErrors.class && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.class}
                          </p>
                        )}
                      </div>
                      <div>
                        <Select
                          label="Division *"
                          options={[
                            { value: '', label: 'Select Division' },
                            { value: 'A', label: 'A' },
                            { value: 'B', label: 'B' },
                            { value: 'C', label: 'C' },
                          ]}
                          value={newRefundForm.division}
                          onChange={(e) =>
                            handleFormChange('division', e.target.value)
                          }
                        />
                        {formErrors.division && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.division}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Select
                          label="Batch *"
                          options={[
                            { value: '', label: 'Select Batch' },
                            { value: 'Morning', label: 'Morning' },
                            { value: 'Afternoon', label: 'Afternoon' },
                            { value: 'Evening', label: 'Evening' },
                          ]}
                          value={newRefundForm.batch}
                          onChange={(e) =>
                            handleFormChange('batch', e.target.value)
                          }
                        />
                        {formErrors.batch && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.batch}
                          </p>
                        )}
                      </div>
                      <div>
                        <Select
                          label="Academic Year *"
                          options={[
                            { value: '2024-2025', label: '2024-2025' },
                            { value: '2023-2024', label: '2023-2024' },
                          ]}
                          value={newRefundForm.year}
                          onChange={(e) =>
                            handleFormChange('year', e.target.value)
                          }
                        />
                        {formErrors.year && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.year}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Select
                        label="Term *"
                        options={[
                          { value: '', label: 'Select Term' },
                          { value: 'Term 1', label: 'Term 1' },
                          { value: 'Term 2', label: 'Term 2' },
                          { value: 'Term 3', label: 'Term 3' },
                          { value: 'Annual', label: 'Annual' },
                        ]}
                        value={newRefundForm.term}
                        onChange={(e) => handleFormChange('term', e.target.value)}
                      />
                      {formErrors.term && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.term}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Refund Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200 uppercase tracking-wide">
                    Refund Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Original Receipt No <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. RCP-2024-1001"
                        value={newRefundForm.originalReceiptNo}
                        onChange={(e) =>
                          handleFormChange('originalReceiptNo', e.target.value)
                        }
                      />
                      {formErrors.originalReceiptNo && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.originalReceiptNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Reason for Refund <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe the reason for refund..."
                        value={newRefundForm.reason}
                        onChange={(e) =>
                          handleFormChange('reason', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      {formErrors.reason && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Heads */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Fee Heads <span className="text-red-500">*</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddFeeHead}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Fee Head
                    </button>
                  </div>

                  {formErrors.feeHeads && (
                    <p className="text-xs text-red-500 mb-2">
                      {formErrors.feeHeads}
                    </p>
                  )}

                  <div className="space-y-2">
                    {newRefundForm.feeHeads.map((fh, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Fee head name (e.g. Tuition Fee)"
                            value={fh.name}
                            onChange={(e) =>
                              handleFeeHeadChange(index, 'name', e.target.value)
                            }
                          />
                          {formErrors[`feeHead_name_${index}`] && (
                            <p className="text-xs text-red-500">
                              {formErrors[`feeHead_name_${index}`]}
                            </p>
                          )}
                          <Input
                            type="number"
                            placeholder="Amount (₹)"
                            value={fh.amount === 0 ? '' : String(fh.amount)}
                            onChange={(e) =>
                              handleFeeHeadChange(
                                index,
                                'amount',
                                e.target.value,
                              )
                            }
                            leftIcon={<IndianRupee className="w-4 h-4 text-gray-400" />}
                          />
                          {formErrors[`feeHead_amount_${index}`] && (
                            <p className="text-xs text-red-500">
                              {formErrors[`feeHead_amount_${index}`]}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeeHead(index)}
                          disabled={newRefundForm.feeHeads.length === 1}
                          className="mt-1 p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total Preview */}
                  {totalRefundInForm > 0 && (
                    <div className="mt-3 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                      <span className="text-sm font-medium text-red-700">
                        Total Refund Amount
                      </span>
                      <span className="text-base font-bold text-red-700 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {totalRefundInForm.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Footer */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseNewRefund}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitNewRefund}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
