import React, { useState, Fragment } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  ArrowRightLeft,
  IndianRupee,
  Building,
  Calendar,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
interface FeeHead {
  name: string
  amount: number
}
interface TransferredStudent {
  id: string
  regNo: string
  studentName: string
  fromBranch: string
  toBranch: string
  transferDate: string
  previousFeesPaid: number
  newBranchFee: number
  difference: number
  status: 'Pending' | 'Adjusted' | 'Refunded' | 'Pending Payment'
  previousFeeBreakdown: FeeHead[]
  newFeeBreakdown: FeeHead[]
}
const MOCK_DATA: TransferredStudent[] = [
  {
    id: '1',
    regNo: 'REG-2023-001',
    studentName: 'Aarav Patel',
    fromBranch: 'North Campus',
    toBranch: 'Main Campus',
    transferDate: '2024-03-15',
    previousFeesPaid: 45000,
    newBranchFee: 50000,
    difference: -5000,
    status: 'Pending Payment',
    previousFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 30000,
      },
      {
        name: 'Transport Fee',
        amount: 10000,
      },
      {
        name: 'Activity Fee',
        amount: 5000,
      },
    ],
    newFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 35000,
      },
      {
        name: 'Transport Fee',
        amount: 10000,
      },
      {
        name: 'Activity Fee',
        amount: 5000,
      },
    ],
  },
  {
    id: '2',
    regNo: 'REG-2023-045',
    studentName: 'Isha Sharma',
    fromBranch: 'South Campus',
    toBranch: 'North Campus',
    transferDate: '2024-03-10',
    previousFeesPaid: 55000,
    newBranchFee: 48000,
    difference: 7000,
    status: 'Pending',
    previousFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 40000,
      },
      {
        name: 'Transport Fee',
        amount: 15000,
      },
    ],
    newFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 38000,
      },
      {
        name: 'Transport Fee',
        amount: 10000,
      },
    ],
  },
  {
    id: '3',
    regNo: 'REG-2022-112',
    studentName: 'Rohan Verma',
    fromBranch: 'Main Campus',
    toBranch: 'West Campus',
    transferDate: '2024-02-28',
    previousFeesPaid: 40000,
    newBranchFee: 40000,
    difference: 0,
    status: 'Adjusted',
    previousFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 30000,
      },
      {
        name: 'Library Fee',
        amount: 10000,
      },
    ],
    newFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 30000,
      },
      {
        name: 'Library Fee',
        amount: 10000,
      },
    ],
  },
  {
    id: '4',
    regNo: 'REG-2024-005',
    studentName: 'Meera Singh',
    fromBranch: 'West Campus',
    toBranch: 'South Campus',
    transferDate: '2024-03-20',
    previousFeesPaid: 60000,
    newBranchFee: 50000,
    difference: 10000,
    status: 'Refunded',
    previousFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 45000,
      },
      {
        name: 'Hostel Fee',
        amount: 15000,
      },
    ],
    newFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 40000,
      },
      {
        name: 'Hostel Fee',
        amount: 10000,
      },
    ],
  },
  {
    id: '5',
    regNo: 'REG-2023-088',
    studentName: 'Mohammed Khan',
    fromBranch: 'North Campus',
    toBranch: 'West Campus',
    transferDate: '2024-03-22',
    previousFeesPaid: 35000,
    newBranchFee: 42000,
    difference: -7000,
    status: 'Pending Payment',
    previousFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 25000,
      },
      {
        name: 'Transport Fee',
        amount: 10000,
      },
    ],
    newFeeBreakdown: [
      {
        name: 'Tuition Fee',
        amount: 30000,
      },
      {
        name: 'Transport Fee',
        amount: 12000,
      },
    ],
  },
]
export function FeeOpening() {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: '',
    centre: '',
    class: '',
    division: '',
    searchQuery: '',
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Adjusted':
        return <Badge variant="success">{status}</Badge>
      case 'Refunded':
        return <Badge variant="info">{status}</Badge>
      case 'Pending Payment':
        return <Badge variant="danger">{status}</Badge>
      case 'Pending':
        return <Badge variant="warning">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  const columns = [
    {
      key: 'regNo',
      header: 'Reg No',
      render: (row: TransferredStudent) => (
        <span className="font-medium text-gray-900">{row.regNo}</span>
      ),
    },
    {
      key: 'studentName',
      header: 'Student Name',
      render: (row: TransferredStudent) => (
        <span className="font-medium text-gray-900">{row.studentName}</span>
      ),
    },
    {
      key: 'branches',
      header: 'Transfer Details',
      render: (row: TransferredStudent) => (
        <div className="flex flex-col text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <Building className="w-3 h-3" /> From: {row.fromBranch}
          </span>
          <span className="text-gray-900 flex items-center gap-1">
            <Building className="w-3 h-3" /> To: {row.toBranch}
          </span>
        </div>
      ),
    },
    {
      key: 'transferDate',
      header: 'Transfer Date',
      render: (row: TransferredStudent) => (
        <span className="text-gray-600 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {row.transferDate}
        </span>
      ),
    },
    {
      key: 'amounts',
      header: 'Fee Comparison',
      render: (row: TransferredStudent) => (
        <div className="flex flex-col text-sm">
          <span className="text-gray-500">
            Prev Paid: ₹{row.previousFeesPaid.toLocaleString()}
          </span>
          <span className="text-gray-900 font-medium">
            New Fee: ₹{row.newBranchFee.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'difference',
      header: 'Difference',
      render: (row: TransferredStudent) => (
        <span
          className={`font-bold ${row.difference > 0 ? 'text-green-600' : row.difference < 0 ? 'text-red-600' : 'text-gray-600'}`}
        >
          {row.difference > 0 ? '+' : ''}₹{row.difference.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: TransferredStudent) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: TransferredStudent) => (
        <Button variant="ghost" size="sm" onClick={() => toggleRow(row.id)}>
          {expandedRow === row.id ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> Hide Details
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" /> View Details
            </>
          )}
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
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            Branch Transfer - Fee Reconciliation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage fee adjustments for students transferring between branches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select
            label="Academic Year"
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
          <Select
            label="Master Franchise (From)"
            options={[
              {
                value: '',
                label: 'All Branches',
              },
              {
                value: 'north',
                label: 'North Campus',
              },
              {
                value: 'south',
                label: 'South Campus',
              },
              {
                value: 'main',
                label: 'Main Campus',
              },
            ]}
            value={filters.masterFranchise}
            onChange={(e) =>
              handleFilterChange('masterFranchise', e.target.value)
            }
          />
          <Select
            label="Centre (To)"
            options={[
              {
                value: '',
                label: 'All Centres',
              },
              {
                value: 'north',
                label: 'North Campus',
              },
              {
                value: 'south',
                label: 'South Campus',
              },
              {
                value: 'main',
                label: 'Main Campus',
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
            ]}
            value={filters.division}
            onChange={(e) => handleFilterChange('division', e.target.value)}
          />
          <Input
            label="Search"
            placeholder="Name or Reg No..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </Card>

      {/* List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_DATA.map((row) => (
                <Fragment key={row.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={`${row.id}-${col.key}`}
                        className="px-4 py-3 align-top"
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                  {expandedRow === row.id && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-0 border-b border-gray-200"
                      >
                        <div className="bg-blue-50/30 p-6 shadow-inner">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {row.studentName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Reg No: {row.regNo} | Transferred on{' '}
                                {row.transferDate}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {row.status === 'Pending' && (
                                <Button variant="primary" size="sm">
                                  <CheckCircle className="w-4 h-4 mr-2" /> Mark
                                  as Adjusted
                                </Button>
                              )}
                              {row.difference > 0 &&
                                row.status !== 'Refunded' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <IndianRupee className="w-4 h-4 mr-2" />{' '}
                                    Process Refund
                                  </Button>
                                )}
                              {row.difference < 0 &&
                                row.status !== 'Adjusted' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />{' '}
                                    Generate Pending Invoice
                                  </Button>
                                )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Previous Branch */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Building className="w-4 h-4 text-gray-500" />
                                Previous Branch ({row.fromBranch})
                              </h4>
                              <div className="space-y-2">
                                {row.previousFeeBreakdown.map((fee, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {fee.name}
                                    </span>
                                    <span className="font-medium">
                                      ₹{fee.amount.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                                  <span>Total Paid</span>
                                  <span>
                                    ₹{row.previousFeesPaid.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* New Branch */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-500" />
                                New Branch ({row.toBranch})
                              </h4>
                              <div className="space-y-2">
                                {row.newFeeBreakdown.map((fee, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {fee.name}
                                    </span>
                                    <span className="font-medium">
                                      ₹{fee.amount.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                                  <span>Total Due</span>
                                  <span>
                                    ₹{row.newBranchFee.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Calculation */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-center">
                              <h4 className="font-semibold text-gray-800 mb-4 text-center">
                                Reconciliation Summary
                              </h4>

                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Previous Paid:
                                  </span>
                                  <span className="font-medium">
                                    ₹{row.previousFeesPaid.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    New Branch Fee:
                                  </span>
                                  <span className="font-medium">
                                    - ₹{row.newBranchFee.toLocaleString()}
                                  </span>
                                </div>
                                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                                  <span className="font-bold text-gray-900">
                                    Net Difference:
                                  </span>
                                  <span
                                    className={`text-xl font-bold ${row.difference > 0 ? 'text-green-600' : row.difference < 0 ? 'text-red-600' : 'text-gray-900'}`}
                                  >
                                    {row.difference > 0 ? '+' : ''}₹
                                    {row.difference.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {row.difference > 0
                                      ? '(Amount to be refunded to parent)'
                                      : row.difference < 0
                                        ? '(Amount pending from parent)'
                                        : '(Fully adjusted)'}
                                  </span>
                                </div>
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
      </Card>
    </div>
  )
}

// Registry alias: navigation page "branch-transfer" expects this export name
export { FeeOpening as BranchTransfer };
