import React, { useState, useRef } from 'react'

// Types
interface ReceiptElement {
  id: string
  type: 'text' | 'image' | 'line' | 'table' | 'field' | 'logo' | 'signature' | 'qrcode'
  label: string
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
  color: string
  borderColor: string
  showBorder: boolean
}

interface Template {
  id: string
  name: string
  description: string
  paperSize: 'A4' | 'A5' | 'Letter' | 'Custom'
  orientation: 'portrait' | 'landscape'
  elements: ReceiptElement[]
  createdAt: string
  updatedAt: string
  thumbnail: string
  isDefault: boolean
}

const defaultElements: Record<string, Partial<ReceiptElement>> = {
  text: { type: 'text', label: 'Text Block', content: 'Sample Text', width: 200, height: 30, fontSize: 14, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#cccccc', showBorder: false },
  field: { type: 'field', label: 'Data Field', content: '{{student_name}}', width: 200, height: 30, fontSize: 14, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#cccccc', showBorder: false },
  image: { type: 'image', label: 'Image', content: '', width: 100, height: 100, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#cccccc', showBorder: true },
  logo: { type: 'logo', label: 'School Logo', content: '', width: 80, height: 80, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#cccccc', showBorder: false },
  line: { type: 'line', label: 'Horizontal Line', content: '', width: 400, height: 2, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#000000', showBorder: false },
  table: { type: 'table', label: 'Fee Table', content: 'Particulars|Amount\nTuition Fee|{{tuition_fee}}\nLab Fee|{{lab_fee}}\nTotal|{{total}}', width: 400, height: 150, fontSize: 12, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#000000', showBorder: true },
  signature: { type: 'signature', label: 'Signature', content: 'Authorized Signatory', width: 150, height: 60, fontSize: 10, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#cccccc', showBorder: false },
  qrcode: { type: 'qrcode', label: 'QR Code', content: '{{receipt_url}}', width: 80, height: 80, fontSize: 10, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#cccccc', showBorder: false },
}

const availableFields = [
  { value: '{{student_name}}', label: 'Student Name' },
  { value: '{{student_id}}', label: 'Student ID' },
  { value: '{{class}}', label: 'Class' },
  { value: '{{section}}', label: 'Section' },
  { value: '{{receipt_no}}', label: 'Receipt Number' },
  { value: '{{receipt_date}}', label: 'Receipt Date' },
  { value: '{{payment_mode}}', label: 'Payment Mode' },
  { value: '{{tuition_fee}}', label: 'Tuition Fee' },
  { value: '{{lab_fee}}', label: 'Lab Fee' },
  { value: '{{transport_fee}}', label: 'Transport Fee' },
  { value: '{{library_fee}}', label: 'Library Fee' },
  { value: '{{total}}', label: 'Total Amount' },
  { value: '{{amount_in_words}}', label: 'Amount in Words' },
  { value: '{{academic_year}}', label: 'Academic Year' },
  { value: '{{school_name}}', label: 'School Name' },
  { value: '{{school_address}}', label: 'School Address' },
  { value: '{{school_phone}}', label: 'School Phone' },
  { value: '{{receipt_url}}', label: 'Receipt URL' },
]

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'Standard Receipt',
    description: 'Default fee receipt template with school header and fee breakdown',
    paperSize: 'A4',
    orientation: 'portrait',
    elements: [
      { id: 'e1', type: 'logo', label: 'School Logo', content: '', x: 50, y: 20, width: 80, height: 80, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e2', type: 'text', label: 'School Name', content: '{{school_name}}', x: 150, y: 30, width: 350, height: 35, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1a365d', borderColor: '#ccc', showBorder: false },
      { id: 'e3', type: 'text', label: 'School Address', content: '{{school_address}} | {{school_phone}}', x: 150, y: 65, width: 350, height: 20, fontSize: 11, fontWeight: 'normal', textAlign: 'center', color: '#4a5568', borderColor: '#ccc', showBorder: false },
      { id: 'e4', type: 'line', label: 'Header Line', content: '', x: 30, y: 110, width: 500, height: 2, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#1a365d', borderColor: '#1a365d', showBorder: false },
      { id: 'e5', type: 'text', label: 'Receipt Title', content: 'FEE RECEIPT', x: 180, y: 120, width: 200, height: 30, fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1a365d', borderColor: '#ccc', showBorder: false },
      { id: 'e6', type: 'field', label: 'Receipt No', content: 'Receipt No: {{receipt_no}}', x: 50, y: 160, width: 200, height: 25, fontSize: 12, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e7', type: 'field', label: 'Date', content: 'Date: {{receipt_date}}', x: 350, y: 160, width: 180, height: 25, fontSize: 12, fontWeight: 'normal', textAlign: 'right', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e8', type: 'field', label: 'Student Name', content: 'Student: {{student_name}}', x: 50, y: 195, width: 250, height: 25, fontSize: 13, fontWeight: 'bold', textAlign: 'left', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e9', type: 'field', label: 'Class', content: 'Class: {{class}} - {{section}}', x: 350, y: 195, width: 180, height: 25, fontSize: 13, fontWeight: 'normal', textAlign: 'right', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e10', type: 'table', label: 'Fee Table', content: 'Particulars|Amount\nTuition Fee|{{tuition_fee}}\nLab Fee|{{lab_fee}}\nTransport Fee|{{transport_fee}}\nLibrary Fee|{{library_fee}}\nTotal|{{total}}', x: 50, y: 240, width: 460, height: 180, fontSize: 12, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#000000', showBorder: true },
      { id: 'e11', type: 'field', label: 'Amount in Words', content: 'Amount in Words: {{amount_in_words}}', x: 50, y: 435, width: 460, height: 25, fontSize: 11, fontWeight: 'normal', textAlign: 'left', color: '#4a5568', borderColor: '#ccc', showBorder: false },
      { id: 'e12', type: 'field', label: 'Payment Mode', content: 'Payment Mode: {{payment_mode}}', x: 50, y: 465, width: 250, height: 25, fontSize: 12, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e13', type: 'signature', label: 'Signature', content: 'Authorized Signatory', x: 380, y: 500, width: 150, height: 60, fontSize: 10, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e14', type: 'qrcode', label: 'QR Code', content: '{{receipt_url}}', x: 50, y: 500, width: 60, height: 60, fontSize: 8, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#ccc', showBorder: false },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    thumbnail: '',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Compact Receipt',
    description: 'Minimalist receipt for quick printing on A5 paper',
    paperSize: 'A5',
    orientation: 'portrait',
    elements: [
      { id: 'e1', type: 'text', label: 'School Name', content: '{{school_name}}', x: 50, y: 20, width: 300, height: 30, fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#2d3748', borderColor: '#ccc', showBorder: false },
      { id: 'e2', type: 'line', label: 'Header Line', content: '', x: 30, y: 55, width: 350, height: 2, fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#2d3748', borderColor: '#2d3748', showBorder: false },
      { id: 'e3', type: 'text', label: 'Title', content: 'FEE RECEIPT', x: 120, y: 65, width: 160, height: 25, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#2d3748', borderColor: '#ccc', showBorder: false },
      { id: 'e4', type: 'field', label: 'Receipt No', content: 'Rcpt: {{receipt_no}} | Date: {{receipt_date}}', x: 30, y: 100, width: 350, height: 20, fontSize: 11, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e5', type: 'field', label: 'Student', content: '{{student_name}} | {{class}}-{{section}}', x: 30, y: 125, width: 350, height: 20, fontSize: 12, fontWeight: 'bold', textAlign: 'left', color: '#000000', borderColor: '#ccc', showBorder: false },
      { id: 'e6', type: 'table', label: 'Fee Table', content: 'Fee Type|Amount\nTuition|{{tuition_fee}}\nTotal|{{total}}', x: 30, y: 155, width: 350, height: 100, fontSize: 11, fontWeight: 'normal', textAlign: 'left', color: '#000000', borderColor: '#000000', showBorder: true },
      { id: 'e7', type: 'signature', label: 'Signature', content: 'Cashier', x: 250, y: 270, width: 120, height: 50, fontSize: 10, fontWeight: 'normal', textAlign: 'center', color: '#000000', borderColor: '#ccc', showBorder: false },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
    thumbnail: '',
    isDefault: false,
  },
]

// Icons as simple SVG components
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const GripIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

// Element type icons
const getElementIcon = (type: string) => {
  switch (type) {
    case 'text':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      )
    case 'field':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    case 'image':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'logo':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    case 'line':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    case 'table':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    case 'signature':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    case 'qrcode':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    default:
      return null
  }
}

export default function FeeReceiptTemplate() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [view, setView] = useState<'list' | 'editor' | 'preview'>('list')
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [selectedElement, setSelectedElement] = useState<ReceiptElement | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create new template
  const createNewTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: 'Untitled Template',
      description: '',
      paperSize: 'A4',
      orientation: 'portrait',
      elements: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      thumbnail: '',
      isDefault: false,
    }
    setCurrentTemplate(newTemplate)
    setSelectedElement(null)
    setView('editor')
  }

  // Edit template
  const editTemplate = (template: Template) => {
    setCurrentTemplate({ ...template, elements: template.elements.map(e => ({ ...e })) })
    setSelectedElement(null)
    setView('editor')
  }

  // Preview template
  const previewTemplate = (template: Template) => {
    setCurrentTemplate(template)
    setView('preview')
  }

  // Save template
  const saveTemplate = () => {
    if (!currentTemplate) return
    const updated = { ...currentTemplate, updatedAt: new Date().toISOString().split('T')[0] }
    const existingIndex = templates.findIndex(t => t.id === updated.id)
    if (existingIndex >= 0) {
      const newTemplates = [...templates]
      newTemplates[existingIndex] = updated
      setTemplates(newTemplates)
    } else {
      setTemplates([...templates, updated])
    }
    setView('list')
    setCurrentTemplate(null)
    setSelectedElement(null)
  }

  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
    setShowDeleteModal(null)
  }

  // Duplicate template
  const duplicateTemplate = (template: Template) => {
    const duplicate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      elements: template.elements.map(e => ({ ...e, id: `e${Date.now()}${Math.random().toString(36).substr(2, 5)}` })),
    }
    setTemplates([...templates, duplicate])
  }

  // Set default template
  const setDefaultTemplate = (id: string) => {
    setTemplates(templates.map(t => ({ ...t, isDefault: t.id === id })))
  }

  // Add element to canvas
  const addElement = (type: string) => {
    if (!currentTemplate) return
    const defaults = defaultElements[type]
    if (!defaults) return
    const newElement: ReceiptElement = {
      id: `e${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
      type: defaults.type!,
      label: defaults.label!,
      content: defaults.content!,
      x: 50,
      y: 50 + currentTemplate.elements.length * 40,
      width: defaults.width!,
      height: defaults.height!,
      fontSize: defaults.fontSize!,
      fontWeight: defaults.fontWeight!,
      textAlign: defaults.textAlign!,
      color: defaults.color!,
      borderColor: defaults.borderColor!,
      showBorder: defaults.showBorder!,
    }
    setCurrentTemplate({
      ...currentTemplate,
      elements: [...currentTemplate.elements, newElement],
    })
    setSelectedElement(newElement)
  }

  // Update element
  const updateElement = (id: string, updates: Partial<ReceiptElement>) => {
    if (!currentTemplate) return
    const newElements = currentTemplate.elements.map(e =>
      e.id === id ? { ...e, ...updates } : e
    )
    setCurrentTemplate({ ...currentTemplate, elements: newElements })
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...updates })
    }
  }

  // Remove element
  const removeElement = (id: string) => {
    if (!currentTemplate) return
    setCurrentTemplate({
      ...currentTemplate,
      elements: currentTemplate.elements.filter(e => e.id !== id),
    })
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  // Move element up/down in layer order
  const moveElementLayer = (id: string, direction: 'up' | 'down') => {
    if (!currentTemplate) return
    const elements = [...currentTemplate.elements]
    const index = elements.findIndex(e => e.id === id)
    if (direction === 'up' && index > 0) {
      [elements[index - 1], elements[index]] = [elements[index], elements[index - 1]]
    } else if (direction === 'down' && index < elements.length - 1) {
      [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]]
    }
    setCurrentTemplate({ ...currentTemplate, elements })
  }

  // Handle canvas click for element positioning
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
    }
  }

  // Handle element drag on canvas
  const handleElementMouseDown = (e: React.MouseEvent, element: ReceiptElement) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedElement(element)

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startElX = element.x
    const startElY = element.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newX = Math.max(0, Math.min(startElX + dx, canvasRect.width - element.width))
      const newY = Math.max(0, startElY + dy)
      updateElement(element.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const imported = JSON.parse(content) as Template
        imported.id = Date.now().toString()
        imported.createdAt = new Date().toISOString().split('T')[0]
        imported.updatedAt = new Date().toISOString().split('T')[0]
        imported.isDefault = false
        setTemplates([...templates, imported])
        setShowUploadModal(false)
      } catch {
        alert('Invalid template file. Please upload a valid JSON template.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Export template
  const exportTemplate = (template: Template) => {
    const data = JSON.stringify(template, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter templates
  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Render element on canvas
  const renderCanvasElement = (element: ReceiptElement) => {
    const isSelected = selectedElement?.id === element.id
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      textAlign: element.textAlign as React.CSSProperties['textAlign'],
      color: element.color,
      cursor: 'move',
      border: isSelected ? '2px solid #3b82f6' : element.showBorder ? `1px solid ${element.borderColor}` : '1px dashed transparent',
      borderRadius: 2,
      overflow: 'hidden',
      userSelect: 'none' as const,
      zIndex: isSelected ? 10 : 1,
    }

    switch (element.type) {
      case 'text':
      case 'field':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={`flex items-center px-1 hover:border-blue-300 hover:border-dashed ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <span className="truncate w-full">{element.content}</span>
          </div>
        )
      case 'line':
        return (
          <div
            key={element.id}
            style={{ ...baseStyle, display: 'flex', alignItems: 'center' }}
            className={`hover:border-blue-300 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div style={{ width: '100%', height: element.height, backgroundColor: element.color }} />
          </div>
        )
      case 'logo':
      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={`flex items-center justify-center bg-gray-50 hover:border-blue-300 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div className="text-center text-gray-400">
              {getElementIcon(element.type)}
              <div className="text-xs mt-1">{element.label}</div>
            </div>
          </div>
        )
      case 'table': {
        const rows = element.content.split('\n').map(r => r.split('|'))
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={`hover:border-blue-300 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <table className="w-full h-full border-collapse" style={{ fontSize: element.fontSize }}>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-gray-100 font-bold' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-300 px-2 py-1">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      case 'signature':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={`flex flex-col items-center justify-end hover:border-blue-300 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div className="border-t border-gray-400 w-full mb-1" />
            <span style={{ fontSize: element.fontSize }}>{element.content}</span>
          </div>
        )
      case 'qrcode':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={`flex items-center justify-center bg-gray-50 hover:border-blue-300 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div className="text-center">
              <div className="grid grid-cols-4 gap-px mx-auto" style={{ width: Math.min(element.width, element.height) * 0.6 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`aspect-square ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">QR Code</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Render template preview
  const renderPreviewElement = (element: ReceiptElement) => {
    const sampleData: Record<string, string> = {
      '{{student_name}}': 'John Smith',
      '{{student_id}}': 'STU-2024-001',
      '{{class}}': '10',
      '{{section}}': 'A',
      '{{receipt_no}}': 'REC-2024-0042',
      '{{receipt_date}}': '15 Jan 2024',
      '{{payment_mode}}': 'Online Transfer',
      '{{tuition_fee}}': '₹15,000',
      '{{lab_fee}}': '₹3,000',
      '{{transport_fee}}': '₹5,000',
      '{{library_fee}}': '₹1,000',
      '{{total}}': '₹24,000',
      '{{amount_in_words}}': 'Twenty Four Thousand Rupees Only',
      '{{academic_year}}': '2024-25',
      '{{school_name}}': 'Springfield International School',
      '{{school_address}}': '123 Education Lane, Springfield',
      '{{school_phone}}': '+91 98765 43210',
      '{{receipt_url}}': 'https://school.edu/receipt/42',
    }

    const replaceFields = (text: string) => {
      let result = text
      Object.entries(sampleData).forEach(([key, value]) => {
        result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
      })
      return result
    }

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      textAlign: element.textAlign as React.CSSProperties['textAlign'],
      color: element.color,
      overflow: 'hidden',
    }

    switch (element.type) {
      case 'text':
      case 'field':
        return (
          <div key={element.id} style={baseStyle} className="flex items-center px-1">
            <span className="w-full">{replaceFields(element.content)}</span>
          </div>
        )
      case 'line':
        return (
          <div key={element.id} style={{ ...baseStyle, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: element.height, backgroundColor: element.color }} />
          </div>
        )
      case 'logo':
        return (
          <div key={element.id} style={baseStyle} className="flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs">Logo</span>
            </div>
          </div>
        )
      case 'image':
        return (
          <div key={element.id} style={baseStyle} className="flex items-center justify-center bg-gray-100 rounded">
            <span className="text-xs text-gray-500">{element.label}</span>
          </div>
        )
      case 'table': {
        const rows = element.content.split('\n').map(r => r.split('|').map(c => replaceFields(c.trim())))
        return (
          <div key={element.id} style={baseStyle}>
            <table className="w-full h-full border-collapse" style={{ fontSize: element.fontSize }}>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-gray-100 font-bold' : i === rows.length - 1 ? 'font-bold bg-gray-50' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-300 px-2 py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      case 'signature':
        return (
          <div key={element.id} style={baseStyle} className="flex flex-col items-center justify-end">
            <div className="border-t border-gray-400 w-full mb-1" />
            <span style={{ fontSize: element.fontSize }}>{element.content}</span>
          </div>
        )
      case 'qrcode':
        return (
          <div key={element.id} style={baseStyle} className="flex items-center justify-center">
            <div className="border-2 border-black p-1">
              <div className="grid grid-cols-5 gap-px" style={{ width: Math.min(element.width, element.height) * 0.7 }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`aspect-square ${[0, 1, 4, 5, 9, 10, 12, 14, 15, 19, 20, 21, 23, 24].includes(i) ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // ===== LIST VIEW =====
  if (view === 'list') {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fee Receipt Templates</h1>
            <p className="text-gray-500 mt-1">Create, manage and customize your fee receipt templates</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <UploadIcon />
              Upload Template
            </button>
            <button
              onClick={createNewTemplate}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              <PlusIcon />
              Create Template
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">Get started by creating a new template or uploading an existing one.</p>
            <button
              onClick={createNewTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon />
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Template Preview Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden border-b">
                  <div className="absolute inset-4 bg-white rounded shadow-sm p-3" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '160%', height: '160%' }}>
                    {template.elements.slice(0, 6).map((el, i) => (
                      <div
                        key={i}
                        className="text-xs truncate"
                        style={{
                          fontSize: Math.max(8, el.fontSize * 0.5),
                          fontWeight: el.fontWeight,
                          textAlign: el.textAlign as React.CSSProperties['textAlign'],
                          color: el.color,
                          marginBottom: 2,
                        }}
                      >
                        {el.type === 'line' ? (
                          <hr className="my-1" style={{ borderColor: el.color }} />
                        ) : el.type === 'table' ? (
                          <div className="border border-gray-200 p-1 text-center text-gray-400">[Table]</div>
                        ) : (
                          el.content || el.label
                        )}
                      </div>
                    ))}
                    {template.elements.length > 6 && (
                      <div className="text-xs text-gray-400 mt-1">+{template.elements.length - 6} more elements</div>
                    )}
                  </div>
                  {template.isDefault && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{template.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{template.paperSize} · {template.orientation}</span>
                    <span>·</span>
                    <span>{template.elements.length} elements</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Updated: {template.updatedAt}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editTemplate(template)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button
                      onClick={() => previewTemplate(template)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
                    >
                      <EyeIcon />
                      Preview
                    </button>
                    <button
                      onClick={() => duplicateTemplate(template)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      title="Duplicate"
                    >
                      <CopyIcon />
                    </button>
                    <button
                      onClick={() => exportTemplate(template)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      title="Export"
                    >
                      <DownloadIcon />
                    </button>
                    <button
                      onClick={() => setDefaultTemplate(template.id)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${template.isDefault ? 'text-yellow-500' : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'}`}
                      title={template.isDefault ? 'Default template' : 'Set as default'}
                    >
                      <StarIcon filled={template.isDefault} />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(template.id)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upload Template</h2>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <CloseIcon />
                </button>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon />
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">JSON template files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Template?</h3>
                <p className="text-gray-500 mb-6">This action cannot be undone. The template will be permanently removed.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTemplate(showDeleteModal)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===== PREVIEW VIEW =====
  if (view === 'preview' && currentTemplate) {
    return (
      <div className="p-6 min-h-screen bg-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setView('list'); setCurrentTemplate(null) }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Preview: {currentTemplate.name}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => editTemplate(currentTemplate)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <EditIcon />
              Edit Template
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="bg-white shadow-xl relative print:shadow-none"
            style={{
              width: currentTemplate.paperSize === 'A5' ? 420 : 595,
              minHeight: currentTemplate.paperSize === 'A5' ? 595 : 842,
              padding: 0,
            }}
          >
            {currentTemplate.elements.map(renderPreviewElement)}
          </div>
        </div>
      </div>
    )
  }

  // ===== EDITOR VIEW =====
  if (view === 'editor' && currentTemplate) {
    return (
      <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setView('list'); setCurrentTemplate(null); setSelectedElement(null) }}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <input
              type="text"
              value={currentTemplate.name}
              onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
              className="text-lg font-semibold text-gray-900 border-none outline-none bg-transparent focus:bg-gray-50 rounded px-2 py-1"
              placeholder="Template Name"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => previewTemplate(currentTemplate)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm"
            >
              <EyeIcon />
              Preview
            </button>
            <button
              onClick={saveTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Template
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Elements Panel */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Template Settings */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Template Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                  <textarea
                    value={currentTemplate.description}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={2}
                    placeholder="Template description..."
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Paper</label>
                    <select
                      value={currentTemplate.paperSize}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, paperSize: e.target.value as Template['paperSize'] })}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="A4">A4</option>
                      <option value="A5">A5</option>
                      <option value="Letter">Letter</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Orient.</label>
                    <select
                      value={currentTemplate.orientation}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, orientation: e.target.value as Template['orientation'] })}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Elements */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Add Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(defaultElements).map(([type, def]) => (
                  <button
                    key={type}
                    onClick={() => addElement(type)}
                    className="flex flex-col items-center gap-1 p-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors border border-transparent hover:border-blue-200"
                    title={`Add ${def.label}`}
                  >
                    {getElementIcon(type)}
                    <span className="text-xs font-medium">{def.label!.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Elements List / Layers */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Layers ({currentTemplate.elements.length})
              </h3>
              <div className="space-y-1">
                {currentTemplate.elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                      selectedElement?.id === element.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <span className="text-gray-400 flex-shrink-0">
                      <GripIcon />
                    </span>
                    <span className="flex-shrink-0 text-gray-400">
                      {getElementIcon(element.type)}
                    </span>
                    <span className="truncate flex-1">{element.label}</span>
                    <div className="flex gap-0.5 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveElementLayer(element.id, 'up') }}
                        className="p-0.5 text-gray-400 hover:text-gray-600"
                        disabled={index === 0}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveElementLayer(element.id, 'down') }}
                        className="p-0.5 text-gray-400 hover:text-gray-600"
                        disabled={index === currentTemplate.elements.length - 1}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeElement(element.id) }}
                        className="p-0.5 text-gray-400 hover:text-red-500"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                ))}
                {currentTemplate.elements.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No elements added yet.<br />Click an element above to add it.</p>
                )}
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div
              ref={canvasRef}
              className="bg-white shadow-lg relative cursor-default flex-shrink-0"
              style={{
                width: currentTemplate.paperSize === 'A5' ? 420 : 595,
                minHeight: currentTemplate.paperSize === 'A5' ? 595 : 842,
              }}
              onClick={handleCanvasClick}
            >
              {/* Grid background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {currentTemplate.elements.map(renderCanvasElement)}
              {currentTemplate.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-lg font-medium">Empty Canvas</p>
                    <p className="text-sm mt-1">Add elements from the left panel to start building your receipt</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            {selectedElement ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Properties</h3>
                  <button
                    onClick={() => removeElement(selectedElement.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Delete element"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Label */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
                    <input
                      type="text"
                      value={selectedElement.label}
                      onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Content */}
                  {selectedElement.type !== 'line' && selectedElement.type !== 'logo' && selectedElement.type !== 'image' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-500">Content</label>
                        {(selectedElement.type === 'field' || selectedElement.type === 'text') && (
                          <button
                            onClick={() => setShowFieldPicker(!showFieldPicker)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            + Insert Field
                          </button>
                        )}
                      </div>
                      {selectedElement.type === 'table' ? (
                        <textarea
                          value={selectedElement.content}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          rows={6}
                          placeholder="Header1|Header2&#10;Row1Col1|Row1Col2"
                        />
                      ) : (
                        <input
                          type="text"
                          value={selectedElement.content}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      )}
                      {showFieldPicker && (
                        <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                          {availableFields.map((field) => (
                            <button
                              key={field.value}
                              onClick={() => {
                                updateElement(selectedElement.id, {
                                  content: selectedElement.content + ' ' + field.value,
                                })
                                setShowFieldPicker(false)
                              }}
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-0"
                            >
                              <span className="font-medium">{field.label}</span>
                              <span className="text-gray-400 ml-2 text-xs">{field.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {selectedElement.type === 'table' && (
                        <p className="text-xs text-gray-400 mt-1">Use | to separate columns, new lines for rows. First row is header.</p>
                      )}
                    </div>
                  )}

                  {/* Position */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-400">X</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Y</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-400">Width</label>
                        <input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Height</label>
                        <input
                          type="number"
                          value={selectedElement.height}
                          onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  {selectedElement.type !== 'line' && selectedElement.type !== 'image' && selectedElement.type !== 'logo' && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Typography</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-400">Size</label>
                            <input
                              type="number"
                              value={selectedElement.fontSize}
                              onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              min={6}
                              max={72}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-gray-400">Weight</label>
                            <select
                              value={selectedElement.fontWeight}
                              onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Alignment</label>
                          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            {['left', 'center', 'right'].map((align) => (
                              <button
                                key={align}
                                onClick={() => updateElement(selectedElement.id, { textAlign: align as 'left' | 'center' | 'right' })}
                                className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                                  selectedElement.textAlign === align
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {align.charAt(0).toUpperCase() + align.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Colors</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">
                          {selectedElement.type === 'line' ? 'Line Color' : 'Text Color'}
                        </span>
                      </div>
                      {selectedElement.showBorder && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.borderColor}
                            onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">Border Color</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Border Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">Show Border</label>
                    <button
                      onClick={() => updateElement(selectedElement.id, { showBorder: !selectedElement.showBorder })}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        selectedElement.showBorder ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          selectedElement.showBorder ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-sm text-gray-500 font-medium">No element selected</p>
                <p className="text-xs text-gray-400 mt-1">Click on an element in the canvas or layers panel to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}