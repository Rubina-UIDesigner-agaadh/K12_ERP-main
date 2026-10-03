import React, { useMemo, useState, Fragment } from 'react'
import {
  Search,
  Printer,
  Download,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  Receipt,
  Phone,
  Mail,
  Home,
  Award,
  Percent,
  History,
  Check,
  Info,
  Building,
  GraduationCap,
  Hash,
  IdCard,
  AlertTriangle,
  Banknote,
  BadgePercent,
  MessageSquare,
  XCircle,
  BookOpen,
  Wallet,
  ArrowLeft,
  MapPin,
  Users,
  Globe,
  Heart,
  Shield,
  ChevronRight,
  Bus,
  Smartphone,
  Bell,
} from 'lucide-react'

// ============================================
// TYPE DEFINITIONS
// ============================================
interface FeeHead {
  id: string
  name: string
  amount: number
  discountAmount: number
  netAmount: number
}

interface ReceiptHistory {
  id: string
  receiptNo: string
  date: string
  amount: number
  fineAmount: number
  totalAmount: number
  paymentMode: string
  referenceNo?: string
  feeHeads: {
    feeHeadName: string
    feeAmount: number
  }[]
  fineDetails?: {
    fineAmount: number
  }
  status: 'completed' | 'cancelled' | 'refunded'
  time?: string // ISO timestamp for receipts collected in this session (orders same-day payments)
  generatedBy: string
  remarks?: string
  smsSent: boolean
  emailSent: boolean
  whatsappSent: boolean
  inAppSent: boolean
  ledgerPosted: boolean
}

interface StudentFeeData {
  feeHeads: FeeHead[]
  totalAmount: number
  totalDiscount: number
  netAmount: number
  paidAmount: number
  balanceAmount: number
  fineAmount: number
  finePaid: number
  fineBalance: number
  totalDue: number
  status: 'paid' | 'unpaid' | 'partial' | 'overdue'
  paidDate?: string
  daysOverdue: number
  feeHeadPaidAmounts: Record<string, number>
}

interface StudentData {
  id: string
  admissionNo: string
  grNo: string
  suId: string
  firstName: string
  middleName: string
  lastName: string
  class: string
  section: string
  department: string
  branch: string
  rollNo: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  religion: string
  category: string
  aadharNo: string
  address: string
  city: string
  state: string
  pincode: string
  parentName: string
  parentPhone: string
  parentEmail: string
  motherName: string
  motherPhone: string
  academicYear: string
  admissionDate: string
  medium: string
  stream: string
  hasTransport: boolean
  hasHostel: boolean
  hostelRoom?: string
  hasConcession: boolean
  concessionType?: string
  concessionPercentage?: number
  hasScholarship: boolean
  scholarshipName?: string
  scholarshipAmount?: number
  feeCategory: string
  batch: string
  status: 'Active' | 'Inactive' | 'TC Issued' | 'Suspended'
  feeData: StudentFeeData
  receiptHistory: ReceiptHistory[]
}

interface SearchFilters {
  academicYear: string
  masterFranchise: string
  centre: string
  class: string
  division: string
  gender: string
  active: string
  searchQuery: string
  batch: string
  term: string
}

interface FeeHeadPaymentEntry {
  selected: boolean
  payingAmount: number
  balanceAmount: number
}

