import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Layers,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

interface Teacher {
  id: string
  name: string
  subject: string
  email: string
  phone: string
}

interface Batch {
  id: string
  name: string
  class: string
  division: string
  academicYear: string
  shift: string
  capacity: number
  enrolled: number
  status: 'Active' | 'Inactive'
  assignedTeachers: string[]
}

const TEACHERS: Teacher[] = [
  {
    id: 'T001',
    name: 'Dr. Rajesh Kumar',
    subject: 'Mathematics',
    email: 'rajesh.kumar@school.com',
    phone: '9876543210',
  },
  {
    id: 'T002',
    name: 'Mrs. Priya Sharma',
    subject: 'English',
    email: 'priya.sharma@school.com',
    phone: '9876543211',
  },
  {
    id: 'T003',
    name: 'Mr. Amit Patel',
    subject: 'Science',
    email: 'amit.patel@school.com',
    phone: '9876543212',
  },
  {
    id: 'T004',
    name: 'Mrs. Sunita Verma',
    subject: 'Hindi',
    email: 'sunita.verma@school.com',
    phone: '9876543213',
  },
  {
    id: 'T005',
    name: 'Mr. Vikram Singh',
    subject: 'Social Studies',
    email: 'vikram.singh@school.com',
    phone: '9876543214',
  },
  {
    id: 'T006',
    name: 'Ms. Anjali Gupta',
    subject: 'Computer Science',
    email: 'anjali.gupta@school.com',
    phone: '9876543215',
  },
  {
    id: 'T007',
    name: 'Mr. Rahul Joshi',
    subject: 'Physical Education',
    email: 'rahul.joshi@school.com',
    phone: '9876543216',
  },
  {
    id: 'T008',
    name: 'Mrs. Kavita Reddy',
    subject: 'Art',
    email: 'kavita.reddy@school.com',
    phone: '9876543217',
  },
]

const CLASSES = [
  { value: '', label: 'Select Class' },
  { value: 'Nursery', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: 'Class 1', label: 'Class 1' },
  { value: 'Class 2', label: 'Class 2' },
  { value: 'Class 3', label: 'Class 3' },
  { value: 'Class 4', label: 'Class 4' },
  { value: 'Class 5', label: 'Class 5' },
  { value: 'Class 6', label: 'Class 6' },
  { value: 'Class 7', label: 'Class 7' },
  { value: 'Class 8', label: 'Class 8' },
  { value: 'Class 9', label: 'Class 9' },
  { value: 'Class 10', label: 'Class 10' },
]

