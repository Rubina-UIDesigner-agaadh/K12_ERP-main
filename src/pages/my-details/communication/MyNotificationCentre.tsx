import React, { useCallback, useMemo, useState } from 'react'
import {
  Bell, BookOpen, Settings, Calendar, CheckCircle, Trash2, Filter, XIcon, Search, Clock, AlertCircle,
  MessageSquare, CreditCard, FileText, GraduationCap, Bus, Megaphone, Eye, ArchiveIcon, RefreshCwIcon,
  ExternalLinkIcon, MailIcon, BellOffIcon, CheckIcon,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'

const NOTIFICATION_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'academic', label: 'Academic', icon: BookOpen, color: 'text-blue-500' },
  { value: 'system', label: 'System', icon: Settings, color: 'text-gray-500' },
  { value: 'communication', label: 'Communication', icon: MessageSquare, color: 'text-orange-500' },
  { value: 'announcement', label: 'Announcements', icon: Megaphone, color: 'text-purple-500' },
  { value: 'attendance', label: 'Attendance', icon: CheckCircle, color: 'text-green-500' },
  { value: 'fee', label: 'Fee & Payments', icon: CreditCard, color: 'text-emerald-500' },
  { value: 'transport', label: 'Transport', icon: Bus, color: 'text-yellow-500' },
  { value: 'exam', label: 'Examinations', icon: FileText, color: 'text-red-500' },
  { value: 'event', label: 'Events', icon: Calendar, color: 'text-indigo-500' },
  { value: 'admission', label: 'Admission', icon: GraduationCap, color: 'text-teal-500' },
]
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' }, { value: 'unread', label: 'Unread Only' },
  { value: 'read', label: 'Read Only' }, { value: 'archived', label: 'Archived' },
]
const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' }, { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' }, { value: 'low', label: 'Low Priority' },
]
const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' }, { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' }, { value: 'month', label: 'This Month' },
]

interface Notification {
  id: string
  category: string
  title: string
  message: string
  timestamp: string
  read: boolean
  archived: boolean
  priority: 'high' | 'medium' | 'low'
  link?: string
  linkText?: string
  sender?: string
  actionRequired: boolean
  expiresAt?: string
  metadata?: Record<string, string>
}

const generateMockNotifications = (): Notification[] => [
  { id: 'NOT-001', category: 'academic', title: 'New Assignment Posted', message: 'New assignment posted for Class 10 Physics - Chapter 5: Laws of Motion. Submission deadline: March 5, 2026.', timestamp: '2026-02-26 09:30:00', read: false, archived: false, priority: 'high', link: '/assignments/123', linkText: 'View Assignment', sender: 'Mr. Anil Verma', actionRequired: true, expiresAt: '2026-03-05', metadata: { subject: 'Physics', class: '10' } },
  { id: 'NOT-002', category: 'system', title: 'Password Expiry Warning', message: 'Your password expires in 5 days. Please update your password to maintain account security.', timestamp: '2026-02-26 08:00:00', read: false, archived: false, priority: 'high', link: '/settings/security', linkText: 'Update Now', actionRequired: true, expiresAt: '2026-03-03' },
  { id: 'NOT-003', category: 'communication', title: 'Message from Principal Office', message: 'New message from Principal Office regarding Annual Day celebration and participation guidelines.', timestamp: '2026-02-25 14:00:00', read: true, archived: false, priority: 'medium', link: '/messages/456', linkText: 'Read Message', sender: 'Principal Office', actionRequired: false },
  { id: 'NOT-004', category: 'exam', title: 'Exam Schedule Released', message: 'Term 1 examination schedule has been released. Please check and prepare accordingly.', timestamp: '2026-02-24 10:00:00', read: true, archived: false, priority: 'high', link: '/exams/schedule', linkText: 'Download Schedule', actionRequired: false },
  { id: 'NOT-005', category: 'attendance', title: 'Attendance Alert', message: 'Your ward Aarav Patel was marked absent today. If this is incorrect, please contact the class teacher.', timestamp: '2026-02-26 10:15:00', read: false, archived: false, priority: 'high', link: '/attendance/today', linkText: 'View Details', sender: 'Attendance System', actionRequired: true, metadata: { student: 'Aarav Patel', class: '8-A' } },
  { id: 'NOT-006', category: 'fee', title: 'Fee Payment Reminder', message: 'Term 2 fee payment is due by March 10, 2026. Amount: ₹25,000. Please pay to avoid late fee charges.', timestamp: '2026-02-25 09:00:00', read: false, archived: false, priority: 'high', link: '/fees/pay', linkText: 'Pay Now', actionRequired: true, expiresAt: '2026-03-10', metadata: { amount: '₹25,000', dueDate: '2026-03-10' } },
  { id: 'NOT-007', category: 'transport', title: 'Bus Route Change', message: 'Route A bus timing has been changed. New pickup time: 7:15 AM instead of 7:30 AM starting from March 1.', timestamp: '2026-02-24 16:00:00', read: true, archived: false, priority: 'medium', link: '/transport/routes', linkText: 'View Route', sender: 'Transport Department', actionRequired: false },
  { id: 'NOT-008', category: 'announcement', title: 'Holiday Notice', message: 'School will remain closed on March 14, 2026 on account of Holi festival.', timestamp: '2026-02-23 11:00:00', read: true, archived: false, priority: 'low', link: '/announcements/789', linkText: 'View Details', sender: 'Admin Office', actionRequired: false },
  { id: 'NOT-009', category: 'event', title: 'Annual Day Registration', message: 'Registration for Annual Day cultural performances is now open. Last date to register: March 1, 2026.', timestamp: '2026-02-22 10:00:00', read: false, archived: false, priority: 'medium', link: '/events/annual-day', linkText: 'Register Now', actionRequired: true, expiresAt: '2026-03-01' },
  { id: 'NOT-010', category: 'academic', title: 'Report Card Available', message: 'Mid-term report card for your ward is now available for download.', timestamp: '2026-02-21 15:00:00', read: true, archived: false, priority: 'medium', link: '/reports/midterm', linkText: 'Download Report', sender: 'Academic Office', actionRequired: false },
  { id: 'NOT-011', category: 'system', title: 'Login from New Device', message: 'Your account was accessed from a new device. If this was not you, please secure your account immediately.', timestamp: '2026-02-20 18:30:00', read: true, archived: true, priority: 'high', link: '/settings/security', linkText: 'Review Activity', actionRequired: false },
  { id: 'NOT-012', category: 'admission', title: 'Admission Confirmation', message: 'Admission confirmed for session 2026-27. Please complete the remaining formalities.', timestamp: '2026-02-19 12:00:00', read: true, archived: true, priority: 'high', link: '/admission/status', linkText: 'View Status', sender: 'Admission Office', actionRequired: false },
]

export function MyNotificationCentre() {
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications())
  const [filters, setFilters] = useState({ search: '', category: 'all', status: 'all', priority: 'all', dateRange: 'all' })
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date')
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true, pushNotifications: true, smsNotifications: false,
    digestMode: false, digestFrequency: 'daily', mutedCategories: [] as string[],
  })

  const filteredNotifications = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0]
    const weekAgo = new Date(now.setDate(now.getDate() - 6)).toISOString().split('T')[0]
    const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0]
    let filtered = notifications.filter((n) => {
      if (!showArchived && n.archived) return false
      if (showArchived && !n.archived) return false
      if (filters.search && !n.title.toLowerCase().includes(filters.search.toLowerCase()) && !n.message.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.category !== 'all' && n.category !== filters.category) return false
      if (filters.status === 'unread' && n.read) return false
      if (filters.status === 'read' && !n.read) return false
      if (filters.priority !== 'all' && n.priority !== filters.priority) return false
      const notifDate = n.timestamp.split(' ')[0]
      if (filters.dateRange === 'today' && notifDate !== today) return false
      if (filters.dateRange === 'yesterday' && notifDate !== yesterday) return false
      if (filters.dateRange === 'week' && notifDate < weekAgo) return false
      if (filters.dateRange === 'month' && notifDate < monthAgo) return false
      return true
    })
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (diff !== 0) return diff
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    return filtered
  }, [notifications, filters, showArchived, sortBy])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read && !n.archived).length, [notifications])
  const actionRequiredCount = useMemo(() => notifications.filter((n) => n.actionRequired && !n.read && !n.archived).length, [notifications])
  const handleMarkAsRead = useCallback((id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)), [])
  const handleMarkAsUnread = useCallback((id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n)), [])
  const handleMarkAllAsRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), [])
  const handleArchive = useCallback((id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, archived: true, read: true } : n)), [])
  const handleUnarchive = useCallback((id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, archived: false } : n)), [])
  const handleDelete = useCallback((id: string) => { if (confirm('Delete this notification?')) setNotifications((prev) => prev.filter((n) => n.id !== id)) }, [])
  const handleClearOld = useCallback(() => {
    if (confirm('Clear all read notifications older than 7 days?')) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      setNotifications((prev) => prev.filter((n) => !n.read || new Date(n.timestamp) > weekAgo))
    }
  }, [])
  const handleBulkMarkRead = useCallback(() => { setNotifications((prev) => prev.map((n) => selectedIds.includes(n.id) ? { ...n, read: true } : n)); setSelectedIds([]) }, [selectedIds])
  const handleBulkArchive = useCallback(() => { setNotifications((prev) => prev.map((n) => selectedIds.includes(n.id) ? { ...n, archived: true, read: true } : n)); setSelectedIds([]) }, [selectedIds])
  const handleBulkDelete = useCallback(() => {
    if (confirm(`Delete ${selectedIds.length} notifications?`)) { setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id))); setSelectedIds([]) }
  }, [selectedIds])
  const handleSelectAll = useCallback(() => setSelectedIds((prev) => prev.length === filteredNotifications.length ? [] : filteredNotifications.map((n) => n.id)), [filteredNotifications])
  const handleToggleSelect = useCallback((id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]), [])
  const handleClearFilters = useCallback(() => setFilters({ search: '', category: 'all', status: 'all', priority: 'all', dateRange: 'all' }), [])
  const handleViewDetails = useCallback((notification: Notification) => {
    setSelectedNotification(notification); setShowDetailsModal(true)
    if (!notification.read) handleMarkAsRead(notification.id)
  }, [handleMarkAsRead])

  const getIcon = (category: string) => {
    const cat = NOTIFICATION_CATEGORIES.find((c) => c.value === category)
    if (!cat || !cat.icon) return <Bell className="w-5 h-5 text-gray-500" />
    const Icon = cat.icon
    return <Icon className={`w-5 h-5 ${cat.color}`} />
  }
  const getPriorityBadge = (priority: string) => (
    <Badge variant={({ high: 'danger', medium: 'warning', low: 'secondary' }[priority] as any)}>{priority}</Badge>
  )
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Stay updated with latest alerts and announcements</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && <Badge variant="warning">{unreadCount} unread</Badge>}
          {actionRequiredCount > 0 && <Badge variant="danger">{actionRequiredCount} action required</Badge>}
          <Button variant="outline" onClick={() => setShowArchived(!showArchived)}><ArchiveIcon className="w-4 h-4 mr-2" />{showArchived ? 'View Active' : 'View Archived'}</Button>
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}><CheckCircle className="w-4 h-4 mr-2" />Mark All Read</Button>
          <Button variant="outline" onClick={handleClearOld}><Trash2 className="w-4 h-4 mr-2" />Clear Old</Button>
          <Button variant="outline" onClick={() => setShowSettingsModal(true)}><Settings className="w-4 h-4 mr-2" />Settings</Button>
        </div>
      </div>
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search notifications..." value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} className="pl-10" />
            </div>
            <Select options={NOTIFICATION_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))} value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} />
            <Select options={STATUS_OPTIONS} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} />
            <Select options={PRIORITY_OPTIONS} value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} />
            <Select options={DATE_OPTIONS} value={filters.dateRange} onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value }))} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0} onChange={handleSelectAll} />Select All
              </label>
              {selectedIds.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleBulkMarkRead}><CheckCircle className="w-3 h-3 mr-1" />Mark Read</Button>
                  <Button variant="outline" size="sm" onClick={handleBulkArchive}><ArchiveIcon className="w-3 h-3 mr-1" />Archive</Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
                  <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select options={[{ value: 'date', label: 'Sort by Date' }, { value: 'priority', label: 'Sort by Priority' }]} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-40" />
              <Button variant="outline" size="sm" onClick={handleClearFilters}><Filter className="w-3 h-3 mr-1" />Clear</Button>
              <Button variant="outline" size="sm" onClick={() => setNotifications(generateMockNotifications())}><RefreshCwIcon className="w-3 h-3 mr-1" />Refresh</Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <Card key={notif.id} className={`cursor-pointer transition-all hover:shadow-md ${!notif.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`} onClick={() => handleViewDetails(notif)}>
            <div className="flex items-start gap-4">
              <input type="checkbox" checked={selectedIds.includes(notif.id)} onChange={(e) => { e.stopPropagation(); handleToggleSelect(notif.id) }} onClick={(e) => e.stopPropagation()} className="mt-3" />
              <div className="p-2 bg-white rounded-full shadow-sm">{getIcon(notif.category)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</h3>
                    {getPriorityBadge(notif.priority)}
                    <Badge variant="secondary">{NOTIFICATION_CATEGORIES.find((c) => c.value === notif.category)?.label}</Badge>
                    {notif.actionRequired && !notif.read && <Badge variant="danger">Action Required</Badge>}
                    {notif.expiresAt && new Date(notif.expiresAt) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) && <Badge variant="warning">Expiring Soon</Badge>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1"><Clock className="w-3 h-3" />{formatTimestamp(notif.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                {notif.sender && <p className="text-xs text-gray-400 mt-1">From: {notif.sender}</p>}
                <div className="flex items-center gap-3 mt-2">
                  {notif.linkText && (
                    <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); alert(`Navigate to: ${notif.link}`) }}>
                      {notif.linkText}<ExternalLinkIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); notif.read ? handleMarkAsUnread(notif.id) : handleMarkAsRead(notif.id) }}><Eye className="w-3 h-3" /></Button>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); notif.archived ? handleUnarchive(notif.id) : handleArchive(notif.id) }}><ArchiveIcon className="w-3 h-3" /></Button>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(notif.id) }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </Card>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">{showArchived ? 'No archived notifications' : 'No notifications found'}</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">{getIcon(selectedNotification.category)}</div>
                <div>
                  <h2 className="text-lg font-bold">{selectedNotification.title}</h2>
                  <div className="flex items-center gap-2 mt-1">{getPriorityBadge(selectedNotification.priority)}<Badge variant="secondary">{NOTIFICATION_CATEGORIES.find((c) => c.value === selectedNotification.category)?.label}</Badge></div>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)}><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-700">{selectedNotification.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Time:</span><span className="ml-2 font-medium">{selectedNotification.timestamp}</span></div>
                {selectedNotification.sender && <div><span className="text-gray-500">From:</span><span className="ml-2 font-medium">{selectedNotification.sender}</span></div>}
                {selectedNotification.expiresAt && <div><span className="text-gray-500">Expires:</span><span className="ml-2 font-medium">{selectedNotification.expiresAt}</span></div>}
                <div><span className="text-gray-500">Status:</span><span className="ml-2 font-medium">{selectedNotification.read ? 'Read' : 'Unread'}</span></div>
              </div>
              {selectedNotification.metadata && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Additional Details:</p>
                  {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm"><span className="text-gray-500 capitalize">{key}:</span><span className="font-medium">{value}</span></div>
                  ))}
                </div>
              )}
              {selectedNotification.actionRequired && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" /><span className="text-sm text-yellow-700">This notification requires your action</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { selectedNotification.read ? handleMarkAsUnread(selectedNotification.id) : handleMarkAsRead(selectedNotification.id); setSelectedNotification((prev) => prev ? { ...prev, read: !prev.read } : null) }}>{selectedNotification.read ? 'Mark Unread' : 'Mark Read'}</Button>
                <Button variant="outline" size="sm" onClick={() => { handleArchive(selectedNotification.id); setShowDetailsModal(false) }}><ArchiveIcon className="w-3 h-3 mr-1" />Archive</Button>
                <Button variant="outline" size="sm" onClick={() => { handleDelete(selectedNotification.id); setShowDetailsModal(false) }}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
              </div>
              <div className="flex gap-2">
                {selectedNotification.linkText && <Button variant="primary" onClick={() => alert(`Navigate to: ${selectedNotification.link}`)}>{selectedNotification.linkText}<ExternalLinkIcon className="w-4 h-4 ml-2" /></Button>}
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Notification Settings</h2>
              <button onClick={() => setShowSettingsModal(false)}><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Notification Channels</h3>
                {[{ key: 'emailNotifications', label: 'Email Notifications', icon: MailIcon }, { key: 'pushNotifications', label: 'Push Notifications', icon: Bell }, { key: 'smsNotifications', label: 'SMS Notifications', icon: MessageSquare }].map((channel) => (
                  <label key={channel.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2"><channel.icon className="w-4 h-4 text-gray-500" /><span className="text-sm">{channel.label}</span></div>
                    <input type="checkbox" checked={notificationSettings[channel.key as keyof typeof notificationSettings] as boolean} onChange={(e) => setNotificationSettings((s) => ({ ...s, [channel.key]: e.target.checked }))} />
                  </label>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Digest Mode</h3>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-sm">Enable Digest Mode</span>
                  <input type="checkbox" checked={notificationSettings.digestMode} onChange={(e) => setNotificationSettings((s) => ({ ...s, digestMode: e.target.checked }))} />
                </label>
                {notificationSettings.digestMode && (
                  <Select label="Digest Frequency" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} value={notificationSettings.digestFrequency} onChange={(e) => setNotificationSettings((s) => ({ ...s, digestFrequency: e.target.value }))} />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Muted Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {NOTIFICATION_CATEGORIES.slice(1).map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.mutedCategories.includes(cat.value)} onChange={(e) => setNotificationSettings((s) => ({ ...s, mutedCategories: e.target.checked ? [...s.mutedCategories, cat.value] : s.mutedCategories.filter((c) => c !== cat.value) }))} />
                      <BellOffIcon className="w-3 h-3 text-gray-400" />{cat.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { alert('Settings saved!'); setShowSettingsModal(false) }}><CheckIcon className="w-4 h-4 mr-2" />Save Settings</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyNotificationCentre
