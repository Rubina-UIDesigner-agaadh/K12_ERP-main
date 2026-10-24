import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe,
  Clock,
  Layout,
  Save,
  RotateCcw,
  Download,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Type,
  Keyboard,
  Calendar,
  DollarSign,
  Hash,
  Monitor,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
  Pencil,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { modules } from '../../../data/navigationData'
import type { Module, SubModule } from '../../../types/navigation'

interface DisplayPreferences {
  language: string
  landingPage: string
  dateFormat: string
  timeFormat: '12' | '24'
  timezone: string
  currency: string
  numberFormat: string
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  showWelcomeMessage: boolean
  autoSave: boolean
}

interface LandingPageOption {
  value: string
  label: string
  description: string
  moduleLabel: string
}

interface NavShortcut {
  id: string
  keys: string[]
  action: string
  group: string
  kind: 'general' | 'module' | 'submodule' | 'page'
  sequence?: boolean
  path?: string
  event?: string
}

const LANGUAGES = [
  { value: 'en', label: 'English (Default)', native: 'English', flag: '🇺🇸' },
  { value: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { value: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { value: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { value: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { value: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { value: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { value: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { value: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { value: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
]

const DATE_FORMATS = [
  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY', example: '25/12/2024' },
  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY', example: '12/25/2024' },
  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD', example: '2024-12-25' },
  { value: 'dd-mmm-yyyy', label: 'DD-MMM-YYYY', example: '25-Dec-2024' },
  { value: 'mmm dd, yyyy', label: 'MMM DD, YYYY', example: 'Dec 25, 2024' },
  { value: 'dd mmmm yyyy', label: 'DD MMMM YYYY', example: '25 December 2024' },
]

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)', offset: '+08:00' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: '+11:00' },
]

const CURRENCIES = [
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'AED', label: 'UAE Dirham (د.إ)', symbol: 'د.إ' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
]

const NUMBER_FORMATS = [
  { value: 'indian', label: 'Indian (12,34,567.89)', example: '12,34,567.89' },
  { value: 'international', label: 'International (1,234,567.89)', example: '1,234,567.89' },
  { value: 'european', label: 'European (1.234.567,89)', example: '1.234.567,89' },
]

const FONT_SIZES = [
  { value: 'small', label: 'Small', description: 'Compact text size' },
  { value: 'medium', label: 'Medium (Default)', description: 'Standard text size' },
  { value: 'large', label: 'Large', description: 'Larger text for readability' },
]

const BINDINGS_STORAGE_KEY = 'k12-shortcut-bindings-v1'

let shortcutCaptureActive = false
export function isShortcutCaptureActive() {
  return shortcutCaptureActive
}

const LETTER_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIGIT_KEYS = '1234567890'.split('')
const CHORD_KEYS = [
  ...LETTER_KEYS,
  ...DIGIT_KEYS,
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
  'Tab',
]

const CHORD_MODS: string[][] = [
  ['Alt'],
  ['Ctrl', 'Alt'],
  ['Alt', 'Shift'],
  ['Ctrl', 'Shift'],
  ['Ctrl', 'Alt', 'Shift'],
]

function chordId(keys: string[]) {
  return keys.join('+')
}

function buildChordPool() {
  const pool: string[][] = []
  CHORD_MODS.forEach((mods) => {
    CHORD_KEYS.forEach((key) => {
      if (key === 'Tab' && mods.length === 1 && mods[0] === 'Alt') return
      pool.push([...mods, key])
    })
  })
  return pool
}

const CHORD_POOL = buildChordPool()

function loadBindings(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(BINDINGS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveBindings(bindings: Record<string, string[]>) {
  try {
    localStorage.setItem(BINDINGS_STORAGE_KEY, JSON.stringify(bindings))
    window.dispatchEvent(new Event('k12-shortcut-bindings-changed'))
  } catch {
    /* ignore */
  }
}

function keysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((k, i) => k.toLowerCase() === b[i].toLowerCase())
}

function keyToken(e: KeyboardEvent): string | null {
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return null
  const code = e.code || ''
  if (code.startsWith('Key') && code.length === 4) return code.slice(3)
  if (code.startsWith('Digit') && code.length === 6) return code.slice(5)
  if (/^F\d{1,2}$/i.test(e.key)) return e.key.toUpperCase()
  if (e.key === 'Escape') return 'Esc'
  if (e.key === 'Enter') return 'Enter'
  if (e.key === ' ') return 'Space'
  if (e.key === 'Tab') return 'Tab'
  if (e.key === 'ArrowLeft') return 'Left'
  if (e.key === 'ArrowRight') return 'Right'
  if (e.key === 'ArrowUp') return 'Up'
  if (e.key === 'ArrowDown') return 'Down'
  if (e.key === 'Backspace') return 'Backspace'
  if (e.key === 'Delete') return 'Delete'
  if (e.key === 'Home') return 'Home'
  if (e.key === 'End') return 'End'
  if (e.key === 'PageUp') return 'PageUp'
  if (e.key === 'PageDown') return 'PageDown'
  const byCode: Record<string, string> = {
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Semicolon: ';',
    Quote: "'",
    Comma: ',',
    Period: '.',
    Slash: '/',
    Backquote: '`',
  }
  if (byCode[code]) return byCode[code]
  if (e.key.length === 1) return e.key.toUpperCase()
  return e.key
}

function eventToKeys(e: KeyboardEvent): string[] | null {
  const token = keyToken(e)
  if (!token) return null
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')
  parts.push(token)
  return parts
}

function openAppPath(path: string, target: 'self' | 'tab' | 'window', navigate?: (path: string) => void) {
  if (target === 'self') {
    navigate?.(path)
    return
  }
  if (target === 'tab') {
    window.open(path, '_blank', 'noopener,noreferrer')
    return
  }
  const width = Math.min(1280, window.screen.availWidth - 48)
  const height = Math.min(800, window.screen.availHeight - 80)
  window.open(path, '_blank', `noopener,noreferrer,width=${width},height=${height},left=48,top=48`)
}

function firstPageOfModule(mod: Module): LandingPageOption {
  const sm = mod.subModules[0]
  if (!sm) {
    return { value: mod.id, label: mod.label, description: `Open ${mod.label}`, moduleLabel: mod.label }
  }
  const section = sm.sidebarConfig?.find((s) => !s.hidden && s.items.length > 0)
  const page = section?.items[0]
  if (page) {
    return {
      value: page.id,
      label: page.label,
      description: `${mod.label} · ${sm.label}`,
      moduleLabel: mod.label,
    }
  }
  return {
    value: sm.id,
    label: sm.label,
    description: mod.label,
    moduleLabel: mod.label,
  }
}

function buildLandingPages(): LandingPageOption[] {
  return modules.map(firstPageOfModule)
}

function visiblePages(sm: SubModule) {
  const sections = (sm.sidebarConfig || []).filter((s) => !s.hidden && s.items.length > 0)
  if (!sections.length) return [{ id: sm.id, label: sm.label }]
  return sections.flatMap((s) => s.items)
}

export function openShortcutList() {
  window.dispatchEvent(new Event('k12-open-shortcut-list'))
}

function buildNavShortcuts(): NavShortcut[] {
  const list: NavShortcut[] = [
    { id: 'hdr-search', keys: ['Alt', 'K'], action: 'Search', group: 'General', kind: 'general', event: 'k12-open-search' },
    { id: 'hdr-notifications', keys: ['Alt', 'N'], action: 'Notifications', group: 'General', kind: 'general', event: 'k12-open-notifications' },
    { id: 'hdr-calendar', keys: ['Alt', 'C'], action: 'Calendar', group: 'General', kind: 'general', path: '/my-details/my-calendar/my-school-calendar' },
    { id: 'hdr-inbox', keys: ['Alt', 'I'], action: 'Inbox', group: 'General', kind: 'general', path: '/my-details/my-communication/my-messages-inbox' },
    { id: 'hdr-shortcuts', keys: ['Alt', '/'], action: 'Show keyboard shortcuts', group: 'General', kind: 'general' },
    { id: 'hdr-settings', keys: ['Alt', 'G'], action: 'Open Settings', group: 'General', kind: 'general', event: 'k12-open-settings-menu' },
    { id: 'hdr-profile', keys: ['Alt', 'U'], action: 'User profile', group: 'General', kind: 'general', path: '/profile' },
    { id: 'hdr-theme', keys: ['Alt', 'B'], action: 'Change theme', group: 'General', kind: 'general', event: 'k12-open-theme' },
    { id: 'hdr-help', keys: ['Alt', 'Shift', 'H'], action: 'Open Help', group: 'General', kind: 'general', event: 'k12-open-help' },
    { id: 'cancel', keys: ['Esc'], action: 'Close shortcut list', group: 'General', kind: 'general' },
  ]
  const used = new Set(list.map((s) => chordId(s.keys)))
  let poolIndex = 0
  const nextChord = () => {
    while (poolIndex < CHORD_POOL.length) {
      const chord = CHORD_POOL[poolIndex]
      poolIndex += 1
      const id = chordId(chord)
      if (!used.has(id)) {
        used.add(id)
        return chord
      }
    }
    const fallback = ['Ctrl', 'Alt', 'Shift', `F${used.size}`]
    used.add(chordId(fallback))
    return fallback
  }
  modules.forEach((mod) => {
    mod.subModules.forEach((sm) => {
      visiblePages(sm).forEach((page) => {
        list.push({
          id: `page-${mod.id}-${sm.id}-${page.id}`,
          keys: nextChord(),
          action: page.label,
          group: mod.label,
          kind: 'page',
          path: `/${mod.id}/${sm.id}/${page.id}`,
        })
      })
    })
  })
  return list
}

const LANDING_PAGES = buildLandingPages()
const ALL_SHORTCUTS = buildNavShortcuts()
const DEFAULT_LANDING = LANDING_PAGES[0]?.value || 'user-dashboard'

const INITIAL_PREFERENCES: DisplayPreferences = {
  language: 'en',
  landingPage: DEFAULT_LANDING,
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '12',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  numberFormat: 'indian',
  fontSize: 'medium',
  highContrast: false,
  showWelcomeMessage: true,
  autoSave: false,
}

function ToggleSwitch({
  enabled,
  onToggle,
  color = 'bg-blue-500',
}: {
  enabled: boolean
  onToggle: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-5 w-9 rounded-full transition-colors ${enabled ? color : 'bg-gray-300'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : ''}`}
      />
    </button>
  )
}

function KeyCaps({ keys, active }: { keys: string[]; active?: boolean }) {
  const label = keys.join(' + ')
  return (
    <span
      className={`inline-flex min-w-[4.75rem] items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-gray-200 text-gray-900 ring-1 ring-gray-300'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {label}
    </span>
  )
}

function SectionHeader({
  title,
  icon: Icon,
  section,
  iconColor,
  expandedSections,
  toggleSection,
}: {
  title: string
  icon: React.ElementType
  section: string
  iconColor: string
  expandedSections: string[]
  toggleSection: (s: string) => void
}) {
  const isOpen = expandedSections.includes(section)
  return (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100"
    >
      <div className="flex items-center gap-2">
        <div className={`rounded-md p-1.5 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {isOpen
        ? <ChevronUp className="h-4 w-4 text-gray-500" />
        : <ChevronDown className="h-4 w-4 text-gray-500" />}
    </button>
  )
}

function ShortcutsPanel({
  query,
  onQuery,
  shortcuts,
  bindings,
  onChangeBindings,
  onClose,
}: {
  query: string
  onQuery: (q: string) => void
  shortcuts: NavShortcut[]
  bindings: Record<string, string[]>
  onChangeBindings: (next: Record<string, string[]>) => void
  onClose?: () => void
}) {
  const [recordingId, setRecordingId] = useState<string | null>(null)
  const [draftKeys, setDraftKeys] = useState<string[]>([])
  const [conflict, setConflict] = useState('')
  const [scopeDraft, setScopeDraft] = useState('all')
  const [scope, setScope] = useState('all')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const resolved = useMemo(
    () => shortcuts.map((s) => {
      const keys = bindings[s.id] || s.keys
      return { ...s, keys, customized: Boolean(bindings[s.id]) }
    }),
    [shortcuts, bindings],
  )

  const scopeOptions = useMemo(() => {
    const groups = Array.from(new Set(resolved.map((s) => s.group)))
    return [{ value: 'all', label: 'All shortcuts (default)' }, ...groups.map((g) => ({ value: g, label: g }))]
  }, [resolved])

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = resolved.filter((s) => {
      if (scope !== 'all' && s.group !== scope) return false
      if (!q) return true
      return (
        s.action.toLowerCase().includes(q)
        || s.group.toLowerCase().includes(q)
        || s.keys.join(' ').toLowerCase().includes(q)
        || s.keys.join('+').toLowerCase().includes(q)
      )
    })
    const map = new Map<string, typeof resolved>()
    filtered.forEach((s) => {
      const arr = map.get(s.group) || []
      arr.push(s)
      map.set(s.group, arr)
    })
    return Array.from(map.entries())
  }, [resolved, query, scope])

  const stopRecording = () => {
    shortcutCaptureActive = false
    setRecordingId(null)
    setDraftKeys([])
    setConflict('')
  }

  const startRecording = (id: string) => {
    shortcutCaptureActive = true
    setRecordingId(id)
    setDraftKeys([])
    setConflict('')
  }

  const commitKeys = (id: string, keys: string[]) => {
    if (!keys.length) return
    const clash = resolved.find((s) => s.id !== id && keysEqual(s.keys, keys))
    if (clash) {
      setConflict(`Already used by “${clash.action}”`)
      return
    }
    const def = shortcuts.find((s) => s.id === id)
    const next = { ...bindings }
    if (def && keysEqual(def.keys, keys)) delete next[id]
    else next[id] = keys
    onChangeBindings(next)
    stopRecording()
  }

  useEffect(() => {
    if (!recordingId) return
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') {
        stopRecording()
        return
      }
      if (e.key === 'Enter' && !(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)) {
        if (draftKeys.length) commitKeys(recordingId, draftKeys)
        return
      }
      const chord = eventToKeys(e)
      if (!chord) return
      setDraftKeys(chord)
      setConflict('')
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [recordingId, draftKeys, bindings, resolved])

  const customizedCount = Object.keys(bindings).length
  const isOpen = (group: string) => openGroups[group] !== false

  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden bg-white ${onClose ? '' : 'rounded-lg border border-gray-200 shadow-sm'}`}>
      <div className="flex shrink-0 items-center justify-between px-5 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-900">Keyboard shortcuts</h3>
        <div className="flex items-center gap-1">
          {customizedCount > 0 && (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              onClick={() => { onChangeBindings({}); stopRecording() }}
            >
              Reset all
            </button>
          )}
          {onClose && (
            <button type="button" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 px-5 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs text-gray-500">Show shortcuts</p>
            <select
              value={scopeDraft}
              onChange={(e) => setScopeDraft(e.target.value)}
              className="w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {scopeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="mt-5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            onClick={() => setScope(scopeDraft)}
          >
            Apply
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Filter shortcuts"
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-scroll overscroll-contain px-5 pb-4">
        {grouped.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No shortcuts match “{query}”</p>
        )}
        {grouped.map(([group, items], gi) => (
          <div key={group} className={gi > 0 ? 'mt-2 border-t border-gray-200 pt-2' : ''}>
            <button
              type="button"
              className="flex w-full items-center gap-2 py-2 text-left text-sm font-semibold text-gray-800"
              onClick={() => setOpenGroups((prev) => ({ ...prev, [group]: !isOpen(group) }))}
            >
              {isOpen(group)
                ? <ChevronDown className="h-4 w-4 text-gray-500" />
                : <ChevronRight className="h-4 w-4 text-gray-500" />}
              {group}
            </button>
            {isOpen(group) && (
              <div className="grid grid-cols-1 items-start gap-x-10 md:grid-cols-2">
                {items.map((s) => {
                  const recording = recordingId === s.id
                  if (recording) {
                    return (
                      <div
                        key={s.id}
                        className="relative z-20 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="min-w-0 truncate text-sm font-medium text-gray-900" title={s.action}>{s.action}</p>
                          <KeyCaps keys={s.keys} />
                        </div>
                        <p className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                          Type a customised shortcut
                          <span title="Press the key combination, then Save">
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                          </span>
                        </p>
                        <input
                          readOnly
                          value={draftKeys.length ? draftKeys.join('+') : ''}
                          placeholder="Press keys…"
                          className="w-full border-0 border-b-2 border-blue-600 bg-transparent py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                        />
                        {conflict && <p className="mt-1.5 text-xs text-red-600">{conflict}</p>}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            disabled={!draftKeys.length}
                            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => commitKeys(s.id, draftKeys)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={stopRecording}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div
                      key={s.id}
                      className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-gray-100"
                    >
                      <p className="min-w-0 truncate text-sm text-gray-800" title={s.action}>{s.action}</p>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          title="Edit shortcut"
                          className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100"
                          onClick={() => startRecording(s.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <KeyCaps keys={s.keys} />
                        {s.customized && (
                          <button
                            type="button"
                            title="Reset to default"
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                            onClick={() => {
                              const next = { ...bindings }
                              delete next[s.id]
                              onChangeBindings(next)
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function KeyboardShortcutsRuntime() {
  const navigate = useNavigate()
  const [listOpen, setListOpen] = useState(false)
  const [bindings, setBindings] = useState<Record<string, string[]>>(loadBindings)
  const [shortcutQuery, setShortcutQuery] = useState('')

  const resolved = useMemo(
    () => ALL_SHORTCUTS.map((s) => ({ ...s, keys: bindings[s.id] || s.keys })),
    [bindings],
  )

  useEffect(() => {
    const open = () => setListOpen(true)
    const sync = () => setBindings(loadBindings())
    window.addEventListener('k12-open-shortcut-list', open)
    window.addEventListener('k12-shortcut-bindings-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('k12-open-shortcut-list', open)
      window.removeEventListener('k12-shortcut-bindings-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const persistBindings = (next: Record<string, string[]>) => {
    setBindings(next)
    saveBindings(next)
  }

  useEffect(() => {
    const fire = (item: NavShortcut) => {
      if (item.id === 'list' || item.id === 'hdr-shortcuts') {
        setListOpen(true)
        return
      }
      if (item.id === 'cancel') {
        setListOpen(false)
        return
      }
      setListOpen(false)
      if (item.event) {
        window.dispatchEvent(new Event(item.event))
        return
      }
      if (item.path) openAppPath(item.path, 'self', navigate)
    }

    const onKey = (e: KeyboardEvent) => {
      if (shortcutCaptureActive) return
      if (e.repeat) return
      if (e.key === 'Escape') {
        if (listOpen) {
          e.preventDefault()
          setListOpen(false)
        }
        return
      }
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        return
      }
      const chord = eventToKeys(e)
      if (!chord) return
      const hit = resolved.find((s) => keysEqual(s.keys, chord))
      if (!hit) return
      e.preventDefault()
      e.stopPropagation()
      fire(hit)
    }

    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [navigate, resolved, listOpen])

  return (
    <>
      {listOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setListOpen(false)} />
          <div
            className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ShortcutsPanel
              query={shortcutQuery}
              onQuery={setShortcutQuery}
              shortcuts={ALL_SHORTCUTS}
              bindings={bindings}
              onChangeBindings={persistBindings}
              onClose={() => setListOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

export function MyDisplayLanguage() {
  const [preferences, setPreferences] = useState<DisplayPreferences>(INITIAL_PREFERENCES)
  const [originalPreferences] = useState<DisplayPreferences>(INITIAL_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'language', 'landing', 'regional', 'display', 'accessibility', 'behavior',
  ])

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setHasChanges(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  useEffect(() => {
    const changed = JSON.stringify(preferences) !== JSON.stringify(originalPreferences)
    setHasChanges(changed)
    if (preferences.autoSave && changed) {
      const timer = setTimeout(() => { void handleSave() }, 2000)
      return () => clearTimeout(timer)
    }
  }, [preferences, originalPreferences])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (shortcutCaptureActive) return
      const chord = eventToKeys(e)
      if (!chord) return
      if (keysEqual(chord, ['Ctrl', 'S'])) {
        e.preventDefault()
        void handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const updatePreference = <K extends keyof DisplayPreferences>(
    key: K,
    value: DisplayPreferences[K],
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    setSaveSuccess(false)
  }

  const toggleSection = (section: string) =>
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section],
    )

  const handleReset = () => {
    setPreferences({ ...INITIAL_PREFERENCES })
    setShowResetModal(false)
    setHasChanges(true)
  }

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ preferences, exportedAt: new Date().toISOString(), version: '1.0' }, null, 2)],
      { type: 'application/json' },
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `display-preferences-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.preferences) {
          const next = { ...INITIAL_PREFERENCES, ...data.preferences } as DisplayPreferences
          setPreferences(next)
          setHasChanges(true)
          alert('Preferences imported successfully!')
        }
      } catch {
        alert('Error importing preferences')
      }
    }
    reader.readAsText(file)
  }

  const currentTime = useMemo(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: preferences.timeFormat === '12',
    })
  }, [preferences.timeFormat])

  const currentDate = useMemo(() => {
    const format = DATE_FORMATS.find((f) => f.value === preferences.dateFormat)
    return format?.example || new Date().toLocaleDateString()
  }, [preferences.dateFormat])

  const selectedTimezone = TIMEZONES.find((t) => t.value === preferences.timezone)
  const selectedCurrency = CURRENCIES.find((c) => c.value === preferences.currency)

  const sectionProps = { expandedSections, toggleSection }

  return (
    <div className="space-y-3 px-[2cm]">

      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Display & Language</h1>
          <p className="text-sm text-gray-500">
            Language, landing page, regional formats and display
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={() => openShortcutList()}>
            <Keyboard className="mr-1 h-3.5 w-3.5" /> View shortcut list
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-base font-medium text-green-700">Preferences saved successfully!</p>
        </div>
      )}

      {hasChanges && !preferences.autoSave && (
        <div className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <p className="flex-1 text-base text-yellow-700">You have unsaved changes</p>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-1 h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save Now'}
          </Button>
        </div>
      )}

      {preferences.autoSave && (
        <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Auto-save is enabled. Changes will be saved automatically.</span>
        </div>
      )}

      <div className="space-y-3">

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Interface Language"
              icon={Globe}
              section="language"
              iconColor="bg-blue-100 text-blue-600"
              {...sectionProps}
            />
            {expandedSections.includes('language') && (
              <div className="space-y-2 p-3">
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      type="button"
                      key={lang.value}
                      onClick={() => updatePreference('language', lang.value)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                        preferences.language === lang.value
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium text-gray-900">{lang.label}</p>
                        <p className="truncate text-[13px] text-gray-500">{lang.native}</p>
                      </div>
                      {preferences.language === lang.value && (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-start gap-2 rounded-md bg-gray-50 p-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <p className="text-[13px] text-gray-600">
                    Some administrative content, system messages, and technical terms may remain
                    in English regardless of your language selection.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Default Landing Page"
              icon={Layout}
              section="landing"
              iconColor="bg-purple-100 text-purple-600"
              {...sectionProps}
            />
            {expandedSections.includes('landing') && (
              <div className="p-3">
                <p className="mb-2 text-[13px] text-gray-500">
                  First page of each module — this screen opens after you sign in.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {LANDING_PAGES.map((page) => (
                    <button
                      type="button"
                      key={page.value}
                      onClick={() => updatePreference('landingPage', page.value)}
                      className={`flex items-start gap-2 rounded-lg border p-2.5 text-left transition-all ${
                        preferences.landingPage === page.value
                          ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-200'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-purple-600">
                          {page.moduleLabel}
                        </p>
                        <p className="text-base font-medium text-gray-900">{page.label}</p>
                        <p className="mt-0.5 truncate text-[13px] text-gray-500">{page.description}</p>
                      </div>
                      {preferences.landingPage === page.value && (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-purple-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Regional Formats"
              icon={Clock}
              section="regional"
              iconColor="bg-orange-100 text-orange-600"
              {...sectionProps}
            />
            {expandedSections.includes('regional') && (
              <div className="space-y-3 p-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Calendar className="h-3.5 w-3.5" /> Date Format
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
                    {DATE_FORMATS.map((fmt) => (
                      <button
                        type="button"
                        key={fmt.value}
                        onClick={() => updatePreference('dateFormat', fmt.value)}
                        className={`rounded-md border p-2 text-left transition-all ${
                          preferences.dateFormat === fmt.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{fmt.label}</p>
                        <p className="text-[13px] text-gray-500">{fmt.example}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Clock className="h-3.5 w-3.5" /> Time Format
                  </label>
                  <div className="flex gap-2">
                    {(['12', '24'] as const).map((fmt) => (
                      <button
                        type="button"
                        key={fmt}
                        onClick={() => updatePreference('timeFormat', fmt)}
                        className={`flex-1 rounded-md border p-2 transition-all ${
                          preferences.timeFormat === fmt
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <p className="text-base font-medium text-gray-900">{fmt}-hour</p>
                        <p className="text-[13px] text-gray-500">{fmt === '12' ? '2:30 PM' : '14:30'}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Globe className="h-3.5 w-3.5" /> Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => updatePreference('timezone', e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label} (UTC{tz.offset})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <DollarSign className="h-3.5 w-3.5" /> Currency Display
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => updatePreference('currency', e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Hash className="h-3.5 w-3.5" /> Number Format
                    </label>
                    <select
                      value={preferences.numberFormat}
                      onChange={(e) => updatePreference('numberFormat', e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      {NUMBER_FORMATS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-md bg-gray-50 p-2.5">
                  <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
                  <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{currentDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{currentTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Currency</p>
                      <p className="font-medium text-gray-900">{selectedCurrency?.symbol}1,234.56</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timezone</p>
                      <p className="font-medium text-gray-900">{selectedTimezone?.offset}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Display Settings"
              icon={Monitor}
              section="display"
              iconColor="bg-green-100 text-green-600"
              {...sectionProps}
            />
            {expandedSections.includes('display') && (
              <div className="p-3">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Type className="h-3.5 w-3.5" /> Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SIZES.map((size) => (
                    <button
                      type="button"
                      key={size.value}
                      onClick={() => updatePreference('fontSize', size.value as DisplayPreferences['fontSize'])}
                      className={`flex items-center justify-between rounded-md border p-2.5 transition-all ${
                        preferences.fontSize === size.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div>
                        <p className={`font-medium text-gray-900 ${
                          size.value === 'small' ? 'text-sm' : size.value === 'large' ? 'text-lg' : 'text-base'
                        }`}>
                          {size.label}
                        </p>
                        <p className="text-[13px] text-gray-500">{size.description}</p>
                      </div>
                      {size.value === 'small'
                        ? <ZoomOut className="h-4 w-4 text-gray-400" />
                        : size.value === 'large'
                        ? <ZoomIn className="h-4 w-4 text-gray-400" />
                        : <Type className="h-4 w-4 text-gray-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Accessibility"
              icon={Eye}
              section="accessibility"
              iconColor="bg-indigo-100 text-indigo-600"
              {...sectionProps}
            />
            {expandedSections.includes('accessibility') && (
              <div className="space-y-2 p-3">
                <div className="flex items-center justify-between rounded-md bg-gray-50 p-2.5">
                  <div>
                    <p className="text-base font-medium text-gray-900">High Contrast</p>
                    <p className="text-[13px] text-gray-500">Increase contrast for better visibility</p>
                  </div>
                  <ToggleSwitch
                    enabled={preferences.highContrast}
                    onToggle={() => updatePreference('highContrast', !preferences.highContrast)}
                    color="bg-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between rounded-md bg-gray-50 p-2.5">
                  <div>
                    <p className="text-base font-medium text-gray-900">Shortcut list</p>
                    <p className="text-[13px] text-gray-500">View Ctrl / Alt / Shift combinations for every page</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openShortcutList()}>
                    <Keyboard className="mr-1 h-3.5 w-3.5" /> View shortcut list
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card noPadding className="overflow-hidden">
            <SectionHeader
              title="Behavior"
              icon={Settings}
              section="behavior"
              iconColor="bg-red-100 text-red-600"
              {...sectionProps}
            />
            {expandedSections.includes('behavior') && (
              <div className="space-y-2 p-3">
                <div className="flex items-center justify-between rounded-md bg-gray-50 p-2.5">
                  <div>
                    <p className="text-base font-medium text-gray-900">Show Welcome Message</p>
                    <p className="text-[13px] text-gray-500">Display greeting on login</p>
                  </div>
                  <ToggleSwitch
                    enabled={preferences.showWelcomeMessage}
                    onToggle={() => updatePreference('showWelcomeMessage', !preferences.showWelcomeMessage)}
                    color="bg-red-500"
                  />
                </div>

                <div className="flex items-center justify-between rounded-md bg-gray-50 p-2.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-base font-medium text-gray-900">Auto-Save Changes</p>
                      <p className="text-[13px] text-gray-500">Automatically save preferences after changes</p>
                    </div>
                    {preferences.autoSave && <Badge variant="success">Active</Badge>}
                  </div>
                  <ToggleSwitch
                    enabled={preferences.autoSave}
                    onToggle={() => updatePreference('autoSave', !preferences.autoSave)}
                    color="bg-red-500"
                  />
                </div>
              </div>
            )}
          </Card>

          <Card noPadding>
            <div className="flex flex-col items-center justify-between gap-2 p-3 sm:flex-row">
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Export
                </Button>
                <label className="cursor-pointer">
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  <span className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    <Upload className="mr-1 h-3.5 w-3.5" /> Import
                  </span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                {hasChanges && !preferences.autoSave && (
                  <span className="flex items-center gap-1 text-sm text-orange-600">
                    <AlertCircle className="h-3.5 w-3.5" /> Unsaved changes
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowResetModal(true)}>
                  <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset to Defaults
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} disabled={!hasChanges || saving}>
                  <Save className="mr-1 h-3.5 w-3.5" />
                  {saving ? 'Saving…' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </Card>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-full bg-yellow-100 p-2">
                <RotateCcw className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reset to Defaults</h2>
            </div>
            <p className="mb-4 text-base text-gray-600">
              This will reset all display and language preferences to their default values.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetModal(false)}>Cancel</Button>
              <Button variant="warning" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset All
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default MyDisplayLanguage
