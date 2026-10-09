import React, { useState, useMemo } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import {
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Database,
  Zap,
  FileText,
  Settings,
  Download,
  Users,
  CreditCard,
  TrendingUp,
  Eye,
  Filter,
  DollarSign,
  Activity,
  Target,
  Layers,
  BookOpen,
  AlertTriangle,
  Building,
  UserCheck,
  FileBarChart,
  ClipboardList,
  Search,
  Bell,
  Printer,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ShieldCheck,
  ShieldAlert,
  Link,
  Unlink,
  FileCheck,
  FilePlus,
  Smartphone,
  Globe,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeftRight,
  Wallet,
  Banknote,
  Receipt,
  GraduationCap,
  Hash,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  History,
  ListChecks,
  CircleDollarSign,
  LayoutList,
  Workflow,
} from 'lucide-react'

// Types
interface InfoPanelData {
  id: string
  title: string
  description: string
  dataSource: {
    title: string
    description: string
    tables?: string[]
  }
  whyItMatters: {
    title: string
    description: string
    benefits?: string[]
  }
  recommendedActions: {
    label: string
    description: string
  }[]
  formula?: string
  updateFrequency?: string
}

interface PostingBatch {
  id: string
  date: string
  type: string
  chargeHead: string
  count: number
  amount: number
  status: 'Posted' | 'Pending' | 'Processing' | 'Failed' | 'Validated'
  user: string
  validationStatus: 'Passed' | 'Failed' | 'Pending' | 'Warnings'
  validationErrors: number
  validationWarnings: number
  notificationsSent: boolean
  postingTime?: string
}

interface ValidationResult {
  id: string
  type: 'error' | 'warning' | 'success' | 'info'
  category: string
  message: string
  affectedRecords: number
  details?: string
}

interface UnpostedRecord {
  id: string
  studentId: string
  studentName: string
  class: string
  section: string
  chargeHead: string
  amount: number
  date: string
  validationStatus: 'Valid' | 'Invalid' | 'Warning'
  validationMessage?: string
  feeStructureMatch: boolean
  enrollmentVerified: boolean
}

interface NotificationConfig {
  id: string
  type: 'SMS' | 'Email' | 'Push' | 'WhatsApp'
  enabled: boolean
  template: string
  triggerOn: string
  lastSent?: string
  successRate?: number
}

