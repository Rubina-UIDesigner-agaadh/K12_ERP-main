import React, { useState, useMemo } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  Wallet,
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
  Receipt,
  RotateCcw,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  History,
  FileText,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Building2,
  Tag,
  MessageSquare,
  Image,
  Upload,
  Trash2,
  Eye,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  PieChart,
  Zap,
  Database,
  HelpCircle,
  Minus,
  Calculator,
  Banknote,
  CreditCard,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Hash,
  Briefcase,
  Send,
  ArrowRight,
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Lock,
  Unlock,
} from 'lucide-react'
// --- Types ---
interface CashAccount {
  id: string
  name: string
  code: string
  department: string
  custodian: string
  balance: number
  monthlyLimit: number
  monthlySpent: number
  lastTransaction: string
  status: 'active' | 'low_balance' | 'inactive'
}
interface ExpenseHead {
  id: string
  name: string
  code: string
  category: string
  limit: number
  requiresReceipt: boolean
  description: string
}
interface RecentExpense {
  id: string
  date: string
  time: string
  head: string
  amount: number
  remark: string
  account: string
  recordedBy: string
  status: 'recorded' | 'verified' | 'rejected'
  hasReceipt: boolean
}
interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  dataSource: string[]
  whyItMatters: string[]
}
// --- Info Modal Component ---
function InfoModal({
  isOpen,
  onClose,
  title,
  description,
  dataSource,
  whyItMatters,
}: InfoModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 uppercase text-sm tracking-wide">
                  Data Source
                </h3>
              </div>
              <ul className="space-y-2">
                {dataSource.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-blue-800"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 uppercase text-sm tracking-wide">
                  Why It Matters
                </h3>
              </div>
              <ul className="space-y-2">
                {whyItMatters.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-purple-800"
                  >
                    <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
// --- Mock Data ---
const CASH_ACCOUNTS: CashAccount[] = [
  {
    id: 'cash_sports',
    name: 'Sports Department Cash Box',
    code: 'PC-SPORTS-01',
    department: 'Sports & Activities',
    custodian: 'Coach Rohan Kumar',
    balance: 5000,
    monthlyLimit: 15000,
    monthlySpent: 8500,
    lastTransaction: '2024-03-24 02:30 PM',
    status: 'active',
  },
  {
    id: 'cash_admin',
    name: 'Admin Office Petty Cash',
    code: 'PC-ADMIN-01',
    department: 'Administration',
    custodian: 'Ms. Anjali Sharma',
    balance: 12500,
    monthlyLimit: 25000,
    monthlySpent: 12000,
    lastTransaction: '2024-03-25 10:15 AM',
    status: 'active',
  },
  {
    id: 'cash_library',
    name: 'Library Miscellaneous Fund',
    code: 'PC-LIB-01',
    department: 'Library',
    custodian: 'Ms. Priya Menon',
    balance: 850,
    monthlyLimit: 5000,
    monthlySpent: 4150,
    lastTransaction: '2024-03-23 04:45 PM',
    status: 'low_balance',
  },
  {
    id: 'cash_lab',
    name: 'Science Lab Petty Cash',
    code: 'PC-LAB-01',
    department: 'Science Lab',
    custodian: 'Mr. David Wilson',
    balance: 3200,
    monthlyLimit: 10000,
    monthlySpent: 6800,
    lastTransaction: '2024-03-24 11:30 AM',
    status: 'active',
  },
]
const EXPENSE_HEADS: ExpenseHead[] = [
  {
    id: 'refreshments',
    name: 'Refreshments / Tea',
    code: 'EXP-REF',
    category: 'Hospitality',
    limit: 500,
    requiresReceipt: false,
    description: 'Tea, coffee, snacks for guests and meetings',
  },
  {
    id: 'transport',
    name: 'Local Conveyance',
    code: 'EXP-TRN',
    category: 'Transport',
    limit: 1000,
    requiresReceipt: true,
    description: 'Auto, taxi, local travel expenses',
  },
  {
    id: 'stationery',
    name: 'Small Stationery',
    code: 'EXP-STN',
    category: 'Supplies',
    limit: 500,
    requiresReceipt: true,
    description: 'Pens, pencils, notebooks, small supplies',
  },
  {
    id: 'cleaning',
    name: 'Cleaning Supplies',
    code: 'EXP-CLN',
    category: 'Maintenance',
    limit: 800,
    requiresReceipt: true,
    description: 'Cleaning materials, dusters, sanitizers',
  },
  {
    id: 'repairs',
    name: 'Minor Repairs',
    code: 'EXP-REP',
    category: 'Maintenance',
    limit: 2000,
    requiresReceipt: true,
    description: 'Small repair work, spare parts',
  },
  {
    id: 'printing',
    name: 'Printing & Photocopying',
    code: 'EXP-PRT',
    category: 'Office',
    limit: 500,
    requiresReceipt: true,
    description: 'Xerox, printouts, lamination',
  },
  {
    id: 'courier',
    name: 'Courier & Postage',
    code: 'EXP-COR',
    category: 'Communication',
    limit: 500,
    requiresReceipt: true,
    description: 'Speed post, courier charges',
  },
  {
    id: 'emergency',
    name: 'Emergency Expenses',
    code: 'EXP-EMR',
    category: 'Miscellaneous',
    limit: 1500,
    requiresReceipt: true,
    description: 'Urgent unforeseen expenses',
  },
]
const RECENT_EXPENSES: RecentExpense[] = [
  {
    id: 'EXP-001',
    date: '2024-03-25',
    time: '10:15 AM',
    head: 'Refreshments / Tea',
    amount: 250,
    remark: 'Tea and snacks for parent meeting',
    account: 'Admin Office Petty Cash',
    recordedBy: 'Ms. Anjali Sharma',
    status: 'verified',
    hasReceipt: false,
  },
  {
    id: 'EXP-002',
    date: '2024-03-24',
    time: '03:30 PM',
    head: 'Local Conveyance',
    amount: 450,
    remark: 'Auto fare for document submission to board office',
    account: 'Admin Office Petty Cash',
    recordedBy: 'Mr. Rajesh Kumar',
    status: 'recorded',
    hasReceipt: true,
  },
  {
    id: 'EXP-003',
    date: '2024-03-24',
    time: '11:00 AM',
    head: 'Cleaning Supplies',
    amount: 380,
    remark: 'Floor cleaner and sanitizer',
    account: 'Admin Office Petty Cash',
    recordedBy: 'Ms. Anjali Sharma',
    status: 'verified',
    hasReceipt: true,
  },
  {
    id: 'EXP-004',
    date: '2024-03-23',
    time: '02:45 PM',
    head: 'Minor Repairs',
    amount: 650,
    remark: 'Door handle repair in staff room',
    account: 'Admin Office Petty Cash',
    recordedBy: 'Mr. David Wilson',
    status: 'verified',
    hasReceipt: true,
  },
  {
    id: 'EXP-005',
    date: '2024-03-23',
    time: '09:30 AM',
    head: 'Small Stationery',
    amount: 180,
    remark: 'Markers and chart papers',
    account: 'Library Miscellaneous Fund',
    recordedBy: 'Ms. Priya Menon',
    status: 'recorded',
    hasReceipt: true,
  },
]
const EXPENSE_LIMITS = [
  { limit: 200, receipt: 'Not mandatory (handwritten OK)', approval: 'Self' },
  { limit: 500, receipt: 'Printed receipt preferred', approval: 'Self' },
  {
    limit: 1000,
    receipt: 'Printed receipt mandatory',
    approval: 'Department Head',
  },
  { limit: 2000, receipt: 'GST bill required', approval: 'Admin Head' },
]
export function PettyCashExpenseEntry() {
  // --- State ---
  const [selectedAccount, setSelectedAccount] = useState('')
  const [expenseHead, setExpenseHead] = useState('')
  const [amount, setAmount] = useState<string>('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  )
  const [remark, setRemark] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAccountDetails, setShowAccountDetails] = useState(true)
  const [showRecentExpenses, setShowRecentExpenses] = useState(true)
  const [showExpenseHeadDetails, setShowExpenseHeadDetails] = useState(false)
  const [vendorName, setVendorName] = useState('')
  const [billNumber, setBillNumber] = useState('')
  const [paidTo, setPaidTo] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')
  const [historyFilter, setHistoryFilter] = useState('all')
  // --- Derived Data ---
  const currentAccount = useMemo(() => {
    return CASH_ACCOUNTS.find((a) => a.id === selectedAccount)
  }, [selectedAccount])
  const currentExpenseHead = useMemo(() => {
    return EXPENSE_HEADS.find((h) => h.id === expenseHead)
  }, [expenseHead])
  const availableBalance = currentAccount?.balance || 0
  const enteredAmount = parseFloat(amount) || 0
  const isOverLimit = enteredAmount > availableBalance
  const isOverHeadLimit =
    currentExpenseHead && enteredAmount > currentExpenseHead.limit
  const requiresReceipt = currentExpenseHead?.requiresReceipt && !receipt
  const isValid =
    selectedAccount &&
    expenseHead &&
    enteredAmount > 0 &&
    !isOverLimit &&
    remark.trim().length >= 10
  // Calculate stats
  const stats = useMemo(() => {
    const totalBalance = CASH_ACCOUNTS.reduce((sum, a) => sum + a.balance, 0)
    const totalSpentToday = RECENT_EXPENSES.filter(
      (e) => e.date === date,
    ).reduce((sum, e) => sum + e.amount, 0)
    const pendingVerification = RECENT_EXPENSES.filter(
      (e) => e.status === 'recorded',
    ).length
    const lowBalanceAccounts = CASH_ACCOUNTS.filter(
      (a) => a.status === 'low_balance',
    ).length
    return {
      totalBalance,
      totalSpentToday,
      pendingVerification,
      lowBalanceAccounts,
    }
  }, [date])
  // Filter expenses for history
  const filteredExpenses = useMemo(() => {
    if (historyFilter === 'all') return RECENT_EXPENSES
    return RECENT_EXPENSES.filter((e) => e.status === historyFilter)
  }, [historyFilter])
  // Get approval requirement based on amount
  const approvalInfo = useMemo(() => {
    for (let i = EXPENSE_LIMITS.length - 1; i >= 0; i--) {
      if (enteredAmount <= EXPENSE_LIMITS[i].limit) {
        return EXPENSE_LIMITS[i]
      }
    }
    return EXPENSE_LIMITS[EXPENSE_LIMITS.length - 1]
  }, [enteredAmount])
  // --- Handlers ---
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId)
    setShowAccountDetails(true)
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReceipt(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const removeReceipt = () => {
    setReceipt(null)
    setReceiptPreview(null)
  }
  const handleSave = async () => {
    if (!isValid) return
    setIsProcessing(true)
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setIsSuccess(true)
    // Reset Form after delay
    setTimeout(() => {
      setIsSuccess(false)
      setAmount('')
      setRemark('')
      setReceipt(null)
      setReceiptPreview(null)
      setExpenseHead('')
      setVendorName('')
      setBillNumber('')
      setPaidTo('')
      // Keep account selected for rapid entry
    }, 2500)
  }
  const resetForm = () => {
    setSelectedAccount('')
    setExpenseHead('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setRemark('')
    setReceipt(null)
    setReceiptPreview(null)
    setVendorName('')
    setBillNumber('')
    setPaidTo('')
  }
  const getStatusBadge = (status: RecentExpense['status']) => {
    switch (status) {
      case 'recorded':
        return <Badge variant="warning">Recorded</Badge>
      case 'verified':
        return <Badge variant="success">Verified</Badge>
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>
    }
  }
  const getAccountStatusBadge = (status: CashAccount['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'low_balance':
        return <Badge variant="warning">Low Balance</Badge>
      case 'inactive':
        return <Badge variant="danger">Inactive</Badge>
    }
  }
  const generateExpenseId = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `EXP-${month}${day}-XXX`
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Petty Cash Expense Entry
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Record small cash outflows instantly from department cash
                  boxes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('entry')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'entry' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  New Entry
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                >
                  <History className="w-4 h-4 mr-2 inline" />
                  History
                </button>
              </div>

              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  ₹{stats.totalBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Cash Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{stats.totalSpentToday.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Spent Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.pendingVerification}
                </p>
                <p className="text-xs text-gray-500">Pending Verification</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {stats.lowBalanceAccounts}
                </p>
                <p className="text-xs text-gray-500">Low Balance Accounts</p>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'entry' ? (
          /* Entry Form View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Selection */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                {isSuccess && (
                  <div className="absolute inset-0 bg-green-50 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-green-800">
                      Expense Recorded!
                    </h2>
                    <p className="text-green-700 mt-2">
                      Balance updated: ₹
                      {(availableBalance - enteredAmount).toLocaleString()}
                    </p>
                    <Badge variant="success" className="mt-3">
                      {generateExpenseId()}
                    </Badge>
                  </div>
                )}

                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <h2 className="font-semibold text-gray-900">
                        Select Cash Account
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveInfoModal('account')}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Select
                      className="pl-10"
                      options={CASH_ACCOUNTS.map((a) => ({
                        value: a.id,
                        label: `${a.name} (₹${a.balance.toLocaleString()})`,
                      }))}
                      placeholder="Search cash account..."
                      value={selectedAccount}
                      onChange={(e: any) => handleAccountChange(e.target.value)}
                    />
                  </div>

                  {currentAccount && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Account Card */}
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Wallet className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {currentAccount.name}
                              </h4>
                              <p className="text-xs text-green-600 font-medium">
                                {currentAccount.code}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {currentAccount.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getAccountStatusBadge(currentAccount.status)}
                            <button
                              onClick={() =>
                                setShowAccountDetails(!showAccountDetails)
                              }
                              className="p-1 hover:bg-green-100 rounded"
                            >
                              {showAccountDetails ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        {showAccountDetails && (
                          <div className="mt-4 pt-4 border-t border-green-200 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-3 h-3 text-gray-400" />
                                <span>
                                  Custodian: {currentAccount.custodian}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>
                                  Last: {currentAccount.lastTransaction}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Balance Display */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                          <p
                            className={`text-2xl font-bold ${
                              currentAccount.status === 'low_balance'
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            ₹{currentAccount.balance.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Available Balance
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{currentAccount.monthlySpent.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Spent This Month
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                          <p className="text-2xl font-bold text-gray-600">
                            ₹{currentAccount.monthlyLimit.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Monthly Limit
                          </p>
                        </div>
                      </div>

                      {/* Monthly Progress */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Monthly Utilization
                          </span>
                          <span className="font-medium">
                            {Math.round(
                              (currentAccount.monthlySpent /
                                currentAccount.monthlyLimit) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              currentAccount.monthlySpent /
                                currentAccount.monthlyLimit >
                              0.8
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min((currentAccount.monthlySpent / currentAccount.monthlyLimit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expense Details */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <h2 className="font-semibold text-gray-900">
                        Expense Details
                      </h2>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {generateExpenseId()}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Expense Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Expense Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={EXPENSE_HEADS.map((h) => ({
                        value: h.id,
                        label: h.name,
                      }))}
                      placeholder="Select expense category..."
                      value={expenseHead}
                      onChange={(e: any) => setExpenseHead(e.target.value)}
                    />

                    {currentExpenseHead && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-blue-800">
                            {currentExpenseHead.description}
                          </p>
                          <p className="text-blue-600 mt-1">
                            Limit: ₹{currentExpenseHead.limit} •{' '}
                            {currentExpenseHead.requiresReceipt
                              ? 'Receipt required'
                              : 'Receipt optional'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                          ₹
                        </span>
                        <Input
                          type="number"
                          className={`pl-8 text-lg font-bold ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      {isOverLimit && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Insufficient
                          funds!
                        </p>
                      )}
                      {isOverHeadLimit && !isOverLimit && (
                        <p className="text-xs text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Exceeds category
                          limit (₹
                          {currentExpenseHead?.limit})
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Time
                      </label>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Paid To */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Paid To / Vendor Name
                    </label>
                    <Input
                      placeholder="Enter vendor/shop name (if applicable)"
                      value={paidTo}
                      onChange={(e) => setPaidTo(e.target.value)}
                    />
                  </div>

                  {/* Remark */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Description / Remark{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm p-3"
                      rows={3}
                      placeholder="Describe what this expense was for (minimum 10 characters)..."
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{remark.length}/500 characters</span>
                      <span>
                        {remark.length < 10
                          ? 'Minimum 10 characters required'
                          : '✓'}
                      </span>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div>
                    <button
                      onClick={() =>
                        setShowAdvancedOptions(!showAdvancedOptions)
                      }
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showAdvancedOptions ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span>
                        {showAdvancedOptions ? 'Hide' : 'Show'} Additional
                        Details
                      </span>
                    </button>

                    {showAdvancedOptions && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Bill/Invoice Number
                            </label>
                            <Input
                              placeholder="If available"
                              value={billNumber}
                              onChange={(e) => setBillNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Vendor Contact
                            </label>
                            <Input
                              placeholder="Phone/Email (optional)"
                              value={vendorName}
                              onChange={(e) => setVendorName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Receipt className="w-3 h-3" />
                      Upload Receipt
                      {currentExpenseHead?.requiresReceipt && (
                        <Badge variant="warning" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </label>

                    {!receipt ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Take Photo
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Use camera
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                          />
                        </label>

                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Upload File
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            JPG, PNG, PDF
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-4">
                          {receiptPreview && (
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="w-20 h-20 object-cover rounded-lg border border-green-200"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900 truncate max-w-[200px]">
                                {receipt.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {(receipt.size / 1024).toFixed(1)} KB
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={removeReceipt}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {requiresReceipt && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Receipt is required for this expense category
                      </p>
                    )}
                  </div>

                  {/* Approval Info */}
                  {enteredAmount > 0 && (
                    <div
                      className={`p-4 rounded-xl border ${
                        enteredAmount <= 500
                          ? 'bg-green-50 border-green-200'
                          : enteredAmount <= 1000
                            ? 'bg-blue-50 border-blue-200'
                            : enteredAmount <= 2000
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Shield
                          className={`w-5 h-5 ${
                            enteredAmount <= 500
                              ? 'text-green-600'
                              : enteredAmount <= 1000
                                ? 'text-blue-600'
                                : enteredAmount <= 2000
                                  ? 'text-orange-600'
                                  : 'text-red-600'
                          }`}
                        />
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              enteredAmount <= 500
                                ? 'text-green-900'
                                : enteredAmount <= 1000
                                  ? 'text-blue-900'
                                  : enteredAmount <= 2000
                                    ? 'text-orange-900'
                                    : 'text-red-900'
                            }`}
                          >
                            {approvalInfo.approval}
                          </h4>
                          <p
                            className={`text-sm mt-1 ${
                              enteredAmount <= 500
                                ? 'text-green-700'
                                : enteredAmount <= 1000
                                  ? 'text-blue-700'
                                  : enteredAmount <= 2000
                                    ? 'text-orange-700'
                                    : 'text-red-700'
                            }`}
                          >
                            {approvalInfo.receipt}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Expense Summary */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Expense Summary</h3>
                  <Calculator className="w-5 h-5 opacity-80" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-200">Account</span>
                    <span className="font-medium truncate max-w-[150px]">
                      {currentAccount?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-200">Category</span>
                    <span className="font-medium">
                      {currentExpenseHead?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-200">Date</span>
                    <span className="font-medium">{date || '-'}</span>
                  </div>

                  <div className="border-t border-green-500 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-200">Amount</span>
                      <span className="text-3xl font-bold">
                        ₹{enteredAmount.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>

                  {currentAccount && enteredAmount > 0 && (
                    <div className="p-3 bg-green-500/30 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">Balance After</span>
                        <span
                          className={`font-medium ${isOverLimit ? 'text-red-300' : ''}`}
                        >
                          ₹
                          {(
                            currentAccount.balance - enteredAmount
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <Button
                  variant="primary"
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-base font-bold"
                  disabled={!isValid || isProcessing}
                  onClick={handleSave}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Record Expense
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetForm}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Voucher
                  </Button>
                </div>

                {/* Validation Checklist */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Entry Checklist
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {selectedAccount ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span
                        className={
                          selectedAccount ? 'text-gray-700' : 'text-gray-400'
                        }
                      >
                        Account selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {expenseHead ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span
                        className={
                          expenseHead ? 'text-gray-700' : 'text-gray-400'
                        }
                      >
                        Category selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {enteredAmount > 0 && !isOverLimit ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span
                        className={
                          enteredAmount > 0 && !isOverLimit
                            ? 'text-gray-700'
                            : 'text-gray-400'
                        }
                      >
                        Valid amount entered
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {remark.length >= 10 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span
                        className={
                          remark.length >= 10
                            ? 'text-gray-700'
                            : 'text-gray-400'
                        }
                      >
                        Description provided
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {!requiresReceipt ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      )}
                      <span
                        className={
                          !requiresReceipt ? 'text-gray-700' : 'text-orange-600'
                        }
                      >
                        {requiresReceipt
                          ? 'Receipt required'
                          : 'Receipt attached (optional)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Expenses */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-500" />
                    Recent Entries
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('history')}
                  >
                    View All
                  </Button>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {RECENT_EXPENSES.slice(0, 4).map((expense) => (
                    <div
                      key={expense.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-medium text-gray-500">
                          {expense.id}
                        </span>
                        {getStatusBadge(expense.status)}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {expense.head}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {expense.remark}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {expense.date}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          ₹{expense.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Policy */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Expense Policy
                    </h4>
                    <ul className="space-y-1.5 text-sm text-amber-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                        <span>All expenses must be recorded on same day</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                        <span>Receipt required for amounts above ₹200</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                        <span>GST bills mandatory above ₹500</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                        <span>Category limits apply per transaction</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* History View */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Expense History</h2>
              <div className="flex items-center gap-3">
                <Select
                  className="w-40"
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'recorded', label: 'Recorded' },
                    { value: 'verified', label: 'Verified' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                  value={historyFilter}
                  onChange={(e: any) => setHistoryFilter(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date/Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Receipt
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {expense.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <span className="text-sm text-gray-900">
                            {expense.date}
                          </span>
                          <p className="text-xs text-gray-500">
                            {expense.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {expense.head}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                          {expense.remark}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{expense.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {expense.hasReceipt ? (
                          <Receipt className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(expense.status)}
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {filteredExpenses.length} of {RECENT_EXPENSES.length}{' '}
                entries
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">
                Expense Entry Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Receipt Requirements</h4>
                  <ul className="space-y-1">
                    {EXPENSE_LIMITS.map((limit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        ≤₹{limit.limit}: {limit.receipt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category Limits</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Refreshments: ₹500/transaction
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Transport: ₹1000/transaction
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Repairs: ₹2000/transaction
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Record expenses immediately
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Take photo of receipt
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Write clear descriptions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <InfoModal
        isOpen={activeInfoModal === 'account'}
        onClose={() => setActiveInfoModal(null)}
        title="Cash Account Selection"
        description="Select the petty cash account from which this expense will be deducted. Each department has its own cash box with designated custodian and monthly limits."
        dataSource={[
          'Petty Cash Account Master',
          'Department Assignment Records',
          'Monthly Limit Configuration',
        ]}
        whyItMatters={[
          'Ensures proper accountability per department',
          'Tracks cash flow for each location',
          'Maintains audit trail for compliance',
        ]}
      />
    </div>
  )
}
// Helper component for Plus icon
function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  )
}

// Registry alias: navigation page "petty-cash-issue" expects this export name
export { PettyCashExpenseEntry as PettyCashIssue };
