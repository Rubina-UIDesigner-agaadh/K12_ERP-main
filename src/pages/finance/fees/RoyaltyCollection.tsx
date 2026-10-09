import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Tabs } from '../../../components/ui/Tabs'
import { Table } from '../../../components/ui/Table'
import {
  Search,
  Crown,
  Building,
  IndianRupee,
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
} from 'lucide-react'
// Mock Data
const MOCK_BATCH_ALL = [
  {
    id: '1',
    batch: 'Morning',
    totalCollection: 1500000,
    royaltyAmount: 150000,
    paid: 100000,
    pending: 50000,
    status: 'Partial',
  },
  {
    id: '2',
    batch: 'Afternoon',
    totalCollection: 800000,
    royaltyAmount: 80000,
    paid: 80000,
    pending: 0,
    status: 'Paid',
  },
  {
    id: '3',
    batch: 'Evening',
    totalCollection: 500000,
    royaltyAmount: 50000,
    paid: 0,
    pending: 50000,
    status: 'Pending',
  },
]
const MOCK_BRANCH = [
  {
    id: '1',
    branchName: 'North Campus',
    totalCollection: 1200000,
    royaltyPercent: 10,
    royaltyAmount: 120000,
    paid: 100000,
    pending: 20000,
    status: 'Partial',
  },
  {
    id: '2',
    branchName: 'South Campus',
    totalCollection: 900000,
    royaltyPercent: 10,
    royaltyAmount: 90000,
    paid: 90000,
    pending: 0,
    status: 'Paid',
  },
  {
    id: '3',
    branchName: 'West Campus',
    totalCollection: 700000,
    royaltyPercent: 10,
    royaltyAmount: 70000,
    paid: 0,
    pending: 70000,
    status: 'Pending',
  },
]
const MOCK_BATCH_SPECIFIC = [
  {
    id: '1',
    branchName: 'North Campus',
    batch: 'Morning',
    totalCollection: 800000,
    royaltyPercent: 10,
    royaltyAmount: 80000,
    paid: 80000,
    pending: 0,
    status: 'Paid',
  },
  {
    id: '2',
    branchName: 'North Campus',
    batch: 'Afternoon',
    totalCollection: 400000,
    royaltyPercent: 10,
    royaltyAmount: 40000,
    paid: 20000,
    pending: 20000,
    status: 'Partial',
  },
  {
    id: '3',
    branchName: 'South Campus',
    batch: 'Morning',
    totalCollection: 600000,
    royaltyPercent: 10,
    royaltyAmount: 60000,
    paid: 60000,
    pending: 0,
    status: 'Paid',
  },
]
export function RoyaltyCollection() {
  const [activeTab, setActiveTab] = useState('batch-all')
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    branch: '',
    batch: '',
    dateRange: '',
  })
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">{status}</Badge>
      case 'Pending':
        return <Badge variant="danger">{status}</Badge>
      case 'Partial':
        return <Badge variant="warning">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  // Common columns
  const baseColumns = [
    {
      key: 'totalCollection',
      header: 'Total Collection',
      render: (row: any) => (
        <span className="font-medium">
          ₹{row.totalCollection.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'royaltyAmount',
      header: 'Royalty Amount',
      render: (row: any) => (
        <span className="font-bold text-blue-600">
          ₹{row.royaltyAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (row: any) => (
        <span className="text-green-600">₹{row.paid.toLocaleString()}</span>
      ),
    },
    {
      key: 'pending',
      header: 'Pending',
      render: (row: any) => (
        <span className="text-red-600">₹{row.pending.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => getStatusBadge(row.status),
    },
  ]
  const batchAllColumns = [
    {
      key: 'batch',
      header: 'Batch',
      render: (row: any) => (
        <span className="font-medium text-gray-900">{row.batch}</span>
      ),
    },
    ...baseColumns,
  ]
  const branchColumns = [
    {
      key: 'branchName',
      header: 'Branch Name',
      render: (row: any) => (
        <span className="font-medium text-gray-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          {row.branchName}
        </span>
      ),
    },
    {
      key: 'royaltyPercent',
      header: 'Royalty %',
      render: (row: any) => <span>{row.royaltyPercent}%</span>,
    },
    ...baseColumns,
  ]
  const batchSpecificColumns = [
    {
      key: 'branchName',
      header: 'Branch Name',
      render: (row: any) => (
        <span className="font-medium text-gray-900">{row.branchName}</span>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      render: (row: any) => <span>{row.batch}</span>,
    },
    {
      key: 'royaltyPercent',
      header: 'Royalty %',
      render: (row: any) => <span>{row.royaltyPercent}%</span>,
    },
    ...baseColumns,
  ]
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Royalty Collection Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage royalty collections from all branches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Royalty Collected
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₹1,80,000
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <IndianRupee className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Royalty
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                ₹1,00,000
              </h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Branches
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Month</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                ₹45,000
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            label="Branch"
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
            ]}
            value={filters.branch}
            onChange={(e) => handleFilterChange('branch', e.target.value)}
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
            ]}
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
          />
          <Input
            label="Date Range"
            type="date"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary">
            <Search className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </Card>

      {/* Main Content Area - All Sections Visible */}
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">
              Batch-wise Collection (All Branches)
            </h3>
          </div>
          <div className="p-0">
            <Table columns={batchAllColumns} data={MOCK_BATCH_ALL} />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Branch-wise Royalty</h3>
          </div>
          <div className="p-0">
            <Table columns={branchColumns} data={MOCK_BRANCH} />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">
              Batch-wise Royalty Breakdown
            </h3>
          </div>
          <div className="p-0">
            <Table columns={batchSpecificColumns} data={MOCK_BATCH_SPECIFIC} />
          </div>
        </Card>
      </div>
    </div>
  )
}