// Info Panel Data
const infoPanelData: Record<string, InfoPanelData> = {
  postingCriteria: {
    id: 'postingCriteria',
    title: 'Posting Criteria & Filters',
    description: 'Define the criteria for selecting charges to be posted to the accounting ledger. You can filter by date range, transaction type, charge head, class, and status to precisely control which records are posted.',
    dataSource: {
      title: 'Data Source',
      description: 'Pulls unposted charge transactions from the charge master based on your filter criteria.',
      tables: ['charge_transactions', 'charge_master', 'student_charges', 'staff_charges']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Proper filtering ensures only validated charges are posted, preventing errors and maintaining accurate financial records.',
      benefits: [
        'Precise control over posting',
        'Batch processing efficiency',
        'Error prevention',
        'Audit trail maintenance'
      ]
    },
    recommendedActions: [
      { label: 'Preview Before Posting', description: 'Always review records before posting' },
      { label: 'Validate First', description: 'Run validation checks before posting' },
      { label: 'Check Date Range', description: 'Ensure correct period selection' },
      { label: 'Review Error Report', description: 'Check for validation failures' }
    ],
    updateFrequency: 'Filters apply in real-time'
  },
  feeMapping: {
    id: 'feeMapping',
    title: 'Fee Mapping & Validation',
    description: 'The system cross-references the Student Enrollment Register with the Fee Structure Master to ensure the right student is charged the right amount. This prevents errors like charging a Grade 5 student with Grade 10 lab fees or applying wrong concession types.',
    dataSource: {
      title: 'Data Source',
      description: 'Validates against Fee Structure Master and Student Enrollment Register to ensure accurate charge application.',
      tables: ['fee_structure_master', 'student_enrollment', 'class_fee_mapping', 'concession_master']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Accurate fee mapping prevents billing errors, reduces parent complaints, and ensures compliance with fee policies.',
      benefits: [
        'Prevents incorrect charges',
        'Ensures fee structure compliance',
        'Validates student eligibility',
        'Applies correct concessions',
        'Reduces billing disputes'
      ]
    },
    recommendedActions: [
      { label: 'Review Mapping Errors', description: 'Fix mismatched fee structures' },
      { label: 'Update Fee Structure', description: 'Ensure fee master is current' },
      { label: 'Verify Enrollments', description: 'Check student class assignments' },
      { label: 'Export Validation Report', description: 'Download detailed error log' }
    ],
    formula: 'Valid Charge = (Student Class = Fee Structure Class) AND (Amount = Structure Amount - Applicable Concession)',
    updateFrequency: 'Validated before each posting'
  },
  notifications: {
    id: 'notifications',
    title: 'Notification Triggers',
    description: 'Posting a charge serves as the trigger for automated communications including SMS/Email alerts to parents, updating the Parent Portal/App with the "Pay Now" balance, and generating PDF invoices or challans for download.',
    dataSource: {
      title: 'Data Source',
      description: 'Notification templates and contact details from parent/guardian master and communication preferences.',
      tables: ['notification_templates', 'parent_contacts', 'communication_preferences', 'notification_log']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Timely notifications improve collection rates, keep parents informed, and provide convenient payment options.',
      benefits: [
        'Instant parent notification',
        'Higher collection rates',
        'Reduced follow-up calls',
        'Digital payment enablement',
        'Automated invoice generation'
      ]
    },
    recommendedActions: [
      { label: 'Configure Templates', description: 'Customize notification messages' },
      { label: 'Test Notifications', description: 'Send test messages before bulk' },
      { label: 'Review Delivery Status', description: 'Check SMS/Email delivery rates' },
      { label: 'Update Contact Info', description: 'Ensure parent contacts are current' }
    ],
    updateFrequency: 'Triggered immediately on posting'
  },
  postingBatches: {
    id: 'postingBatches',
    title: 'Posting Batch History',
    description: 'Track all posting batches with their status, validation results, and notification delivery status. Each batch maintains a complete audit trail of what was posted, when, and by whom.',
    dataSource: {
      title: 'Data Source',
      description: 'Historical posting records from the batch processing system.',
      tables: ['posting_batches', 'posting_log', 'batch_transactions', 'audit_trail']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Batch tracking enables auditing, error recovery, and ensures accountability in the posting process.',
      benefits: [
        'Complete audit trail',
        'Error traceability',
        'Batch reversal capability',
        'Performance monitoring'
      ]
    },
    recommendedActions: [
      { label: 'View Batch Details', description: 'Drill down into specific batches' },
      { label: 'Repost Failed Batches', description: 'Retry failed postings' },
      { label: 'Export Batch Report', description: 'Download posting history' },
      { label: 'Review Posting Logs', description: 'Check detailed transaction logs' }
    ],
    updateFrequency: 'Updated with each posting action'
  },
  postingLogic: {
    id: 'postingLogic',
    title: 'Posting Logic & Accounting Entries',
    description: 'Understand how charges are posted to accounting ledgers. Each transaction type has specific debit and credit rules that ensure proper double-entry bookkeeping and accurate financial reporting.',
    dataSource: {
      title: 'Data Source',
      description: 'Posting rules from the Chart of Accounts and accounting configuration.',
      tables: ['chart_of_accounts', 'posting_rules', 'ledger_master', 'account_mapping']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Correct posting logic ensures accurate financial statements, proper receivables tracking, and audit compliance.',
      benefits: [
        'Accurate financial records',
        'Proper receivable tracking',
        'Audit compliance',
        'Report accuracy'
      ]
    },
    recommendedActions: [
      { label: 'Review Account Mapping', description: 'Verify ledger assignments' },
      { label: 'Test Posting Rules', description: 'Validate in test environment' },
      { label: 'Export Journal Entries', description: 'Download posted transactions' },
      { label: 'Reconcile Ledgers', description: 'Match with accounting system' }
    ],
    formula: 'For every Debit, there must be an equal Credit (Double-Entry)',
    updateFrequency: 'Rules applied at posting time'
  }
}

