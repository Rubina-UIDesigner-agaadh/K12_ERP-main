import React, { useMemo, useState } from 'react'
import {
  Search,
  Inbox,
  Archive,
  Trash2,
  Star,
  Bell,
  Mail,
  MailOpen,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Download,
  MessageSquare,
  Calendar,
  X,
  Filter,
  Plus,
  FileText,
  Send,
  Save,
  ChevronDown,
  Smartphone,
  AtSign,
  Phone,
  Users,
  Clock,
  CheckSquare,
  Building,
  GraduationCap,
  UserCheck,
  Trash,
  Edit3,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

type MessageSource = 'push_notification' | 'event_invitation'
type MessageFolder = 'inbox' | 'starred' | 'archived' | 'trash'
type MessagePriority = 'high' | 'normal' | 'low'
type CommMode = 'inapp' | 'whatsapp' | 'email' | 'sms'
type MainView = 'inbox' | 'compose' | 'drafts'

interface InboxAttachment {
  id: string
  name: string
  size: number
  type: string
}

interface InboxMessage {
  id: string
  source: MessageSource
  pushTitle?: string
  pushBody?: string
  pushDeepLink?: string
  pushReach?: number
  pushOpened?: number
  eventId?: string
  eventName?: string
  inviteTitle?: string
  inviteMessage?: string
  inviteChannel?: string
  inviteRecipientCount?: number
  sender: string
  senderRole: string
  senderAvatar: string
  subject: string
  preview: string
  body: string
  date: string
  time: string
  timestamp: string
  priority: MessagePriority
  read: boolean
  starred: boolean
  archived: boolean
  deleted: boolean
  folder: MessageFolder
  labels: string[]
  attachments: InboxAttachment[]
}

interface RecipientGroup {
  branches: string[]
  batches: string[]
  students: string[]
  staff: string[]
}

interface ComposeAttachment {
  id: string
  name: string
  size: number
  file?: File
}

interface DraftMessage {
  id: string
  mode: CommMode
  templateId: string
  subject: string
  body: string
  recipients: RecipientGroup
  attachments: ComposeAttachment[]
  scheduledDate: string
  scheduledTime: string
  priority: MessagePriority
  needsAck: boolean
  savedAt: string
  status: 'draft'
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Messages' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'starred', label: 'Starred' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'By Priority' },
  { value: 'sender', label: 'By Sender' },
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
]

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'push_notification', label: 'Push Notifications' },
  { value: 'event_invitation', label: 'Event Invitations' },
]

const FOLDER_OPTIONS = [
  { value: 'inbox', label: 'Inbox', icon: Inbox },
  { value: 'starred', label: 'Starred', icon: Star },
  { value: 'archived', label: 'Archived', icon: Archive },
  { value: 'trash', label: 'Trash', icon: Trash2 },
]

