import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Input } from '../../../components/ui/Input'
import {
  SearchIcon,
  DownloadIcon,
  LockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  UnlockIcon,
} from 'lucide-react'
interface AllocationRecord {
  id: string
  name: string
  rollNo: string
  marks: string
  assigned: string
  prefMatched: string
  reason: string
  status: 'Successfully Allocated' | 'Waitlisted' | 'Not Allocated'
}
const MOCK_RESULTS: AllocationRecord[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    rollNo: '101',
    marks: '92%',
    assigned: 'Science (PCM)',
    prefMatched: 'Yes (Priority 1)',
    reason: 'Merit + Pref 1',
    status: 'Successfully Allocated',
  },
  {
    id: '2',
    name: 'Zara Khan',
    rollNo: '102',
    marks: '88%',
    assigned: 'Commerce',
    prefMatched: 'Yes (Priority 1)',
    reason: 'Merit + Pref 1',
    status: 'Successfully Allocated',
  },
  {
    id: '3',
    name: 'Rohan Verma',
    rollNo: '103',
    marks: '65%',
    assigned: 'Commerce',
    prefMatched: 'No',
    reason: 'Below cutoff for Science',
    status: 'Successfully Allocated',
  },
  {
    id: '4',
    name: 'Ishita Sharma',
    rollNo: '104',
    marks: '72%',
    assigned: 'Arts/Humanities',
    prefMatched: 'Yes (Priority 1)',
    reason: 'Merit + Pref 1',
    status: 'Successfully Allocated',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    rollNo: '105',
    marks: '55%',
    assigned: '-',
    prefMatched: 'No',
    reason: 'Below cutoff for all prefs',
    status: 'Not Allocated',
  },
  {
    id: '6',
    name: 'Neha Gupta',
    rollNo: '106',
    marks: '81%',
    assigned: '-',
    prefMatched: 'No',
    reason: 'Seats full in Science',
    status: 'Waitlisted',
  },
  {
    id: '7',
    name: 'Priya Reddy',
    rollNo: '107',
    marks: '78%',
    assigned: 'Science (PCB)',
    prefMatched: 'Yes (Priority 2)',
    reason: 'Merit + Pref 2',
    status: 'Successfully Allocated',
  },
  {
    id: '8',
    name: 'Imran Ali',
    rollNo: '108',
    marks: '60%',
    assigned: 'Arts/Humanities',
    prefMatched: 'No',
    reason: 'Only Arts seats available',
    status: 'Successfully Allocated',
  },
]
const streamOptions = [
  {
    value: '',
    label: 'All Streams',
  },
  {
    value: 'Science (PCM)',
    label: 'Science (PCM)',
  },
  {
    value: 'Science (PCB)',
    label: 'Science (PCB)',
  },
  {
    value: 'Commerce',
    label: 'Commerce',
  },
  {
    value: 'Arts/Humanities',
    label: 'Arts/Humanities',
  },
]
const statusOptions = [
  {
    value: '',
    label: 'All Status',
  },
  {
    value: 'Successfully Allocated',
    label: 'Allocated',
  },
  {
    value: 'Waitlisted',
    label: 'Waitlisted',
  },
  {
    value: 'Not Allocated',
    label: 'Not Allocated',
  },
]
export function AllocationResult() {
  const [isFinalized, setIsFinalized] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [streamFilter, setStreamFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const filteredResults = MOCK_RESULTS.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.includes(searchTerm)
    const matchesStream = streamFilter ? r.assigned === streamFilter : true
    const matchesStatus = statusFilter ? r.status === statusFilter : true
    return matchesSearch && matchesStream && matchesStatus
  })
  const allocated = MOCK_RESULTS.filter(
    (r) => r.status === 'Successfully Allocated',
  ).length
  const waitlisted = MOCK_RESULTS.filter(
    (r) => r.status === 'Waitlisted',
  ).length
  const notAllocated = MOCK_RESULTS.filter(
    (r) => r.status === 'Not Allocated',
  ).length
  const successRate = Math.round((allocated / MOCK_RESULTS.length) * 100)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Successfully Allocated':
        return <Badge variant="success">Allocated</Badge>
      case 'Waitlisted':
        return <Badge variant="warning">Waitlisted</Badge>
      case 'Not Allocated':
        return <Badge variant="danger">Not Allocated</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }
  const getPrefBadge = (matched: string) => {
    if (matched.startsWith('Yes')) {
      return <Badge variant="success">{matched}</Badge>
    }
    return <Badge variant="danger">{matched}</Badge>
  }
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Allocation Results
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage stream allocation outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={isFinalized ? 'success' : 'warning'}
            className="text-sm px-3 py-1"
          >
            {isFinalized ? 'Finalized' : 'Draft'}
          </Badge>
          <Button
            variant="outline"
            leftIcon={<DownloadIcon className="w-4 h-4" />}
          >
            Export
          </Button>
          {!isFinalized ? (
            <Button
              variant="primary"
              leftIcon={<LockIcon className="w-4 h-4" />}
              onClick={() => setShowLockConfirm(true)}
            >
              Finalize & Lock
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            >
              Locked
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {MOCK_RESULTS.length}
          </p>
          <p className="text-xs text-gray-500">Total Students</p>
        </Card>
        <Card className="p-4 text-center bg-green-50 border-green-200">
          <p className="text-2xl font-bold text-green-600">{allocated}</p>
          <p className="text-xs text-green-600">Allocated</p>
        </Card>
        <Card className="p-4 text-center bg-amber-50 border-amber-200">
          <p className="text-2xl font-bold text-amber-600">{waitlisted}</p>
          <p className="text-xs text-amber-600">Waitlisted</p>
        </Card>
        <Card className="p-4 text-center bg-red-50 border-red-200">
          <p className="text-2xl font-bold text-red-600">{notAllocated}</p>
          <p className="text-xs text-red-600">Not Allocated</p>
        </Card>
        <Card className="p-4 text-center bg-blue-50 border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
          <p className="text-xs text-blue-600">Success Rate</p>
        </Card>
      </div>

      {/* Stream Distribution */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Stream-wise Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Science (PCM)',
            'Science (PCB)',
            'Commerce',
            'Arts/Humanities',
          ].map((stream) => {
            const count = MOCK_RESULTS.filter(
              (r) => r.assigned === stream,
            ).length
            return (
              <div key={stream} className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700">{stream}</p>
                <p className="text-xl font-bold text-gray-900">{count}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Name or Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
          />
          <Select
            label="Stream"
            options={streamOptions}
            value={streamFilter}
            onChange={(val) =>
              setStreamFilter(
                typeof val === 'string'
                  ? val
                  : (val.target as HTMLSelectElement).value,
              )
            }
          />
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(val) =>
              setStatusFilter(
                typeof val === 'string'
                  ? val
                  : (val.target as HTMLSelectElement).value,
              )
            }
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm('')
                setStreamFilter('')
                setStatusFilter('')
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <span className="font-medium text-gray-900">
            Results ({filteredResults.length} of {MOCK_RESULTS.length})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Roll No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Student Name
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Marks
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Assigned Stream
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Pref Matched
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-700">
                    {r.rollNo}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">
                    {r.marks}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{r.assigned}</td>
                  <td className="py-3 px-4 text-center">
                    {getPrefBadge(r.prefMatched)}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {r.reason}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(r.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lock Confirmation Modal */}
      {showLockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLockConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <LockIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Finalize Allocation?
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              This action will lock all allocation results. Once finalized:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1 ml-4 list-disc">
              <li>Results cannot be modified through the allocation engine</li>
              <li>Only manual overrides will be allowed</li>
              <li>Students and parents will be notified</li>
            </ul>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLockConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsFinalized(true)
                  setShowLockConfirm(false)
                }}
              >
                Confirm & Lock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AllocationResult
