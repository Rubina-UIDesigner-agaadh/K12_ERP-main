import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Filter,
  Search,
  Printer,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Receipt,
  Users,
  Clock,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  File,
  ChevronDown,
  X,
  Plus,
  Settings,
  Copy,
  Share2,
  Mail,
  Trash2,
  Edit,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  Globe,
  Building,
  GraduationCap,
  BookOpen,
  Layers,
  FolderOpen,
  Star,
  Bookmark,
  Play,
  Zap } from
'lucide-react';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { inr, printHtml, tableHtml, downloadText } from './ChargeReceipt';
// Types
interface Report {
  id: string;
  reportNo: string;
  name: string;
  type: string;
  category: string;
  dateRange: {
    from: string;
    to: string;
  };
  generatedOn: string;
  generatedBy: string;
  status: 'Completed' | 'Processing' | 'Failed' | 'Scheduled';
  format: string;
  size: string;
  totalRecords: number;
  totalAmount: number;
  downloads: number;
  isFavorite: boolean;
}
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  popularity: number;
  lastUsed: string | null;
  fields: string[];
  filters: string[];
  isCustom: boolean;
  isPremium: boolean;
}
// ============================================================================
// SECTION 1 : CHARGE & RECEIPT REPORT CRITERIA — 15 GROUPS IN ONE PANEL
// ============================================================================
type ChargeFilterKind = 'select' | 'multiselect' | 'text' | 'date' | 'daterange' | 'range' | 'toggle';

interface ChargeFilterDef {
  id: string;
  label: string;
  kind: ChargeFilterKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  unit?: string;
}

interface ChargeFilterGroup {
  id: string;
  title: string;
  filters: ChargeFilterDef[];
}

const csel = (id: string, label: string, options: string[], hint?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'select',
  options,
  hint
});
const cmulti = (id: string, label: string, options: string[], hint?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'multiselect',
  options,
  hint
});
const ctxt = (id: string, label: string, placeholder?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'text',
  placeholder
});
const cdt = (id: string, label: string, hint?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'date',
  hint
});
const cdtr = (id: string, label: string, hint?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'daterange',
  hint
});
const crng = (id: string, label: string, min: number, max: number, unit = ''): ChargeFilterDef => ({
  id,
  label,
  kind: 'range',
  min,
  max,
  unit
});
const ctog = (id: string, label: string, hint?: string): ChargeFilterDef => ({
  id,
  label,
  kind: 'toggle',
  hint
});

const CHG_MONTHS = [
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March'
];

const CHG_FEE_HEADS = [
  'Tuition Fee',
  'Exam Fee',
  'Hostel Fee',
  'Transport Fee',
  'Library Fee',
  'Activity Fee',
  'Lab Fee',
  'Computer Fee',
  'Sports Fee',
  'Admission Fee',
  'Registration Fee',
  'Caution Deposit',
  'Development Fee',
  'Infrastructure Fee',
  'Medical Fee',
  'Mess Fee',
  'Laundry Fee',
  'Magazine/Diary Fee',
  'ID Card Fee',
  'Material Fee',
  'Event Fee',
  'Late Fine',
  'Library Fine',
  'Other'
];

const CHG_CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const CHG_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'All'];
const CHG_CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority', 'Other'];
const CHG_RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
const CHG_STUDENT_STATUS = ['Active', 'Inactive', 'TC Issued', 'Passed Out', 'Detained', 'Transferred'];
const CHG_BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge (IGCSE)', 'NIOS'];
const CHG_MEDIUMS = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Other'];
const CHG_STREAMS = ['Science', 'Commerce', 'Arts / Humanities', 'Vocational'];
const CHG_ACADEMIC_GROUPS = ['Primary (1-5)', 'Middle (6-8)', 'Secondary (9-10)', 'Senior Secondary (11-12)'];
const CHG_PAYMENT_STATUS = [
  'Not Paid',
  'Partially Paid',
  'Fully Paid',
  'Overpaid',
  'Advance Paid',
  'Waived',
  'Refunded',
  'Cancelled',
  'Written Off'
];
const CHG_OVERDUE_STATUS = ['Overdue', 'Due Today', 'Due This Week', 'Due This Month', 'Not Overdue'];
const CHG_OVERDUE_BUCKETS = ['0-30 Days', '31-60 Days', '61-90 Days', 'More than 90 Days'];
const CHG_DEFAULT_COUNTS = ['0 times', '1 time', '2 times', '3+ times'];
const CHG_LAST_PAYMENT_STATUS = ['Paid on Time', 'Paid Late', 'Never Paid'];
const CHG_INSTALLMENT_STATUS = [
  'Installment 1 Paid',
  'Installment 2 Paid',
  'All Installments Paid',
  'Installment Overdue'
];
const CHG_DEMAND_SENT = ['Yes', 'No'];
const CHG_DEMAND_COUNTS = ['0', '1', '2', '3+'];
const CHG_PAYMENT_MODES = [
  'Cash',
  'Cheque',
  'DD (Demand Draft)',
  'NEFT',
  'RTGS',
  'UPI',
  'IMPS',
  'Online Portal',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Mobile Banking',
  'QR Code',
  'Auto-Debit (NACH)'
];
const CHG_PAYMENT_CHANNELS = [
  'School Counter',
  'Online Portal',
  'Mobile App',
  'Bank Direct Transfer',
  'Third-Party Gateway'
];
const CHG_GATEWAYS = ['Razorpay', 'Paytm', 'CCAvenue', 'Instamojo', 'PayU', 'Other'];
const CHG_CHEQUE_STATUS = ['Cleared', 'Bounced', 'Pending Clearance', 'Cancelled'];
const CHG_BANKS = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Kotak Mahindra'];
const CHG_CONCESSION_TYPES = [
  'Scholarship Waiver',
  'Sibling Discount',
  'Staff Ward Discount',
  'Merit Discount',
  'Need-Based Discount',
  'RTE (Free)',
  'Management Quota Discount',
  'Alumni Discount',
  'Sports Concession',
  'Early Payment Discount',
  'Bulk Payment Discount',
  'Other'
];
const CHG_CONCESSION_STATUS = ['Active', 'Expired', 'Cancelled', 'Pending Approval'];
const CHG_WAIVER_REASONS = [
  'Merit Scholarship',
  'Financial Hardship',
  'Staff Ward Policy',
  'Sibling Policy',
  'RTE Mandate',
  'Management Discretion',
  'Sports Excellence',
  'Covid / Special Relief'
];
const CHG_REFUND_STATUS = [
  'Refund Requested',
  'Refund Approved',
  'Refund Processed',
  'Refund Rejected',
  'No Refund'
];
const CHG_REFUND_TYPES = [
  'TC Refund',
  'Duplicate Payment',
  'Overpayment',
  'Cancelled Admission',
  'Scholarship Adjustment',
  'Activity Cancellation',
  'Hostel Refund',
  'Transport Refund',
  'Caution Deposit Refund',
  'Online Payment Failure'
];
const CHG_REFUND_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'Fee Adjustment'];
const CHG_REFUND_INITIATED = ['Parent Request', 'Admin Initiated', 'System Auto'];
const CHG_FINE_TYPES = [
  'Late Fee Fine',
  'Library Fine',
  'Damage Fine',
  'Bus Fine',
  'Discipline Fine',
  'Exam Late Fine',
  'Cheque Bounce Charge',
  'Other'
];
const CHG_FINE_STATUS = ['Pending', 'Paid', 'Waived'];
const CHG_FINE_DAYS = ['1-7 Days', '8-15 Days', '16-30 Days', 'More than 30 Days'];
const CHG_FINE_WAIVED = ['Fine Waived', 'Fine Not Waived'];
const CHG_HOSTEL_BLOCKS = ['Block A — Boys', 'Block B — Boys', 'Block C — Girls', 'Block D — Girls', 'Not a Boarder'];
const CHG_BUS_ROUTES = ['Route 1 — Satellite', 'Route 2 — Maninagar', 'Route 3 — Bopal', 'Route 4 — Vastrapur', 'Route 5 — Naranpura'];
const CHG_BUS_STOPS = ['Shivranjani', 'Law Garden', 'Bopal Cross Road', 'Vastrapur Lake', 'Naranpura Char Rasta'];
const CHG_VEHICLES = ['GJ-01-AB-1234', 'GJ-01-CD-5678', 'GJ-01-EF-9012', 'GJ-01-GH-3456'];
const CHG_COUNTERS = ['Main Counter', 'Online', 'Branch Office', 'Other'];
const CHG_RECEIPT_STATUS = ['Active', 'Cancelled', 'Reversed'];
const CHG_RECEIPT_KINDS = ['Original', 'Duplicate Receipt'];
const CHG_FEE_STRUCTURES = [
  'Day Scholar Structure',
  'Hostel Structure',
  'NRI Structure',
  'RTE Structure',
  'Staff Ward Structure'
];
const CHG_REVISIONS = ['Pre-Revision Fee', 'Post-Revision Fee'];
const CHG_INSTALLMENT_PLANS = ['Full Payment', '2 Installments', '3 Installments', '4 Installments', 'Monthly'];
const CHG_GL_HEADS = [
  'Tuition Fee Income',
  'Transport Fee Income',
  'Hostel Fee Income',
  'Exam Fee Income',
  'Fine & Penalty Income',
  'Caution Deposit Liability',
  'Scholarship & Waiver Contra'
];
const CHG_GST_FLAGS = ['GST Applicable', 'GST Not Applicable'];
const CHG_GST_RATES = ['0%', '5%', '12%', '18%', '28%'];
const CHG_REMINDER_COUNTS = ['0', '1', '2', '3+'];
const CHG_NOTIFIED = ['Yes — Notified', 'No — Not Notified'];
const CHG_COMM_MODES = ['SMS', 'Email', 'WhatsApp', 'App Notification', 'Physical Notice', 'None'];
const CHG_DEMAND_NOTICE_STATUS = [
  'Not Issued',
  'Issued — 1st Notice',
  '2nd Notice',
  'Final Notice',
  'Legal Notice'
];
const CHG_STAFF = [
  'Accounts Officer',
  'Fee Counter Cashier',
  'Senior Accountant',
  'Branch Cashier',
  'Finance Head'
];
const CHG_APPROVERS = ['Finance Head', 'Principal', 'Management Trustee', 'Accounts Officer'];
const CHG_COLLECTORS = ['Fee Counter Cashier', 'Branch Cashier', 'Accounts Officer', 'Online Gateway'];
const CHG_CLASS_TEACHERS = ['Mrs. Patel (Class 5A)', 'Mr. Sharma (Class 8B)', 'Ms. Iyer (Class 10A)', 'Mr. Khan (Class 12C)'];
const CHG_SCHEMES = [
  'Merit Scholarship Scheme',
  'RTE Free Seat Scheme',
  'EWS Fee Waiver Scheme',
  'Sports Excellence Scheme',
  'Staff Ward Concession Scheme'
];
const CHG_POSTED_TO_GL = ['Posted to GL', 'Not Yet Posted'];
const CHG_RECONCILED = ['Reconciled', 'Unreconciled'];
const CHG_DATA_SOURCES = ['Manual Entry', 'Auto-Generated', 'Imported', 'System'];

