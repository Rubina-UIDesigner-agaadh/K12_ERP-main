import React, {
  useEffect,
  useMemo,
  useState,
  Fragment,
} from 'react'
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
  Sun,
  Moon,
  Laptop,
  Palette,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  History,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

interface DisplayPreferences {
  language: string
  landingPage: string
  dateFormat: string
  timeFormat: '12' | '24'
  timezone: string
  currency: string
  numberFormat: string
  fontSize: 'small' | 'medium' | 'large'
  theme: 'light' | 'dark' | 'system'
  highContrast: boolean
  compactMode: boolean
  showWelcomeMessage: boolean
  autoSave: boolean
  keyboardShortcuts: boolean
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

const LANDING_PAGES = [
  { value: 'dashboard', label: 'Dashboard', description: 'Overview of your activities and updates' },
  { value: 'inbox', label: 'My Inbox', description: 'Messages and notifications center' },
  { value: 'calendar', label: 'Academic Calendar', description: 'View schedules and events' },
  { value: 'announcements', label: 'Announcements', description: 'Latest news and updates' },
  { value: 'tasks', label: 'My Tasks', description: 'Pending tasks and to-dos' },
  { value: 'attendance', label: 'Attendance', description: 'Attendance records and history' },
  { value: 'profile', label: 'My Profile', description: 'Your personal information' },
  { value: 'policies', label: 'Policies', description: 'View and acknowledge policies' },
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

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Light background with dark text' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark background with light text' },
  { value: 'system', label: 'System', icon: Laptop, description: 'Follow system preferences' },
]

const INITIAL_PREFERENCES: DisplayPreferences = {
  language: 'en',
  landingPage: 'dashboard',
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '12',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  numberFormat: 'indian',
  fontSize: 'medium',
  theme: 'light',
  highContrast: false,
  compactMode: false,
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
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? color : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${enabled ? 'translate-x-6' : ''}`}
      />
    </button>
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
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconColor} rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {isOpen
        ? <ChevronUp className="w-5 h-5 text-gray-500" />
        : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  )
}

export function MyDisplayLanguage() {
  const [preferences, setPreferences] = useState<DisplayPreferences>(INITIAL_PREFERENCES)
  const [originalPreferences] = useState<DisplayPreferences>(INITIAL_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'language', 'landing', 'regional', 'display', 'accessibility', 'behavior',
  ])

  const [changeHistory] = useState([
    { id: 1, date: '2024-02-15 10:30 AM', setting: 'Language', from: 'English', to: 'Hindi' },
    { id: 2, date: '2024-02-14 03:45 PM', setting: 'Time Format', from: '24-hour', to: '12-hour' },
    { id: 3, date: '2024-02-12 09:15 AM', setting: 'Theme', from: 'Dark', to: 'Light' },
    { id: 4, date: '2024-02-10 02:00 PM', setting: 'Date Format', from: 'MM/DD/YYYY', to: 'DD/MM/YYYY' },
    { id: 5, date: '2024-02-08 11:20 AM', setting: 'Landing Page', from: 'Inbox', to: 'Dashboard' },
  ])

  const keyboardShortcuts = [
    { keys: ['Ctrl', 'S'], action: 'Save preferences' },
    { keys: ['Ctrl', 'Z'], action: 'Undo last change' },
    { keys: ['Ctrl', 'Shift', 'R'], action: 'Reset to defaults' },
    { keys: ['Ctrl', 'P'], action: 'Preview changes' },
    { keys: ['Ctrl', 'E'], action: 'Export preferences' },
    { keys: ['Ctrl', 'I'], action: 'Import preferences' },
    { keys: ['Ctrl', '+'], action: 'Increase font size' },
    { keys: ['Ctrl', '-'], action: 'Decrease font size' },
    { keys: ['Ctrl', 'D'], action: 'Toggle dark mode' },
  ]

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
          setPreferences(data.preferences)
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

  const selectedLanguage   = LANGUAGES.find((l) => l.value === preferences.language)
  const selectedLandingPage = LANDING_PAGES.find((p) => p.value === preferences.landingPage)
  const selectedTimezone   = TIMEZONES.find((t) => t.value === preferences.timezone)
  const selectedCurrency   = CURRENCIES.find((c) => c.value === preferences.currency)

  const sectionProps = { expandedSections, toggleSection }

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Display & Language</h1>
          <p className="text-sm text-gray-500">
            Customize your interface language, regional formats, and display preferences
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(true)}>
            <Eye className="w-4 h-4 mr-1" /> Preview
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
            <History className="w-4 h-4 mr-1" /> History
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowShortcutsModal(true)}>
            <Keyboard className="w-4 h-4 mr-1" /> Shortcuts
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">Preferences saved successfully!</p>
        </div>
      )}

      {hasChanges && !preferences.autoSave && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <p className="text-yellow-700 flex-1">You have unsaved changes</p>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? 'Saving…' : 'Save Now'}
          </Button>
        </div>
      )}

      {preferences.autoSave && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
          <RefreshCw className="w-4 h-4" />
          <span>Auto-save is enabled. Changes will be saved automatically.</span>
        </div>
      )}

      <div className="max-w-4xl space-y-4">

        <Card className="overflow-hidden">
          <SectionHeader
            title="Interface Language"
            icon={Globe}
            section="language"
            iconColor="bg-blue-100 text-blue-600"
            {...sectionProps}
          />
          {expandedSections.includes('language') && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => updatePreference('language', lang.value)}
                    className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${
                      preferences.language === lang.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{lang.label}</p>
                      <p className="text-sm text-gray-500">{lang.native}</p>
                    </div>
                    {preferences.language === lang.value && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Some administrative content, system messages, and technical terms may remain
                  in English regardless of your language selection.
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader
            title="Default Landing Page"
            icon={Layout}
            section="landing"
            iconColor="bg-purple-100 text-purple-600"
            {...sectionProps}
          />
          {expandedSections.includes('landing') && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LANDING_PAGES.map((page) => (
                  <button
                    key={page.value}
                    onClick={() => updatePreference('landingPage', page.value)}
                    className={`flex items-start gap-4 p-4 border rounded-xl transition-all text-left ${
                      preferences.landingPage === page.value
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{page.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                    </div>
                    {preferences.landingPage === page.value && (
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader
            title="Regional Formats"
            icon={Clock}
            section="regional"
            iconColor="bg-orange-100 text-orange-600"
            {...sectionProps}
          />
          {expandedSections.includes('regional') && (
            <div className="p-6 space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATE_FORMATS.map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => updatePreference('dateFormat', fmt.value)}
                      className={`p-3 border rounded-lg transition-all text-left ${
                        preferences.dateFormat === fmt.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{fmt.label}</p>
                      <p className="text-sm text-gray-500">{fmt.example}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time Format
                </label>
                <div className="flex gap-4">
                  {(['12', '24'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => updatePreference('timeFormat', fmt)}
                      className={`flex-1 p-4 border rounded-xl transition-all ${
                        preferences.timeFormat === fmt
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{fmt}-hour</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {fmt === '12' ? '2:30 PM' : '14:30'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => updatePreference('timezone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} (UTC{tz.offset})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Currency Display
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => updatePreference('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Number Format
                  </label>
                  <select
                    value={preferences.numberFormat}
                    onChange={(e) => updatePreference('numberFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    {NUMBER_FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

        <Card className="overflow-hidden">
          <SectionHeader
            title="Display Settings"
            icon={Monitor}
            section="display"
            iconColor="bg-green-100 text-green-600"
            {...sectionProps}
          />
          {expandedSections.includes('display') && (
            <div className="p-6 space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updatePreference('theme', theme.value as DisplayPreferences['theme'])}
                      className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all ${
                        preferences.theme === theme.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className={`p-3 rounded-full ${
                        theme.value === 'light' ? 'bg-yellow-100'
                        : theme.value === 'dark' ? 'bg-gray-800'
                        : 'bg-gray-100'
                      }`}>
                        <theme.icon className={`w-6 h-6 ${theme.value === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{theme.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Font Size
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updatePreference('fontSize', size.value as DisplayPreferences['fontSize'])}
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                        preferences.fontSize === size.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div>
                        <p className={`font-medium text-gray-900 ${
                          size.value === 'small' ? 'text-sm' : size.value === 'large' ? 'text-lg' : ''
                        }`}>
                          {size.label}
                        </p>
                        <p className="text-xs text-gray-500">{size.description}</p>
                      </div>
                      {size.value === 'small'
                        ? <ZoomOut className="w-5 h-5 text-gray-400" />
                        : size.value === 'large'
                        ? <ZoomIn className="w-5 h-5 text-gray-400" />
                        : <Type className="w-5 h-5 text-gray-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Compact Mode</p>
                  <p className="text-sm text-gray-500">Reduce spacing and padding for more content density</p>
                </div>
                <ToggleSwitch
                  enabled={preferences.compactMode}
                  onToggle={() => updatePreference('compactMode', !preferences.compactMode)}
                  color="bg-green-500"
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader
            title="Accessibility"
            icon={Eye}
            section="accessibility"
            iconColor="bg-indigo-100 text-indigo-600"
            {...sectionProps}
          />
          {expandedSections.includes('accessibility') && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">High Contrast</p>
                  <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                </div>
                <ToggleSwitch
                  enabled={preferences.highContrast}
                  onToggle={() => updatePreference('highContrast', !preferences.highContrast)}
                  color="bg-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Keyboard Shortcuts</p>
                  <p className="text-sm text-gray-500">Enable keyboard navigation and shortcuts</p>
                </div>
                <ToggleSwitch
                  enabled={preferences.keyboardShortcuts}
                  onToggle={() => updatePreference('keyboardShortcuts', !preferences.keyboardShortcuts)}
                  color="bg-indigo-500"
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader
            title="Behavior"
            icon={Settings}
            section="behavior"
            iconColor="bg-red-100 text-red-600"
            {...sectionProps}
          />
          {expandedSections.includes('behavior') && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Show Welcome Message</p>
                  <p className="text-sm text-gray-500">Display greeting on login</p>
                </div>
                <ToggleSwitch
                  enabled={preferences.showWelcomeMessage}
                  onToggle={() => updatePreference('showWelcomeMessage', !preferences.showWelcomeMessage)}
                  color="bg-red-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Save Changes</p>
                    <p className="text-sm text-gray-500">Automatically save preferences after changes</p>
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

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
              <label className="cursor-pointer">
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                <span className="inline-flex items-center justify-center font-medium rounded-lg transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-sm gap-1.5">
                  <Upload className="w-4 h-4 mr-1" /> Import
                </span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && !preferences.autoSave && (
                <span className="text-sm text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Unsaved changes
                </span>
              )}
              <Button variant="outline" onClick={() => setShowResetModal(true)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset to Defaults
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={!hasChanges || saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving…' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <RotateCcw className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reset to Defaults</h2>
            </div>
            <p className="text-gray-600 mb-6">
              This will reset all display and language preferences to their default values.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowResetModal(false)}>Cancel</Button>
              <Button variant="warning" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset All
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-600" /> Preview Your Settings
              </h2>
              <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Language', value: `${selectedLanguage?.flag} ${selectedLanguage?.label}` },
                  { label: 'Landing Page', value: selectedLandingPage?.label },
                  { label: 'Date Format', value: currentDate },
                  { label: 'Time Format', value: currentTime },
                  { label: 'Timezone', value: selectedTimezone?.label },
                  { label: 'Currency', value: selectedCurrency?.label },
                  { label: 'Theme', value: preferences.theme },
                  { label: 'Font Size', value: preferences.fontSize },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="font-semibold text-gray-900 capitalize">{value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Active Features</p>
                <div className="flex flex-wrap gap-2">
                  {preferences.compactMode    && <Badge variant="info">Compact Mode</Badge>}
                  {preferences.highContrast   && <Badge variant="info">High Contrast</Badge>}
                  {preferences.keyboardShortcuts && <Badge variant="info">Keyboard Shortcuts</Badge>}
                  {preferences.autoSave       && <Badge variant="success">Auto-Save</Badge>}
                  {preferences.showWelcomeMessage && <Badge variant="default">Welcome Message</Badge>}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <History className="w-6 h-6 text-blue-600" /> Change History
              </h2>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {changeHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.setting}</p>
                      <p className="text-sm text-gray-600">{entry.from} → {entry.to}</p>
                      <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <Button variant="outline" onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-blue-600" /> Keyboard Shortcuts
              </h2>
              <button onClick={() => setShowShortcutsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">{shortcut.action}</span>
                    <div className="flex gap-1 items-center">
                      {shortcut.keys.map((key, j) => (
                        <Fragment key={j}>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono text-gray-700">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span className="text-gray-400">+</span>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <Button variant="outline" onClick={() => setShowShortcutsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyDisplayLanguage
