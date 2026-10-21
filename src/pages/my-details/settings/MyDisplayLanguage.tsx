import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  History,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  Pencil,
  ExternalLink,
  Maximize2,
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
  keyboardShortcuts: boolean
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

const SHORTCUTS_STORAGE_KEY = 'k12-keyboard-shortcuts-v1'
const BINDINGS_STORAGE_KEY = 'k12-shortcut-bindings-v1'

let shortcutCaptureActive = false
export function isShortcutCaptureActive() {
  return shortcutCaptureActive
}

const MODULE_LETTER: Record<string, string> = {
  dashboard: 'D',
  student: 'S',
  academic: 'A',
  finance: 'F',
  hr: 'H',
  assessment: 'E',
  'admin-tools': 'T',
  more: 'M',
  'my-details': 'Y',
  plugins: 'P',
}

export function isKeyboardShortcutsEnabled(): boolean {
  try {
    const v = localStorage.getItem(SHORTCUTS_STORAGE_KEY)
    if (v === null) return true
    return v === 'on'
  } catch {
    return true
  }
}

export function setKeyboardShortcutsEnabled(on: boolean) {
  try {
    localStorage.setItem(SHORTCUTS_STORAGE_KEY, on ? 'on' : 'off')
    window.dispatchEvent(new Event('k12-shortcuts-changed'))
  } catch {
    /* ignore */
  }
}

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

function eventToKeys(e: KeyboardEvent): string[] | null {
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return null
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey && (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey)) parts.push('Shift')
  let display = e.key
  if (e.key === 'Escape') display = 'Esc'
  else if (e.key === 'Enter') display = 'Enter'
  else if (e.key === ' ') display = 'Space'
  else if (e.key.length === 1) display = e.key.toUpperCase()
  parts.push(display)
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

function firstItemId(sm: SubModule): string {
  const section = sm.sidebarConfig?.find((s) => !s.hidden && s.items.length > 0)
  return section?.items[0]?.id || sm.id
}

function modulePath(mod: Module): string {
  const sm = mod.subModules[0]
  if (!sm) return `/${mod.id}`
  return `/${mod.id}/${sm.id}/${firstItemId(sm)}`
}