const CHARGE_FILTER_GROUPS: ChargeFilterGroup[] = [
  {
    id: 'cg1',
    title: '🗓️ Group 1 : Date & Period Filters',
    filters: [
      csel('financialYear', 'Financial Year', ['All Years', 'FY 2022-23', 'FY 2023-24', 'FY 2024-25', 'FY 2025-26']),
      csel('academicYear', 'Academic Year', ['All Years', '2022-23', '2023-24', '2024-25', '2025-26']),
      cmulti('month', 'Month', CHG_MONTHS),
      csel('quarter', 'Quarter', ['All Quarters', 'Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)']),
      cmulti('term', 'Term', ['Term 1', 'Term 2', 'Term 3']),
      cdt('feeDueDateFrom', 'Fee Due Date From', 'Start of the fee due date range'),
      cdt('feeDueDateTo', 'Fee Due Date To', 'End of the fee due date range'),
      cdt('feeChargedDateFrom', 'Fee Charged Date From', 'When the charge was applied to student account'),
      cdt('feeChargedDateTo', 'Fee Charged Date To', 'End of charge date range'),
      cdt('feeCollectionDateFrom', 'Fee Collection Date From', 'When fee was actually collected / paid'),
      cdt('feeCollectionDateTo', 'Fee Collection Date To', 'End of collection date range'),
      cdt('lastPaymentDate', 'Last Payment Date', "Student's most recent payment date"),
      cdt('overdueSince', 'Overdue Since', 'Show charges overdue since a specific date'),
      cdtr('admissionDateRange', 'Admission Date Range', 'Filter by when the student was admitted')
    ]
  },
  {
    id: 'cg2',
    title: '💰 Group 2 : Fee / Charge Type Filters',
    filters: [
      cmulti('feeType', 'Fee Type / Charge Head', CHG_FEE_HEADS),
      csel('feeStructureName', 'Fee Structure Name', ['All Structures', ...CHG_FEE_STRUCTURES]),
      cmulti('feeComponent', 'Fee Component', CHG_FEE_HEADS),
      csel('chargeCategory', 'Charge Category', ['All Categories', 'Recurring Fee (monthly/termly/annual)', 'One-Time Fee', 'Optional Fee', 'Fine / Penalty', 'Deposit']),
      csel('feeFrequency', 'Fee Frequency', ['All Frequencies', 'Monthly', 'Quarterly', 'Term-wise', 'Annual', 'One-Time']),
      csel('isMandatory', 'Is Mandatory', ['All', 'Mandatory Fee', 'Optional Fee']),
      csel('feeGroup', 'Fee Group', ['All Groups', 'Academic Fees', 'Hostel Fees', 'Transport Fees', 'Activity Fees', 'Administrative Fees', 'Fines & Penalties', 'Deposits']),
      csel('newOrExisting', 'New Charge / Existing', ['All', 'Newly Added This Year', 'Carried Forward from Previous Year'])
    ]
  },
  {
    id: 'cg3',
    title: '🎓 Group 3 : Student Filters',
    filters: [
      ctxt('studentName', 'Student Name', 'Full or partial student name'),
      ctxt('studentId', 'Student ID / Admission No.', 'Unique student identification number'),
      cmulti('className', 'Class', CHG_CLASSES),
      cmulti('section', 'Section', CHG_SECTIONS),
      ctxt('rollNo', 'Roll No.', 'Specific roll number or range'),
      csel('gender', 'Gender', ['All', 'Male', 'Female', 'Other']),
      cmulti('category', 'Category / Caste', CHG_CATEGORIES),
      cmulti('religion', 'Religion', CHG_RELIGIONS),
      csel('studentStatus', 'Student Status', ['All', ...CHG_STUDENT_STATUS]),
      csel('newAdmission', 'New Admission', ['All', 'New Admissions This Year', 'Continuing Students']),
      csel('dayScholar', 'Day Scholar / Boarder', ['All', 'Day Scholar', 'Boarder (Hostel)']),
      csel('transportUser', 'Transport User', ['All', 'Uses School Bus', 'Does Not Use Bus']),
      csel('sibling', 'Sibling in Same School', ['All', 'Has Sibling Here', 'No Sibling']),
      csel('staffWard', 'Staff Ward', ['All', 'Staff Ward', 'Non-Staff Ward']),
      csel('rte', 'RTE Student', ['All', 'RTE Student (Free Seat)', 'Non-RTE']),
      csel('bpl', 'BPL Student', ['All', 'BPL Card Holder', 'Non-BPL']),
      csel('nationality', 'Nationality', ['All', 'Indian', 'NRI', 'Foreign National'])
    ]
  },
  {
    id: 'cg4',
    title: '🏫 Group 4 : Class & Academic Filters',
    filters: [
      csel('board', 'Board', ['All Boards', ...CHG_BOARDS]),
      csel('medium', 'Medium of Instruction', ['All Mediums', ...CHG_MEDIUMS]),
      csel('stream', 'Stream', ['All Streams', ...CHG_STREAMS]),
      csel('academicGroup', 'Academic Group', ['All Groups', ...CHG_ACADEMIC_GROUPS]),
      csel('sectionType', 'Section Type', ['All', 'Regular Section', 'Special / Gifted Section']),
      csel('classTeacher', 'Class Teacher', ['All Class Teachers', ...CHG_CLASS_TEACHERS])
    ]
  },
  {
    id: 'cg5',
    title: '💵 Group 5 : Amount & Financial Filters',
    filters: [
      crng('chargedAmountRange', 'Total Charged Amount (Range)', 0, 9999999),
      crng('paidAmountRange', 'Total Paid Amount (Range)', 0, 9999999),
      crng('outstandingRange', 'Total Outstanding / Pending Amount (Range)', 0, 9999999),
      crng('overdueAmountRange', 'Overdue Amount (Range)', 0, 9999999),
      crng('advanceRange', 'Advance / Excess Paid (Range)', 0, 9999999),
      crng('scholarshipRange', 'Scholarship / Waiver Amount (Range)', 0, 9999999),
      crng('discountRange', 'Discount Amount (Range)', 0, 9999999),
      crng('fineAmountRange', 'Fine Amount (Range)', 0, 9999999),
      crng('refundAmountRange', 'Refund Amount (Range)', 0, 9999999),
      crng('netPayableRange', 'Net Payable Amount (Range)', 0, 9999999),
      crng('paymentCompletion', 'Payment Completion %', 0, 100, '%'),
      csel('currency', 'Currency', ['All', 'INR', 'USD', 'GBP'])
    ]
  },
  {
    id: 'cg6',
    title: '📊 Group 6 : Payment Status Filters',
    filters: [
      cmulti('paymentStatus', 'Payment Status', CHG_PAYMENT_STATUS),
      csel('overdueStatus', 'Overdue Status', ['All', ...CHG_OVERDUE_STATUS]),
      csel('overdueByDays', 'Overdue By Days', ['All', ...CHG_OVERDUE_BUCKETS]),
      csel('feeDefaultCount', 'Fee Default Count', ['All', ...CHG_DEFAULT_COUNTS]),
      csel('lastPaymentStatus', 'Last Payment Status', ['All', ...CHG_LAST_PAYMENT_STATUS]),
      csel('installmentStatus', 'Installment Status', ['All', ...CHG_INSTALLMENT_STATUS]),
      csel('demandNoticeSent', 'Demand Notice Sent', ['All', ...CHG_DEMAND_SENT]),
      csel('numberOfDemandNotices', 'Number of Demand Notices', ['All', ...CHG_DEMAND_COUNTS])
    ]
  },
  {
    id: 'cg7',
    title: '💳 Group 7 : Payment Mode Filters',
    filters: [
      cmulti('paymentMode', 'Payment Mode', CHG_PAYMENT_MODES),
      csel('paymentChannel', 'Payment Channel', ['All Channels', ...CHG_PAYMENT_CHANNELS]),
      csel('paymentGateway', 'Payment Gateway', ['All Gateways', ...CHG_GATEWAYS]),
      csel('chequeStatus', 'Cheque Status', ['All', ...CHG_CHEQUE_STATUS]),
      ctxt('chequeNumber', 'Cheque Number', 'Specific cheque number'),
      csel('bankName', 'Bank Name (For Cheque)', ['All Banks', ...CHG_BANKS]),
      ctxt('txnRefNo', 'Transaction / UTR Ref. No.', 'Online transaction reference'),
      ctxt('receiptNumber', 'Receipt Number', 'ERP-generated receipt number')
    ]
  },
  {
    id: 'cg8',
    title: '🎁 Group 8 : Concession & Waiver Filters',
    filters: [
      csel('concessionApplied', 'Concession Applied', ['All', 'Yes — Has Concession', 'No — No Concession']),
      cmulti('concessionType', 'Concession Type', CHG_CONCESSION_TYPES),
      csel('scholarshipLinked', 'Scholarship Linked', ['All', 'Has Scholarship', 'No Scholarship']),
      csel('scholarshipScheme', 'Scholarship Scheme', ['All Schemes', ...CHG_SCHEMES]),
      crng('concessionPct', 'Concession Percentage (Range)', 0, 100, '%'),
      crng('concessionAmountRange', 'Concession Amount (Range)', 0, 99999),
      csel('concessionApprovedBy', 'Concession Approved By', ['All Approvers', ...CHG_APPROVERS]),
      csel('concessionStatus', 'Concession Status', ['All', ...CHG_CONCESSION_STATUS]),
      cmulti('waiverReason', 'Waiver Reason', CHG_WAIVER_REASONS)
    ]
  },
  {
    id: 'cg9',
    title: '🔄 Group 9 : Refund Filters',
    filters: [
      csel('refundStatus', 'Refund Status', ['All', ...CHG_REFUND_STATUS]),
      cmulti('refundType', 'Refund Type', CHG_REFUND_TYPES),
      crng('refundAmtRange', 'Refund Amount (Range)', 0, 99999),
      cdtr('refundDateRange', 'Refund Date Range', 'When refund was processed'),
      csel('refundMode', 'Refund Mode', ['All', ...CHG_REFUND_MODES]),
      csel('refundInitiatedBy', 'Refund Initiated By', ['All', ...CHG_REFUND_INITIATED])
    ]
  },
  {
    id: 'cg10',
    title: '💸 Group 10 : Fine & Penalty Filters',
    filters: [
      csel('fineApplied', 'Fine Applied', ['All', 'Yes — Has Fine', 'No Fine']),
      cmulti('fineType', 'Fine Type', CHG_FINE_TYPES),
      crng('fineAmtRange', 'Fine Amount (Range)', 0, 9999),
      csel('fineStatus', 'Fine Status', ['All', ...CHG_FINE_STATUS]),
      csel('daysOverdueFine', 'Days Overdue (For Late Fine)', ['All', ...CHG_FINE_DAYS]),
      csel('fineWaived', 'Fine Waived', ['All', ...CHG_FINE_WAIVED]),
      csel('fineWaivedBy', 'Fine Waived By', ['All Approvers', ...CHG_APPROVERS])
    ]
  },
  {
    id: 'cg11',
    title: '🏠 Group 11 : Hostel & Transport Specific Filters',
    filters: [
      csel('hostelBlock', 'Hostel Block / Room', ['All Blocks & Rooms', ...CHG_HOSTEL_BLOCKS]),
      cdtr('hostelJoiningDate', 'Hostel Joining Date', 'When student joined hostel'),
      cdtr('hostelVacatingDate', 'Hostel Vacating Date', 'When student vacated hostel'),
      cmulti('busRoute', 'Bus Route', CHG_BUS_ROUTES),
      csel('busStop', 'Bus Stop', ['All Bus Stops', ...CHG_BUS_STOPS]),
      crng('transportDistance', 'Transport Distance (KM)', 0, 60, 'km'),
      csel('vehicleNumber', 'Vehicle Number', ['All Vehicles', ...CHG_VEHICLES])
    ]
  },
  {
    id: 'cg12',
    title: '🏫 Group 12 : Collection & Receipt Filters',
    filters: [
      csel('collectedBy', 'Collected By (Staff)', ['All Collectors', ...CHG_COLLECTORS]),
      csel('collectionCounter', 'Collection Counter', ['All Counters', ...CHG_COUNTERS]),
      ctxt('receiptNoSearch', 'Receipt No.', 'Specific receipt number'),
      cdtr('receiptDateRange', 'Receipt Date Range', 'When receipt was issued'),
      csel('receiptStatus', 'Receipt Status', ['All', ...CHG_RECEIPT_STATUS]),
      ctog('cancelledReceiptsOnly', 'Cancelled Receipts Only', 'Show only cancelled receipts'),
      csel('receiptRegenerated', 'Receipt Regenerated', ['All', ...CHG_RECEIPT_KINDS])
    ]
  },
  {
    id: 'cg13',
    title: '📋 Group 13 : Fee Structure & Master Filters',
    filters: [
      csel('feeStructure', 'Fee Structure', ['All Fee Structures', ...CHG_FEE_STRUCTURES]),
      csel('feeRevision', 'Fee Revision Applied', ['All', ...CHG_REVISIONS]),
      csel('installmentPlan', 'Fee Installment Plan', ['All Plans', ...CHG_INSTALLMENT_PLANS]),
      cmulti('feeAccountHead', 'Fee Account Head (GL)', CHG_GL_HEADS),
      csel('gstOnFee', 'GST on Fee', ['All', ...CHG_GST_FLAGS]),
      csel('gstRate', 'GST Rate', ['All Rates', ...CHG_GST_RATES])
    ]
  },
  {
    id: 'cg14',
    title: '📱 Group 14 : Notification & Communication Filters',
    filters: [
      csel('reminderSent', 'Reminder Sent', ['All', 'Reminder Sent', 'No Reminder Sent']),
      csel('numberOfReminders', 'Number of Reminders Sent', ['All', ...CHG_REMINDER_COUNTS]),
      cdtr('lastReminderDate', 'Last Reminder Date', 'When last reminder was sent'),
      csel('parentNotified', 'Parent Notified', ['All', ...CHG_NOTIFIED]),
      cmulti('communicationMode', 'Communication Mode', CHG_COMM_MODES),
      csel('demandNoticeStatus', 'Demand Notice Status', ['All', ...CHG_DEMAND_NOTICE_STATUS])
    ]
  },
  {
    id: 'cg15',
    title: '🔍 Group 15 : Audit & System Filters',
    filters: [
      csel('createdBy', 'Created By', ['All Staff', ...CHG_STAFF]),
      csel('modifiedBy', 'Modified By', ['All Staff', ...CHG_STAFF]),
      csel('approvedByWaiver', 'Approved By (Waiver / Concession)', ['All Approvers', ...CHG_APPROVERS]),
      ctxt('journalEntryNo', 'Journal Entry No.', 'GL journal entry reference'),
      csel('postedToGl', 'Fee Posted to GL', ['All', ...CHG_POSTED_TO_GL]),
      csel('feeReconciled', 'Fee Reconciled', ['All', ...CHG_RECONCILED]),
      csel('dataSource', 'Data Source', ['All Sources', ...CHG_DATA_SOURCES]),
      cdtr('lastModifiedRange', 'Last Modified Date Range', 'When the record was last changed')
    ]
  }
];

const TOTAL_CHARGE_FILTERS = CHARGE_FILTER_GROUPS.reduce((s, g) => s + g.filters.length, 0);


