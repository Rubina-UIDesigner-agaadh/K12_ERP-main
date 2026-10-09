import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  UserCheck,
} from 'lucide-react'
interface Student {
  id: string
  regNo: string
  name: string
  class: string
  division: string
  status: string
}
interface DiscountRequest {
  id: string
  regNo: string
  studentName: string
  class: string
  division: string
  feeHead: string
  amount: number
  reason: string
  requestedBy: string
  date: string
  status: 'Pending' | 'Approved' | 'Rejected'
}
const FEE_HEADS = [
  'Admission Fee',
  'Tuition Fee',
  'Examination Fee',
  'Study Material Fee',
  'Library Fee',
  'Transport Fee',
  'Other',
]
const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    regNo: 'REG-2024-001',
    name: 'Aarav Patel',
    class: '10',
    division: 'A',
    status: 'Active',
  },
  {
    id: 's2',
    regNo: 'REG-2024-045',
    name: 'Sneha Gupta',
    class: '8',
    division: 'B',
    status: 'Active',
  },
  {
    id: 's3',
    regNo: 'REG-2024-112',
    name: 'Rohan Verma',
    class: '11',
    division: 'A',
    status: 'Active',
  },
  {
    id: 's4',
    regNo: 'REG-2024-078',
    name: 'Priya Joshi',
    class: '9',
    division: 'C',
    status: 'Active',
  },
  {
    id: 's5',
    regNo: 'REG-2024-156',
    name: 'Mohammed Khan',
    class: '10',
    division: 'B',
    status: 'Active',
  },
]
const MOCK_DISCOUNTS: DiscountRequest[] = [
  {
    id: '1',
    regNo: 'REG-2024-001',
    studentName: 'Aarav Patel',
    class: '10',
    division: 'A',
    feeHead: 'Tuition Fee',
    amount: 5000,
    reason: 'Sibling discount',
    requestedBy: 'Admin',
    date: '2024-10-15',
    status: 'Pending',
  },
  {
    id: '2',
    regNo: 'REG-2024-045',
    studentName: 'Sneha Gupta',
    class: '8',
    division: 'B',
    feeHead: 'Tuition Fee',
    amount: 15000,
    reason: 'Merit scholarship',
    requestedBy: 'Principal',
    date: '2024-10-14',
    status: 'Approved',
  },
  {
    id: '3',
    regNo: 'REG-2024-112',
    studentName: 'Rohan Verma',
    class: '11',
    division: 'A',
    feeHead: 'Admission Fee',
    amount: 2000,
    reason: 'Staff ward concession',
    requestedBy: 'HR Dept',
    date: '2024-10-12',
    status: 'Pending',
  },
  {
    id: '4',
    regNo: 'REG-2024-078',
    studentName: 'Priya Joshi',
    class: '9',
    division: 'C',
    feeHead: 'Tuition Fee',
    amount: 8000,
    reason: 'Financial hardship',
    requestedBy: 'Counselor',
    date: '2024-10-11',
    status: 'Pending',
  },
  {
    id: '5',
    regNo: 'REG-2024-156',
    studentName: 'Mohammed Khan',
    class: '10',
    division: 'B',
    feeHead: 'Examination Fee',
    amount: 3000,
    reason: 'Sports quota',
    requestedBy: 'Sports Dept',
    date: '2024-10-10',
    status: 'Rejected',
  },
]
export function AssignExemptionType() {
  const [activeTab, setActiveTab] = useState<'apply' | 'approve'>('apply')
  const [showFilters, setShowFilters] = useState(false)
  const [discounts, setDiscounts] = useState<DiscountRequest[]>(MOCK_DISCOUNTS)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  )
  const [feeHead, setFeeHead] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [discountReason, setDiscountReason] = useState('')
  const [givenBy, setGivenBy] = useState('')
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
    status: 'all',
  })
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleApplyDiscount = () => {
    if (
      !selectedStudentId ||
      !feeHead ||
      !discountAmount ||
      !discountReason ||
      !givenBy
    ) {
      alert('Please fill all fields.')
      return
    }
    const student = MOCK_STUDENTS.find((s) => s.id === selectedStudentId)
    if (!student) return
    const newDiscount: DiscountRequest = {
      id: Date.now().toString(),
      regNo: student.regNo,
      studentName: student.name,
      class: student.class,
      division: student.division,
      feeHead,
      amount: Number(discountAmount),
      reason: discountReason,
      requestedBy: givenBy,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    }
    setDiscounts([newDiscount, ...discounts])
    alert('Discount applied successfully and sent for approval.')
    setSelectedStudentId(null)
    setFeeHead('')
    setDiscountAmount('')
    setDiscountReason('')
    setGivenBy('')
  }
  const handleStatusChange = (
    id: string,
    newStatus: 'Approved' | 'Rejected',
  ) => {
    if (newStatus === 'Rejected') {
      const reason = prompt('Please enter a reason for rejection:')
      if (reason === null) return
    }
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
            }
          : d,
      ),
    )
  }
  const totalRequests = discounts.length
  const pendingCount = discounts.filter((d) => d.status === 'Pending').length
  const approvedCount = discounts.filter((d) => d.status === 'Approved').length
  const rejectedCount = discounts.filter((d) => d.status === 'Rejected').length
  const totalDiscountAmount = discounts
    .filter((d) => d.status === 'Approved')
    .reduce((sum, d) => sum + d.amount, 0)
  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      !filters.search ||
      s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(filters.search.toLowerCase()),
  )
  const filteredDiscounts = discounts.filter((d) => {
    const matchesStatus =
      filters.status === 'all' || d.status.toLowerCase() === filters.status
    const matchesSearch =
      !filters.search ||
      d.studentName
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      d.regNo.toLowerCase().includes(filters.search.toLowerCase())
    return matchesStatus && matchesSearch
  })
  const studentColumns = [
    {
      key: 'select',
      header: 'Select',
      render: (row: Student) => (
        <input
          type="radio"
          name="studentSelect"
          checked={selectedStudentId === row.id}
          onChange={() => setSelectedStudentId(row.id)}
          className="text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      key: 'regNo',
      header: 'Reg No',
      render: (row: Student) => (
        <span className="text-gray-600">{row.regNo}</span>
      ),
    },
    {
      key: 'name',
      header: 'Student Name',
      render: (row: Student) => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (row: Student) => <span>{row.class}</span>,
    },
    {
      key: 'division',
      header: 'Division',
      render: (row: Student) => <span>{row.division}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Student) => <Badge variant="success">{row.status}</Badge>,
    },
  ]
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-blue-600" />
          Fee Exemptions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Apply fee exemptions and review, approve or reject requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'apply'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Apply Exemption
        </button>
        <button
          onClick={() => setActiveTab('approve')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'approve'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Approve / Reject Exemptions
          {pendingCount > 0 && (
            <span className="ml-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'apply' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500 mb-1">Total Requests</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalRequests}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="text-sm text-gray-500 mb-1">
                Pending Approval
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {approvedCount}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-indigo-500 bg-indigo-50">
              <div className="text-sm text-indigo-700 mb-1">
                Total Discounted
              </div>
              <div className="text-2xl font-bold text-indigo-900 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {totalDiscountAmount.toLocaleString()}
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
                  {
                    value: '2024-2025',
                    label: '2024-2025',
                  },
                ]}
                value={filters.academicYear}
                onChange={(e) =>
                  handleFilterChange('academicYear', e.target.value)
                }
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />{' '}
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
                      label: 'All',
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
                      label: 'All',
                    },
                    {
                      value: '10',
                      label: 'Class 10',
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
                      label: 'All',
                    },
                    {
                      value: 'A',
                      label: 'A',
                    },
                  ]}
                  value={filters.division}
                  onChange={(e) =>
                    handleFilterChange('division', e.target.value)
                  }
                />
                <Select
                  label="Gender"
                  options={[
                    {
                      value: '',
                      label: 'All',
                    },
                  ]}
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Discount Form (appears above student list when student selected) */}
          {selectedStudentId && (
            <Card className="p-6 border-l-4 border-l-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Apply Discount for:{' '}
                <span className="text-blue-600">
                  {MOCK_STUDENTS.find((s) => s.id === selectedStudentId)?.name}
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Select
                    label="Fee Head *"
                    options={[
                      {
                        value: '',
                        label: 'Select Fee Head',
                      },
                      ...FEE_HEADS.map((h) => ({ value: h, label: h })),
                    ]}
                    value={feeHead}
                    onChange={(e) => setFeeHead(e.target.value)}
                  />
                  <Input
                    label="Discount Amount (₹) *"
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <Input
                    label="Given By Whom (Authority) *"
                    value={givenBy}
                    onChange={(e) => setGivenBy(e.target.value)}
                    placeholder="e.g. Principal, Management"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Discount *
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      rows={4}
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      placeholder="Enter detailed reason..."
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStudentId(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleApplyDiscount}>
                  Submit Discount Request
                </Button>
              </div>
            </Card>
          )}

          {/* Student List */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Select Student</h3>
            </div>
            <Table columns={studentColumns} data={filteredStudents} />
          </Card>

          {/* Recent Requests (read-only) */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                Recent Exemption Requests
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('approve')}
              >
                Approve / Reject →
              </Button>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Reg No</th>
                  <th className="px-4 py-3">Fee Head</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Given By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discounts.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.studentName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.regNo}</td>
                    <td className="px-4 py-3 text-gray-600">{row.feeHead}</td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      ₹{row.amount.toLocaleString()}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-600 max-w-[200px] truncate"
                      title={row.reason}
                    >
                      {row.reason}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.requestedBy}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.date}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="text-sm text-gray-500 mb-1">
                Pending Approval
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {approvedCount}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-sm text-gray-500 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-indigo-500 bg-indigo-50">
              <div className="text-sm text-indigo-700 mb-1">
                Total Approved Amount
              </div>
              <div className="text-2xl font-bold text-indigo-900 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {totalDiscountAmount.toLocaleString()}
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by student name or reg no..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  options={[
                    {
                      value: 'all',
                      label: 'All Statuses',
                    },
                    {
                      value: 'pending',
                      label: 'Pending',
                    },
                    {
                      value: 'approved',
                      label: 'Approved',
                    },
                    {
                      value: 'rejected',
                      label: 'Rejected',
                    },
                  ]}
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Requests Table with Approve / Reject Actions */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                Exemption Requests
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="warning">{pendingCount} Pending</Badge>
                <span className="text-sm text-gray-500">
                  Showing {filteredDiscounts.length} of {discounts.length}
                </span>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Student Details</th>
                  <th className="px-4 py-3">Class/Div</th>
                  <th className="px-4 py-3">Fee Head</th>
                  <th className="px-4 py-3">Discount Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Requested By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDiscounts.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {row.studentName}
                      </div>
                      <div className="text-xs text-gray-500">{row.regNo}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.class}-{row.division}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.feeHead}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      ₹{row.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={row.reason}>
                      {row.reason}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.requestedBy}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.date}</td>
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
                      {row.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(row.id, 'Rejected')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(row.id, 'Approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 text-right block">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredDiscounts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      <CheckCircle
                        className="w-12 h-12 mx-auto mb-3 text-green-300"
                      />
                      <p className="text-lg font-medium">No matching requests</p>
                      <p className="text-sm">Try adjusting your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}