const DIVISIONS = [
  { value: '', label: 'Select Division' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
]

const YEARS = [
  { value: '', label: 'Select Academic Year' },
  { value: '2025-2026', label: '2025-2026' },
  { value: '2024-2025', label: '2024-2025' },
  { value: '2023-2024', label: '2023-2024' },
]

const SHIFTS = [
  { value: '', label: 'Select Shift' },
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
  { value: 'Evening', label: 'Evening' },
]

const INITIAL: Batch[] = [
  {
    id: 'B001',
    name: 'Class 1-A Morning 2025-2026',
    class: 'Class 1',
    division: 'A',
    academicYear: '2025-2026',
    shift: 'Morning',
    capacity: 40,
    enrolled: 35,
    status: 'Active',
    assignedTeachers: ['T001', 'T002'],
  },
  {
    id: 'B002',
    name: 'Class 1-B Morning 2025-2026',
    class: 'Class 1',
    division: 'B',
    academicYear: '2025-2026',
    shift: 'Morning',
    capacity: 40,
    enrolled: 38,
    status: 'Active',
    assignedTeachers: ['T003'],
  },
  {
    id: 'B003',
    name: 'Class 2-A Morning 2025-2026',
    class: 'Class 2',
    division: 'A',
    academicYear: '2025-2026',
    shift: 'Morning',
    capacity: 45,
    enrolled: 42,
    status: 'Active',
    assignedTeachers: ['T001', 'T004', 'T005'],
  },
  {
    id: 'B004',
    name: 'Class 3-A Afternoon 2025-2026',
    class: 'Class 3',
    division: 'A',
    academicYear: '2025-2026',
    shift: 'Afternoon',
    capacity: 40,
    enrolled: 30,
    status: 'Active',
    assignedTeachers: [],
  },
  {
    id: 'B005',
    name: 'Class 5-C Morning 2025-2026',
    class: 'Class 5',
    division: 'C',
    academicYear: '2025-2026',
    shift: 'Morning',
    capacity: 45,
    enrolled: 44,
    status: 'Active',
    assignedTeachers: ['T002', 'T006'],
  },
  {
    id: 'B006',
    name: 'Class 8-A Morning 2024-2025',
    class: 'Class 8',
    division: 'A',
    academicYear: '2024-2025',
    shift: 'Morning',
    capacity: 50,
    enrolled: 48,
    status: 'Inactive',
    assignedTeachers: ['T003', 'T004'],
  },
  {
    id: 'B007',
    name: 'Class 10-B Morning 2025-2026',
    class: 'Class 10',
    division: 'B',
    academicYear: '2025-2026',
    shift: 'Morning',
    capacity: 50,
    enrolled: 47,
    status: 'Active',
    assignedTeachers: ['T001', 'T002', 'T003', 'T005', 'T006'],
  },
]

const emptyForm = {
  class: '',
  division: '',
  academicYear: '',
  shift: '',
  capacity: '40',
}

export function BatchMaster() {
  const [batches, setBatches] = useState<Batch[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Teacher Assignment State
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [teacherSearch, setTeacherSearch] = useState('')
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])

  const filtered = batches.filter((b) => {
    if (
      search &&
      !b.name.toLowerCase().includes(search.toLowerCase()) &&
      !b.id.toLowerCase().includes(search.toLowerCase())
    )
      return false
    if (filterYear && b.academicYear !== filterYear) return false
    if (filterClass && b.class !== filterClass) return false
    return true
  })

  const openCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (b: Batch) => {
    setForm({
      class: b.class,
      division: b.division,
      academicYear: b.academicYear,
      shift: b.shift,
      capacity: String(b.capacity),
    })
    setEditId(b.id)
    setShowModal(true)
  }

  const save = () => {
    if (!form.class || !form.division || !form.academicYear || !form.shift)
      return
    const name = `${form.class}-${form.division} ${form.shift} ${form.academicYear}`
    if (editId) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === editId
            ? {
                ...b,
                name,
                class: form.class,
                division: form.division,
                academicYear: form.academicYear,
                shift: form.shift,
                capacity: Number(form.capacity),
              }
            : b,
        ),
      )
    } else {
      const id = `B${String(batches.length + 1).padStart(3, '0')}`
      setBatches((prev) => [
        ...prev,
        {
          id,
          name,
          class: form.class,
          division: form.division,
          academicYear: form.academicYear,
          shift: form.shift,
          capacity: Number(form.capacity),
          enrolled: 0,
          status: 'Active',
          assignedTeachers: [],
        },
      ])
    }
    setShowModal(false)
  }

  const confirmDelete = () => {
    if (deleteId) {
      setBatches((prev) => prev.filter((b) => b.id !== deleteId))
      setDeleteId(null)
    }
  }

  const toggleStatus = (id: string) =>
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === 'Active' ? 'Inactive' : 'Active',
            }
          : b,
      ),
    )

  // Teacher Assignment Functions
  const openTeacherAssignment = (batch: Batch) => {
    setSelectedBatchId(batch.id)
    setSelectedTeachers([...batch.assignedTeachers])
    setTeacherSearch('')
    setShowTeacherModal(true)
  }

  const toggleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId],
    )
  }

  const saveTeacherAssignment = () => {
    if (selectedBatchId) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === selectedBatchId
            ? { ...b, assignedTeachers: selectedTeachers }
            : b,
        ),
      )
      setShowTeacherModal(false)
      setSelectedBatchId(null)
      setSelectedTeachers([])
    }
  }

  const removeTeacherFromBatch = (batchId: string, teacherId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              assignedTeachers: b.assignedTeachers.filter(
                (id) => id !== teacherId,
              ),
            }
          : b,
      ),
    )
  }

  const getTeacherById = (id: string) => TEACHERS.find((t) => t.id === id)

  const filteredTeachers = TEACHERS.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase()),
  )

  const selectedBatch = batches.find((b) => b.id === selectedBatchId)

  const stats = {
    total: batches.length,
    active: batches.filter((b) => b.status === 'Active').length,
    totalCapacity: batches.reduce((s, b) => s + b.capacity, 0),
    totalEnrolled: batches.reduce((s, b) => s + b.enrolled, 0),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" /> Batch Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Combine class, division, academic year & shift to create batches
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-56 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Batches',
            value: stats.total,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            label: 'Active',
            value: stats.active,
            color: 'bg-green-50 text-green-700',
          },
          {
            label: 'Total Capacity',
            value: stats.totalCapacity,
            color: 'bg-purple-50 text-purple-700',
          },
          {
            label: 'Total Enrolled',
            value: stats.totalEnrolled,
            color: 'bg-amber-50 text-amber-700',
          },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            label="Academic Year"
            options={[{ value: '', label: 'All Years' }, ...YEARS.slice(1)]}
            value={filterYear}
            onChange={(v) =>
              setFilterYear(typeof v === 'string' ? v : v.target.value)
            }
          />
          <Select
            label="Class"
            options={[{ value: '', label: 'All Classes' }, ...CLASSES.slice(1)]}
            value={filterClass}
            onChange={(v) =>
              setFilterClass(typeof v === 'string' ? v : v.target.value)
            }
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Batch Records</h2>
          <Badge variant="info">{filtered.length} Batches</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  'Batch ID',
                  'Batch Name',
                  'Class',
                  'Division',
                  'Academic Year',
                  'Shift',
                  'Capacity',
                  'Enrolled',
                  'Occupancy',
                  'Teachers',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => {
                const occ =
                  b.capacity > 0
                    ? Math.round((b.enrolled / b.capacity) * 100)
                    : 0
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">
                      {b.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {b.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.class}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.division}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.shift}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.capacity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.enrolled}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${occ >= 90 ? 'bg-red-500' : occ >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${occ}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{occ}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.assignedTeachers.length > 0 ? (
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {b.assignedTeachers.slice(0, 3).map((tId) => {
                                const teacher = getTeacherById(tId)
                                return (
                                  <div
                                    key={tId}
                                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                    title={teacher?.name}
                                  >
                                    {teacher?.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .slice(0, 2)}
                                  </div>
                                )
                              })}
                            </div>
                            {b.assignedTeachers.length > 3 && (
                              <span className="ml-1 text-xs text-gray-500">
                                +{b.assignedTeachers.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No teachers
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={b.status === 'Active' ? 'success' : 'danger'}
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openTeacherAssignment(b)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                          title="Assign Teachers"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(b)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(b.id)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Toggle Status"
                        >
                          {b.status === 'Active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No batches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal
          isOpen
          onClose={() => setShowModal(false)}
          title={editId ? 'Edit Batch' : 'Create New Batch'}
        >
          <div className="space-y-4">
            <Select
              label="Class *"
              options={CLASSES}
              value={form.class}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  class: typeof v === 'string' ? v : v.target.value,
                }))
              }
            />
            <Select
              label="Division *"
              options={DIVISIONS}
              value={form.division}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  division: typeof v === 'string' ? v : v.target.value,
                }))
              }
            />
            <Select
              label="Academic Year *"
              options={YEARS}
              value={form.academicYear}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  academicYear: typeof v === 'string' ? v : v.target.value,
                }))
              }
            />
            <Select
              label="Shift *"
              options={SHIFTS}
              value={form.shift}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  shift: typeof v === 'string' ? v : v.target.value,
                }))
              }
            />
            <Input
              label="Capacity"
              type="number"
              value={form.capacity}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  capacity: e.target.value,
                }))
              }
            />
            {form.class && form.division && form.academicYear && form.shift && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">
                  Generated Batch Name
                </p>
                <p className="text-sm font-semibold text-blue-900 mt-1">
                  {form.class}-{form.division} {form.shift} {form.academicYear}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={save}
                disabled={
                  !form.class ||
                  !form.division ||
                  !form.academicYear ||
                  !form.shift
                }
              >
                {editId ? 'Update' : 'Create'} Batch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Teacher Assignment Modal */}
      {showTeacherModal && selectedBatch && (
        <Modal
          isOpen
          onClose={() => {
            setShowTeacherModal(false)
            setSelectedBatchId(null)
            setSelectedTeachers([])
          }}
          title="Assign Teachers to Batch"
        >
          <div className="space-y-4">
            {/* Batch Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Selected Batch</p>
              <p className="text-sm font-semibold text-blue-900 mt-1">
                {selectedBatch.name}
              </p>
            </div>

            {/* Currently Assigned Teachers */}
            {selectedTeachers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Assigned Teachers ({selectedTeachers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeachers.map((tId) => {
                    const teacher = getTeacherById(tId)
                    return (
                      <div
                        key={tId}
                        className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {teacher?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm text-purple-800">
                          {teacher?.name}
                        </span>
                        <button
                          onClick={() => toggleTeacherSelection(tId)}
                          className="text-purple-400 hover:text-purple-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Search Teachers */}
            <div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers by name or subject..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Teacher List */}
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeachers.includes(teacher.id)
                  return (
                    <div
                      key={teacher.id}
                      onClick={() => toggleTeacherSelection(teacher.id)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50 border-l-2 border-l-purple-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          isSelected
                            ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}
                      >
                        {teacher.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {teacher.subject} • {teacher.email}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  )
                })}
                {filteredTeachers.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No teachers found.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-gray-500">
                {selectedTeachers.length} teacher(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTeacherModal(false)
                    setSelectedBatchId(null)
                    setSelectedTeachers([])
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={saveTeacherAssignment}>
                  <Users className="w-4 h-4 mr-2" />
                  Save Assignment
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <Modal isOpen onClose={() => setDeleteId(null)} title="Delete Batch">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete batch{' '}
            <strong>{batches.find((b) => b.id === deleteId)?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