// ============================================================================
// SECTION 2 : CHARGE & RECEIPT DATASET + CRITERIA ENGINE
// ============================================================================
interface ChargeRow {
  id: string;
  /* ---- period ---- */
  financialYear: string;
  academicYear: string;
  monthName: string;
  quarter: string;
  term: string;
  feeDueDate: string;
  feeChargedDate: string;
  feeCollectionDate: string;
  lastPaymentDate: string;
  overdueSince: string;
  admissionDate: string;
  /* ---- charge ---- */
  feeType: string;
  feeComponent: string;
  feeStructure: string;
  chargeCategory: string;
  feeFrequency: string;
  isMandatory: string;
  feeGroup: string;
  newOrExisting: string;
  /* ---- student / staff payer ---- */
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  rollNo: string;
  gender: string;
  category: string;
  religion: string;
  studentStatus: string;
  newAdmission: string;
  dayScholar: string;
  transportUser: string;
  sibling: string;
  staffWard: string;
  rte: string;
  bpl: string;
  nationality: string;
  /* ---- academic ---- */
  board: string;
  medium: string;
  stream: string;
  academicGroup: string;
  sectionType: string;
  classTeacher: string;
  /* ---- amounts ---- */
  chargedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  advanceAmount: number;
  scholarshipAmount: number;
  discountAmount: number;
  fineAmount: number;
  refundAmount: number;
  netPayable: number;
  paymentCompletionPct: number;
  currency: string;
  /* ---- status ---- */
  paymentStatus: string;
  overdueStatus: string;
  overdueByDays: string;
  feeDefaultCount: string;
  lastPaymentStatus: string;
  installmentStatus: string;
  demandNoticeSent: string;
  numberOfDemandNotices: string;
  /* ---- payment mode ---- */
  paymentMode: string;
  paymentChannel: string;
  paymentGateway: string;
  chequeStatus: string;
  chequeNumber: string;
  bankName: string;
  txnRefNo: string;
  /* ---- concession ---- */
  concessionApplied: string;
  concessionType: string;
  scholarshipLinked: string;
  scholarshipScheme: string;
  concessionPct: number;
  concessionAmount: number;
  concessionApprovedBy: string;
  concessionStatus: string;
  waiverReason: string;
  /* ---- refund ---- */
  refundStatus: string;
  refundType: string;
  refundDate: string;
  refundMode: string;
  refundInitiatedBy: string;
  /* ---- fine ---- */
  fineApplied: string;
  fineType: string;
  fineStatus: string;
  daysOverdueFine: string;
  fineWaived: string;
  fineWaivedBy: string;
  /* ---- hostel / transport ---- */
  hostelBlock: string;
  hostelJoiningDate: string;
  hostelVacatingDate: string;
  busRoute: string;
  busStop: string;
  transportDistanceKm: number;
  vehicleNumber: string;
  /* ---- receipt ---- */
  receiptNo: string;
  receiptDate: string;
  receiptStatus: string;
  receiptKind: string;
  collectedBy: string;
  collectionCounter: string;
  /* ---- master ---- */
  feeRevision: string;
  installmentPlan: string;
  feeAccountHead: string;
  gstOnFee: string;
  gstRate: string;
  /* ---- notification ---- */
  reminderSent: string;
  remindersCount: string;
  lastReminderDate: string;
  parentNotified: string;
  communicationMode: string;
  demandNoticeStatus: string;
  /* ---- audit ---- */
  createdBy: string;
  modifiedBy: string;
  approvedByWaiver: string;
  journalEntryNo: string;
  postedToGl: string;
  feeReconciled: string;
  dataSource: string;
  lastModifiedDate: string;
}

const CHARGE_DEFAULTS: ChargeRow = {
  id: '0',
  financialYear: 'FY 2025-26',
  academicYear: '2025-26',
  monthName: 'July',
  quarter: 'Q2 (Jul-Sep)',
  term: 'Term 1',
  feeDueDate: '2025-07-31',
  feeChargedDate: '2025-07-05',
  feeCollectionDate: '2025-07-12',
  lastPaymentDate: '2025-07-12',
  overdueSince: '',
  admissionDate: '2021-06-14',
  feeType: 'Tuition Fee',
  feeComponent: 'Tuition Fee',
  feeStructure: 'Day Scholar Structure',
  chargeCategory: 'Recurring Fee (monthly/termly/annual)',
  feeFrequency: 'Quarterly',
  isMandatory: 'Mandatory Fee',
  feeGroup: 'Academic Fees',
  newOrExisting: 'Carried Forward from Previous Year',
  studentName: 'Aarav Mehta',
  studentId: 'STU-2021-0148',
  className: 'Class 5',
  section: 'A',
  rollNo: '12',
  gender: 'Male',
  category: 'General',
  religion: 'Hindu',
  studentStatus: 'Active',
  newAdmission: 'Continuing Students',
  dayScholar: 'Day Scholar',
  transportUser: 'Uses School Bus',
  sibling: 'Has Sibling Here',
  staffWard: 'Non-Staff Ward',
  rte: 'Non-RTE',
  bpl: 'Non-BPL',
  nationality: 'Indian',
  board: 'CBSE',
  medium: 'English',
  stream: 'Not Applicable',
  academicGroup: 'Primary (1-5)',
  sectionType: 'Regular Section',
  classTeacher: 'Mrs. Patel (Class 5A)',
  chargedAmount: 45000,
  paidAmount: 45000,
  outstandingAmount: 0,
  overdueAmount: 0,
  advanceAmount: 0,
  scholarshipAmount: 0,
  discountAmount: 0,
  fineAmount: 0,
  refundAmount: 0,
  netPayable: 45000,
  paymentCompletionPct: 100,
  currency: 'INR',
  paymentStatus: 'Fully Paid',
  overdueStatus: 'Not Overdue',
  overdueByDays: '',
  feeDefaultCount: '0 times',
  lastPaymentStatus: 'Paid on Time',
  installmentStatus: 'All Installments Paid',
  demandNoticeSent: 'No',
  numberOfDemandNotices: '0',
  paymentMode: 'UPI',
  paymentChannel: 'Online Portal',
  paymentGateway: 'Razorpay',
  chequeStatus: '',
  chequeNumber: '',
  bankName: '',
  txnRefNo: 'TXN20250712889910',
  concessionApplied: 'No — No Concession',
  concessionType: '',
  scholarshipLinked: 'No Scholarship',
  scholarshipScheme: '',
  concessionPct: 0,
  concessionAmount: 0,
  concessionApprovedBy: '',
  concessionStatus: '',
  waiverReason: '',
  refundStatus: 'No Refund',
  refundType: '',
  refundDate: '',
  refundMode: '',
  refundInitiatedBy: '',
  fineApplied: 'No Fine',
  fineType: '',
  fineStatus: '',
  daysOverdueFine: '',
  fineWaived: '',
  fineWaivedBy: '',
  hostelBlock: 'Not a Boarder',
  hostelJoiningDate: '',
  hostelVacatingDate: '',
  busRoute: 'Route 1 — Satellite',
  busStop: 'Shivranjani',
  transportDistanceKm: 8,
  vehicleNumber: 'GJ-01-AB-1234',
  receiptNo: 'RCP-2025-001148',
  receiptDate: '2025-07-12',
  receiptStatus: 'Active',
  receiptKind: 'Original',
  collectedBy: 'Fee Counter Cashier',
  collectionCounter: 'Online',
  feeRevision: 'Post-Revision Fee',
  installmentPlan: '4 Installments',
  feeAccountHead: 'Tuition Fee Income',
  gstOnFee: 'GST Not Applicable',
  gstRate: '0%',
  reminderSent: 'No Reminder Sent',
  remindersCount: '0',
  lastReminderDate: '',
  parentNotified: 'No — Not Notified',
  communicationMode: '',
  demandNoticeStatus: 'Not Issued',
  createdBy: 'Fee Counter Cashier',
  modifiedBy: 'Accounts Officer',
  approvedByWaiver: '',
  journalEntryNo: 'JV-2025-0611',
  postedToGl: 'Posted to GL',
  feeReconciled: 'Reconciled',
  dataSource: 'System',
  lastModifiedDate: '2025-07-12'
};

const crm = (o: Partial<ChargeRow>): ChargeRow => ({ ...CHARGE_DEFAULTS, ...o });

