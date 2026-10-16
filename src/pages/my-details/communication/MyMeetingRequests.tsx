import React, { useState, useMemo } from 'react'
import {
  Calendar, Clock, MapPin, Plus, Check, X, RefreshCw, Filter, Edit2, Trash2, Video, Users, Phone, MessageSquare,
  ChevronDown, Send, AlertTriangle, CheckCircle, XCircle, History, Paperclip, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownLeft, Link, Copy, ExternalLink, Search,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'

const BRANCH_OPTIONS = [
  { value: 'branch_science', label: 'Science Branch' },
  { value: 'branch_commerce', label: 'Commerce Branch' },
  { value: 'branch_arts', label: 'Arts Branch' },
  { value: 'branch_engineering', label: 'Engineering Branch' },
  { value: 'branch_medical', label: 'Medical Branch' },
]
const STAFF_OPTIONS = [
  { value: 'staff_principal', label: 'Principal' },
  { value: 'staff_vp', label: 'Vice Principal' },
  { value: 'staff_counselor', label: 'School Counselor' },
  { value: 'staff_hod_science', label: 'HOD - Science' },
  { value: 'staff_hod_maths', label: 'HOD - Mathematics' },
  { value: 'staff_hod_english', label: 'HOD - English' },
  { value: 'staff_sports', label: 'Sports Teacher' },
  { value: 'staff_admin', label: 'Admin Staff' },
  { value: 'staff_librarian', label: 'Librarian' },
  { value: 'staff_it', label: 'IT Staff' },
]
const meetingCategories = [
  { value: 'academic', label: 'Academic Discussion' },
  { value: 'discipline', label: 'Discipline Issue' },
  { value: 'progress', label: 'Progress Review' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'complaint', label: 'Complaint Resolution' },
  { value: 'general', label: 'General Meeting' },
  { value: 'pta', label: 'PTA Meeting' },
  { value: 'staff', label: 'Staff Meeting' },
  { value: 'other', label: 'Other' },
]
const locationOptions = [
  { value: 'online_video', label: 'Online (Video Call)' },
  { value: 'online_phone', label: 'Online (Phone Call)' },
  { value: 'staffroom', label: 'Staff Room' },
  { value: 'principal_office', label: 'Principal Office' },
  { value: 'conference_room', label: 'Conference Room' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'counselor_office', label: 'Counselor Office' },
]
const durationOptions = [
  { value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }, { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' }, { value: '90', label: '1.5 hours' }, { value: '120', label: '2 hours' },
]
const priorityOptions = [
  { value: 'high', label: 'High Priority' }, { value: 'medium', label: 'Medium Priority' }, { value: 'low', label: 'Low Priority' },
]
const statusFilters = [
  { value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' }, { value: 'rescheduled', label: 'Rescheduled' }, { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
const reminderOptions = [
  { value: '15min', label: '15 minutes before' }, { value: '30min', label: '30 minutes before' },
  { value: '1hour', label: '1 hour before' }, { value: '1day', label: '1 day before' }, { value: '2days', label: '2 days before' },
]
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const statusDotColor: Record<string, string> = { pending: 'bg-amber-400', accepted: 'bg-emerald-500', declined: 'bg-red-500', rescheduled: 'bg-blue-400', completed: 'bg-gray-400', cancelled: 'bg-gray-300' }
const categoryColor: Record<string, string> = { academic: 'bg-blue-500', discipline: 'bg-red-500', progress: 'bg-emerald-500', counseling: 'bg-purple-500', complaint: 'bg-orange-500', general: 'bg-gray-500', pta: 'bg-pink-500', staff: 'bg-indigo-500', other: 'bg-gray-400' }
const categoryBg: Record<string, string> = {
  academic: 'bg-blue-50 border-blue-200 text-blue-800', discipline: 'bg-red-50 border-red-200 text-red-800',
  progress: 'bg-emerald-50 border-emerald-200 text-emerald-800', counseling: 'bg-purple-50 border-purple-200 text-purple-800',
  complaint: 'bg-orange-50 border-orange-200 text-orange-800', general: 'bg-gray-50 border-gray-200 text-gray-800',
  pta: 'bg-pink-50 border-pink-200 text-pink-800', staff: 'bg-indigo-50 border-indigo-200 text-indigo-800', other: 'bg-gray-50 border-gray-200 text-gray-700',
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { variant: string; icon: any }> = {
    pending: { variant: 'warning', icon: Clock }, accepted: { variant: 'success', icon: CheckCircle },
    declined: { variant: 'danger', icon: XCircle }, rescheduled: { variant: 'info', icon: RefreshCw },
    completed: { variant: 'success', icon: Check }, cancelled: { variant: 'default', icon: X },
  }
  const { variant, icon: Icon } = config[status] || config.pending
  return <Badge variant={variant as any} className="flex items-center gap-1"><Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}
const getPriorityBadge = (priority: string) => {
  const config: Record<string, string> = { high: 'danger', medium: 'warning', low: 'info' }
  return <Badge variant={config[priority] as any}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>
}

function MultiSelectDropdown({ label, options, selected, onChange, placeholder }: {
  label?: string; options: { value: string; label: string }[]; selected: string[]; onChange: (v: string[]) => void; placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const toggle = (value: string) => onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  const getLabel = (value: string) => options.find(o => o.value === value)?.label || value
  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className="truncate text-left text-gray-700">{selected.length === 0 ? placeholder || 'Select…' : selected.map(getLabel).join(', ')}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
              <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => toggle(opt.value)} className="rounded" />{opt.label}
            </label>
          ))}
          <div className="p-2 border-t"><button onClick={() => setOpen(false)} className="w-full text-xs text-center text-blue-600 hover:underline">Done</button></div>
        </div>
      )}
    </div>
  )
}

