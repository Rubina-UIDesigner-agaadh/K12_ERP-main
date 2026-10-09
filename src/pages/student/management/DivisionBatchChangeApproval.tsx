import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Select } from '../../../components/ui/Select'
import { Input } from '../../../components/ui/Input'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SearchIcon,
  ArrowRightLeftIcon,
  HistoryIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
} from 'lucide-react'
interface ChangeRequest {
  id: string
  name: string
  grNo: string
  class: string
  current: string
  requested: string
  reason: string
  date: string
  status: 'Pending' | 'Approved' | 'Rejected'
  selected?: boolean
}
const INITIAL_DIVISION_REQUESTS: ChangeRequest[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    grNo: 'GR-1001',
    class: '10',
    current: 'A',
    requested: 'B',
    reason: 'Sibling in section B',
    date: '2024-03-15',
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Zara Khan',
    grNo: 'GR-1005',
    class: '9',
    current: 'C',
    requested: 'A',
    reason: 'Subject combination requirement',
    date: '2024-03-14',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Rohan Verma',
    grNo: 'GR-1102',
    class: '10',
    current: 'B',
    requested: 'D',
    reason: 'Teacher recommendation',
    date: '2024-03-10',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Priya Reddy',
    grNo: 'GR-1210',
    class: '11',
    current: 'A',
    requested: 'C',
    reason: 'Peer group preference',
    date: '2024-03-08',
    status: 'Rejected',
  },
]
const INITIAL_BATCH_REQUESTS: ChangeRequest[] = [
  {
    id: '5',
    name: 'Ishita Sharma',
    grNo: 'GR-1150',
    class: '8',
    current: 'Afternoon',
    requested: 'Morning',
    reason: 'Health reasons - early schedule preferred',
    date: '2024-03-12',
    status: 'Pending',
  },
  {
    id: '6',
    name: 'Vikram Singh',
    grNo: 'GR-1200',
    class: '9',
    current: 'Morning',
    requested: 'Afternoon',
    reason: 'Transport issues in morning',
    date: '2024-03-16',
    status: 'Pending',
  },
  {
    id: '7',
    name: 'Sneha Kulkarni',
    grNo: 'GR-1230',
    class: '10',
    current: 'Morning',
    requested: 'Afternoon',
    reason: 'Family schedule change',
    date: '2024-03-11',
    status: 'Approved',
  },
]
const statusOptions = [
  {
    value: '',
    label: 'All Status',
  },
  {
    value: 'Pending',
    label: 'Pending',
  },
  {
    value: 'Approved',
    label: 'Approved',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
  },
]
export function DivisionBatchChangeApproval() {
  const [activeTab, setActiveTab] = useState<'division' | 'batch'>('division')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [divisionRequests, setDivisionRequests] = useState<ChangeRequest[]>(
    INITIAL_DIVISION_REQUESTS,
  )
  const [batchRequests, setBatchRequests] = useState<ChangeRequest[]>(
    INITIAL_BATCH_REQUESTS,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState<{
    action: 'approve' | 'reject'
    ids: string[]
  } | null>(null)
  const currentRequests =
    activeTab === 'division' ? divisionRequests : batchRequests
  const setCurrentRequests =
    activeTab === 'division' ? setDivisionRequests : setBatchRequests
  const filteredRequests = currentRequests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.grNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? r.status === statusFilter : true
    return matchesSearch && matchesStatus
  })
  const pendingCount = (reqs: ChangeRequest[]) =>
    reqs.filter((r) => r.status === 'Pending').length
  const approvedCount = (reqs: ChangeRequest[]) =>
    reqs.filter((r) => r.status === 'Approved').length
  const rejectedCount = (reqs: ChangeRequest[]) =>
    reqs.filter((r) => r.status === 'Rejected').length
  const handleAction = (action: 'approve' | 'reject', ids: string[]) => {
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected'
    setCurrentRequests((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: newStatus as ChangeRequest['status'],
            }
          : r,
      ),
    )
    setSelectedIds([])
    setShowConfirm(null)
  }
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }
  const toggleAll = () => {
    const pendingIds = filteredRequests
      .filter((r) => r.status === 'Pending')
      .map((r) => r.id)
    if (pendingIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingIds)
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success">Approved</Badge>
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>
      default:
        return <Badge variant="warning">Pending</Badge>
    }
  }
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Division & Batch Change Approval
        </h1>
        <p className="text-gray-500 mt-1">
          Review and approve student requests for division or batch changes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {currentRequests.length}
          </p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </Card>
        <Card className="p-4 text-center bg-amber-50 border-amber-200">
          <p className="text-2xl font-bold text-amber-600">
            {pendingCount(currentRequests)}
          </p>
          <p className="text-xs text-amber-600">Pending</p>
        </Card>
        <Card className="p-4 text-center bg-green-50 border-green-200">
          <p className="text-2xl font-bold text-green-600">
            {approvedCount(currentRequests)}
          </p>
          <p className="text-xs text-green-600">Approved</p>
        </Card>
        <Card className="p-4 text-center bg-red-50 border-red-200">
          <p className="text-2xl font-bold text-red-600">
            {rejectedCount(currentRequests)}
          </p>
          <p className="text-xs text-red-600">Rejected</p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('division')
              setSelectedIds([])
              setSearchTerm('')
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'division' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowRightLeftIcon className="w-4 h-4" />
            Division Changes
            <Badge variant={activeTab === 'division' ? 'info' : 'default'}>
              {pendingCount(divisionRequests)}
            </Badge>
          </button>
          <button
            onClick={() => {
              setActiveTab('batch')
              setSelectedIds([])
              setSearchTerm('')
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'batch' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <SunIcon className="w-4 h-4" />
            Batch Changes
            <Badge variant={activeTab === 'batch' ? 'info' : 'default'}>
              {pendingCount(batchRequests)}
            </Badge>
          </button>
        </div>
      </Card>

      {/* Filters & Bulk Actions */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input
            label="Search"
            placeholder="Name or GR No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="flex-1"
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
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setShowConfirm({
                    action: 'approve',
                    ids: selectedIds,
                  })
                }
                leftIcon={<CheckCircleIcon className="w-4 h-4" />}
              >
                Approve ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowConfirm({
                    action: 'reject',
                    ids: selectedIds,
                  })
                }
                leftIcon={<XCircleIcon className="w-4 h-4" />}
              >
                Reject ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Requests Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      filteredRequests.filter((r) => r.status === 'Pending')
                        .length > 0 &&
                      filteredRequests
                        .filter((r) => r.status === 'Pending')
                        .every((r) => selectedIds.includes(r.id))
                    }
                    className="rounded"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Student
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  GR No
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Class
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Current {activeTab === 'division' ? 'Division' : 'Batch'}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Requested {activeTab === 'division' ? 'Division' : 'Batch'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {r.status === 'Pending' && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                    {r.grNo}
                  </td>
                  <td className="py-3 px-4 text-center">{r.class}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{r.current}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="info">{r.requested}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs max-w-[200px] truncate">
                    {r.reason}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500 text-xs">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(r.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.status === 'Pending' && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            setShowConfirm({
                              action: 'approve',
                              ids: [r.id],
                            })
                          }
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                          title="Approve"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setShowConfirm({
                              action: 'reject',
                              ids: [r.id],
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Reject"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {showConfirm.action === 'approve' ? 'Approve' : 'Reject'} Request
              {showConfirm.ids.length > 1 ? 's' : ''}?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This will {showConfirm.action} {showConfirm.ids.length} request
              {showConfirm.ids.length > 1 ? 's' : ''}.
              {showConfirm.action === 'approve' &&
                ' The student(s) will be moved accordingly.'}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant={
                  showConfirm.action === 'approve' ? 'primary' : 'outline'
                }
                onClick={() =>
                  handleAction(showConfirm.action, showConfirm.ids)
                }
              >
                {showConfirm.action === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default DivisionBatchChangeApproval