const CHARGE_ROWS: ChargeRow[] = [
  crm({
    id: 'CHG-1',
    studentName: 'Aarav Mehta',
    studentId: 'STU-2021-0148',
    className: 'Class 5',
    section: 'A',
    rollNo: '12'
  }),
  crm({
    id: 'CHG-2',
    studentName: 'Ishita Sharma',
    studentId: 'STU-2020-0091',
    className: 'Class 8',
    section: 'B',
    rollNo: '27',
    gender: 'Female',
    category: 'OBC',
    religion: 'Hindu',
    academicGroup: 'Middle (6-8)',
    classTeacher: 'Mr. Sharma (Class 8B)',
    feeType: 'Transport Fee',
    feeComponent: 'Transport Fee',
    feeGroup: 'Transport Fees',
    feeStructure: 'Day Scholar Structure',
    chargedAmount: 24000,
    paidAmount: 12000,
    outstandingAmount: 12000,
    overdueAmount: 12000,
    netPayable: 24000,
    paymentCompletionPct: 50,
    paymentStatus: 'Partially Paid',
    overdueStatus: 'Overdue',
    overdueByDays: '31-60 Days',
    feeDefaultCount: '1 time',
    lastPaymentStatus: 'Paid Late',
    installmentStatus: 'Installment 1 Paid',
    paymentMode: 'Cash',
    paymentChannel: 'School Counter',
    paymentGateway: '',
    txnRefNo: '',
    collectedBy: 'Branch Cashier',
    collectionCounter: 'Branch Office',
    sibling: 'Has Sibling Here',
    transportUser: 'Uses School Bus',
    busRoute: 'Route 2 — Maninagar',
    busStop: 'Law Garden',
    transportDistanceKm: 14,
    vehicleNumber: 'GJ-01-CD-5678',
    receiptNo: 'RCP-2025-001102',
    receiptDate: '2025-06-20',
    feeDueDate: '2025-06-15',
    feeChargedDate: '2025-06-01',
    feeCollectionDate: '2025-06-20',
    lastPaymentDate: '2025-06-20',
    overdueSince: '2025-06-16',
    monthName: 'June',
    quarter: 'Q1 (Apr-Jun)',
    reminderSent: 'Reminder Sent',
    remindersCount: '2',
    lastReminderDate: '2025-07-05',
    parentNotified: 'Yes — Notified',
    communicationMode: 'WhatsApp',
    demandNoticeSent: 'Yes',
    numberOfDemandNotices: '1',
    demandNoticeStatus: 'Issued — 1st Notice',
    fineApplied: 'Yes — Has Fine',
    fineType: 'Late Fee Fine',
    fineAmount: 500,
    fineStatus: 'Pending',
    daysOverdueFine: '16-30 Days'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-3',
    studentName: 'Rohan Desai',
    studentId: 'STU-2022-0233',
    className: 'Class 10',
    section: 'A',
    rollNo: '4',
    gender: 'Male',
    category: 'SC',
    academicGroup: 'Secondary (9-10)',
    classTeacher: 'Ms. Iyer (Class 10A)',
    board: 'State Board',
    medium: 'Hindi',
    dayScholar: 'Boarder (Hostel)',
    hostelBlock: 'Block A — Boys',
    hostelJoiningDate: '2022-06-20',
    hostelVacatingDate: '',
    feeType: 'Hostel Fee',
    feeComponent: 'Hostel Fee',
    feeGroup: 'Hostel Fees',
    feeStructure: 'Hostel Structure',
    chargeCategory: 'Recurring Fee (monthly/termly/annual)',
    feeFrequency: 'Term-wise',
    term: 'Term 2',
    chargedAmount: 96000,
    paidAmount: 96000,
    outstandingAmount: 0,
    netPayable: 96000,
    paymentCompletionPct: 100,
    paymentStatus: 'Fully Paid',
    lastPaymentStatus: 'Paid on Time',
    installmentStatus: 'Installment 2 Paid',
    paymentMode: 'NEFT',
    paymentChannel: 'Bank Direct Transfer',
    txnRefNo: 'NEFT20250901123456',
    bankName: 'HDFC Bank',
    receiptNo: 'RCP-2025-001233',
    receiptDate: '2025-09-01',
    feeDueDate: '2025-08-31',
    feeChargedDate: '2025-08-01',
    feeCollectionDate: '2025-09-01',
    lastPaymentDate: '2025-09-01',
    monthName: 'August',
    quarter: 'Q2 (Jul-Sep)',
    admissionDate: '2022-06-20',
    rte: 'Non-RTE',
    bpl: 'BPL Card Holder',
    concessionApplied: 'Yes — Has Concession',
    concessionType: 'Scholarship Waiver',
    scholarshipLinked: 'Has Scholarship',
    scholarshipScheme: 'EWS Fee Waiver Scheme',
    concessionPct: 25,
    concessionAmount: 24000,
    concessionApprovedBy: 'Principal',
    concessionStatus: 'Active',
    waiverReason: 'Financial Hardship',
    feeAccountHead: 'Hostel Fee Income',
    installmentPlan: '2 Installments',
    collectedBy: 'Accounts Officer',
    collectionCounter: 'Main Counter'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-4',
    studentName: 'Ananya Iyer',
    studentId: 'STU-2023-0310',
    className: 'Class 12',
    section: 'C',
    rollNo: '9',
    gender: 'Female',
    category: 'General',
    religion: 'Hindu',
    academicGroup: 'Senior Secondary (11-12)',
    stream: 'Science',
    classTeacher: 'Mr. Khan (Class 12C)',
    board: 'CBSE',
    dayScholar: 'Day Scholar',
    newAdmission: 'New Admissions This Year',
    admissionDate: '2025-06-10',
    feeType: 'Exam Fee',
    feeComponent: 'Exam Fee',
    feeGroup: 'Academic Fees',
    chargeCategory: 'One-Time Fee',
    feeFrequency: 'One-Time',
    newOrExisting: 'Newly Added This Year',
    chargedAmount: 18000,
    paidAmount: 0,
    outstandingAmount: 18000,
    overdueAmount: 18000,
    netPayable: 18000,
    paymentCompletionPct: 0,
    paymentStatus: 'Not Paid',
    overdueStatus: 'Overdue',
    overdueByDays: 'More than 90 Days',
    feeDefaultCount: '3+ times',
    lastPaymentStatus: 'Never Paid',
    installmentStatus: 'Installment Overdue',
    paymentMode: '',
    paymentChannel: '',
    txnRefNo: '',
    studentStatus: 'Active',
    overdueSince: '2025-06-30',
    feeDueDate: '2025-06-30',
    feeChargedDate: '2025-06-12',
    feeCollectionDate: '',
    lastPaymentDate: '',
    receiptNo: '',
    receiptDate: '',
    monthName: 'June',
    quarter: 'Q1 (Apr-Jun)',
    demandNoticeSent: 'Yes',
    numberOfDemandNotices: '3+',
    demandNoticeStatus: 'Final Notice',
    reminderSent: 'Reminder Sent',
    remindersCount: '3+',
    lastReminderDate: '2025-09-10',
    parentNotified: 'Yes — Notified',
    communicationMode: 'SMS',
    refundStatus: 'No Refund',
    createdBy: 'Accounts Officer',
    dataSource: 'Auto-Generated',
    postedToGl: 'Not Yet Posted',
    feeReconciled: 'Unreconciled',
    journalEntryNo: '',
    lastModifiedDate: '2025-09-10'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-5',
    studentName: 'Kabir Singh',
    studentId: 'STU-2019-0044',
    className: 'Class 11',
    section: 'D',
    rollNo: '31',
    gender: 'Male',
    category: 'Minority',
    religion: 'Sikh',
    academicGroup: 'Senior Secondary (11-12)',
    stream: 'Commerce',
    board: 'ICSE',
    feeType: 'Caution Deposit',
    feeComponent: 'Caution Deposit',
    feeGroup: 'Deposits',
    chargeCategory: 'Deposit',
    feeFrequency: 'One-Time',
    chargedAmount: 15000,
    paidAmount: 15000,
    outstandingAmount: 0,
    refundAmount: 15000,
    netPayable: 15000,
    paymentCompletionPct: 100,
    paymentStatus: 'Refunded',
    refundStatus: 'Refund Processed',
    refundType: 'Caution Deposit Refund',
    refundDate: '2025-08-22',
    refundMode: 'Bank Transfer',
    refundInitiatedBy: 'Parent Request',
    studentStatus: 'TC Issued',
    feeAccountHead: 'Caution Deposit Liability',
    receiptNo: 'RCP-2023-000877',
    receiptDate: '2023-06-05',
    feeDueDate: '2023-06-05',
    feeChargedDate: '2023-06-01',
    feeCollectionDate: '2023-06-05',
    lastPaymentDate: '2023-06-05',
    monthName: 'August',
    financialYear: 'FY 2025-26',
    paymentMode: 'RTGS',
    paymentChannel: 'Bank Direct Transfer',
    bankName: 'SBI',
    txnRefNo: 'RTGS20230822UTIB0001',
    postedToGl: 'Posted to GL',
    feeReconciled: 'Reconciled',
    journalEntryNo: 'JV-2025-0788'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-6',
    studentName: 'Saanvi Patel',
    studentId: 'STU-2024-0521',
    className: 'Class 3',
    section: 'B',
    rollNo: '18',
    gender: 'Female',
    category: 'EWS',
    religion: 'Jain',
    academicGroup: 'Primary (1-5)',
    newAdmission: 'New Admissions This Year',
    admissionDate: '2024-06-12',
    rte: 'RTE Student (Free Seat)',
    bpl: 'BPL Card Holder',
    feeType: 'Tuition Fee',
    feeComponent: 'Tuition Fee',
    feeGroup: 'Academic Fees',
    feeStructure: 'RTE Structure',
    chargeCategory: 'Recurring Fee (monthly/termly/annual)',
    feeFrequency: 'Quarterly',
    chargedAmount: 30000,
    paidAmount: 0,
    outstandingAmount: 0,
    netPayable: 0,
    paymentCompletionPct: 100,
    paymentStatus: 'Waived',
    concessionApplied: 'Yes — Has Concession',
    concessionType: 'RTE (Free)',
    scholarshipLinked: 'Has Scholarship',
    scholarshipScheme: 'RTE Free Seat Scheme',
    concessionPct: 100,
    concessionAmount: 30000,
    concessionApprovedBy: 'Management Trustee',
    concessionStatus: 'Active',
    waiverReason: 'RTE Mandate',
    approvedByWaiver: 'Management Trustee',
    receiptNo: 'RCP-2025-000981',
    receiptDate: '2025-07-08',
    feeDueDate: '2025-07-05',
    feeChargedDate: '2025-07-01',
    feeCollectionDate: '2025-07-08',
    lastPaymentDate: '2025-07-08',
    monthName: 'July',
    term: 'Term 1',
    quarter: 'Q2 (Jul-Sep)',
    paymentMode: 'Fee Adjustment',
    paymentChannel: 'School Counter',
    collectedBy: 'Fee Counter Cashier',
    collectionCounter: 'Main Counter',
    gstOnFee: 'GST Not Applicable',
    feeAccountHead: 'Scholarship & Waiver Contra',
    feeRevision: 'Post-Revision Fee',
    installmentPlan: 'Monthly',
    dataSource: 'Manual Entry'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-7',
    studentName: 'Vivaan Joshi',
    studentId: 'STU-2020-0177',
    className: 'Class 9',
    section: 'A',
    rollNo: '7',
    gender: 'Male',
    category: 'General',
    religion: 'Hindu',
    academicGroup: 'Secondary (9-10)',
    board: 'CBSE',
    medium: 'English',
    dayScholar: 'Day Scholar',
    transportUser: 'Uses School Bus',
    busRoute: 'Route 3 — Bopal',
    busStop: 'Bopal Cross Road',
    transportDistanceKm: 22,
    vehicleNumber: 'GJ-01-EF-9012',
    feeType: 'Transport Fee',
    feeComponent: 'Transport Fee',
    feeGroup: 'Transport Fees',
    chargeCategory: 'Recurring Fee (monthly/termly/annual)',
    feeFrequency: 'Monthly',
    chargedAmount: 36000,
    paidAmount: 20000,
    outstandingAmount: 16000,
    overdueAmount: 8000,
    netPayable: 36000,
    paymentCompletionPct: 56,
    paymentStatus: 'Partially Paid',
    overdueStatus: 'Due This Month',
    overdueByDays: '0-30 Days',
    feeDefaultCount: '2 times',
    lastPaymentStatus: 'Paid Late',
    installmentStatus: 'Installment 1 Paid',
    paymentMode: 'Debit Card',
    paymentChannel: 'Third-Party Gateway',
    paymentGateway: 'PayU',
    txnRefNo: 'PAYU2508110099',
    receiptNo: 'RCP-2025-001190',
    receiptDate: '2025-08-11',
    feeDueDate: '2025-09-25',
    feeChargedDate: '2025-08-01',
    feeCollectionDate: '2025-08-11',
    lastPaymentDate: '2025-08-11',
    monthName: 'August',
    term: 'Term 2',
    sibling: 'Has Sibling Here',
    reminderSent: 'Reminder Sent',
    remindersCount: '1',
    lastReminderDate: '2025-09-15',
    parentNotified: 'Yes — Notified',
    communicationMode: 'App Notification',
    fineApplied: 'Yes — Has Fine',
    fineType: 'Bus Fine',
    fineAmount: 250,
    fineStatus: 'Paid',
    daysOverdueFine: '8-15 Days',
    fineWaived: 'Fine Not Waived',
    gstOnFee: 'GST Applicable',
    gstRate: '5%'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-8',
    studentName: 'Meera Nair',
    studentId: 'STU-2022-0398',
    className: 'Class 7',
    section: 'C',
    rollNo: '22',
    gender: 'Female',
    category: 'General',
    religion: 'Christian',
    academicGroup: 'Middle (6-8)',
    medium: 'English',
    board: 'ICSE',
    feeType: 'Activity Fee',
    feeComponent: 'Activity Fee',
    feeGroup: 'Activity Fees',
    chargeCategory: 'Optional Fee',
    isMandatory: 'Optional Fee',
    feeFrequency: 'Annual',
    chargedAmount: 8000,
    paidAmount: 8000,
    outstandingAmount: 0,
    netPayable: 8000,
    paymentCompletionPct: 100,
    paymentStatus: 'Fully Paid',
    lastPaymentStatus: 'Paid on Time',
    paymentMode: 'Credit Card',
    paymentChannel: 'Online Portal',
    paymentGateway: 'CCAvenue',
    txnRefNo: 'CCA20250715004411',
    receiptNo: 'RCP-2025-001071',
    receiptDate: '2025-07-15',
    feeDueDate: '2025-07-10',
    feeChargedDate: '2025-07-02',
    feeCollectionDate: '2025-07-15',
    lastPaymentDate: '2025-07-15',
    monthName: 'July',
    feeAccountHead: 'Tuition Fee Income',
    discountAmount: 800,
    concessionApplied: 'Yes — Has Concession',
    concessionType: 'Early Payment Discount',
    concessionPct: 10,
    concessionAmount: 800,
    concessionApprovedBy: 'Accounts Officer',
    concessionStatus: 'Active',
    waiverReason: 'Management Discretion',
    scholarshipLinked: 'No Scholarship',
    installmentPlan: 'Full Payment',
    dataSource: 'Imported'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-9',
    studentName: 'Arjun Rao',
    studentId: 'STU-2021-0207',
    className: 'Class 6',
    section: 'A',
    rollNo: '15',
    gender: 'Male',
    category: 'OBC',
    religion: 'Hindu',
    academicGroup: 'Middle (6-8)',
    staffWard: 'Non-Staff Ward',
    feeType: 'Library Fine',
    feeComponent: 'Library Fine',
    feeGroup: 'Fines & Penalties',
    chargeCategory: 'Fine / Penalty',
    feeFrequency: 'One-Time',
    chargedAmount: 1500,
    paidAmount: 0,
    outstandingAmount: 1500,
    overdueAmount: 1500,
    netPayable: 1500,
    paymentCompletionPct: 0,
    paymentStatus: 'Not Paid',
    overdueStatus: 'Overdue',
    overdueByDays: '61-90 Days',
    feeDefaultCount: '1 time',
    lastPaymentStatus: 'Paid Late',
    fineApplied: 'Yes — Has Fine',
    fineType: 'Library Fine',
    fineAmount: 1500,
    fineStatus: 'Pending',
    daysOverdueFine: 'More than 30 Days',
    fineWaived: 'Fine Not Waived',
    feeDueDate: '2025-07-05',
    feeChargedDate: '2025-06-28',
    feeCollectionDate: '',
    lastPaymentDate: '2025-05-30',
    overdueSince: '2025-07-06',
    monthName: 'July',
    term: 'Term 1',
    receiptNo: '',
    demandNoticeSent: 'Yes',
    numberOfDemandNotices: '2',
    demandNoticeStatus: '2nd Notice',
    reminderSent: 'Reminder Sent',
    remindersCount: '2',
    lastReminderDate: '2025-09-05',
    parentNotified: 'Yes — Notified',
    communicationMode: 'Email',
    feeAccountHead: 'Fine & Penalty Income',
    gstOnFee: 'GST Not Applicable',
    postedToGl: 'Posted to GL',
    feeReconciled: 'Unreconciled'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-10',
    studentName: 'Diya Kulkarni',
    studentId: 'STU-2023-0455',
    className: 'Class 4',
    section: 'D',
    rollNo: '6',
    gender: 'Female',
    category: 'General',
    religion: 'Hindu',
    academicGroup: 'Primary (1-5)',
    nationality: 'Indian',
    sibling: 'Has Sibling Here',
    feeType: 'Tuition Fee',
    feeComponent: 'Tuition Fee',
    feeGroup: 'Academic Fees',
    feeStructure: 'Day Scholar Structure',
    chargedAmount: 48000,
    paidAmount: 56000,
    outstandingAmount: 0,
    advanceAmount: 8000,
    netPayable: 48000,
    paymentCompletionPct: 100,
    paymentStatus: 'Advance Paid',
    lastPaymentStatus: 'Paid on Time',
    paymentMode: 'IMPS',
    paymentChannel: 'Mobile App',
    txnRefNo: 'IMPS2509010077',
    receiptNo: 'RCP-2025-001301',
    receiptDate: '2025-09-01',
    feeDueDate: '2025-09-30',
    feeChargedDate: '2025-09-01',
    feeCollectionDate: '2025-09-01',
    lastPaymentDate: '2025-09-01',
    monthName: 'September',
    quarter: 'Q2 (Jul-Sep)',
    term: 'Term 2',
    concessionApplied: 'Yes — Has Concession',
    concessionType: 'Sibling Discount',
    concessionPct: 10,
    concessionAmount: 4800,
    concessionApprovedBy: 'Principal',
    concessionStatus: 'Active',
    waiverReason: 'Sibling Policy',
    installmentPlan: '2 Installments',
    installmentStatus: 'Installment 1 Paid',
    dataSource: 'Auto-Generated'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-11',
    studentName: 'Priya Verma',
    studentId: 'STU-2019-0012',
    className: 'Class 12',
    section: 'C',
    rollNo: '2',
    gender: 'Female',
    category: 'General',
    academicGroup: 'Senior Secondary (11-12)',
    stream: 'Science',
    nationality: 'NRI',
    currency: 'USD',
    board: 'IB',
    medium: 'English',
    dayScholar: 'Boarder (Hostel)',
    hostelBlock: 'Block C — Girls',
    hostelJoiningDate: '2024-07-01',
    feeType: 'Hostel Fee',
    feeComponent: 'Hostel Fee',
    feeGroup: 'Hostel Fees',
    feeStructure: 'NRI Structure',
    feeFrequency: 'Annual',
    chargedAmount: 250000,
    paidAmount: 250000,
    outstandingAmount: 0,
    netPayable: 250000,
    paymentCompletionPct: 100,
    paymentStatus: 'Fully Paid',
    lastPaymentStatus: 'Paid on Time',
    paymentMode: 'Online Portal',
    paymentChannel: 'Third-Party Gateway',
    paymentGateway: 'Razorpay',
    txnRefNo: 'RZP2507150012',
    receiptNo: 'RCP-2025-001099',
    receiptDate: '2025-07-15',
    feeDueDate: '2025-07-14',
    feeChargedDate: '2025-07-01',
    feeCollectionDate: '2025-07-15',
    lastPaymentDate: '2025-07-15',
    monthName: 'July',
    admissionDate: '2019-07-01',
    feeAccountHead: 'Hostel Fee Income',
    installmentPlan: 'Full Payment',
    gstOnFee: 'GST Applicable',
    gstRate: '18%',
    postedToGl: 'Posted to GL',
    feeReconciled: 'Reconciled'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-12',
    studentName: 'Aditya Chauhan',
    studentId: 'STU-2020-0256',
    className: 'Class 10',
    section: 'B',
    rollNo: '19',
    gender: 'Male',
    category: 'ST',
    religion: 'Buddhist',
    academicGroup: 'Secondary (9-10)',
    board: 'NIOS',
    medium: 'Marathi',
    sectionType: 'Special / Gifted Section',
    feeType: 'Exam Fee',
    feeComponent: 'Exam Fee',
    feeGroup: 'Academic Fees',
    chargeCategory: 'One-Time Fee',
    feeFrequency: 'One-Time',
    chargedAmount: 12000,
    paidAmount: 12000,
    outstandingAmount: 0,
    netPayable: 12000,
    paymentCompletionPct: 100,
    paymentStatus: 'Fully Paid',
    lastPaymentStatus: 'Paid Late',
    paymentMode: 'Cheque',
    paymentChannel: 'School Counter',
    chequeStatus: 'Bounced',
    chequeNumber: 'CHQ-771204',
    bankName: 'Axis Bank',
    receiptNo: 'RCP-2025-001155',
    receiptDate: '2025-07-22',
    receiptStatus: 'Reversed',
    receiptKind: 'Duplicate Receipt',
    feeDueDate: '2025-07-20',
    feeChargedDate: '2025-07-08',
    feeCollectionDate: '2025-07-22',
    lastPaymentDate: '2025-07-22',
    monthName: 'July',
    fineApplied: 'Yes — Has Fine',
    fineType: 'Cheque Bounce Charge',
    fineAmount: 750,
    fineStatus: 'Waived',
    daysOverdueFine: '1-7 Days',
    fineWaived: 'Fine Waived',
    fineWaivedBy: 'Finance Head',
    collectedBy: 'Branch Cashier',
    collectionCounter: 'Branch Office',
    reminderSent: 'Reminder Sent',
    remindersCount: '1',
    lastReminderDate: '2025-07-18',
    parentNotified: 'Yes — Notified',
    communicationMode: 'Physical Notice',
    createdBy: 'Branch Cashier',
    modifiedBy: 'Senior Accountant',
    dataSource: 'Manual Entry'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-13',
    studentName: 'Tanvi Bhat',
    studentId: 'STU-2021-0389',
    className: 'Class 5',
    section: 'E',
    rollNo: '24',
    gender: 'Female',
    category: 'General',
    religion: 'Hindu',
    academicGroup: 'Primary (1-5)',
    academicYear: '2024-25',
    financialYear: 'FY 2024-25',
    feeType: 'Admission Fee',
    feeComponent: 'Admission Fee',
    feeGroup: 'Administrative Fees',
    chargeCategory: 'One-Time Fee',
    feeFrequency: 'One-Time',
    newOrExisting: 'Carried Forward from Previous Year',
    chargedAmount: 25000,
    paidAmount: 25000,
    outstandingAmount: 0,
    netPayable: 25000,
    paymentCompletionPct: 100,
    paymentStatus: 'Fully Paid',
    lastPaymentStatus: 'Paid on Time',
    paymentMode: 'Net Banking',
    paymentChannel: 'Online Portal',
    txnRefNo: 'NB2024041099',
    receiptNo: 'RCP-2024-000788',
    receiptDate: '2024-04-10',
    feeDueDate: '2024-04-15',
    feeChargedDate: '2024-04-01',
    feeCollectionDate: '2024-04-10',
    lastPaymentDate: '2024-04-10',
    monthName: 'April',
    quarter: 'Q1 (Apr-Jun)',
    term: 'Term 1',
    admissionDate: '2021-06-14',
    feeRevision: 'Pre-Revision Fee',
    feeAccountHead: 'Tuition Fee Income',
    postedToGl: 'Posted to GL',
    feeReconciled: 'Reconciled',
    lastModifiedDate: '2024-04-10',
    dataSource: 'System'
  } as Partial<ChargeRow>),
  crm({
    id: 'CHG-14',
    studentName: 'Reyansh Gupta',
    studentId: 'STU-2024-0603',
    className: 'UKG',
    section: 'A',
    rollNo: '11',
    gender: 'Male',
    category: 'General',
    religion: 'Hindu',
    academicGroup: 'Primary (1-5)',
    newAdmission: 'New Admissions This Year',
    admissionDate: '2024-06-20',
    feeType: 'Registration Fee',
    feeComponent: 'Registration Fee',
    feeGroup: 'Administrative Fees',
    chargeCategory: 'One-Time Fee',
    feeFrequency: 'One-Time',
    chargedAmount: 5000,
    paidAmount: 0,
    outstandingAmount: 5000,
    overdueAmount: 5000,
    netPayable: 5000,
    paymentCompletionPct: 0,
    paymentStatus: 'Cancelled',
    overdueStatus: 'Overdue',
    overdueByDays: 'More than 90 Days',
    feeDefaultCount: '1 time',
    lastPaymentStatus: 'Never Paid',
    receiptNo: '',
    receiptStatus: 'Cancelled',
    receiptDate: '',
    feeDueDate: '2024-06-25',
    feeChargedDate: '2024-06-20',
    feeCollectionDate: '',
    lastPaymentDate: '',
    overdueSince: '2024-06-26',
    monthName: 'June',
    financialYear: 'FY 2024-25',
    academicYear: '2024-25',
    demandNoticeSent: 'No',
    numberOfDemandNotices: '0',
    reminderSent: 'No Reminder Sent',
    remindersCount: '0',
    parentNotified: 'No — Not Notified',
    communicationMode: 'None',
    refundStatus: 'Refund Requested',
    refundType: 'Cancelled Admission',
    refundAmount: 0,
    refundDate: '',
    refundMode: 'Fee Adjustment',
    refundInitiatedBy: 'Admin Initiated',
    studentStatus: 'Transferred',
    postedToGl: 'Not Yet Posted',
    feeReconciled: 'Unreconciled',
    createdBy: 'Fee Counter Cashier',
    modifiedBy: 'Accounts Officer',
    dataSource: 'Manual Entry',
    lastModifiedDate: '2025-08-02'
  } as Partial<ChargeRow>)
];