// ============================================
// MOCK DATA
// ============================================
const getMockStudentsList = (): StudentData[] => {
  const today = new Date()
  const calculateDaysOverdue = (dueDate: string): number => {
    const due = new Date(dueDate)
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }
  const calculateFine = (dueDate: string, amount: number, gracePeriod = 7): number => {
    const daysOverdue = calculateDaysOverdue(dueDate)
    if (daysOverdue <= gracePeriod) return 0
    const effectiveDays = daysOverdue - gracePeriod
    return Math.min(effectiveDays * 50, amount * 0.1)
  }

  // Date of each student's latest receipt (matches receiptHistory below)
  const LAST_PAID_ON: Record<string, string> = { '1': '2024-07-20', '2': '2024-04-08', '4': '2024-08-12', '5': '2024-09-03' }

  const createFeeData = (studentId: string): StudentFeeData => {
    const prefix = studentId === '1' ? 'fh' : studentId === '2' ? 'fh2_' : 'fh3_'
    const hasConcession = studentId === '1'

    const feeHeads: FeeHead[] = [
      { id: `${prefix}1`, name: 'Tuition Fee', amount: 100000, discountAmount: hasConcession ? 15000 : 0, netAmount: hasConcession ? 85000 : 100000 },
      { id: `${prefix}2`, name: 'Development Fee', amount: 20000, discountAmount: hasConcession ? 3000 : 0, netAmount: hasConcession ? 17000 : 20000 },
      { id: `${prefix}3`, name: 'Computer Lab Fee', amount: 10000, discountAmount: hasConcession ? 1500 : 0, netAmount: hasConcession ? 8500 : 10000 },
      { id: `${prefix}4`, name: 'Science Lab Fee', amount: 8000, discountAmount: hasConcession ? 1200 : 0, netAmount: hasConcession ? 6800 : 8000 },
      { id: `${prefix}5`, name: 'Library Fee', amount: 4000, discountAmount: 0, netAmount: 4000 },
      { id: `${prefix}6`, name: 'Examination Fee', amount: 6000, discountAmount: 0, netAmount: 6000 },
      { id: `${prefix}7`, name: 'Sports Fee', amount: 5000, discountAmount: 0, netAmount: 5000 },
      { id: `${prefix}8`, name: 'Annual Day Fee', amount: 3000, discountAmount: 0, netAmount: 3000 },
    ]

    const totalAmount = feeHeads.reduce((s, fh) => s + fh.amount, 0)
    const totalDiscount = feeHeads.reduce((s, fh) => s + fh.discountAmount, 0)
    const netAmount = feeHeads.reduce((s, fh) => s + fh.netAmount, 0)

    let paidAmount = 0
    const feeHeadPaidAmounts: Record<string, number> = {}

    if (studentId === '1') {
      feeHeadPaidAmounts[`${prefix}1`] = 50000
      feeHeadPaidAmounts[`${prefix}2`] = 10000
      feeHeadPaidAmounts[`${prefix}3`] = 8500
      feeHeadPaidAmounts[`${prefix}4`] = 6800
      feeHeadPaidAmounts[`${prefix}5`] = 4000
      feeHeadPaidAmounts[`${prefix}6`] = 0
      feeHeadPaidAmounts[`${prefix}7`] = 0
      feeHeadPaidAmounts[`${prefix}8`] = 0
      paidAmount = 79300
    } else if (studentId === '2') {
      feeHeadPaidAmounts[`${prefix}1`] = 100000
      feeHeadPaidAmounts[`${prefix}2`] = 20000
      feeHeadPaidAmounts[`${prefix}3`] = 10000
      feeHeadPaidAmounts[`${prefix}4`] = 8000
      feeHeadPaidAmounts[`${prefix}5`] = 4000
      feeHeadPaidAmounts[`${prefix}6`] = 6000
      feeHeadPaidAmounts[`${prefix}7`] = 5000
      feeHeadPaidAmounts[`${prefix}8`] = 3000
      paidAmount = 156000
    } else if (studentId === '4') {
      feeHeads.forEach((fh) => { feeHeadPaidAmounts[fh.id] = 0 })
      feeHeadPaidAmounts[`${prefix}1`] = 50000
      feeHeadPaidAmounts[`${prefix}2`] = 20000
      paidAmount = 70000
    } else if (studentId === '5') {
      feeHeads.forEach((fh) => { feeHeadPaidAmounts[fh.id] = 0 })
      feeHeadPaidAmounts[`${prefix}1`] = 30000
      paidAmount = 30000
    } else {
      feeHeads.forEach((fh) => { feeHeadPaidAmounts[fh.id] = 0 })
      paidAmount = 0
    }

    const balanceAmount = netAmount - paidAmount
    const dueDate = '2024-07-15'
    const daysOverdue = balanceAmount > 0 ? calculateDaysOverdue(dueDate) : 0
    const fineAmount = balanceAmount > 0 ? calculateFine(dueDate, balanceAmount) : 0

    let status: 'paid' | 'unpaid' | 'partial' | 'overdue' = 'unpaid'
    if (paidAmount >= netAmount) status = 'paid'
    else if (paidAmount > 0) status = daysOverdue > 7 ? 'overdue' : 'partial'
    else status = daysOverdue > 7 ? 'overdue' : 'unpaid'

    return {
      feeHeads,
      totalAmount,
      totalDiscount,
      netAmount,
      paidAmount,
      balanceAmount,
      fineAmount,
      finePaid: 0,
      fineBalance: fineAmount,
      totalDue: balanceAmount + fineAmount,
      status,
      paidDate: paidAmount > 0 ? LAST_PAID_ON[studentId] : undefined,
      daysOverdue,
      feeHeadPaidAmounts,
    }
  }

  return [
    {
      id: '1', admissionNo: 'ADM2024001', grNo: 'GR2024001', suId: 'SU12345678',
      firstName: 'Rahul', middleName: 'Kumar', lastName: 'Sharma',
      class: '10', section: 'A', department: 'Science', branch: 'Main Campus', rollNo: '15',
      dateOfBirth: '2009-05-15', gender: 'Male', bloodGroup: 'B+',
      nationality: 'Indian', religion: 'Hindu', category: 'General',
      aadharNo: '1234-5678-9012', address: '123, Green Park, Sector 22',
      city: 'New Delhi', state: 'Delhi', pincode: '110001',
      parentName: 'Mr. Amit Kumar Sharma', parentPhone: '+91 98765 43210', parentEmail: 'amit.sharma@email.com',
      motherName: 'Mrs. Priya Sharma', motherPhone: '+91 98765 43211',
      academicYear: '2024-25', admissionDate: '2020-04-01',
      medium: 'English', stream: 'Science (PCM)',
      hasTransport: true, hasHostel: false,
      hasConcession: true, concessionType: 'Staff Ward Concession', concessionPercentage: 15,
      hasScholarship: true, scholarshipName: 'Merit Scholarship', scholarshipAmount: 5000,
      feeCategory: 'General', status: 'Active', batch: 'Morning',
      feeData: createFeeData('1'),
      receiptHistory: [
        {
          id: 'rcpt1', receiptNo: 'RCP2024/001234', date: '2024-04-10',
          amount: 30325, fineAmount: 0, totalAmount: 30325,
          paymentMode: 'Online Transfer', referenceNo: 'TXN123456789',
          feeHeads: [
            { feeHeadName: 'Tuition Fee', feeAmount: 21250 },
            { feeHeadName: 'Development Fee', feeAmount: 4250 },
            { feeHeadName: 'Computer Lab Fee', feeAmount: 2125 },
            { feeHeadName: 'Science Lab Fee', feeAmount: 1700 },
            { feeHeadName: 'Library Fee', feeAmount: 1000 },
          ],
          status: 'completed', generatedBy: 'Admin', smsSent: true, emailSent: true, whatsappSent: false, inAppSent: true, ledgerPosted: true,
        },
        {
          id: 'rcpt2', receiptNo: 'RCP2024/002456', date: '2024-07-20',
          amount: 48975, fineAmount: 0, totalAmount: 48975,
          paymentMode: 'UPI', referenceNo: 'UPI/789456123',
          feeHeads: [
            { feeHeadName: 'Tuition Fee', feeAmount: 28750 },
            { feeHeadName: 'Development Fee', feeAmount: 5750 },
            { feeHeadName: 'Computer Lab Fee', feeAmount: 6375 },
            { feeHeadName: 'Science Lab Fee', feeAmount: 5100 },
            { feeHeadName: 'Library Fee', feeAmount: 3000 },
          ],
          status: 'completed', generatedBy: 'Fee Counter 1', smsSent: true, emailSent: false, whatsappSent: true, inAppSent: false, ledgerPosted: true,
        },
      ],
    },
    {
      id: '2', admissionNo: 'ADM2024002', grNo: 'GR2024002', suId: 'SU12345679',
      firstName: 'Priya', middleName: '', lastName: 'Patel',
      class: '10', section: 'A', department: 'Science', rollNo: '22',
      dateOfBirth: '2009-08-22', gender: 'Female', bloodGroup: 'A+',
      nationality: 'Indian', religion: 'Hindu', category: 'OBC',
      aadharNo: '2345-6789-0123', address: '45, Lajpat Nagar, Phase 2',
      city: 'New Delhi', state: 'Delhi', pincode: '110024',
      parentName: 'Mr. Ramesh Patel', parentPhone: '+91 99876 54321', parentEmail: 'ramesh.patel@email.com',
      motherName: 'Mrs. Sunita Patel', motherPhone: '+91 99876 54322',
      academicYear: '2024-25', admissionDate: '2019-04-01',
      medium: 'English', stream: 'Science (PCB)',
      hasTransport: false, hasHostel: false,
      hasConcession: false, hasScholarship: true, scholarshipName: 'Merit-cum-Means', scholarshipAmount: 10000,
      feeCategory: 'General', status: 'Active', branch: 'East Wing', batch: 'Morning',
      feeData: createFeeData('2'),
      receiptHistory: [{
        id: 'rcpt3', receiptNo: 'RCP2024/001235', date: '2024-04-08',
        amount: 156000, fineAmount: 0, totalAmount: 156000,
        paymentMode: 'Cheque', referenceNo: 'CHQ/456789',
        feeHeads: [
          { feeHeadName: 'Tuition Fee', feeAmount: 100000 },
          { feeHeadName: 'Development Fee', feeAmount: 20000 },
          { feeHeadName: 'Computer Lab Fee', feeAmount: 10000 },
          { feeHeadName: 'Science Lab Fee', feeAmount: 8000 },
          { feeHeadName: 'Library Fee', feeAmount: 4000 },
          { feeHeadName: 'Examination Fee', feeAmount: 6000 },
          { feeHeadName: 'Sports Fee', feeAmount: 5000 },
          { feeHeadName: 'Annual Day Fee', feeAmount: 3000 },
        ],
        status: 'completed', generatedBy: 'Admin', smsSent: true, emailSent: true, whatsappSent: true, inAppSent: true, ledgerPosted: true,
      }],
    },
    {
      id: '3', admissionNo: 'ADM2024003', grNo: 'GR2024003', suId: 'SU12345680',
      firstName: 'Arjun', middleName: 'Singh', lastName: 'Rajput',
      class: '10', section: 'B', department: 'Commerce', branch: 'West Wing', rollNo: '08',
      dateOfBirth: '2009-02-10', gender: 'Male', bloodGroup: 'O+',
      nationality: 'Indian', religion: 'Hindu', category: 'General',
      aadharNo: '3456-7890-1234', address: '78, Dwarka, Sector 7',
      city: 'New Delhi', state: 'Delhi', pincode: '110075',
      parentName: 'Mr. Vikram Singh', parentPhone: '+91 88765 43210', parentEmail: 'vikram.rajput@email.com',
      motherName: 'Mrs. Kavita Rajput', motherPhone: '+91 88765 43211',
      academicYear: '2024-25', admissionDate: '2021-04-01',
      medium: 'English', stream: 'Commerce',
      hasTransport: true, hasHostel: true, hostelRoom: 'Room 205, Block B',
      hasConcession: true, concessionType: 'Defence Ward', concessionPercentage: 25,
      hasScholarship: false, feeCategory: 'Defence', status: 'Active', batch: 'Afternoon',
      feeData: createFeeData('3'),
      receiptHistory: [],
    },
    {
      id: '4', admissionNo: 'ADM2024004', grNo: 'GR2024004', suId: 'SU12345681',
      firstName: 'Sneha', middleName: '', lastName: 'Gupta',
      class: '9', section: 'A', department: 'Science', branch: 'Main Campus', rollNo: '12',
      dateOfBirth: '2010-11-03', gender: 'Female', bloodGroup: 'AB+',
      nationality: 'Indian', religion: 'Hindu', category: 'General',
      aadharNo: '4567-8901-2345', address: '34, Saket, J Block',
      city: 'New Delhi', state: 'Delhi', pincode: '110017',
      parentName: 'Mr. Arun Gupta', parentPhone: '+91 77654 32100', parentEmail: 'arun.gupta@email.com',
      motherName: 'Mrs. Neha Gupta', motherPhone: '+91 77654 32101',
      academicYear: '2024-25', admissionDate: '2022-04-01',
      medium: 'English', stream: 'Science (PCM)',
      hasTransport: false, hasHostel: false,
      hasConcession: false, hasScholarship: false,
      feeCategory: 'General', status: 'Active', batch: 'Morning',
      feeData: createFeeData('4'),
      receiptHistory: [
        {
          id: 'rcpt4', receiptNo: 'RCP2024/003108', date: '2024-08-12',
          amount: 70000, fineAmount: 0, totalAmount: 70000,
          paymentMode: 'UPI', referenceNo: 'UPI/456123789',
          feeHeads: [
            { feeHeadName: 'Tuition Fee', feeAmount: 50000 },
            { feeHeadName: 'Development Fee', feeAmount: 20000 },
          ],
          status: 'completed', generatedBy: 'Fee Counter 2', smsSent: true, emailSent: true, whatsappSent: true, inAppSent: false, ledgerPosted: true,
        },
      ],
    },
    {
      id: '5', admissionNo: 'ADM2024005', grNo: 'GR2024005', suId: 'SU12345682',
      firstName: 'Mohammed', middleName: '', lastName: 'Khan',
      class: '10', section: 'B', department: 'Science', branch: 'East Wing', rollNo: '18',
      dateOfBirth: '2009-06-25', gender: 'Male', bloodGroup: 'B-',
      nationality: 'Indian', religion: 'Islam', category: 'Minority',
      aadharNo: '5678-9012-3456', address: '12, Jamia Nagar',
      city: 'New Delhi', state: 'Delhi', pincode: '110025',
      parentName: 'Mr. Salim Khan', parentPhone: '+91 66543 21000', parentEmail: 'salim.khan@email.com',
      motherName: 'Mrs. Fatima Khan', motherPhone: '+91 66543 21001',
      academicYear: '2024-25', admissionDate: '2020-04-01',
      medium: 'English', stream: 'Science (PCM)',
      hasTransport: true, hasHostel: false,
      hasConcession: true, concessionType: 'Minority', concessionPercentage: 10,
      hasScholarship: true, scholarshipName: 'National Merit', scholarshipAmount: 15000,
      feeCategory: 'Minority', status: 'Active', batch: 'Afternoon',
      feeData: createFeeData('5'),
      receiptHistory: [
        {
          id: 'rcpt5', receiptNo: 'RCP2024/003377', date: '2024-09-03',
          amount: 30000, fineAmount: 0, totalAmount: 30000,
          paymentMode: 'Cash',
          feeHeads: [{ feeHeadName: 'Tuition Fee', feeAmount: 30000 }],
          status: 'completed', generatedBy: 'Fee Counter 1', smsSent: true, emailSent: false, whatsappSent: true, inAppSent: true, ledgerPosted: true,
        },
      ],
    },
  ]
}

// ============================================
// PAYMENT MODE OPTIONS
// ============================================
const paymentModeOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Debit/Credit Card' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'neft', label: 'NEFT/RTGS/IMPS' },
  { value: 'dd', label: 'Demand Draft' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

// ============================================
// HELPER COMPONENTS
// ============================================
const Card: React.FC<{
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
}> = ({ children, className = '', title, subtitle, action }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
)

const Button: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
  }
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm',
  }
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

const Input: React.FC<{
  label?: string
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  leftIcon?: React.ReactNode
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  maxLength?: number
  error?: string
  className?: string
}> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon,
  disabled,
  required,
  min,
  max,
  maxLength,
  error,
  className = '',
}) => (
  <div className={className}>
    {label && (
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        maxLength={maxLength}
        className={`w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${leftIcon ? 'pl-8' : ''}`}
      />
    </div>
    {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
  </div>
)

const Select: React.FC<{
  label?: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  required?: boolean
  className?: string
}> = ({ label, options, value, onChange, disabled, required, className = '' }) => (
  <div className={className}>
    {label && (
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

const Badge: React.FC<{
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray'
  size?: 'xs' | 'sm'
}> = ({ children, variant = 'gray', size = 'sm' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
  }
  const sizes = { xs: 'px-1.5 py-0.5 text-[10px]', sm: 'px-2 py-0.5 text-xs' }
  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// UTILITY
// ============================================
function numberToWords(num: number): string {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  if (num === 0) return 'Zero'
  const convert = (n: number): string => {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '')
  }
  if (num >= 10000000) return convert(Math.floor(num / 10000000)) + ' Crore ' + numberToWords(num % 10000000)
  if (num >= 100000) return convert(Math.floor(num / 100000)) + ' Lakh ' + numberToWords(num % 100000)
  if (num >= 1000) return convert(Math.floor(num / 1000)) + ' Thousand ' + convert(num % 1000)
  return convert(num)
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'paid':
      return { variant: 'success' as const, label: 'Paid' }
    case 'partial':
      return { variant: 'warning' as const, label: 'Partial' }
    case 'overdue':
      return { variant: 'danger' as const, label: 'Overdue' }
    default:
      return { variant: 'gray' as const, label: 'Unpaid' }
  }
}

const getFeeHeadBalance = (feeData: StudentFeeData, feeHead: FeeHead): number => {
  const alreadyPaid = feeData.feeHeadPaidAmounts[feeHead.id] || 0
  return Math.max(0, feeHead.netAmount - alreadyPaid)
}

const getTodayFormatted = (): string => {
  return new Date().toISOString().split('T')[0]
}

const getTodayDisplay = (): string => {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ============================================
// STUDENT LIST: FILTERS + "MOST RECENT PAYMENT FIRST" ORDERING
// ============================================
const DEFAULT_FILTERS: SearchFilters = {
  academicYear: '2024-25',
  masterFranchise: '',
  centre: '',
  class: '',
  division: '',
  gender: '',
  active: 'Active',
  searchQuery: '',
  batch: '',
  term: '',
}

// All mock branches belong to the "Main Campus" master franchise
const BRANCH_FRANCHISE: Record<string, string> = { 'Main Campus': 'main', 'East Wing': 'main', 'West Wing': 'main' }

// Term windows inside an academic year (e.g. 2024-25 → Term 1 = Apr–Jul 2024)
const TERM_WINDOWS: Record<string, { from: string; to: string; nextYear?: boolean; label: string }> = {
  'Term 1': { from: '04-01', to: '07-31', label: 'Apr–Jul' },
  'Term 2': { from: '08-01', to: '11-30', label: 'Aug–Nov' },
  'Term 3': { from: '12-01', to: '03-31', nextYear: true, label: 'Dec–Mar' },
}

// true when the student has a completed (not cancelled) payment inside the term window
const paidInTerm = (student: StudentData, academicYear: string, term: string): boolean => {
  const w = TERM_WINDOWS[term]
  if (!w) return true
  const startYear = parseInt(academicYear.slice(0, 4), 10)
  const fromDate = `${startYear}-${w.from}`
  const toDate = `${w.nextYear ? startYear + 1 : startYear}-${w.to}`
  return student.receiptHistory.some((r) => r.status === 'completed' && r.date >= fromDate && r.date <= toDate)
}

const applyStudentFilters = (list: StudentData[], f: SearchFilters): StudentData[] =>
  list.filter((s) => {
    if (f.searchQuery) {
      const q = f.searchQuery.toLowerCase()
      const hit =
        `${s.firstName} ${s.middleName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.grNo.toLowerCase().includes(q) ||
        s.parentPhone.includes(q)
      if (!hit) return false
    }
    if (f.academicYear && s.academicYear !== f.academicYear) return false
    if (f.masterFranchise && (BRANCH_FRANCHISE[s.branch] || '') !== f.masterFranchise) return false
    if (f.centre && s.branch !== f.centre) return false
    if (f.class && s.class !== f.class) return false
    if (f.division && s.section !== f.division) return false
    if (f.gender && s.gender !== f.gender) return false
    if (f.active && f.active !== 'All' && s.status !== f.active) return false
    if (f.batch && s.batch !== f.batch) return false
    if (f.term && !paidInTerm(s, f.academicYear || s.academicYear, f.term)) return false
    return true
  })

const paymentSortKey = (r: ReceiptHistory) => r.time || r.date

// Latest completed (non-cancelled) receipt of a student
const getLastPayment = (student: StudentData): ReceiptHistory | null =>
  student.receiptHistory.reduce<ReceiptHistory | null>(
    (latest, r) =>
      r.status === 'completed' && (!latest || paymentSortKey(r) > paymentSortKey(latest)) ? r : latest,
    null
  )

// Most recent fee payment first; students who have never paid go last (A–Z)
const sortByRecentPayment = (list: StudentData[]): StudentData[] =>
  [...list].sort((a, b) => {
    const la = getLastPayment(a)
    const lb = getLastPayment(b)
    if (la && lb) return paymentSortKey(lb).localeCompare(paymentSortKey(la))
    if (la) return -1
    if (lb) return 1
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
  })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

// ============================================
// RECEIPT PRINT / DOWNLOAD (client-side HTML document)
// ============================================
interface PrintableReceipt {
  receiptNo: string
  date: string
  status: string
  studentName: string
  admissionNo: string
  className: string
  branch: string
  parentName: string
  feeHeads: { feeHeadName: string; feeAmount: number }[]
  fineAmount: number
  totalAmount: number
  paymentMode: string
  referenceNo?: string
  narration?: string
  receivedBy: string
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]
  )

const receiptDocument = (r: PrintableReceipt): string => {
  const rows = r.feeHeads
    .map(
      (fh, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(fh.feeHeadName)}</td><td class="num">${formatCurrency(fh.feeAmount)}</td></tr>`
    )
    .join('')
  const fine =
    r.fineAmount > 0
      ? `<tr><td></td><td>Late Fine</td><td class="num">${formatCurrency(r.fineAmount)}</td></tr>`
      : ''
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fee Receipt ${escapeHtml(r.receiptNo)}</title><style>
body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px}
.rc{max-width:720px;margin:0 auto;border:1px solid #d1d5db;border-radius:8px;padding:24px;position:relative}
.hd{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:16px}
.hd h1{margin:0;font-size:20px;color:#1e3a8a}.hd p{margin:4px 0 0;font-size:12px;color:#6b7280}
.meta{display:flex;justify-content:space-between;font-size:13px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:13px;margin-bottom:16px}
.grid span{color:#6b7280}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
th{background:#f3f4f6}.num{text-align:right}
.total td{font-weight:bold;background:#eff6ff}
.words{font-size:12px;margin:10px 0}
.foot{display:flex;justify-content:space-between;margin-top:40px;font-size:12px;color:#374151}
.void{position:absolute;top:40%;left:0;right:0;text-align:center;font-size:56px;color:rgba(220,38,38,.25);transform:rotate(-20deg);font-weight:bold}
@media print{body{margin:0}.rc{border:none}}
</style></head><body><div class="rc">${r.status === 'cancelled' ? '<div class="void">CANCELLED</div>' : ''}
<div class="hd"><h1>ABC International School</h1><p>Fee Receipt</p></div>
<div class="meta"><div><strong>Receipt No:</strong> ${escapeHtml(r.receiptNo)}</div><div><strong>Date:</strong> ${escapeHtml(formatDate(r.date))}</div></div>
<div class="grid">
<div><span>Student:</span> <strong>${escapeHtml(r.studentName)}</strong></div>
<div><span>Admission No:</span> ${escapeHtml(r.admissionNo)}</div>
<div><span>Class:</span> ${escapeHtml(r.className)}</div>
<div><span>Branch:</span> ${escapeHtml(r.branch)}</div>
<div><span>Parent:</span> ${escapeHtml(r.parentName)}</div>
<div><span>Payment Mode:</span> ${escapeHtml(r.paymentMode)}${r.referenceNo ? ` (Ref: ${escapeHtml(r.referenceNo)})` : ''}</div>
</div>
<table><thead><tr><th style="width:40px">#</th><th>Fee Head</th><th class="num">Amount</th></tr></thead><tbody>${rows}${fine}
<tr class="total"><td></td><td>Total Paid</td><td class="num">${formatCurrency(r.totalAmount)}</td></tr></tbody></table>
<p class="words"><strong>Rupees ${escapeHtml(numberToWords(r.totalAmount))} Only</strong></p>
${r.narration ? `<p class="words">Remarks: ${escapeHtml(r.narration)}</p>` : ''}
<div class="foot"><div>Received by: ${escapeHtml(r.receivedBy)}</div><div>Authorised Signatory</div></div>
</div></body></html>`
}

// Prints only the given document (hidden iframe) instead of the whole page
const printDocument = (html: string) => {
  document.querySelectorAll('iframe[data-print-frame]').forEach((f) => f.remove())
  const frame = document.createElement('iframe')
  frame.setAttribute('data-print-frame', 'true')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
  document.body.appendChild(frame)
  const win = frame.contentWindow
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => {
    win.focus()
    win.print()
  }, 300)
}

const downloadDocument = (fileName: string, content: string, type = 'text/html;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const receiptFileName = (receiptNo: string) => `Fee-Receipt-${receiptNo.replace(/[^\w-]+/g, '-')}.html`

const CompactRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-1.5 py-0.5 min-w-0">
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <div className="text-[9px] text-gray-500 leading-tight">{label}</div>
      <div className="text-[11px] font-medium text-gray-900 truncate leading-tight" title={value}>
        {value}
      </div>
    </div>
  </div>
)

// ============================================
// MAIN COMPONENT
// ============================================
export function FeeReceipt() {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [isSearching, setIsSearching] = useState(false)
  // Master student list in state: receipts collected / cancelled on this page update it
  const [allStudents, setAllStudents] = useState<StudentData[]>(() => getMockStudentsList())
  // Shown list = filters applied, then sorted with the most recent fee payment first
  const studentsList = useMemo(
    () => sortByRecentPayment(applyStudentFilters(allStudents, appliedFilters)),
    [allStudents, appliedFilters]
  )
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [viewingReceipt, setViewingReceipt] = useState<ReceiptHistory | null>(null)

  const [paymentEntries, setPaymentEntries] = useState<Record<string, FeeHeadPaymentEntry>>({})
  const [paymentMode, setPaymentMode] = useState('cash')
  const [referenceNo, setReferenceNo] = useState('')
  const [chequeNo, setChequeNo] = useState('')
  const [chequeDate, setChequeDate] = useState('')
  const [bankName, setBankName] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [narration, setNarration] = useState('')
  const [receivedBy, setReceivedBy] = useState('')

  const [sendSMS, setSendSMS] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [sendInApp, setSendInApp] = useState(true)

  const [finePayingAmount, setFinePayingAmount] = useState(0)

  const [isGenerating, setIsGenerating] = useState(false)
  const [showReceiptPreview, setShowReceiptPreview] = useState(false)
  const [showReceiptSuccess, setShowReceiptSuccess] = useState(false)
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'payment' | 'history'>('payment')

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellingReceipt, setCancellingReceipt] = useState<ReceiptHistory | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const todayDate = getTodayFormatted()
  const todayDisplay = getTodayDisplay()

  const autoReceiptNo = useMemo(() => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 900000) + 100000
    return `RCP${year}/${random}`
  }, [showReceiptPreview])

  const feeData = selectedStudent?.feeData
  const unpaidFeeHeads = useMemo(
    () => feeData?.feeHeads.filter((fh) => getFeeHeadBalance(feeData!, fh) > 0) || [],
    [feeData]
  )

  const selectedFeeTotal = useMemo(() => {
    let total = 0
    Object.entries(paymentEntries).forEach(([, entry]) => {
      if (entry.selected) total += entry.payingAmount
    })
    return total
  }, [paymentEntries])

  const grandTotal = useMemo(
    () => selectedFeeTotal + finePayingAmount,
    [selectedFeeTotal, finePayingAmount]
  )

  const selectedFeeHeadCount = useMemo(
    () => Object.values(paymentEntries).filter((e) => e.selected).length,
    [paymentEntries]
  )

  // ---- Handlers ----

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setAppliedFilters(filters)
      setIsSearching(false)
    }, 600)
  }

  const handleResetSearch = () => {
    setFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setSelectedStudent(null)
    setCurrentView('list')
    setPaymentEntries({})
  }

  const handleSelectStudent = (student: StudentData) => {
    setSelectedStudent(student)
    setCurrentView('detail')
    setActiveTab('payment')
    setPaymentEntries({})
    setFinePayingAmount(0)
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedStudent(null)
    setPaymentEntries({})
    setFinePayingAmount(0)
  }

  const resetPaymentForm = () => {
    setPaymentEntries({})
    setPaymentMode('cash')
    setReferenceNo('')
    setChequeNo('')
    setChequeDate('')
    setBankName('')
    setTransactionId('')
    setNarration('')
    setReceivedBy('')
    setSendSMS(true)
    setSendEmail(true)
    setSendWhatsApp(true)
    setSendInApp(true)
    setFinePayingAmount(0)
  }

  const handleFeeHeadSelect = (feeHeadId: string, checked: boolean) => {
    if (!feeData) return
    const feeHead = feeData.feeHeads.find((fh) => fh.id === feeHeadId)
    if (!feeHead) return
    const balance = getFeeHeadBalance(feeData, feeHead)
    setPaymentEntries((prev) => ({
      ...prev,
      [feeHeadId]: {
        selected: checked,
        payingAmount: checked ? balance : 0,
        balanceAmount: balance,
      },
    }))
  }

  const handleFeeHeadAmountChange = (feeHeadId: string, value: number) => {
    setPaymentEntries((prev) => {
      const entry = prev[feeHeadId]
      if (!entry) return prev
      const validValue = Math.max(0, Math.min(value, entry.balanceAmount))
      return { ...prev, [feeHeadId]: { ...entry, payingAmount: validValue } }
    })
  }

  const handlePayFullFeeHead = (feeHeadId: string) => {
    setPaymentEntries((prev) => {
      const entry = prev[feeHeadId]
      if (!entry) return prev
      return { ...prev, [feeHeadId]: { ...entry, payingAmount: entry.balanceAmount } }
    })
  }

  const handleSelectAllFeeHeads = () => {
    if (!feeData) return
    const entries: Record<string, FeeHeadPaymentEntry> = {}
    feeData.feeHeads.forEach((fh) => {
      const balance = getFeeHeadBalance(feeData, fh)
      entries[fh.id] = {
        selected: balance > 0,
        payingAmount: balance,
        balanceAmount: balance,
      }
    })
    setPaymentEntries(entries)
    setFinePayingAmount(feeData.fineBalance)
  }

  const handleDeselectAllFeeHeads = () => {
    setPaymentEntries({})
    setFinePayingAmount(0)
  }

  const handleFineAmountChange = (value: number) => {
    if (!feeData) return
    setFinePayingAmount(Math.max(0, Math.min(value, feeData.fineBalance)))
  }

  const validatePayment = (): boolean => {
    if (selectedFeeHeadCount === 0 && finePayingAmount <= 0) {
      alert('Please select at least one fee head or enter a fine amount')
      return false
    }
    if (grandTotal <= 0) {
      alert('Total amount must be greater than zero')
      return false
    }
    if (paymentMode !== 'cash' && !referenceNo && paymentMode !== 'bank_transfer') {
      alert('Reference number is required for non-cash payments')
      return false
    }
    if (paymentMode === 'bank_transfer' && (!bankName || !transactionId)) {
      alert('Bank name and Transaction ID are required for bank transfer')
      return false
    }
    if (paymentMode === 'cheque' && (!chequeNo || !chequeDate || !bankName)) {
      alert('Cheque details are required')
      return false
    }
    return true
  }

  const handleGenerateReceipt = async () => {
    if (!validatePayment()) return
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 1000))

    const selectedFeeHeads = feeData!.feeHeads
      .filter((fh) => paymentEntries[fh.id]?.selected)
      .map((fh) => ({
        feeHeadName: fh.name,
        feeAmount: paymentEntries[fh.id].payingAmount,
      }))

    const receipt = {
      receiptNo: autoReceiptNo,
      date: todayDate,
      student: {
        name: `${selectedStudent?.firstName} ${selectedStudent?.middleName} ${selectedStudent?.lastName}`.trim(),
        admissionNo: selectedStudent?.admissionNo,
        class: `${selectedStudent?.class}-${selectedStudent?.section}`,
        branch: selectedStudent?.branch,
        parentName: selectedStudent?.parentName,
        phone: selectedStudent?.parentPhone,
        email: selectedStudent?.parentEmail,
      },
      feeHeads: selectedFeeHeads,
      fineAmount: finePayingAmount,
      totalFeeAmount: selectedFeeTotal,
      totalFineAmount: finePayingAmount,
      grandTotal,
      paymentMode,
      referenceNo: paymentMode !== 'cash' ? referenceNo : undefined,
      chequeDetails:
        paymentMode === 'cheque' ? { chequeNo, chequeDate, bankName } : undefined,
      bankTransferDetails:
        paymentMode === 'bank_transfer' ? { bankName, transactionId } : undefined,
      narration,
      receivedBy: receivedBy || 'Admin',
      sendSMS,
      sendEmail,
      sendWhatsApp,
      sendInApp,
      ledgerPosted: true,
    }
    setGeneratedReceipt(receipt)
    setShowReceiptPreview(true)
    setIsGenerating(false)
  }

  // Replace a student in the master list and in the open detail view
  const commitStudent = (updated: StudentData) => {
    setAllStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setSelectedStudent(updated)
  }

  // Recalculate paid / balance / status after fee-head paid amounts change
  const recalcFeeData = (
    fd: StudentFeeData,
    headPaid: Record<string, number>,
    finePaid: number,
    paidDate?: string
  ): StudentFeeData => {
    const paidAmount = fd.feeHeads.reduce((sum, fh) => sum + (headPaid[fh.id] || 0), 0)
    const balanceAmount = Math.max(0, fd.netAmount - paidAmount)
    const fineBalance = Math.max(0, fd.fineAmount - finePaid)
    let status: StudentFeeData['status'] = 'unpaid'
    if (balanceAmount <= 0) status = 'paid'
    else if (paidAmount > 0) status = fd.daysOverdue > 7 ? 'overdue' : 'partial'
    else status = fd.daysOverdue > 7 ? 'overdue' : 'unpaid'
    return {
      ...fd,
      feeHeadPaidAmounts: headPaid,
      paidAmount,
      balanceAmount,
      finePaid,
      fineBalance,
      totalDue: balanceAmount + fineBalance,
      status,
      paidDate,
    }
  }

  const handleConfirmReceipt = async () => {
    setShowReceiptPreview(false)
    await new Promise((r) => setTimeout(r, 500))
    if (selectedStudent && generatedReceipt) {
      const fd = selectedStudent.feeData
      const headPaid = { ...fd.feeHeadPaidAmounts }
      fd.feeHeads.forEach((fh) => {
        const entry = paymentEntries[fh.id]
        if (entry?.selected && entry.payingAmount > 0) {
          headPaid[fh.id] = (headPaid[fh.id] || 0) + entry.payingAmount
        }
      })
      const fine = generatedReceipt.totalFineAmount || 0
      const newReceipt: ReceiptHistory = {
        id: `rcpt-${Date.now()}`,
        receiptNo: generatedReceipt.receiptNo,
        date: generatedReceipt.date,
        time: new Date().toISOString(),
        amount: generatedReceipt.totalFeeAmount,
        fineAmount: fine,
        totalAmount: generatedReceipt.grandTotal,
        paymentMode:
          paymentModeOptions.find((m) => m.value === generatedReceipt.paymentMode)?.label ||
          generatedReceipt.paymentMode,
        referenceNo:
          generatedReceipt.referenceNo ||
          generatedReceipt.chequeDetails?.chequeNo ||
          generatedReceipt.bankTransferDetails?.transactionId,
        feeHeads: generatedReceipt.feeHeads,
        fineDetails: fine > 0 ? { fineAmount: fine } : undefined,
        status: 'completed',
        generatedBy: generatedReceipt.receivedBy,
        remarks: generatedReceipt.narration || undefined,
        smsSent: generatedReceipt.sendSMS,
        emailSent: generatedReceipt.sendEmail,
        whatsappSent: generatedReceipt.sendWhatsApp,
        inAppSent: generatedReceipt.sendInApp,
        ledgerPosted: true,
      }
      commitStudent({
        ...selectedStudent,
        feeData: recalcFeeData(fd, headPaid, fd.finePaid + fine, generatedReceipt.date),
        receiptHistory: [newReceipt, ...selectedStudent.receiptHistory],
      })
    }
    setShowReceiptSuccess(true)
  }

  const handleCancelReceipt = (receipt: ReceiptHistory) => {
    setCancellingReceipt(receipt)
    setCancelReason('')
    setShowCancelModal(true)
  }

  const confirmCancelReceipt = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason')
      return
    }
    await new Promise((r) => setTimeout(r, 500))
    if (selectedStudent && cancellingReceipt) {
      const fd = selectedStudent.feeData
      const headPaid = { ...fd.feeHeadPaidAmounts }
      cancellingReceipt.feeHeads.forEach((line) => {
        const fh = fd.feeHeads.find((h) => h.name === line.feeHeadName)
        if (fh) headPaid[fh.id] = Math.max(0, (headPaid[fh.id] || 0) - line.feeAmount)
      })
      const history = selectedStudent.receiptHistory.map((r) =>
        r.id === cancellingReceipt.id
          ? { ...r, status: 'cancelled' as const, remarks: `Cancelled: ${cancelReason.trim()}` }
          : r
      )
      const lastPaidOn = history
        .filter((r) => r.status === 'completed')
        .reduce<string | undefined>((d, r) => (!d || r.date > d ? r.date : d), undefined)
      commitStudent({
        ...selectedStudent,
        feeData: recalcFeeData(
          fd,
          headPaid,
          Math.max(0, fd.finePaid - cancellingReceipt.fineAmount),
          lastPaidOn
        ),
        receiptHistory: history,
      })
    }
    const cancelledNo = cancellingReceipt?.receiptNo
    setShowCancelModal(false)
    setCancellingReceipt(null)
    alert(`Receipt ${cancelledNo || ''} cancelled — paid amounts reversed.`)
  }

  // Receipt print / download helpers
  const historyToPrintable = (r: ReceiptHistory, st: StudentData): PrintableReceipt => ({
    receiptNo: r.receiptNo,
    date: r.date,
    status: r.status,
    studentName: `${st.firstName} ${st.middleName} ${st.lastName}`.replace(/\s+/g, ' ').trim(),
    admissionNo: st.admissionNo,
    className: `${st.class}-${st.section}`,
    branch: st.branch,
    parentName: st.parentName,
    feeHeads: r.feeHeads,
    fineAmount: r.fineAmount,
    totalAmount: r.totalAmount,
    paymentMode: r.paymentMode,
    referenceNo: r.referenceNo,
    narration: r.remarks,
    receivedBy: r.generatedBy,
  })
  const generatedToPrintable = (g: any): PrintableReceipt => ({
    receiptNo: g.receiptNo,
    date: g.date,
    status: 'completed',
    studentName: String(g.student?.name || '').replace(/\s+/g, ' ').trim(),
    admissionNo: g.student?.admissionNo || '',
    className: g.student?.class || '',
    branch: g.student?.branch || '',
    parentName: g.student?.parentName || '',
    feeHeads: g.feeHeads || [],
    fineAmount: g.totalFineAmount || 0,
    totalAmount: g.grandTotal || 0,
    paymentMode: paymentModeOptions.find((m) => m.value === g.paymentMode)?.label || g.paymentMode,
    referenceNo: g.referenceNo || g.chequeDetails?.chequeNo || g.bankTransferDetails?.transactionId,
    narration: g.narration,
    receivedBy: g.receivedBy || 'Admin',
  })
  const printHistoryReceipt = (r: ReceiptHistory) => {
    if (selectedStudent) printDocument(receiptDocument(historyToPrintable(r, selectedStudent)))
  }
  const downloadHistoryReceipt = (r: ReceiptHistory) => {
    if (selectedStudent) downloadDocument(receiptFileName(r.receiptNo), receiptDocument(historyToPrintable(r, selectedStudent)))
  }

  const getStudentTotalDue = (student: StudentData) => student.feeData.balanceAmount
  const getStudentTotalPaid = (student: StudentData) => student.feeData.paidAmount

  // ============================================
  // RENDER: STUDENT LIST VIEW
  // ============================================
  if (currentView === 'list') {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              Fee Collection
            </h1>
            <p className="text-sm text-gray-500 mt-1">Search and select a student to collect fees</p>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select
              label="Academic Year"
              options={[
                { value: '2024-25', label: '2024-2025' },
                { value: '2023-24', label: '2023-2024' },
              ]}
              value={filters.academicYear}
              onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
            />
            <Select
              label="Master Franchise"
              options={[
                { value: '', label: 'All' },
                { value: 'main', label: 'Main Campus' },
              ]}
              value={filters.masterFranchise}
              onChange={(e) => setFilters({ ...filters, masterFranchise: e.target.value })}
            />
            <Select
              label="Centre"
              options={[
                { value: '', label: 'All' },
                { value: 'Main Campus', label: 'Main Campus' },
                { value: 'East Wing', label: 'East Wing' },
                { value: 'West Wing', label: 'West Wing' },
              ]}
              value={filters.centre}
              onChange={(e) => setFilters({ ...filters, centre: e.target.value })}
            />
            <Select
              label="Class"
              options={[
                { value: '', label: 'All' },
                { value: '9', label: 'Class 9' },
                { value: '10', label: 'Class 10' },
              ]}
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            />
            <Select
              label="Division"
              options={[
                { value: '', label: 'All' },
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
              ]}
              value={filters.division}
              onChange={(e) => setFilters({ ...filters, division: e.target.value })}
            />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'All' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ]}
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            />
            <Select
              label="Active Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'All', label: 'All' },
              ]}
              value={filters.active}
              onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            />
            <Select
              label="Batch"
              options={[
                { value: '', label: 'All' },
                { value: 'Morning', label: 'Morning' },
                { value: 'Afternoon', label: 'Afternoon' },
              ]}
              value={filters.batch}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
            />
            <Select
              label="Term"
              options={[
                { value: '', label: 'All' },
                { value: 'Term 1', label: 'Term 1 (Apr–Jul)' },
                { value: 'Term 2', label: 'Term 2 (Aug–Nov)' },
                { value: 'Term 3', label: 'Term 3 (Dec–Mar)' },
              ]}
              value={filters.term}
              onChange={(e) => setFilters({ ...filters, term: e.target.value })}
            />
            <Input
              label="Search Student"
              placeholder="Name, Adm No, Phone..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetSearch}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button variant="primary" onClick={handleSearch} loading={isSearching}>
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </Card>

          <Card
            title={`Students (${studentsList.length}) — most recent fee payment first`}
            subtitle={`Sorted by latest fee received${
              appliedFilters.term
                ? ` · paid in ${appliedFilters.term} (${TERM_WINDOWS[appliedFilters.term]?.label || ''})`
                : ''
            } · click a student to view fee details and collect payment`}
          >
            {studentsList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No students found</p>
                <p className="text-xs mt-1">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Student</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">
                        Adm No / GR No
                      </th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Class</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Branch</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">
                        Parent / Phone
                      </th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Category</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600">
                        Last Paid
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-600">
                        Total Paid
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-600">
                        Balance Due
                      </th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-600">Status</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {studentsList.map((student, index) => {
                      const due = getStudentTotalDue(student)
                      const paid = getStudentTotalPaid(student)
                      const last = getLastPayment(student)
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                          onClick={() => handleSelectStudent(student)}
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {student.firstName} {student.middleName} {student.lastName}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Roll: {student.rollNo} | {student.gender}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium">{student.admissionNo}</div>
                            <div className="text-[10px] text-gray-500">{student.grNo}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium">
                              Class {student.class}-{student.section}
                            </div>
                            <div className="text-[10px] text-gray-500">{student.department}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium">{student.branch}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium">{student.parentName}</div>
                            <div className="text-[10px] text-gray-500">{student.parentPhone}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="gray" size="xs">
                                {student.feeCategory}
                              </Badge>
                              {student.hasConcession && (
                                <Badge variant="success" size="xs">
                                  {student.concessionPercentage}% Off
                                </Badge>
                              )}
                              {student.hasScholarship && (
                                <Badge variant="warning" size="xs">
                                  Scholar
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {last ? (
                              <div>
                                <div className="font-medium text-gray-900 flex items-center gap-1">
                                  {formatDate(last.date)}
                                  {index === 0 && (
                                    <Badge variant="success" size="xs">
                                      Latest
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {formatCurrency(last.totalAmount)} · {last.paymentMode} · {last.receiptNo}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">No payment yet</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right font-medium text-green-600">
                            {formatCurrency(paid)}
                          </td>
                          <td className="px-3 py-3 text-right font-bold text-red-600">
                            {due > 0 ? (
                              formatCurrency(due)
                            ) : (
                              <span className="text-green-600">Nil</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Badge
                              variant={
                                due === 0 ? 'success' : due > 50000 ? 'danger' : 'warning'
                              }
                              size="xs"
                            >
                              {due === 0 ? 'Clear' : 'Due'}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={() => handleSelectStudent(student)}
                            >
                              <CreditCard className="w-3 h-3 mr-1" /> Collect
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
      </div>
    )
  }

  // ============================================
  // RENDER: STUDENT DETAIL VIEW
  // ============================================
  if (!selectedStudent || !feeData) return null

  const statusConfig = getStatusConfig(feeData.status)

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Fee Collection
          </h1>
          <p className="text-xs text-gray-500">
            Collecting fees for {selectedStudent.firstName} {selectedStudent.lastName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* Student Header Card */}
          <Card>
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-3">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-base font-bold border-2 border-white/30 flex-shrink-0">
                  {selectedStudent.firstName[0]}
                  {selectedStudent.lastName[0]}
                </div>
                <div className="text-white flex-1 min-w-0">
                  <h3 className="font-bold text-xs truncate">
                    {selectedStudent.firstName} {selectedStudent.middleName}{' '}
                    {selectedStudent.lastName}
                  </h3>
                  <p className="text-blue-200 text-[10px]">
                    Class {selectedStudent.class}-{selectedStudent.section} |{' '}
                    {selectedStudent.department}
                  </p>
                  <p className="text-blue-200 text-[10px]">
                    Roll: {selectedStudent.rollNo} | {selectedStudent.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant="info" size="xs">
                  {selectedStudent.status}
                </Badge>
                {selectedStudent.hasHostel && (
                  <Badge variant="info" size="xs">
                    <Home className="w-2.5 h-2.5" /> Hostel
                  </Badge>
                )}
                {selectedStudent.hasConcession && (
                  <Badge variant="success" size="xs">
                    <Percent className="w-2.5 h-2.5" /> {selectedStudent.concessionPercentage}%
                  </Badge>
                )}
                {selectedStudent.hasScholarship && (
                  <Badge variant="warning" size="xs">
                    <Award className="w-2.5 h-2.5" /> Scholar
                  </Badge>
                )}
              </div>
            </div>

            {/* Personal Section */}
            <div className="px-3 pt-2 pb-1">
              <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1 border-b pb-0.5">
                Personal
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <CompactRow
                  icon={<IdCard className="w-3 h-3" />}
                  label="Adm No"
                  value={selectedStudent.admissionNo}
                />
                <CompactRow
                  icon={<Hash className="w-3 h-3" />}
                  label="GR No"
                  value={selectedStudent.grNo}
                />
                <CompactRow
                  icon={<Hash className="w-3 h-3" />}
                  label="SU ID"
                  value={selectedStudent.suId}
                />
                <CompactRow
                  icon={<Calendar className="w-3 h-3" />}
                  label="DOB"
                  value={new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-IN')}
                />
                <CompactRow
                  icon={<Heart className="w-3 h-3" />}
                  label="Blood"
                  value={selectedStudent.bloodGroup}
                />
                <CompactRow
                  icon={<Globe className="w-3 h-3" />}
                  label="Nationality"
                  value={selectedStudent.nationality}
                />
                <CompactRow
                  icon={<User className="w-3 h-3" />}
                  label="Religion"
                  value={selectedStudent.religion}
                />
                <CompactRow
                  icon={<Shield className="w-3 h-3" />}
                  label="Category"
                  value={selectedStudent.category}
                />
              </div>
              <div className="mt-0.5">
                <CompactRow
                  icon={<IdCard className="w-3 h-3" />}
                  label="Aadhar"
                  value={selectedStudent.aadharNo}
                />
                <CompactRow
                  icon={<MapPin className="w-3 h-3" />}
                  label="Address"
                  value={`${selectedStudent.address}, ${selectedStudent.city} - ${selectedStudent.pincode}`}
                />
              </div>
            </div>

            {/* Parent Section */}
            <div className="px-3 pt-2 pb-1">
              <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1 border-b pb-0.5">
                Parents
              </div>
              <CompactRow
                icon={<User className="w-3 h-3" />}
                label="Father"
                value={selectedStudent.parentName}
              />
              <div className="grid grid-cols-2 gap-x-2">
                <CompactRow
                  icon={<Phone className="w-3 h-3" />}
                  label="Phone"
                  value={selectedStudent.parentPhone}
                />
                <CompactRow
                  icon={<Mail className="w-3 h-3" />}
                  label="Email"
                  value={selectedStudent.parentEmail}
                />
              </div>
              <CompactRow
                icon={<User className="w-3 h-3" />}
                label="Mother"
                value={selectedStudent.motherName}
              />
              <CompactRow
                icon={<Phone className="w-3 h-3" />}
                label="Mother's Phone"
                value={selectedStudent.motherPhone}
              />
            </div>

            {/* Academic Section */}
            <div className="px-3 pt-2 pb-1">
              <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1 border-b pb-0.5">
                Academic
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <CompactRow
                  icon={<GraduationCap className="w-3 h-3" />}
                  label="Class"
                  value={`${selectedStudent.class}-${selectedStudent.section}`}
                />
                <CompactRow
                  icon={<Building className="w-3 h-3" />}
                  label="Branch"
                  value={selectedStudent.branch}
                />
                <CompactRow
                  icon={<BookOpen className="w-3 h-3" />}
                  label="Stream"
                  value={selectedStudent.stream}
                />
                <CompactRow
                  icon={<BookOpen className="w-3 h-3" />}
                  label="Medium"
                  value={selectedStudent.medium}
                />
                <CompactRow
                  icon={<Calendar className="w-3 h-3" />}
                  label="Year"
                  value={selectedStudent.academicYear}
                />
                <CompactRow
                  icon={<Calendar className="w-3 h-3" />}
                  label="Adm Date"
                  value={new Date(selectedStudent.admissionDate).toLocaleDateString('en-IN')}
                />
              </div>
            </div>

            {/* Benefits */}
            {(selectedStudent.hasConcession ||
              selectedStudent.hasScholarship ||
              selectedStudent.hasHostel) && (
              <div className="px-3 pt-2 pb-2">
                <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1 border-b pb-0.5">
                  Benefits
                </div>
                {selectedStudent.hasHostel && (
                  <CompactRow
                    icon={<Home className="w-3 h-3" />}
                    label="Hostel Room"
                    value={selectedStudent.hostelRoom || '-'}
                  />
                )}
                {selectedStudent.hasConcession && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <CompactRow
                      icon={<Percent className="w-3 h-3" />}
                      label="Concession"
                      value={selectedStudent.concessionType || '-'}
                    />
                    <CompactRow
                      icon={<BadgePercent className="w-3 h-3" />}
                      label="Percent"
                      value={`${selectedStudent.concessionPercentage}%`}
                    />
                  </div>
                )}
                {selectedStudent.hasScholarship && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <CompactRow
                      icon={<Award className="w-3 h-3" />}
                      label="Scholarship"
                      value={selectedStudent.scholarshipName || '-'}
                    />
                    <CompactRow
                      icon={<Banknote className="w-3 h-3" />}
                      label="Amount"
                      value={formatCurrency(selectedStudent.scholarshipAmount || 0)}
                    />
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Fee Summary */}
          <Card title="Fee Summary">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">Total Fee</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {formatCurrency(feeData.netAmount)}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">Total Paid</td>
                  <td className="px-3 py-2 text-right font-semibold text-green-600">
                    {formatCurrency(feeData.paidAmount)}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">Balance</td>
                  <td className="px-3 py-2 text-right font-semibold text-red-600">
                    {formatCurrency(feeData.balanceAmount)}
                  </td>
                </tr>
                {feeData.fineBalance > 0 && (
                  <tr className="bg-amber-50">
                    <td className="px-3 py-2 text-amber-700">Late Fine</td>
                    <td className="px-3 py-2 text-right font-semibold text-amber-700">
                      {formatCurrency(feeData.fineBalance)}
                    </td>
                  </tr>
                )}
                <tr className="bg-red-50">
                  <td className="px-3 py-2 text-red-700 font-medium">Total Due</td>
                  <td className="px-3 py-2 text-right font-bold text-red-700">
                    {formatCurrency(feeData.totalDue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Payment Summary */}
          {(selectedFeeHeadCount > 0 || finePayingAmount > 0) && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="p-3">
                <h4 className="text-xs font-semibold text-blue-800 mb-2">Payment Summary</h4>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="text-blue-700 py-0.5">Fee Heads ({selectedFeeHeadCount})</td>
                      <td className="text-right font-medium">{formatCurrency(selectedFeeTotal)}</td>
                    </tr>
                    {finePayingAmount > 0 && (
                      <tr>
                        <td className="text-blue-700 py-0.5">Fine</td>
                        <td className="text-right font-medium">
                          {formatCurrency(finePayingAmount)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t border-blue-200">
                      <td className="text-blue-900 font-semibold pt-1">Grand Total</td>
                      <td className="text-right font-bold text-blue-900 text-sm pt-1">
                        {formatCurrency(grandTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 pt-2 border-t border-blue-200 space-y-0.5">
                  {feeData.feeHeads
                    .filter((fh) => paymentEntries[fh.id]?.selected)
                    .map((fh) => (
                      <div key={fh.id} className="flex justify-between text-[10px]">
                        <span className="text-blue-800 truncate max-w-[140px]">{fh.name}</span>
                        <span className="font-medium">
                          {formatCurrency(paymentEntries[fh.id].payingAmount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
            {(
              [
                {
                  key: 'payment',
                  label: 'Make Payment',
                  icon: CreditCard,
                  count: unpaidFeeHeads.length,
                },
                {
                  key: 'history',
                  label: 'Receipt History',
                  icon: History,
                  count: selectedStudent.receiptHistory.length,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 inline mr-1" />
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* ==================== PAYMENT TAB ==================== */}
          {activeTab === 'payment' && (
            <>
              {/* Payment Details */}
              <Card title="Payment Details">
                <div className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Select
                      label="Payment Mode *"
                      options={paymentModeOptions}
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Receipt Date
                      </label>
                      <div className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {todayDisplay}
                      </div>
                    </div>
                  </div>

                  {/* Cheque / DD fields */}
                  {['cheque', 'dd'].includes(paymentMode) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 p-3 bg-gray-50 rounded-lg border">
                      <Input
                        label={`${paymentMode === 'cheque' ? 'Cheque' : 'DD'} Number *`}
                        value={chequeNo}
                        onChange={(e) => setChequeNo(e.target.value)}
                      />
                      <Input
                        label="Date *"
                        type="date"
                        value={chequeDate}
                        onChange={(e) => setChequeDate(e.target.value)}
                      />
                      <Input
                        label="Bank *"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>
                  )}

                  {/* UPI / NEFT / Card fields */}
                  {['upi', 'neft', 'card'].includes(paymentMode) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-lg border">
                      <Input
                        label="Reference / Transaction ID *"
                        value={referenceNo}
                        onChange={(e) => setReferenceNo(e.target.value)}
                      />
                      {paymentMode === 'card' && <Input label="Card Last 4 Digits" maxLength={4} />}
                    </div>
                  )}

                  {/* Bank Transfer fields - no date */}
                  {paymentMode === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-lg border">
                      <Input
                        label="Bank Name *"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                      <Input
                        label="Transaction ID *"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Narration</label>
                    <textarea
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      placeholder="Remarks..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      rows={2}
                    />
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t flex-wrap">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendSMS}
                        onChange={(e) => setSendSMS(e.target.checked)}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                      SMS
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWhatsApp}
                        onChange={(e) => setSendWhatsApp(e.target.checked)}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <Smartphone className="w-3.5 h-3.5 text-green-600" />
                      WhatsApp
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendInApp}
                        onChange={(e) => setSendInApp(e.target.checked)}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <Bell className="w-3.5 h-3.5 text-purple-500" />
                      In-App
                    </label>
                  </div>
                </div>
              </Card>

              {/* Fee Heads Selection */}
              <Card
                title="Select Fee Heads"
                subtitle="Choose fee heads and amounts to collect"
                action={
                  <div className="flex gap-1">
                    <Button variant="ghost" size="xs" onClick={handleDeselectAllFeeHeads}>
                      Clear
                    </Button>
                    <Button variant="secondary" size="xs" onClick={handleSelectAllFeeHeads}>
                      Select All
                    </Button>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left w-8">
                          <input
                            type="checkbox"
                            checked={
                              selectedFeeHeadCount === unpaidFeeHeads.length &&
                              unpaidFeeHeads.length > 0
                            }
                            onChange={(e) =>
                              e.target.checked
                                ? handleSelectAllFeeHeads()
                                : handleDeselectAllFeeHeads()
                            }
                            className="w-3.5 h-3.5 rounded"
                          />
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Fee Head
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">Gross</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">
                          Concession
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">Net</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">Paid</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">
                          Balance
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">
                          Paying
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {feeData.feeHeads.map((fh) => {
                        const balance = getFeeHeadBalance(feeData, fh)
                        const alreadyPaid = feeData.feeHeadPaidAmounts[fh.id] || 0
                        const entry = paymentEntries[fh.id]
                        const isFullyPaid = balance === 0
                        const isSelected = entry?.selected || false
                        return (
                          <tr
                            key={fh.id}
                            className={`${
                              isFullyPaid
                                ? 'bg-green-50/50 opacity-60'
                                : isSelected
                                ? 'bg-blue-50/50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-3 py-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleFeeHeadSelect(fh.id, e.target.checked)}
                                disabled={isFullyPaid}
                                className="w-3.5 h-3.5 rounded disabled:opacity-40"
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="font-medium text-gray-900">{fh.name}</span>
                              {isFullyPaid && (
                                <span className="ml-1">
                                  <Badge variant="success" size="xs">
                                    <CheckCircle className="w-2.5 h-2.5" />
                                    Paid
                                  </Badge>
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right text-gray-600">
                              {formatCurrency(fh.amount)}
                            </td>
                            <td className="px-3 py-2.5 text-right text-green-600">
                              {fh.discountAmount > 0
                                ? `-${formatCurrency(fh.discountAmount)}`
                                : '-'}
                            </td>
                            <td className="px-3 py-2.5 text-right font-medium">
                              {formatCurrency(fh.netAmount)}
                            </td>
                            <td className="px-3 py-2.5 text-right text-green-600">
                              {alreadyPaid > 0 ? formatCurrency(alreadyPaid) : '-'}
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold text-red-600">
                              {balance > 0 ? formatCurrency(balance) : '-'}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              {isSelected && !isFullyPaid ? (
                                <input
                                  type="number"
                                  value={entry?.payingAmount || 0}
                                  onChange={(e) =>
                                    handleFeeHeadAmountChange(
                                      fh.id,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  min={0}
                                  max={balance}
                                  className="w-24 px-2 py-1 text-xs border rounded text-right"
                                />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {isFullyPaid ? (
                                <Badge variant="success" size="xs">
                                  Paid
                                </Badge>
                              ) : alreadyPaid > 0 ? (
                                <Badge variant="warning" size="xs">
                                  Partial
                                </Badge>
                              ) : (
                                <Badge variant="gray" size="xs">
                                  Unpaid
                                </Badge>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {isSelected && !isFullyPaid && (
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handlePayFullFeeHead(fh.id)}
                                >
                                  Full
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>

                    {/* Fine Row */}
                    {feeData.fineBalance > 0 && (
                      <tfoot className="bg-amber-50/50 border-t">
                        <tr>
                          <td className="px-3 py-2.5"></td>
                          <td className="px-3 py-2.5 font-medium text-amber-700" colSpan={5}>
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            Late Fine ({feeData.daysOverdue} days overdue)
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold text-amber-700">
                            {formatCurrency(feeData.fineBalance)}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <input
                              type="number"
                              value={finePayingAmount}
                              onChange={(e) =>
                                handleFineAmountChange(parseFloat(e.target.value) || 0)
                              }
                              min={0}
                              max={feeData.fineBalance}
                              className="w-24 px-2 py-1 text-xs border rounded text-right"
                            />
                          </td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}

                    {/* Totals */}
                    <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                      <tr>
                        <td className="px-3 py-2.5"></td>
                        <td
                          className="px-3 py-2.5 text-sm font-semibold text-blue-800"
                          colSpan={6}
                        >
                          Total Paying ({selectedFeeHeadCount} fee head
                          {selectedFeeHeadCount !== 1 ? 's' : ''})
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm font-bold text-blue-900">
                          {formatCurrency(grandTotal)}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Action Bar */}
                <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    {selectedFeeHeadCount > 0 && (
                      <>
                        <span className="font-medium">{selectedFeeHeadCount} fee head(s)</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-blue-600">
                          Total: {formatCurrency(grandTotal)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetPaymentForm}>
                      <X className="w-3.5 h-3.5 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleGenerateReceipt}
                      disabled={selectedFeeHeadCount === 0 && finePayingAmount <= 0}
                      loading={isGenerating}
                    >
                      <Receipt className="w-3.5 h-3.5 mr-1" />
                      Generate Receipt
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ==================== HISTORY TAB ==================== */}
          {activeTab === 'history' && (
            <Card title="Receipt History" subtitle="View, print, or cancel receipts">
              <div className="overflow-x-auto">
                {selectedStudent.receiptHistory.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <History className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No receipts found</p>
                  </div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Receipt No
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Date</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Details
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Mode</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedStudent.receiptHistory.map((receipt) => (
                        <tr
                          key={receipt.id}
                          className={
                            receipt.status === 'cancelled' ? 'bg-red-50/50' : 'hover:bg-gray-50'
                          }
                        >
                          <td className="px-3 py-2">
                            <div className="font-medium text-blue-600">{receipt.receiptNo}</div>
                          </td>
                          <td className="px-3 py-2">
                            {new Date(receipt.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-3 py-2">
                            {receipt.feeHeads.map((fh, i) => (
                              <div
                                key={i}
                                className="text-[10px] text-gray-600 flex justify-between max-w-[250px]"
                              >
                                <span>{fh.feeHeadName}</span>
                                <span className="ml-2">{formatCurrency(fh.feeAmount)}</span>
                              </div>
                            ))}
                          </td>
                          <td className="px-3 py-2">{receipt.paymentMode}</td>
                          <td className="px-3 py-2 text-right font-semibold">
                            <span
                              className={
                                receipt.status === 'cancelled'
                                  ? 'line-through text-gray-400'
                                  : ''
                              }
                            >
                              {formatCurrency(receipt.totalAmount)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Badge
                              variant={receipt.status === 'completed' ? 'success' : 'danger'}
                              size="xs"
                            >
                              {receipt.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="p-1 hover:bg-gray-200 rounded"
                                title="View"
                                onClick={() => setViewingReceipt(receipt)}
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Print"
                                onClick={() => printHistoryReceipt(receipt)}
                              >
                                <Printer className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Download"
                                onClick={() => downloadHistoryReceipt(receipt)}
                              >
                                <Download className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              {receipt.status === 'completed' && (
                                <button
                                  className="p-1 hover:bg-red-100 rounded"
                                  title="Cancel receipt"
                                  onClick={() => handleCancelReceipt(receipt)}
                                >
                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ==================== RECEIPT PREVIEW MODAL ==================== */}
      <Modal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        title="Receipt Preview"
        size="xl"
      >
        {generatedReceipt && (
          <div className="p-4">
            <div className="border rounded-lg p-6 bg-white">
              <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">ABC International School</h2>
                <p className="text-xs text-gray-500">
                  123 Education Street, Knowledge City - 123456
                </p>
                <div className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  FEE RECEIPT
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p>
                    <span className="text-gray-500">Receipt No:</span>{' '}
                    <strong className="text-blue-600">{generatedReceipt.receiptNo}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Date:</span>{' '}
                    <strong>{todayDisplay}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Mode:</span>{' '}
                    <strong>
                      {paymentModeOptions.find((p) => p.value === paymentMode)?.label}
                    </strong>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-gray-500">Student:</span>{' '}
                    <strong>{generatedReceipt.student.name}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Adm No:</span>{' '}
                    <strong>{generatedReceipt.student.admissionNo}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Class:</span>{' '}
                    <strong>{generatedReceipt.student.class}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Branch:</span>{' '}
                    <strong>{generatedReceipt.student.branch}</strong>
                  </p>
                </div>
              </div>

              <table className="w-full text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left border">Fee Head</th>
                    <th className="px-3 py-2 text-right border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedReceipt.feeHeads.map((fh: any, i: number) => (
                    <tr key={i}>
                      <td className="px-3 py-2 border">{fh.feeHeadName}</td>
                      <td className="px-3 py-2 text-right border">
                        {formatCurrency(fh.feeAmount)}
                      </td>
                    </tr>
                  ))}
                  {generatedReceipt.fineAmount > 0 && (
                    <tr className="bg-amber-50">
                      <td className="px-3 py-2 border text-amber-700 font-medium">Late Fine</td>
                      <td className="px-3 py-2 text-right border text-amber-700">
                        {formatCurrency(generatedReceipt.fineAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-green-50">
                  <tr>
                    <td className="px-3 py-3 border font-bold">Grand Total</td>
                    <td className="px-3 py-3 text-right border font-bold text-green-700 text-lg">
                      {formatCurrency(generatedReceipt.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="p-3 bg-gray-50 rounded text-sm mb-4">
                <span className="text-gray-500">Amount in Words: </span>
                <strong>Rupees {numberToWords(generatedReceipt.grandTotal)} Only</strong>
              </div>
              {generatedReceipt.narration && (
                <div className="text-sm mb-4">
                  <span className="text-gray-500">Narration: </span>
                  <span className="italic">{generatedReceipt.narration}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-4 border-t text-xs text-gray-500">
                <div>
                  <p>
                    Ledger: <CheckCircle className="w-3 h-3 inline text-green-500" />
                  </p>
                  <p>
                    SMS:{' '}
                    {generatedReceipt.sendSMS ? (
                      <CheckCircle className="w-3 h-3 inline text-green-500" />
                    ) : (
                      <X className="w-3 h-3 inline text-gray-400" />
                    )}
                  </p>
                  <p>
                    Email:{' '}
                    {generatedReceipt.sendEmail ? (
                      <CheckCircle className="w-3 h-3 inline text-green-500" />
                    ) : (
                      <X className="w-3 h-3 inline text-gray-400" />
                    )}
                  </p>
                  <p>
                    WhatsApp:{' '}
                    {generatedReceipt.sendWhatsApp ? (
                      <CheckCircle className="w-3 h-3 inline text-green-500" />
                    ) : (
                      <X className="w-3 h-3 inline text-gray-400" />
                    )}
                  </p>
                  <p>
                    In-App:{' '}
                    {generatedReceipt.sendInApp ? (
                      <CheckCircle className="w-3 h-3 inline text-green-500" />
                    ) : (
                      <X className="w-3 h-3 inline text-gray-400" />
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-gray-300 pt-1">Authorized Signatory</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowReceiptPreview(false)}>
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmReceipt}>
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirm & Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== SUCCESS MODAL ==================== */}
      <Modal
        isOpen={showReceiptSuccess}
        onClose={() => {
          setShowReceiptSuccess(false)
          resetPaymentForm()
        }}
        title="Receipt Generated!"
        size="sm"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Receipt: <strong className="text-blue-600">{generatedReceipt?.receiptNo}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Amount:{' '}
            <strong className="text-green-600">
              {formatCurrency(generatedReceipt?.grandTotal || 0)}
            </strong>
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                generatedReceipt &&
                downloadDocument(
                  receiptFileName(generatedReceipt.receiptNo),
                  receiptDocument(generatedToPrintable(generatedReceipt))
                )
              }
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                generatedReceipt && printDocument(receiptDocument(generatedToPrintable(generatedReceipt)))
              }
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => {
              setShowReceiptSuccess(false)
              resetPaymentForm()
            }}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* ==================== RECEIPT DETAILS MODAL (history "View") ==================== */}
      <Modal
        isOpen={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        title={`Receipt ${viewingReceipt?.receiptNo || ''}`}
        size="md"
      >
        {viewingReceipt && (
          <div className="p-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Date:</span> <strong>{formatDate(viewingReceipt.date)}</strong>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Status:</span>
                <Badge variant={viewingReceipt.status === 'completed' ? 'success' : 'danger'} size="xs">
                  {viewingReceipt.status}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Mode:</span> <strong>{viewingReceipt.paymentMode}</strong>
              </div>
              <div>
                <span className="text-gray-500">Reference:</span> <strong>{viewingReceipt.referenceNo || '—'}</strong>
              </div>
              <div>
                <span className="text-gray-500">Generated by:</span> <strong>{viewingReceipt.generatedBy}</strong>
              </div>
              <div>
                <span className="text-gray-500">Ledger:</span>{' '}
                <strong>{viewingReceipt.ledgerPosted ? 'Posted' : 'Not posted'}</strong>
              </div>
            </div>
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Fee Head</th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {viewingReceipt.feeHeads.map((fh, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1.5">{fh.feeHeadName}</td>
                    <td className="px-2 py-1.5 text-right">{formatCurrency(fh.feeAmount)}</td>
                  </tr>
                ))}
                {viewingReceipt.fineAmount > 0 && (
                  <tr>
                    <td className="px-2 py-1.5">Late Fine</td>
                    <td className="px-2 py-1.5 text-right">{formatCurrency(viewingReceipt.fineAmount)}</td>
                  </tr>
                )}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-2 py-1.5">Total</td>
                  <td className="px-2 py-1.5 text-right">{formatCurrency(viewingReceipt.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
            {viewingReceipt.remarks && (
              <p className="text-xs text-gray-600">Remarks: {viewingReceipt.remarks}</p>
            )}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => downloadHistoryReceipt(viewingReceipt)}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => printHistoryReceipt(viewingReceipt)}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print
              </Button>
              <Button variant="primary" size="sm" onClick={() => setViewingReceipt(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== CANCEL MODAL ==================== */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Receipt"
        size="sm"
      >
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">This will reverse all ledger entries</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Receipt: <strong>{cancellingReceipt?.receiptNo}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Amount: <strong>{formatCurrency(cancellingReceipt?.totalAmount || 0)}</strong>
          </p>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason *</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCancelModal(false)}>
              Close
            </Button>
            <Button variant="danger" size="sm" onClick={confirmCancelReceipt}>
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FeeReceipt