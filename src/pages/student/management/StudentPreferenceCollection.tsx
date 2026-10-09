import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Input } from '../../../components/ui/Input'
import {
  SearchIcon,
  DownloadIcon,
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  UsersIcon,
  SaveIcon,
  AlertCircleIcon,
} from 'lucide-react'
interface StudentPref {
  id: string
  rollNo: string
  name: string
  pref1: string
  pref2: string
  pref3: string
  subjects: string
  status: 'Submitted' | 'Locked' | 'Not Submitted'
  date: string
}
const MOCK_STUDENTS: StudentPref[] = [
  {
    id: '1',
    rollNo: '101',
    name: 'Aarav Patel',
    pref1: 'Science (PCM)',
    pref2: 'Science (PCB)',
    pref3: 'Commerce',
    subjects: 'Computer Science',
    status: 'Submitted',
    date: '2024-03-15 10:30 AM',
  },
  {
    id: '2',
    rollNo: '102',
    name: 'Zara Khan',
    pref1: 'Commerce',
    pref2: 'Arts/Humanities',
    pref3: 'Science (PCB)',
    subjects: 'Economics, Accounts',
    status: 'Locked',
    date: '2024-03-14 02:15 PM',
  },
  {
    id: '3',
    rollNo: '103',
    name: 'Rohan Verma',
    pref1: '-',
    pref2: '-',
    pref3: '-',
    subjects: '-',
    status: 'Not Submitted',
    date: '-',
  },
  {
    id: '4',
    rollNo: '104',
    name: 'Ishita Sharma',
    pref1: 'Arts/Humanities',
    pref2: 'Commerce',
    pref3: 'Science (PCB)',
    subjects: 'History, Political Science',
    status: 'Submitted',
    date: '2024-03-16 09:45 AM',
  },
  {
    id: '5',
    rollNo: '105',
    name: 'Vikram Singh',
    pref1: 'Science (PCB)',
    pref2: 'Science (PCM)',
    pref3: 'Commerce',
    subjects: 'Biology, Physical Education',
    status: 'Locked',
    date: '2024-03-12 11:20 AM',
  },
  {
    id: '6',
    rollNo: '106',
    name: 'Neha Gupta',
    pref1: 'Science (PCM)',
    pref2: 'Commerce',
    pref3: 'Arts/Humanities',
    subjects: 'Physics, Mathematics',
    status: 'Submitted',
    date: '2024-03-17 08:00 AM',
  },
  {
    id: '7',
    rollNo: '107',
    name: 'Priya Reddy',
    pref1: '-',
    pref2: '-',
    pref3: '-',
    subjects: '-',
    status: 'Not Submitted',
    date: '-',
  },
  {
    id: '8',
    rollNo: '108',
    name: 'Imran Ali',
    pref1: 'Commerce',
    pref2: 'Arts/Humanities',
    pref3: 'Science (PCB)',
    subjects: 'Business Studies',
    status: 'Submitted',
    date: '2024-03-15 03:45 PM',
  },
]
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
const STATUS_OPTIONS = [
  {
    value: '',
    label: 'All Status',
  },
  {
    value: 'Submitted',
    label: 'Submitted',
  },
  {
    value: 'Locked',
    label: 'Locked',
  },
  {
    value: 'Not Submitted',
    label: 'Not Submitted',
  },
]
export function StudentPreferenceCollection() {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('admin')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [streamFilter, setStreamFilter] = useState('')
  // Student Form State
  const [pref1, setPref1] = useState('')
  const [pref2, setPref2] = useState('')
  const [pref3, setPref3] = useState('')
  const [subjects, setSubjects] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const filteredStudents = MOCK_STUDENTS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm)
    const matchesStatus = statusFilter ? s.status === statusFilter : true
    const matchesStream = streamFilter ? s.pref1 === streamFilter : true
    return matchesSearch && matchesStatus && matchesStream
  })
  const stats = {
    total: MOCK_STUDENTS.length,
    submitted: MOCK_STUDENTS.filter((s) => s.status === 'Submitted').length,
    locked: MOCK_STUDENTS.filter((s) => s.status === 'Locked').length,
    pending: MOCK_STUDENTS.filter((s) => s.status === 'Not Submitted').length,
  }
  const handleStudentSubmit = () => {
    if (!pref1) return alert('Priority 1 Stream is required')
    if (pref1 === pref2 || pref1 === pref3 || (pref2 && pref2 === pref3)) {
      return alert('Duplicate priorities are not allowed')
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
    }, 1000)
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="success">Submitted</Badge>
      case 'Locked':
        return <Badge variant="info">Locked</Badge>
      case 'Not Submitted':
        return <Badge variant="warning">Not Submitted</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }
  // Simple distribution
  const distribution = [
    'Science (PCM)',
    'Science (PCB)',
    'Commerce',
    'Arts/Humanities',
  ].map((stream) => ({
    stream,
    count: MOCK_STUDENTS.filter((s) => s.pref1 === stream).length,
  }))
  const maxCount = Math.max(...distribution.map((d) => d.count), 1)
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Preference Collection
          </h1>
          <p className="text-gray-500 mt-1">
            Capture stream and subject preferences from students
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<DownloadIcon className="w-4 h-4" />}
        >
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
          >
            Admin View
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
          >
            Student Form
          </button>
        </div>
      </Card>

      {activeTab === 'admin' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </Card>
            <Card className="p-4 text-center bg-green-50 border-green-200">
              <p className="text-2xl font-bold text-green-600">
                {stats.submitted}
              </p>
              <p className="text-xs text-green-600">Submitted</p>
            </Card>
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{stats.locked}</p>
              <p className="text-xs text-blue-600">Locked</p>
            </Card>
            <Card className="p-4 text-center bg-amber-50 border-amber-200">
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-xs text-amber-600">Pending</p>
            </Card>
          </div>

          {/* Distribution */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Preference Distribution (Priority 1)
            </h3>
            <div className="space-y-2">
              {distribution.map((d) => (
                <div key={d.stream} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36 truncate">
                    {d.stream}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5">
                    <div
                      className="bg-blue-500 h-5 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max((d.count / maxCount) * 100, 10)}%`,
                      }}
                    >
                      <span className="text-xs text-white font-bold">
                        {d.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
                label="Status"
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(val) =>
                  setStatusFilter(
                    typeof val === 'string'
                      ? val
                      : (val.target as HTMLSelectElement).value,
                  )
                }
              />
              <Select
                label="Stream (Pref 1)"
                options={[
                  {
                    value: '',
                    label: 'All Streams',
                  },
                  ...STREAM_OPTIONS.slice(1),
                ]}
                value={streamFilter}
                onChange={(val) =>
                  setStreamFilter(
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
                    setStatusFilter('')
                    setStreamFilter('')
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden">
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Pref 1
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Pref 2
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Pref 3
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Subjects
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-gray-700">
                        {s.rollNo}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {s.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{s.pref1}</td>
                      <td className="py-3 px-4 text-gray-500">{s.pref2}</td>
                      <td className="py-3 px-4 text-gray-500">{s.pref3}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {s.subjects}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {s.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </> /* Student Form */
      ) : (
        <Card className="p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Submit Your Stream Preferences
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Select your preferred streams in order of priority. Ensure no
            duplicates.
          </p>

          {formSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-700 mb-2">
                Preferences Submitted!
              </p>
              <p className="text-sm text-gray-500">
                Your preferences have been recorded. You can edit them until the
                deadline.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <Select
                label="Priority 1 Stream (Required)"
                options={STREAM_OPTIONS}
                value={pref1}
                onChange={(val) =>
                  setPref1(
                    typeof val === 'string'
                      ? val
                      : (val.target as HTMLSelectElement).value,
                  )
                }
              />
              <Select
                label="Priority 2 Stream"
                options={STREAM_OPTIONS}
                value={pref2}
                onChange={(val) =>
                  setPref2(
                    typeof val === 'string'
                      ? val
                      : (val.target as HTMLSelectElement).value,
                  )
                }
              />
              <Select
                label="Priority 3 Stream"
                options={STREAM_OPTIONS}
                value={pref3}
                onChange={(val) =>
                  setPref3(
                    typeof val === 'string'
                      ? val
                      : (val.target as HTMLSelectElement).value,
                  )
                }
              />
              <Input
                label="Subject Preferences"
                placeholder="e.g., Computer Science, Economics..."
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Career Interest / Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any career interests or notes..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {pref1 && pref2 && pref1 === pref2 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    Priority 1 and 2 cannot be the same stream
                  </span>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full"
                onClick={handleStudentSubmit}
                disabled={isSubmitting || !pref1}
                leftIcon={
                  isSubmitting ? undefined : <SaveIcon className="w-4 h-4" />
                }
              >
                {isSubmitting ? 'Submitting...' : 'Submit Preferences'}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
export default StudentPreferenceCollection