function subPath(mod: Module, sm: SubModule): string {
  return `/${mod.id}/${sm.id}/${firstItemId(sm)}`
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

function buildNavShortcuts(): NavShortcut[] {
  const list: NavShortcut[] = [
    { id: 'jump', keys: ['Ctrl', 'K'], action: 'Jump to any page (search)', group: 'General', kind: 'general' },
    { id: 'go', keys: ['G'], action: 'Start Go — then a module letter', group: 'General', kind: 'general' },
    { id: 'cancel', keys: ['Esc'], action: 'Cancel Go or close jump', group: 'General', kind: 'general' },
    { id: 'save', keys: ['Ctrl', 'S'], action: 'Save preferences', group: 'This page', kind: 'general' },
    { id: 'preview', keys: ['Ctrl', 'P'], action: 'Preview settings', group: 'This page', kind: 'general' },
    { id: 'open-page-tab', keys: ['Alt', 'T'], action: 'Open current page in a new tab', group: 'Open in tab / window', kind: 'page' },
    { id: 'open-page-window', keys: ['Alt', 'W'], action: 'Open current page in a new window', group: 'Open in tab / window', kind: 'page' },
    { id: 'go-tab', keys: ['T'], action: 'After Go: open that page in a new tab', group: 'Open in tab / window', kind: 'page', sequence: true },
    { id: 'go-window', keys: ['W'], action: 'After Go: open that page in a new window', group: 'Open in tab / window', kind: 'page', sequence: true },
    { id: 'jump-tab', keys: ['Ctrl', 'Enter'], action: 'Jump list: open in a new tab', group: 'Open in tab / window', kind: 'page' },
    { id: 'jump-window', keys: ['Ctrl', 'Shift', 'Enter'], action: 'Jump list: open in a new window', group: 'Open in tab / window', kind: 'page' },
  ]
  modules.forEach((mod) => {
    const letter = MODULE_LETTER[mod.id]
    if (!letter) return
    list.push({
      id: `mod-${mod.id}`,
      keys: ['G', letter],
      action: `Open ${mod.label}`,
      group: 'Modules',
      kind: 'module',
      sequence: true,
    })
    mod.subModules.slice(0, 9).forEach((sm, si) => {
      list.push({
        id: `sub-${mod.id}-${sm.id}`,
        keys: ['G', letter, String(si + 1)],
        action: sm.label,
        group: mod.label,
        kind: 'submodule',
        sequence: true,
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
  keyboardShortcuts: true,
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

function KeyCaps({ keys, sequence }: { keys: string[]; sequence?: boolean }) {
  return (
    <div className="flex flex-shrink-0 items-center gap-0.5">
      {keys.map((key, j) => (
        <Fragment key={`${key}-${j}`}>
          <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[12px] font-semibold text-gray-700">
            {key}
          </kbd>
          {j < keys.length - 1 && (
            <span className="px-0.5 text-[12px] text-gray-400">{sequence ? 'then' : '+'}</span>
          )}
        </Fragment>
      ))}
    </div>
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
  enabled,
  query,
  onQuery,
  shortcuts,
  bindings,
  onChangeBindings,
}: {
  enabled: boolean
  query: string
  onQuery: (q: string) => void
  shortcuts: NavShortcut[]
  bindings: Record<string, string[]>
  onChangeBindings: (next: Record<string, string[]>) => void
}) {
  const [recordingId, setRecordingId] = useState<string | null>(null)
  const [draftKeys, setDraftKeys] = useState<string[]>([])
  const [conflict, setConflict] = useState('')

  const resolved = useMemo(
    () => shortcuts.map((s) => {
      const keys = bindings[s.id] || s.keys
      const sequence = keys.length > 1 && !keys.some((k) => k === 'Ctrl' || k === 'Alt' || k === 'Meta')
      return { ...s, keys, sequence, customized: Boolean(bindings[s.id]) }
    }),
    [shortcuts, bindings],
  )

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? resolved.filter((s) =>
        s.action.toLowerCase().includes(q)
        || s.group.toLowerCase().includes(q)
        || s.keys.join(' ').toLowerCase().includes(q)
        || s.kind.includes(q))
      : resolved
    const map = new Map<string, typeof resolved>()
    filtered.forEach((s) => {
      const arr = map.get(s.group) || []
      arr.push(s)
      map.set(s.group, arr)
    })
    return Array.from(map.entries())
  }, [resolved, query])

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
      if (e.key === 'Escape' && draftKeys.length === 0) {
        stopRecording()
        return
      }
      if (e.key === 'Enter' && !(e.ctrlKey || e.altKey || e.metaKey) && draftKeys.length > 0) {
        commitKeys(recordingId, draftKeys)
        return
      }
      if (e.key === 'Backspace') {
        setDraftKeys((prev) => prev.slice(0, -1))
        setConflict('')
        return
      }
      const chord = eventToKeys(e)
      if (!chord) return
      if (chord.length > 1) {
        commitKeys(recordingId, chord)
        return
      }
      setDraftKeys((prev) => [...prev, chord[0]])
      setConflict('')
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [recordingId, draftKeys, bindings, resolved])

  const customizedCount = Object.keys(bindings).length

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-indigo-100 p-1.5 text-indigo-600">
            <Keyboard className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Keyboard Shortcuts</h3>
            <p className="text-[13px] text-gray-500">
              {enabled ? 'Click Edit to change a shortcut' : 'Turn on the toggle to use these'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {customizedCount > 0 && (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-[12px] text-gray-600 hover:bg-gray-200"
              onClick={() => { onChangeBindings({}); stopRecording() }}
            >
              Reset all
            </button>
          )}
          <Badge variant={enabled ? 'success' : 'default'}>{enabled ? 'On' : 'Off'}</Badge>
        </div>
      </div>
      <div className="shrink-0 border-b border-gray-100 px-3 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search shortcuts…"
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-1.5 text-[13px] text-gray-500">
          Jump: Ctrl+K · Go: G then letter then 1–9 · New tab: T · New window: W
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-scroll overscroll-contain">
        {grouped.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-gray-500">No shortcuts match “{query}”</p>
        )}
        {grouped.map(([group, items]) => (
          <div key={group} className="border-b border-gray-100 last:border-b-0">
            <div className="sticky top-0 z-[1] border-b border-gray-100 bg-gray-50 px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-gray-500">
              {group}
              <span className="ml-1 font-normal text-gray-400">({items.length})</span>
            </div>
            <div>
              {items.map((s) => {
                const recording = recordingId === s.id
                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between gap-2 px-3 py-1.5 ${recording ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-800">{s.action}</p>
                      <p className="text-[12px] text-gray-400">
                        {recording
                          ? (conflict || (draftKeys.length ? 'Enter to save · Esc to cancel' : 'Press the new shortcut…'))
                          : s.customized ? 'Custom' : s.kind}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <KeyCaps keys={recording && draftKeys.length ? draftKeys : s.keys} sequence={s.sequence} />
                      {s.customized && !recording && (
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
                      <button
                        type="button"
                        title={recording ? 'Cancel' : 'Edit shortcut'}
                        className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-indigo-700"
                        onClick={() => (recording ? stopRecording() : startRecording(s.id))}
                      >
                        {recording ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type JumpItem = { label: string; path: string; group: string }

function flattenPages(): JumpItem[] {
  const out: JumpItem[] = []
  modules.forEach((mod) => {
    mod.subModules.forEach((sm) => {
      const sections = (sm.sidebarConfig || []).filter((s) => !s.hidden)
      if (sections.length === 0) {
        out.push({ label: sm.label, path: `/${mod.id}/${sm.id}/${sm.id}`, group: mod.label })
        return
      }
      sections.forEach((sec) => {
        sec.items.forEach((item) => {
          out.push({
            label: item.label,
            path: `/${mod.id}/${sm.id}/${item.id}`,
            group: `${mod.label} · ${sm.label}`,
          })
        })
      })
    })
  })
  return out
}

const ALL_PAGES = flattenPages()

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return el.isContentEditable
}

export function KeyboardShortcutsRuntime() {
  const navigate = useNavigate()
  const location = useLocation()
  const [enabled, setEnabled] = useState(isKeyboardShortcutsEnabled)
  const [bindings, setBindings] = useState<Record<string, string[]>>(loadBindings)
  const [jumpOpen, setJumpOpen] = useState(false)
  const [jumpQuery, setJumpQuery] = useState('')
  const [jumpIndex, setJumpIndex] = useState(0)
  const [goHint, setGoHint] = useState('')
  const goRef = useRef<string[]>([])
  const goTimer = useRef<number | null>(null)
  const jumpInput = useRef<HTMLInputElement>(null)
  const locationRef = useRef(location.pathname)
  locationRef.current = location.pathname

  const resolved = useMemo(
    () => ALL_SHORTCUTS.map((s) => ({ ...s, keys: bindings[s.id] || s.keys })),
    [bindings],
  )
  const keysOf = (id: string) => resolved.find((s) => s.id === id)?.keys || []

  useEffect(() => {
    const syncEnabled = () => setEnabled(isKeyboardShortcutsEnabled())
    const syncBindings = () => setBindings(loadBindings())
    window.addEventListener('k12-shortcuts-changed', syncEnabled)
    window.addEventListener('k12-shortcut-bindings-changed', syncBindings)
    window.addEventListener('storage', syncEnabled)
    window.addEventListener('storage', syncBindings)
    return () => {
      window.removeEventListener('k12-shortcuts-changed', syncEnabled)
      window.removeEventListener('k12-shortcut-bindings-changed', syncBindings)
      window.removeEventListener('storage', syncEnabled)
      window.removeEventListener('storage', syncBindings)
    }
  }, [])

  const results = useMemo(() => {
    const q = jumpQuery.trim().toLowerCase()
    if (!q) return ALL_PAGES.slice(0, 50)
    return ALL_PAGES.filter((p) =>
      p.label.toLowerCase().includes(q) || p.group.toLowerCase().includes(q),
    ).slice(0, 50)
  }, [jumpQuery])

  useEffect(() => { setJumpIndex(0) }, [jumpQuery, jumpOpen])
  useEffect(() => {
    if (jumpOpen) window.setTimeout(() => jumpInput.current?.focus(), 0)
  }, [jumpOpen])

  const clearGo = () => {
    goRef.current = []
    setGoHint('')
    if (goTimer.current) {
      window.clearTimeout(goTimer.current)
      goTimer.current = null
    }
  }

  useEffect(() => {
    if (!enabled) {
      setJumpOpen(false)
      clearGo()
      return
    }

    const moduleByLetter = (letter: string) =>
      modules.find((m) => {
        const keys = keysOf(`mod-${m.id}`)
        const last = (keys[keys.length - 1] || MODULE_LETTER[m.id] || '').toUpperCase()
        return last === letter
      })

    const runGo = (keys: string[], target: 'self' | 'tab' | 'window' = 'self') => {
      const letter = keys[1]?.toUpperCase()
      const digit = keys[2]
      const mod = moduleByLetter(letter || '')
      if (!mod) return
      const path = digit
        ? (() => {
          const sm = mod.subModules[Number(digit) - 1]
          return sm ? subPath(mod, sm) : ''
        })()
        : modulePath(mod)
      if (path) openAppPath(path, target, navigate)
    }

    const matchChord = (id: string, e: KeyboardEvent) => {
      const keys = keysOf(id)
      const chord = eventToKeys(e)
      return Boolean(keys.length && chord && keysEqual(keys, chord))
    }

    const lastGoKey = (id: string) => {
      const keys = keysOf(id)
      return (keys[keys.length - 1] || '').toUpperCase()
    }

    const onKey = (e: KeyboardEvent) => {
      if (shortcutCaptureActive) return
      if (e.repeat) return

      if (matchChord('jump', e)) {
        e.preventDefault()
        setJumpOpen((v) => !v)
        setJumpQuery('')
        clearGo()
        return
      }

      if (jumpOpen) {
        if (matchChord('cancel', e) || e.key === 'Escape') {
          e.preventDefault()
          setJumpOpen(false)
          return
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setJumpIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)))
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setJumpIndex((i) => Math.max(0, i - 1))
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const item = results[jumpIndex]
          if (!item) return
          const target = (e.ctrlKey || e.metaKey) && e.shiftKey
            ? 'window'
            : (e.ctrlKey || e.metaKey)
              ? 'tab'
              : matchChord('jump-window', e)
                ? 'window'
                : matchChord('jump-tab', e)
                  ? 'tab'
                  : 'self'
          const forced = matchChord('jump-window', e) ? 'window' : matchChord('jump-tab', e) ? 'tab' : target
          openAppPath(item.path, forced, navigate)
          setJumpOpen(false)
          setJumpQuery('')
        }
        return
      }

      const chordNow = eventToKeys(e)
      if (chordNow && (e.ctrlKey || e.metaKey || e.altKey) && goRef.current.length === 0) {
        for (const s of resolved) {
          if (!keysEqual(s.keys, chordNow)) continue
          if (s.id.startsWith('mod-')) {
            e.preventDefault()
            const mod = modules.find((m) => m.id === s.id.slice(4))
            if (mod) openAppPath(modulePath(mod), 'self', navigate)
            return
          }
          if (s.id.startsWith('sub-')) {
            e.preventDefault()
            for (const mod of modules) {
              const prefix = `sub-${mod.id}-`
              if (!s.id.startsWith(prefix)) continue
              const sm = mod.subModules.find((x) => x.id === s.id.slice(prefix.length))
              if (sm) openAppPath(subPath(mod, sm), 'self', navigate)
              break
            }
            return
          }
        }
      }

      if (matchChord('open-page-tab', e)) {
        e.preventDefault()
        openAppPath(locationRef.current, 'tab')
        return
      }
      if (matchChord('open-page-window', e)) {
        e.preventDefault()
        openAppPath(locationRef.current, 'window')
        return
      }

      if (isTypingTarget(e.target)) return

      if (matchChord('cancel', e) || e.key === 'Escape') {
        clearGo()
        return
      }

      const goStart = keysOf('go')
      const goStartKey = (goStart[goStart.length - 1] || 'G').toLowerCase()
      const goIsChord = goStart.some((k) => k === 'Ctrl' || k === 'Alt')

      if (goIsChord && matchChord('go', e)) {
        e.preventDefault()
        goRef.current = ['G']
        setGoHint('Go — D Dashboard · S Student · A Academic · F Finance · H HR · E Assessment · T Admin · M More · Y My Details · P Plugins · T new tab · W new window')
        if (goTimer.current) window.clearTimeout(goTimer.current)
        goTimer.current = window.setTimeout(() => clearGo(), 1600)
        return
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (!goIsChord && (e.key.toLowerCase() === goStartKey) && goRef.current.length === 0) {
        e.preventDefault()
        goRef.current = ['G']
        setGoHint('Go — D Dashboard · S Student · A Academic · F Finance · H HR · E Assessment · T Admin · M More · Y My Details · P Plugins · T new tab · W new window')
        if (goTimer.current) window.clearTimeout(goTimer.current)
        goTimer.current = window.setTimeout(() => clearGo(), 1600)
        return
      }

      if (goRef.current[0] !== 'G') return
      e.preventDefault()
      const tabKey = lastGoKey('go-tab') || 'T'
      const winKey = lastGoKey('go-window') || 'W'
      const pressed = e.key.toUpperCase()

      if ((pressed === tabKey || pressed === winKey) && goRef.current.length >= 2) {
        runGo(goRef.current, pressed === winKey ? 'window' : 'tab')
        clearGo()
        return
      }

      if (/^[a-zA-Z]$/.test(e.key) && goRef.current.length === 1) {
        const letter = e.key.toUpperCase()
        goRef.current = ['G', letter]
        const mod = moduleByLetter(letter)
        setGoHint(mod
          ? `Go ${mod.label} — 1–9 submodule · ${tabKey} new tab · ${winKey} new window`
          : 'Unknown module letter — try D S A F H E T M Y P')
        if (goTimer.current) window.clearTimeout(goTimer.current)
        goTimer.current = window.setTimeout(() => {
          if (goRef.current.length === 2) runGo(goRef.current)
          clearGo()
        }, 750)
        return
      }
      if (/^[1-9]$/.test(e.key) && goRef.current.length === 2) {
        goRef.current = [...goRef.current, e.key]
        setGoHint(`Submodule ${e.key} — ${tabKey} new tab · ${winKey} new window · or wait to open here`)
        if (goTimer.current) window.clearTimeout(goTimer.current)
        goTimer.current = window.setTimeout(() => {
          if (goRef.current.length === 3) runGo(goRef.current)
          clearGo()
        }, 750)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, jumpOpen, jumpIndex, results, navigate, resolved])

  if (!enabled) return null

  return (
    <>
      {goHint && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-center text-sm text-white shadow-lg">
          {goHint}
        </div>
      )}
      {jumpOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
          onClick={() => setJumpOpen(false)}
        >
          <div
            className="flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 border-b px-3 py-2">
              <input
                ref={jumpInput}
                value={jumpQuery}
                onChange={(e) => setJumpQuery(e.target.value)}
                placeholder="Jump to a page…"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[13px] text-gray-500">
                Enter opens here · Ctrl+Enter new tab · Ctrl+Shift+Enter new window
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-scroll">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-gray-500">No matching pages</p>
              )}
              {results.map((p, i) => (
                <div
                  key={`${p.path}-${p.label}`}
                  className={`flex items-center gap-2 px-3 py-2 ${i === jumpIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onMouseEnter={() => setJumpIndex(i)}
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => { openAppPath(p.path, 'self', navigate); setJumpOpen(false) }}
                  >
                    <span className="block text-sm font-medium text-gray-900">{p.label}</span>
                    <span className="block text-[13px] text-gray-500">{p.group}</span>
                  </button>
                  <button
                    type="button"
                    title="Open in new tab"
                    className="rounded p-1 text-gray-400 hover:bg-white hover:text-indigo-600"
                    onClick={() => { openAppPath(p.path, 'tab'); setJumpOpen(false) }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Open in new window"
                    className="rounded p-1 text-gray-400 hover:bg-white hover:text-indigo-600"
                    onClick={() => { openAppPath(p.path, 'window'); setJumpOpen(false) }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function MyDisplayLanguage() {
  const [preferences, setPreferences] = useState<DisplayPreferences>(() => ({
    ...INITIAL_PREFERENCES,
    keyboardShortcuts: isKeyboardShortcutsEnabled(),
  }))
  const [originalPreferences] = useState<DisplayPreferences>(() => ({
    ...INITIAL_PREFERENCES,
    keyboardShortcuts: isKeyboardShortcutsEnabled(),
  }))
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)
  const [shortcutQuery, setShortcutQuery] = useState('')
  const [shortcutBindings, setShortcutBindings] = useState<Record<string, string[]>>(loadBindings)

  const persistBindings = (next: Record<string, string[]>) => {
    setShortcutBindings(next)
    saveBindings(next)
  }

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'language', 'landing', 'regional', 'display', 'accessibility', 'behavior',
  ])

  const [changeHistory] = useState([
    { id: 1, date: '2024-02-15 10:30 AM', setting: 'Language', from: 'English', to: 'Hindi' },
    { id: 2, date: '2024-02-14 03:45 PM', setting: 'Time Format', from: '24-hour', to: '12-hour' },
    { id: 3, date: '2024-02-10 02:00 PM', setting: 'Date Format', from: 'MM/DD/YYYY', to: 'DD/MM/YYYY' },
    { id: 4, date: '2024-02-08 11:20 AM', setting: 'Landing Page', from: 'Inbox', to: LANDING_PAGES[0]?.label || 'User Dashboard' },
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
    if (!preferences.keyboardShortcuts) return
    const onKey = (e: KeyboardEvent) => {
      if (shortcutCaptureActive) return
      const chord = eventToKeys(e)
      if (!chord) return
      const saveKeys = shortcutBindings.save || ['Ctrl', 'S']
      const previewKeys = shortcutBindings.preview || ['Ctrl', 'P']
      if (keysEqual(chord, saveKeys)) {
        e.preventDefault()
        void handleSave()
      }
      if (keysEqual(chord, previewKeys)) {
        e.preventDefault()
        setShowPreviewModal(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preferences.keyboardShortcuts, shortcutBindings])

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
    setKeyboardShortcutsEnabled(INITIAL_PREFERENCES.keyboardShortcuts)
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
          setKeyboardShortcutsEnabled(!!next.keyboardShortcuts)
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

  const selectedLanguage = LANGUAGES.find((l) => l.value === preferences.language)
  const selectedLandingPage = LANDING_PAGES.find((p) => p.value === preferences.landingPage) || LANDING_PAGES[0]
  const selectedTimezone = TIMEZONES.find((t) => t.value === preferences.timezone)
  const selectedCurrency = CURRENCIES.find((c) => c.value === preferences.currency)

  const sectionProps = { expandedSections, toggleSection }

  return (
    <div className="space-y-3">

      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Display & Language</h1>
          <p className="text-sm text-gray-500">
            Language, landing page, regional formats, and keyboard shortcuts
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(true)}>
            <Eye className="mr-1 h-3.5 w-3.5" /> Preview
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
            <History className="mr-1 h-3.5 w-3.5" /> History
          </Button>
          {preferences.keyboardShortcuts && (
            <Button variant="outline" size="sm" onClick={() => setShowShortcutsModal(true)}>
              <Keyboard className="mr-1 h-3.5 w-3.5" /> Shortcuts
            </Button>
          )}
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

      <div className={`grid grid-cols-1 items-start gap-3 ${preferences.keyboardShortcuts ? 'xl:grid-cols-12' : ''}`}>
        <div className={`space-y-3 ${preferences.keyboardShortcuts ? 'xl:col-span-8' : ''}`}>

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
                    <p className="text-base font-medium text-gray-900">Keyboard Shortcuts</p>
                    <p className="text-[13px] text-gray-500">Enable shortcuts to open any module, submodule or page</p>
                  </div>
                  <ToggleSwitch
                    enabled={preferences.keyboardShortcuts}
                    onToggle={() => {
                      const next = !preferences.keyboardShortcuts
                      updatePreference('keyboardShortcuts', next)
                      setKeyboardShortcutsEnabled(next)
                      if (!next) setShowShortcutsModal(false)
                    }}
                    color="bg-indigo-500"
                  />
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

        {preferences.keyboardShortcuts && (
          <div className="min-h-0 xl:sticky xl:top-3 xl:col-span-4">
            <div className="h-[calc(100vh-6.5rem)] min-h-[20rem]">
              <ShortcutsPanel
                enabled={preferences.keyboardShortcuts}
                query={shortcutQuery}
                onQuery={setShortcutQuery}
                shortcuts={ALL_SHORTCUTS}
                bindings={shortcutBindings}
                onChangeBindings={persistBindings}
              />
            </div>
          </div>
        )}
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

      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Eye className="h-5 w-5 text-blue-600" /> Preview Your Settings
              </h2>
              <button type="button" onClick={() => setShowPreviewModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Language', value: `${selectedLanguage?.flag} ${selectedLanguage?.label}` },
                  { label: 'Landing Page', value: selectedLandingPage?.label },
                  { label: 'Date Format', value: currentDate },
                  { label: 'Time Format', value: currentTime },
                  { label: 'Timezone', value: selectedTimezone?.label },
                  { label: 'Currency', value: selectedCurrency?.label },
                  { label: 'Font Size', value: preferences.fontSize },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-md bg-gray-50 p-2.5">
                    <p className="mb-0.5 text-[13px] text-gray-500">{label}</p>
                    <p className="text-base font-semibold capitalize text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-gray-50 p-2.5">
                <p className="mb-1.5 text-[13px] text-gray-500">Active Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {preferences.highContrast && <Badge variant="info">High Contrast</Badge>}
                  {preferences.keyboardShortcuts && <Badge variant="info">Keyboard Shortcuts</Badge>}
                  {preferences.autoSave && <Badge variant="success">Auto-Save</Badge>}
                  {preferences.showWelcomeMessage && <Badge variant="default">Welcome Message</Badge>}
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t p-3">
              <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <History className="h-5 w-5 text-blue-600" /> Change History
              </h2>
              <button type="button" onClick={() => setShowHistoryModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {changeHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-md bg-gray-50 p-2.5">
                    <div className="rounded-md border border-gray-200 bg-white p-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900">{entry.setting}</p>
                      <p className="text-sm text-gray-600">{entry.from} → {entry.to}</p>
                      <p className="mt-0.5 text-[13px] text-gray-400">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t p-3">
              <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showShortcutsModal && preferences.keyboardShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Keyboard className="h-5 w-5 text-blue-600" /> All Keyboard Shortcuts
              </h2>
              <button type="button" onClick={() => setShowShortcutsModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 p-3">
              <div className="h-[70vh]">
                <ShortcutsPanel
                  enabled={preferences.keyboardShortcuts}
                  query={shortcutQuery}
                  onQuery={setShortcutQuery}
                  shortcuts={ALL_SHORTCUTS}
                  bindings={shortcutBindings}
                  onChangeBindings={persistBindings}
                />
              </div>
            </div>
            <div className="flex justify-end border-t p-3">
              <Button variant="outline" size="sm" onClick={() => setShowShortcutsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyDisplayLanguage
