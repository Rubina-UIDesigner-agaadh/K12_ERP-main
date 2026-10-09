import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  SearchIcon,
  EditIcon,
  AlertTriangleIcon,
  SaveIcon,
  HistoryIcon,
  UserIcon,
  CheckCircleIcon,
} from 'lucide-react'
interface StudentAllocation {
  name: string
  rollNo: string
  grNo: string
  marks: string
  currentAssigned: string
  status: string
  pref1: string
  eligibility: string
}
interface AuditEntry {
  timestamp: string
  student: string
  original: string
  modified: string
  reason: string
  approvedBy: string
}
const STREAM_OPTIONS = [
  {
    value: '',
    label: 'Select Stream',
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
const CAPACITY = [
  {
    stream: 'Science (PCM)',
    total: 120,
    filled: 118,
    available: 2,
  },
  {
    stream: 'Science (PCB)',
    total: 80,
    filled: 75,
    available: 5,
  },
  {
    stream: 'Commerce',
    total: 150,
    filled: 142,
    available: 8,
  },
  {
    stream: 'Arts/Humanities',
    total: 100,
    filled: 68,
    available: 32,
  },
]
const MOCK_AUDIT: AuditEntry[] = [
  {
    timestamp: '2024-03-15 10:30 AM',
    student: 'Neha Gupta (106)',
    original: 'Waitlisted',
    modified: 'Science (PCM)',
    reason: 'Parent request - exceptional case',
    approvedBy: 'Principal',
  },
  {
    timestamp: '2024-03-14 02:15 PM',
    student: 'Imran Ali (108)',
    original: 'Arts/Humanities',
    modified: 'Commerce',
    reason: 'Marks re-evaluation increased score',
    approvedBy: 'Vice Principal',
  },
]
export function ManualOverrideAdjustment() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] =
    useState<StudentAllocation | null>(null)
  const [newStream, setNewStream] = useState('')
  const [overrideEligibility, setOverrideEligibility] = useState(false)
  const [reason, setReason] = useState('')
  const [approvedBy, setApprovedBy] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(MOCK_AUDIT)
  const [showSuccess, setShowSuccess] = useState(false)
  const handleSearch = () => {
    setSelectedStudent({
      name: 'Vikram Singh',
      rollNo: '105',
      grNo: 'GR-2024-105',
      marks: '55%',
      currentAssigned: '-',
      status: 'Not Allocated',
      pref1: 'Science (PCB)',
      eligibility: 'Failed cutoff for Science (Min 60%)',
    })
    setNewStream('')
    setOverrideEligibility(false)
    setReason('')
    setApprovedBy('')
    setShowSuccess(false)
  }
  const handleSave = () => {
    if (!newStream || !reason || !approvedBy) return
    setIsSaving(true)
    setTimeout(() => {
      const entry: AuditEntry = {
        timestamp: new Date().toLocaleString(),
        student: `${selectedStudent?.name} (${selectedStudent?.rollNo})`,
        original: selectedStudent?.currentAssigned || '-',
        modified: newStream,
        reason,
        approvedBy,
      }
      setAuditLog((prev) => [entry, ...prev])
      setIsSaving(false)
      setShowSuccess(true)
    }, 1000)
  }
  const selectedCapacity = CAPACITY.find((c) => c.stream === newStream)
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manual Override / Adjustment
        </h1>
        <p className="text-gray-500 mt-1">
          Manually modify stream allocations for exceptional cases
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Find Student
        </h3>
        <div className="flex gap-3">
          <Input
            placeholder="Search by Name, Roll No, or GR No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="flex-1"
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Card>

      {/* Student Details & Override Form */}
      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Info */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Current Allocation
              </h3>
            </div>
            <div className="space-y-3">
              {[
                ['Name', selectedStudent.name],
                ['Roll No', selectedStudent.rollNo],
                ['GR No', selectedStudent.grNo],
                ['Marks', selectedStudent.marks],
                ['Preference 1', selectedStudent.pref1],
                ['Current Assignment', selectedStudent.currentAssigned],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant="danger">{selectedStudent.status}</Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 flex items-start gap-2">
                <AlertTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{selectedStudent.eligibility}</span>
              </p>
            </div>
          </Card>

          {/* Override Form */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <EditIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Override Allocation
              </h3>
            </div>

            {showSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  Override Applied
                </p>
                <p className="text-sm text-gray-500">
                  The allocation has been updated and logged.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedStudent(null)
                    setShowSuccess(false)
                  }}
                >
                  Search Another Student
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  label="New Stream Assignment"
                  options={STREAM_OPTIONS}
                  value={newStream}
                  onChange={(val) =>
                    setNewStream(
                      typeof val === 'string'
                        ? val
                        : (val.target as HTMLSelectElement).value,
                    )
                  }
                />

                {newStream && selectedCapacity && (
                  <div
                    className={`p-3 rounded-lg border ${selectedCapacity.available <= 2 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}
                  >
                    <p className="text-xs font-medium">
                      {selectedCapacity.stream}: {selectedCapacity.filled}/
                      {selectedCapacity.total} filled
                      <span
                        className={`ml-2 font-bold ${selectedCapacity.available <= 2 ? 'text-amber-700' : 'text-green-700'}`}
                      >
                        ({selectedCapacity.available} seats available)
                      </span>
                    </p>
                  </div>
                )}

                {newStream && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrideEligibility}
                        onChange={(e) =>
                          setOverrideEligibility(e.target.checked)
                        }
                        className="rounded text-amber-600"
                      />
                      <span className="text-sm text-amber-800 font-medium">
                        Override eligibility criteria (student is below cutoff)
                      </span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Override <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide detailed reason for this override..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <Input
                  label="Approved By"
                  placeholder="e.g., Principal, Vice Principal"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                />

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSave}
                  disabled={!newStream || !reason || !approvedBy || isSaving}
                  leftIcon={
                    isSaving ? undefined : <SaveIcon className="w-4 h-4" />
                  }
                >
                  {isSaving ? 'Saving...' : 'Apply Override'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Seat Capacity */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Current Seat Capacity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CAPACITY.map((c) => (
            <div key={c.stream} className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium text-gray-700">{c.stream}</p>
              <div className="flex items-end justify-between mt-1">
                <span className="text-xl font-bold text-gray-900">
                  {c.filled}/{c.total}
                </span>
                <Badge variant={c.available <= 2 ? 'warning' : 'success'}>
                  {c.available} left
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${c.available <= 2 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{
                    width: `${(c.filled / c.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Trail */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            Override Audit Trail
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Student
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Original
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Modified To
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Approved By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLog.map((entry, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {entry.student}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{entry.original}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="info">{entry.modified}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs max-w-[200px] truncate">
                    {entry.reason}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {entry.approvedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
export default ManualOverrideAdjustment