const COMM_MODES: {
  value: CommMode
  label: string
  icon: React.ElementType
  color: string
  bg: string
}[] = [
  { value: 'inapp', label: 'In-App', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50 border-green-300' },
  { value: 'email', label: 'Email', icon: AtSign, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300' },
  { value: 'sms', label: 'SMS', icon: Phone, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300' },
]

const MESSAGE_TEMPLATES: {
  id: string
  label: string
  subject: string
  body: string
  modes: CommMode[]
}[] = [
  { id: 'none', label: '— No Template —', subject: '', body: '', modes: ['inapp', 'whatsapp', 'email', 'sms'] },
  { id: 'fee_reminder', label: 'Fee Payment Reminder', subject: 'Fee Payment Reminder', body: 'Dear Parent,\n\nThis is a reminder that the fee payment deadline is approaching. Please make the payment before the due date to avoid late fees.\n\nRegards,\nAccounts Department', modes: ['inapp', 'whatsapp', 'email', 'sms'] },
  { id: 'exam_schedule', label: 'Exam Schedule Notification', subject: 'Exam Schedule Released', body: 'Dear Student/Parent,\n\nThe examination schedule has been released. Please check the school app or website for detailed timetable.\n\nBest Regards,\nExamination Cell', modes: ['inapp', 'email'] },
  { id: 'holiday', label: 'Holiday Announcement', subject: 'Holiday Announcement', body: 'Dear All,\n\nPlease be informed that the school will remain closed on [DATE] due to [REASON]. Classes will resume on [NEXT_DATE].\n\nRegards,\nSchool Administration', modes: ['inapp', 'whatsapp', 'sms'] },
  { id: 'event_invite', label: 'Event Invitation', subject: 'Invitation to [EVENT NAME]', body: 'Dear Parent/Guardian,\n\nWe cordially invite you to [EVENT NAME] on [DATE] at [TIME].\n\nVenue: [VENUE]\n\nWe look forward to your presence.\n\nWarm Regards,\nSchool Administration', modes: ['inapp', 'whatsapp', 'email'] },
  { id: 'ptm', label: 'Parent-Teacher Meeting', subject: 'PTM Scheduled – [DATE]', body: "Dear Parent,\n\nThis is to inform you that a Parent-Teacher Meeting (PTM) is scheduled on [DATE] from [TIME].\n\nPlease make it convenient to attend and discuss your ward's academic progress.\n\nRegards,\nSchool Administration", modes: ['inapp', 'whatsapp', 'email', 'sms'] },
]

const BRANCH_OPTIONS = ['Main Campus', 'City Campus', 'North Campus', 'South Campus']
const BATCH_OPTIONS = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const STUDENT_OPTIONS = ['All Students', 'Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Gupta', 'Rohit Kumar']
const STAFF_OPTIONS = ['All Staff', 'Teaching Staff', 'Non-Teaching Staff', 'Admin Staff', 'Support Staff']

const INITIAL_MESSAGES: InboxMessage[] = [
  {
    id: 'PUSH-INBOX-001', source: 'push_notification', pushTitle: 'Exam Schedule Released',
    pushBody: 'Mid-term examination schedule for June 2025 has been released. Check the app for details.',
    pushDeepLink: 'app://exams/schedule', pushReach: 1248, pushOpened: 876,
    sender: 'Admin', senderRole: 'Push Notification', senderAvatar: 'PN',
    subject: 'Exam Schedule Released', preview: 'Mid-term examination schedule for June 2025 has been released...',
    body: 'Mid-term examination schedule for June 2025 has been released. Check the app for details.\n\nDeep Link: app://exams/schedule\n\nThis notification was sent to 1,248 recipients.',
    date: '2025-06-10', time: '08:00 AM', timestamp: '2025-06-10T08:00:00',
    priority: 'high', read: false, starred: false, archived: false, deleted: false, folder: 'inbox',
    labels: ['Push', 'Exam'], attachments: [],
  },
  {
    id: 'PUSH-INBOX-002', source: 'push_notification', pushTitle: 'Holiday Announcement',
    pushBody: 'School closed tomorrow due to local elections. Classes resume on Monday.',
    pushReach: 1248, pushOpened: 1102,
    sender: 'Admin', senderRole: 'Push Notification', senderAvatar: 'PN',
    subject: 'Holiday Announcement', preview: 'School closed tomorrow due to local elections...',
    body: 'School closed tomorrow due to local elections. Classes resume on Monday.\n\nThis notification was sent to 1,248 recipients.',
    date: '2025-06-09', time: '04:00 PM', timestamp: '2025-06-09T16:00:00',
    priority: 'high', read: true, starred: true, archived: false, deleted: false, folder: 'inbox',
    labels: ['Push', 'Holiday'], attachments: [],
  },
  {
    id: 'PUSH-INBOX-003', source: 'push_notification', pushTitle: 'Fee Payment Reminder',
    pushBody: 'Last date for fee payment is 15th June. Pay now to avoid late fees.',
    pushReach: 980, pushOpened: 754,
    sender: 'Accounts Dept', senderRole: 'Push Notification', senderAvatar: 'PN',
    subject: 'Fee Payment Reminder', preview: 'Last date for fee payment is 15th June...',
    body: 'Last date for fee payment is 15th June. Pay now to avoid late fees.\n\nThis notification was sent to 980 recipients.',
    date: '2025-06-08', time: '10:00 AM', timestamp: '2025-06-08T10:00:00',
    priority: 'high', read: false, starred: false, archived: false, deleted: false, folder: 'inbox',
    labels: ['Push', 'Fee'], attachments: [],
  },
  {
    id: 'EVT-INBOX-001', source: 'event_invitation', eventId: 'EVT-001', eventName: 'Annual Sports Day 2025',
    inviteTitle: 'Invitation to Annual Sports Day 2025',
    inviteMessage: 'Dear Parent, You are cordially invited to our Annual Sports Day...',
    inviteChannel: 'all', inviteRecipientCount: 1250,
    sender: 'Admin', senderRole: 'Event Invitation', senderAvatar: 'EI',
    subject: 'Invitation to Annual Sports Day 2025',
    preview: 'You are cordially invited to our Annual Sports Day on August 15, 2025...',
    body: 'Dear Parent/Guardian,\n\nGet ready for an exciting day of sports and fun!\n\nWe invite you to our Annual Sports Day on 2025-08-15 starting at 09:00.\n\nVenue: School Ground\n\nCome cheer for your children as they showcase their athletic talents!\n\nBest Regards,\nSports Department',
    date: '2025-06-01', time: '10:00 AM', timestamp: '2025-06-01T10:00:00',
    priority: 'normal', read: false, starred: false, archived: false, deleted: false, folder: 'inbox',
    labels: ['Event', 'Invitation', 'Sports'], attachments: [],
  },
  {
    id: 'EVT-INBOX-002', source: 'event_invitation', eventId: 'EVT-002', eventName: 'Parent-Teacher Meeting (Term 1)',
    inviteTitle: 'PTM Invitation - Term 1',
    inviteMessage: 'Dear Parent, Please join us for the Parent-Teacher Meeting...',
    inviteChannel: 'email', inviteRecipientCount: 850,
    sender: 'Admin', senderRole: 'Event Invitation', senderAvatar: 'EI',
    subject: 'PTM Invitation - Term 1',
    preview: 'You are cordially invited to the Parent-Teacher Meeting on July 10, 2025...',
    body: 'Dear Parent/Guardian,\n\nWe cordially invite you to the Parent-Teacher Meeting scheduled for 2025-07-10 at 10:00.\n\nVenue: Respective Classrooms\n\nPlease make it convenient to attend.\n\nWith Regards,\nSchool Administration',
    date: '2025-06-05', time: '02:00 PM', timestamp: '2025-06-05T14:00:00',
    priority: 'high', read: true, starred: true, archived: false, deleted: false, folder: 'inbox',
    labels: ['Event', 'Invitation', 'PTM'], attachments: [],
  },
]

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const SourceBadge: React.FC<{ source: MessageSource }> = ({ source }) =>
  source === 'push_notification' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
      <Bell className="w-3 h-3" /> Push
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
      <Calendar className="w-3 h-3" /> Event Invite
    </span>
  )

const PriorityBadge: React.FC<{ priority: MessagePriority }> = ({ priority }) => {
  const config: Record<MessagePriority, { cls: string; label: string }> = {
    high: { cls: 'bg-red-100 text-red-700', label: 'High' },
    normal: { cls: 'bg-gray-100 text-gray-600', label: 'Normal' },
    low: { cls: 'bg-green-100 text-green-700', label: 'Low' },
  }
  const { cls, label } = config[priority]
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

interface MultiSelectProps {
  label: string
  icon: React.ElementType
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
  color?: string
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  label, icon: Icon, options, selected, onChange, color = 'text-gray-600',
}) => {
  const [open, setOpen] = useState(false)
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
          <span className="text-gray-700 truncate">
            {selected.length === 0 ? `Select ${label}` : `${selected.length} ${label} selected`}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
              {s}
              <button type="button" onClick={() => toggle(s)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="rounded" />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

interface ConfirmDialogProps {
  show: boolean
  title: string
  message: string
  confirmLabel: string
  confirmClass?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show, title, message, confirmLabel,
  confirmClass = 'bg-red-600 hover:bg-red-700 text-white',
  onConfirm, onCancel,
}) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center">{title}</h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed">{message}</p>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={onConfirm} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

interface ActiveFilterPillsProps {
  filters: { search: string; status: string; priority: string; source: string; sort: string; dateFrom: string; dateTo: string }
  onClear: (key: string) => void
  onClearAll: () => void
}

const ActiveFilterPills: React.FC<ActiveFilterPillsProps> = ({ filters, onClear, onClearAll }) => {
  const pills: { key: string; label: string }[] = []
  if (filters.search) pills.push({ key: 'search', label: `Search: "${filters.search}"` })
  if (filters.status !== 'all') pills.push({ key: 'status', label: `Status: ${filters.status}` })
  if (filters.priority !== 'all') pills.push({ key: 'priority', label: `Priority: ${filters.priority}` })
  if (filters.source !== 'all') pills.push({ key: 'source', label: filters.source === 'push_notification' ? 'Source: Push' : 'Source: Event Invite' })
  if (filters.dateFrom) pills.push({ key: 'dateFrom', label: `From: ${filters.dateFrom}` })
  if (filters.dateTo) pills.push({ key: 'dateTo', label: `To: ${filters.dateTo}` })
  if (pills.length === 0) return null
  return (
    <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-indigo-50 border-b flex-wrap">
      <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 flex-shrink-0"><Filter className="w-3 h-3" /> Active:</span>
      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {pills.map((pill) => (
          <span key={pill.key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {pill.label}
            <button type="button" onClick={() => onClear(pill.key)} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <button type="button" onClick={onClearAll} className="text-xs text-indigo-500 hover:text-indigo-800 font-medium flex-shrink-0 underline">Clear all</button>
    </div>
  )
}

const PushNotificationDetail: React.FC<{ message: InboxMessage }> = ({ message }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
      <div className="text-center">
        <p className="text-xl font-bold text-orange-600">{message.pushReach?.toLocaleString() ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">Devices Reached</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-green-600">{message.pushOpened?.toLocaleString() ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Opened ({message.pushReach && message.pushOpened ? `${((message.pushOpened / message.pushReach) * 100).toFixed(0)}%` : '0%'})
        </p>
      </div>
    </div>
    {message.pushDeepLink && (
      <div className="p-3 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500 font-medium mb-1">Deep Link</p>
        <p className="text-sm text-blue-600 font-mono break-all">{message.pushDeepLink}</p>
      </div>
    )}
    <div className="p-4 bg-gray-50 rounded-lg border text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.body}</div>
  </div>
)

const EventInvitationDetail: React.FC<{ message: InboxMessage }> = ({ message }) => (
  <div className="space-y-4">
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <p className="font-semibold text-blue-800">{message.eventName}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div><p className="text-xs text-blue-500 mb-0.5">Event ID</p><p className="font-medium text-blue-700">{message.eventId ?? '—'}</p></div>
        <div><p className="text-xs text-blue-500 mb-0.5">Channel</p><p className="font-medium text-blue-700 capitalize">{message.inviteChannel ?? '—'}</p></div>
        <div><p className="text-xs text-blue-500 mb-0.5">Recipients</p><p className="font-medium text-blue-700">{message.inviteRecipientCount?.toLocaleString() ?? '—'}</p></div>
      </div>
    </div>
    <div className="p-4 bg-gray-50 rounded-lg border text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.body}</div>
    {message.attachments.length > 0 && (
      <div className="pt-3 border-t">
        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Paperclip className="w-4 h-4" /> Attachments ({message.attachments.length})</p>
        <div className="flex flex-wrap gap-2">
          {message.attachments.map((att) => (
            <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm hover:bg-gray-100 cursor-pointer border transition-colors">
              <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate max-w-[140px]">{att.name}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{formatFileSize(att.size)}</span>
              <Download className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

interface ComposeFormProps {
  initial?: Partial<DraftMessage>
  onSaveDraft: (draft: DraftMessage) => void
  onSend: (draft: DraftMessage) => void
  onDiscard: () => void
  userSavedTemplates: typeof MESSAGE_TEMPLATES
  onSaveTemplate: (subject: string, body: string, mode: CommMode) => void
}

const ComposeForm: React.FC<ComposeFormProps> = ({
  initial, onSaveDraft, onSend, onDiscard, userSavedTemplates, onSaveTemplate,
}) => {
  const [mode, setMode] = useState<CommMode>(initial?.mode ?? 'inapp')
  const [templateId, setTemplateId] = useState(initial?.templateId ?? 'none')
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [recipients, setRecipients] = useState<RecipientGroup>(initial?.recipients ?? { branches: [], batches: [], students: [], staff: [] })
  const [attachments, setAttachments] = useState<ComposeAttachment[]>(initial?.attachments ?? [])
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate ?? '')
  const [scheduledTime, setScheduledTime] = useState(initial?.scheduledTime ?? '')
  const [priority, setPriority] = useState<MessagePriority>(initial?.priority ?? 'normal')
  const [needsAck, setNeedsAck] = useState(initial?.needsAck ?? false)
  const [saveTemplatePopup, setSaveTemplatePopup] = useState(false)
  const [templateName, setTemplateName] = useState('')

  const allTemplates = [...MESSAGE_TEMPLATES, ...userSavedTemplates.filter((t) => !MESSAGE_TEMPLATES.find((m) => m.id === t.id))]
  const availableTemplates = allTemplates.filter((t) => t.modes.includes(mode))

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    const tpl = allTemplates.find((t) => t.id === id)
    if (tpl && tpl.id !== 'none') { setSubject(tpl.subject); setBody(tpl.body) }
  }

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newAtts: ComposeAttachment[] = files.map((f) => ({ id: generateId(), name: f.name, size: f.size, file: f }))
    setAttachments((prev) => [...prev, ...newAtts])
    e.target.value = ''
  }

  const buildDraft = (): DraftMessage => ({
    id: initial?.id ?? generateId(),
    mode, templateId, subject, body, recipients, attachments, scheduledDate, scheduledTime, priority, needsAck,
    savedAt: new Date().toISOString(), status: 'draft',
  })

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return
    onSaveTemplate(subject, body, mode)
    setSaveTemplatePopup(false)
    setTemplateName('')
  }

  const modeConfig = COMM_MODES.find((m) => m.value === mode)!

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm"><Edit3 className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-bold text-gray-900">Compose Message</h3>
            <p className="text-xs text-gray-500">Create and send to recipients</p>
          </div>
        </div>
        <button type="button" onClick={onDiscard} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F8FAFC' }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Communication Mode <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {COMM_MODES.map((m) => {
                  const isActive = mode === m.value
                  return (
                    <button key={m.value} type="button" onClick={() => { setMode(m.value); setTemplateId('none') }} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${isActive ? `${m.bg} border-current shadow-sm` : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'} ${isActive ? m.color : ''}`}>
                      <m.icon className="w-5 h-5" />{m.label}
                    </button>
                  )
                })}
              </div>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${modeConfig.bg} ${modeConfig.color}`}>
                <modeConfig.icon className="w-3 h-3" />Sending via {modeConfig.label}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Message Template</label>
              <select value={templateId} onChange={(e) => handleTemplateChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                {availableTemplates.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              {(subject || body) && (
                <div className="mt-2">
                  {saveTemplatePopup ? (
                    <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name..." className="flex-1 border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
                      <button type="button" onClick={handleSaveTemplate} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors">Save</button>
                      <button type="button" onClick={() => setSaveTemplatePopup(false)} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setSaveTemplatePopup(true)} className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                      <Save className="w-3.5 h-3.5" />Save as template
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Title / Subject <span className="text-red-500">*</span></label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter message title or subject..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Message / Description <span className="text-red-500">*</span></label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Type your message here..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white resize-none leading-relaxed" />
              <p className="text-right text-xs text-gray-400 mt-1">{body.length} characters</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Recipients <span className="text-red-500">*</span></label>
              <div className="space-y-3">
                <MultiSelectDropdown label="Branches" icon={Building} options={BRANCH_OPTIONS} selected={recipients.branches} onChange={(v) => setRecipients((p) => ({ ...p, branches: v }))} color="text-blue-600" />
                <MultiSelectDropdown label="Batches / Classes" icon={GraduationCap} options={BATCH_OPTIONS} selected={recipients.batches} onChange={(v) => setRecipients((p) => ({ ...p, batches: v }))} color="text-purple-600" />
                <MultiSelectDropdown label="Students" icon={UserCheck} options={STUDENT_OPTIONS} selected={recipients.students} onChange={(v) => setRecipients((p) => ({ ...p, students: v }))} color="text-green-600" />
                <MultiSelectDropdown label="Staff" icon={Users} options={STAFF_OPTIONS} selected={recipients.staff} onChange={(v) => setRecipients((p) => ({ ...p, staff: v }))} color="text-orange-600" />
              </div>
              {(recipients.branches.length + recipients.batches.length + recipients.students.length + recipients.staff.length) > 0 && (
                <div className="mt-2 p-2.5 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">
                    ✓ {recipients.branches.length} branch{recipients.branches.length !== 1 ? 'es' : ''}, {recipients.batches.length} batch{recipients.batches.length !== 1 ? 'es' : ''}, {recipients.students.length} student{recipients.students.length !== 1 ? 's' : ''}, {recipients.staff.length} staff group{recipients.staff.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> Attachments</label>
              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-500 hover:text-blue-600">
                <Paperclip className="w-4 h-4" />Click to attach files
                <input type="file" multiple className="hidden" onChange={handleFileAdd} />
              </label>
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                      <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 truncate text-gray-700">{att.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatFileSize(att.size)}</span>
                      <button type="button" onClick={() => setAttachments((p) => p.filter((a) => a.id !== att.id))} className="text-red-400 hover:text-red-600 flex-shrink-0"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Schedule Message (Optional)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input type="date" value={scheduledDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setScheduledDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Time</label>
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                </div>
              </div>
              {scheduledDate && (
                <p className="mt-1.5 text-xs text-indigo-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled for {scheduledDate}{scheduledTime ? ` at ${scheduledTime}` : ''}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Priority</label>
              <div className="flex gap-2">
                {(['high', 'normal', 'low'] as MessagePriority[]).map((p) => {
                  const cfg = {
                    high: { label: 'High', color: 'border-red-400 bg-red-50 text-red-700' },
                    normal: { label: 'Normal', color: 'border-gray-400 bg-gray-50 text-gray-700' },
                    low: { label: 'Low', color: 'border-green-400 bg-green-50 text-green-700' },
                  }
                  const isActive = priority === p
                  return (
                    <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg border-2 text-xs font-semibold transition-all ${isActive ? cfg[p].color : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}>{cfg[p].label}</button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><CheckSquare className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Needs Acknowledgement</p>
                  <p className="text-xs text-gray-500">Recipients must confirm they've read this</p>
                </div>
              </div>
              <button type="button" onClick={() => setNeedsAck((p) => !p)} className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${needsAck ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${needsAck ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 p-4 border-t bg-gray-50 rounded-b-xl">
        <div className="flex gap-3">
          <button type="button" onClick={onDiscard} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Discard</button>
          <button type="button" onClick={() => onSaveDraft(buildDraft())} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"><Save className="w-4 h-4" /> Save Draft</button>
          <button type="button" onClick={() => onSend(buildDraft())} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
            <Send className="w-4 h-4" />{scheduledDate ? 'Schedule Send' : 'Send Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DraftsPanelProps {
  drafts: DraftMessage[]
  onEdit: (draft: DraftMessage) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const DraftsPanel: React.FC<DraftsPanelProps> = ({ drafts, onEdit, onDelete, onClose }) => {
  const modeLabel: Record<CommMode, string> = { inapp: 'In-App', whatsapp: 'WhatsApp', email: 'Email', sms: 'SMS' }
  const modeColor: Record<CommMode, string> = { inapp: 'bg-blue-100 text-blue-700', whatsapp: 'bg-green-100 text-green-700', email: 'bg-purple-100 text-purple-700', sms: 'bg-orange-100 text-orange-700' }
  const ModeIcon: Record<CommMode, React.ElementType> = { inapp: Smartphone, whatsapp: MessageSquare, email: AtSign, sms: Phone }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm"><FileText className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-bold text-gray-900">Drafts</h3>
            <p className="text-xs text-gray-500">{drafts.length} saved draft{drafts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F8FAFC' }}>
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16 px-4">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium">No drafts saved</p>
            <p className="text-sm text-center mt-1">Messages you save as draft will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
            {drafts.map((draft) => {
              const Icon = ModeIcon[draft.mode]
              const recipientCount = draft.recipients.branches.length + draft.recipients.batches.length + draft.recipients.students.length + draft.recipients.staff.length
              return (
                <div key={draft.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${modeColor[draft.mode]}`}><Icon className="w-3 h-3" />{modeLabel[draft.mode]}</span>
                    <PriorityBadge priority={draft.priority} />
                    {draft.scheduledDate && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700"><Clock className="w-3 h-3" /> Scheduled</span>}
                    {draft.needsAck && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700"><CheckSquare className="w-3 h-3" /> Ack</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{draft.subject || <span className="text-gray-400 italic">No subject</span>}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{draft.body || <span className="italic">No content</span>}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</span>
                    {draft.attachments.length > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{draft.attachments.length}</span>}
                    <span>Saved {formatDate(draft.savedAt.split('T')[0])}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="button" onClick={() => onEdit(draft)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"><Edit3 className="w-3.5 h-3.5" /> Edit & Send</button>
                    <button type="button" onClick={() => onDelete(draft.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function MyMessagesInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES)
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>('inbox')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDateFilters, setShowDateFilters] = useState(false)
  const itemsPerPage = 8
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', source: 'all', sort: 'newest', dateFrom: '', dateTo: '' })
  const [mainView, setMainView] = useState<MainView>('inbox')
  const [editingDraft, setEditingDraft] = useState<DraftMessage | undefined>(undefined)
  const [drafts, setDrafts] = useState<DraftMessage[]>([])
  const [userTemplates, setUserTemplates] = useState<typeof MESSAGE_TEMPLATES>([])
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void }>({ show: false, title: '', message: '', confirmLabel: '', onConfirm: () => {} })

  const closeConfirm = () => setConfirmDialog((p) => ({ ...p, show: false }))
  const openConfirm = (title: string, message: string, confirmLabel: string, onConfirm: () => void) =>
    setConfirmDialog({ show: true, title, message, confirmLabel, onConfirm })

  const clearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: key === 'status' || key === 'priority' || key === 'source' || key === 'sort' ? 'all' : '' }))
    setCurrentPage(1)
  }
  const clearAllFilters = () => {
    setFilters({ search: '', status: 'all', priority: 'all', source: 'all', sort: 'newest', dateFrom: '', dateTo: '' })
    setCurrentPage(1)
  }

  const filteredMessages = useMemo(() => {
    let result = messages.filter((m) => {
      if (currentFolder === 'inbox') return !m.deleted && !m.archived
      if (currentFolder === 'starred') return m.starred && !m.deleted
      if (currentFolder === 'archived') return m.archived && !m.deleted
      if (currentFolder === 'trash') return m.deleted
      return !m.deleted && !m.archived
    })
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((m) => m.subject.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q) || m.body.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q) || m.labels.some((l) => l.toLowerCase().includes(q)))
    }
    if (filters.status === 'unread') result = result.filter((m) => !m.read)
    if (filters.status === 'read') result = result.filter((m) => m.read)
    if (filters.status === 'starred') result = result.filter((m) => m.starred)
    if (filters.priority !== 'all') result = result.filter((m) => m.priority === filters.priority)
    if (filters.source !== 'all') result = result.filter((m) => m.source === filters.source)
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom); fromDate.setHours(0, 0, 0, 0)
      result = result.filter((m) => new Date(m.timestamp) >= fromDate)
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo); toDate.setHours(23, 59, 59, 999)
      result = result.filter((m) => new Date(m.timestamp) <= toDate)
    }
    result.sort((a, b) => {
      if (filters.sort === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      if (filters.sort === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      if (filters.sort === 'priority') {
        const order: Record<string, number> = { high: 0, normal: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      if (filters.sort === 'sender') return a.sender.localeCompare(b.sender)
      return 0
    })
    return result
  }, [messages, currentFolder, filters])

  const paginatedMessages = filteredMessages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage)
  const stats = useMemo(() => ({
    inbox: messages.filter((m) => !m.deleted && !m.archived).length,
    unread: messages.filter((m) => !m.read && !m.deleted && !m.archived).length,
    starred: messages.filter((m) => m.starred && !m.deleted).length,
    archived: messages.filter((m) => m.archived && !m.deleted).length,
    trash: messages.filter((m) => m.deleted).length,
    pushCount: messages.filter((m) => m.source === 'push_notification' && !m.deleted).length,
    eventCount: messages.filter((m) => m.source === 'event_invitation' && !m.deleted).length,
  }), [messages])

  const hasDateFilter = Boolean(filters.dateFrom || filters.dateTo)
  const isTrash = currentFolder === 'trash'
  const isComposeOrDrafts = mainView === 'compose' || mainView === 'drafts'

  const handleSelectMessage = (id: string) => {
    const msg = messages.find((m) => m.id === id) ?? null
    setSelectedMessage(msg)
    if (msg && !msg.read) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }
  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
    if (selectedMessage?.id === id) setSelectedMessage((p) => p ? { ...p, starred: !p.starred } : p)
  }
  const handleMarkRead = (id: string, read: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)))
    if (selectedMessage?.id === id) setSelectedMessage((p) => p ? { ...p, read } : p)
  }
  const handleArchive = (id: string) => { setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, archived: true } : m))); setSelectedMessage(null) }
  const handleMoveToTrash = (id: string) => { setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, deleted: true } : m))); setSelectedMessage(null) }
  const permanentlyDelete = (id: string) => { setMessages((prev) => prev.filter((m) => m.id !== id)); setSelectedMessage(null) }
  const handleTrashDelete = (id: string, subject: string) => {
    openConfirm('Delete Permanently', `"${subject}" will be permanently deleted and cannot be recovered.`, 'Delete Forever', () => { permanentlyDelete(id); closeConfirm() })
  }
  const handleRestore = (id: string) => { setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, deleted: false, archived: false } : m))); setSelectedMessage(null) }
  const handleEmptyTrash = () => {
    const trashCount = messages.filter((m) => m.deleted).length
    if (trashCount === 0) return
    openConfirm('Empty Trash', `All ${trashCount} message${trashCount !== 1 ? 's' : ''} in Trash will be permanently deleted.`, 'Empty Trash', () => { setMessages((prev) => prev.filter((m) => !m.deleted)); setSelectedMessage(null); closeConfirm() })
  }
  const handleBulkAction = (action: string) => {
    if (currentFolder === 'trash' && action === 'delete') {
      const count = selectedMessages.length
      openConfirm('Delete Permanently', `${count} selected message${count !== 1 ? 's' : ''} will be permanently deleted.`, 'Delete Forever', () => {
        setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m.id)))
        setSelectedMessages([]); setSelectedMessage(null); closeConfirm()
      })
      return
    }
    setMessages((prev) => prev.map((m) => {
      if (!selectedMessages.includes(m.id)) return m
      if (action === 'read') return { ...m, read: true }
      if (action === 'unread') return { ...m, read: false }
      if (action === 'star') return { ...m, starred: true }
      if (action === 'archive') return { ...m, archived: true }
      if (action === 'delete') return { ...m, deleted: true }
      return m
    }))
    setSelectedMessages([])
  }
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedMessages(e.target.checked ? paginatedMessages.map((m) => m.id) : [])
  const handleToggleSelect = (id: string) => setSelectedMessages((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  const handleFolderChange = (folder: string) => { setCurrentFolder(folder); setSelectedMessage(null); setSelectedMessages([]); setCurrentPage(1); setMainView('inbox') }
  const handleRefresh = () => { setSelectedMessage(null); setSelectedMessages([]); setCurrentPage(1); clearAllFilters(); setShowDateFilters(false); setMainView('inbox') }
  const getFolderCount = (folderValue: string): string | number => {
    if (folderValue === 'inbox') return stats.unread > 0 ? `${stats.inbox} (${stats.unread})` : stats.inbox
    return stats[folderValue as keyof typeof stats] ?? 0
  }
  const handleOpenCompose = () => { setEditingDraft(undefined); setMainView('compose'); setSelectedMessage(null) }
  const handleOpenDrafts = () => { setMainView('drafts'); setSelectedMessage(null) }
  const handleSaveDraft = (draft: DraftMessage) => {
    setDrafts((prev) => {
      const exists = prev.find((d) => d.id === draft.id)
      return exists ? prev.map((d) => (d.id === draft.id ? draft : d)) : [draft, ...prev]
    })
    setMainView('inbox'); setEditingDraft(undefined)
  }
  const handleSend = (draft: DraftMessage) => { setDrafts((prev) => prev.filter((d) => d.id !== draft.id)); setMainView('inbox'); setEditingDraft(undefined) }
  const handleDiscard = () => { setMainView('inbox'); setEditingDraft(undefined) }
  const handleEditDraft = (draft: DraftMessage) => { setEditingDraft(draft); setMainView('compose') }
  const handleDeleteDraft = (id: string) => {
    openConfirm('Delete Draft', 'This draft will be permanently deleted.', 'Delete Draft', () => { setDrafts((prev) => prev.filter((d) => d.id !== id)); closeConfirm() })
  }
  const handleSaveUserTemplate = (subject: string, body: string, mode: CommMode) => {
    const newTpl = { id: `user-tpl-${generateId()}`, label: subject || 'My Template', subject, body, modes: [mode] as CommMode[] }
    setUserTemplates((prev) => [newTpl, ...prev])
  }

  return (
    <>
      <ConfirmDialog show={confirmDialog.show} title={confirmDialog.title} message={confirmDialog.message} confirmLabel={confirmDialog.confirmLabel} confirmClass="bg-red-600 hover:bg-red-700 text-white" onConfirm={confirmDialog.onConfirm} onCancel={closeConfirm} />
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Inbox</h1>
            <p className="text-sm text-gray-500 mt-1">Messages from school communications and event invitations • <span className="font-medium text-gray-700">{stats.unread} unread</span></p>
          </div>
          <Button variant="outline" onClick={handleRefresh}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Messages', value: stats.inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Unread', value: stats.unread, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Push Notifications', value: stats.pushCount, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Event Invitations', value: stats.eventCount, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className={`text-center p-2 rounded-lg ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-1">
                <button type="button" onClick={handleOpenCompose} className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${mainView === 'compose' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  <Plus className="w-4 h-4" />Create Message
                </button>
                <button type="button" onClick={handleOpenDrafts} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${mainView === 'drafts' ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <div className="flex items-center gap-3"><FileText className="w-4 h-4" />Drafts</div>
                  {drafts.length > 0 && <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${mainView === 'drafts' ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-600'}`}>{drafts.length}</span>}
                </button>
                <div className="border-t border-gray-100 my-1" />
                {FOLDER_OPTIONS.map((folder) => {
                  const isActive = currentFolder === folder.value && mainView === 'inbox'
                  const count = getFolderCount(folder.value)
                  const isInboxWithUnread = folder.value === 'inbox' && stats.unread > 0
                  return (
                    <button key={folder.value} onClick={() => handleFolderChange(folder.value)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <div className="flex items-center gap-3"><folder.icon className="w-4 h-4" />{folder.label}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isInboxWithUnread ? 'bg-red-100 text-red-700 font-bold' : isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4">
            {isComposeOrDrafts ? (
              <div style={{ height: '820px' }}>
                {mainView === 'compose' ? (
                  <ComposeForm initial={editingDraft} onSaveDraft={handleSaveDraft} onSend={handleSend} onDiscard={handleDiscard} userSavedTemplates={userTemplates} onSaveTemplate={handleSaveUserTemplate} />
                ) : (
                  <DraftsPanel drafts={drafts} onEdit={handleEditDraft} onDelete={handleDeleteDraft} onClose={handleDiscard} />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col" style={{ height: '820px' }}>
                  <div className="flex-shrink-0 p-3 border-b space-y-3 bg-gray-50 rounded-t-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 capitalize">{currentFolder}</h3>
                        <span className="text-sm text-gray-400">({filteredMessages.length} {filteredMessages.length !== 1 ? 'messages' : 'message'})</span>
                      </div>
                      {isTrash && stats.trash > 0 && (
                        <button type="button" onClick={handleEmptyTrash} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"><Trash2 className="w-3 h-3" /> Empty Trash</button>
                      )}
                    </div>
                    {isTrash && (
                      <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600 leading-snug">Messages deleted from Trash are <span className="font-semibold">permanently removed</span>.</p>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <Input placeholder="Search messages..." value={filters.search} onChange={(e) => { setFilters((p) => ({ ...p, search: e.target.value })); setCurrentPage(1) }} className="pl-9 h-9" />
                      </div>
                      <button type="button" onClick={() => setShowDateFilters((p) => !p)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-medium transition-colors ${hasDateFilter ? 'bg-indigo-600 text-white border-indigo-600' : showDateFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                        <Calendar className="w-3.5 h-3.5" /><span>Date</span>
                        {hasDateFilter && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    </div>
                    {showDateFilters && (
                      <div className="bg-white border border-indigo-100 rounded-lg p-3 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date Range Filter</p>
                          {hasDateFilter && <button type="button" onClick={() => { setFilters((p) => ({ ...p, dateFrom: '', dateTo: '' })); setCurrentPage(1) }} className="text-xs text-indigo-500 hover:text-indigo-700 underline">Clear dates</button>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">From Date</label>
                            <input type="date" value={filters.dateFrom} max={filters.dateTo || undefined} onChange={(e) => { setFilters((p) => ({ ...p, dateFrom: e.target.value })); setCurrentPage(1) }} className="w-full h-8 border border-gray-300 rounded-lg px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">To Date</label>
                            <input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(e) => { setFilters((p) => ({ ...p, dateTo: e.target.value })); setCurrentPage(1) }} className="w-full h-8 border border-gray-300 rounded-lg px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Select options={FILTER_OPTIONS} value={filters.status} onChange={(e) => { setFilters((p) => ({ ...p, status: e.target.value })); setCurrentPage(1) }} className="flex-1 h-8 text-xs" />
                      <Select options={PRIORITY_OPTIONS} value={filters.priority} onChange={(e) => { setFilters((p) => ({ ...p, priority: e.target.value })); setCurrentPage(1) }} className="flex-1 h-8 text-xs" />
                      <Select options={SORT_OPTIONS} value={filters.sort} onChange={(e) => { setFilters((p) => ({ ...p, sort: e.target.value })); setCurrentPage(1) }} className="flex-1 h-8 text-xs" />
                    </div>
                    <Select options={SOURCE_OPTIONS} value={filters.source} onChange={(e) => { setFilters((p) => ({ ...p, source: e.target.value })); setCurrentPage(1) }} className="w-full h-8 text-xs" />
                  </div>
                  <ActiveFilterPills filters={filters} onClear={clearFilter} onClearAll={clearAllFilters} />
                  {selectedMessages.length > 0 && (
                    <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-blue-50 border-b">
                      <span className="text-xs font-medium text-blue-700">{selectedMessages.length} selected</span>
                      <div className="flex gap-1 ml-auto flex-wrap">
                        {!isTrash && (
                          <>
                            <Button variant="ghost" size="xs" onClick={() => handleBulkAction('read')} title="Mark as read"><MailOpen className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="xs" onClick={() => handleBulkAction('unread')} title="Mark as unread"><Mail className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="xs" onClick={() => handleBulkAction('star')} title="Star"><Star className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="xs" onClick={() => handleBulkAction('archive')} title="Archive"><Archive className="w-3 h-3" /></Button>
                          </>
                        )}
                        <Button variant="ghost" size="xs" onClick={() => handleBulkAction('delete')} className="text-red-600" title={isTrash ? 'Delete permanently' : 'Move to Trash'}><Trash2 className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="xs" onClick={() => setSelectedMessages([])} title="Clear selection"><X className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )}
                  <div className="flex-shrink-0 flex items-center px-3 py-2 border-b bg-white">
                    <input type="checkbox" checked={selectedMessages.length === paginatedMessages.length && paginatedMessages.length > 0} onChange={handleSelectAll} className="rounded mr-3" />
                    <span className="text-xs text-gray-500">Select All</span>
                  </div>
                  <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F8FAFC' }}>
                    {paginatedMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16 px-4">
                        <Inbox className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-medium">{isTrash ? 'Trash is empty' : 'No messages found'}</p>
                        <p className="text-sm text-center mt-1">{isTrash ? 'Deleted messages will appear here.' : 'Messages will appear here.'}</p>
                      </div>
                    ) : (
                      paginatedMessages.map((msg) => (
                        <div key={msg.id} onClick={() => handleSelectMessage(msg.id)} className={`flex items-start gap-2 p-3 border-b cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'} ${!msg.read ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <input type="checkbox" checked={selectedMessages.includes(msg.id)} onChange={() => handleToggleSelect(msg.id)} onClick={(e) => e.stopPropagation()} className="rounded mt-1 flex-shrink-0" />
                          <button onClick={(e) => handleToggleStar(msg.id, e)} className="mt-0.5 flex-shrink-0">
                            {msg.starred ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <Star className="w-4 h-4 text-gray-300 hover:text-yellow-500" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.source === 'push_notification' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {msg.source === 'push_notification' ? <Bell className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className={`text-sm truncate ${!msg.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{msg.sender}</span>
                                    {!msg.read && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                                    {msg.priority === 'high' && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                                  </div>
                                  <span className="text-xs text-gray-400">{msg.senderRole}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end flex-shrink-0">
                                <span className="text-xs text-gray-500">{formatDate(msg.date)}</span>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                              </div>
                            </div>
                            <p className={`text-sm truncate ${!msg.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{msg.subject}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{msg.preview}</p>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <SourceBadge source={msg.source} />
                              <PriorityBadge priority={msg.priority} />
                              {msg.labels.slice(0, 2).map((label) => <span key={label} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{label}</span>)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex-shrink-0 flex items-center justify-between p-3 border-t bg-gray-50 rounded-b-xl">
                      <span className="text-xs text-gray-500">Page {currentPage} of {totalPages} ({filteredMessages.length} messages)</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="xs" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="xs" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col" style={{ height: '820px' }}>
                  {selectedMessage ? (
                    <>
                      <div className="flex-shrink-0 p-3 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <SourceBadge source={selectedMessage.source} />
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleMarkRead(selectedMessage.id, !selectedMessage.read)} title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}>
                            {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStar(selectedMessage.id)} title={selectedMessage.starred ? 'Unstar' : 'Star'}>
                            {selectedMessage.starred ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <Star className="w-4 h-4" />}
                          </Button>
                          {!isTrash && !selectedMessage.archived && <Button variant="ghost" size="sm" onClick={() => handleArchive(selectedMessage.id)} title="Archive"><Archive className="w-4 h-4" /></Button>}
                          {isTrash ? (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleRestore(selectedMessage.id)} title="Restore"><RefreshCw className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleTrashDelete(selectedMessage.id, selectedMessage.subject)} title="Delete permanently"><Trash2 className="w-4 h-4" /></Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleMoveToTrash(selectedMessage.id)} title="Move to Trash"><Trash2 className="w-4 h-4" /></Button>
                          )}
                        </div>
                      </div>
                      {isTrash && (
                        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-100">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                          <p className="text-xs text-red-600">This message is in Trash. Deleting here is permanent.</p>
                          <button type="button" onClick={() => handleRestore(selectedMessage.id)} className="ml-auto text-xs text-red-700 font-semibold underline hover:text-red-900 flex-shrink-0">Restore</button>
                        </div>
                      )}
                      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b bg-white">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${selectedMessage.source === 'push_notification' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {selectedMessage.source === 'push_notification' ? <Bell className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                            </div>
                            <div className="min-w-0">
                              <h2 className="text-base font-bold text-gray-900 leading-snug">{selectedMessage.subject}</h2>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-sm text-gray-600">From: <span className="font-medium text-gray-900">{selectedMessage.sender}</span></span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{selectedMessage.senderRole}</span>
                              </div>
                              {selectedMessage.labels.length > 0 && (
                                <div className="flex gap-1 flex-wrap mt-1.5">
                                  {selectedMessage.labels.map((label) => <span key={label} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{label}</span>)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 space-y-1">
                            <p className="text-sm text-gray-500">{selectedMessage.date}</p>
                            <p className="text-xs text-gray-400">{selectedMessage.time}</p>
                            <PriorityBadge priority={selectedMessage.priority} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F8FAFC' }}>
                        {selectedMessage.source === 'push_notification' ? <PushNotificationDetail message={selectedMessage} /> : <EventInvitationDetail message={selectedMessage} />}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                      <MessageSquare className="w-20 h-20 mb-4 opacity-20" />
                      <p className="font-medium text-lg text-center">Select a message to read</p>
                      <p className="text-sm text-center mt-1 text-gray-400">Push notifications and event invitations from the school will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MyMessagesInbox