const CHARGE_COLUMN_LABELS: Record<string, string> = {
  financialYear: 'Financial Year',
  academicYear: 'Academic Year',
  monthName: 'Month',
  quarter: 'Quarter',
  term: 'Term',
  feeDueDate: 'Fee Due Date',
  feeChargedDate: 'Fee Charged Date',
  feeCollectionDate: 'Fee Collection Date',
  lastPaymentDate: 'Last Payment Date',
  admissionDate: 'Admission Date',
  feeType: 'Fee Type / Charge Head',
  feeComponent: 'Fee Component',
  feeStructure: 'Fee Structure',
  chargeCategory: 'Charge Category',
  feeFrequency: 'Fee Frequency',
  isMandatory: 'Is Mandatory',
  feeGroup: 'Fee Group',
  newOrExisting: 'New / Existing',
  studentName: 'Student Name',
  studentId: 'Student ID / Admission No.',
  className: 'Class',
  section: 'Section',
  rollNo: 'Roll No.',
  gender: 'Gender',
  category: 'Category / Caste',
  religion: 'Religion',
  studentStatus: 'Student Status',
  newAdmission: 'New Admission',
  dayScholar: 'Day Scholar / Boarder',
  transportUser: 'Transport User',
  sibling: 'Sibling in School',
  staffWard: 'Staff Ward',
  rte: 'RTE Student',
  bpl: 'BPL Student',
  nationality: 'Nationality',
  board: 'Board',
  medium: 'Medium',
  stream: 'Stream',
  academicGroup: 'Academic Group',
  sectionType: 'Section Type',
  classTeacher: 'Class Teacher',
  chargedAmount: 'Total Charged',
  paidAmount: 'Total Paid',
  outstandingAmount: 'Outstanding',
  overdueAmount: 'Overdue Amount',
  advanceAmount: 'Advance / Excess',
  scholarshipAmount: 'Scholarship / Waiver',
  discountAmount: 'Discount',
  fineAmount: 'Fine Amount',
  refundAmount: 'Refund Amount',
  netPayable: 'Net Payable',
  paymentCompletionPct: 'Payment Completion %',
  currency: 'Currency',
  paymentStatus: 'Payment Status',
  overdueStatus: 'Overdue Status',
  overdueByDays: 'Overdue By Days',
  feeDefaultCount: 'Fee Default Count',
  lastPaymentStatus: 'Last Payment Status',
  installmentStatus: 'Installment Status',
  demandNoticeSent: 'Demand Notice Sent',
  numberOfDemandNotices: 'No. of Demand Notices',
  paymentMode: 'Payment Mode',
  paymentChannel: 'Payment Channel',
  paymentGateway: 'Payment Gateway',
  chequeStatus: 'Cheque Status',
  chequeNumber: 'Cheque Number',
  bankName: 'Bank Name',
  txnRefNo: 'Transaction / UTR Ref.',
  concessionApplied: 'Concession Applied',
  concessionType: 'Concession Type',
  scholarshipLinked: 'Scholarship Linked',
  scholarshipScheme: 'Scholarship Scheme',
  concessionPct: 'Concession %',
  concessionAmount: 'Concession Amount',
  concessionApprovedBy: 'Concession Approved By',
  concessionStatus: 'Concession Status',
  waiverReason: 'Waiver Reason',
  refundStatus: 'Refund Status',
  refundType: 'Refund Type',
  refundDate: 'Refund Date',
  refundMode: 'Refund Mode',
  refundInitiatedBy: 'Refund Initiated By',
  fineApplied: 'Fine Applied',
  fineType: 'Fine Type',
  fineStatus: 'Fine Status',
  daysOverdueFine: 'Days Overdue (Fine)',
  fineWaived: 'Fine Waived',
  fineWaivedBy: 'Fine Waived By',
  hostelBlock: 'Hostel Block / Room',
  hostelJoiningDate: 'Hostel Joining Date',
  hostelVacatingDate: 'Hostel Vacating Date',
  busRoute: 'Bus Route',
  busStop: 'Bus Stop',
  transportDistanceKm: 'Transport Distance (KM)',
  vehicleNumber: 'Vehicle Number',
  receiptNo: 'Receipt No.',
  receiptDate: 'Receipt Date',
  receiptStatus: 'Receipt Status',
  receiptKind: 'Receipt Type',
  collectedBy: 'Collected By',
  collectionCounter: 'Collection Counter',
  feeRevision: 'Fee Revision Applied',
  installmentPlan: 'Fee Installment Plan',
  feeAccountHead: 'Fee Account Head (GL)',
  gstOnFee: 'GST on Fee',
  gstRate: 'GST Rate',
  reminderSent: 'Reminder Sent',
  remindersCount: 'No. of Reminders',
  lastReminderDate: 'Last Reminder Date',
  parentNotified: 'Parent Notified',
  communicationMode: 'Communication Mode',
  demandNoticeStatus: 'Demand Notice Status',
  createdBy: 'Created By',
  modifiedBy: 'Modified By',
  approvedByWaiver: 'Approved By (Waiver)',
  journalEntryNo: 'Journal Entry No.',
  postedToGl: 'Fee Posted to GL',
  feeReconciled: 'Fee Reconciled',
  dataSource: 'Data Source',
  lastModifiedDate: 'Last Modified Date'
};

/* ---------------- criteria → dataset maps ---------------- */
const CHARGE_APPLY_KEYS: Record<string, string> = {
  financialYear: 'financialYear',
  academicYear: 'academicYear',
  month: 'monthName',
  quarter: 'quarter',
  term: 'term',
  feeType: 'feeType',
  feeStructureName: 'feeStructure',
  feeComponent: 'feeComponent',
  chargeCategory: 'chargeCategory',
  feeFrequency: 'feeFrequency',
  isMandatory: 'isMandatory',
  feeGroup: 'feeGroup',
  newOrExisting: 'newOrExisting',
  className: 'className',
  section: 'section',
  gender: 'gender',
  category: 'category',
  religion: 'religion',
  studentStatus: 'studentStatus',
  newAdmission: 'newAdmission',
  dayScholar: 'dayScholar',
  transportUser: 'transportUser',
  sibling: 'sibling',
  staffWard: 'staffWard',
  rte: 'rte',
  bpl: 'bpl',
  nationality: 'nationality',
  board: 'board',
  medium: 'medium',
  stream: 'stream',
  academicGroup: 'academicGroup',
  sectionType: 'sectionType',
  classTeacher: 'classTeacher',
  currency: 'currency',
  paymentStatus: 'paymentStatus',
  overdueStatus: 'overdueStatus',
  overdueByDays: 'overdueByDays',
  feeDefaultCount: 'feeDefaultCount',
  lastPaymentStatus: 'lastPaymentStatus',
  installmentStatus: 'installmentStatus',
  demandNoticeSent: 'demandNoticeSent',
  numberOfDemandNotices: 'numberOfDemandNotices',
  paymentMode: 'paymentMode',
  paymentChannel: 'paymentChannel',
  paymentGateway: 'paymentGateway',
  chequeStatus: 'chequeStatus',
  bankName: 'bankName',
  concessionApplied: 'concessionApplied',
  concessionType: 'concessionType',
  scholarshipLinked: 'scholarshipLinked',
  scholarshipScheme: 'scholarshipScheme',
  concessionApprovedBy: 'concessionApprovedBy',
  concessionStatus: 'concessionStatus',
  waiverReason: 'waiverReason',
  refundStatus: 'refundStatus',
  refundType: 'refundType',
  refundMode: 'refundMode',
  refundInitiatedBy: 'refundInitiatedBy',
  fineApplied: 'fineApplied',
  fineType: 'fineType',
  fineStatus: 'fineStatus',
  daysOverdueFine: 'daysOverdueFine',
  fineWaived: 'fineWaived',
  fineWaivedBy: 'fineWaivedBy',
  hostelBlock: 'hostelBlock',
  busRoute: 'busRoute',
  busStop: 'busStop',
  vehicleNumber: 'vehicleNumber',
  collectedBy: 'collectedBy',
  collectionCounter: 'collectionCounter',
  receiptStatus: 'receiptStatus',
  receiptRegenerated: 'receiptKind',
  feeStructure: 'feeStructure',
  feeRevision: 'feeRevision',
  installmentPlan: 'installmentPlan',
  feeAccountHead: 'feeAccountHead',
  gstOnFee: 'gstOnFee',
  gstRate: 'gstRate',
  reminderSent: 'reminderSent',
  numberOfReminders: 'remindersCount',
  parentNotified: 'parentNotified',
  communicationMode: 'communicationMode',
  demandNoticeStatus: 'demandNoticeStatus',
  createdBy: 'createdBy',
  modifiedBy: 'modifiedBy',
  approvedByWaiver: 'approvedByWaiver',
  postedToGl: 'postedToGl',
  feeReconciled: 'feeReconciled',
  dataSource: 'dataSource'
};

const CHARGE_APPLY_DATE_PAIRS: Record<string, [string, string, string]> = {
  feeDueDate: ['feeDueDateFrom', 'feeDueDateTo', 'feeDueDate'],
  feeChargedDate: ['feeChargedDateFrom', 'feeChargedDateTo', 'feeChargedDate'],
  feeCollectionDate: ['feeCollectionDateFrom', 'feeCollectionDateTo', 'feeCollectionDate']
};

const CHARGE_APPLY_DATES: Record<string, string> = {
  admissionDateRange: 'admissionDate',
  refundDateRange: 'refundDate',
  hostelJoiningDate: 'hostelJoiningDate',
  hostelVacatingDate: 'hostelVacatingDate',
  receiptDateRange: 'receiptDate',
  lastReminderDate: 'lastReminderDate',
  lastModifiedRange: 'lastModifiedDate'
};

const CHARGE_SINGLE_DATES: Record<string, string> = {
  lastPaymentDate: 'lastPaymentDate'
};

const CHARGE_APPLY_RANGES: Record<string, string> = {
  chargedAmountRange: 'chargedAmount',
  paidAmountRange: 'paidAmount',
  outstandingRange: 'outstandingAmount',
  overdueAmountRange: 'overdueAmount',
  advanceRange: 'advanceAmount',
  scholarshipRange: 'scholarshipAmount',
  discountRange: 'discountAmount',
  fineAmountRange: 'fineAmount',
  refundAmountRange: 'refundAmount',
  netPayableRange: 'netPayable',
  paymentCompletion: 'paymentCompletionPct',
  concessionPct: 'concessionPct',
  concessionAmountRange: 'concessionAmount',
  refundAmtRange: 'refundAmount',
  fineAmtRange: 'fineAmount',
  transportDistance: 'transportDistanceKm'
};

const CHARGE_TEXT_FIELDS: Record<string, string[]> = {
  studentName: ['studentName'],
  studentId: ['studentId'],
  rollNo: ['rollNo'],
  chequeNumber: ['chequeNumber'],
  txnRefNo: ['txnRefNo'],
  receiptNumber: ['receiptNo'],
  receiptNoSearch: ['receiptNo'],
  journalEntryNo: ['journalEntryNo']
};

const CHARGE_FILTER_KIND: Record<string, ChargeFilterKind> = {};
CHARGE_FILTER_GROUPS.forEach((g) => g.filters.forEach((f) => (CHARGE_FILTER_KIND[f.id] = f.kind)));

const isBlankChargeValue = (v: any): boolean => {
  if (v === undefined || v === null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') {
    const { min, max } = v as { min?: string; max?: string };
    return (min === undefined || min === '') && (max === undefined || max === '');
  }
  return false;
};

const matchesChargeValue = (raw: string, value: any): boolean => {
  if (Array.isArray(value)) return value.length === 0 || value.includes(raw);
  const v = String(value);
  if (v.startsWith('All')) return true;
  if (v.includes(' — ') && v.split(' — ').length === 2) {
    return v === raw || v.split(' — ')[0].trim() === raw;
  }
  return v === raw;
};

function applyChargeFilters(rows: ChargeRow[], filters: Record<string, any>): ChargeRow[] {
  const active = Object.keys(filters).filter((k) => !isBlankChargeValue(filters[k]));
  if (active.length === 0) return rows;

  return rows.filter((row) => {
    for (const id of active) {
      const raw = filters[id];
      const kind = CHARGE_FILTER_KIND[id];
      const data: any = row;

      if (kind === 'toggle') {
        const want = raw === true || raw === 'Yes';
        if (want && row.receiptStatus !== 'Cancelled') return false;
        continue;
      }

      if (kind === 'range' && CHARGE_APPLY_RANGES[id]) {
        const num = Number(data[CHARGE_APPLY_RANGES[id]] || 0);
        const min = (raw as any).min;
        const max = (raw as any).max;
        if (min !== undefined && min !== '' && num < Number(min)) return false;
        if (max !== undefined && max !== '' && num > Number(max)) return false;
        continue;
      }

      if (kind === 'daterange' && CHARGE_APPLY_DATES[id]) {
        const cell = String(data[CHARGE_APPLY_DATES[id]] || '');
        if (!cell) return false;
        const t = Date.parse(cell);
        if (Number.isNaN(t)) return false;
        if ((raw as any).min) {
          const from = Date.parse((raw as any).min);
          if (!Number.isNaN(from) && t < from) return false;
        }
        if ((raw as any).max) {
          const to = Date.parse((raw as any).max);
          if (!Number.isNaN(to) && t > to) return false;
        }
        continue;
      }

      if (kind === 'date' && CHARGE_SINGLE_DATES[id]) {
        const cell = String(data[CHARGE_SINGLE_DATES[id]] || '');
        if (cell && cell >= String(raw)) continue;
        return false;
      }

      if (kind === 'text' && CHARGE_TEXT_FIELDS[id]) {
        const needle = String(raw).toLowerCase();
        const hit = CHARGE_TEXT_FIELDS[id].some((f) =>
          String(data[f] || '').toLowerCase().includes(needle)
        );
        if (!hit) return false;
        continue;
      }

      if (CHARGE_APPLY_KEYS[id]) {
        const cell = String(data[CHARGE_APPLY_KEYS[id]] || '');
        if (!matchesChargeValue(cell, raw)) return false;
        continue;
      }
    }

    // from / to fee-date pairs
    for (const [fromId, toId, field] of Object.values(CHARGE_APPLY_DATE_PAIRS)) {
      const from = filters[fromId];
      const to = filters[toId];
      if (from || to) {
        const cell = String((row as any)[field] || '');
        if (!cell) return false;
        if (from && cell < String(from)) return false;
        if (to && cell > String(to)) return false;
      }
    }

    // "Overdue Since" — unpaid charge whose due date has passed
    if (filters.overdueSince) {
      const due = String(row.feeDueDate || '');
      if (!(due && due <= String(filters.overdueSince) && row.outstandingAmount > 0)) return false;
    }

    return true;
  });
}

const CHARGE_TABLE_COLUMNS = [
  'studentName',
  'studentId',
  'className',
  'feeType',
  'feeChargedDate',
  'feeDueDate',
  'chargedAmount',
  'paidAmount',
  'outstandingAmount',
  'fineAmount',
  'paymentStatus',
  'overdueByDays',
  'paymentMode',
  'receiptNo',
  'receiptStatus',
  'feeReconciled'
];

export function ChargeReceiptReport() {
  // State Management
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
  useState<ReportTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  // Charge & Receipt report criteria (15 groups — ONE panel)
  const [chgDraft, setChgDraft] = useState<Record<string, any>>({});
  const [chgApplied, setChgApplied] = useState<Record<string, any>>({});
  const [chgPanelOpen, setChgPanelOpen] = useState(false);
  const [chgRecordsOpen, setChgRecordsOpen] = useState(false);
  /** "Generate Report" opens the report-criteria filter dropdown instead of a modal. */
  const openReportCriteria = () => {
    setChgPanelOpen(true);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        const el = document.getElementById('charge-criteria-panel');
        if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const chgRows = useMemo(() => applyChargeFilters(CHARGE_ROWS, chgApplied), [chgApplied]);
  const chgAppliedCount = useMemo(
    () => Object.keys(chgApplied).filter((k) => !isBlankChargeValue(chgApplied[k])).length,
    [chgApplied]
  );
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  // Report Generation Form
  const [reportForm, setReportForm] = useState({
    template: '',
    name: '',
    dateFrom: '',
    dateTo: '',
    class: 'all',
    section: 'all',
    chargeType: 'all',
    paymentMode: 'all',
    status: 'all',
    format: 'pdf',
    emailRecipients: ''
  });
  // Mock Data - Generated Reports
  const generatedReports: Report[] = [
  {
    id: 'RPT001',
    reportNo: 'CHRG-RPT-2024-0125',
    name: 'Daily Charge Collection Report',
    type: 'Collection',
    category: 'Daily',
    dateRange: {
      from: '2024-03-15',
      to: '2024-03-15'
    },
    generatedOn: '2024-03-15 18:30',
    generatedBy: 'Mr. Rajesh Kumar',
    status: 'Completed',
    format: 'PDF',
    size: '245 KB',
    totalRecords: 48,
    totalAmount: 125000,
    downloads: 5,
    isFavorite: true
  },
  {
    id: 'RPT002',
    reportNo: 'CHRG-RPT-2024-0124',
    name: 'Weekly Charge Summary',
    type: 'Summary',
    category: 'Weekly',
    dateRange: {
      from: '2024-03-08',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 17:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'Excel',
    size: '1.2 MB',
    totalRecords: 256,
    totalAmount: 875000,
    downloads: 12,
    isFavorite: false
  },
  {
    id: 'RPT003',
    reportNo: 'CHRG-RPT-2024-0123',
    name: 'Pending Charges by Class',
    type: 'Pending',
    category: 'Analysis',
    dateRange: {
      from: '2024-01-01',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 15:45',
    generatedBy: 'Ms. Priya Singh',
    status: 'Completed',
    format: 'PDF',
    size: '520 KB',
    totalRecords: 189,
    totalAmount: 456000,
    downloads: 8,
    isFavorite: true
  },
  {
    id: 'RPT004',
    reportNo: 'CHRG-RPT-2024-0122',
    name: 'Payment Mode Analysis',
    type: 'Analysis',
    category: 'Monthly',
    dateRange: {
      from: '2024-03-01',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 14:30',
    generatedBy: 'Mr. Amit Shah',
    status: 'Completed',
    format: 'PDF',
    size: '380 KB',
    totalRecords: 312,
    totalAmount: 1250000,
    downloads: 3,
    isFavorite: false
  },
  {
    id: 'RPT005',
    reportNo: 'CHRG-RPT-2024-0121',
    name: 'Overdue Charges Report',
    type: 'Overdue',
    category: 'Daily',
    dateRange: {
      from: '2024-03-13',
      to: '2024-03-13'
    },
    generatedOn: '2024-03-13 18:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'PDF',
    size: '198 KB',
    totalRecords: 67,
    totalAmount: 234500,
    downloads: 15,
    isFavorite: false
  },
  {
    id: 'RPT006',
    reportNo: 'CHRG-RPT-2024-0120',
    name: 'Fine Collection Report',
    type: 'Fine',
    category: 'Weekly',
    dateRange: {
      from: '2024-03-01',
      to: '2024-03-13'
    },
    generatedOn: '2024-03-13 16:30',
    generatedBy: 'Mr. Rajesh Kumar',
    status: 'Completed',
    format: 'Excel',
    size: '456 KB',
    totalRecords: 89,
    totalAmount: 45600,
    downloads: 6,
    isFavorite: false
  },
  {
    id: 'RPT007',
    reportNo: 'CHRG-RPT-2024-0119',
    name: 'Category-wise Collection',
    type: 'Collection',
    category: 'Monthly',
    dateRange: {
      from: '2024-02-01',
      to: '2024-02-29'
    },
    generatedOn: '2024-03-01 10:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'PDF',
    size: '890 KB',
    totalRecords: 567,
    totalAmount: 2345000,
    downloads: 25,
    isFavorite: true
  },
  {
    id: 'RPT008',
    reportNo: 'CHRG-RPT-2024-0118',
    name: 'Student-wise Charge Statement',
    type: 'Statement',
    category: 'Custom',
    dateRange: {
      from: '2024-01-01',
      to: '2024-03-12'
    },
    generatedOn: '2024-03-12 14:15',
    generatedBy: 'Ms. Priya Singh',
    status: 'Processing',
    format: 'PDF',
    size: '-',
    totalRecords: 0,
    totalAmount: 0,
    downloads: 0,
    isFavorite: false
  }];

  // Mock Data - Report Templates
  const reportTemplates: ReportTemplate[] = [
  {
    id: 'TPL001',
    name: 'Daily Collection Summary',
    description:
    'Summary of all charges collected on a specific date with payment mode breakdown',
    category: 'Collection',
    icon: <Receipt className="w-6 h-6" />,
    popularity: 95,
    lastUsed: '2024-03-15',
    fields: [
    'Receipt No',
    'Student Name',
    'Class',
    'Charge Type',
    'Amount',
    'Payment Mode',
    'Time'],

    filters: ['Date', 'Payment Mode', 'Class'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL002',
    name: 'Pending Charges Report',
    description:
    'List of all pending charges with student details and overdue days',
    category: 'Pending',
    icon: <Clock className="w-6 h-6" />,
    popularity: 88,
    lastUsed: '2024-03-14',
    fields: [
    'Student Name',
    'Admission No',
    'Class',
    'Charge Head',
    'Amount',
    'Due Date',
    'Days Overdue'],

    filters: ['Class', 'Section', 'Charge Type', 'Days Overdue'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL003',
    name: 'Overdue Charges Analysis',
    description: 'Detailed analysis of overdue charges with aging brackets',
    category: 'Analysis',
    icon: <AlertTriangle className="w-6 h-6" />,
    popularity: 82,
    lastUsed: '2024-03-13',
    fields: [
    'Student Name',
    'Class',
    'Charge',
    'Amount',
    'Due Date',
    'Aging Bracket',
    'Contact'],

    filters: ['Class', 'Aging Bracket', 'Amount Range'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL004',
    name: 'Payment Mode Analysis',
    description: 'Analysis of collections by payment mode with trends',
    category: 'Analysis',
    icon: <PieChart className="w-6 h-6" />,
    popularity: 75,
    lastUsed: '2024-03-12',
    fields: [
    'Payment Mode',
    'Transaction Count',
    'Total Amount',
    'Percentage',
    'Trend'],

    filters: ['Date Range', 'Payment Mode'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL005',
    name: 'Class-wise Collection Report',
    description: 'Collection summary grouped by class and section',
    category: 'Collection',
    icon: <GraduationCap className="w-6 h-6" />,
    popularity: 90,
    lastUsed: '2024-03-15',
    fields: [
    'Class',
    'Section',
    'Total Students',
    'Collected',
    'Pending',
    'Collection %'],

    filters: ['Date Range', 'Class', 'Section'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL006',
    name: 'Fine Collection Report',
    description: 'Report of all fines collected with fine type breakdown',
    category: 'Fine',
    icon: <AlertCircle className="w-6 h-6" />,
    popularity: 70,
    lastUsed: '2024-03-10',
    fields: [
    'Student Name',
    'Class',
    'Fine Type',
    'Original Charge',
    'Fine Amount',
    'Paid Date'],

    filters: ['Date Range', 'Fine Type', 'Class'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL007',
    name: 'Charge Type Summary',
    description: 'Summary of collections by charge type/head',
    category: 'Summary',
    icon: <Layers className="w-6 h-6" />,
    popularity: 85,
    lastUsed: '2024-03-14',
    fields: [
    'Charge Type',
    'Charge Head',
    'Count',
    'Total Amount',
    'Collected',
    'Pending'],

    filters: ['Date Range', 'Charge Type'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL008',
    name: 'Discount & Waiver Report',
    description: 'Report of all discounts and waivers given on charges',
    category: 'Discount',
    icon: <TrendingDown className="w-6 h-6" />,
    popularity: 65,
    lastUsed: '2024-03-08',
    fields: [
    'Student Name',
    'Class',
    'Charge',
    'Original Amount',
    'Discount',
    'Approved By'],

    filters: ['Date Range', 'Discount Type', 'Approved By'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL009',
    name: 'Monthly Comparison Report',
    description: 'Month-over-month comparison of charge collections',
    category: 'Analysis',
    icon: <BarChart3 className="w-6 h-6" />,
    popularity: 78,
    lastUsed: '2024-03-01',
    fields: [
    'Month',
    'Charges Created',
    'Amount',
    'Collected',
    'Pending',
    'Growth %'],

    filters: ['Year', 'Charge Type'],
    isCustom: false,
    isPremium: true
  },
  {
    id: 'TPL010',
    name: 'Student Charge Statement',
    description: 'Individual student charge statement with payment history',
    category: 'Statement',
    icon: <FileText className="w-6 h-6" />,
    popularity: 92,
    lastUsed: '2024-03-15',
    fields: [
    'Date',
    'Charge Head',
    'Debit',
    'Credit',
    'Balance',
    'Receipt No'],

    filters: ['Student', 'Date Range'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL011',
    name: 'Receipt Register',
    description: 'Detailed register of all receipts generated',
    category: 'Register',
    icon: <BookOpen className="w-6 h-6" />,
    popularity: 88,
    lastUsed: '2024-03-15',
    fields: [
    'Receipt No',
    'Date',
    'Student',
    'Amount',
    'Mode',
    'Received By'],

    filters: ['Date Range', 'Payment Mode', 'Received By'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL012',
    name: 'Cashier Collection Report',
    description: 'Collection summary by cashier/staff member',
    category: 'Collection',
    icon: <Users className="w-6 h-6" />,
    popularity: 72,
    lastUsed: '2024-03-14',
    fields: [
    'Cashier Name',
    'Receipt Count',
    'Cash',
    'Cheque',
    'Online',
    'Total'],

    filters: ['Date', 'Cashier'],
    isCustom: false,
    isPremium: false
  }];

  // Statistics
  const stats = useMemo(() => {
    const totalReports = generatedReports.length;
    const completedReports = generatedReports.filter(
      (r) => r.status === 'Completed'
    ).length;
    const totalAmount = generatedReports.
    filter((r) => r.status === 'Completed').
    reduce((sum, r) => sum + r.totalAmount, 0);
    const totalRecords = generatedReports.
    filter((r) => r.status === 'Completed').
    reduce((sum, r) => sum + r.totalRecords, 0);
    const totalDownloads = generatedReports.reduce(
      (sum, r) => sum + r.downloads,
      0
    );
    return {
      totalReports,
      completedReports,
      totalAmount,
      totalRecords,
      totalDownloads
    };
  }, []);
  // Filter reports
  const filteredReports = useMemo(() => {
    return generatedReports.filter((report) => {
      const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === 'all' || report.type === filters.type;
      const matchesCategory =
      filters.category === 'all' || report.category === filters.category;
      const matchesStatus =
      filters.status === 'all' || report.status === filters.status;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [searchTerm, filters]);
  // Filter templates
  const filteredTemplates = useMemo(() => {
    return reportTemplates.filter(
      (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedTemplate) return;
    // Simulate report generation
    alert(
      `Generating report: ${reportForm.name || selectedTemplate.name}\nFormat: ${reportForm.format.toUpperCase()}\nDate Range: ${reportForm.dateFrom} to ${reportForm.dateTo}`
    );
    setShowGenerateModal(false);
    setSelectedTemplate(null);
    setReportForm({
      template: '',
      name: '',
      dateFrom: '',
      dateTo: '',
      class: 'all',
      section: 'all',
      chargeType: 'all',
      paymentMode: 'all',
      status: 'all',
      format: 'pdf',
      emailRecipients: ''
    });
  };
  // Export report
  const exportReport = (report: Report, format: string) => {
    alert(`Downloading ${report.name} as ${format.toUpperCase()}`);
  };
  // Toggle favorite
  const toggleFavorite = (reportId: string) => {
    // Would update state in real app
    alert('Toggled favorite status');
  };
  // Delete report
  const deleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      alert('Report deleted');
    }
  };
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">{status}</Badge>;
      case 'Processing':
        return <Badge variant="warning">{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger">{status}</Badge>;
      case 'Scheduled':
        return <Badge variant="info">{status}</Badge>;
      case 'Pending':
        return <Badge variant="default">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  // Report table columns
  const reportColumns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={
      selectedReports.length === filteredReports.length &&
      filteredReports.length > 0
      }
      onChange={(e) =>
      setSelectedReports(
        e.target.checked ? filteredReports.map((r) => r.id) : []
      )
      } />,


    render: (row: Report) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedReports.includes(row.id)}
      onChange={() =>
      setSelectedReports((prev) =>
      prev.includes(row.id) ?
      prev.filter((id) => id !== row.id) :
      [...prev, row.id]
      )
      } />


  },
  {
    key: 'report',
    header: 'Report Details',
    render: (row: Report) =>
    <div className="flex items-start gap-3">
          <button onClick={() => toggleFavorite(row.id)}>
            <Star
          className={`w-4 h-4 ${row.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />

          </button>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.reportNo}</div>
          </div>
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: Report) =>
    <div>
          <Badge variant="default">{row.type}</Badge>
          <div className="text-xs text-gray-500 mt-1">{row.category}</div>
        </div>

  },
  {
    key: 'dateRange',
    header: 'Date Range',
    render: (row: Report) =>
    <div className="text-sm">
          <div>{new Date(row.dateRange.from).toLocaleDateString('en-IN')}</div>
          <div className="text-xs text-gray-500">
            to {new Date(row.dateRange.to).toLocaleDateString('en-IN')}
          </div>
        </div>

  },
  {
    key: 'stats',
    header: 'Statistics',
    render: (row: Report) =>
    <div className="text-sm">
          <div className="font-medium">{row.totalRecords} records</div>
          <div className="text-green-600">
            ₹{row.totalAmount.toLocaleString()}
          </div>
        </div>

  },
  {
    key: 'generated',
    header: 'Generated',
    render: (row: Report) =>
    <div className="text-sm">
          <div>{row.generatedOn}</div>
          <div className="text-xs text-gray-500">by {row.generatedBy}</div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Report) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          <div className="text-xs text-gray-500">
            {row.format} • {row.size}
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Report) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="Preview"
        onClick={() => {
          setSelectedReport(row);
          setShowPreviewModal(true);
        }}
        disabled={row.status !== 'Completed'}>

            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Download"
        onClick={() => exportReport(row, row.format.toLowerCase())}
        disabled={row.status !== 'Completed'}>

            <Download className="w-4 h-4 text-green-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Print"
        disabled={row.status !== 'Completed'}>

            <Printer className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => deleteReport(row.id)}>

            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Charge Receipt Reports
              <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                FY: 2025-26
              </Badge>
            </h1>
            <p className="text-xs text-gray-500">
              Generate, filter, manage and export charge collection reports
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openReportCriteria}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('templates')}>
            <FileText className="w-4 h-4 mr-2" />
            Use Template
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Reports</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalReports}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.completedReports}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Total Records
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.totalRecords.toLocaleString()}
              </p>
            </div>
            <Layers className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{(stats.totalAmount / 100000).toFixed(1)}L
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-600 font-medium">Downloads</p>
              <p className="text-2xl font-bold text-pink-900">
                {stats.totalDownloads}
              </p>
            </div>
            <Download className="w-8 h-8 text-pink-500" />
          </div>
        </Card>
      </div>

      <div id="charge-criteria-panel" className="scroll-mt-6">
      <ChargeCriteriaPanel
        draft={chgDraft}
        applied={chgApplied}
        onChange={(id, value) => setChgDraft((prev) => ({ ...prev, [id]: value }))}
        onApply={() => setChgApplied({ ...chgDraft })}
        onReset={() => {
          setChgDraft({});
          setChgApplied({});
        }}
        rows={chgRows}
        totalRows={CHARGE_ROWS.length}
        open={chgPanelOpen}
        setOpen={setChgPanelOpen}
        onViewRecords={() => setChgRecordsOpen(true)}
      />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
        {
          id: 'reports',
          label: 'Generated Reports',
          icon: FileText
        },
        {
          id: 'templates',
          label: 'Report Templates',
          icon: FolderOpen
        },
].
        map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab.id as any)}>

              <Icon className="w-4 h-4" />
              {tab.label}
            </button>);

        })}
      </div>

      {/* Generated Reports Tab */}
      {activeTab === 'reports' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search reports by name or report number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'Collection',
                  label: 'Collection'
                },
                {
                  value: 'Pending',
                  label: 'Pending'
                },
                {
                  value: 'Analysis',
                  label: 'Analysis'
                },
                {
                  value: 'Fine',
                  label: 'Fine'
                },
                {
                  value: 'Summary',
                  label: 'Summary'
                },
                {
                  value: 'Statement',
                  label: 'Statement'
                }]
                }
                value={filters.type}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value
                })
                } />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'Daily',
                  label: 'Daily'
                },
                {
                  value: 'Weekly',
                  label: 'Weekly'
                },
                {
                  value: 'Monthly',
                  label: 'Monthly'
                },
                {
                  value: 'Custom',
                  label: 'Custom'
                }]
                }
                value={filters.category}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value
                })
                } />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'Completed',
                  label: 'Completed'
                },
                {
                  value: 'Processing',
                  label: 'Processing'
                },
                {
                  value: 'Failed',
                  label: 'Failed'
                }]
                }
                value={filters.status}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value
                })
                } />

                <Button
                variant="outline"
                onClick={() =>
                setFilters({
                  type: 'all',
                  category: 'all',
                  status: 'all',
                  dateFrom: '',
                  dateTo: ''
                })
                }>

                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedReports.length > 0 &&
        <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800 font-medium">
                  {selectedReports.length} report(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                className="bg-white text-red-600 border-red-200">

                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
        }

          {/* Reports Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={reportColumns} data={filteredReports} />
            </div>
          </Card>
        </div>
      }

      {/* Report Templates Tab */}
      {activeTab === 'templates' &&
      <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Template
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) =>
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'}`}
            onClick={() => setSelectedTemplate(template)}>

                <div className="flex items-start gap-4">
                  <div
                className={`p-3 rounded-xl ${template.category === 'Collection' ? 'bg-green-100 text-green-600' : template.category === 'Pending' ? 'bg-orange-100 text-orange-600' : template.category === 'Analysis' ? 'bg-purple-100 text-purple-600' : template.category === 'Fine' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>

                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        {template.name}
                      </h3>
                      {template.isPremium &&
                  <Badge variant="warning" className="text-xs">
                          Premium
                        </Badge>
                  }
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {template.popularity}% popular
                      </span>
                      {template.lastUsed &&
                  <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Used {template.lastUsed}
                        </span>
                  }
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.fields.slice(0, 4).map((field, index) =>
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">

                        {field}
                      </span>
                )}
                    {template.fields.length > 4 &&
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{template.fields.length - 4} more
                      </span>
                }
                  </div>
                  <div className="flex gap-2">
                    <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    setShowGenerateModal(true);
                  }}>

                      <Play className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Preview: ${template.name}`);
                  }}>

                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
          )}
          </div>
        </div>
      }

      {/* Generate Report Modal */}
      {showGenerateModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Generate Report
                  </h2>
                  {selectedTemplate &&
                <p className="text-sm text-gray-500">
                      Using template: {selectedTemplate.name}
                    </p>
                }
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedTemplate(null);
                }}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Selection */}
              {!selectedTemplate &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Template
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {reportTemplates.slice(0, 6).map((template) =>
                <button
                  key={template.id}
                  className={`p-3 border rounded-lg text-left transition-all ${reportForm.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() =>
                  setReportForm({
                    ...reportForm,
                    template: template.id
                  })
                  }>

                        <div className="font-medium text-sm">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.category}
                        </div>
                      </button>
                )}
                  </div>
                </div>
            }

              {/* Report Name */}
              <Input
              label="Report Name (Optional)"
              placeholder="Custom report name..."
              value={reportForm.name}
              onChange={(e) =>
              setReportForm({
                ...reportForm,
                name: e.target.value
              })
              } />


              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="From Date"
                type="date"
                value={reportForm.dateFrom}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  dateFrom: e.target.value
                })
                } />

                <Input
                label="To Date"
                type="date"
                value={reportForm.dateTo}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  dateTo: e.target.value
                })
                } />

              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                label="Class"
                options={[
                {
                  value: 'all',
                  label: 'All Classes'
                },
                {
                  value: '6',
                  label: 'Class 6'
                },
                {
                  value: '7',
                  label: 'Class 7'
                },
                {
                  value: '8',
                  label: 'Class 8'
                },
                {
                  value: '9',
                  label: 'Class 9'
                },
                {
                  value: '10',
                  label: 'Class 10'
                },
                {
                  value: '11',
                  label: 'Class 11'
                },
                {
                  value: '12',
                  label: 'Class 12'
                }]
                }
                value={reportForm.class}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  class: e.target.value
                })
                } />

                <Select
                label="Section"
                options={[
                {
                  value: 'all',
                  label: 'All Sections'
                },
                {
                  value: 'A',
                  label: 'Section A'
                },
                {
                  value: 'B',
                  label: 'Section B'
                },
                {
                  value: 'C',
                  label: 'Section C'
                }]
                }
                value={reportForm.section}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  section: e.target.value
                })
                } />

                <Select
                label="Charge Type"
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'Fine',
                  label: 'Fine'
                },
                {
                  value: 'Event',
                  label: 'Event'
                },
                {
                  value: 'Exam',
                  label: 'Exam'
                },
                {
                  value: 'Material',
                  label: 'Material'
                }]
                }
                value={reportForm.chargeType}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  chargeType: e.target.value
                })
                } />

                <Select
                label="Payment Mode"
                options={[
                {
                  value: 'all',
                  label: 'All Modes'
                },
                {
                  value: 'cash',
                  label: 'Cash'
                },
                {
                  value: 'cheque',
                  label: 'Cheque'
                },
                {
                  value: 'online',
                  label: 'Online'
                },
                {
                  value: 'card',
                  label: 'Card'
                }]
                }
                value={reportForm.paymentMode}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  paymentMode: e.target.value
                })
                } />

              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <div className="flex gap-3">
                  {[
                {
                  value: 'pdf',
                  label: 'PDF',
                  icon: <File className="w-5 h-5" />
                },
                {
                  value: 'excel',
                  label: 'Excel',
                  icon: <FileSpreadsheet className="w-5 h-5" />
                },
                {
                  value: 'csv',
                  label: 'CSV',
                  icon: <FileText className="w-5 h-5" />
                }].
                map((format) =>
                <button
                  key={format.value}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${reportForm.format === format.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() =>
                  setReportForm({
                    ...reportForm,
                    format: format.value
                  })
                  }>

                      {format.icon}
                      {format.label}
                    </button>
                )}
                </div>
              </div>

              {/* Email Recipients */}
              <Input
              label="Email Recipients (Optional)"
              placeholder="Enter email addresses separated by comma..."
              value={reportForm.emailRecipients}
              onChange={(e) =>
              setReportForm({
                ...reportForm,
                emailRecipients: e.target.value
              })
              } />

            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
              variant="outline"
              onClick={() => {
                setShowGenerateModal(false);
                setSelectedTemplate(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleGenerateReport}>
                <Zap className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Report Preview Modal */}
      {showPreviewModal && selectedReport &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReport.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedReport.reportNo}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                variant="outline"
                onClick={() => exportReport(selectedReport, 'pdf')}>

                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                variant="ghost"
                onClick={() => setShowPreviewModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Report Preview Content */}
              <div className="bg-gray-50 border rounded-lg p-8 min-h-[400px]">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Delhi Public School</h2>
                  <p className="text-gray-600">{selectedReport.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Period:{' '}
                    {new Date(selectedReport.dateRange.from).toLocaleDateString(
                    'en-IN'
                  )}{' '}
                    -{' '}
                    {new Date(selectedReport.dateRange.to).toLocaleDateString(
                    'en-IN'
                  )}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-2xl font-bold">
                      {selectedReport.totalRecords}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{selectedReport.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Generated On</p>
                    <p className="text-lg font-medium">
                      {selectedReport.generatedOn}
                    </p>
                  </div>
                </div>

                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p>Full report preview would be displayed here</p>
                  <p className="text-sm">
                    Download the report to view complete details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <ChargeRecordsModal
        open={chgRecordsOpen}
        onClose={() => setChgRecordsOpen(false)}
        rows={chgRows}
        appliedCount={chgAppliedCount}
      />

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Report Generation Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>
                Use templates for quick report generation with predefined
                formats
              </li>
              <li>
                Export reports in PDF for printing or Excel for further analysis
              </li>
              <li>Star your frequently used reports for quick access</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}


/* ============================================================================
   UNIFIED CHARGE CRITERIA PANEL — all 15 groups in ONE panel
   ============================================================================ */
function ChargeFilterField({
  def,
  value,
  onChange
}: {
  def: ChargeFilterDef;
  value: any;
  onChange: (id: string, value: any) => void;
}) {
  const labelEl = (
    <label className="block text-[11px] font-semibold text-gray-600 mb-1 leading-tight">
      {def.label}
    </label>
  );

  if (def.kind === 'select') {
    return (
      <div>
        {labelEl}
        <Select
          options={(def.options || []).map((o) => ({ value: o, label: o }))}
          value={typeof value === 'string' ? value : (def.options || ['All'])[0]}
          onChange={(v: any) =>
            onChange(def.id, typeof v === 'string' ? v : v?.target?.value ?? '')
          }
          className="text-xs"
        />
      </div>
    );
  }

  if (def.kind === 'multiselect') {
    return (
      <div>
        {labelEl}
        <MultiSelect
          options={(def.options || []).map((o) => ({ value: o, label: o }))}
          value={Array.isArray(value) ? value : []}
          onChange={(vals) => onChange(def.id, vals)}
          placeholder={def.hint || 'All'}
          className="text-xs"
        />
      </div>
    );
  }

  if (def.kind === 'text') {
    return (
      <div>
        {labelEl}
        <Input
          placeholder={def.placeholder || def.label}
          value={typeof value === 'string' ? value : ''}
          onChange={(e: any) => onChange(def.id, e.target.value)}
          className="text-xs"
        />
      </div>
    );
  }

  if (def.kind === 'toggle') {
    const on = value === true || value === 'Yes';
    return (
      <div>
        {labelEl}
        <button
          type="button"
          onClick={() => onChange(def.id, !on)}
          className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            on
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-600'
          }`}
        >
          <span>{on ? 'Yes — applied' : 'No'}</span>
          <span
            className={`h-4 w-8 rounded-full relative ${on ? 'bg-indigo-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                on ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </span>
        </button>
      </div>
    );
  }

  if (def.kind === 'date') {
    return (
      <div>
        {labelEl}
        <input
          type="date"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(def.id, e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {def.hint && <p className="text-[10px] text-gray-400 mt-0.5">{def.hint}</p>}
      </div>
    );
  }

  if (def.kind === 'daterange') {
    const v = typeof value === 'object' && value ? value : { min: '', max: '' };
    return (
      <div>
        {labelEl}
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={v.min || ''}
            onChange={(e) => onChange(def.id, { ...v, min: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-[11px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={v.max || ''}
            onChange={(e) => onChange(def.id, { ...v, max: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-[11px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  }

  const v = typeof value === 'object' && value ? value : { min: '', max: '' };
  return (
    <div>
      {labelEl}
      <div className="flex items-center gap-1">
        <input
          type="number"
          placeholder={String(def.min ?? 0)}
          value={v.min || ''}
          onChange={(e) => onChange(def.id, { ...v, min: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-[11px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-gray-400 text-xs">—</span>
        <input
          type="number"
          placeholder={String(def.max ?? '')}
          value={v.max || ''}
          onChange={(e) => onChange(def.id, { ...v, max: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-[11px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {def.unit && <span className="text-[10px] text-gray-500 font-semibold">{def.unit}</span>}
      </div>
    </div>
  );
}

function chargeChipLabel(def: ChargeFilterDef, value: any): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value === true) return 'Yes';
  if (typeof value === 'object' && value) {
    const { min, max } = value;
    if (min && max) return `${min} → ${max}`;
    return String(min || max || '');
  }
  return String(value);
}

function ChargeCriteriaPanel({
  draft,
  applied,
  onChange,
  onApply,
  onReset,
  rows,
  totalRows,
  open,
  setOpen,
  onViewRecords
}: {
  draft: Record<string, any>;
  applied: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
  rows: ChargeRow[];
  totalRows: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  onViewRecords: () => void;
}) {
  const activeChips = useMemo(() => {
    const out: { id: string; label: string; value: string }[] = [];
    CHARGE_FILTER_GROUPS.forEach((g) =>
      g.filters.forEach((f) => {
        const v = applied[f.id];
        if (!isBlankChargeValue(v)) out.push({ id: f.id, label: f.label, value: chargeChipLabel(f, v) });
      })
    );
    return out;
  }, [applied]);

  const draftCount = useMemo(
    () => Object.keys(draft).filter((k) => !isBlankChargeValue(draft[k])).length,
    [draft]
  );

  const charged = rows.reduce((s, r) => s + r.chargedAmount, 0);
  const collected = rows.reduce((s, r) => s + r.paidAmount, 0);
  const pending = rows.reduce((s, r) => s + r.outstandingAmount, 0);
  const overdue = rows.reduce((s, r) => s + r.overdueAmount, 0);
  const concess = rows.reduce((s, r) => s + r.concessionAmount, 0);

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Charge &amp; Receipt Report Criteria — All {CHARGE_FILTER_GROUPS.length} Filter Groups in One Panel
            </h2>
            <p className="text-xs text-gray-500">
              {TOTAL_CHARGE_FILTERS} search filters · {draftCount} selected · {activeChips.length} applied ·{' '}
              {rows.length} of {totalRows} charge records in scope
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onViewRecords}>
            <Eye className="w-4 h-4 mr-1" />
            View Matched Records
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={onApply}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Apply Criteria
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${open ? '' : '-rotate-90'}`} />
            {open ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 border-b border-gray-200">
        {[
          { label: 'Total Charged', value: charged, tone: 'text-gray-900' },
          { label: 'Total Collected', value: collected, tone: 'text-emerald-700' },
          { label: 'Outstanding', value: pending, tone: 'text-amber-700' },
          { label: 'Overdue', value: overdue, tone: 'text-rose-700' },
          { label: 'Concession / Waiver', value: concess, tone: 'text-indigo-700' }
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {k.label}
            </p>
            <p className={`text-sm font-bold ${k.tone}`}>{inr(k.value)}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="p-4 space-y-5">
          {CHARGE_FILTER_GROUPS.map((group, gi) => (
            <div key={group.id} className={gi === 0 ? '' : 'pt-4 border-t border-gray-100'}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {group.title}
                </h3>
                <span className="text-[10px] font-semibold text-gray-400">
                  {group.filters.length} filters
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {group.filters.map((f) => (
                  <ChargeFilterField
                    key={f.id}
                    def={f}
                    value={draft[f.id]}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Applied criteria
          </span>
          {activeChips.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
            >
              {c.label}: {c.value}
              <button
                type="button"
                onClick={() => onChange(c.id, undefined)}
                className="text-indigo-500 hover:text-indigo-800"
                title="Remove criterion from draft"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

function ChargeRecordsModal({
  open,
  onClose,
  rows,
  appliedCount
}: {
  open: boolean;
  onClose: () => void;
  rows: ChargeRow[];
  appliedCount: number;
}) {
  if (!open) return null;

  const money = (k: keyof ChargeRow) => rows.reduce((s, r) => s + Number(r[k] || 0), 0);
  const headers = CHARGE_TABLE_COLUMNS.map((c) => CHARGE_COLUMN_LABELS[c] || c);

  const grid = rows.map((r) =>
    CHARGE_TABLE_COLUMNS.map((c) => {
      const v = (r as any)[c];
      return typeof v === 'number' ? inr(v) : String(v || '—');
    })
  );

  const exportCsv = () => {
    const body = [headers, ...grid].map((row) => row.map((c) => String(c)).join(',')).join('\n');
    downloadText(
      `charge-receipt-records-${new Date().toISOString().slice(0, 10)}.csv`,
      body,
      'text/csv;charset=utf-8'
    );
  };

  const print = () => {
    const totalRow = ['Total', '', '', '', '', '', inr(money('chargedAmount')), inr(money('paidAmount')), inr(money('outstandingAmount')), inr(money('fineAmount')), '', '', '', '', '', ''];
    printHtml(
      tableHtml(
        'Charge & Receipt Records (Filtered)',
        headers,
        [...grid, totalRow].map((r) => r.map((c) => String(c)))
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[95vw] max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Charge &amp; Receipt Records</h3>
            <p className="text-xs text-gray-500">
              {rows.length} record(s) match the {appliedCount} applied criteria
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-1" />
              Excel / CSV
            </Button>
            <Button variant="outline" size="sm" onClick={print}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="p-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {CHARGE_TABLE_COLUMNS.map((c) => {
                    const v = (r as any)[c];
                    const isMoney = typeof v === 'number';
                    const isStatus = c === 'paymentStatus' || c === 'receiptStatus' || c === 'feeReconciled';
                    return (
                      <td key={c} className="p-3 whitespace-nowrap text-gray-700">
                        {isStatus ? (
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                              String(v) === 'Fully Paid' || String(v) === 'Active' || String(v) === 'Reconciled'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : String(v) === 'Partially Paid' || String(v) === 'Advance Paid'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : String(v) === 'Not Paid' || String(v) === 'Cancelled' || String(v) === 'Reversed'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {String(v || '—')}
                          </span>
                        ) : isMoney ? (
                          inr(v)
                        ) : (
                          String(v || '—')
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="p-6 text-center text-gray-500">
                    No charge records match the applied criteria.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-800">
                <tr>
                  {CHARGE_TABLE_COLUMNS.map((c, i) => (
                    <td key={c} className="p-3">
                      {i === 0
                        ? `Total (${rows.length} records)`
                        : c === 'chargedAmount'
                          ? inr(money('chargedAmount'))
                          : c === 'paidAmount'
                            ? inr(money('paidAmount'))
                            : c === 'outstandingAmount'
                              ? inr(money('outstandingAmount'))
                              : c === 'fineAmount'
                                ? inr(money('fineAmount'))
                                : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