// Info Panel Modal Component
interface InfoPanelModalProps {
  isOpen: boolean
  onClose: () => void
  data: InfoPanelData | null
}

const InfoPanelModal: React.FC<InfoPanelModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start rounded-t-2xl">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
            {data.updateFrequency && (
              <div className="flex items-center gap-2 mt-2">
                <RefreshCw className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{data.updateFrequency}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
          </div>

          {data.formula && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Logic / Formula</span>
              </div>
              <code className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200 block">
                {data.formula}
              </code>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase">
                  {data.dataSource.title}
                </h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                {data.dataSource.description}
              </p>
              {data.dataSource.tables && (
                <div className="flex flex-wrap gap-2">
                  {data.dataSource.tables.map((table, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {table}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 text-sm uppercase">
                  {data.whyItMatters.title}
                </h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                {data.whyItMatters.description}
              </p>
              {data.whyItMatters.benefits && (
                <ul className="space-y-1">
                  {data.whyItMatters.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-purple-700">
                      <CheckCircle className="w-3 h-3 text-purple-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-700 text-sm uppercase">Recommended Actions</h3>
            </div>
            <div className="space-y-2">
              {data.recommendedActions.map((action, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Guide
          </Button>
        </div>
      </div>
    </div>
  )
}

// Info Button Component
interface InfoButtonProps {
  onClick: () => void
  className?: string
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick, className = '' }) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${className}`}
    title="View Details"
  >
    <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
  </button>
)

export function ChargePosting() {
  // State
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [transactionType, setTransactionType] = useState('all')
  const [chargeHead, setChargeHead] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')
  const [postingStatus, setPostingStatus] = useState('pending')
  const [isPosting, setIsPosting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [showValidationResults, setShowValidationResults] = useState(false)
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const [selectedInfoPanel, setSelectedInfoPanel] = useState<InfoPanelData | null>(null)
  const [activeTab, setActiveTab] = useState<'posting' | 'validation' | 'notifications'>('posting')
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null)

  // Notification toggles
  const [notificationSettings, setNotificationSettings] = useState({
    sms: true,
    email: true,
    push: true,
    whatsapp: false,
    portalUpdate: true,
    generateInvoice: true,
  })

  // Open info panel
  const openInfoPanel = (panelId: string) => {
    const data = infoPanelData[panelId]
    if (data) {
      setSelectedInfoPanel(data)
      setInfoPanelOpen(true)
    }
  }

  // Mock posting batches
  const postingBatches: PostingBatch[] = [
    {
      id: 'BATCH-2024-0156',
      date: '2024-03-15 10:30 AM',
      type: 'Charge Raised',
      chargeHead: 'Lab Breakage',
      count: 45,
      amount: 125000,
      status: 'Posted',
      user: 'Admin Kumar',
      validationStatus: 'Passed',
      validationErrors: 0,
      validationWarnings: 2,
      notificationsSent: true,
      postingTime: '2.3 sec'
    },
    {
      id: 'BATCH-2024-0155',
      date: '2024-03-15 09:15 AM',
      type: 'Charge Receipt',
      chargeHead: 'Library Fines',
      count: 120,
      amount: 45000,
      status: 'Posted',
      user: 'System',
      validationStatus: 'Passed',
      validationErrors: 0,
      validationWarnings: 0,
      notificationsSent: true,
      postingTime: '3.8 sec'
    },
    {
      id: 'BATCH-2024-0154',
      date: '2024-03-14 04:45 PM',
      type: 'Charge Raised',
      chargeHead: 'Property Damage',
      count: 8,
      amount: 28000,
      status: 'Pending',
      user: 'Admin Kumar',
      validationStatus: 'Warnings',
      validationErrors: 0,
      validationWarnings: 3,
      notificationsSent: false
    },
    {
      id: 'BATCH-2024-0153',
      date: '2024-03-14 02:30 PM',
      type: 'Cancellation',
      chargeHead: 'Certificate Fee',
      count: 5,
      amount: 2500,
      status: 'Failed',
      user: 'Accounts Staff',
      validationStatus: 'Failed',
      validationErrors: 2,
      validationWarnings: 1,
      notificationsSent: false
    },
    {
      id: 'BATCH-2024-0152',
      date: '2024-03-14 11:00 AM',
      type: 'Charge Raised',
      chargeHead: 'Multiple',
      count: 250,
      amount: 450000,
      status: 'Processing',
      user: 'System',
      validationStatus: 'Pending',
      validationErrors: 0,
      validationWarnings: 0,
      notificationsSent: false
    },
  ]

  // Mock validation results
  const validationResults: ValidationResult[] = [
    {
      id: '1',
      type: 'error',
      category: 'Fee Structure Mismatch',
      message: '3 students charged with wrong class fee structure',
      affectedRecords: 3,
      details: 'Students from Class 5 charged with Class 10 lab fees'
    },
    {
      id: '2',
      type: 'warning',
      category: 'Enrollment Verification',
      message: '5 students have inactive enrollment status',
      affectedRecords: 5,
      details: 'Charges posted to students marked as TC issued or inactive'
    },
    {
      id: '3',
      type: 'warning',
      category: 'Concession Application',
      message: '2 students eligible for concession but not applied',
      affectedRecords: 2,
      details: 'RTE students charged full amount without concession'
    },
    {
      id: '4',
      type: 'success',
      category: 'Amount Validation',
      message: '112 records passed amount validation',
      affectedRecords: 112,
      details: 'All charge amounts match fee structure master'
    },
    {
      id: '5',
      type: 'info',
      category: 'Duplicate Check',
      message: 'No duplicate charges found',
      affectedRecords: 0,
      details: 'All charges are unique for the posting period'
    },
  ]

  // Mock unposted records
  const unpostedRecords: UnpostedRecord[] = [
    {
      id: '1',
      studentId: 'STU-2024-0892',
      studentName: 'Rahul Sharma',
      class: 'Class 10',
      section: 'A',
      chargeHead: 'Lab Breakage',
      amount: 2500,
      date: '2024-03-15',
      validationStatus: 'Valid',
      feeStructureMatch: true,
      enrollmentVerified: true
    },
    {
      id: '2',
      studentId: 'STU-2024-0456',
      studentName: 'Priya Gupta',
      class: 'Class 9',
      section: 'B',
      chargeHead: 'Library Fine',
      amount: 350,
      date: '2024-03-15',
      validationStatus: 'Valid',
      feeStructureMatch: true,
      enrollmentVerified: true
    },
    {
      id: '3',
      studentId: 'STU-2024-0123',
      studentName: 'Amit Kumar',
      class: 'Class 5',
      section: 'A',
      chargeHead: 'Lab Breakage',
      amount: 3500,
      date: '2024-03-15',
      validationStatus: 'Invalid',
      validationMessage: 'Fee structure mismatch - Class 5 lab fee is ₹1,500',
      feeStructureMatch: false,
      enrollmentVerified: true
    },
    {
      id: '4',
      studentId: 'STU-2024-0789',
      studentName: 'Sneha Reddy',
      class: 'Class 8',
      section: 'C',
      chargeHead: 'Property Damage',
      amount: 5000,
      date: '2024-03-15',
      validationStatus: 'Warning',
      validationMessage: 'Student has inactive status',
      feeStructureMatch: true,
      enrollmentVerified: false
    },
  ]

  // Notification configurations
  const notificationConfigs: NotificationConfig[] = [
    {
      id: '1',
      type: 'SMS',
      enabled: notificationSettings.sms,
      template: 'Charge Alert: ₹{amount} charged for {reason}. Pay at: {link}',
      triggerOn: 'Charge Posted',
      lastSent: '10 mins ago',
      successRate: 98.5
    },
    {
      id: '2',
      type: 'Email',
      enabled: notificationSettings.email,
      template: 'Detailed charge notification with invoice attachment',
      triggerOn: 'Charge Posted',
      lastSent: '10 mins ago',
      successRate: 99.2
    },
    {
      id: '3',
      type: 'Push',
      enabled: notificationSettings.push,
      template: 'New charge of ₹{amount} added. Tap to view details.',
      triggerOn: 'Charge Posted',
      lastSent: '10 mins ago',
      successRate: 95.8
    },
    {
      id: '4',
      type: 'WhatsApp',
      enabled: notificationSettings.whatsapp,
      template: 'WhatsApp message with payment link and QR code',
      triggerOn: 'Charge Posted',
      lastSent: 'Not configured',
      successRate: 0
    },
  ]

  // Stats
  const stats = {
    unpostedRecords: 120,
    totalValue: 450000,
    validRecords: 112,
    invalidRecords: 3,
    warningRecords: 5,
    pendingApprovals: 8,
  }

  // Handle posting
  const handlePost = () => {
    if (stats.invalidRecords > 0) {
      alert('Cannot post with validation errors. Please fix errors first.')
      return
    }
    setIsPosting(true)
    setTimeout(() => {
      setIsPosting(false)
      alert('Posting completed successfully!')
    }, 2000)
  }

  // Handle validation
  const handleValidate = () => {
    setIsValidating(true)
    setTimeout(() => {
      setIsValidating(false)
      setShowValidationResults(true)
    }, 1500)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Posted':
        return <Badge variant="success">Posted</Badge>
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>
      case 'Processing':
        return <Badge variant="info">Processing</Badge>
      case 'Failed':
        return <Badge variant="error">Failed</Badge>
      case 'Validated':
        return <Badge variant="success">Validated</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get validation status badge
  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Passed
          </span>
        )
      case 'Failed':
        return (
          <span className="flex items-center gap-1 text-red-600 text-sm">
            <XCircle className="w-4 h-4" />
            Failed
          </span>
        )
      case 'Warnings':
        return (
          <span className="flex items-center gap-1 text-amber-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Warnings
          </span>
        )
      case 'Pending':
        return (
          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        )
      default:
        return <span className="text-sm text-gray-500">{status}</span>
    }
  }

  // Get validation result icon
  const getValidationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Info Panel Modal */}
      <InfoPanelModal
        isOpen={infoPanelOpen}
        onClose={() => setInfoPanelOpen(false)}
        data={selectedInfoPanel}
      />

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              Charge Posting
            </h1>
            <p className="text-gray-500 mt-1">
              Post charge transactions to accounting ledgers with validation and notifications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.unpostedRecords}</p>
            <p className="text-xs text-gray-500">Unposted Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">₹{(stats.totalValue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Total Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.validRecords}</p>
            <p className="text-xs text-gray-500">Valid Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.invalidRecords}</p>
            <p className="text-xs text-gray-500">Invalid Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.warningRecords}</p>
            <p className="text-xs text-gray-500">Warnings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
            <p className="text-xs text-gray-500">Pending Approvals</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex gap-2">
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'posting'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('posting')}
          >
            <Upload className="w-4 h-4" />
            Posting & Batches
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'validation'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('validation')}
          >
            <ShieldCheck className="w-4 h-4" />
            Fee Mapping & Validation
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-4 h-4" />
            Notification Triggers
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posting' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Posting Controls */}
          <Card className="h-fit overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Posting Criteria</h2>
              </div>
              <InfoButton onClick={() => openInfoPanel('postingCriteria')} />
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="From Date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="To Date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <Select
                label="Transaction Type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'raised', label: 'Charges Raised' },
                  { value: 'receipt', label: 'Charge Receipts' },
                  { value: 'cancel', label: 'Cancellations' },
                  { value: 'waiver', label: 'Waivers' },
                ]}
              />

              <Select
                label="Charge Head"
                value={chargeHead}
                onChange={(e) => setChargeHead(e.target.value)}
                options={[
                  { value: 'all', label: 'All Charge Heads' },
                  { value: 'lab', label: 'Lab Breakage' },
                  { value: 'library', label: 'Library Fines' },
                  { value: 'property', label: 'Property Damage' },
                  { value: 'certificate', label: 'Certificate Fees' },
                  { value: 'uniform', label: 'Uniform/ID Replacement' },
                  { value: 'discipline', label: 'Discipline Fines' },
                  { value: 'other', label: 'Other Charges' },
                ]}
              />

              <Select
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { value: 'all', label: 'All Classes' },
                  { value: 'nursery', label: 'Nursery' },
                  { value: 'lkg', label: 'LKG' },
                  { value: 'ukg', label: 'UKG' },
                  ...Array.from({ length: 12 }, (_, i) => ({
                    value: `class-${i + 1}`,
                    label: `Class ${i + 1}`
                  }))
                ]}
              />

              <Select
                label="Posting Status"
                value={postingStatus}
                onChange={(e) => setPostingStatus(e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending Only' },
                  { value: 'all', label: 'All Statuses' },
                  { value: 'validated', label: 'Validated Only' },
                  { value: 'failed', label: 'Failed Only' },
                ]}
              />

              {/* Summary */}
              <div className="pt-4 border-t border-gray-100">
                <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-700">Unposted Records:</span>
                    <span className="font-bold text-indigo-900">{stats.unpostedRecords}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-700">Total Value:</span>
                    <span className="font-bold text-indigo-900">₹{stats.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Ready to Post:</span>
                    <span className="font-bold text-green-900">{stats.validRecords}</span>
                  </div>
                  {stats.invalidRecords > 0 && (
                    <div className="flex items-center justify-between text-red-600">
                      <span className="text-sm">Errors (Fix Required):</span>
                      <span className="font-bold">{stats.invalidRecords}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleValidate}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Validate Records
                    </>
                  )}
                </Button>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handlePost}
                  disabled={isPosting || stats.invalidRecords > 0}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Post to Accounting
                    </>
                  )}
                </Button>

                {stats.invalidRecords > 0 && (
                  <p className="text-xs text-red-600 text-center">
                    Fix {stats.invalidRecords} validation errors before posting
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Right: Batch History & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posting Batches */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <LayoutList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Posting Batches</h3>
                    <p className="text-xs text-gray-500">Recent posting history</p>
                  </div>
                </div>
                <InfoButton onClick={() => openInfoPanel('postingBatches')} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Batch ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Records</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Validation</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {postingBatches.map((batch) => (
                      <React.Fragment key={batch.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-900">{batch.id}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{batch.date}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-900">{batch.type}</p>
                              <p className="text-xs text-gray-500">{batch.chargeHead}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">{batch.count}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            ₹{batch.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">{getStatusBadge(batch.status)}</td>
                          <td className="px-4 py-3 text-center">{getValidationBadge(batch.validationStatus)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {batch.status === 'Pending' && (
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              {batch.status === 'Failed' && (
                                <Button variant="ghost" size="sm" className="text-amber-600">
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedBatch === batch.id && (
                          <tr>
                            <td colSpan={8} className="px-4 py-4 bg-gray-50">
                              <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500">Posted By</p>
                                  <p className="font-medium text-gray-900">{batch.user}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500">Processing Time</p>
                                  <p className="font-medium text-gray-900">{batch.postingTime || 'N/A'}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500">Notifications Sent</p>
                                  <p className="font-medium text-gray-900">
                                    {batch.notificationsSent ? (
                                      <span className="text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> Yes
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> No
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500">Errors / Warnings</p>
                                  <p className="font-medium">
                                    <span className="text-red-600">{batch.validationErrors}</span>
                                    {' / '}
                                    <span className="text-amber-600">{batch.validationWarnings}</span>
                                  </p>
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
            </Card>

            {/* Posting Logic Preview */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Workflow className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Posting Logic Preview</h3>
                </div>
                <InfoButton onClick={() => openInfoPanel('postingLogic')} />
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Charge Raised */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CircleDollarSign className="w-5 h-5 text-blue-600" />
                      Charge Raised (Posting)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">Debit</p>
                        <p className="font-medium text-green-900">Student/Staff Receivable</p>
                        <p className="text-xs text-green-600 mt-1">Increases amount owed</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700 uppercase font-bold mb-1">Credit</p>
                        <p className="font-medium text-red-900">Charge Income A/c</p>
                        <p className="text-xs text-red-600 mt-1">Revenue recognition</p>
                      </div>
                    </div>
                  </div>

                  {/* Charge Receipt */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-green-600" />
                      Charge Receipt (Collection)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">Debit</p>
                        <p className="font-medium text-green-900">Cash / Bank A/c</p>
                        <p className="text-xs text-green-600 mt-1">Based on payment mode</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700 uppercase font-bold mb-1">Credit</p>
                        <p className="font-medium text-red-900">Student/Staff Receivable</p>
                        <p className="text-xs text-red-600 mt-1">Reduces outstanding</p>
                      </div>
                    </div>
                  </div>

                  {/* Waiver */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Charge Waiver
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">Debit</p>
                        <p className="font-medium text-green-900">Waiver/Write-off A/c</p>
                        <p className="text-xs text-green-600 mt-1">Expense recognition</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700 uppercase font-bold mb-1">Credit</p>
                        <p className="font-medium text-red-900">Student/Staff Receivable</p>
                        <p className="text-xs text-red-600 mt-1">Reduces outstanding</p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Charge Cancellation
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">Debit</p>
                        <p className="font-medium text-green-900">Charge Income A/c</p>
                        <p className="text-xs text-green-600 mt-1">Reverses income</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700 uppercase font-bold mb-1">Credit</p>
                        <p className="font-medium text-red-900">Student/Staff Receivable</p>
                        <p className="text-xs text-red-600 mt-1">Reduces outstanding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fee Mapping Info */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Link className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-gray-900">Fee Mapping</h2>
              </div>
              <InfoButton onClick={() => openInfoPanel('feeMapping')} />
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Cross-Reference
                </h4>
                <p className="text-sm text-blue-800">
                  The system validates each charge against:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Student Enrollment Register
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Fee Structure Master
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Concession/Exemption Rules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Class-wise Charge Mapping
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Validation Checks
                </h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Class matches fee structure assignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Amount equals structure amount minus concessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Student enrollment is active</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>No duplicate charges exist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Charge head is valid for student class</span>
                  </li>
                </ul>
              </div>

              <Button variant="primary" className="w-full" onClick={handleValidate} disabled={isValidating}>
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Validation...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Run Full Validation
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Validation Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Validation Summary */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-gray-600" />
                  Validation Results
                </h3>
              </div>

              <div className="p-6">
                {!showValidationResults ? (
                  <div className="text-center py-12">
                    <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No Validation Run</h4>
                    <p className="text-gray-500 mb-4">Click "Run Full Validation" to check records</p>
                    <Button variant="outline" onClick={handleValidate}>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Start Validation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-700">112</p>
                        <p className="text-xs text-green-600">Passed</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-700">3</p>
                        <p className="text-xs text-red-600">Errors</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-700">5</p>
                        <p className="text-xs text-amber-600">Warnings</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                        <Info className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-700">120</p>
                        <p className="text-xs text-blue-600">Total Records</p>
                      </div>
                    </div>

                    {/* Validation Details */}
                    <div className="space-y-3">
                      {validationResults.map((result) => (
                        <div
                          key={result.id}
                          className={`p-4 rounded-lg border ${
                            result.type === 'error'
                              ? 'bg-red-50 border-red-200'
                              : result.type === 'warning'
                              ? 'bg-amber-50 border-amber-200'
                              : result.type === 'success'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {getValidationIcon(result.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{result.category}</h4>
                                <Badge
                                  variant={
                                    result.type === 'error'
                                      ? 'error'
                                      : result.type === 'warning'
                                      ? 'warning'
                                      : 'success'
                                  }
                                >
                                  {result.affectedRecords} records
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                              {result.details && (
                                <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                              )}
                            </div>
                            {result.type === 'error' && (
                              <Button variant="outline" size="sm">
                                Fix Now
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Records with Issues */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  Records Requiring Attention
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Issues
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Class</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Charge</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Fee Match</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Enrollment</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unpostedRecords.filter(r => r.validationStatus !== 'Valid').map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{record.studentName}</p>
                            <p className="text-xs text-gray-500">{record.studentId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.class}-{record.section}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.chargeHead}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          ₹{record.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.feeStructureMatch ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.enrollmentVerified ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={
                              record.validationStatus === 'Valid'
                                ? 'success'
                                : record.validationStatus === 'Warning'
                                ? 'warning'
                                : 'error'
                            }
                          >
                            {record.validationStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Settings */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900">Notification Settings</h2>
              </div>
              <InfoButton onClick={() => openInfoPanel('notifications')} />
            </div>

            <div className="p-6 space-y-4">
              {/* Notification Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-xs text-gray-500">Send SMS to parents</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, sms: !prev.sms }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.sms ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.sms ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-500">Send detailed email with invoice</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, email: !prev.email }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.email ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.email ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-500">App push notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, push: !prev.push }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.push ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.push ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <p className="text-xs text-gray-500">WhatsApp business messages</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.whatsapp ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.whatsapp ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Update Parent Portal</p>
                      <p className="text-xs text-gray-500">Update "Pay Now" balance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, portalUpdate: !prev.portalUpdate }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.portalUpdate ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.portalUpdate ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Generate PDF Invoice</p>
                      <p className="text-xs text-gray-500">Auto-generate invoice/challan</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, generateInvoice: !prev.generateInvoice }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings.generateInvoice ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        notificationSettings.generateInvoice ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Channels & Templates */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trigger Flow */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-gray-600" />
                  Notification Trigger Flow
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Charge Posted</p>
                    <p className="text-xs text-gray-500">Trigger Event</p>
                  </div>

                  <ArrowRight className="w-6 h-6 text-gray-300" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <Bell className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Send Alerts</p>
                    <p className="text-xs text-gray-500">SMS, Email, Push</p>
                  </div>

                  <ArrowRight className="w-6 h-6 text-gray-300" />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Globe className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Update Portal</p>
                    <p className="text-xs text-gray-500">Parent App/Web</p>
                  </div>

                  <ArrowRight className="w-6 h-6 text-gray-300" />

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Generate PDF</p>
                    <p className="text-xs text-gray-500">Invoice/Challan</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Channel Status */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  Channel Status & Performance
                </h3>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Templates
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Channel</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Template</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Last Sent</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Success Rate</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {notificationConfigs.map((config) => (
                      <tr key={config.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {config.type === 'SMS' && <MessageSquare className="w-5 h-5 text-blue-600" />}
                            {config.type === 'Email' && <Mail className="w-5 h-5 text-red-600" />}
                            {config.type === 'Push' && <Smartphone className="w-5 h-5 text-purple-600" />}
                            {config.type === 'WhatsApp' && <Phone className="w-5 h-5 text-green-600" />}
                            <span className="font-medium text-gray-900">{config.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {config.enabled ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="warning">Disabled</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 truncate max-w-xs">{config.template}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{config.lastSent}</td>
                        <td className="px-6 py-4 text-center">
                          {config.successRate > 0 ? (
                            <span className={`font-medium ${
                              config.successRate >= 95 ? 'text-green-600' : 
                              config.successRate >= 80 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {config.successRate}%
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Sample Notification Preview */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  Notification Preview
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SMS Preview */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3">
                      SMS Preview
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-800">
                        Dear Parent, a charge of ₹2,500 has been posted for Lab Breakage 
                        against your ward Rahul Sharma (Class 10-A). 
                        Pay online: https://pay.school.edu/xyz123
                      </p>
                      <p className="text-xs text-gray-400 mt-2">160 characters</p>
                    </div>
                  </div>

                  {/* Push Notification Preview */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3">
                      Push Notification Preview
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">School App</p>
                          <p className="text-sm text-gray-700">
                            New charge of ₹2,500 added. Tap to view details and pay.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Email Template
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Notification
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

// Add missing Smartphone component
const Smartphone = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
)