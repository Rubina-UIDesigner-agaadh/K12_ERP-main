import React, { useCallback, useMemo, useState } from 'react'
import {
  Smartphone,
  Monitor,
  LogOut,
  ShieldCheck,
  Globe,
  Clock,
  MapPin,
  X as XIcon,
  AlertTriangle,
  RefreshCw,
  Tablet,
  Eye,
  Activity,
  Filter,
  Search,
  Info,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEVICE_TYPES = [
  { value: 'all', label: 'All Devices' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
]

const SESSION_STATUS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string
  device: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  ipAddress: string
  location: string
  city: string
  country: string
  lastActiveTimestamp: string
  loginTime: string
  isCurrent: boolean
  status: 'active' | 'inactive'
}

interface LoginHistory {
  id: string
  timestamp: string
  device: string
  browser: string
  ipAddress: string
  location: string
  status: 'success' | 'failed' | 'blocked'
  action: string
  reason?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialSessions: Session[] = [
  {
    id: 'SES-001',
    device: 'Windows PC',
    deviceType: 'desktop',
    browser: 'Chrome',
    browserVersion: '120.0.6099.130',
    os: 'Windows',
    osVersion: '11',
    ipAddress: '192.168.1.105',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    country: 'India',
    lastActiveTimestamp: new Date().toISOString(),
    loginTime: '2026-02-26 09:15:00',
    isCurrent: true,
    status: 'active',
  },
  {
    id: 'SES-002',
    device: 'iPhone 14 Pro',
    deviceType: 'mobile',
    browser: 'Safari',
    browserVersion: '17.2',
    os: 'iOS',
    osVersion: '17.2.1',
    ipAddress: '10.5.4.32',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    country: 'India',
    lastActiveTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    loginTime: '2026-02-26 07:30:00',
    isCurrent: false,
    status: 'active',
  },
  {
    id: 'SES-003',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Firefox',
    browserVersion: '121.0',
    os: 'macOS',
    osVersion: 'Sonoma 14.2',
    ipAddress: '172.16.0.5',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    country: 'India',
    lastActiveTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    loginTime: '2026-02-23 14:45:00',
    isCurrent: false,
    status: 'inactive',
  },
  {
    id: 'SES-004',
    device: 'iPad Pro',
    deviceType: 'tablet',
    browser: 'Safari',
    browserVersion: '17.2',
    os: 'iPadOS',
    osVersion: '17.2',
    ipAddress: '192.168.1.110',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    country: 'India',
    lastActiveTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    loginTime: '2026-02-25 18:20:00',
    isCurrent: false,
    status: 'inactive',
  },
  {
    id: 'SES-005',
    device: 'Samsung Galaxy S23',
    deviceType: 'mobile',
    browser: 'Chrome',
    browserVersion: '120.0',
    os: 'Android',
    osVersion: '14',
    ipAddress: '103.45.67.89',
    location: 'Delhi, NCR',
    city: 'Delhi',
    country: 'India',
    lastActiveTimestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    loginTime: '2026-02-21 11:00:00',
    isCurrent: false,
    status: 'inactive',
  },
]

const initialLoginHistory: LoginHistory[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-02-26 09:15:00',
    device: 'Windows PC',
    browser: 'Chrome 120',
    ipAddress: '192.168.1.105',
    location: 'Ahmedabad, India',
    status: 'success',
    action: 'Login',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-02-26 07:30:00',
    device: 'iPhone 14 Pro',
    browser: 'Safari 17',
    ipAddress: '10.5.4.32',
    location: 'Ahmedabad, India',
    status: 'success',
    action: 'Login',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-02-25 22:45:00',
    device: 'Unknown Device',
    browser: 'Chrome 119',
    ipAddress: '45.67.89.123',
    location: 'Unknown Location',
    status: 'blocked',
    action: 'Login Attempt',
    reason: 'Suspicious location',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-02-25 18:20:00',
    device: 'iPad Pro',
    browser: 'Safari 17',
    ipAddress: '192.168.1.110',
    location: 'Ahmedabad, India',
    status: 'success',
    action: 'Login',
  },
  {
    id: 'LOG-005',
    timestamp: '2026-02-25 14:30:00',
    device: 'Windows PC',
    browser: 'Chrome 120',
    ipAddress: '192.168.1.105',
    location: 'Ahmedabad, India',
    status: 'failed',
    action: 'Login Attempt',
    reason: 'Incorrect password',
  },
  {
    id: 'LOG-006',
    timestamp: '2026-02-24 10:00:00',
    device: 'MacBook Pro',
    browser: 'Firefox 121',
    ipAddress: '172.16.0.5',
    location: 'Mumbai, India',
    status: 'success',
    action: 'Login',
  },
  {
    id: 'LOG-007',
    timestamp: '2026-02-23 16:45:00',
    device: 'Windows PC',
    browser: 'Chrome 120',
    ipAddress: '192.168.1.105',
    location: 'Ahmedabad, India',
    status: 'success',
    action: 'Password Changed',
  },
  {
    id: 'LOG-008',
    timestamp: '2026-02-21 11:00:00',
    device: 'Samsung Galaxy S23',
    browser: 'Chrome 120',
    ipAddress: '103.45.67.89',
    location: 'Delhi, India',
    status: 'success',
    action: 'Login',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDeviceIcon(deviceType: string) {
  switch (deviceType) {
    case 'mobile':
      return Smartphone
    case 'tablet':
      return Tablet
    default:
      return Monitor
  }
}

function formatLastActive(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Active Now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function HistoryStatusBadge({ status }: { status: LoginHistory['status'] }) {
  return (
    <Badge
      variant={
        status === 'success' ? 'success' : status === 'failed' ? 'warning' : 'danger'
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

// ─── Session Detail Modal ─────────────────────────────────────────────────────

function SessionDetailModal({
  session,
  onClose,
  onSignOut,
}: {
  session: Session
  onClose: () => void
  onSignOut: (id: string) => void
}) {
  const DeviceIcon = getDeviceIcon(session.deviceType)

  const details: [string, string][] = [
    ['Session ID', session.id],
    ['Browser', `${session.browser} ${session.browserVersion}`],
    ['Operating System', `${session.os} ${session.osVersion}`],
    ['IP Address', session.ipAddress],
    ['Location', session.location],
    ['Country', session.country],
    ['Login Time', session.loginTime],
    [
      'Last Active',
      session.isCurrent ? 'Now' : formatLastActive(session.lastActiveTimestamp),
    ],
  ]

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Session Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Device summary */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div
              className={`p-3 rounded-full ${
                session.isCurrent
                  ? 'bg-blue-100 text-blue-600'
                  : session.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              <DeviceIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{session.device}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {session.isCurrent && <Badge variant="success">Current Session</Badge>}
                <Badge variant={session.status === 'active' ? 'success' : 'secondary'}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {!session.isCurrent && (
            <Button
              variant="outline"
              onClick={() => {
                onSignOut(session.id)
                onClose()
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Device
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Sign Out All Modal ───────────────────────────────────────────────────────

function SignOutAllModal({
  sessions,
  onClose,
  onConfirm,
}: {
  sessions: Session[]
  onClose: () => void
  onConfirm: () => void
}) {
  const otherSessions = sessions.filter((s) => !s.isCurrent)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Sign Out All Other Devices
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                This will sign out {otherSessions.length} other device
                {otherSessions.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                You will remain logged in on this device. All other devices will
                need to log in again.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Devices to be signed out:
            </p>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
              {otherSessions.map((s) => {
                const DeviceIcon = getDeviceIcon(s.deviceType)
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-3 bg-white text-sm text-gray-700"
                  >
                    <DeviceIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{s.device}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500 text-xs">{s.location}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out All
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MyDeviceSessions() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [loginHistory] = useState<LoginHistory[]>(initialLoginHistory)

  const [activeTab, setActiveTab] = useState<'sessions' | 'history'>('sessions')

  const [filters, setFilters] = useState({
    search: '',
    deviceType: 'all',
    status: 'all',
  })

  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSignOutAllModal, setShowSignOutAllModal] = useState(false)

  // ── Derived values ──────────────────────────────────────────────────────────

  const filteredSessions = useMemo(
    () =>
      sessions.filter((s) => {
        if (
          filters.search &&
          !s.device.toLowerCase().includes(filters.search.toLowerCase()) &&
          !s.browser.toLowerCase().includes(filters.search.toLowerCase()) &&
          !s.location.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false
        if (filters.deviceType !== 'all' && s.deviceType !== filters.deviceType)
          return false
        if (filters.status !== 'all' && s.status !== filters.status) return false
        return true
      }),
    [sessions, filters],
  )

  const activeSessionsCount = useMemo(
    () => sessions.filter((s) => s.status === 'active').length,
    [sessions],
  )

  const otherSessionsCount = useMemo(
    () => sessions.filter((s) => !s.isCurrent).length,
    [sessions],
  )

  const hasSuspiciousActivity = useMemo(
    () => loginHistory.some((l) => l.status === 'blocked' || l.status === 'failed'),
    [loginHistory],
  )

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSignOut = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }, [])

  const handleSignOutAll = useCallback(() => {
    setSessions((prev) => prev.filter((s) => s.isCurrent))
    setShowSignOutAllModal(false)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', deviceType: 'all', status: 'all' })
  }, [])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.deviceType !== 'all' ||
    filters.status !== 'all'

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage all devices currently logged into your account
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSignOutAllModal(true)}
            disabled={otherSessionsCount === 0}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out All Others
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Active Sessions',
            value: activeSessionsCount,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Total Devices',
            value: sessions.length,
            icon: Monitor,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Other Sessions',
            value: otherSessionsCount,
            icon: Globe,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
        ].map((stat) => (
          <Card key={stat.label} noPadding>
            <div className="flex items-center gap-4 p-4">
              <div className={`w-11 h-11 ${stat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'sessions' as const, label: 'Active Sessions', icon: Monitor, count: sessions.length },
          { key: 'history' as const, label: 'Login History', icon: Clock, count: loginHistory.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <Badge variant="secondary">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* ── Sessions Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card noPadding>
            <div className="flex flex-wrap gap-3 p-4">
              <div className="flex-1 min-w-48 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search by device, browser, or location…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
              <Select
                options={DEVICE_TYPES}
                value={filters.deviceType}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, deviceType: typeof e === 'string' ? e : e.target.value }))
                }
                className="w-40"
              />
              <Select
                options={SESSION_STATUS}
                value={filters.status}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, status: typeof e === 'string' ? e : e.target.value }))
                }
                className="w-40"
              />
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  <Filter className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Session cards */}
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType)
              return (
                <Card
                  key={session.id}
                  noPadding
                  className={session.isCurrent ? 'border-blue-200 bg-blue-50/30' : ''}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                    {/* Left: device info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full flex-shrink-0 ${
                          session.isCurrent
                            ? 'bg-blue-100 text-blue-600'
                            : session.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <DeviceIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{session.device}</h3>
                          {session.isCurrent && (
                            <Badge variant="success">Current Session</Badge>
                          )}
                          {session.status === 'active' && !session.isCurrent && (
                            <Badge variant="secondary">Active</Badge>
                          )}
                          {session.status === 'inactive' && (
                            <Badge variant="warning">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {session.browser} {session.browserVersion} · {session.os}{' '}
                          {session.osVersion}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              session.isCurrent ? 'text-green-600 font-medium' : ''
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {session.isCurrent
                              ? 'Active Now'
                              : formatLastActive(session.lastActiveTimestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!session.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSignOut(session.id)}
                          title="Sign out this device"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}

            {filteredSessions.length === 0 && (
              <div className="text-center py-14 text-gray-500">
                <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-base font-medium">No devices found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Security tip */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Security Tip</h4>
              <p className="text-sm text-green-800 mt-0.5">
                If you see a device you don't recognise, sign it out immediately and
                change your password. Consider enabling two-factor authentication for
                added security.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── History Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {hasSuspiciousActivity && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Suspicious Activity Detected
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  There have been failed or blocked login attempts on your account.
                  If you don't recognise this activity, please change your password
                  immediately.
                </p>
              </div>
            </div>
          )}

          <Card noPadding>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Login Activity</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                A record of all recent sign-in attempts and security events
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    {[
                      'Date & Time',
                      'Action',
                      'Device',
                      'Browser',
                      'IP Address',
                      'Location',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginHistory.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-gray-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {log.device}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {log.browser}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {log.location}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <HistoryStatusBadge status={log.status} />
                          {log.reason && (
                            <span
                              className="text-gray-400 cursor-help"
                              title={log.reason}
                            >
                              <Info className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Session Detail Modal ──────────────────────────────────────────── */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSignOut={(id) => {
            handleSignOut(id)
            setSelectedSession(null)
          }}
        />
      )}

      {/* ── Sign Out All Modal ────────────────────────────────────────────── */}
      {showSignOutAllModal && (
        <SignOutAllModal
          sessions={sessions}
          onClose={() => setShowSignOutAllModal(false)}
          onConfirm={handleSignOutAll}
        />
      )}
    </div>
  )
}

export default MyDeviceSessions
