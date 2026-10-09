// src/pages/admin/masters/FeeStructure.tsx

import React, { useState, useRef } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import { Modal } from '../../../components/ui/Modal'
import {
  Search,
  Plus,
  Building,
  Edit,
  Trash2,
  RefreshCw,
  Layers,
  Upload,
  X,
  FileText,
  Paperclip,
  DollarSign,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Power,
  Eye,
} from 'lucide-react'

// ===================== Fee Structure types =====================

interface FeeStructureRecord {
  id: string
  feeTitle: string
  feeHead: string
  masterFranchise: string
  centre: string
  batch: string
  class: string
  term: string
  amount: number
  kitAmount: number
  shareType: string
  businessShare: string
  mfShare: string
  centreShare: string
  status: 'Active' | 'Inactive'
  attachments: AttachmentFile[]
}

interface AttachmentFile {
  file: File
  id: string
  name: string
  size: string
}

const INITIAL_FEE_STRUCTURES: FeeStructureRecord[] = [
  {
    id: '1',
    feeTitle: 'Class 10 Tuition Fee - Term 1',
    feeHead: 'Tuition Fee',
    masterFranchise: 'Main Campus',
    centre: 'Main Campus',
    batch: 'Morning',
    class: '10',
    term: 'Term 1',
    amount: 25000,
    kitAmount: 0,
    shareType: 'Percentage',
    businessShare: '',
    mfShare: '',
    centreShare: '',
    status: 'Active',
    attachments: [],
  },
  {
    id: '2',
    feeTitle: 'Class 10 Transport Fee - Term 1',
    feeHead: 'Transport Fee',
    masterFranchise: 'Main Campus',
    centre: 'Main Campus',
    batch: 'Morning',
    class: '10',
    term: 'Term 1',
    amount: 10000,
    kitAmount: 0,
    shareType: 'Percentage',
    businessShare: '',
    mfShare: '',
    centreShare: '',
    status: 'Active',
    attachments: [],
  },
  {
    id: '3',
    feeTitle: 'Class 9 Tuition Fee - Term 1',
    feeHead: 'Tuition Fee',
    masterFranchise: 'Main Campus',
    centre: 'North Campus',
    batch: 'Morning',
    class: '9',
    term: 'Term 1',
    amount: 22000,
    kitAmount: 0,
    shareType: 'Percentage',
    businessShare: '',
    mfShare: '',
    centreShare: '',
    status: 'Active',
    attachments: [],
  },
]

// ===================== Fee Head types =====================

interface FeeHead {
  id: number
  name: string
  type: string
  account: string
  taxable: boolean
  description: string
  gstPercentage: number
  isActive: boolean
  applicableTo: string
  masterFranchise: string
  branch: string
  class: string
}

type FeeTab = 'structures' | 'feeHeads'

const EMPTY_FEE_HEAD_FORM: Omit<FeeHead, 'id'> = {
  name: '',
  type: 'Recurring',
  account: '',
  taxable: false,
  description: '',
  gstPercentage: 0,
  isActive: true,
  applicableTo: '',
  masterFranchise: '',
  branch: '',
  class: '',
}

// ===================== Bulk creation grid (class-wise) =====================

interface GridRow {
  key: string
  masterFranchises: string[]
  centres: string[]
  classes: string[]
  batches: string[]
  term: string
  feeHeadIds: string[]
  headAmounts: Record<string, string>
  feeTitle: string
  kitAmount: string
  shareType: string
  businessShare: string
  mfShare: string
  centreShare: string
  attachments: AttachmentFile[]
  expanded: boolean
}

type MultiSelectField =
  | 'masterFranchises'
  | 'centres'
  | 'classes'
  | 'batches'
  | 'feeHeadIds'

type GridRowStringField =
  | 'term'
  | 'feeTitle'
  | 'kitAmount'
  | 'shareType'
  | 'businessShare'
  | 'mfShare'
  | 'centreShare'

const blankGridRow = (): GridRow => ({
  key: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  masterFranchises: ['Main Campus'],
  centres: [],
  classes: [],
  batches: [],
  term: '',
  feeHeadIds: [],
  headAmounts: {},
  feeTitle: '',
  kitAmount: '',
  shareType: 'Percentage',
  businessShare: '',
  mfShare: '',
  centreShare: '',
  attachments: [],
  expanded: false,
})

const STRUCTURE_TERM_OPTIONS = [
  { value: '', label: 'Term' },
  { value: 'Term 1', label: 'Term 1' },
  { value: 'Term 2', label: 'Term 2' },
  { value: 'Term 3', label: 'Term 3' },
  { value: 'Annual', label: 'Annual' },
]

// Multi-select options for the grid
const MF_MULTI_OPTIONS = [{ value: 'Main Campus', label: 'Main Campus' }]

const CENTRE_MULTI_OPTIONS = [
  { value: 'Main Campus', label: 'Main Campus' },
  { value: 'North Campus', label: 'North Campus' },
]

const CLASS_MULTI_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}))

const BATCH_MULTI_OPTIONS = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
]

const labelFrom =
  (opts: { value: string; label: string }[]) =>
  (v: string): string =>
    opts.find((o) => o.value === v)?.label ?? v

// Fee head scoping options (fee head form)
const HEAD_MF_OPTIONS = [
  { value: '', label: 'All MFs' },
  { value: 'Main Campus', label: 'Main Campus' },
]

const HEAD_BRANCH_OPTIONS = [
  { value: '', label: 'All Branches' },
  { value: 'Main Campus', label: 'Main Campus' },
  { value: 'North Campus', label: 'North Campus' },
]

const HEAD_CLASS_OPTIONS = [
  { value: '', label: 'All Classes' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `Class ${i + 1}`,
  })),
]

export function FeeStructure() {
  // ---------- Active tab ----------
  const [activeTab, setActiveTab] = useState<FeeTab>('structures')

  // ---------- Fee Structure list state ----------
  const [feeStructures, setFeeStructures] = useState<FeeStructureRecord[]>(
    INITIAL_FEE_STRUCTURES
  )
  const [filters, setFilters] = useState({
    masterFranchise: '',
    centre: '',
    batch: '',
    term: '',
  })

  // ---------- Combined panel (bulk grid) state ----------
  const [isStructurePanelOpen, setIsStructurePanelOpen] = useState(false)
  const [editingStructureId, setEditingStructureId] = useState<string | null>(
    null
  )
  const [gridRows, setGridRows] = useState<GridRow[]>([blankGridRow()])
  const [headDraft, setHeadDraft] = useState<Omit<FeeHead, 'id'> | null>(null)
  const [headDraftRowKey, setHeadDraftRowKey] = useState<string | null>(null)
  const [editingHeadId, setEditingHeadId] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<{
    rowKey: string
    field: MultiSelectField
    // Viewport coordinates for the fixed-positioned options list (so it is
    // never clipped by the panel's scrollable body)
    top: number
    left: number
    width: number
  } | null>(null)
  const [dropdownSelection, setDropdownSelection] = useState<string[]>([])
  const [attachmentTargetKey, setAttachmentTargetKey] = useState<string | null>(
    null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---------- Fee Head state ----------
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([
    {
      id: 1,
      name: 'Tuition Fee',
      type: 'Recurring',
      account: 'INC-001',
      taxable: false,
      description: 'Monthly tuition fee for academic sessions',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 2,
      name: 'Admission Fee',
      type: 'One-time',
      account: 'INC-002',
      taxable: true,
      description: 'One-time admission fee at the time of enrollment',
      gstPercentage: 18,
      isActive: true,
      applicableTo: 'New Admissions',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 3,
      name: 'Transport Fee',
      type: 'Recurring',
      account: 'INC-003',
      taxable: false,
      description: 'Monthly transport fee based on distance',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'Transport Users',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 4,
      name: 'Library Fine',
      type: 'Ad-hoc',
      account: 'INC-004',
      taxable: false,
      description: 'Fine for late return of library books',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 5,
      name: 'Exam Fee',
      type: 'Term-wise',
      account: 'INC-005',
      taxable: false,
      description: 'Examination fee charged per term',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 6,
      name: 'Lab Fee',
      type: 'Recurring',
      account: 'INC-006',
      taxable: true,
      description: 'Laboratory usage fee for science students',
      gstPercentage: 18,
      isActive: true,
      applicableTo: 'Science Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 7,
      name: 'Computer Fee',
      type: 'Recurring',
      account: 'INC-007',
      taxable: true,
      description: 'Computer lab access and maintenance fee',
      gstPercentage: 18,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 8,
      name: 'Sports Fee',
      type: 'Annual',
      account: 'INC-008',
      taxable: false,
      description: 'Annual sports and games fee',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 9,
      name: 'Development Fee',
      type: 'Annual',
      account: 'INC-009',
      taxable: false,
      description: 'Infrastructure development and maintenance',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 10,
      name: 'Late Fee Penalty',
      type: 'Ad-hoc',
      account: 'INC-010',
      taxable: false,
      description: 'Penalty for late fee payment',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'Defaulters',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 11,
      name: 'Registration Fee',
      type: 'One-time',
      account: 'INC-011',
      taxable: true,
      description: 'Initial registration fee for new students',
      gstPercentage: 18,
      isActive: true,
      applicableTo: 'New Admissions',
      masterFranchise: '',
      branch: '',
      class: '',
    },
    {
      id: 12,
      name: 'Hostel Fee',
      type: 'Recurring',
      account: 'INC-012',
      taxable: false,
      description: 'Monthly hostel accommodation fee',
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'Hostel Students',
      masterFranchise: '',
      branch: '',
      class: '',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTaxable, setSelectedTaxable] = useState('all')
  const [isFeeHeadViewModalOpen, setIsFeeHeadViewModalOpen] = useState(false)
  const [viewingFeeHead, setViewingFeeHead] = useState<FeeHead | null>(null)

  // Fee type options
  const feeTypeOptions = [
    'Recurring',
    'One-time',
    'Ad-hoc',
    'Term-wise',
    'Annual',
    'Quarterly',
  ]

  // ===================== Derived data =====================

  // Fee heads filtered for the Fee Heads tab
  const filteredFeeHeads = feeHeads.filter((feeHead) => {
    const matchesSearch =
      feeHead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feeHead.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feeHead.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || feeHead.type === selectedType
    const matchesTaxable =
      selectedTaxable === 'all' ||
      (selectedTaxable === 'yes' && feeHead.taxable) ||
      (selectedTaxable === 'no' && !feeHead.taxable)
    return matchesSearch && matchesType && matchesTaxable
  })

  // Fee structures filtered by the tab filters (live)
  const filteredStructures = feeStructures.filter(
    (s) =>
      (!filters.masterFranchise || s.masterFranchise === filters.masterFranchise) &&
      (!filters.centre || s.centre === filters.centre) &&
      (!filters.batch || s.batch === filters.batch) &&
      (!filters.term || s.term === filters.term)
  )

  // Does a fee head's scope match the row's selections? (blank scope = all)
  const headMatchesRow = (h: FeeHead, row: GridRow): boolean => {
    if (row.classes.length && h.class && !row.classes.includes(h.class))
      return false
    if (row.centres.length && h.branch && !row.centres.includes(h.branch))
      return false
    if (
      row.masterFranchises.length &&
      h.masterFranchise &&
      !row.masterFranchises.includes(h.masterFranchise)
    )
      return false
    return true
  }

  // Fee heads available for a grid row: active + matching the row's scope
  const headsForRow = (row: GridRow) =>
    feeHeads.filter((h) => h.isActive && headMatchesRow(h, row))

  const headOptionsForRow = (row: GridRow) =>
    headsForRow(row).map((h) => ({
      value: String(h.id),
      label: h.name,
      hint:
        [
          h.class && `Class ${h.class}`,
          h.branch,
          h.masterFranchise,
        ]
          .filter(Boolean)
          .join(' · ') || undefined,
    }))

  const headNameById = (v: string) =>
    feeHeads.find((h) => String(h.id) === v)?.name ?? v

  // Drop fee heads that no longer match the row's scope
  const pruneRowHeads = (row: GridRow): GridRow => ({
    ...row,
    feeHeadIds: row.feeHeadIds.filter((id) => {
      const h = feeHeads.find((fh) => String(fh.id) === id)
      return h ? headMatchesRow(h, row) : false
    }),
  })

  // Number of scope combinations a row expands into (per fee head)
  const scopeCountInRow = (r: GridRow) =>
    (r.masterFranchises.length || 1) *
    (r.centres.length || 1) *
    (r.batches.length || 1) *
    r.classes.length

  // Rows in the grid that carry data (used for the summary + save button)
  const filledPanelRows =
    editingStructureId !== null
      ? gridRows
      : gridRows.filter((r) => r.classes.length > 0 || r.feeHeadIds.length > 0)
  const panelStructureCount = filledPanelRows.reduce(
    (n, r) => n + scopeCountInRow(r) * r.feeHeadIds.length,
    0
  )
  const panelTotalAmount = filledPanelRows.reduce((sum, r) => {
    const headsTotal = r.feeHeadIds.reduce(
      (s, id) => s + (parseFloat(r.headAmounts[id] ?? '') || 0),
      0
    )
    const kit = parseFloat(r.kitAmount) || 0
    return sum + scopeCountInRow(r) * (headsTotal + kit)
  }, 0)

  // True when the panel was opened from the Fee Heads tab to edit a fee head
  const isHeadEditMode =
    editingHeadId !== null && headDraft !== null && headDraftRowKey === null

  const panelTitle = isHeadEditMode
    ? 'Edit Fee Head'
    : editingStructureId
    ? 'Edit Fee Structure'
    : 'Create Fee Structures'

  // ===================== Shared helpers =====================

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Generate next account code
  const generateAccountCode = () => {
    const maxCode = Math.max(
      ...feeHeads.map((f) => parseInt(f.account.split('-')[1]))
    )
    return `INC-${String(maxCode + 1).padStart(3, '0')}`
  }

  // Auto-generate a fee title like "Class 10 Tuition Fee - Term 1"
  const autoGenerateTitle = (
    className: string,
    headName: string,
    term: string
  ): string => {
    const left = [className ? `Class ${className}` : '', headName]
      .filter(Boolean)
      .join(' ')
    return term ? `${left} - ${term}` : left
  }

  const expandGridRow = (key: string) => {
    setGridRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, expanded: true } : r))
    )
  }

  // ===================== Fee Structure list handlers =====================

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
    }))
  }

  const handleDeleteStructure = (record: FeeStructureRecord) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${record.feeTitle}"? This action cannot be undone.`
      )
    ) {
      setFeeStructures((prev) => prev.filter((s) => s.id !== record.id))
    }
  }

  const handleEditStructure = (record: FeeStructureRecord) => {
    const head = feeHeads.find((h) => h.name === record.feeHead)
    const headId = head ? String(head.id) : ''
    const row: GridRow = {
      key: `row-edit-${record.id}`,
      masterFranchises: record.masterFranchise
        ? [record.masterFranchise]
        : [],
      centres: record.centre ? [record.centre] : [],
      classes: record.class ? [record.class] : [],
      batches: record.batch ? [record.batch] : [],
      term: record.term,
      feeHeadIds: headId ? [headId] : [],
      headAmounts: headId ? { [headId]: String(record.amount) } : {},
      feeTitle: record.feeTitle,
      kitAmount: record.kitAmount ? String(record.kitAmount) : '',
      shareType: record.shareType,
      businessShare: record.businessShare,
      mfShare: record.mfShare,
      centreShare: record.centreShare,
      attachments: [], // File objects cannot be restored from a saved record
      expanded: true,
    }
    setGridRows([row])
    setEditingStructureId(record.id)
    setIsStructurePanelOpen(true)
  }

  // ===================== Combined panel handlers =====================

  const openCreatePanel = () => {
    setEditingStructureId(null)
    setGridRows([blankGridRow()])
    setHeadDraft(null)
    setHeadDraftRowKey(null)
    setEditingHeadId(null)
    setOpenDropdown(null)
    setDropdownSelection([])
    setIsStructurePanelOpen(true)
  }

  const closePanel = () => {
    setIsStructurePanelOpen(false)
    setEditingStructureId(null)
    setGridRows([blankGridRow()])
    setHeadDraft(null)
    setHeadDraftRowKey(null)
    setEditingHeadId(null)
    setOpenDropdown(null)
    setDropdownSelection([])
    setAttachmentTargetKey(null)
  }

  const handleAddGridRow = () => {
    setGridRows((prev) => [...prev, blankGridRow()])
  }

  const handleRemoveGridRow = (key: string) => {
    setGridRows((prev) => prev.filter((r) => r.key !== key))
    if (headDraftRowKey === key) {
      setHeadDraft(null)
      setHeadDraftRowKey(null)
    }
    if (openDropdown?.rowKey === key) {
      setOpenDropdown(null)
      setDropdownSelection([])
    }
  }

  // Update a single-value string field on a row (term, title, shares…)
  const handleGridRowChange = (
    key: string,
    field: GridRowStringField,
    value: string
  ) => {
    setGridRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    )
  }

  const toggleRowExpanded = (key: string) => {
    setGridRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, expanded: !r.expanded } : r))
    )
  }

  // ---------- Generic multi-select (MF / Centre / Class / Batch / Fee Heads) ----------

  const openMultiSelect = (
    rowKey: string,
    field: MultiSelectField,
    anchor: HTMLElement
  ) => {
    if (
      openDropdown &&
      openDropdown.rowKey === rowKey &&
      openDropdown.field === field
    ) {
      applyDropdown()
      return
    }
    const row = gridRows.find((r) => r.key === rowKey)
    const current = row ? row[field] : []
    setDropdownSelection([...current])
    // Compute viewport coordinates for the dropdown. It is rendered with
    // `position: fixed`, so the panel's scrollable body (overflow-y-auto)
    // cannot clip it — it floats above everything inside the panel.
    const rect = anchor.getBoundingClientRect()
    const width = Math.max(field === 'feeHeadIds' ? 280 : 240, rect.width)
    const left = Math.min(
      Math.max(8, rect.left),
      Math.max(8, window.innerWidth - width - 8)
    )
    const estHeight = 300
    const top =
      rect.bottom + estHeight <= window.innerHeight
        ? rect.bottom + 6
        : Math.max(8, rect.top - estHeight - 6)
    setOpenDropdown({ rowKey, field, top, left, width })
  }

  const toggleDropdownOption = (value: string) => {
    setDropdownSelection((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    )
  }

  // Applies the checked options to the row's field. Changing scope fields
  // (class / centre / MF) prunes fee heads that no longer match.
  const applyDropdown = () => {
    if (!openDropdown) return
    const { rowKey, field } = openDropdown
    const selection = [...dropdownSelection]
    setOpenDropdown(null)
    setDropdownSelection([])
    setGridRows((prev) =>
      prev.map((r) => {
        if (r.key !== rowKey) return r
        const updated = { ...r, [field]: selection }
        if (
          field === 'classes' ||
          field === 'centres' ||
          field === 'masterFranchises'
        ) {
          return pruneRowHeads(updated)
        }
        return updated
      })
    )
  }

  // Remove a single chip from a multi-select field
  const removeItemFromRow = (
    key: string,
    field: MultiSelectField,
    value: string
  ) => {
    setGridRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r
        const updated = {
          ...r,
          [field]: (r[field] as string[]).filter((v) => v !== value),
        }
        if (
          field === 'classes' ||
          field === 'centres' ||
          field === 'masterFranchises'
        ) {
          return pruneRowHeads(updated)
        }
        return updated
      })
    )
  }

  // ---------- Per-head amounts ----------

  const setHeadAmount = (key: string, headId: string, value: string) => {
    setGridRows((prev) =>
      prev.map((r) =>
        r.key === key
          ? { ...r, headAmounts: { ...r.headAmounts, [headId]: value } }
          : r
      )
    )
  }

  // ---------- Fee head draft (create / edit — lives only in this panel) ----------

  // Update a single field of the fee head draft (explicit handlers — does not
  // rely on the Select/Input components forwarding the `name` prop)
  const updateHeadDraft = (
    field: keyof Omit<FeeHead, 'id'>,
    value: string | number | boolean
  ) => {
    setHeadDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  // Start a draft tied to a grid row (from the picker's "+ Create New" option)
  const startDraftForRow = (key: string) => {
    setOpenDropdown(null)
    setDropdownSelection([])
    setEditingHeadId(null)
    setHeadDraftRowKey(key)
    setHeadDraft({
      ...EMPTY_FEE_HEAD_FORM,
      account: generateAccountCode(),
    })
    setGridRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, expanded: true } : r))
    )
  }

  // Start a standalone draft (panel-level "New Fee Head" button)
  const startNewHeadDraft = () => {
    setEditingHeadId(null)
    setHeadDraftRowKey(null)
    setHeadDraft({
      ...EMPTY_FEE_HEAD_FORM,
      account: generateAccountCode(),
    })
  }

  const cancelHeadDraft = () => {
    // Panel opened from the Fee Heads tab just to edit the head: close it
    if (editingHeadId !== null && headDraftRowKey === null) {
      closePanel()
      return
    }
    setHeadDraft(null)
    setHeadDraftRowKey(null)
  }

  const handleSaveHeadDraft = () => {
    if (!headDraft) return
    const error = validateFeeHeadData(headDraft, editingHeadId ?? undefined)
    if (error) {
      alert(error)
      return
    }

    // ----- Edit mode: update the existing fee head -----
    if (editingHeadId !== null) {
      setFeeHeads((prev) =>
        prev.map((h) => (h.id === editingHeadId ? { ...h, ...headDraft } : h))
      )
      if (headDraftRowKey === null) {
        // Opened from the Fee Heads tab — close the panel
        closePanel()
      } else {
        setHeadDraft(null)
        setEditingHeadId(null)
        setHeadDraftRowKey(null)
      }
      return
    }

    // ----- Create mode: add the new fee head to the master list -----
    const newHead: FeeHead = {
      id: Math.max(...feeHeads.map((f) => f.id), 0) + 1,
      ...headDraft,
    }
    setFeeHeads((prev) => [...prev, newHead])

    const rowKey = headDraftRowKey
    setHeadDraft(null)
    setHeadDraftRowKey(null)

    // Add the new head to the row's selection
    if (rowKey) {
      setGridRows((prev) =>
        prev.map((r) =>
          r.key === rowKey
            ? { ...r, feeHeadIds: [...r.feeHeadIds, String(newHead.id)] }
            : r
        )
      )
    }
  }

  // ---------- Row attachments ----------

  const addFilesToRow = (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return
    const newAttachments: AttachmentFile[] = Array.from(files).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: formatFileSize(file.size),
    }))
    setGridRows((prev) =>
      prev.map((r) =>
        r.key === key ? { ...r, attachments: [...r.attachments, ...newAttachments] } : r
      )
    )
  }

  const handleBrowseClickForRow = (key: string) => {
    setAttachmentTargetKey(key)
    fileInputRef.current?.click()
  }

  const handlePanelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && attachmentTargetKey) {
      addFilesToRow(attachmentTargetKey, files)
    }
    // Reset file input + target
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setAttachmentTargetKey(null)
  }

  const removeRowAttachment = (key: string, attachmentId: string) => {
    setGridRows((prev) =>
      prev.map((r) =>
        r.key === key
          ? { ...r, attachments: r.attachments.filter((a) => a.id !== attachmentId) }
          : r
      )
    )
  }

  // ---------- Save (bulk create / update) ----------

  // Check that every selected fee head in the row has a valid amount
  const validateRowAmounts = (row: GridRow, rowNum: number): string | null => {
    for (const headId of row.feeHeadIds) {
      const head = feeHeads.find((h) => String(h.id) === headId)
      const amt = parseFloat(row.headAmounts[headId] ?? '')
      if (!amt || amt <= 0) {
        return `Row ${rowNum} (${head?.name ?? 'fee head'}): enter a valid amount.`
      }
    }
    return null
  }

  // Build one record per combination of (MF × Centre × Class × Batch × Fee Head)
  const recordsFromRow = (
    row: GridRow,
    startIndex: number
  ): FeeStructureRecord[] => {
    const records: FeeStructureRecord[] = []
    const mfs = row.masterFranchises.length ? row.masterFranchises : ['']
    const centres = row.centres.length ? row.centres : ['']
    const batches = row.batches.length ? row.batches : ['']
    const classes = row.classes.length ? row.classes : ['']
    const manualTitle = row.feeTitle.trim()
    let i = 0

    for (const mf of mfs) {
      for (const centre of centres) {
        for (const batch of batches) {
          for (const cls of classes) {
            for (const headId of row.feeHeadIds) {
              const head = feeHeads.find((h) => String(h.id) === headId)
              const headName = head?.name ?? ''
              const feeTitle = manualTitle
                ? row.feeHeadIds.length > 1
                  ? `${manualTitle} - ${headName}`
                  : manualTitle
                : autoGenerateTitle(cls, headName, row.term)
              records.push({
                id: `fs-${Date.now()}-${startIndex + i}`,
                feeTitle,
                feeHead: headName,
                masterFranchise: mf,
                centre,
                batch,
                class: cls,
                term: row.term,
                amount: parseFloat(row.headAmounts[headId] ?? '') || 0,
                kitAmount: parseFloat(row.kitAmount) || 0,
                shareType: row.shareType,
                businessShare: row.businessShare,
                mfShare: row.mfShare,
                centreShare: row.centreShare,
                status: 'Active',
                attachments: row.attachments,
              })
              i++
            }
          }
        }
      }
    }
    return records
  }

  const handleSavePanel = () => {
    // ----- Edit mode: update the loaded record (extra combinations are added) -----
    if (editingStructureId) {
      const row = gridRows[0]
      if (!row) return
      if (row.classes.length === 0) {
        alert('Select at least one class.')
        return
      }
      if (row.feeHeadIds.length === 0) {
        alert('Select at least one fee head.')
        return
      }
      const err = validateRowAmounts(row, 1)
      if (err) {
        alert(err)
        expandGridRow(row.key)
        return
      }
      const records = recordsFromRow(row, 0)
      const [primary, ...extra] = records
      setFeeStructures((prev) => [
        ...prev.map((s) =>
          s.id === editingStructureId ? { ...s, ...primary, id: s.id } : s
        ),
        ...extra,
      ])
      closePanel()
      return
    }

    // ----- Create mode: save all rows (one record per combination) -----
    const filled = gridRows.filter(
      (r) => r.classes.length > 0 || r.feeHeadIds.length > 0
    )
    if (filled.length === 0) {
      alert('Add at least one fee structure row before saving.')
      return
    }

    for (const row of filled) {
      const rowNum = gridRows.indexOf(row) + 1
      if (row.classes.length === 0) {
        alert(`Row ${rowNum}: select at least one class.`)
        expandGridRow(row.key)
        return
      }
      if (row.feeHeadIds.length === 0) {
        alert(`Row ${rowNum}: select at least one fee head.`)
        expandGridRow(row.key)
        return
      }
      const err = validateRowAmounts(row, rowNum)
      if (err) {
        alert(err)
        expandGridRow(row.key)
        return
      }
    }

    const newRecords: FeeStructureRecord[] = []
    let idx = 0
    for (const row of filled) {
      const recs = recordsFromRow(row, idx)
      idx += recs.length
      newRecords.push(...recs)
    }

    setFeeStructures((prev) => [...prev, ...newRecords])
    closePanel()
  }

  // ===================== Fee Head handlers =====================

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle type filter
  const handleTypeFilter = (value: string) => {
    setSelectedType(value)
  }

  // Handle taxable filter
  const handleTaxableFilter = (value: string) => {
    setSelectedTaxable(value)
  }

  // Edit a fee head — opens the merged panel with the fee head form pre-filled
  const handleEditFeeHead = (feeHead: FeeHead) => {
    setEditingStructureId(null)
    setGridRows([blankGridRow()])
    setHeadDraftRowKey(null)
    setEditingHeadId(feeHead.id)
    setHeadDraft({
      name: feeHead.name,
      type: feeHead.type,
      account: feeHead.account,
      taxable: feeHead.taxable,
      description: feeHead.description,
      gstPercentage: feeHead.gstPercentage,
      isActive: feeHead.isActive,
      applicableTo: feeHead.applicableTo,
      masterFranchise: feeHead.masterFranchise,
      branch: feeHead.branch,
      class: feeHead.class,
    })
    setOpenDropdown(null)
    setDropdownSelection([])
    setIsStructurePanelOpen(true)
  }

  // Handle view fee head details
  const handleViewFeeHead = (feeHead: FeeHead) => {
    setViewingFeeHead(feeHead)
    setIsFeeHeadViewModalOpen(true)
  }

  // Handle delete fee head
  const handleDeleteFeeHead = (id: number) => {
    const feeHead = feeHeads.find((f) => f.id === id)
    if (
      window.confirm(
        `Are you sure you want to delete "${feeHead?.name}"? This action cannot be undone.`
      )
    ) {
      setFeeHeads(feeHeads.filter((f) => f.id !== id))
    }
  }

  // Toggle active / inactive status (Status column in the fee heads table)
  const handleToggleActive = (id: number) => {
    setFeeHeads(
      feeHeads.map((feeHead) =>
        feeHead.id === id
          ? { ...feeHead, isActive: !feeHead.isActive }
          : feeHead
      )
    )
  }

  // ---------- Drag & drop reordering of fee heads ----------

  const [draggingHeadId, setDraggingHeadId] = useState<number | null>(null)
  const [dragOverHeadId, setDragOverHeadId] = useState<number | null>(null)

  const handleHeadDragStart = (e: React.DragEvent, id: number) => {
    setDraggingHeadId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(id))
  }

  // Dropping on a row moves the dragged fee head to just above that row
  const handleHeadDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault()
    const sourceId = parseInt(e.dataTransfer.getData('text/plain'), 10)
    setDraggingHeadId(null)
    setDragOverHeadId(null)
    if (!sourceId || sourceId === targetId) return
    setFeeHeads((prev) => {
      const sourceIndex = prev.findIndex((f) => f.id === sourceId)
      const targetIndex = prev.findIndex((f) => f.id === targetId)
      if (sourceIndex === -1 || targetIndex === -1) return prev
      const withoutSource = prev.filter((f) => f.id !== sourceId)
      const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
      return [
        ...withoutSource.slice(0, insertAt),
        prev[sourceIndex],
        ...withoutSource.slice(insertAt),
      ]
    })
  }

  // Shared fee head validation (used by the inline draft form)
  const validateFeeHeadData = (
    data: Omit<FeeHead, 'id'>,
    editingId?: number
  ): string | null => {
    if (!data.name.trim()) {
      return 'Fee head name is required'
    }
    if (!data.account.trim()) {
      return 'Account code is required'
    }
    if (data.taxable && data.gstPercentage <= 0) {
      return 'GST percentage is required for taxable fee heads'
    }
    if (data.gstPercentage < 0 || data.gstPercentage > 100) {
      return 'GST percentage must be between 0 and 100'
    }

    // Check for duplicate name (excluding current editing item)
    const duplicateName = feeHeads.find(
      (f) =>
        f.name.toLowerCase() === data.name.toLowerCase() &&
        f.id !== editingId
    )
    if (duplicateName) {
      return 'A fee head with this name already exists'
    }

    // Check for duplicate account code (excluding current editing item)
    const duplicateAccount = feeHeads.find(
      (f) =>
        f.account.toLowerCase() === data.account.toLowerCase() &&
        f.id !== editingId
    )
    if (duplicateAccount) {
      return 'This account code is already in use'
    }

    return null
  }

  // Handle fee head view modal close
  const handleCloseFeeHeadViewModal = () => {
    setIsFeeHeadViewModalOpen(false)
    setViewingFeeHead(null)
  }

  // ===================== Render helpers =====================

  // ----- Multi-select cell: chips in one input + checkbox dropdown -----
  const renderMultiSelect = (
    rowKey: string,
    field: MultiSelectField,
    selected: string[],
    options: { value: string; label: string; hint?: string }[],
    getLabel: (v: string) => string,
    placeholder: string,
    allowCreateNew = false
  ) => {
    const isOpen =
      openDropdown?.rowKey === rowKey && openDropdown.field === field
    const shown = selected.slice(0, 2)
    const hidden = selected.length - shown.length
    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => openMultiSelect(rowKey, field, e.currentTarget)}
          className="w-full min-h-[38px] flex flex-wrap items-center gap-1 px-2 py-1 text-sm bg-white border border-gray-300 rounded-md text-left hover:border-blue-400 transition-colors"
        >
          {selected.length === 0 ? (
            <span className="text-gray-400 truncate">{placeholder}</span>
          ) : (
            <>
              {shown.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-xs max-w-full"
                >
                  <span className="truncate">{getLabel(v)}</span>
                  <X
                    className="w-3 h-3 shrink-0 cursor-pointer hover:text-blue-950"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItemFromRow(rowKey, field, v)
                    }}
                  />
                </span>
              ))}
              {hidden > 0 && (
                <span className="text-xs text-gray-500">+{hidden} more</span>
              )}
            </>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
        </button>
        {isOpen && openDropdown && (
          <>
            {/* Click-away layer — fixed, above all panel content */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 40 }}
              onClick={applyDropdown}
            />
            {/* Options list — fixed at viewport coordinates so the panel's
                scrollable body can never clip or hide it */}
            <div
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl"
              style={{
                top: openDropdown.top,
                left: openDropdown.left,
                width: openDropdown.width,
                zIndex: 41,
              }}
            >
              <div className="max-h-56 overflow-y-auto py-1">
              {options.length === 0 && (
                <p className="px-3 py-3 text-xs text-gray-400">
                  No options available.
                </p>
              )}
              {options.map((o) => (
                <label
                  key={o.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 shrink-0"
                    checked={dropdownSelection.includes(o.value)}
                    onChange={() => toggleDropdownOption(o.value)}
                  />
                  <span className="text-gray-900 truncate">{o.label}</span>
                  {o.hint && (
                    <span className="ml-auto text-xs text-gray-400 shrink-0">
                      {o.hint}
                    </span>
                  )}
                </label>
              ))}
              </div>
              {allowCreateNew && (
                <button
                  type="button"
                  onClick={() => startDraftForRow(rowKey)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 border-t border-gray-100"
                >
                  <Plus className="w-4 h-4" /> Create New Fee Head…
                </button>
              )}
              <div className="p-2 border-t border-gray-100">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={applyDropdown}
                >
                  Done
                  {dropdownSelection.length > 0
                    ? ` (${dropdownSelection.length})`
                    : ''}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // ----- Fee head draft form (single source, rendered where needed) -----
  // All fields use explicit onChange handlers (no reliance on `name` being
  // forwarded by the ui Select/Input components).

  const renderHeadDraftForm = (idPrefix: string) => {
    if (!headDraft) return null
    return (
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-600" />
          {editingHeadId !== null ? 'Edit Fee Head' : 'New Fee Head'}
          <span className="font-normal text-gray-500">
            {editingHeadId !== null
              ? '(updates the fee head in the master list)'
              : '(added to the Fee Heads master immediately)'}
          </span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Fee Head Name *"
            value={headDraft.name}
            onChange={(e) => updateHeadDraft('name', e.target.value)}
            placeholder="Enter fee head name"
          />
          <Select
            label="Frequency Type *"
            value={headDraft.type}
            onChange={(e) => updateHeadDraft('type', e.target.value)}
            options={feeTypeOptions.map((type) => ({
              value: type,
              label: type,
            }))}
          />
          <Input
            label="Account Code *"
            value={headDraft.account}
            onChange={(e) => updateHeadDraft('account', e.target.value)}
            placeholder="Enter account code"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Master Franchise"
            value={headDraft.masterFranchise}
            onChange={(e) =>
              updateHeadDraft('masterFranchise', e.target.value)
            }
            options={HEAD_MF_OPTIONS}
          />
          <Select
            label="Branch"
            value={headDraft.branch}
            onChange={(e) => updateHeadDraft('branch', e.target.value)}
            options={HEAD_BRANCH_OPTIONS}
          />
          <Select
            label="Class"
            value={headDraft.class}
            onChange={(e) => updateHeadDraft('class', e.target.value)}
            options={HEAD_CLASS_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Applicable To"
            value={headDraft.applicableTo}
            onChange={(e) => updateHeadDraft('applicableTo', e.target.value)}
            placeholder="e.g. All Students, New Admissions…"
          />
          {headDraft.taxable && (
            <Input
              label="GST Percentage (%) *"
              type="number"
              value={headDraft.gstPercentage}
              onChange={(e) =>
                updateHeadDraft('gstPercentage', parseFloat(e.target.value) || 0)
              }
              placeholder="Enter GST percentage"
              min="0"
              max="100"
              step="0.01"
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`draft-taxable-${idPrefix}`}
              checked={headDraft.taxable}
              onChange={(e) => {
                const checked = e.target.checked
                setHeadDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        taxable: checked,
                        ...(checked ? {} : { gstPercentage: 0 }),
                      }
                    : prev
                )
              }}
              className="w-4 h-4"
            />
            <label
              htmlFor={`draft-taxable-${idPrefix}`}
              className="text-sm font-medium"
            >
              Taxable (GST Applicable)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`draft-active-${idPrefix}`}
              checked={headDraft.isActive}
              onChange={(e) =>
                updateHeadDraft('isActive', e.target.checked)
              }
              className="w-4 h-4"
            />
            <label
              htmlFor={`draft-active-${idPrefix}`}
              className="text-sm font-medium"
            >
              Active
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={headDraft.description}
            onChange={(e) => updateHeadDraft('description', e.target.value)}
            placeholder="Enter description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        {!isHeadEditMode && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={cancelHeadDraft}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveHeadDraft}>
              {editingHeadId !== null ? 'Update Fee Head' : 'Create Fee Head'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // ===================== Table columns =====================

  const columns = [
    {
      key: 'feeTitle',
      header: 'Fee Title',
      render: (row: FeeStructureRecord) => (
        <span className="font-medium text-gray-900">{row.feeTitle}</span>
      ),
    },
    {
      key: 'feeHead',
      header: 'Fee Head',
      render: (row: FeeStructureRecord) => (
        <span className="text-gray-600">{row.feeHead}</span>
      ),
    },
    {
      key: 'centre',
      header: 'Centre',
      render: (row: FeeStructureRecord) => (
        <span className="text-gray-600 flex items-center gap-1">
          <Building className="w-3 h-3" />
          {row.centre}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (row: FeeStructureRecord) => (
        <span className="text-gray-600">{row.class}</span>
      ),
    },
    {
      key: 'term',
      header: 'Term',
      render: (row: FeeStructureRecord) => (
        <span className="text-gray-600">{row.term}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: FeeStructureRecord) => (
        <span className="font-bold text-gray-900">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'kitAmount',
      header: 'Kit Amount',
      render: (row: FeeStructureRecord) => (
        <span className="font-medium text-gray-600">
          {row.kitAmount > 0 ? `₹${row.kitAmount.toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: FeeStructureRecord) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: FeeStructureRecord) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="Edit"
            onClick={() => handleEditStructure(row)}
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete"
            onClick={() => handleDeleteStructure(row)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Fee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage fee structures per batch and branch, and define
            fee heads with accounting links
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'structures' && (
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          )}
          <Button variant="primary" onClick={openCreatePanel}>
            <Plus className="w-4 h-4 mr-2" /> Create Fee Structure
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('structures')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'structures'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Fee Structures
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('feeHeads')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'feeHeads'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Fee Heads
        </button>
      </div>

      {/* ==================== Fee Structures tab ==================== */}
      {activeTab === 'structures' && (
        <>
          {/* Filters (live) */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Master Franchise"
                options={[
                  { value: '', label: 'All' },
                  { value: 'Main Campus', label: 'Main Campus' },
                ]}
                value={filters.masterFranchise}
                onChange={(e) =>
                  handleFilterChange('masterFranchise', e.target.value)
                }
              />
              <Select
                label="Centre"
                options={[
                  { value: '', label: 'All' },
                  { value: 'Main Campus', label: 'Main Campus' },
                  { value: 'North Campus', label: 'North Campus' },
                ]}
                value={filters.centre}
                onChange={(e) => handleFilterChange('centre', e.target.value)}
              />
              <Select
                label="Batch"
                options={[
                  { value: '', label: 'All' },
                  { value: 'Morning', label: 'Morning' },
                  { value: 'Afternoon', label: 'Afternoon' },
                ]}
                value={filters.batch}
                onChange={(e) => handleFilterChange('batch', e.target.value)}
              />
              <Select
                label="Term"
                options={[
                  { value: '', label: 'All' },
                  { value: 'Term 1', label: 'Term 1' },
                  { value: 'Term 2', label: 'Term 2' },
                  { value: 'Term 3', label: 'Term 3' },
                  { value: 'Annual', label: 'Annual' },
                ]}
                value={filters.term}
                onChange={(e) => handleFilterChange('term', e.target.value)}
              />
            </div>
          </Card>

          {/* List */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-500">
              Showing {filteredStructures.length} of {feeStructures.length} fee
              structures
            </div>
            <div className="overflow-x-auto">
              <Table columns={columns} data={filteredStructures} />
            </div>
          </Card>
        </>
      )}

      {/* ==================== Fee Heads tab (management only) ==================== */}
      {activeTab === 'feeHeads' && (
        <>
          {/* Search & filters */}
          <Card className="p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  leftIcon={<Search className="w-4 h-4" />}
                  placeholder="Search fee heads..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Select
                placeholder="Fee Type"
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  ...feeTypeOptions.map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
              />
              <Select
                placeholder="Taxable"
                value={selectedTaxable}
                onChange={(e) => handleTaxableFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'yes', label: 'Taxable' },
                  { value: 'no', label: 'Non-Taxable' },
                ]}
              />
            </div>
          </Card>

          {/* List */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-500">
              Showing {filteredFeeHeads.length} of {feeHeads.length} fee heads
              <span className="text-gray-400 ml-2">
                (fee heads are created &amp; edited from the Create Fee
                Structure panel — drag rows by the handle to reorder)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-10 px-2 py-3" />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Fee Head Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Frequency Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Account Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Master Franchise
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Taxable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Applicable To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredFeeHeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        className="px-4 py-8 text-center text-sm text-gray-400"
                      >
                        No fee heads found.
                      </td>
                    </tr>
                  )}
                  {filteredFeeHeads.map((feeHead) => (
                    <tr
                      key={feeHead.id}
                      draggable
                      onDragStart={(e) => handleHeadDragStart(e, feeHead.id)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (dragOverHeadId !== feeHead.id)
                          setDragOverHeadId(feeHead.id)
                      }}
                      onDragLeave={() =>
                        setDragOverHeadId((prev) =>
                          prev === feeHead.id ? null : prev
                        )
                      }
                      onDrop={(e) => handleHeadDrop(e, feeHead.id)}
                      onDragEnd={() => {
                        setDraggingHeadId(null)
                        setDragOverHeadId(null)
                      }}
                      className={`group transition-colors ${
                        draggingHeadId === feeHead.id
                          ? 'opacity-40'
                          : dragOverHeadId === feeHead.id
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <td
                        className="px-2 py-3 text-center cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4 mx-auto text-gray-300 group-hover:text-gray-500" />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium text-gray-900 cursor-pointer hover:underline"
                          onClick={() => handleViewFeeHead(feeHead)}
                        >
                          {feeHead.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.type}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.account}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.masterFranchise || 'All'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.branch || 'All'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.class ? `Class ${feeHead.class}` : 'All'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.taxable
                          ? `Yes (${feeHead.gstPercentage}% GST)`
                          : 'No'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {feeHead.applicableTo}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={feeHead.isActive ? 'success' : 'secondary'}
                        >
                          {feeHead.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            onClick={() => handleEditFeeHead(feeHead)}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View"
                            onClick={() => handleViewFeeHead(feeHead)}
                          >
                            <Eye className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title={
                              feeHead.isActive
                                ? 'Mark as Inactive'
                                : 'Mark as Active'
                            }
                            onClick={() => handleToggleActive(feeHead.id)}
                          >
                            <Power
                              className={`w-4 h-4 ${
                                feeHead.isActive
                                  ? 'text-amber-600'
                                  : 'text-green-600'
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete"
                            onClick={() => handleDeleteFeeHead(feeHead.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ==================== Merged Panel: wide fixed overlay ==================== */}
      {isStructurePanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePanel()
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">{panelTitle}</h2>
              <button
                type="button"
                onClick={closePanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isHeadEditMode ? (
                // ----- Fee head edit mode (opened from the Fee Heads tab) -----
                // Same layout as the create panel: info banner + form, with
                // the Cancel / Update actions in the panel footer.
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                    Update the fee head below — changes are saved to the
                    Fee Heads master immediately and apply wherever this head
                    is used.
                  </div>
                  {renderHeadDraftForm('panel')}
                </div>
              ) : (
                <div className="space-y-4">
                  {!editingStructureId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                      Each row generates structures for every combination of the
                      selected <span className="font-semibold">master
                      franchises, centres, classes, batches and fee heads</span>.
                      Set each fee head&apos;s amount — plus term, title, kit
                      amount, revenue sharing and attachments — in the
                      expanded row. Only fee heads matching the row&apos;s
                      class / centre are listed. Choose{' '}
                      <span className="font-semibold">
                        + Create New Fee Head…
                      </span>{' '}
                      to create one on the fly.
                    </div>
                  )}

                  {/* Standalone new fee head draft (panel-level button) */}
                  {headDraftRowKey === null &&
                    headDraft &&
                    renderHeadDraftForm('panel')}

                  {/* Hidden file input used for row attachments */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePanelFileChange}
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />

                  {/* Editable grid — fixed layout, no horizontal scroll */}
                  <div className="border border-gray-200 rounded-lg">
                    <table className="w-full table-fixed text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-8 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            #
                          </th>
                          <th className="w-[13%] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Master Franchise
                          </th>
                          <th className="w-[14%] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Centre
                          </th>
                          <th className="w-[12%] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Class *
                          </th>
                          <th className="w-[12%] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Batch
                          </th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Fee Heads *
                          </th>
                          <th className="w-9 px-1 py-2" />
                          <th className="w-9 px-1 py-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {gridRows.length === 0 && (
                          <tr>
                            <td
                              colSpan={8}
                              className="px-4 py-8 text-center text-sm text-gray-400"
                            >
                              No rows. Click &quot;Add Row&quot; to add classes.
                            </td>
                          </tr>
                        )}
                        {gridRows.map((row, idx) => (
                          <React.Fragment key={row.key}>
                            <tr
                              className={
                                headDraftRowKey === row.key
                                  ? 'bg-blue-50/60'
                                  : ''
                              }
                            >
                              <td className="px-2 py-1.5 text-gray-400">
                                {idx + 1}
                              </td>
                              <td className="px-2 py-1.5">
                                {renderMultiSelect(
                                  row.key,
                                  'masterFranchises',
                                  row.masterFranchises,
                                  MF_MULTI_OPTIONS,
                                  labelFrom(MF_MULTI_OPTIONS),
                                  'MF'
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {renderMultiSelect(
                                  row.key,
                                  'centres',
                                  row.centres,
                                  CENTRE_MULTI_OPTIONS,
                                  labelFrom(CENTRE_MULTI_OPTIONS),
                                  'Centre'
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {renderMultiSelect(
                                  row.key,
                                  'classes',
                                  row.classes,
                                  CLASS_MULTI_OPTIONS,
                                  labelFrom(CLASS_MULTI_OPTIONS),
                                  'Class'
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {renderMultiSelect(
                                  row.key,
                                  'batches',
                                  row.batches,
                                  BATCH_MULTI_OPTIONS,
                                  labelFrom(BATCH_MULTI_OPTIONS),
                                  'Batch'
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {renderMultiSelect(
                                  row.key,
                                  'feeHeadIds',
                                  row.feeHeadIds,
                                  headOptionsForRow(row),
                                  headNameById,
                                  'Select Fee Head(s)',
                                  true
                                )}
                              </td>
                              <td className="px-1 py-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={row.expanded ? 'Collapse' : 'Expand'}
                                  onClick={() => toggleRowExpanded(row.key)}
                                >
                                  {row.expanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              </td>
                              <td className="px-1 py-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Remove row"
                                  onClick={() => handleRemoveGridRow(row.key)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </td>
                            </tr>

                            {/* ---------- Expanded row (bottom panel) ---------- */}
                            {row.expanded && (
                              <tr>
                                <td colSpan={8} className="bg-gray-50 px-4 py-4">
                                  <div className="space-y-4">
                                    {/* New fee head draft (only while creating for this row) */}
                                    {headDraftRowKey === row.key &&
                                      renderHeadDraftForm(row.key)}

                                    {/* Fee heads & amounts */}
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                        Fee Heads &amp; Amounts
                                      </h4>
                                      {row.feeHeadIds.length === 0 ? (
                                        <p className="text-sm text-gray-400">
                                          No fee heads selected — use the Fee
                                          Heads field in the row.
                                        </p>
                                      ) : (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-3 px-0.5">
                                            <span className="flex-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Fee Head
                                            </span>
                                            <span className="w-40 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Amount (₹) *
                                            </span>
                                            <span className="w-8" />
                                          </div>
                                          {row.feeHeadIds.map((id) => {
                                            const head = feeHeads.find(
                                              (h) => String(h.id) === id
                                            )
                                            return (
                                              <div
                                                key={id}
                                                className="flex items-center gap-3"
                                              >
                                                <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                                                  {head?.name ?? id}
                                                </span>
                                                <div className="w-40">
                                                  <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={
                                                      row.headAmounts[id] ?? ''
                                                    }
                                                    onChange={(e) =>
                                                      setHeadAmount(
                                                        row.key,
                                                        id,
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <button
                                                  type="button"
                                                  title="Remove fee head"
                                                  onClick={() =>
                                                    removeItemFromRow(
                                                      row.key,
                                                      'feeHeadIds',
                                                      id
                                                    )
                                                  }
                                                  className="w-8 p-1 hover:bg-red-100 rounded-full transition-colors"
                                                >
                                                  <X className="w-4 h-4 text-red-500" />
                                                </button>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>

                                    {/* Term, fee title & kit amount */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                                      <Select
                                        label="Term"
                                        value={row.term}
                                        onChange={(e) =>
                                          handleGridRowChange(
                                            row.key,
                                            'term',
                                            e.target.value
                                          )
                                        }
                                        options={STRUCTURE_TERM_OPTIONS}
                                      />
                                      <Input
                                        label="Fee Title"
                                        placeholder="Auto-generated if left blank"
                                        value={row.feeTitle}
                                        onChange={(e) =>
                                          handleGridRowChange(
                                            row.key,
                                            'feeTitle',
                                            e.target.value
                                          )
                                        }
                                      />
                                      <Input
                                        label="Kit Amount (₹)"
                                        type="number"
                                        placeholder="0"
                                        value={row.kitAmount}
                                        onChange={(e) =>
                                          handleGridRowChange(
                                            row.key,
                                            'kitAmount',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Revenue Sharing */}
                                    <div className="border-t border-gray-200 pt-4">
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                        Revenue Sharing
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Select
                                          label="Share Type"
                                          value={row.shareType}
                                          onChange={(e) =>
                                            handleGridRowChange(
                                              row.key,
                                              'shareType',
                                              e.target.value
                                            )
                                          }
                                          options={[
                                            { value: 'Percentage', label: 'Percentage (%)' },
                                            { value: 'Fixed', label: 'Fixed Amount (₹)' },
                                          ]}
                                        />
                                        <Input
                                          label={`Business Share ${
                                            row.shareType === 'Percentage' ? '(%)' : '(₹)'
                                          }`}
                                          type="number"
                                          placeholder="0"
                                          value={row.businessShare}
                                          onChange={(e) =>
                                            handleGridRowChange(
                                              row.key,
                                              'businessShare',
                                              e.target.value
                                            )
                                          }
                                        />
                                        <Input
                                          label={`MF Share ${
                                            row.shareType === 'Percentage' ? '(%)' : '(₹)'
                                          }`}
                                          type="number"
                                          placeholder="0"
                                          value={row.mfShare}
                                          onChange={(e) =>
                                            handleGridRowChange(
                                              row.key,
                                              'mfShare',
                                              e.target.value
                                            )
                                          }
                                        />
                                        <Input
                                          label={`Centre Share ${
                                            row.shareType === 'Percentage' ? '(%)' : '(₹)'
                                          }`}
                                          type="number"
                                          placeholder="0"
                                          value={row.centreShare}
                                          onChange={(e) =>
                                            handleGridRowChange(
                                              row.key,
                                              'centreShare',
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* Attachments */}
                                    <div className="border-t border-gray-200 pt-4">
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Paperclip className="w-4 h-4 text-blue-600" />
                                        Attachments
                                      </h4>
                                      <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          addFilesToRow(row.key, e.dataTransfer.files)
                                        }}
                                        onClick={() =>
                                          handleBrowseClickForRow(row.key)
                                        }
                                      >
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">
                                          Drag and drop files here, or{' '}
                                          <span className="text-blue-600 font-medium hover:underline">
                                            browse
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Supported formats: PDF, DOC, DOCX,
                                          XLS, XLSX, JPG, PNG (Max 10MB each)
                                        </p>
                                      </div>
                                      {row.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                          {row.attachments.map((attachment) => (
                                            <div
                                              key={attachment.id}
                                              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                  <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {attachment.name}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    {attachment.size}
                                                  </p>
                                                </div>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  removeRowAttachment(
                                                    row.key,
                                                    attachment.id
                                                  )
                                                }}
                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                              >
                                                <X className="w-4 h-4 text-red-500" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row / New Fee Head + summary */}
                  {!editingStructureId && (
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleAddGridRow}>
                          <Plus className="w-4 h-4 mr-2" /> Add Row
                        </Button>
                        <Button
                          variant="outline"
                          onClick={startNewHeadDraft}
                        >
                          <DollarSign className="w-4 h-4 mr-2" /> New Fee Head
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500">
                        {filledPanelRows.length} row(s) •{' '}
                        {panelStructureCount} structure(s) • Total ₹
                        {panelTotalAmount.toLocaleString('en-IN')} (incl. kit)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg shrink-0">
              {isHeadEditMode ? (
                <>
                  <Button variant="outline" onClick={closePanel}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveHeadDraft}>
                    Update Fee Head
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={closePanel}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSavePanel}>
                    {editingStructureId
                      ? 'Update Fee Structure'
                      : `Save All (${panelStructureCount})`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== Fee Head View Modal ==================== */}
      {isFeeHeadViewModalOpen && viewingFeeHead && (
        <Modal
          isOpen
          onClose={handleCloseFeeHeadViewModal}
          title="Fee Head Details"
          size="lg"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={handleCloseFeeHeadViewModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleCloseFeeHeadViewModal()
                  handleEditFeeHead(viewingFeeHead)
                }}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Fee Head Name</label>
                <p className="font-medium">{viewingFeeHead.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Account Code</label>
                <p className="font-medium">{viewingFeeHead.account}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Frequency Type</label>
                <p className="font-medium">{viewingFeeHead.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Applicable To</label>
                <p className="font-medium">
                  {viewingFeeHead.applicableTo || '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">
                  Master Franchise
                </label>
                <p className="font-medium">
                  {viewingFeeHead.masterFranchise || 'All'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Branch</label>
                <p className="font-medium">{viewingFeeHead.branch || 'All'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Class</label>
                <p className="font-medium">
                  {viewingFeeHead.class
                    ? `Class ${viewingFeeHead.class}`
                    : 'All Classes'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Taxable</label>
                <p className="font-medium">
                  {viewingFeeHead.taxable
                    ? `Yes (${viewingFeeHead.gstPercentage}% GST)`
                    : 'No'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className="font-medium">
                  {viewingFeeHead.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Description</label>
              <p className="font-medium">
                {viewingFeeHead.description || 'No description available'}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