const initialIncomingRequests = [
  { id: 1, type: 'incoming', organizer: 'Mrs. Sharma', organizerRole: 'Parent', organizerEmail: 'sharma@email.com', organizerPhone: '9876543210', recipient: 'Mr. Patel (You)', recipientRole: 'Teacher', subject: 'Discuss Student Progress', description: "Want to discuss Rahul's academic progress and areas for improvement.", category: 'progress', customCategory: '', priority: 'medium', date: '2024-11-15', time: '10:00', duration: 30, location: 'Staff Room', locationType: 'in_person', meetingLink: '', status: 'pending', createdAt: '2024-11-10', updatedAt: '2024-11-10', reminders: true, reminderTime: '1hour', notes: '', attachments: [], rescheduleHistory: [], responses: [], selectedBranches: [], selectedStaff: [] },
  { id: 2, type: 'incoming', organizer: 'Principal', organizerRole: 'Principal', organizerEmail: 'principal@school.com', organizerPhone: '9876543200', recipient: 'Mr. Patel (You)', recipientRole: 'Teacher', subject: 'Staff Performance Review', description: 'Quarterly performance review meeting.', category: 'staff', customCategory: '', priority: 'high', date: '2024-11-18', time: '14:00', duration: 60, location: 'Principal Office', locationType: 'in_person', meetingLink: '', status: 'accepted', createdAt: '2024-11-08', updatedAt: '2024-11-09', reminders: true, reminderTime: '1day', notes: 'Bring performance reports', attachments: ['performance_report.pdf'], rescheduleHistory: [], responses: [{ date: '2024-11-09', action: 'accepted', message: 'Looking forward to the meeting.', by: 'Mr. Patel' }], selectedBranches: ['branch_science'], selectedStaff: ['staff_principal'] },
  { id: 3, type: 'incoming', organizer: 'Mrs. Gupta', organizerRole: 'Parent', organizerEmail: 'gupta@email.com', organizerPhone: '9876543212', recipient: 'Mr. Patel (You)', recipientRole: 'Teacher', subject: 'Discuss Behavior Concerns', description: 'Need to discuss some behavior issues observed at home.', category: 'discipline', customCategory: '', priority: 'high', date: '2024-11-12', time: '11:00', duration: 45, location: 'Online (Video Call)', locationType: 'online', meetingLink: 'https://meet.school.com/abc123', status: 'rescheduled', createdAt: '2024-11-05', updatedAt: '2024-11-11', reminders: true, reminderTime: '30min', notes: '', attachments: [], rescheduleHistory: [{ date: '2024-11-10', time: '11:00', reason: 'Parent had emergency', by: 'Mrs. Gupta' }], responses: [], selectedBranches: [], selectedStaff: [] },
  { id: 4, type: 'incoming', organizer: 'Mr. Verma', organizerRole: 'Parent', organizerEmail: 'verma@email.com', organizerPhone: '9876543213', recipient: 'Mr. Patel (You)', recipientRole: 'Teacher', subject: 'Extra Curricular Activities', description: 'Want to discuss participation in sports events.', category: 'general', customCategory: '', priority: 'low', date: '2024-11-08', time: '15:00', duration: 30, location: 'Staff Room', locationType: 'in_person', meetingLink: '', status: 'completed', createdAt: '2024-11-01', updatedAt: '2024-11-08', reminders: false, reminderTime: '', notes: 'Student enrolled in cricket team', attachments: [], rescheduleHistory: [], responses: [{ date: '2024-11-02', action: 'accepted', message: 'Confirmed.', by: 'Mr. Patel' }], selectedBranches: [], selectedStaff: [] },
]
const initialOutgoingRequests = [
  { id: 5, type: 'outgoing', organizer: 'Mr. Patel (You)', organizerRole: 'Teacher', organizerEmail: 'patel@school.com', organizerPhone: '9876543211', recipient: 'Science Branch, HOD - Science', recipientRole: '', subject: 'Discipline Issue Discussion', description: 'Need to discuss recent discipline issues with student.', category: 'discipline', customCategory: '', priority: 'high', date: '2024-11-20', time: '09:00', duration: 45, location: 'Staff Room', locationType: 'in_person', meetingLink: '', status: 'pending', createdAt: '2024-11-10', updatedAt: '2024-11-10', reminders: true, reminderTime: '1hour', notes: 'Bring incident reports', attachments: ['incident_report.pdf'], rescheduleHistory: [], responses: [], selectedBranches: ['branch_science'], selectedStaff: ['staff_hod_science'] },
  { id: 6, type: 'outgoing', organizer: 'Mr. Patel (You)', organizerRole: 'Teacher', organizerEmail: 'patel@school.com', organizerPhone: '9876543211', recipient: 'School Counselor', recipientRole: '', subject: 'Academic Excellence Award', description: 'Discuss nomination for academic excellence award.', category: 'academic', customCategory: '', priority: 'medium', date: '2024-11-22', time: '11:00', duration: 30, location: 'Online (Video Call)', locationType: 'online', meetingLink: 'https://meet.school.com/xyz789', status: 'accepted', createdAt: '2024-11-08', updatedAt: '2024-11-09', reminders: true, reminderTime: '30min', notes: '', attachments: [], rescheduleHistory: [], responses: [{ date: '2024-11-09', action: 'accepted', message: 'Thank you for the nomination!', by: 'School Counselor' }], selectedBranches: [], selectedStaff: ['staff_counselor'] },
  { id: 7, type: 'outgoing', organizer: 'Mr. Patel (You)', organizerRole: 'Teacher', organizerEmail: 'patel@school.com', organizerPhone: '9876543211', recipient: 'School Counselor', recipientRole: '', subject: 'Student Counseling Referral', description: 'Refer student for counseling session.', category: 'counseling', customCategory: '', priority: 'high', date: '2024-11-14', time: '13:00', duration: 30, location: '', locationType: 'in_person', meetingLink: '', status: 'declined', createdAt: '2024-11-07', updatedAt: '2024-11-08', reminders: false, reminderTime: '', notes: '', attachments: [], rescheduleHistory: [], responses: [{ date: '2024-11-08', action: 'declined', message: 'Slot not available. Please reschedule.', by: 'School Counselor' }], selectedBranches: [], selectedStaff: ['staff_counselor'] },
]
const defaultNewMeeting = { selectedBranches: [] as string[], selectedStaff: [] as string[], subject: '', description: '', category: 'general', customCategory: '', priority: 'medium', date: '', time: '', duration: '30', location: '', meetingLink: '', reminders: true, reminderTime: '1hour', notes: '', attachments: [] as string[] }

export function MyMeetingRequests() {
  const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests)
  const [outgoingRequests, setOutgoingRequests] = useState(initialOutgoingRequests)
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'calendar' | 'history'>('calendar')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date(2024, 10, 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [responseAction, setResponseAction] = useState('accept')
  const [responseMessage, setResponseMessage] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [newMeeting, setNewMeeting] = useState(defaultNewMeeting)

  const setField = (field: string, value: any) => setNewMeeting(prev => ({ ...prev, [field]: value }))
  const resolveCategoryLabel = (cat: string, custom: string) => cat === 'other' ? custom || 'Other' : meetingCategories.find(c => c.value === cat)?.label || cat
  const resolveLocationLabel = (v: string) => locationOptions.find(o => o.value === v)?.label || v
  const buildRecipientString = (branches: string[], staff: string[]) => {
    const bl = branches.map(v => BRANCH_OPTIONS.find(o => o.value === v)?.label || v)
    const sl = staff.map(v => STAFF_OPTIONS.find(o => o.value === v)?.label || v)
    return [...bl, ...sl].join(', ') || '—'
  }
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) })
  }

  const allMeetings = useMemo(() => [...incomingRequests, ...outgoingRequests], [incomingRequests, outgoingRequests])
  const historyMeetings = useMemo(() => allMeetings.filter(m => m.status === 'completed' || m.status === 'cancelled'), [allMeetings])
  const stats = useMemo(() => ({
    pendingIncoming: incomingRequests.filter(m => m.status === 'pending').length,
    pendingOutgoing: outgoingRequests.filter(m => m.status === 'pending').length,
    todayMeetings: allMeetings.filter(m => m.date === new Date().toISOString().split('T')[0] && m.status === 'accepted').length,
    thisWeekMeetings: allMeetings.filter(m => m.status === 'accepted').length,
  }), [incomingRequests, outgoingRequests, allMeetings])

  const calYear = calendarDate.getFullYear()
  const calMonth = calendarDate.getMonth()
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const getMeetingsForDay = (day: number) => {
    const ds = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return allMeetings.filter(m => m.date === ds)
  }
  const isToday = (day: number) => { const now = new Date(); return now.getFullYear() === calYear && now.getMonth() === calMonth && now.getDate() === day }
  const selectedDayDateStr = selectedDay ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : null

  const applyFilters = (meetings: any[]) => meetings.filter(m => {
    if (searchQuery && !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !m.organizer.toLowerCase().includes(searchQuery.toLowerCase()) && !m.recipient.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter !== 'all' && m.status !== statusFilter) return false
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    return true
  })
  const panelMeetings = useMemo(() => {
    const base = selectedDay ? allMeetings.filter(m => m.date === selectedDayDateStr) : allMeetings.filter(m => m.status !== 'completed' && m.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date))
    return applyFilters(base)
  }, [selectedDay, selectedDayDateStr, allMeetings, searchQuery, statusFilter, categoryFilter, typeFilter])

  const handleCreateMeeting = () => {
    const isOnline = newMeeting.location?.includes('online')
    const meeting = {
      id: Date.now(), type: 'outgoing', organizer: 'Mr. Patel (You)', organizerRole: 'Teacher', organizerEmail: 'patel@school.com', organizerPhone: '9876543211',
      recipient: buildRecipientString(newMeeting.selectedBranches, newMeeting.selectedStaff), recipientRole: '',
      subject: newMeeting.subject, description: newMeeting.description, category: newMeeting.category, customCategory: newMeeting.customCategory, priority: newMeeting.priority,
      date: newMeeting.date, time: newMeeting.time, duration: parseInt(newMeeting.duration),
      location: newMeeting.location ? resolveLocationLabel(newMeeting.location) : '', locationType: isOnline ? 'online' : 'in_person', meetingLink: newMeeting.meetingLink,
      status: 'pending', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
      reminders: newMeeting.reminders, reminderTime: newMeeting.reminderTime, notes: newMeeting.notes, attachments: newMeeting.attachments,
      rescheduleHistory: [], responses: [], selectedBranches: newMeeting.selectedBranches, selectedStaff: newMeeting.selectedStaff,
    }
    setOutgoingRequests(prev => [meeting, ...prev]); setIsNewMeetingModalOpen(false); setNewMeeting(defaultNewMeeting)
  }
  const handleRespond = () => {
    if (!selectedMeeting) return
    const updated = { ...selectedMeeting, status: responseAction === 'accept' ? 'accepted' : 'declined', updatedAt: new Date().toISOString().split('T')[0], responses: [...selectedMeeting.responses, { date: new Date().toISOString().split('T')[0], action: responseAction === 'accept' ? 'accepted' : 'declined', message: responseMessage, by: 'Mr. Patel (You)' }] }
    setIncomingRequests(prev => prev.map(m => m.id === selectedMeeting.id ? updated : m)); setSelectedMeeting(updated); setIsRespondModalOpen(false); setResponseMessage('')
  }
  const handleReschedule = () => {
    if (!selectedMeeting) return
    const updated = { ...selectedMeeting, date: rescheduleDate, time: rescheduleTime, status: 'rescheduled', updatedAt: new Date().toISOString().split('T')[0], rescheduleHistory: [...selectedMeeting.rescheduleHistory, { date: selectedMeeting.date, time: selectedMeeting.time, reason: rescheduleReason, by: 'Mr. Patel (You)' }] }
    if (selectedMeeting.type === 'incoming') setIncomingRequests(prev => prev.map(m => m.id === selectedMeeting.id ? updated : m))
    else setOutgoingRequests(prev => prev.map(m => m.id === selectedMeeting.id ? updated : m))
    setSelectedMeeting(updated); setIsRescheduleModalOpen(false); setRescheduleDate(''); setRescheduleTime(''); setRescheduleReason('')
  }
  const handleCancel = () => {
    if (!selectedMeeting) return
    const updated = { ...selectedMeeting, status: 'cancelled', updatedAt: new Date().toISOString().split('T')[0], notes: selectedMeeting.notes + ` [Cancelled: ${cancelReason}]` }
    if (selectedMeeting.type === 'incoming') setIncomingRequests(prev => prev.map(m => m.id === selectedMeeting.id ? updated : m))
    else setOutgoingRequests(prev => prev.map(m => m.id === selectedMeeting.id ? updated : m))
    setSelectedMeeting(updated); setIsCancelModalOpen(false); setCancelReason('')
  }
  const handleMarkComplete = (meeting: any) => {
    const updated = { ...meeting, status: 'completed', updatedAt: new Date().toISOString().split('T')[0] }
    if (meeting.type === 'incoming') setIncomingRequests(prev => prev.map(m => m.id === meeting.id ? updated : m))
    else setOutgoingRequests(prev => prev.map(m => m.id === meeting.id ? updated : m))
    setSelectedMeeting(updated)
  }
  const isCreateDisabled = (newMeeting.selectedBranches.length === 0 && newMeeting.selectedStaff.length === 0) || !newMeeting.subject || !newMeeting.date || !newMeeting.time
  const isOnlineLocation = newMeeting.location?.includes('online')

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Requests</h1>
          <p className="text-sm text-gray-500">Manage appointments with parents, students, and staff</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(f => !f)}><Filter className="w-4 h-4 mr-1" /> Filters</Button>
          <Button variant="primary" onClick={() => setIsNewMeetingModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Request Meeting</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Pending Incoming', value: stats.pendingIncoming, icon: Clock, color: 'text-amber-500' }, { label: 'Pending Outgoing', value: stats.pendingOutgoing, icon: Send, color: 'text-blue-500' }, { label: "Today's Meetings", value: stats.todayMeetings, icon: Calendar, color: 'text-emerald-500' }, { label: 'This Week', value: stats.thisWeekMeetings, icon: Users, color: 'text-purple-500' }].map((stat, i) => (
          <Card key={i}><div className="p-3 flex items-center gap-3"><stat.icon className={`w-8 h-8 ${stat.color}`} /><div><p className="text-xl font-bold">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div></div></Card>
        ))}
      </div>
      {showFilters && (
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search meetings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Types</option><option value="incoming">Incoming</option><option value="outgoing">Outgoing</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium mb-1">Status</label><Select options={statusFilters} value={statusFilter} onChange={setStatusFilter} /></div>
            <div><label className="block text-xs font-medium mb-1">Category</label><Select options={[{ value: 'all', label: 'All Categories' }, ...meetingCategories]} value={categoryFilter} onChange={setCategoryFilter} /></div>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); setTypeFilter('all') }}>Clear All</Button>
          </div>
        </Card>
      )}
      <div className="flex gap-1 border-b border-gray-200">
        {[{ id: 'calendar', label: `Calendar & Meetings (${allMeetings.length})` }, { id: 'history', label: `History (${historyMeetings.length})` }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>
        ))}
      </div>
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                <h2 className="text-base font-bold text-gray-900">{MONTHS[calMonth]} {calYear}</h2>
                <button onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
              </div>
              <div className="grid grid-cols-7 mb-1">{DAYS_OF_WEEK.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1.5">{d}</div>)}</div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dayMeetings = getMeetingsForDay(day)
                  const isSelected = selectedDay === day
                  const today = isToday(day)
                  return (
                    <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)} className={`aspect-square rounded-lg flex flex-col items-center justify-start pt-1 px-0.5 transition-all border ${isSelected ? 'bg-blue-600 border-blue-600 shadow-md' : today ? 'bg-blue-50 border-blue-300' : dayMeetings.length > 0 ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                      <span className={`font-semibold text-xs ${isSelected ? 'text-white' : today ? 'text-blue-700' : 'text-gray-700'}`}>{day}</span>
                      {dayMeetings.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                          {dayMeetings.slice(0, 2).map((m, mi) => <span key={mi} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/80' : statusDotColor[m.status] || 'bg-gray-400'}`} />)}
                          {dayMeetings.length > 2 && <span className={`text-xs leading-none ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>+</span>}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {[{ label: 'Pending', color: 'bg-amber-400' }, { label: 'Accepted', color: 'bg-emerald-500' }, { label: 'Declined', color: 'bg-red-500' }, { label: 'Rescheduled', color: 'bg-blue-400' }, { label: 'Done', color: 'bg-gray-400' }].map(l => (
                    <div key={l.label} className="flex items-center gap-1 text-xs text-gray-500"><span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}</div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><ArrowDownLeft className="w-3 h-3 text-amber-500" /> Incoming</span>
                  <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-blue-500" /> Outgoing</span>
                </div>
              </div>
            </Card>
          </div>
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedDay ? (
                  <><h3 className="font-bold text-gray-900">{MONTHS[calMonth].slice(0, 3)} {selectedDay}, {calYear}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{panelMeetings.length} meeting{panelMeetings.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setSelectedDay(null)} className="text-xs text-blue-500 hover:underline">Show all</button></>
                ) : (
                  <><h3 className="font-bold text-gray-900">All Upcoming Meetings</h3><span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{panelMeetings.length}</span></>
                )}
              </div>
              <div className="flex gap-1">
                {[{ v: 'all', label: 'All' }, { v: 'incoming', label: '⬇ In' }, { v: 'outgoing', label: '⬆ Out' }].map(t => (
                  <button key={t.v} onClick={() => setTypeFilter(t.v as any)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${typeFilter === t.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{t.label}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {panelMeetings.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
                  <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">{selectedDay ? 'No meetings on this day' : 'No meetings found'}</p>
                  {selectedDay && <button onClick={() => { setNewMeeting(prev => ({ ...prev, date: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` })); setIsNewMeetingModalOpen(true) }} className="mt-3 text-sm text-blue-600 hover:underline">+ Schedule a meeting for this day</button>}
                </div>
              ) : panelMeetings.map(meeting => (
                <div key={meeting.id} onClick={() => { setSelectedMeeting(meeting); setIsDetailPanelOpen(true) }} className={`group relative flex gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${meeting.status === 'pending' && meeting.type === 'incoming' ? 'border-amber-200 bg-amber-50/60 hover:bg-amber-50' : meeting.status === 'pending' && meeting.type === 'outgoing' ? 'border-blue-200 bg-blue-50/60 hover:bg-blue-50' : meeting.status === 'declined' ? 'border-red-200 bg-red-50/50 hover:bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <div className={`w-1 rounded-full flex-shrink-0 ${categoryColor[meeting.category] || 'bg-gray-400'}`} />
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${meeting.type === 'incoming' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                    {meeting.type === 'incoming' ? <ArrowDownLeft className="w-4 h-4 text-amber-600" /> : <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{meeting.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{meeting.type === 'incoming' ? <><span className="font-medium text-gray-700">{meeting.organizer}</span> · {meeting.organizerRole}</> : <>To: <span className="font-medium text-gray-700">{meeting.recipient}</span></>}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">{getPriorityBadge(meeting.priority)}{getStatusBadge(meeting.status)}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{meeting.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meeting.time} · {meeting.duration}min</span>
                      {meeting.location && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{meeting.location}</span>}
                      {meeting.meetingLink && <span className="flex items-center gap-1 text-blue-500"><Link className="w-3 h-3" /> Link available</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryBg[meeting.category] || categoryBg.other}`}>{resolveCategoryLabel(meeting.category, meeting.customCategory)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {applyFilters(historyMeetings).length > 0 ? applyFilters(historyMeetings).map(meeting => (
            <div key={meeting.id} onClick={() => { setSelectedMeeting(meeting); setIsDetailPanelOpen(true) }} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><History className="w-5 h-5 text-gray-400" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{meeting.subject}</p>
                <p className="text-sm text-gray-500 mt-0.5">{meeting.type === 'incoming' ? `From: ${meeting.organizer}` : `To: ${meeting.recipient}`}{' · '}{meeting.date} at {meeting.time}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${categoryBg[meeting.category] || categoryBg.other}`}>{resolveCategoryLabel(meeting.category, meeting.customCategory)}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">{getStatusBadge(meeting.status)}<ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </div>
          )) : (
            <div className="text-center py-16 text-gray-400"><History className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No meeting history found</p></div>
          )}
        </div>
      )}
      {isDetailPanelOpen && selectedMeeting && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setIsDetailPanelOpen(false)} />
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${selectedMeeting.type === 'incoming' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                  {selectedMeeting.type === 'incoming' ? <ArrowDownLeft className="w-4 h-4 text-amber-600" /> : <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{selectedMeeting.type === 'incoming' ? 'Incoming Meeting' : 'Outgoing Meeting'}</p>
                  <h2 className="text-base font-bold text-gray-900 truncate">{selectedMeeting.subject}</h2>
                </div>
              </div>
              <button onClick={() => setIsDetailPanelOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-5">
                <div className="flex items-center gap-2 flex-wrap">{getStatusBadge(selectedMeeting.status)}{getPriorityBadge(selectedMeeting.priority)}<span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${categoryBg[selectedMeeting.category] || categoryBg.other}`}>{resolveCategoryLabel(selectedMeeting.category, selectedMeeting.customCategory)}</span></div>
                <div className={`rounded-xl p-4 border ${selectedMeeting.type === 'incoming' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${selectedMeeting.type === 'incoming' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}>{selectedMeeting.type === 'incoming' ? selectedMeeting.organizer.charAt(0) : selectedMeeting.recipient.charAt(0)}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{selectedMeeting.type === 'incoming' ? selectedMeeting.organizer : selectedMeeting.recipient}</p>
                      <p className="text-xs text-gray-500">{selectedMeeting.type === 'incoming' ? `${selectedMeeting.organizerRole} → You` : 'You → Recipient'}</p>
                      {selectedMeeting.type === 'incoming' && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{selectedMeeting.organizerEmail}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedMeeting.organizerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-xs text-gray-400 mb-1">Date & Time</p><p className="font-semibold text-sm text-gray-800">{selectedMeeting.date}</p><p className="text-sm text-gray-600">{selectedMeeting.time} · {selectedMeeting.duration} min</p></div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-xs text-gray-400 mb-1">Location</p><p className="font-semibold text-sm text-gray-800">{selectedMeeting.location || '—'}</p></div>
                </div>
                {selectedMeeting.meetingLink && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Meeting Link</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 min-w-0"><p className="text-sm text-blue-700 truncate font-mono">{selectedMeeting.meetingLink}</p></div>
                      <button onClick={() => copyToClipboard(selectedMeeting.meetingLink)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors flex-shrink-0"><Copy className="w-3.5 h-3.5" />{copiedLink ? 'Copied!' : 'Copy'}</button>
                      <a href={selectedMeeting.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex-shrink-0"><ExternalLink className="w-3.5 h-3.5" /> Join</a>
                    </div>
                  </div>
                )}
                {selectedMeeting.description && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</p><p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">{selectedMeeting.description}</p></div>}
                {(selectedMeeting.selectedBranches?.length > 0 || selectedMeeting.selectedStaff?.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Meeting With</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeeting.selectedBranches?.map((v: string) => <span key={v} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{BRANCH_OPTIONS.find(o => o.value === v)?.label || v}</span>)}
                      {selectedMeeting.selectedStaff?.map((v: string) => <span key={v} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{STAFF_OPTIONS.find(o => o.value === v)?.label || v}</span>)}
                    </div>
                  </div>
                )}
                {selectedMeeting.notes && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes</p><p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-xl p-3">{selectedMeeting.notes}</p></div>}
                {selectedMeeting.attachments?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attachments</p>
                    <div className="flex flex-wrap gap-2">{selectedMeeting.attachments.map((a: string, i: number) => <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors"><Paperclip className="w-3.5 h-3.5 text-gray-400" /> {a}</button>)}</div>
                  </div>
                )}
                {selectedMeeting.rescheduleHistory?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Reschedule History</p>
                    <div className="space-y-2">{selectedMeeting.rescheduleHistory.map((h: any, i: number) => <div key={i} className="text-sm bg-blue-50 border border-blue-100 rounded-xl p-3"><p className="font-medium text-blue-800">Originally: {h.date} at {h.time}</p><p className="text-blue-600 text-xs mt-0.5">Reason: {h.reason} — by {h.by}</p></div>)}</div>
                  </div>
                )}
                {selectedMeeting.responses?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Response History</p>
                    <div className="space-y-2">{selectedMeeting.responses.map((r: any, i: number) => <div key={i} className={`text-sm rounded-xl p-3 border ${r.action === 'accepted' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}><div className="flex items-center gap-2 mb-1"><Badge variant={r.action === 'accepted' ? 'success' : 'danger'}>{r.action}</Badge><span className="text-xs text-gray-500">by {r.by} on {r.date}</span></div>{r.message && <p className="text-gray-700">{r.message}</p>}</div>)}</div>
                  </div>
                )}
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 space-y-1">
                  <p>Created: {selectedMeeting.createdAt} · Updated: {selectedMeeting.updatedAt}</p>
                  <p>Reminders: {selectedMeeting.reminders ? `Enabled — ${selectedMeeting.reminderTime} before` : 'Disabled'}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0">
              <div className="flex flex-wrap gap-2">
                {selectedMeeting.type === 'incoming' && selectedMeeting.status === 'pending' && (
                  <><Button variant="primary" size="sm" onClick={() => { setResponseAction('accept'); setIsRespondModalOpen(true) }}><Check className="w-3.5 h-3.5 mr-1" /> Accept</Button>
                  <Button variant="outline" size="sm" onClick={() => { setResponseAction('decline'); setIsRespondModalOpen(true) }}><X className="w-3.5 h-3.5 mr-1" /> Decline</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(true)}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Reschedule</Button></>
                )}
                {selectedMeeting.type === 'incoming' && selectedMeeting.status === 'accepted' && (
                  <><Button variant="outline" size="sm" onClick={() => handleMarkComplete(selectedMeeting)}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Complete</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(true)}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                  {selectedMeeting.meetingLink && <a href={selectedMeeting.meetingLink} target="_blank" rel="noreferrer"><Button variant="primary" size="sm"><Video className="w-3.5 h-3.5 mr-1" /> Join Meeting</Button></a>}</>
                )}
                {selectedMeeting.type === 'outgoing' && selectedMeeting.status === 'pending' && (
                  <><Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(true)}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(true)}><Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel</Button></>
                )}
                {selectedMeeting.type === 'outgoing' && selectedMeeting.status === 'declined' && <Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(true)}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Reschedule</Button>}
                {selectedMeeting.type === 'outgoing' && selectedMeeting.status === 'accepted' && (
                  <><Button variant="outline" size="sm" onClick={() => handleMarkComplete(selectedMeeting)}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Complete</Button>
                  {selectedMeeting.meetingLink && <a href={selectedMeeting.meetingLink} target="_blank" rel="noreferrer"><Button variant="primary" size="sm"><Video className="w-3.5 h-3.5 mr-1" /> Join Meeting</Button></a>}</>
                )}
                <button onClick={() => setIsDetailPanelOpen(false)} className="ml-auto text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isNewMeetingModalOpen} onClose={() => setIsNewMeetingModalOpen(false)} title="Request New Meeting">
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiSelectDropdown label="Select Branch(es)" options={BRANCH_OPTIONS} selected={newMeeting.selectedBranches} onChange={v => setField('selectedBranches', v)} placeholder="Choose branch(es)…" />
            <MultiSelectDropdown label="Select Staff" options={STAFF_OPTIONS} selected={newMeeting.selectedStaff} onChange={v => setField('selectedStaff', v)} placeholder="Choose staff member(s)…" />
          </div>
          {(newMeeting.selectedBranches.length > 0 || newMeeting.selectedStaff.length > 0) && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm">
              <p className="font-medium text-blue-700 mb-1.5">Meeting with:</p>
              <div className="flex flex-wrap gap-1">
                {newMeeting.selectedBranches.map(v => <span key={v} className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs">{BRANCH_OPTIONS.find(o => o.value === v)?.label}</span>)}
                {newMeeting.selectedStaff.map(v => <span key={v} className="px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full text-xs">{STAFF_OPTIONS.find(o => o.value === v)?.label}</span>)}
              </div>
            </div>
          )}
          <Input label="Subject *" placeholder="Purpose of meeting" value={newMeeting.subject} onChange={e => setField('subject', e.target.value)} />
          <Textarea label="Description" placeholder="Detailed description..." rows={3} value={newMeeting.description} onChange={e => setField('description', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select label="Category" options={meetingCategories} value={newMeeting.category} onChange={v => setField('category', v)} />
              {newMeeting.category === 'other' && <Input className="mt-2" placeholder="Custom category" value={newMeeting.customCategory} onChange={e => setField('customCategory', e.target.value)} />}
            </div>
            <Select label="Priority" options={priorityOptions} value={newMeeting.priority} onChange={v => setField('priority', v)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date *" type="date" value={newMeeting.date} onChange={e => setField('date', e.target.value)} />
            <Input label="Time *" type="time" value={newMeeting.time} onChange={e => setField('time', e.target.value)} />
            <Select label="Duration" options={durationOptions} value={newMeeting.duration} onChange={v => setField('duration', v)} />
          </div>
          <Select label="Location (Optional)" options={[{ value: '', label: '— No location selected —' }, ...locationOptions]} value={newMeeting.location} onChange={v => setField('location', v)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (Optional)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="url" placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx" value={newMeeting.meetingLink} onChange={e => setField('meetingLink', e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {newMeeting.meetingLink && <button onClick={() => copyToClipboard(newMeeting.meetingLink)} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"><Copy className="w-3.5 h-3.5" />{copiedLink ? 'Copied!' : 'Copy'}</button>}
            </div>
            {isOnlineLocation && !newMeeting.meetingLink && <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Online location selected — please add a meeting link</p>}
            {newMeeting.meetingLink && (
              <div className="mt-2 flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 truncate flex-1">{newMeeting.meetingLink}</p>
                <a href={newMeeting.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 flex-shrink-0">Test <ExternalLink className="w-3 h-3" /></a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newMeeting.reminders} onChange={e => setField('reminders', e.target.checked)} className="rounded" /><span className="text-sm">Enable Reminders</span></label>
            {newMeeting.reminders && <Select options={reminderOptions} value={newMeeting.reminderTime} onChange={v => setField('reminderTime', v)} />}
          </div>
          <Textarea label="Notes (Optional)" rows={2} value={newMeeting.notes} onChange={e => setField('notes', e.target.value)} />
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsNewMeetingModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateMeeting} disabled={isCreateDisabled}><Send className="w-4 h-4 mr-2" /> Send Request</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isRespondModalOpen} onClose={() => setIsRespondModalOpen(false)} title={responseAction === 'accept' ? 'Accept Meeting Request' : 'Decline Meeting Request'}>
        <div className="space-y-4">
          {selectedMeeting && <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="font-semibold">{selectedMeeting.subject}</p><p className="text-sm text-gray-500 mt-0.5">{selectedMeeting.organizer} · {selectedMeeting.date} at {selectedMeeting.time}</p></div>}
          <Textarea label="Message (Optional)" placeholder={responseAction === 'accept' ? 'Add a message for the organizer...' : 'Reason for declining...'} rows={3} value={responseMessage} onChange={e => setResponseMessage(e.target.value)} />
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setIsRespondModalOpen(false)}>Cancel</Button><Button variant={responseAction === 'accept' ? 'primary' : 'outline'} onClick={handleRespond}>{responseAction === 'accept' ? 'Accept' : 'Decline'}</Button></div>
        </div>
      </Modal>
      <Modal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} title="Reschedule Meeting">
        <div className="space-y-4">
          {selectedMeeting && <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="font-semibold">{selectedMeeting.subject}</p><p className="text-sm text-gray-500 mt-0.5">Currently: {selectedMeeting.date} at {selectedMeeting.time}</p></div>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="New Date" type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
            <Input label="New Time" type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
          </div>
          <Textarea label="Reason" placeholder="Explain why you need to reschedule..." rows={3} value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)} />
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime}>Reschedule</Button></div>
        </div>
      </Modal>
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Meeting">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"><AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" /><p className="text-sm text-red-700">This cannot be undone. The other party will be notified.</p></div>
          <Textarea label="Reason for Cancellation" placeholder="Explain why you're cancelling..." rows={3} value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>Keep Meeting</Button><Button variant="danger" onClick={handleCancel}>Cancel Meeting</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default MyMeetingRequests
