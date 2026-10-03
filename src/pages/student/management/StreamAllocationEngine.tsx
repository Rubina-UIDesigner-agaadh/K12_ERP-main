import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Badge } from '../../../components/ui/Badge'
import {
  SettingsIcon,
  PlayIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  DatabaseIcon,
  ActivityIcon,
  FileTextIcon,
} from 'lucide-react'
interface AllocationResult {
  id: string
  name: string
  marks: string
  pref: string
  allocated: string
  status: string
}
const MOCK_RESULTS: AllocationResult[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    marks: '92%',
    pref: 'Science (PCM) [P1]',
    allocated: 'Science (PCM)',
    status: 'Successfully Allocated',
  },
  {
    id: '2',
    name: 'Zara Khan',
    marks: '88%',
    pref: 'Commerce [P1]',
    allocated: 'Commerce',
    status: 'Successfully Allocated',
  },
  {
    id: '3',
    name: 'Rohan Verma',
    marks: '65%',
    pref: 'Science (PCM) [P1]',
    allocated: 'Commerce',
    status: 'Preference Not Met',
  },
  {
    id: '4',
    name: 'Ishita Sharma',
    marks: '72%',
    pref: 'Arts/Humanities [P1]',
    allocated: 'Arts/Humanities',
    status: 'Successfully Allocated',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    marks: '55%',
    pref: 'Science (PCB) [P1]',
    allocated: '-',
    status: 'Not Eligible',
  },
  {
    id: '6',
    name: 'Neha Gupta',
    marks: '81%',
    pref: 'Science (PCM) [P1]',
    allocated: '-',
    status: 'Waitlisted (No Seats)',
  },
]
const VALIDATION_CHECKS = [
  {
    label: 'Eligibility criteria configured',
    ok: true,
  },
  {
    label: 'Stream capacities defined',
    ok: true,
  },
  {
    label: 'Student preferences submitted (85%)',
    ok: true,
  },
  {
    label: 'Marks data available',
    ok: true,
  },
  {
    label: 'All streams have at least 1 seat',
    ok: false,
  },
]
export function StreamAllocationEngine() {
  const [isDryRun, setIsDryRun] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [capPCM, setCapPCM] = useState('120')
  const [capPCB, setCapPCB] = useState('80')
  const [capComm, setCapComm] = useState('150')
  const [capArts, setCapArts] = useState('100')
  const [logs, setLogs] = useState<string[]>([])
  const handleRun = () => {
    setIsRunning(true)
    setLogs([])
    const logMessages = [
      'Starting allocation engine...',
      'Validating eligibility criteria...',
      'Loading student preferences (170 students)...',
      'Sorting students by merit...',
      'Processing Priority 1 preferences...',
      'Processing Priority 2 preferences...',
      'Processing Priority 3 preferences...',
      'Handling conflicts and waitlists...',
      `Allocation complete. Mode: ${isDryRun ? 'DRY RUN' : 'FINAL'}`,
    ]
    logMessages.forEach((msg, i) => {
      setTimeout(
        () => {
          setLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ${msg}`,
          ])
          if (i === logMessages.length - 1) {
            setIsRunning(false)
            setHasRun(true)
          }
        },
        (i + 1) * 300,
      )
    })
  }
  const getStatusBadge = (status: string) => {
    if (status.includes('Successfully'))
      return <Badge variant="success">Allocated</Badge>
    if (status.includes('Preference Not'))
      return <Badge variant="warning">Pref Not Met</Badge>
    if (status.includes('Not Eligible'))
      return <Badge variant="danger">Not Eligible</Badge>
    if (status.includes('Waitlisted'))
      return <Badge variant="info">Waitlisted</Badge>
    return <Badge variant="default">{status}</Badge>
  }
  const allocated = MOCK_RESULTS.filter((r) =>
    r.status.includes('Successfully'),
  ).length
  const conflicts = MOCK_RESULTS.filter(
    (r) => !r.status.includes('Successfully'),
  ).length
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Stream Allocation Engine
          </h1>
          <p className="text-gray-500 mt-1">
            Configure and execute stream allocation logic
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsDryRun(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isDryRun ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
            >
              Dry Run
            </button>
            <button
              onClick={() => setIsDryRun(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isDryRun ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'}`}
            >
              Final Run
            </button>
          </div>
          <Button
            variant="primary"
            onClick={handleRun}
            disabled={isRunning}
            leftIcon={
              isRunning ? (
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )
            }
          >
            {isRunning
              ? 'Running...'
              : isDryRun
                ? 'Run Simulation'
                : 'Run Final Allocation'}
          </Button>
        </div>
      </div>

      {!isDryRun && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700 font-medium">
            FINAL RUN mode — This will permanently assign streams to students.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre-Run Validation */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            Pre-Run Validation
          </h3>
          <div className="space-y-2">
            {VALIDATION_CHECKS.map((check, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
              >
                {check.ok ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${check.ok ? 'text-gray-700' : 'text-red-600'}`}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Stream Capacity */}
        <Card className="p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-blue-500" />
            Stream Capacity Configuration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Science (PCM)"
              type="number"
              value={capPCM}
              onChange={(e) => setCapPCM(e.target.value)}
            />
            <Input
              label="Science (PCB)"
              type="number"
              value={capPCB}
              onChange={(e) => setCapPCB(e.target.value)}
            />
            <Input
              label="Commerce"
              type="number"
              value={capComm}
              onChange={(e) => setCapComm(e.target.value)}
            />
            <Input
              label="Arts/Humanities"
              type="number"
              value={capArts}
              onChange={(e) => setCapArts(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Execution Logs */}
      {logs.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-gray-500" />
            Execution Log
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 py-0.5">
                {log}
              </div>
            ))}
            {isRunning && (
              <div className="text-yellow-400 animate-pulse">Processing...</div>
            )}
          </div>
        </Card>
      )}

      {/* Results */}
      {hasRun && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_RESULTS.length}
              </p>
              <p className="text-xs text-gray-500">Total Processed</p>
            </Card>
            <Card className="p-4 text-center bg-green-50 border-green-200">
              <p className="text-2xl font-bold text-green-600">{allocated}</p>
              <p className="text-xs text-green-600">Allocated</p>
            </Card>
            <Card className="p-4 text-center bg-amber-50 border-amber-200">
              <p className="text-2xl font-bold text-amber-600">{conflicts}</p>
              <p className="text-xs text-amber-600">Conflicts</p>
            </Card>
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <p className="text-2xl font-bold text-blue-600">
                {isDryRun ? 'Simulation' : 'Final'}
              </p>
              <p className="text-xs text-blue-600">Mode</p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="font-medium text-gray-900">
                Allocation Preview
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Student
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Marks
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Preference
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Allocated
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_RESULTS.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {r.name}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">
                        {r.marks}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {r.pref}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{r.allocated}</td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(r.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
export default StreamAllocationEngine
