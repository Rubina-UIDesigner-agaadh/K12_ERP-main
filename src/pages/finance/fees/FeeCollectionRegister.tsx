import React, { useState, Fragment } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import {
  Download,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Printer,
  Mail,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  X,
  Calendar,
  Clock,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Receipt,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Hash,
  IndianRupee,
  Phone,
  MapPin,
  GraduationCap,
  MessageSquare,
  History,
  Undo2,
  Ban,
  Edit,
  Trash2,
  Info,
  Share2,
  Bookmark,
  LayoutGrid,
  List,
} from 'lucide-react'
import { ReportFilters } from '../../../components/ReportFilters'
// Interfaces
interface FeeCollectionRecord {
  id: string
  serialNo: number
  receiptNo: string
  receiptDate: string
  receiptTime: string
  studentId: string
  studentName: string
  fatherName: string
  class: string
  section: string
  rollNo: string
  admissionNo: string
  contactNo: string
  feeHeads: FeeHead[]
  totalAmount: number
  discount: number
  fine: number
  netAmount: number
  paidAmount: number
  balanceAmount: number
  paymentMode: string
  transactionId: string
  bankName: string
  branchName: string
  chequeNo: string
  chequeDate: string
  cardLastDigits: string
  upiId: string
  cashier: string
  cashierId: string
  remarks: string
  status: 'completed' | 'pending' | 'cancelled' | 'bounced' | 'refunded'
  printCount: number
  lastPrintedAt: string
  createdAt: string
  updatedAt: string
  academicYear: string
  month: string
  receiptType: string
}
interface FeeHead {
  name: string
  amount: number
}
interface FilterState {
  dateFrom: string
  dateTo: string
  receiptNo: string
  studentSearch: string
  class: string
  section: string
  paymentMode: string
  cashier: string
  status: string
  minAmount: string
  maxAmount: string
  academicYear: string
  feeType: string
  receiptType: string
  bankName: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  itemsPerPage: number
  viewMode: 'table' | 'grid'
}
interface ReceiptModalData {
  isOpen: boolean
  data: FeeCollectionRecord | null
}
// Initial state
const INITIAL_FILTERS: FilterState = {
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  receiptNo: '',
  studentSearch: '',
  class: '',
  section: '',
  paymentMode: '',
  cashier: '',
  status: '',
  minAmount: '',
  maxAmount: '',
  academicYear: '2024-2025',
  feeType: '',
  receiptType: '',
  bankName: '',
  sortBy: 'receiptTime',
  sortOrder: 'desc',
  itemsPerPage: 25,
  viewMode: 'table',
}
// Constants
const ACADEMIC_YEARS = [
  {
    value: '2024-2025',
    label: '2024-2025',
  },
  {
    value: '2023-2024',
    label: '2023-2024',
  },
  {
    value: '2022-2023',
    label: '2022-2023',
  },
]
const CLASSES = [
  {
    value: '',
    label: 'All Classes',
  },
  {
    value: 'nursery',
    label: 'Nursery',
  },
  {
    value: 'lkg',
    label: 'LKG',
  },
  {
    value: 'ukg',
    label: 'UKG',
  },
  {
    value: '1',
    label: 'Class 1',
  },
  {
    value: '2',
    label: 'Class 2',
  },
  {
    value: '3',
    label: 'Class 3',
  },
  {
    value: '4',
    label: 'Class 4',
  },
  {
    value: '5',
    label: 'Class 5',
  },
  {
    value: '6',
    label: 'Class 6',
  },
  {
    value: '7',
    label: 'Class 7',
  },
  {
    value: '8',
    label: 'Class 8',
  },
  {
    value: '9',
    label: 'Class 9',
  },
  {
    value: '10',
    label: 'Class 10',
  },
  {
    value: '11',
    label: 'Class 11',
  },
  {
    value: '12',
    label: 'Class 12',
  },
]
const SECTIONS = [
  {
    value: '',
    label: 'All Sections',
  },
  {
    value: 'A',
    label: 'Section A',
  },
  {
    value: 'B',
    label: 'Section B',
  },
  {
    value: 'C',
    label: 'Section C',
  },
  {
    value: 'D',
    label: 'Section D',
  },
]
const PAYMENT_MODES = [
  {
    value: '',
    label: 'All Payment Modes',
  },
  {
    value: 'cash',
    label: 'Cash',
  },
  {
    value: 'cheque',
    label: 'Cheque',
  },
  {
    value: 'dd',
    label: 'Demand Draft',
  },
  {
    value: 'online',
    label: 'Online Transfer',
  },
  {
    value: 'upi',
    label: 'UPI',
  },
  {
    value: 'card',
    label: 'Credit/Debit Card',
  },
  {
    value: 'neft',
    label: 'NEFT',
  },
  {
    value: 'rtgs',
    label: 'RTGS',
  },
  {
    value: 'imps',
    label: 'IMPS',
  },
  {
    value: 'wallet',
    label: 'Digital Wallet',
  },
]
const CASHIERS = [
  {
    value: '',
    label: 'All Cashiers',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'accountant1',
    label: 'Mr. Sharma (Accountant)',
  },
  {
    value: 'accountant2',
    label: 'Mrs. Gupta (Accountant)',
  },
  {
    value: 'receptionist',
    label: 'Reception Desk',
  },
  {
    value: 'online',
    label: 'Online System',
  },
]
const STATUS_OPTIONS = [
  {
    value: '',
    label: 'All Status',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
  {
    value: 'bounced',
    label: 'Bounced',
  },
  {
    value: 'refunded',
    label: 'Refunded',
  },
]
const FEE_TYPES = [
  {
    value: '',
    label: 'All Fee Types',
  },
  {
    value: 'tuition',
    label: 'Tuition Fee',
  },
  {
    value: 'transport',
    label: 'Transport Fee',
  },
  {
    value: 'hostel',
    label: 'Hostel Fee',
  },
  {
    value: 'exam',
    label: 'Examination Fee',
  },
  {
    value: 'library',
    label: 'Library Fee',
  },
  {
    value: 'lab',
    label: 'Laboratory Fee',
  },
  {
    value: 'sports',
    label: 'Sports Fee',
  },
  {
    value: 'annual',
    label: 'Annual Fee',
  },
  {
    value: 'admission',
    label: 'Admission Fee',
  },
  {
    value: 'miscellaneous',
    label: 'Miscellaneous',
  },
]
const RECEIPT_TYPES = [
  {
    value: '',
    label: 'All Types',
  },
  {
    value: 'regular',
    label: 'Regular Receipt',
  },
  {
    value: 'advance',
    label: 'Advance Payment',
  },
  {
    value: 'arrear',
    label: 'Arrear Payment',
  },
  {
    value: 'fine',
    label: 'Fine Payment',
  },
  {
    value: 'refund',
    label: 'Refund',
  },
]
const BANKS = [
  {
    value: '',
    label: 'All Banks',
  },
  {
    value: 'sbi',
    label: 'State Bank of India',
  },
  {
    value: 'hdfc',
    label: 'HDFC Bank',
  },
  {
    value: 'icici',
    label: 'ICICI Bank',
  },
  {
    value: 'axis',
    label: 'Axis Bank',
  },
  {
    value: 'pnb',
    label: 'Punjab National Bank',
  },
  {
    value: 'bob',
    label: 'Bank of Baroda',
  },
  {
    value: 'kotak',
    label: 'Kotak Mahindra Bank',
  },
  {
    value: 'yes',
    label: 'Yes Bank',
  },
  {
    value: 'other',
    label: 'Other',
  },
]
const AMOUNT_OPTIONS = [
  {
    value: '',
    label: 'Any Amount',
  },
  {
    value: '1000',
    label: '₹1,000',
  },
  {
    value: '5000',
    label: '₹5,000',
  },
  {
    value: '10000',
    label: '₹10,000',
  },
  {
    value: '25000',
    label: '₹25,000',
  },
  {
    value: '50000',
    label: '₹50,000',
  },
  {
    value: '100000',
    label: '₹1,00,000',
  },
]
const SORT_OPTIONS = [
  {
    value: 'receiptTime',
    label: 'Receipt Time',
  },
  {
    value: 'receiptNo',
    label: 'Receipt Number',
  },
  {
    value: 'studentName',
    label: 'Student Name',
  },
  {
    value: 'class',
    label: 'Class',
  },
  {
    value: 'paidAmount',
    label: 'Amount Paid',
  },
  {
    value: 'paymentMode',
    label: 'Payment Mode',
  },
  {
    value: 'cashier',
    label: 'Cashier',
  },
  {
    value: 'status',
    label: 'Status',
  },
]
const ITEMS_PER_PAGE_OPTIONS = [
  {
    value: 10,
    label: '10',
  },
  {
    value: 25,
    label: '25',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 100,
    label: '100',
  },
  {
    value: 250,
    label: '250',
  },
]
// Sample data
const REGISTER_DATA: FeeCollectionRecord[] = [
  {
    id: '1',
    serialNo: 1,
    receiptNo: 'RCP-2024-001',
    receiptDate: '2024-01-15',
    receiptTime: '09:15:32',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    fatherName: 'Mr. Rajesh Sharma',
    class: '10',
    section: 'A',
    rollNo: '15',
    admissionNo: 'ADM-2020-1045',
    contactNo: '+91 98765 43210',
    feeHeads: [
      {
        name: 'Tuition Fee',
        amount: 3500,
      },
      {
        name: 'Library Fee',
        amount: 500,
      },
      {
        name: 'Lab Fee',
        amount: 1000,
      },
    ],
    totalAmount: 5000,
    discount: 0,
    fine: 0,
    netAmount: 5000,
    paidAmount: 5000,
    balanceAmount: 0,
    paymentMode: 'Cash',
    transactionId: '-',
    bankName: '-',
    branchName: '-',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Mr. Sharma',
    cashierId: 'EMP001',
    remarks: 'January fees paid in full',
    status: 'completed',
    printCount: 1,
    lastPrintedAt: '2024-01-15 09:20:00',
    createdAt: '2024-01-15 09:15:32',
    updatedAt: '2024-01-15 09:15:32',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Regular Receipt',
  },
  {
    id: '2',
    serialNo: 2,
    receiptNo: 'RCP-2024-002',
    receiptDate: '2024-01-15',
    receiptTime: '10:30:45',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    fatherName: 'Mr. Vikram Patel',
    class: '9',
    section: 'B',
    rollNo: '08',
    admissionNo: 'ADM-2021-0892',
    contactNo: '+91 98765 43211',
    feeHeads: [
      {
        name: 'Tuition Fee',
        amount: 10000,
      },
      {
        name: 'Transport Fee',
        amount: 3000,
      },
      {
        name: 'Annual Fee',
        amount: 2000,
      },
    ],
    totalAmount: 15000,
    discount: 0,
    fine: 0,
    netAmount: 15000,
    paidAmount: 15000,
    balanceAmount: 0,
    paymentMode: 'Cheque',
    transactionId: 'CHQ-456789',
    bankName: 'HDFC Bank',
    branchName: 'Sector 62, Noida',
    chequeNo: '456789',
    chequeDate: '2024-01-15',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Mrs. Gupta',
    cashierId: 'EMP002',
    remarks: 'Q4 fees with transport',
    status: 'pending',
    printCount: 0,
    lastPrintedAt: '-',
    createdAt: '2024-01-15 10:30:45',
    updatedAt: '2024-01-15 10:30:45',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Regular Receipt',
  },
  {
    id: '3',
    serialNo: 3,
    receiptNo: 'RCP-2024-003',
    receiptDate: '2024-01-15',
    receiptTime: '11:45:20',
    studentId: 'STU003',
    studentName: 'Amit Kumar',
    fatherName: 'Mr. Suresh Kumar',
    class: '8',
    section: 'C',
    rollNo: '22',
    admissionNo: 'ADM-2022-0567',
    contactNo: '+91 98765 43212',
    feeHeads: [
      {
        name: 'Tuition Fee',
        amount: 15000,
      },
      {
        name: 'Hostel Fee',
        amount: 8000,
      },
      {
        name: 'Mess Fee',
        amount: 2000,
      },
    ],
    totalAmount: 25000,
    discount: 0,
    fine: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balanceAmount: 0,
    paymentMode: 'Online',
    transactionId: 'TXN789456123',
    bankName: 'SBI',
    branchName: 'Main Branch',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Online System',
    cashierId: 'SYS',
    remarks: 'Online payment via school portal',
    status: 'completed',
    printCount: 2,
    lastPrintedAt: '2024-01-15 12:00:00',
    createdAt: '2024-01-15 11:45:20',
    updatedAt: '2024-01-15 11:45:20',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Regular Receipt',
  },
  {
    id: '4',
    serialNo: 4,
    receiptNo: 'RCP-2024-004',
    receiptDate: '2024-01-15',
    receiptTime: '12:20:10',
    studentId: 'STU004',
    studentName: 'Sneha Reddy',
    fatherName: 'Mr. Venkat Reddy',
    class: '11',
    section: 'A',
    rollNo: '05',
    admissionNo: 'ADM-2023-0234',
    contactNo: '+91 98765 43213',
    feeHeads: [
      {
        name: 'Admission Fee',
        amount: 20000,
      },
      {
        name: 'Tuition Fee',
        amount: 12000,
      },
      {
        name: 'Development Fee',
        amount: 3000,
      },
    ],
    totalAmount: 35000,
    discount: 5000,
    fine: 0,
    netAmount: 30000,
    paidAmount: 30000,
    balanceAmount: 0,
    paymentMode: 'UPI',
    transactionId: 'UPI123456789012',
    bankName: 'Paytm',
    branchName: '-',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '-',
    upiId: 'parent@paytm',
    cashier: 'Mr. Sharma',
    cashierId: 'EMP001',
    remarks: 'New admission with scholarship discount',
    status: 'completed',
    printCount: 1,
    lastPrintedAt: '2024-01-15 12:25:00',
    createdAt: '2024-01-15 12:20:10',
    updatedAt: '2024-01-15 12:20:10',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Advance Payment',
  },
  {
    id: '5',
    serialNo: 5,
    receiptNo: 'RCP-2024-005',
    receiptDate: '2024-01-15',
    receiptTime: '14:05:55',
    studentId: 'STU005',
    studentName: 'Arjun Singh',
    fatherName: 'Mr. Harpreet Singh',
    class: '7',
    section: 'B',
    rollNo: '18',
    admissionNo: 'ADM-2019-0789',
    contactNo: '+91 98765 43214',
    feeHeads: [
      {
        name: 'Tuition Fee',
        amount: 4000,
      },
      {
        name: 'Late Fine',
        amount: 500,
      },
    ],
    totalAmount: 4000,
    discount: 0,
    fine: 500,
    netAmount: 4500,
    paidAmount: 4500,
    balanceAmount: 0,
    paymentMode: 'Card',
    transactionId: 'POS456789012',
    bankName: 'ICICI Bank',
    branchName: '-',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '4532',
    upiId: '-',
    cashier: 'Mrs. Gupta',
    cashierId: 'EMP002',
    remarks: 'Late fee payment with fine',
    status: 'completed',
    printCount: 1,
    lastPrintedAt: '2024-01-15 14:10:00',
    createdAt: '2024-01-15 14:05:55',
    updatedAt: '2024-01-15 14:05:55',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Arrear Payment',
  },
  {
    id: '6',
    serialNo: 6,
    receiptNo: 'RCP-2024-006',
    receiptDate: '2024-01-15',
    receiptTime: '15:30:22',
    studentId: 'STU006',
    studentName: 'Meera Joshi',
    fatherName: 'Mr. Prakash Joshi',
    class: '6',
    section: 'A',
    rollNo: '12',
    admissionNo: 'ADM-2020-0456',
    contactNo: '+91 98765 43215',
    feeHeads: [
      {
        name: 'Tuition Fee',
        amount: 8000,
      },
    ],
    totalAmount: 8000,
    discount: 0,
    fine: 0,
    netAmount: 8000,
    paidAmount: 8000,
    balanceAmount: 0,
    paymentMode: 'Cheque',
    transactionId: 'CHQ-123456',
    bankName: 'Axis Bank',
    branchName: 'MG Road, Delhi',
    chequeNo: '123456',
    chequeDate: '2024-01-15',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Mr. Sharma',
    cashierId: 'EMP001',
    remarks: '',
    status: 'bounced',
    printCount: 1,
    lastPrintedAt: '2024-01-15 15:35:00',
    createdAt: '2024-01-15 15:30:22',
    updatedAt: '2024-01-16 10:00:00',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Regular Receipt',
  },
  {
    id: '7',
    serialNo: 7,
    receiptNo: 'RCP-2024-007',
    receiptDate: '2024-01-15',
    receiptTime: '16:15:40',
    studentId: 'STU007',
    studentName: 'Karan Malhotra',
    fatherName: 'Mr. Anil Malhotra',
    class: '12',
    section: 'B',
    rollNo: '03',
    admissionNo: 'ADM-2018-0123',
    contactNo: '+91 98765 43216',
    feeHeads: [
      {
        name: 'Board Exam Fee',
        amount: 5000,
      },
      {
        name: 'Practical Fee',
        amount: 2000,
      },
    ],
    totalAmount: 7000,
    discount: 0,
    fine: 0,
    netAmount: 7000,
    paidAmount: 7000,
    balanceAmount: 0,
    paymentMode: 'NEFT',
    transactionId: 'NEFT789012345678',
    bankName: 'PNB',
    branchName: 'Connaught Place',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Online System',
    cashierId: 'SYS',
    remarks: 'Board examination fee',
    status: 'completed',
    printCount: 0,
    lastPrintedAt: '-',
    createdAt: '2024-01-15 16:15:40',
    updatedAt: '2024-01-15 16:15:40',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Regular Receipt',
  },
  {
    id: '8',
    serialNo: 8,
    receiptNo: 'RCP-2024-008',
    receiptDate: '2024-01-15',
    receiptTime: '16:45:18',
    studentId: 'STU008',
    studentName: 'Ananya Mishra',
    fatherName: 'Mr. Deepak Mishra',
    class: '5',
    section: 'C',
    rollNo: '25',
    admissionNo: 'ADM-2021-0678',
    contactNo: '+91 98765 43217',
    feeHeads: [
      {
        name: 'Refund - Transport Fee',
        amount: -3000,
      },
    ],
    totalAmount: -3000,
    discount: 0,
    fine: 0,
    netAmount: -3000,
    paidAmount: -3000,
    balanceAmount: 0,
    paymentMode: 'NEFT',
    transactionId: 'REF-NEFT456789',
    bankName: 'HDFC Bank',
    branchName: 'Parent Account',
    chequeNo: '-',
    chequeDate: '-',
    cardLastDigits: '-',
    upiId: '-',
    cashier: 'Mrs. Gupta',
    cashierId: 'EMP002',
    remarks: 'Transport fee refund - route discontinued',
    status: 'refunded',
    printCount: 1,
    lastPrintedAt: '2024-01-15 16:50:00',
    createdAt: '2024-01-15 16:45:18',
    updatedAt: '2024-01-15 16:45:18',
    academicYear: '2024-2025',
    month: 'January',
    receiptType: 'Refund',
  },
]
export function FeeCollectionRegister() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [receiptModal, setReceiptModal] = useState<ReceiptModalData>({
    isOpen: false,
    data: null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  // Computed values
  const totalPages = Math.ceil(REGISTER_DATA.length / filters.itemsPerPage)
  const startIndex = (currentPage - 1) * filters.itemsPerPage
  const endIndex = startIndex + filters.itemsPerPage
  const paginatedData = REGISTER_DATA.slice(startIndex, endIndex)
  // Calculate totals
  const totals = REGISTER_DATA.reduce(
    (acc, item) => ({
      totalReceipts: acc.totalReceipts + 1,
      totalAmount: acc.totalAmount + item.paidAmount,
      cashAmount:
        acc.cashAmount + (item.paymentMode === 'Cash' ? item.paidAmount : 0),
      chequeAmount:
        acc.chequeAmount +
        (item.paymentMode === 'Cheque' ? item.paidAmount : 0),
      onlineAmount:
        acc.onlineAmount +
        (['Online', 'UPI', 'NEFT', 'RTGS', 'IMPS'].includes(item.paymentMode)
          ? item.paidAmount
          : 0),
      cardAmount:
        acc.cardAmount + (item.paymentMode === 'Card' ? item.paidAmount : 0),
      discountGiven: acc.discountGiven + item.discount,
      fineCollected: acc.fineCollected + item.fine,
    }),
    {
      totalReceipts: 0,
      totalAmount: 0,
      cashAmount: 0,
      chequeAmount: 0,
      onlineAmount: 0,
      cardAmount: 0,
      discountGiven: 0,
      fineCollected: 0,
    },
  )
  // Handlers
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
  }
  const handleApplyFilters = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map((item) => item.id))
    }
  }
  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }
  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }
  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }
  const openReceiptModal = (data: FeeCollectionRecord) => {
    setReceiptModal({
      isOpen: true,
      data,
    })
  }
  const closeReceiptModal = () => {
    setReceiptModal({
      isOpen: false,
      data: null,
    })
  }
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    const formatted = `₹${absAmount.toLocaleString('en-IN')}`
    return amount < 0 ? `-${formatted}` : formatted
  }
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        )
      case 'bounced':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Bounced
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <Undo2 className="w-3 h-3" />
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  // Get payment mode icon
  const getPaymentModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'cash':
        return <Banknote className="w-4 h-4 text-green-600" />
      case 'cheque':
        return <FileText className="w-4 h-4 text-blue-600" />
      case 'online':
      case 'neft':
      case 'rtgs':
      case 'imps':
        return <Building2 className="w-4 h-4 text-purple-600" />
      case 'upi':
        return <Smartphone className="w-4 h-4 text-orange-600" />
      case 'card':
        return <CreditCard className="w-4 h-4 text-indigo-600" />
      default:
        return <IndianRupee className="w-4 h-4 text-gray-600" />
    }
  }
  // Table columns
  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={
            selectedRows.length === paginatedData.length &&
            paginatedData.length > 0
          }
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (row: FeeCollectionRecord) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      width: '40px',
    },
    {
      key: 'expand',
      header: '',
      render: (row: FeeCollectionRecord) => (
        <button
          onClick={() => toggleRowExpand(row.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {expandedRows.includes(row.id) ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
      ),
      width: '40px',
    },
    {
      key: 'serial',
      header: '#',
      render: (row: FeeCollectionRecord) => (
        <span className="text-xs text-gray-500 font-mono">{row.serialNo}</span>
      ),
      width: '40px',
    },
    {
      key: 'time',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('receiptTime')}
        >
          Time
          {filters.sortBy === 'receiptTime' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-900 font-medium">
            <Clock className="w-3 h-3 text-gray-400" />
            {formatTime(row.receiptTime)}
          </div>
          <p className="text-xs text-gray-500">{formatDate(row.receiptDate)}</p>
        </div>
      ),
    },
    {
      key: 'receipt',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('receiptNo')}
        >
          Receipt No
          {filters.sortBy === 'receiptNo' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div>
          <span className="font-bold text-blue-600 font-mono text-sm">
            {row.receiptNo}
          </span>
          <p className="text-xs text-gray-400">{row.receiptType}</p>
        </div>
      ),
    },
    {
      key: 'student',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('studentName')}
        >
          Student Details
          {filters.sortBy === 'studentName' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {row.studentName}
            </span>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Class {row.class}-{row.section} | Roll: {row.rollNo}
          </p>
          <p className="text-xs text-gray-400 ml-6">{row.admissionNo}</p>
        </div>
      ),
    },
    {
      key: 'feeDetails',
      header: 'Fee Details',
      render: (row: FeeCollectionRecord) => (
        <div className="text-xs space-y-0.5">
          {row.feeHeads.slice(0, 2).map((head, idx) => (
            <div key={idx} className="flex justify-between gap-4">
              <span className="text-gray-600 truncate max-w-[100px]">
                {head.name}
              </span>
              <span
                className={`font-medium ${head.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}
              >
                {formatCurrency(head.amount)}
              </span>
            </div>
          ))}
          {row.feeHeads.length > 2 && (
            <p className="text-blue-600">+{row.feeHeads.length - 2} more</p>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('paidAmount')}
        >
          Amount
          {filters.sortBy === 'paidAmount' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div className="text-right">
          <span
            className={`text-lg font-bold ${row.paidAmount < 0 ? 'text-red-600' : 'text-green-600'}`}
          >
            {formatCurrency(row.paidAmount)}
          </span>
          {(row.discount > 0 || row.fine > 0) && (
            <div className="text-xs space-y-0.5">
              {row.discount > 0 && (
                <p className="text-orange-500">
                  Discount: -{formatCurrency(row.discount)}
                </p>
              )}
              {row.fine > 0 && (
                <p className="text-red-500">
                  Fine: +{formatCurrency(row.fine)}
                </p>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'mode',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('paymentMode')}
        >
          Payment Mode
          {filters.sortBy === 'paymentMode' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div className="flex items-center gap-2">
          {getPaymentModeIcon(row.paymentMode)}
          <div>
            <span className="font-medium text-gray-900 text-sm">
              {row.paymentMode}
            </span>
            {row.bankName !== '-' && (
              <p className="text-xs text-gray-500">{row.bankName}</p>
            )}
            {row.transactionId !== '-' && (
              <p
                className="text-xs text-gray-400 font-mono truncate max-w-[100px]"
                title={row.transactionId}
              >
                {row.transactionId}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: FeeCollectionRecord) => getStatusBadge(row.status),
    },
    {
      key: 'cashier',
      header: (
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleSort('cashier')}
        >
          Cashier
          {filters.sortBy === 'cashier' &&
            (filters.sortOrder === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            ))}
        </button>
      ),
      render: (row: FeeCollectionRecord) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <span className="text-sm text-gray-900">{row.cashier}</span>
            <p className="text-xs text-gray-400">{row.cashierId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'print',
      header: 'Print',
      render: (row: FeeCollectionRecord) => (
        <div className="text-center">
          <span
            className={`text-sm font-medium ${row.printCount > 0 ? 'text-green-600' : 'text-gray-400'}`}
          >
            {row.printCount}x
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: FeeCollectionRecord) => (
        <div className="relative flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            title="View Receipt"
            onClick={() => openReceiptModal(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Print Receipt">
            <Printer className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="More Actions"
            onClick={() =>
              setShowActionMenu(showActionMenu === row.id ? null : row.id)
            }
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showActionMenu === row.id && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500">
                  Receipt: {row.receiptNo}
                </p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Eye className="w-4 h-4 text-gray-400" />
                View Full Receipt
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Printer className="w-4 h-4 text-gray-400" />
                Print Receipt
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Copy className="w-4 h-4 text-gray-400" />
                Duplicate Receipt
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                Email to Parent
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Send SMS
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <History className="w-4 h-4 text-gray-400" />
                View Student Ledger
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                Call Parent
              </button>
              <div className="border-t border-gray-100 my-1" />
              {row.status === 'completed' && (
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-orange-600">
                  <Undo2 className="w-4 h-4" />
                  Initiate Refund
                </button>
              )}
              {row.status === 'pending' && (
                <>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600">
                    <Ban className="w-4 h-4" />
                    Cancel Receipt
                  </button>
                </>
              )}
              {row.paymentMode === 'Cheque' && row.status === 'pending' && (
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  Mark as Bounced
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ]
  // Expanded row content
  const renderExpandedRow = (row: FeeCollectionRecord) => (
    <tr className="bg-gray-50">
      <td colSpan={columns.length} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Information
            </h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Name:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Father:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.fatherName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Class:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.class}-{row.section}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Admission No:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.admissionNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Contact:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.contactNo}
                </span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Fee Breakdown
            </h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              {row.feeHeads.map((head, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-xs text-gray-600">{head.name}:</span>
                  <span
                    className={`text-xs font-medium ${head.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}
                  >
                    {formatCurrency(head.amount)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="text-xs font-medium">
                    {formatCurrency(row.totalAmount)}
                  </span>
                </div>
                {row.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Discount:</span>
                    <span className="text-xs text-orange-600">
                      -{formatCurrency(row.discount)}
                    </span>
                  </div>
                )}
                {row.fine > 0 && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Fine:</span>
                    <span className="text-xs text-red-600">
                      +{formatCurrency(row.fine)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span className="text-xs text-gray-700">Net Amount:</span>
                  <span className="text-xs text-green-600">
                    {formatCurrency(row.netAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Details
            </h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Mode:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.paymentMode}
                </span>
              </div>
              {row.transactionId !== '-' && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Transaction ID:</span>
                  <span className="text-xs font-mono text-gray-900">
                    {row.transactionId}
                  </span>
                </div>
              )}
              {row.bankName !== '-' && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Bank:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {row.bankName}
                  </span>
                </div>
              )}
              {row.chequeNo !== '-' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Cheque No:</span>
                    <span className="text-xs font-medium text-gray-900">
                      {row.chequeNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Cheque Date:</span>
                    <span className="text-xs font-medium text-gray-900">
                      {row.chequeDate}
                    </span>
                  </div>
                </>
              )}
              {row.upiId !== '-' && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">UPI ID:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {row.upiId}
                  </span>
                </div>
              )}
              {row.cardLastDigits !== '-' && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Card:</span>
                  <span className="text-xs font-medium text-gray-900">
                    ****{row.cardLastDigits}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Remarks & Meta */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Additional Info
            </h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Cashier:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.cashier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Print Count:</span>
                <span className="text-xs font-medium text-gray-900">
                  {row.printCount}
                </span>
              </div>
              {row.lastPrintedAt !== '-' && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Last Printed:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {row.lastPrintedAt}
                  </span>
                </div>
              )}
              {row.remarks && (
                <div className="pt-2 border-t">
                  <span className="text-xs text-gray-500">Remarks:</span>
                  <p className="text-xs text-gray-700 mt-1">{row.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Fee Collection Register
            </h1>
            <Badge variant="info">{REGISTER_DATA.length} Records</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Daily chronological register of all fee collections with detailed
            payment information
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Date: {formatDate(filters.dateFrom)}
              {filters.dateFrom !== filters.dateTo &&
                ` to ${formatDate(filters.dateTo)}`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last refreshed: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Save View
          </Button>
          <Button
            variant="outline"
            onClick={handleApplyFilters}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">
                    Export Options
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export as Excel (.xlsx)
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-red-600" />
                  Export as PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Export as CSV
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                  <Printer className="w-4 h-4 text-gray-600" />
                  Print Register
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600" />
                  Email Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Search & Filter Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Search & Filters</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset All
            </Button>
          </div>

          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="RCP-2024-XXX"
                  value={filters.receiptNo}
                  onChange={(e) =>
                    handleFilterChange('receiptNo', e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Adm No, Roll..."
                  value={filters.studentSearch}
                  onChange={(e) =>
                    handleFilterChange('studentSearch', e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <Select
              label="Payment Mode"
              value={filters.paymentMode}
              onChange={(e) =>
                handleFilterChange('paymentMode', e.target.value)
              }
              options={PAYMENT_MODES}
            />

            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              {showAdvancedFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-gray-200 space-y-6">
              {/* Class & Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Class & Section
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <Select
                    label="Academic Year"
                    value={filters.academicYear}
                    onChange={(e) =>
                      handleFilterChange('academicYear', e.target.value)
                    }
                    options={ACADEMIC_YEARS}
                  />

                  <Select
                    label="Class"
                    value={filters.class}
                    onChange={(e) =>
                      handleFilterChange('class', e.target.value)
                    }
                    options={CLASSES}
                  />

                  <Select
                    label="Section"
                    value={filters.section}
                    onChange={(e) =>
                      handleFilterChange('section', e.target.value)
                    }
                    options={SECTIONS}
                  />

                  <Select
                    label="Fee Type"
                    value={filters.feeType}
                    onChange={(e) =>
                      handleFilterChange('feeType', e.target.value)
                    }
                    options={FEE_TYPES}
                  />

                  <Select
                    label="Receipt Type"
                    value={filters.receiptType}
                    onChange={(e) =>
                      handleFilterChange('receiptType', e.target.value)
                    }
                    options={RECEIPT_TYPES}
                  />

                  <Select
                    label="Cashier"
                    value={filters.cashier}
                    onChange={(e) =>
                      handleFilterChange('cashier', e.target.value)
                    }
                    options={CASHIERS}
                  />
                </div>
              </div>

              {/* Amount & Bank Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Amount & Bank
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <Select
                    label="Min Amount"
                    value={filters.minAmount}
                    onChange={(e) =>
                      handleFilterChange('minAmount', e.target.value)
                    }
                    options={AMOUNT_OPTIONS}
                  />

                  <Select
                    label="Max Amount"
                    value={filters.maxAmount}
                    onChange={(e) =>
                      handleFilterChange('maxAmount', e.target.value)
                    }
                    options={AMOUNT_OPTIONS}
                  />

                  <Select
                    label="Bank Name"
                    value={filters.bankName}
                    onChange={(e) =>
                      handleFilterChange('bankName', e.target.value)
                    }
                    options={BANKS}
                  />
                </div>
              </div>

              {/* Sorting & Display */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Sorting & Display
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select
                    label="Sort By"
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    options={SORT_OPTIONS}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <button
                      onClick={toggleSortOrder}
                      className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <span>
                        {filters.sortOrder === 'asc'
                          ? '↑ Ascending'
                          : '↓ Descending'}
                      </span>
                      <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      View Mode
                    </label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleFilterChange('viewMode', 'table')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm ${filters.viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        <List className="w-4 h-4" />
                        Table
                      </button>
                      <button
                        onClick={() => handleFilterChange('viewMode', 'grid')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm ${filters.viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Grid
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Items Per Page
                    </label>
                    <select
                      value={filters.itemsPerPage}
                      onChange={(e) =>
                        handleFilterChange(
                          'itemsPerPage',
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} per page
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {paginatedData.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-900">
                {REGISTER_DATA.length}
              </span>{' '}
              records
              {selectedRows.length > 0 && (
                <span className="ml-2">
                  |{' '}
                  <span className="font-semibold text-blue-600">
                    {selectedRows.length}
                  </span>{' '}
                  selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                {selectedRows.length} receipt(s) selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Printer className="w-4 h-4 mr-2" />
                Print Selected
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Mail className="w-4 h-4 mr-2" />
                Email Receipts
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRows([])}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    style={{
                      width: column.width,
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(row.id) ? 'bg-blue-50' : ''} ${expandedRows.includes(row.id) ? 'bg-gray-100' : ''} ${row.status === 'bounced' ? 'bg-red-50' : ''} ${row.status === 'cancelled' ? 'bg-gray-100' : ''}`}
                  >
                    {columns.map((column, index) => (
                      <td
                        key={index}
                        className="px-4 py-3 text-sm whitespace-nowrap"
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                  {expandedRows.includes(row.id) && renderExpandedRow(row)}
                </Fragment>
              ))}
            </tbody>
            {/* Table Footer with Totals */}
            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                >
                  TOTAL ({totals.totalReceipts} Receipts):
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(totals.totalAmount)}
                  </span>
                </td>
                <td colSpan={5} className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(endIndex, REGISTER_DATA.length)}
              </span>{' '}
              of <span className="font-medium">{REGISTER_DATA.length}</span>{' '}
              entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(totalPages, 5),
                  },
                  (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                      >
                        {pageNum}
                      </button>
                    )
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Go to:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
              />
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Status Legend
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-600">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-600">Bounced</span>
              </div>
              <div className="flex items-center gap-2">
                <Undo2 className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">Refunded</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Payment Modes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Cheque</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Online/NEFT</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-gray-600">Card</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Receipt Preview Modal */}
      {receiptModal.isOpen && receiptModal.data && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Receipt: {receiptModal.data.receiptNo}
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(receiptModal.data.receiptDate)} at{' '}
                  {formatTime(receiptModal.data.receiptTime)}
                </p>
              </div>
              <button
                onClick={closeReceiptModal}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Receipt Content */}
              <div className="space-y-6">
                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Student Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-500">Name:</span>{' '}
                        {receiptModal.data.studentName}
                      </p>
                      <p>
                        <span className="text-gray-500">Father:</span>{' '}
                        {receiptModal.data.fatherName}
                      </p>
                      <p>
                        <span className="text-gray-500">Class:</span>{' '}
                        {receiptModal.data.class}-{receiptModal.data.section}
                      </p>
                      <p>
                        <span className="text-gray-500">Admission No:</span>{' '}
                        {receiptModal.data.admissionNo}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Payment Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-500">Mode:</span>{' '}
                        {receiptModal.data.paymentMode}
                      </p>
                      {receiptModal.data.transactionId !== '-' && (
                        <p>
                          <span className="text-gray-500">Transaction:</span>{' '}
                          {receiptModal.data.transactionId}
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">Status:</span>{' '}
                        {getStatusBadge(receiptModal.data.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Fee Breakdown
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium">
                            Fee Head
                          </th>
                          <th className="text-right px-4 py-2 font-medium">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptModal.data.feeHeads.map((head, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{head.name}</td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(head.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-gray-50 font-bold">
                          <td className="px-4 py-2">Total Paid</td>
                          <td className="px-4 py-2 text-right text-green-600">
                            {formatCurrency(receiptModal.data.paidAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Cashier: {receiptModal.data.cashier} | Printed:{' '}
                {receiptModal.data.printCount} time(s)
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={closeReceiptModal}>
                  Close
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="primary">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
