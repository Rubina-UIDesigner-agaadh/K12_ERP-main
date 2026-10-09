import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  BarChart3,
  Calculator,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Landmark,
  Layers,
  Mail,
  Percent,
  Play,
  RefreshCw,
  Scale,
  Search,
  Shield,
  Sparkles,
  Users,
  X
} from
  'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';

// ============================================================================
// FEES REPORT CRITERIA — 17 filter groups (228 filters) in ONE panel
// ============================================================================
type FeeFilterKind = 'select' | 'multiselect' | 'text' | 'date' | 'daterange' | 'range' | 'toggle';

interface FeeFilterDef {
  id: string;
  label: string;
  kind: FeeFilterKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  unit?: string;
}

interface FeeFilterGroup {
  id: string;
  title: string;
  filters: FeeFilterDef[];
}

const feeSel = (id: string, label: string, options: string[], hint?: string): FeeFilterDef => ({ id, label, kind: 'select', options, hint });
const feeMulti = (id: string, label: string, options: string[], hint?: string): FeeFilterDef => ({ id, label, kind: 'multiselect', options, hint });
const feeTxt = (id: string, label: string, placeholder?: string): FeeFilterDef => ({ id, label, kind: 'text', placeholder });
const feeDt = (id: string, label: string, hint?: string): FeeFilterDef => ({ id, label, kind: 'date', hint });
const feeDtr = (id: string, label: string, hint?: string): FeeFilterDef => ({ id, label, kind: 'daterange', hint });
const feeRng = (id: string, label: string, min: number, max: number, unit = ''): FeeFilterDef => ({ id, label, kind: 'range', min, max, unit });

// ---------------------------------------------------------------- option lists
const FEE_MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const FEE_FY = ['All Years', 'FY 2021-22', 'FY 2022-23', 'FY 2023-24', 'FY 2024-25', 'FY 2025-26'];
const FEE_AY = ['All Years', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
const FEE_TERMS_INSTALLMENTS = ['Term 1', 'Term 2', 'Term 3', 'Installment 1', 'Installment 2', 'Installment 3', 'Installment 4'];
const FEE_HEADS = [
  'Tuition Fee', 'Admission Fee', 'Registration Fee', 'Exam Fee', 'Library Fee', 'Lab Fee', 'Computer Fee',
  'Sports Fee', 'Activity Fee', 'Hostel Fee', 'Transport Fee', 'Mess / Canteen Fee', 'Development Fee',
  'Infrastructure Fee', 'Medical Fee', 'Magazine Fee', 'Diary / Almanac Fee', 'ID Card Fee', 'Uniform Fee',
  'Book / Material Fee', 'Caution Deposit', 'Security Deposit', 'PTM Fee', 'Cultural Fee', 'Smart Class Fee',
  'Maintenance Fee', 'Late Fine', 'Library Fine', 'Other'
];
const FEE_STRUCTURES = ['Day Scholar Structure', 'Boarder Structure', 'NRI Structure', 'RTE Structure', 'Transport User Structure', 'Staff Ward Structure'];
const FEE_STRUCTURE_TYPES = ['All Types', 'Standard', 'Concessional', 'NRI / Foreign', 'RTE / Free', 'Staff Ward', 'Management Quota', 'Custom'];
const FEE_GROUPS = ['All Groups', 'Academic Fees', 'Hostel & Boarding Fees', 'Transport Fees', 'Co-curricular Fees', 'Administrative Fees', 'Deposits & Security', 'Fines & Penalties', 'Optional Fees'];
const FEE_SUBGROUPS = ['All Sub-Groups', 'Core Academic', 'Co-curricular', 'Boarding', 'Commute', 'Deposits', 'Penalties', 'Optional Add-ons'];
const FEE_HEAD_STATUS = ['All', 'Active', 'Inactive', 'Discontinued'];
const FEE_MANDATORY = ['All', 'Mandatory Fee', 'Optional Fee'];
const FEE_RECURRING = ['All', 'Recurring', 'One-Time', 'Conditional'];
const FEE_FREQUENCY = ['All Frequencies', 'Monthly', 'Bi-Monthly', 'Quarterly', 'Term-wise', 'Half-Yearly', 'Annual', 'One-Time', 'On Demand'];
const FEE_APPLICABLE_FOR = ['All Students', 'Day Scholars Only', 'Boarders Only', 'Transport Users Only', 'Specific Class', 'Specific Category'];
const FEE_GST_APPLICABLE = ['All', 'GST Applicable', 'GST Exempt'];
const FEE_GST_RATES = ['All Rates', '0%', '5%', '12%', '18%', '28%'];
const FEE_GL_ACCOUNTS = ['4001 — Tuition Fee Income', '4002 — Admission Fee Income', '4003 — Transport Fee Income', '4004 — Hostel Fee Income', '4005 — Exam Fee Income', '4006 — Fine & Penalty Income', '4007 — Deposit Liability'];
const FEE_TDS = ['All', 'TDS Applicable', 'TDS Not Applicable'];
const FEE_YESNO_REVISED = ['All', 'Yes — Revised', 'No — Same as Last Year'];
const FEE_REVISION_TYPE = ['All', 'Increased', 'Decreased', 'No Change'];
const FEE_CLASSES = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const FEE_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'All'];
const FEE_GENDERS = ['All', 'Male', 'Female', 'Other'];
const FEE_CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority', 'PH', 'NRI', 'Other'];
const FEE_RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
const FEE_NATIONALITIES = ['All', 'Indian', 'NRI', 'Foreign National'];
const FEE_STUDENT_TYPES = ['All', 'Regular', 'RTE (Free Seat)', 'Management Quota', 'NRI', 'Scholarship Student', 'Staff Ward', 'Foreign'];
const FEE_DAY_BOARDER = ['All', 'Day Scholar', 'Boarder / Hostel Student'];
const FEE_TRANSPORT_USER = ['All', 'Uses School Bus', 'Does Not Use Bus', 'Own Transport'];
const FEE_SIBLING = ['All', 'Yes — Has Sibling', 'No'];
const FEE_STAFF_WARD = ['All', 'Staff Ward', 'Non-Staff Ward'];
const FEE_RTE = ['All', 'RTE Student', 'Non-RTE'];
const FEE_BPL = ['All', 'BPL Card Holder', 'Non-BPL'];
const FEE_DIVYAANG = ['All', 'Yes', 'No'];
const FEE_SCHOLARSHIP_HOLDER = ['All', 'Has Active Scholarship', 'No Scholarship'];
const FEE_SCHOLARSHIP_SCHEMES = ['All Schemes', 'Merit Scholarship Scheme', 'NMMS Scholarship', 'RTE Free Seat Scheme', 'EWS Fee Waiver Scheme', 'Sports Excellence Scheme', 'Minority Welfare Scheme', 'Staff Ward Concession Scheme'];
const FEE_CONCESSION_TYPES = ['Sibling Discount', 'Staff Ward', 'Merit Discount', 'Need-Based', 'Management', 'Early Bird', 'Other'];
const FEE_CONCESSION_TYPES_FULL = [
  'Scholarship Waiver', 'Sibling Concession', 'Staff Ward Concession', 'Merit Discount', 'Need-Based Discount',
  'Early Bird Discount', 'Bulk / Annual Payment Discount', 'RTE Free Seat', 'Management Quota', 'Alumni Discount',
  'Sports Scholarship', 'Cultural Discount', 'Twin / Multiple Birth Discount', 'Loyalty Discount', 'Other'
];
const FEE_STUDENT_STATUS = ['All', 'Active', 'Inactive', 'TC Issued', 'Detained', 'Passed Out', 'Transferred'];
const FEE_BOARDS = ['CBSE', 'ICSE', 'SSC (State Board)', 'IB (International Baccalaureate)', 'Cambridge IGCSE', 'NIOS', 'Other'];
const FEE_BRANCHES = ['All Branches', 'Main Campus', 'North Campus', 'South Campus', 'East Branch', 'West Branch'];
const FEE_MEDIUMS = ['All', 'English Medium', 'Hindi Medium', 'Regional Language Medium', 'Bilingual'];
const FEE_ACADEMIC_GROUPS = ['All', 'Pre-Primary (Nursery-UKG)', 'Primary (1-5)', 'Middle School (6-8)', 'Secondary (9-10)', 'Senior Secondary (11-12)'];
const FEE_STREAMS = ['All', 'Science', 'Commerce', 'Arts / Humanities', 'Vocational'];
const FEE_OPTIONAL_SUBJECTS = ['All Subjects', 'Computer Science', 'Physical Education', 'Fine Arts', 'Music', 'Dance', 'Home Science', 'Entrepreneurship', 'Hindi Literature', 'Sanskrit'];
const FEE_CLASS_TEACHERS = ['All Teachers', 'Mrs. Patel (Class 5A)', 'Mr. Sharma (Class 8B)', 'Ms. Iyer (Class 10A)', 'Mr. Khan (Class 12C)'];
const FEE_HOUSES = ['All Houses', 'Red House', 'Blue House', 'Green House', 'Yellow House'];
const FEE_DEPARTMENTS = ['All', 'Admin', 'Academic', 'Sports', 'Library', 'Hostel', 'Transport'];
const FEE_INVOICE_STATUSES = ['Draft', 'Generated', 'Sent to Parent', 'Partially Paid', 'Fully Paid', 'Overdue', 'Cancelled', 'Written Off'];
const FEE_INVOICE_GENERATORS = ['All Staff', 'Accounts Officer', 'Fee Counter Cashier', 'Finance Manager', 'System Auto-Generated'];
const FEE_SENT_MODES = ['All', 'Email', 'SMS', 'Portal', 'WhatsApp', 'Physical Copy', 'Not Sent'];
const FEE_ACK = ['All', 'Acknowledged by Parent', 'Not Acknowledged'];
const FEE_BULK_INVOICE = ['All', 'Bulk Generated', 'Individual Generated'];
const FEE_NEW_ADMISSION_INVOICE = ['All', 'New Admission Invoice', 'Regular Invoice'];
const FEE_PROFORMA = ['All', 'Proforma Only', 'Tax Invoice Only'];
const FEE_CANCELLED_INVOICE = ['All', 'Active Invoices', 'Cancelled Invoices Only'];
const FEE_REGENERATED = ['All', 'Original', 'Regenerated / Revised'];
const FEE_INVOICE_TERMS = ['Term 1 Invoice', 'Term 2 Invoice', 'Term 3 Invoice'];
const FEE_WITH_LATE_FINE = ['All', 'Includes Late Fine', 'No Late Fine'];
const FEE_WITH_CONCESSION = ['All', 'Has Concession Applied', 'No Concession'];
const FEE_PER_HEAD_AVERAGE = ['All', 'Below ₹10,000', '₹10,001-₹25,000', '₹25,001-₹50,000', '₹50,001-₹1,00,000', 'Above ₹1,00,000'];
const FEE_OVERALL_STATUS = ['Not Paid', 'Partially Paid', 'Fully Paid', 'Overpaid', 'Waived (Full)', 'Written Off', 'Refunded'];
const FEE_TERM_STATUS = ['All', 'Paid', 'Partially Paid', 'Not Paid', 'Waived'];
const FEE_OVERDUE_STATUS = ['All', 'Overdue', 'Not Overdue', 'Due Today', 'Due This Week', 'Due This Month'];
const FEE_OVERDUE_DAYS = ['All', '0-7 Days', '8-15 Days', '16-30 Days', '31-60 Days', '61-90 Days', 'More than 90 Days'];
const FEE_PAID_ON_TIME = ['All', 'Always On Time', 'Sometimes Late', 'Always Late'];
const FEE_DEFAULTER_STATUS = ['All', 'First-Time Defaulter', 'Repeated Defaulter (2-3 times)', 'Chronic Defaulter (4+ times)'];
const FEE_INSTALLMENT_STATUS = ['Installment 1 Due', 'Installment 2 Due', 'All Installments Paid', 'Overdue Installments'];
const FEE_ADVANCE_STATUS = ['All', 'Has Advance Payment', 'No Advance'];
const FEE_PARTIAL_COUNT = ['All', '0 Partial Payments', '1 Partial Payment', '2 Partial Payments', '3+ Partial Payments'];
const FEE_PAYMENT_MODES = [
  'Cash', 'Cheque', 'DD (Demand Draft)', 'NEFT', 'RTGS', 'IMPS', 'UPI — Google Pay', 'UPI — PhonePe', 'UPI — Paytm',
  'UPI — BHIM', 'Credit Card', 'Debit Card', 'Net Banking', 'QR Code Scan', 'Auto-Debit (NACH / ECS)', 'Wallet', 'Mobile Banking App'
];
const FEE_PAYMENT_CHANNELS = ['School Counter (In-Person)', 'School Online Portal', 'Mobile App', 'Bank Direct Deposit', 'NEFT From Bank', 'Auto-Debit', 'Third-Party Gateway', 'ATM', 'Drop Box'];
const FEE_GATEWAYS = ['All', 'Razorpay', 'Paytm Gateway', 'CCAvenue', 'PayU', 'Instamojo', 'Cashfree', 'BillDesk', 'HDFC Payment Gateway', 'SBI ePay', 'Other'];
const FEE_BANKS = ['All Banks', 'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Kotak Mahindra Bank'];
const FEE_CHEQUE_STATUS = ['All', 'Cleared', 'Bounced', 'Pending Clearance', 'Post-Dated', 'Cancelled'];
const FEE_POST_DATED = ['All', 'Post-Dated Cheque', 'Regular Cheque'];
const FEE_RECEIPT_STATUS = ['All', 'Active', 'Cancelled', 'Reversed', 'Duplicate Issued'];
const FEE_RECEIPT_ISSUED = ['All', 'Receipt Issued', 'No Receipt Yet'];
const FEE_RECEIPT_TYPE = ['All', 'Original Receipt', 'Duplicate Receipt', 'Provisional Receipt'];
const FEE_COLLECTORS = ['All Staff', 'Mr. Rajesh Kumar', 'Ms. Priya Singh', 'Branch Cashier — North', 'Online Gateway', 'System Auto-Generated'];
const FEE_COUNTERS = ['All Counters', 'Main Counter', 'Online Self-Service', 'Branch Office', 'Mobile Collection'];
const FEE_SCHOOL_BANK_ACCOUNTS = ['All Accounts', 'SBI — Current A/c XXXX4521', 'HDFC — Operational A/c XXXX9912', 'ICICI — Fee Collection A/c XXXX8841'];
const FEE_NACH = ['All', 'NACH Mandate Active', 'No NACH', 'NACH Cancelled'];
const FEE_REFUND_STATUSES = ['No Refund', 'Refund Requested', 'Refund Pending Approval', 'Refund Approved', 'Refund Processed', 'Refund Rejected', 'Refund Cancelled'];
const FEE_REFUND_TYPES = [
  'TC / Withdrawal Refund', 'Duplicate Payment Refund', 'Overpayment Refund', 'Advance Cancellation',
  'Scholarship Adjustment', 'Cancelled Admission', 'Activity Cancellation', 'Hostel Early Vacate',
  'Transport Opt-Out', 'Caution Deposit Return', 'Online Payment Failure', 'Fee Revision Refund',
  'School Closure Refund', 'Event Cancellation', 'Medical Refund'
];
const FEE_REFUND_INITIATORS = ['All', 'Parent Request', 'Admin Initiated', 'System Auto-Generated'];
const FEE_REFUND_MODES = ['All', 'Cash', 'Bank Transfer (NEFT)', 'Cheque', 'UPI', 'Fee Account Adjustment / Credit Note', 'DD'];
const FEE_REFUND_STAFF = ['All Staff', 'Accounts Officer', 'Finance Manager', 'Principal', 'Branch Cashier — North'];
const FEE_APPROVERS = ['All Approvers', 'Principal — Mr. A. Sharma', 'Finance Head — Ms. R. Patel', 'Management Trustee', 'Accounts Officer'];
const FEE_PENDING_REFUND_DAYS = ['All', '0-7 Days', '8-15 Days', '16-30 Days', 'More than 30 Days'];
const FEE_CAUTION_DEPOSIT = ['All', 'Caution Deposit Refunded', 'Caution Deposit Held'];
const FEE_HAS_FINE = ['All', 'Has Fine', 'No Fine'];
const FEE_FINE_TYPES = ['Late Payment Fine', 'Library Fine', 'Bus Discipline Fine', 'Property Damage Fine', 'Exam Late Registration Fine', 'Cheque Bounce Charge', 'NACH Return Charge', 'ID Card Loss Fine', 'Uniform Violation Fine', 'Other Fine'];
const FEE_FINE_STATUS = ['All', 'Pending', 'Paid', 'Waived', 'Partially Paid'];
const FEE_FINE_DAYS = ['All', '1-7', '8-15', '16-30', '31-60', '61-90', '90+'];
const FEE_FINE_WAIVED = ['All', 'Waived', 'Not Waived'];
const FEE_WAIVER_REASONS = ['Financial Hardship', 'Medical Grounds', 'Late Arrival of Government Grant', 'Management Discretion', 'Good Academic Record', 'Sibling Consideration', 'One-Time Exception'];
const FEE_HOSTEL_BLOCKS = ['All Blocks', 'Block A — Boys', 'Block B — Boys', 'Block C — Girls', 'Block D — Girls'];
const FEE_ROOM_TYPES = ['All', 'Single', 'Double Sharing', 'Triple Sharing', 'Dormitory', 'AC Room', 'Non-AC Room'];
const FEE_MEAL_PLANS = ['All', 'Full Board (All Meals)', 'Day Meals Only', 'Partial Meals', 'No Meals'];
const FEE_HOSTEL_FEE_CATEGORIES = ['Hostel Room Rent', 'Mess Fee', 'Electricity Charges', 'Laundry Fee', 'Caution Deposit', 'Joining Fee'];
const FEE_PAID_STATUS = ['All', 'Paid', 'Partially Paid', 'Not Paid', 'Overdue'];
const FEE_PAID_STATUS_PH = ['Paid', 'Partially Paid', 'Not Paid', 'Overdue'];
const FEE_BUS_ROUTES = ['All Routes', 'Route 1 — Satellite', 'Route 2 — Bopal', 'Route 3 — Maninagar', 'Route 4 — Vastrapur', 'Route 5 — Chandkheda'];
const FEE_BUS_STOPS = ['All Stops', 'Shivranjani', 'Bopal Cross Roads', 'Maninagar Station', 'Vastrapur Lake', 'Chandkheda Circle'];
const FEE_DISTANCE_SLABS = ['All Slabs', '0-5 KM', '5-10 KM', '10-15 KM', '15-20 KM', '20+ KM'];
const FEE_VEHICLES = ['All Vehicles', 'GJ-01-AB-1234', 'GJ-01-CD-5678', 'GJ-01-EF-9012', 'GJ-01-GH-3456'];
const FEE_DRIVERS = ['All Drivers', 'Ramesh Bhai', 'Suresh Bhai', 'Mahesh Bhai', 'Vijay Bhai'];
const FEE_TRANSPORT_CATEGORIES = ['All', 'Full Route', 'Half Route', 'Monthly Pass', 'Daily Pass', 'Annual Transport Fee'];
const FEE_POSTED_TO_LEDGER = ['All', 'Posted', 'Not Yet Posted', 'Posting Error'];
const FEE_FEE_INCOME_ACCOUNTS = ['4001 — Tuition Fee Income', '4002 — Admission Fee Income', '4003 — Transport Fee Income', '4004 — Hostel Fee Income', '4005 — Exam Fee Income', '4006 — Fine & Penalty Income'];
const FEE_ADVANCE_LIABILITY = ['All', '2101 — Advance Fee Liability', '2102 — Unearned Transport Fee', '2103 — Caution Deposit Liability'];
const FEE_RECONCILED_BANK = ['All', 'Reconciled', 'Unreconciled', 'Reconciliation Pending'];
const FEE_COST_CENTERS = ['All', 'Main Campus Operations', 'Hostel Operations', 'Transport Operations', 'Academics', 'Administration'];
const FEE_BUDGET_HEADS = ['All', 'Tuition Fee Budget', 'Transport Fee Budget', 'Hostel Fee Budget', 'Exam Fee Budget'];
const FEE_UNEARNED_INCOME = ['All', 'Advance Fee (Unearned)', 'Current Period Fee (Earned)'];
const FEE_DELIVERY_MODES = ['Email', 'SMS', 'WhatsApp', 'App Push Notification', 'Physical Printout'];
const FEE_REMINDER_SENT = ['All', 'Yes — Reminder Sent', 'No Reminder'];
const FEE_REMINDER_COUNT = ['All', '0', '1', '2', '3+'];
const FEE_DEMAND_NOTICE = ['All', '1st Notice', '2nd Notice', 'Final Notice', 'Legal Notice', 'No Notice'];
const FEE_LANGUAGES = ['All', 'English', 'Hindi', 'Regional Language'];
const FEE_PORTAL_ACCESS = ['All', 'Parent Has Portal Access', 'No Portal Access'];
const FEE_RECEIPT_EMAILED = ['All', 'Receipt Emailed', 'Receipt Not Emailed'];
const FEE_AUTO_REMINDER = ['All', 'Auto-Reminder Active', 'No Auto-Reminder'];
const FEE_COMMITTEE = ['All', 'Committee Approved', 'Pending Approval'];
const FEE_REGULATION_ACT = ['All', 'Compliant', 'Non-Compliant', 'Not Verified'];
const FEE_RTE_COMPLIANCE = ['All', 'RTE Compliant', 'RTE Non-Compliant'];
const FEE_CBSE_CIRCULAR = ['All', 'Compliant', 'Non-Compliant'];
const FEE_CAPITATION = ['All', 'No Capitation Fee', 'Possible Capitation (Flag)'];
const FEE_NOTIFIED = ['All', 'Officially Notified', 'Not Notified'];
const FEE_BOARD_AFFILIATION = ['All', 'CBSE Compliant', 'State Board Compliant'];
const FEE_CREATED_BY = ['All Staff', 'Accounts Officer', 'Fee Counter Cashier', 'Finance Manager', 'System Auto-Generated', 'Bulk Import'];
const FEE_MODIFIED_BY = ['All Staff', 'Accounts Officer', 'Finance Manager', 'System Auto-Generated'];
const FEE_DATA_SOURCES = ['All', 'Manual', 'Auto-Generated', 'Bulk Import', 'System'];
const FEE_RECEIPT_BOOKS = ['All Books', 'RB-2025-A', 'RB-2025-B', 'RB-2025-C', 'Digital Receipts'];
const FEE_CANCELLED_RECEIPT = ['All', 'Active', 'Cancelled Only'];
const FEE_DUPLICATE_RECEIPT = ['All', 'Duplicate Issued', 'Original Only'];
const FEE_AUDIT_FLAG = ['All', 'Flagged for Review', 'Clean Records'];
const FEE_SYSTEM_VS_MANUAL = ['All', 'System Auto-Generated', 'Manually Entered'];

const FEE_FILTER_GROUPS: FeeFilterGroup[] = [
  {
    id: 'fg1',
    title: '🗓️ Group 1 : Date & Period Filters',
    filters: [
      feeSel('financialYear', 'Financial Year', FEE_FY),
      feeSel('academicYear', 'Academic Year', FEE_AY),
      feeMulti('month', 'Month', FEE_MONTHS),
      feeSel('quarter', 'Quarter', ['All Quarters', 'Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)']),
      feeMulti('termInstallment', 'Term / Installment', FEE_TERMS_INSTALLMENTS),
      feeDt('feeInvoiceDateFrom', 'Fee Invoice Date From', 'When the fee invoice was generated'),
      feeDt('feeInvoiceDateTo', 'Fee Invoice Date To', 'End of invoice date range'),
      feeDt('feeDueDateFrom', 'Fee Due Date From', 'Start of payment due date range'),
      feeDt('feeDueDateTo', 'Fee Due Date To', 'End of payment due date range'),
      feeDt('feePaymentDateFrom', 'Fee Payment Date From', 'When fee was actually paid'),
      feeDt('feePaymentDateTo', 'Fee Payment Date To', 'End of payment date range'),
      feeDt('feeReceiptDateFrom', 'Fee Receipt Date From', 'When the receipt was issued'),
      feeDt('feeReceiptDateTo', 'Fee Receipt Date To', 'End of receipt date range'),
      feeDt('feeStructureEffectiveFrom', 'Fee Structure Effective From', 'When the fee structure became effective'),
      feeDt('feeStructureEffectiveTo', 'Fee Structure Effective To', 'When the fee structure expired'),
      feeDt('feeRevisionDate', 'Fee Revision Date', 'When fee was revised / updated'),
      feeDt('academicSessionStart', 'Academic Session Start', 'Start of academic session'),
      feeDt('academicSessionEnd', 'Academic Session End', 'End of academic session'),
      feeDt('lastPaymentDateFrom', 'Last Payment Date From', 'Filter by last payment date'),
      feeDt('lastPaymentDateTo', 'Last Payment Date To', 'End of last payment date range'),
      feeDtr('feePostingDateRange', 'Fee Posting Date Range', 'When fee was posted to General Ledger')
    ]
  },
  {
    id: 'fg2',
    title: '💰 Group 2 : Fee Head & Structure Filters',
    filters: [
      feeMulti('feeHead', 'Fee Head / Fee Type', FEE_HEADS),
      feeSel('feeStructureName', 'Fee Structure Name', FEE_STRUCTURES),
      feeSel('feeStructureType', 'Fee Structure Type', FEE_STRUCTURE_TYPES),
      feeSel('feeGroup', 'Fee Group', FEE_GROUPS),
      feeSel('feeSubGroup', 'Fee Sub-Group', FEE_SUBGROUPS),
      feeTxt('feeHeadCode', 'Fee Head Code', 'e.g. FH-TUI'),
      feeSel('feeHeadStatus', 'Fee Head Status', FEE_HEAD_STATUS),
      feeSel('mandatoryOptional', 'Mandatory / Optional Fee', FEE_MANDATORY),
      feeSel('recurringOneTime', 'Recurring / One-Time', FEE_RECURRING),
      feeSel('feeFrequency', 'Fee Frequency', FEE_FREQUENCY),
      feeSel('feeApplicableFor', 'Fee Applicable For', FEE_APPLICABLE_FOR),
      feeSel('gstApplicable', 'GST Applicable', FEE_GST_APPLICABLE),
      feeSel('gstRate', 'GST Rate', FEE_GST_RATES),
      feeMulti('glAccountHead', 'Fee Account Head (GL)', FEE_GL_ACCOUNTS),
      feeSel('tdsOnFee', 'TDS on Fee', FEE_TDS),
      feeSel('feeRevisedThisYear', 'Fee Revised This Year', FEE_YESNO_REVISED),
      feeSel('revisionType', 'Revision Type', FEE_REVISION_TYPE),
      feeRng('revisionPct', 'Revision Percentage (Range)', 0, 100, '%')
    ]
  },
  {
    id: 'fg3',
    title: '🎓 Group 3 : Student Filters',
    filters: [
      feeTxt('studentName', 'Student Name', 'Full or partial name'),
      feeTxt('studentId', 'Student ID / Admission No.', 'Unique student ID'),
      feeMulti('className', 'Class', FEE_CLASSES),
      feeMulti('section', 'Section', FEE_SECTIONS),
      feeTxt('rollNo', 'Roll Number', 'Specific roll number or range'),
      feeSel('gender', 'Gender', FEE_GENDERS),
      feeDtr('dobRange', 'Date of Birth Range', 'Filter students by age'),
      feeMulti('category', 'Category / Caste', FEE_CATEGORIES),
      feeMulti('religion', 'Religion', FEE_RELIGIONS),
      feeSel('nationality', 'Nationality', FEE_NATIONALITIES),
      feeSel('studentType', 'Student Type', FEE_STUDENT_TYPES),
      feeSel('dayScholarBoarder', 'Day Scholar / Boarder', FEE_DAY_BOARDER),
      feeSel('transportUser', 'Transport User', FEE_TRANSPORT_USER),
      feeSel('hasSibling', 'Has Sibling in School', FEE_SIBLING),
      feeSel('isStaffWard', 'Is Staff Ward', FEE_STAFF_WARD),
      feeSel('isRteStudent', 'Is RTE Student', FEE_RTE),
      feeSel('isBplStudent', 'Is BPL Student', FEE_BPL),
      feeSel('isDifferentlyAbled', 'Is Differently-Abled', FEE_DIVYAANG),
      feeSel('scholarshipHolder', 'Scholarship Holder', FEE_SCHOLARSHIP_HOLDER),
      feeSel('scholarshipSchemeFilter', 'Scholarship Scheme', FEE_SCHOLARSHIP_SCHEMES),
      feeMulti('concessionTypeStudent', 'Concession Type', FEE_CONCESSION_TYPES),
      feeSel('studentStatus', 'Student Status', FEE_STUDENT_STATUS),
      feeDtr('admissionDateRange', 'Admission Date Range', 'When the student was admitted'),
      feeDtr('tcDateRange', 'TC Date Range', 'When the TC was issued')
    ]
  },
  {
    id: 'fg4',
    title: '🏫 Group 4 : Class & Academic Filters',
    filters: [
      feeMulti('board', 'Board', FEE_BOARDS),
      feeSel('branch', 'School / Branch', FEE_BRANCHES),
      feeSel('medium', 'Medium of Instruction', FEE_MEDIUMS),
      feeSel('academicGroup', 'Academic Group', FEE_ACADEMIC_GROUPS),
      feeSel('stream', 'Stream (For 11-12)', FEE_STREAMS),
      feeMulti('optionalSubjects', 'Optional Subjects', FEE_OPTIONAL_SUBJECTS),
      feeSel('classTeacher', 'Class Teacher', FEE_CLASS_TEACHERS),
      feeSel('house', 'House / Group', FEE_HOUSES),
      feeSel('department', 'Department', FEE_DEPARTMENTS)
    ]
  },
  {
    id: 'fg5',
    title: '📄 Group 5 : Fee Invoice Filters',
    filters: [
      feeTxt('invoiceNumber', 'Invoice Number', 'e.g. INV-2025-001'),
      feeMulti('invoiceStatus', 'Invoice Status', FEE_INVOICE_STATUSES),
      feeSel('invoiceGeneratedBy', 'Invoice Generated By', FEE_INVOICE_GENERATORS),
      feeSel('invoiceSentMode', 'Invoice Sent Mode', FEE_SENT_MODES),
      feeSel('invoiceAcknowledged', 'Invoice Acknowledged', FEE_ACK),
      feeSel('bulkInvoice', 'Bulk Invoice', FEE_BULK_INVOICE),
      feeSel('newAdmissionInvoice', 'Invoice for New Admission', FEE_NEW_ADMISSION_INVOICE),
      feeSel('proformaInvoice', 'Proforma Invoice', FEE_PROFORMA),
      feeSel('invoiceCancelled', 'Invoice Cancelled', FEE_CANCELLED_INVOICE),
      feeSel('invoiceRegenerated', 'Invoice Regenerated', FEE_REGENERATED),
      feeRng('invoiceAmountRange', 'Invoice Amount Range', 0, 9999999, '₹'),
      feeMulti('invoiceTerm', 'Invoice for Specific Term', FEE_INVOICE_TERMS),
      feeSel('invoiceWithLateFine', 'Invoice with Late Fine', FEE_WITH_LATE_FINE),
      feeSel('invoiceWithConcession', 'Invoice with Concession', FEE_WITH_CONCESSION)
    ]
  },
  {
    id: 'fg6',
    title: '💵 Group 6 : Fee Amount Filters',
    filters: [
      feeRng('annualFeeRange', 'Annual Fee Amount (Range)', 0, 9999999, '₹'),
      feeRng('termFeeRange', 'Term Fee Amount (Range)', 0, 9999999, '₹'),
      feeRng('monthlyFeeRange', 'Monthly Fee Amount (Range)', 0, 9999999, '₹'),
      feeRng('totalInvoicedRange', 'Total Fee Invoiced (Range)', 0, 9999999, '₹'),
      feeRng('totalCollectedRange', 'Total Fee Collected (Range)', 0, 9999999, '₹'),
      feeRng('totalOutstandingRange', 'Total Fee Outstanding (Range)', 0, 9999999, '₹'),
      feeRng('collectedThisMonthRange', 'Fee Collected This Month (Range)', 0, 9999999, '₹'),
      feeRng('collectedThisTermRange', 'Fee Collected This Term (Range)', 0, 9999999, '₹'),
      feeRng('collectedThisYearRange', 'Fee Collected This Year (Range)', 0, 9999999, '₹'),
      feeRng('discountConcessionRange', 'Discount / Concession Amount (Range)', 0, 9999999, '₹'),
      feeRng('scholarshipWaiverRange', 'Scholarship Waiver Amount (Range)', 0, 9999999, '₹'),
      feeRng('fineAmountRangeFees', 'Fine Amount (Range)', 0, 99999, '₹'),
      feeRng('netPayableRange', 'Net Payable Amount (Range)', 0, 9999999, '₹'),
      feeRng('advanceExcessRange', 'Advance / Excess Paid (Range)', 0, 9999999, '₹'),
      feeRng('refundAmountRangeFees', 'Refund Amount (Range)', 0, 9999999, '₹'),
      feeRng('writtenOffRange', 'Written Off Amount (Range)', 0, 9999999, '₹'),
      feeRng('gstAmountRange', 'GST Amount (Range)', 0, 9999999, '₹'),
      feeRng('paymentCompletionPct', 'Payment Completion % (Range)', 0, 100, '%'),
      feeSel('feePerHeadAverage', 'Fee Per Head (Average)', FEE_PER_HEAD_AVERAGE)
    ]
  },
  {
    id: 'fg7',
    title: '📊 Group 7 : Payment Status Filters',
    filters: [
      feeMulti('overallFeeStatus', 'Overall Fee Status', FEE_OVERALL_STATUS),
      feeSel('term1Status', 'Term 1 Payment Status', FEE_TERM_STATUS),
      feeSel('term2Status', 'Term 2 Payment Status', FEE_TERM_STATUS),
      feeSel('term3Status', 'Term 3 Payment Status', FEE_TERM_STATUS),
      feeSel('currentTermStatus', 'Current Term Status', FEE_PAID_STATUS_PH),
      feeSel('overdueStatus', 'Overdue Status', FEE_OVERDUE_STATUS),
      feeSel('overdueSinceDays', 'Overdue Since (Days)', FEE_OVERDUE_DAYS),
      feeSel('paidOnTime', 'Paid On Time', FEE_PAID_ON_TIME),
      feeSel('defaulterStatus', 'Defaulter Status', FEE_DEFAULTER_STATUS),
      feeMulti('installmentStatus', 'Installment Status', FEE_INSTALLMENT_STATUS),
      feeSel('advancePaymentStatus', 'Advance Payment Status', FEE_ADVANCE_STATUS),
      feeSel('partialPaymentCount', 'Partial Payment Count', FEE_PARTIAL_COUNT)
    ]
  },
  {
    id: 'fg8',
    title: '💳 Group 8 : Payment Mode & Receipt Filters',
    filters: [
      feeMulti('paymentMode', 'Payment Mode', FEE_PAYMENT_MODES),
      feeSel('paymentChannel', 'Payment Channel', FEE_PAYMENT_CHANNELS),
      feeSel('paymentGatewayUsed', 'Payment Gateway Used', FEE_GATEWAYS),
      feeSel('bankNameCheque', 'Bank Name (For Cheque/DD)', FEE_BANKS),
      feeTxt('chequeNumber', 'Cheque Number', 'Specific cheque number'),
      feeSel('chequeStatus', 'Cheque Status', FEE_CHEQUE_STATUS),
      feeSel('postDatedCheque', 'Post-Dated Cheque', FEE_POST_DATED),
      feeTxt('txnRefNo', 'Online Transaction Ref / UTR', 'NEFT / RTGS reference number'),
      feeTxt('receiptNumber', 'Receipt Number', 'ERP receipt number'),
      feeSel('receiptStatus', 'Receipt Status', FEE_RECEIPT_STATUS),
      feeSel('receiptIssued', 'Receipt Issued', FEE_RECEIPT_ISSUED),
      feeSel('receiptType', 'Receipt Type', FEE_RECEIPT_TYPE),
      feeSel('collectedBy', 'Collected By (Staff)', FEE_COLLECTORS),
      feeSel('collectionCounter', 'Collection Counter / Desk', FEE_COUNTERS),
      feeSel('bankAccountCredited', 'Bank Account Credited (School)', FEE_SCHOOL_BANK_ACCOUNTS),
      feeSel('nachMandate', 'Auto-Debit NACH Mandate', FEE_NACH)
    ]
  },
  {
    id: 'fg9',
    title: '🎁 Group 9 : Concession, Discount & Waiver Filters',
    filters: [
      feeSel('hasConcession', 'Has Concession', ['All', 'Yes — Has Concession', 'No Concession']),
      feeMulti('concessionType', 'Concession Type', FEE_CONCESSION_TYPES_FULL),
      feeRng('concessionPct', 'Concession Percentage Range', 0, 100, '%'),
      feeRng('concessionAmountRange', 'Concession Amount Range', 0, 9999999, '₹'),
      feeSel('concessionStatus', 'Concession Status', ['All', 'Active', 'Expired', 'Cancelled', 'Pending Approval']),
      feeSel('concessionApprovedBy', 'Concession Approved By', FEE_APPROVERS),
      feeMulti('concessionAppliedTo', 'Concession Applied To', FEE_HEADS),
      feeSel('scholarshipLinked', 'Scholarship Linked', ['All', 'Scholarship Concession Applied', 'No Scholarship']),
      feeSel('scholarshipSchemeConcession', 'Scholarship Scheme', FEE_SCHOLARSHIP_SCHEMES),
      feeSel('feeFullyWaived', 'Fee Fully Waived (100%)', ['All', 'Fully Waived', 'Partially Waived', 'No Waiver']),
      feeMulti('waiverReason', 'Waiver Reason', FEE_WAIVER_REASONS),
      feeSel('earlyPaymentDiscount', 'Early Payment Discount Applied', ['All', 'Yes', 'No'])
    ]
  },
  {
    id: 'fg10',
    title: '🔄 Group 10 : Refund Filters',
    filters: [
      feeMulti('refundStatus', 'Refund Status', FEE_REFUND_STATUSES),
      feeMulti('refundType', 'Refund Type', FEE_REFUND_TYPES),
      feeRng('refundAmountRange', 'Refund Amount Range', 0, 9999999, '₹'),
      feeSel('refundInitiatedBy', 'Refund Initiated By', FEE_REFUND_INITIATORS),
      feeDtr('refundDateRange', 'Refund Date Range', 'When the refund was processed'),
      feeSel('refundMode', 'Refund Mode', FEE_REFUND_MODES),
      feeSel('refundProcessedBy', 'Refund Processed By', FEE_REFUND_STAFF),
      feeSel('refundApprovedBy', 'Refund Approved By', FEE_APPROVERS),
      feeSel('pendingRefundDays', 'Pending Refund (Days)', FEE_PENDING_REFUND_DAYS),
      feeSel('cautionDepositRefund', 'Caution Deposit Refund', FEE_CAUTION_DEPOSIT)
    ]
  },
  {
    id: 'fg11',
    title: '💸 Group 11 : Fine & Late Fee Filters',
    filters: [
      feeSel('fineApplied', 'Fine Applied', FEE_HAS_FINE),
      feeMulti('fineType', 'Fine Type', FEE_FINE_TYPES),
      feeRng('fineAmountRange', 'Fine Amount Range', 0, 9999, '₹'),
      feeSel('fineStatus', 'Fine Status', FEE_FINE_STATUS),
      feeSel('daysOverdueFine', 'Days Overdue (for Late Fine)', FEE_FINE_DAYS),
      feeSel('fineWaivedFilter', 'Fine Waived', FEE_FINE_WAIVED),
      feeSel('fineWaivedBy', 'Fine Waived By', FEE_APPROVERS),
      feeMulti('fineWaiverReason', 'Fine Waiver Reason', FEE_WAIVER_REASONS),
      feeRng('accumulatedFineRange', 'Accumulated Fine Amount', 0, 99999, '₹')
    ]
  },
  {
    id: 'fg12',
    title: '🏠 Group 12 : Hostel Fee Specific Filters',
    filters: [
      feeMulti('hostelBlock', 'Hostel Block', FEE_HOSTEL_BLOCKS),
      feeSel('roomType', 'Room Type', FEE_ROOM_TYPES),
      feeTxt('roomNumber', 'Room Number', 'Specific room'),
      feeSel('hostelMealPlan', 'Hostel Meal Plan', FEE_MEAL_PLANS),
      feeSel('hostelJoiningMonth', 'Hostel Joining Month', ['All', ...FEE_MONTHS]),
      feeSel('hostelVacatingMonth', 'Hostel Vacating Month', ['All', ...FEE_MONTHS]),
      feeSel('proratedHostelFee', 'Prorated Hostel Fee', ['All', 'Full Year', 'Prorated (Partial Year)']),
      feeMulti('hostelFeeCategory', 'Hostel Fee Category', FEE_HOSTEL_FEE_CATEGORIES),
      feeSel('hostelFeeStatus', 'Hostel Fee Status', FEE_PAID_STATUS_PH)
    ]
  },
  {
    id: 'fg13',
    title: '🚌 Group 13 : Transport Fee Specific Filters',
    filters: [
      feeMulti('busRoute', 'Bus Route', FEE_BUS_ROUTES),
      feeSel('busStop', 'Bus Stop Name', FEE_BUS_STOPS),
      feeSel('distanceSlab', 'Distance Slab', FEE_DISTANCE_SLABS),
      feeSel('vehicleNumber', 'Vehicle Number', FEE_VEHICLES),
      feeSel('driverAssigned', 'Driver Assigned', FEE_DRIVERS),
      feeSel('transportFeeCategory', 'Transport Fee Category', FEE_TRANSPORT_CATEGORIES),
      feeDtr('transportOptInDate', 'Transport Opt-In Date', 'When the student started using transport'),
      feeDtr('transportOptOutDate', 'Transport Opt-Out Date', 'When the student stopped using transport'),
      feeSel('transportFeeStatus', 'Transport Fee Status', FEE_PAID_STATUS_PH)
    ]
  },
  {
    id: 'fg14',
    title: '📋 Group 14 : Fee Allocation & Accounting Filters',
    filters: [
      feeSel('glIncomeAccount', 'Fee Allocated to GL Account', ['All Accounts', ...FEE_GL_ACCOUNTS]),
      feeSel('postedToLedger', 'Fee Posted to Ledger', FEE_POSTED_TO_LEDGER),
      feeTxt('journalEntryNo', 'Journal Entry No.', 'Specific GL journal entry reference'),
      feeDtr('journalEntryDateRange', 'Journal Entry Date Range', 'When the journal entry was posted'),
      feeMulti('feeIncomeAccount', 'Fee Income Account', FEE_FEE_INCOME_ACCOUNTS),
      feeSel('bankAccountMapped', 'Bank Account Mapped', FEE_SCHOOL_BANK_ACCOUNTS),
      feeSel('advanceFeeLiabilityAccount', 'Advance Fee Liability Account', FEE_ADVANCE_LIABILITY),
      feeSel('feeReconciledBank', 'Fee Reconciled with Bank', FEE_RECONCILED_BANK),
      feeSel('costCenter', 'Cost Center / Department', FEE_COST_CENTERS),
      feeSel('budgetHead', 'Fee Budget Head', FEE_BUDGET_HEADS),
      feeSel('unearnedIncome', 'Unearned Income', FEE_UNEARNED_INCOME)
    ]
  },
  {
    id: 'fg15',
    title: '📱 Group 15 : Communication & Notification Filters',
    filters: [
      feeSel('invoiceSentToParent', 'Fee Invoice Sent to Parent', ['All', 'Sent', 'Not Sent']),
      feeMulti('invoiceDeliveryMode', 'Invoice Delivery Mode', FEE_DELIVERY_MODES),
      feeSel('invoiceAckParent', 'Invoice Acknowledged by Parent', ['All', 'Acknowledged', 'Not Acknowledged']),
      feeSel('feeReminderSent', 'Fee Reminder Sent', FEE_REMINDER_SENT),
      feeSel('remindersCount', 'Number of Reminders Sent', FEE_REMINDER_COUNT),
      feeDtr('lastReminderDateRange', 'Last Reminder Date Range', 'When the last reminder was sent'),
      feeSel('demandNoticeIssued', 'Demand Notice Issued', FEE_DEMAND_NOTICE),
      feeSel('parentLanguage', 'Parent Communication Language', FEE_LANGUAGES),
      feeSel('parentPortalAccess', 'Parent Portal Access', FEE_PORTAL_ACCESS),
      feeSel('feeReceiptEmailed', 'Fee Receipt Emailed', FEE_RECEIPT_EMAILED),
      feeSel('autoReminderEnabled', 'Auto-Reminder Enabled', FEE_AUTO_REMINDER)
    ]
  },
  {
    id: 'fg16',
    title: '🔐 Group 16 : Compliance & Regulatory Filters',
    filters: [
      feeSel('feeCommitteeApproved', 'Fee Approved by Fee Committee', FEE_COMMITTEE),
      feeSel('feeRegulationAct', 'As Per Fee Regulation Act', FEE_REGULATION_ACT),
      feeSel('rteCompliance', 'RTE Compliance', FEE_RTE_COMPLIANCE),
      feeSel('cbseCircularCompliant', 'CBSE Fee Circular Compliant', FEE_CBSE_CIRCULAR),
      feeSel('capitationFeeCheck', 'Capitation Fee Check', FEE_CAPITATION),
      feeRng('feeHikePct', 'Fee Hike % (Range)', 0, 50, '%'),
      feeRng('exceedsPrevYearPct', 'Exceeds Previous Year by %', 0, 100, '%'),
      feeSel('feeNotifiedToParents', 'Fee Notified to Parents', FEE_NOTIFIED),
      feeSel('boardAffiliationCompliance', 'Board Affiliation Compliance', FEE_BOARD_AFFILIATION)
    ]
  },
  {
    id: 'fg17',
    title: '🔍 Group 17 : Audit & System Filters',
    filters: [
      feeSel('createdBy', 'Created By', FEE_CREATED_BY),
      feeSel('modifiedBy', 'Modified By', FEE_MODIFIED_BY),
      feeDtr('modifiedDateRange', 'Modified Date Range', 'When the record was last changed'),
      feeSel('approvedByConcession', 'Approved By (Concession)', FEE_APPROVERS),
      feeSel('dataEntrySource', 'Data Entry Source', FEE_DATA_SOURCES),
      feeSel('receiptBookNumber', 'Receipt Book Number', FEE_RECEIPT_BOOKS),
      feeRng('receiptSerialRange', 'Receipt Serial Number Range', 0, 999999, ''),
      feeSel('cancelledReceipt', 'Cancelled Receipt', FEE_CANCELLED_RECEIPT),
      feeSel('duplicateReceiptIssued', 'Duplicate Receipt Issued', FEE_DUPLICATE_RECEIPT),
      feeSel('feeModuleAuditFlag', 'Fee Module Audit Flag', FEE_AUDIT_FLAG),
      feeSel('systemVsManual', 'System Generated vs Manual', FEE_SYSTEM_VS_MANUAL),
      feeDtr('lastSyncDateRange', 'Last Sync Date', 'Last date when data was synced')
    ]
  }
];

const TOTAL_FEE_FILTERS = FEE_FILTER_GROUPS.reduce((s, g) => s + g.filters.length, 0);

const FEE_FILTER_KIND: Record<string, FeeFilterKind> = {};
FEE_FILTER_GROUPS.forEach((g) => g.filters.forEach((f) => (FEE_FILTER_KIND[f.id] = f.kind)));

const isBlankFeeValue = (v: any): boolean => {
  if (v === undefined || v === null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') {
    const { min, max } = v as { min?: string; max?: string };
    return (min === undefined || min === '') && (max === undefined || max === '');
  }
  return false;
};

// ============================================================================
// FEES REPORT DATA + FILTER ENGINE (client-side mock ledger, one row per student-fee account)
// ============================================================================
interface FeeRow {
  id: string;
  studentName: string;
  studentId: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNo: string;
  gender: string;
  dob: string;
  category: string;
  religion: string;
  nationality: string;
  studentType: string;
  dayScholarBoarder: string;
  transportUser: string;
  hasSibling: string;
  isStaffWard: string;
  isRteStudent: string;
  isBplStudent: string;
  isDifferentlyAbled: string;
  scholarshipHolder: string;
  scholarshipScheme: string;
  concessionType: string;
  studentStatus: string;
  admissionDate: string;
  tcDate: string;
  yearOfStudy: string;
  board: string;
  branch: string;
  medium: string;
  academicGroup: string;
  stream: string;
  optionalSubjects: string[];
  classTeacher: string;
  house: string;
  department: string;
  feeHead: string;
  feeHeads: string[];
  feeStructureName: string;
  feeStructureType: string;
  feeGroup: string;
  feeSubGroup: string;
  feeHeadCode: string;
  feeHeadStatus: string;
  mandatoryOptional: string;
  recurringOneTime: string;
  feeFrequency: string;
  feeApplicableFor: string;
  gstApplicable: string;
  gstRate: number;
  glAccountHead: string;
  tdsOnFee: string;
  feeRevisedThisYear: string;
  revisionType: string;
  revisionPct: number;
  invoiceNo: string;
  invoiceDate: string;
  invoiceStatus: string;
  invoiceGeneratedBy: string;
  invoiceSentMode: string;
  invoiceAcknowledged: string;
  bulkInvoice: string;
  newAdmissionInvoice: string;
  proformaInvoice: string;
  invoiceCancelled: string;
  invoiceRegenerated: string;
  invoiceTerm: string[];
  invoiceWithLateFine: string;
  invoiceWithConcession: string;
  invoiceAmount: number;
  feeDueDate: string;
  feePaymentDate: string;
  receiptDate: string;
  feeStructureEffectiveFrom: string;
  feeStructureEffectiveTo: string;
  feeRevisionDate: string;
  academicSessionStart: string;
  academicSessionEnd: string;
  lastPaymentDate: string;
  feePostingDate: string;
  annualFee: number;
  termFee: number;
  monthlyFee: number;
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  collectedThisMonth: number;
  collectedThisTerm: number;
  collectedThisYear: number;
  discountAmount: number;
  scholarshipWaiver: number;
  fineAmount: number;
  netPayable: number;
  advanceAmount: number;
  refundAmount: number;
  writtenOffAmount: number;
  gstAmount: number;
  paymentCompletionPct: number;
  feePerHeadBand: string;
  overallFeeStatus: string;
  term1Status: string;
  term2Status: string;
  term3Status: string;
  currentTermStatus: string;
  overdueStatus: string;
  overdueDaysBand: string;
  overdueByDays: number;
  paidOnTime: string;
  defaulterStatus: string;
  installmentStatus: string[];
  advancePaymentStatus: string;
  partialPaymentCountBand: string;
  paymentMode: string;
  paymentChannel: string;
  paymentGatewayUsed: string;
  bankNameCheque: string;
  chequeNumber: string;
  chequeStatus: string;
  postDatedCheque: string;
  txnRefNo: string;
  receiptNo: string;
  receiptStatus: string;
  receiptIssued: string;
  receiptType: string;
  collectedBy: string;
  collectionCounter: string;
  bankAccountCredited: string;
  nachMandate: string;
  hasConcession: string;
  concessionPct: number;
  concessionAmount: number;
  concessionStatus: string;
  concessionApprovedBy: string;
  concessionAppliedTo: string[];
  scholarshipLinked: string;
  feeFullyWaived: string;
  waiverReason: string[];
  waiverPeriod: string;
  earlyPaymentDiscount: string;
  refundStatus: string;
  refundTypes: string[];
  refundInitiatedBy: string;
  refundDate: string;
  refundMode: string;
  refundProcessedBy: string;
  refundApprovedBy: string;
  pendingRefundDaysBand: string;
  cautionDepositRefund: string;
  fineApplied: string;
  fineTypes: string[];
  fineStatus: string;
  daysOverdueFineBand: string;
  fineWaived: string;
  fineWaivedBy: string;
  fineWaiverReason: string[];
  accumulatedFine: number;
  hostelBlock: string;
  roomType: string;
  roomNumber: string;
  hostelMealPlan: string;
  hostelJoiningMonth: string;
  hostelVacatingMonth: string;
  proratedHostelFee: string;
  hostelFeeCategories: string[];
  hostelFeeStatus: string;
  busRoute: string;
  busStop: string;
  distanceSlab: string;
  vehicleNumber: string;
  driverAssigned: string;
  transportFeeCategory: string;
  transportOptInDate: string;
  transportOptOutDate: string;
  transportFeeStatus: string;
  glIncomeAccount: string;
  postedToLedger: string;
  journalEntryNo: string;
  journalEntryDate: string;
  feeIncomeAccount: string;
  bankAccountMapped: string;
  advanceFeeLiabilityAccount: string;
  feeReconciledBank: string;
  costCenter: string;
  budgetHead: string;
  unearnedIncome: string;
  invoiceSentToParent: string;
  invoiceDeliveryModes: string[];
  invoiceAckParent: string;
  feeReminderSent: string;
  remindersCountBand: string;
  lastReminderDate: string;
  demandNoticeIssued: string;
  parentLanguage: string;
  parentPortalAccess: string;
  feeReceiptEmailed: string;
  autoReminderEnabled: string;
  feeCommitteeApproved: string;
  feeRegulationAct: string;
  rteCompliance: string;
  cbseCircularCompliant: string;
  capitationFeeCheck: string;
  feeHikePct: number;
  exceedsPrevYearPct: number;
  feeNotifiedToParents: string;
  boardAffiliationCompliance: string;
  trustApprovedFee: string;
  createdBy: string;
  modifiedBy: string;
  modifiedDate: string;
  approvedByConcession: string;
  dataEntrySource: string;
  receiptBookNumber: string;
  receiptSerial: number;
  cancelledReceipt: string;
  duplicateReceiptIssued: string;
  feeModuleAuditFlag: string;
  systemVsManual: string;
  lastSyncDate: string;
}

type FeeRowInput = Partial<FeeRow> & Pick<FeeRow, 'id' | 'studentName' | 'studentId' | 'className' | 'section'>;

/** Builds a complete fee row; anything not given falls back to a neutral default. */
const feeRow = (input: FeeRowInput): FeeRow => ({
  admissionNo: input.studentId,
  rollNo: '01',
  gender: 'Male',
  dob: '2012-06-15',
  category: 'General',
  religion: 'Hindu',
  nationality: 'Indian',
  studentType: 'Regular',
  dayScholarBoarder: 'Day Scholar',
  transportUser: 'Does Not Use Bus',
  hasSibling: 'No',
  isStaffWard: 'Non-Staff Ward',
  isRteStudent: 'Non-RTE',
  isBplStudent: 'Non-BPL',
  isDifferentlyAbled: 'No',
  scholarshipHolder: 'No Scholarship',
  scholarshipScheme: 'All Schemes',
  concessionType: '—',
  studentStatus: 'Active',
  admissionDate: '2021-04-05',
  tcDate: '',
  yearOfStudy: '1st Year',
  board: 'CBSE',
  branch: 'Main Campus',
  medium: 'English Medium',
  academicGroup: 'Middle School (6-8)',
  stream: 'All',
  optionalSubjects: [],
  classTeacher: 'Mrs. Patel (Class 5A)',
  house: 'Red House',
  department: 'Academic',
  feeHead: 'Tuition Fee',
  feeHeads: ['Tuition Fee'],
  feeStructureName: 'Day Scholar Structure',
  feeStructureType: 'Standard',
  feeGroup: 'Academic Fees',
  feeSubGroup: 'Core Academic',
  feeHeadCode: 'FH-TUI',
  feeHeadStatus: 'Active',
  mandatoryOptional: 'Mandatory Fee',
  recurringOneTime: 'Recurring',
  feeFrequency: 'Quarterly',
  feeApplicableFor: 'All Students',
  gstApplicable: 'GST Exempt',
  gstRate: 0,
  glAccountHead: '4001 — Tuition Fee Income',
  tdsOnFee: 'TDS Not Applicable',
  feeRevisedThisYear: 'No — Same as Last Year',
  revisionType: 'No Change',
  revisionPct: 0,
  invoiceNo: 'INV-2025-000',
  invoiceDate: '2025-04-05',
  invoiceStatus: 'Sent to Parent',
  invoiceGeneratedBy: 'Accounts Officer',
  invoiceSentMode: 'Email',
  invoiceAcknowledged: 'Acknowledged by Parent',
  bulkInvoice: 'Bulk Generated',
  newAdmissionInvoice: 'Regular Invoice',
  proformaInvoice: 'Tax Invoice Only',
  invoiceCancelled: 'Active Invoices',
  invoiceRegenerated: 'Original',
  invoiceTerm: ['Term 1 Invoice'],
  invoiceWithLateFine: 'No Late Fine',
  invoiceWithConcession: 'No Concession',
  invoiceAmount: 25000,
  feeDueDate: '2025-04-20',
  feePaymentDate: '2025-04-18',
  receiptDate: '2025-04-18',
  feeStructureEffectiveFrom: '2025-04-01',
  feeStructureEffectiveTo: '2026-03-31',
  feeRevisionDate: '2025-04-01',
  academicSessionStart: '2025-04-01',
  academicSessionEnd: '2026-03-31',
  lastPaymentDate: '2025-04-18',
  feePostingDate: '2025-04-19',
  annualFee: 100000,
  termFee: 25000,
  monthlyFee: 8400,
  totalInvoiced: 100000,
  totalCollected: 100000,
  totalOutstanding: 0,
  collectedThisMonth: 0,
  collectedThisTerm: 25000,
  collectedThisYear: 100000,
  discountAmount: 0,
  scholarshipWaiver: 0,
  fineAmount: 0,
  netPayable: 100000,
  advanceAmount: 0,
  refundAmount: 0,
  writtenOffAmount: 0,
  gstAmount: 0,
  paymentCompletionPct: 100,
  feePerHeadBand: '₹10,001-₹25,000',
  overallFeeStatus: 'Fully Paid',
  term1Status: 'Paid',
  term2Status: 'Paid',
  term3Status: 'Paid',
  currentTermStatus: 'Paid',
  overdueStatus: 'Not Overdue',
  overdueDaysBand: '0-7 Days',
  overdueByDays: 0,
  paidOnTime: 'Always On Time',
  defaulterStatus: 'All',
  installmentStatus: ['All Installments Paid'],
  advancePaymentStatus: 'No Advance',
  partialPaymentCountBand: '0 Partial Payments',
  paymentMode: 'UPI — Google Pay',
  paymentChannel: 'School Online Portal',
  paymentGatewayUsed: 'Razorpay',
  bankNameCheque: 'All Banks',
  chequeNumber: '',
  chequeStatus: 'All',
  postDatedCheque: 'Regular Cheque',
  txnRefNo: 'UPI2025041800',
  receiptNo: 'FR-2025-0001',
  receiptStatus: 'Active',
  receiptIssued: 'Receipt Issued',
  receiptType: 'Original Receipt',
  collectedBy: 'Ms. Priya Singh',
  collectionCounter: 'Online Self-Service',
  bankAccountCredited: 'ICICI — Fee Collection A/c XXXX8841',
  nachMandate: 'No NACH',
  hasConcession: 'No Concession',
  concessionPct: 0,
  concessionAmount: 0,
  concessionStatus: 'Active',
  concessionApprovedBy: 'All Approvers',
  concessionAppliedTo: [],
  scholarshipLinked: 'No Scholarship',
  feeFullyWaived: 'No Waiver',
  waiverReason: [],
  waiverPeriod: 'Full Year',
  earlyPaymentDiscount: 'No',
  refundStatus: 'No Refund',
  refundTypes: [],
  refundInitiatedBy: 'Parent Request',
  refundDate: '',
  refundMode: 'All',
  refundProcessedBy: 'Accounts Officer',
  refundApprovedBy: 'Finance Head — Ms. R. Patel',
  pendingRefundDaysBand: '0-7 Days',
  cautionDepositRefund: 'Caution Deposit Held',
  fineApplied: 'No Fine',
  fineTypes: [],
  fineStatus: 'All',
  daysOverdueFineBand: '1-7',
  fineWaived: 'Not Waived',
  fineWaivedBy: 'All Approvers',
  fineWaiverReason: [],
  accumulatedFine: 0,
  hostelBlock: 'All Blocks',
  roomType: 'All',
  roomNumber: '',
  hostelMealPlan: 'All',
  hostelJoiningMonth: '',
  hostelVacatingMonth: '',
  proratedHostelFee: 'Full Year',
  hostelFeeCategories: [],
  hostelFeeStatus: 'Paid',
  busRoute: 'All Routes',
  busStop: 'All Stops',
  distanceSlab: 'All Slabs',
  vehicleNumber: 'All Vehicles',
  driverAssigned: 'All Drivers',
  transportFeeCategory: 'All',
  transportOptInDate: '',
  transportOptOutDate: '',
  transportFeeStatus: 'Paid',
  glIncomeAccount: '4001 — Tuition Fee Income',
  postedToLedger: 'Posted',
  journalEntryNo: 'JV-2025-0001',
  journalEntryDate: '2025-04-19',
  feeIncomeAccount: '4001 — Tuition Fee Income',
  bankAccountMapped: 'ICICI — Fee Collection A/c XXXX8841',
  advanceFeeLiabilityAccount: '2101 — Advance Fee Liability',
  feeReconciledBank: 'Reconciled',
  costCenter: 'Main Campus Operations',
  budgetHead: 'Tuition Fee Budget',
  unearnedIncome: 'Current Period Fee (Earned)',
  invoiceSentToParent: 'Sent',
  invoiceDeliveryModes: ['Email'],
  invoiceAckParent: 'Acknowledged',
  feeReminderSent: 'No Reminder',
  remindersCountBand: '0',
  lastReminderDate: '',
  demandNoticeIssued: 'No Notice',
  parentLanguage: 'English',
  parentPortalAccess: 'Parent Has Portal Access',
  feeReceiptEmailed: 'Receipt Emailed',
  autoReminderEnabled: 'Auto-Reminder Active',
  feeCommitteeApproved: 'Committee Approved',
  feeRegulationAct: 'Compliant',
  rteCompliance: 'RTE Compliant',
  cbseCircularCompliant: 'Compliant',
  capitationFeeCheck: 'No Capitation Fee',
  feeHikePct: 0,
  exceedsPrevYearPct: 0,
  feeNotifiedToParents: 'Officially Notified',
  boardAffiliationCompliance: 'CBSE Compliant',
  trustApprovedFee: 'Approved by Governing Body',
  createdBy: 'Accounts Officer',
  modifiedBy: 'Accounts Officer',
  modifiedDate: '2025-04-18',
  approvedByConcession: 'All Approvers',
  dataEntrySource: 'Auto-Generated',
  receiptBookNumber: 'Digital Receipts',
  receiptSerial: 1,
  cancelledReceipt: 'Active',
  duplicateReceiptIssued: 'Original Only',
  feeModuleAuditFlag: 'Clean Records',
  systemVsManual: 'System Auto-Generated',
  lastSyncDate: '2025-09-30',
  ...input
});

const FEE_ROWS: FeeRow[] = [
  feeRow({ id: 'fee_001', studentName: 'Rahul Kumar', studentId: 'STU-2025-001', admissionNo: 'ADM-0101', className: 'Class 10', section: 'A', rollNo: '07', gender: 'Male', dob: '2010-05-14', category: 'General', academicGroup: 'Secondary (9-10)', classTeacher: 'Ms. Iyer (Class 10A)', house: 'Blue House', annualFee: 128000, termFee: 32000, monthlyFee: 10600, totalInvoiced: 128000, totalCollected: 64000, totalOutstanding: 64000, collectedThisMonth: 32000, collectedThisTerm: 64000, collectedThisYear: 64000, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', term1Status: 'Paid', term2Status: 'Paid', term3Status: 'Not Paid', currentTermStatus: 'Partially Paid', overdueStatus: 'Overdue', overdueDaysBand: '16-30 Days', overdueByDays: 22, paidOnTime: 'Sometimes Late', defaulterStatus: 'First-Time Defaulter', installmentStatus: ['Installment 3 Due'], partialPaymentCountBand: '2 Partial Payments', netPayable: 128000, invoiceAmount: 128000, feePerHeadBand: '₹25,001-₹50,000', feeDueDate: '2025-09-05', paymentMode: 'Cash', paymentChannel: 'School Counter (In-Person)', collectionCounter: 'Main Counter', bankAccountCredited: 'SBI — Current A/c XXXX4521', collectedBy: 'Mr. Rajesh Kumar', receiptNo: 'FR-2025-0142', receiptSerial: 142, txnRefNo: '', refundStatus: 'No Refund', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '2', lastReminderDate: '2025-09-12', feeReceiptEmailed: 'Receipt Not Emailed' }),

  feeRow({ id: 'fee_002', studentName: 'Priya Singh', studentId: 'STU-2025-002', admissionNo: 'ADM-0102', className: 'Class 9', section: 'B', rollNo: '12', gender: 'Female', dob: '2011-01-22', category: 'OBC', religion: 'Sikh', academicGroup: 'Secondary (9-10)', classTeacher: 'Mr. Sharma (Class 8B)', annualFee: 96000, termFee: 24000, monthlyFee: 8000, totalInvoiced: 96000, totalCollected: 96000, totalOutstanding: 0, collectedThisTerm: 24000, collectedThisYear: 96000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', overdueStatus: 'Not Overdue', feePerHeadBand: '₹10,001-₹25,000', paymentMode: 'UPI — PhonePe', paymentChannel: 'Mobile App', paymentGatewayUsed: 'Paytm Gateway', txnRefNo: 'UPI-PP-20250418-991', receiptNo: 'FR-2025-0155', receiptSerial: 155, invoiceDeliveryModes: ['Email', 'WhatsApp'], feeReceiptEmailed: 'Receipt Emailed', parentLanguage: 'Hindi' }),

  feeRow({ id: 'fee_003', studentName: 'Amit Verma', studentId: 'STU-2025-003', admissionNo: 'ADM-0103', className: 'Class 8', section: 'C', rollNo: '03', gender: 'Male', dob: '2012-03-09', category: 'SC', academicGroup: 'Middle School (6-8)', annualFee: 82000, termFee: 20500, monthlyFee: 6830, totalInvoiced: 82000, totalCollected: 20000, totalOutstanding: 62000, collectedThisMonth: 0, collectedThisTerm: 20000, collectedThisYear: 20000, paymentCompletionPct: 24, overallFeeStatus: 'Partially Paid', term1Status: 'Partially Paid', term2Status: 'Not Paid', term3Status: 'Not Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: '61-90 Days', overdueByDays: 74, paidOnTime: 'Always Late', defaulterStatus: 'Repeated Defaulter (2-3 times)', installmentStatus: ['Installment 2 Due', 'Overdue Installments'], partialPaymentCountBand: '1 Partial Payment', netPayable: 82000, feePerHeadBand: '₹10,001-₹25,000', feeDueDate: '2025-07-15', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '3+', lastReminderDate: '2025-09-20', demandNoticeIssued: '2nd Notice', refundStatus: 'No Refund', feeModuleAuditFlag: 'Flagged for Review', scholarshipHolder: 'No Scholarship', concessionType: '—' }),

  feeRow({ id: 'fee_004', studentName: 'Sneha Reddy', studentId: 'STU-2025-004', admissionNo: 'ADM-0104', className: 'Class 7', section: 'B', rollNo: '19', gender: 'Female', dob: '2013-11-30', category: 'General', academicGroup: 'Middle School (6-8)', annualFee: 78000, termFee: 19500, monthlyFee: 6500, totalInvoiced: 70200, totalCollected: 70200, totalOutstanding: 0, collectedThisYear: 70200, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: '₹10,001-₹25,000', hasConcession: 'Yes — Has Concession', concessionType: 'Sibling Discount', concessionPct: 10, concessionAmount: 7800, discountAmount: 7800, netPayable: 70200, concessionStatus: 'Active', concessionApprovedBy: 'Finance Head — Ms. R. Patel', concessionAppliedTo: ['Tuition Fee'], approvedByConcession: 'Finance Head — Ms. R. Patel', hasSibling: 'Yes — Has Sibling', invoiceWithConcession: 'Has Concession Applied', earlyPaymentDiscount: 'No', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_005', studentName: 'Karan Mehta', studentId: 'STU-2025-005', admissionNo: 'ADM-0105', className: 'Class 12', section: 'A', rollNo: '05', gender: 'Male', dob: '2008-08-19', category: 'General', academicGroup: 'Senior Secondary (11-12)', stream: 'Science', optionalSubjects: ['Computer Science'], annualFee: 168000, termFee: 42000, monthlyFee: 14000, totalInvoiced: 168000, totalCollected: 84000, totalOutstanding: 84000, collectedThisMonth: 42000, collectedThisTerm: 84000, collectedThisYear: 84000, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', term2Status: 'Paid', term3Status: 'Not Paid', currentTermStatus: 'Partially Paid', feePerHeadBand: '₹50,001-₹1,00,000', dayScholarBoarder: 'Boarder / Hostel Student', hostelBlock: 'Block A — Boys', roomType: 'Double Sharing', roomNumber: 'A-204', hostelMealPlan: 'Full Board (All Meals)', hostelJoiningMonth: 'April', proratedHostelFee: 'Full Year', hostelFeeCategories: ['Hostel Room Rent', 'Mess Fee'], hostelFeeStatus: 'Partially Paid', feeHeads: ['Tuition Fee', 'Hostel Fee', 'Mess / Canteen Fee'], feeHead: 'Hostel Fee', feeGroup: 'Hostel & Boarding Fees', feeSubGroup: 'Boarding', gstApplicable: 'GST Applicable', gstRate: 18, gstAmount: 25627, glAccountHead: '4004 — Hostel Fee Income', feeIncomeAccount: '4004 — Hostel Fee Income', budgetHead: 'Hostel Fee Budget', costCenter: 'Hostel Operations', feeFrequency: 'Term-wise', refundStatus: 'No Refund', feeDueDate: '2025-09-10', overdueStatus: 'Overdue', overdueDaysBand: '8-15 Days', overdueByDays: 12, feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '1', lastReminderDate: '2025-09-18' }),

  feeRow({ id: 'fee_006', studentName: 'Meera Patel', studentId: 'STU-2025-006', admissionNo: 'ADM-0106', className: 'Class 5', section: 'A', rollNo: '11', gender: 'Female', dob: '2015-02-11', category: 'General', academicGroup: 'Primary (1-5)', transportUser: 'Uses School Bus', busRoute: 'Route 4 — Vastrapur', busStop: 'Vastrapur Lake', distanceSlab: '5-10 KM', vehicleNumber: 'GJ-01-CD-5678', driverAssigned: 'Suresh Bhai', transportFeeCategory: 'Full Route', transportOptInDate: '2025-04-01', transportFeeStatus: 'Paid', annualFee: 72000, termFee: 18000, monthlyFee: 6000, totalInvoiced: 72000, totalCollected: 72000, totalOutstanding: 0, collectedThisYear: 72000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: '₹10,001-₹25,000', feeHeads: ['Tuition Fee', 'Transport Fee'], feeHead: 'Transport Fee', feeGroup: 'Transport Fees', feeSubGroup: 'Commute', glAccountHead: '4003 — Transport Fee Income', feeIncomeAccount: '4003 — Transport Fee Income', budgetHead: 'Transport Fee Budget', costCenter: 'Transport Operations', feeApplicableFor: 'Transport Users Only', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_007', studentName: 'Ananya Sharma', studentId: 'STU-2025-007', admissionNo: 'ADM-0107', className: 'Class 3', section: 'D', rollNo: '21', gender: 'Female', dob: '2017-07-07', category: 'EWS', academicGroup: 'Primary (1-5)', studentType: 'RTE (Free Seat)', isRteStudent: 'RTE Student', rteCompliance: 'RTE Compliant', feeStructureName: 'RTE Structure', feeStructureType: 'RTE / Free', totalInvoiced: 0, totalCollected: 0, totalOutstanding: 0, netPayable: 0, annualFee: 0, termFee: 0, monthlyFee: 0, paymentCompletionPct: 100, overallFeeStatus: 'Waived (Full)', feeFullyWaived: 'Fully Waived', scholarshipWaiver: 66000, scholarshipHolder: 'Has Active Scholarship', scholarshipScheme: 'RTE Free Seat Scheme', scholarshipLinked: 'Scholarship Concession Applied', waiverReason: ['Financial Hardship'], waiverPeriod: 'Full Year', receiptIssued: 'No Receipt Yet', receiptNo: '', receiptStatus: 'All', invoiceNo: 'INV-2025-RTE-014', invoiceStatus: 'Fully Paid', refundStatus: 'No Refund', feeHead: 'Tuition Fee', feePerHeadBand: 'Below ₹10,000', feeReminderSent: 'No Reminder', remindersCountBand: '0', feeCommitteeApproved: 'Committee Approved' }),

  feeRow({ id: 'fee_008', studentName: 'Rohan Desai', studentId: 'STU-2025-008', admissionNo: 'ADM-0108', className: 'Class 11', section: 'C', rollNo: '08', gender: 'Male', dob: '2009-04-25', category: 'General', academicGroup: 'Senior Secondary (11-12)', stream: 'Commerce', studentType: 'Management Quota', annualFee: 210000, termFee: 52500, monthlyFee: 17500, totalInvoiced: 210000, totalCollected: 52500, totalOutstanding: 157500, collectedThisMonth: 0, collectedThisTerm: 52500, collectedThisYear: 52500, paymentCompletionPct: 25, overallFeeStatus: 'Partially Paid', term2Status: 'Not Paid', term3Status: 'Not Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: '31-60 Days', overdueByDays: 45, paidOnTime: 'Sometimes Late', defaulterStatus: 'Repeated Defaulter (2-3 times)', installmentStatus: ['Installment 2 Due'], partialPaymentCountBand: '2 Partial Payments', feePerHeadBand: '₹50,001-₹1,00,000', feeDueDate: '2025-08-05', feePaymentDate: '2025-08-02', receiptDate: '2025-08-02', paymentMode: 'Cheque', bankNameCheque: 'HDFC Bank', chequeNumber: 'CHQ-556231', chequeStatus: 'Bounced', postDatedCheque: 'Regular Cheque', receiptNo: 'FR-2025-0218', receiptSerial: 218, receiptStatus: 'Active', invoiceWithLateFine: 'Includes Late Fine', fineApplied: 'Has Fine', fineTypes: ['Cheque Bounce Charge', 'Late Payment Fine'], fineAmount: 4200, fineStatus: 'Pending', daysOverdueFineBand: '31-60', fineWaived: 'Not Waived', accumulatedFine: 4200, hasConcession: 'Yes — Has Concession', concessionType: 'Management Quota', concessionPct: 5, concessionAmount: 10500, discountAmount: 10500, concessionStatus: 'Pending Approval', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '3+', lastReminderDate: '2025-09-25', demandNoticeIssued: 'Final Notice', feeModuleAuditFlag: 'Flagged for Review', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_009', studentName: 'Kriya Desai', studentId: 'STU-2025-009', admissionNo: 'ADM-0109', className: 'Class 7', section: 'A', rollNo: '02', gender: 'Female', dob: '2013-09-12', category: 'General', studentStatus: 'TC Issued', tcDate: '2025-08-20', academicGroup: 'Middle School (6-8)', annualFee: 78000, termFee: 19500, totalInvoiced: 58500, totalCollected: 58500, totalOutstanding: 0, collectedThisYear: 58500, paymentCompletionPct: 100, overallFeeStatus: 'Refunded', refundStatus: 'Refund Processed', refundTypes: ['TC / Withdrawal Refund', 'Caution Deposit Return'], refundAmount: 19500, refundDate: '2025-08-25', refundInitiatedBy: 'Parent Request', refundMode: 'Bank Transfer (NEFT)', refundProcessedBy: 'Accounts Officer', refundApprovedBy: 'Finance Head — Ms. R. Patel', pendingRefundDaysBand: '0-7 Days', cautionDepositRefund: 'Caution Deposit Refunded', feeHead: 'Caution Deposit', feeHeads: ['Tuition Fee', 'Caution Deposit'], feeGroup: 'Deposits & Security', feeSubGroup: 'Deposits', glAccountHead: '4007 — Deposit Liability', postedToLedger: 'Posted', receiptNo: 'FR-2025-0177', receiptSerial: 177, receiptStatus: 'Active', feeReminderSent: 'No Reminder', remindersCountBand: '0' }),

  feeRow({ id: 'fee_010', studentName: 'Ishaan Joshi', studentId: 'STU-2025-010', admissionNo: 'ADM-0110', className: 'Class 12', section: 'B', rollNo: '14', gender: 'Male', dob: '2008-12-03', category: 'General', academicGroup: 'Senior Secondary (11-12)', stream: 'Science', annualFee: 176000, termFee: 44000, monthlyFee: 14660, totalInvoiced: 176000, totalCollected: 176000, totalOutstanding: 0, collectedThisYear: 176000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: '₹50,001-₹1,00,000', paymentMode: 'NEFT', paymentChannel: 'Bank Direct Deposit', bankNameCheque: 'State Bank of India', txnRefNo: 'NEFT20250912UTIB0091', receiptNo: 'FR-2025-0231', receiptSerial: 231, bankAccountCredited: 'SBI — Current A/c XXXX4521', feeReconciledBank: 'Reconciled', postedToLedger: 'Posted', journalEntryNo: 'JV-2025-0412', journalEntryDate: '2025-09-13', refundStatus: 'No Refund', feeReceiptEmailed: 'Receipt Emailed', invoiceDeliveryModes: ['Email', 'SMS'] }),

  feeRow({ id: 'fee_011', studentName: 'Tanya Kapoor', studentId: 'STU-2025-011', admissionNo: 'ADM-0111', className: 'Class 6', section: 'B', rollNo: '06', gender: 'Female', dob: '2014-06-18', category: 'ST', religion: 'Christian', academicGroup: 'Middle School (6-8)', studentType: 'Scholarship Student', scholarshipHolder: 'Has Active Scholarship', scholarshipScheme: 'Minority Welfare Scheme', scholarshipWaiver: 24000, scholarshipLinked: 'Scholarship Concession Applied', annualFee: 80000, termFee: 20000, monthlyFee: 6660, totalInvoiced: 56000, totalCollected: 56000, totalOutstanding: 0, collectedThisYear: 56000, discountAmount: 24000, netPayable: 56000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', hasConcession: 'Yes — Has Concession', concessionType: 'Merit Discount', concessionPct: 30, concessionAmount: 24000, concessionStatus: 'Active', concessionApprovedBy: 'Principal — Mr. A. Sharma', concessionAppliedTo: ['Tuition Fee', 'Exam Fee'], approvedByConcession: 'Principal — Mr. A. Sharma', waiverReason: ['Good Academic Record'], waiverPeriod: 'Full Year', feePerHeadBand: '₹10,001-₹25,000', refundStatus: 'No Refund', feeCommitteeApproved: 'Committee Approved' }),

  feeRow({ id: 'fee_012', studentName: 'Arjun Nair', studentId: 'STU-2025-012', admissionNo: 'ADM-0112', className: 'Class 11', section: 'A', rollNo: '16', gender: 'Male', dob: '2009-10-28', category: 'General', nationality: 'NRI', studentType: 'NRI', academicGroup: 'Senior Secondary (11-12)', stream: 'Science', feeStructureName: 'NRI Structure', feeStructureType: 'NRI / Foreign', annualFee: 315000, termFee: 78750, monthlyFee: 26250, totalInvoiced: 315000, totalCollected: 157500, totalOutstanding: 157500, collectedThisTerm: 78750, collectedThisYear: 157500, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', currentTermStatus: 'Partially Paid', feePerHeadBand: 'Above ₹1,00,000', paymentMode: 'Net Banking', paymentChannel: 'Third-Party Gateway', paymentGatewayUsed: 'CCAvenue', txnRefNo: 'CCA-20250708-4421', receiptNo: 'FR-2025-0264', receiptSerial: 264, gstApplicable: 'GST Applicable', gstRate: 18, gstAmount: 48051, refundStatus: 'No Refund', parentLanguage: 'English', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '1', lastReminderDate: '2025-09-15' }),

  feeRow({ id: 'fee_013', studentName: 'Diya Shah', studentId: 'STU-2025-013', admissionNo: 'ADM-0113', className: 'Class 2', section: 'A', rollNo: '09', gender: 'Female', dob: '2018-01-15', category: 'General', academicGroup: 'Primary (1-5)', isStaffWard: 'Staff Ward', studentType: 'Staff Ward', annualFee: 56000, termFee: 14000, monthlyFee: 4660, totalInvoiced: 42000, totalCollected: 42000, totalOutstanding: 0, collectedThisYear: 42000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', hasConcession: 'Yes — Has Concession', concessionType: 'Staff Ward', concessionPct: 25, concessionAmount: 14000, discountAmount: 14000, netPayable: 42000, concessionStatus: 'Active', concessionApprovedBy: 'Management Trustee', approvedByConcession: 'Management Trustee', feePerHeadBand: 'Below ₹10,000', refundStatus: 'No Refund', feeReceiptEmailed: 'Receipt Emailed' }),

  feeRow({ id: 'fee_014', studentName: 'Kabir Malhotra', studentId: 'STU-2025-014', admissionNo: 'ADM-0114', className: 'Class 10', section: 'C', rollNo: '23', gender: 'Male', dob: '2010-11-05', category: 'OBC', academicGroup: 'Secondary (9-10)', annualFee: 132000, termFee: 33000, monthlyFee: 11000, totalInvoiced: 132000, totalCollected: 99000, totalOutstanding: 33000, collectedThisMonth: 0, collectedThisTerm: 33000, collectedThisYear: 99000, paymentCompletionPct: 75, overallFeeStatus: 'Partially Paid', term3Status: 'Not Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: '16-30 Days', overdueByDays: 18, paidOnTime: 'Sometimes Late', defaulterStatus: 'First-Time Defaulter', installmentStatus: ['Installment 3 Due'], partialPaymentCountBand: '1 Partial Payment', feePerHeadBand: '₹25,001-₹50,000', feeDueDate: '2025-09-15', fineApplied: 'Has Fine', fineTypes: ['Late Payment Fine'], fineAmount: 1100, fineStatus: 'Pending', daysOverdueFineBand: '16-30', accumulatedFine: 1100, feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '2', lastReminderDate: '2025-09-22', demandNoticeIssued: '1st Notice', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_015', studentName: 'Nisha Rao', studentId: 'STU-2025-015', admissionNo: 'ADM-0115', className: 'Class 4', section: 'B', rollNo: '17', gender: 'Female', dob: '2016-03-21', category: 'General', academicGroup: 'Primary (1-5)', transportUser: 'Uses School Bus', busRoute: 'Route 2 — Bopal', busStop: 'Bopal Cross Roads', distanceSlab: '10-15 KM', vehicleNumber: 'GJ-01-AB-1234', driverAssigned: 'Ramesh Bhai', transportFeeCategory: 'Half Route', transportOptInDate: '2025-04-01', transportOptOutDate: '2025-09-30', transportFeeStatus: 'Overdue', annualFee: 68000, termFee: 17000, monthlyFee: 5660, totalInvoiced: 68000, totalCollected: 34000, totalOutstanding: 34000, collectedThisTerm: 17000, collectedThisYear: 34000, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: '8-15 Days', overdueByDays: 9, feePerHeadBand: '₹10,001-₹25,000', feeHeads: ['Tuition Fee', 'Transport Fee'], feeGroup: 'Transport Fees', refundStatus: 'Refund Requested', refundTypes: ['Transport Opt-Out'], refundAmount: 8500, refundDate: '2025-09-28', refundInitiatedBy: 'Parent Request', refundMode: 'Fee Account Adjustment / Credit Note', pendingRefundDaysBand: '0-7 Days', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '1', lastReminderDate: '2025-09-24' }),

  feeRow({ id: 'fee_016', studentName: 'Yash Agarwal', studentId: 'STU-2025-016', admissionNo: 'ADM-0116', className: 'Class 9', section: 'D', rollNo: '20', gender: 'Male', dob: '2011-07-30', category: 'General', academicGroup: 'Secondary (9-10)', annualFee: 104000, termFee: 26000, monthlyFee: 8660, totalInvoiced: 104000, totalCollected: 104000, totalOutstanding: 0, collectedThisYear: 104000, paymentCompletionPct: 100, overallFeeStatus: 'Overpaid', advancePaymentStatus: 'Has Advance Payment', advanceAmount: 6000, unearnedIncome: 'Advance Fee (Unearned)', advanceFeeLiabilityAccount: '2101 — Advance Fee Liability', refundStatus: 'No Refund', paymentMode: 'Credit Card', paymentChannel: 'School Online Portal', paymentGatewayUsed: 'Razorpay', txnRefNo: 'RZP-20250905-7781', receiptNo: 'FR-2025-0291', receiptSerial: 291, feePerHeadBand: '₹25,001-₹50,000' }),

  feeRow({ id: 'fee_017', studentName: 'Aarohi Bhatt', studentId: 'STU-2025-017', admissionNo: 'ADM-0117', className: 'Nursery', section: 'A', rollNo: '04', gender: 'Female', dob: '2021-02-08', category: 'General', academicGroup: 'Pre-Primary (Nursery-UKG)', annualFee: 48000, termFee: 12000, monthlyFee: 4000, totalInvoiced: 48000, totalCollected: 24000, totalOutstanding: 24000, collectedThisTerm: 12000, collectedThisYear: 24000, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', currentTermStatus: 'Partially Paid', feePerHeadBand: 'Below ₹10,000', paymentMode: 'UPI — Paytm', txnRefNo: 'UPI-PT-20250712-3320', receiptNo: 'FR-2025-0312', receiptSerial: 312, invoiceTerm: ['Term 1 Invoice', 'Term 2 Invoice'], bulkInvoice: 'Individual Generated', feeReminderSent: 'No Reminder', remindersCountBand: '0', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_018', studentName: 'Vivaan Gupta', studentId: 'STU-2025-018', admissionNo: 'ADM-0118', className: 'Class 6', section: 'C', rollNo: '13', gender: 'Male', dob: '2014-12-19', category: 'Minority', religion: 'Muslim', academicGroup: 'Middle School (6-8)', studentType: 'Regular', annualFee: 86000, termFee: 21500, monthlyFee: 7160, totalInvoiced: 86000, totalCollected: 0, totalOutstanding: 86000, collectedThisMonth: 0, collectedThisTerm: 0, collectedThisYear: 0, paymentCompletionPct: 0, overallFeeStatus: 'Not Paid', term1Status: 'Not Paid', term2Status: 'Not Paid', term3Status: 'Not Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: 'More than 90 Days', overdueByDays: 128, paidOnTime: 'Always Late', defaulterStatus: 'Chronic Defaulter (4+ times)', installmentStatus: ['Installment 1 Due', 'Installment 2 Due', 'Overdue Installments'], partialPaymentCountBand: '0 Partial Payments', receiptIssued: 'No Receipt Yet', receiptNo: '', receiptStatus: 'All', receiptType: 'All', feePerHeadBand: '₹10,001-₹25,000', invoiceStatus: 'Overdue', invoiceSentToParent: 'Sent', invoiceAckParent: 'Acknowledged', invoiceAcknowledged: 'Acknowledged by Parent', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '3+', lastReminderDate: '2025-09-27', demandNoticeIssued: 'Legal Notice', feeModuleAuditFlag: 'Flagged for Review', refundStatus: 'No Refund', writtenOffAmount: 0 }),

  feeRow({ id: 'fee_019', studentName: 'Sara Khan', studentId: 'STU-2025-019', admissionNo: 'ADM-0119', className: 'UKG', section: 'B', rollNo: '15', gender: 'Female', dob: '2020-09-14', category: 'General', academicGroup: 'Pre-Primary (Nursery-UKG)', annualFee: 46000, termFee: 11500, monthlyFee: 3830, totalInvoiced: 46000, totalCollected: 46000, totalOutstanding: 0, collectedThisYear: 46000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: 'Below ₹10,000', paymentMode: 'DD (Demand Draft)', bankNameCheque: 'ICICI Bank', chequeNumber: 'DD-889123', chequeStatus: 'Cleared', receiptNo: 'FR-2025-0330', receiptSerial: 330, receiptBookNumber: 'RB-2025-B', collectionCounter: 'Branch Office', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_020', studentName: 'Devansh Patel', studentId: 'STU-2025-020', admissionNo: 'ADM-0120', className: 'Class 12', section: 'C', rollNo: '18', gender: 'Male', dob: '2008-05-02', category: 'General', academicGroup: 'Senior Secondary (11-12)', stream: 'Arts / Humanities', annualFee: 148000, termFee: 37000, monthlyFee: 12330, totalInvoiced: 148000, totalCollected: 111000, totalOutstanding: 37000, collectedThisTerm: 37000, collectedThisYear: 111000, paymentCompletionPct: 75, overallFeeStatus: 'Partially Paid', term3Status: 'Partially Paid', currentTermStatus: 'Partially Paid', overdueStatus: 'Due This Week', overdueByDays: 0, feePerHeadBand: '₹25,001-₹50,000', feeDueDate: '2025-10-05', invoiceStatus: 'Sent to Parent', invoiceSentToParent: 'Sent', invoiceDeliveryModes: ['WhatsApp', 'SMS'], invoiceAckParent: 'Not Acknowledged', invoiceAcknowledged: 'Not Acknowledged', feeReminderSent: 'No Reminder', remindersCountBand: '0', autoReminderEnabled: 'No Auto-Reminder', refundStatus: 'No Refund', feeCommitteeApproved: 'Committee Approved', feeRegulationAct: 'Compliant' }),

  feeRow({ id: 'fee_021', studentName: 'Riya Menon', studentId: 'STU-2025-021', admissionNo: 'ADM-0121', className: 'Class 8', section: 'A', rollNo: '10', gender: 'Female', dob: '2012-10-10', category: 'General', academicGroup: 'Middle School (6-8)', dayScholarBoarder: 'Boarder / Hostel Student', hostelBlock: 'Block C — Girls', roomType: 'Triple Sharing', roomNumber: 'C-112', hostelMealPlan: 'Partial Meals', hostelJoiningMonth: 'June', proratedHostelFee: 'Prorated (Partial Year)', hostelFeeCategories: ['Hostel Room Rent', 'Electricity Charges', 'Laundry Fee'], hostelFeeStatus: 'Overdue', annualFee: 118000, termFee: 29500, monthlyFee: 9830, totalInvoiced: 118000, totalCollected: 59000, totalOutstanding: 59000, collectedThisTerm: 29500, collectedThisYear: 59000, paymentCompletionPct: 50, overallFeeStatus: 'Partially Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: '31-60 Days', overdueByDays: 38, feePerHeadBand: '₹25,001-₹50,000', feeHeads: ['Tuition Fee', 'Hostel Fee', 'Mess / Canteen Fee'], feeHead: 'Mess / Canteen Fee', feeGroup: 'Hostel & Boarding Fees', costCenter: 'Hostel Operations', budgetHead: 'Hostel Fee Budget', feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '2', lastReminderDate: '2025-09-26', demandNoticeIssued: '1st Notice', refundStatus: 'No Refund' }),

  feeRow({ id: 'fee_022', studentName: 'Aditya Kulkarni', studentId: 'STU-2025-022', admissionNo: 'ADM-0122', className: 'Class 1', section: 'C', rollNo: '22', gender: 'Male', dob: '2019-08-08', category: 'General', academicGroup: 'Primary (1-5)', hasSibling: 'Yes — Has Sibling', annualFee: 58000, termFee: 14500, monthlyFee: 4830, totalInvoiced: 58000, totalCollected: 52200, totalOutstanding: 0, collectedThisYear: 52200, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: 'Below ₹10,000', hasConcession: 'Yes — Has Concession', concessionType: 'Sibling Discount', concessionPct: 10, concessionAmount: 5800, discountAmount: 5800, netPayable: 52200, concessionStatus: 'Active', concessionApprovedBy: 'Accounts Officer', refundStatus: 'No Refund', feeReceiptEmailed: 'Receipt Emailed' }),

  feeRow({ id: 'fee_023', studentName: 'Fatima Sheikh', studentId: 'STU-2025-023', admissionNo: 'ADM-0123', className: 'Class 5', section: 'D', rollNo: '24', gender: 'Female', dob: '2015-11-25', category: 'OBC', religion: 'Muslim', academicGroup: 'Primary (1-5)', isBplStudent: 'BPL Card Holder', annualFee: 74000, termFee: 18500, monthlyFee: 6160, totalInvoiced: 44400, totalCollected: 44400, totalOutstanding: 0, collectedThisYear: 44400, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: 'Below ₹10,000', hasConcession: 'Yes — Has Concession', concessionType: 'Need-Based', concessionPct: 40, concessionAmount: 29600, discountAmount: 29600, scholarshipWaiver: 0, netPayable: 44400, concessionStatus: 'Active', concessionApprovedBy: 'Principal — Mr. A. Sharma', waiverReason: ['Financial Hardship'], waiverPeriod: 'Full Year', feeFullyWaived: 'Partially Waived', refundStatus: 'No Refund', feeCommitteeApproved: 'Committee Approved', rteCompliance: 'RTE Compliant', feeRegulationAct: 'Compliant' }),

  feeRow({ id: 'fee_024', studentName: 'Neel Solanki', studentId: 'STU-2025-024', admissionNo: 'ADM-0124', className: 'Class 7', section: 'C', rollNo: '25', gender: 'Male', dob: '2013-04-17', category: 'SC', academicGroup: 'Middle School (6-8)', isDifferentlyAbled: 'Yes', annualFee: 76000, termFee: 19000, monthlyFee: 6330, totalInvoiced: 38000, totalCollected: 38000, totalOutstanding: 0, collectedThisYear: 38000, paymentCompletionPct: 100, overallFeeStatus: 'Waived (Full)', feeFullyWaived: 'Fully Waived', scholarshipHolder: 'Has Active Scholarship', scholarshipScheme: 'EWS Fee Waiver Scheme', scholarshipWaiver: 38000, scholarshipLinked: 'Scholarship Concession Applied', waiverReason: ['Medical Grounds'], concessionStatus: 'Active', feePerHeadBand: 'Below ₹10,000', refundStatus: 'No Refund', feeCommitteeApproved: 'Committee Approved' }),

  feeRow({ id: 'fee_025', studentName: 'Pari Trivedi', studentId: 'STU-2025-025', admissionNo: 'ADM-0125', className: 'Class 10', section: 'B', rollNo: '26', gender: 'Female', dob: '2010-07-19', category: 'General', academicGroup: 'Secondary (9-10)', annualFee: 136000, termFee: 34000, monthlyFee: 11330, totalInvoiced: 136000, totalCollected: 136000, totalOutstanding: 0, collectedThisYear: 136000, paymentCompletionPct: 100, overallFeeStatus: 'Fully Paid', feePerHeadBand: '₹25,001-₹50,000', paymentMode: 'QR Code Scan', paymentChannel: 'School Counter (In-Person)', txnRefNo: 'QR-20250920-1180', receiptNo: 'FR-2025-0355', receiptSerial: 355, invoiceRegenerated: 'Regenerated / Revised', invoiceStatus: 'Fully Paid', feeReceiptEmailed: 'Receipt Emailed', refundStatus: 'No Refund', writtenOffAmount: 0 }),

  feeRow({ id: 'fee_026', studentName: 'Aryan Chauhan', studentId: 'STU-2025-026', admissionNo: 'ADM-0126', className: 'Class 11', section: 'D', rollNo: '27', gender: 'Male', dob: '2009-02-27', category: 'General', academicGroup: 'Senior Secondary (11-12)', stream: 'Vocational', annualFee: 122000, termFee: 30500, monthlyFee: 10160, totalInvoiced: 122000, totalCollected: 30500, totalOutstanding: 91500, collectedThisTerm: 30500, collectedThisYear: 30500, paymentCompletionPct: 25, overallFeeStatus: 'Partially Paid', term2Status: 'Not Paid', term3Status: 'Not Paid', currentTermStatus: 'Overdue', overdueStatus: 'Overdue', overdueDaysBand: 'More than 90 Days', overdueByDays: 105, paidOnTime: 'Always Late', defaulterStatus: 'Chronic Defaulter (4+ times)', installmentStatus: ['Installment 2 Due', 'Overdue Installments'], partialPaymentCountBand: '3+ Partial Payments', feePerHeadBand: '₹25,001-₹50,000', writtenOffAmount: 12000, postedToLedger: 'Not Yet Posted', glIncomeAccount: '4001 — Tuition Fee Income', feeReconciledBank: 'Unreconciled', journalEntryNo: '', fineApplied: 'Has Fine', fineTypes: ['Late Payment Fine', 'Library Fine'], fineAmount: 3600, fineStatus: 'Partially Paid', fineWaived: 'Not Waived', accumulatedFine: 3600, feeReminderSent: 'Yes — Reminder Sent', remindersCountBand: '3+', lastReminderDate: '2025-09-29', demandNoticeIssued: 'Final Notice', feeModuleAuditFlag: 'Flagged for Review', refundStatus: 'No Refund', dataEntrySource: 'Manual', systemVsManual: 'Manually Entered', createdBy: 'Fee Counter Cashier' }),

  feeRow({ id: 'fee_027', studentName: 'Zoya Ansari', studentId: 'STU-2025-027', admissionNo: 'ADM-0127', className: 'Class 3', section: 'A', rollNo: '28', gender: 'Female', dob: '2017-06-06', category: 'Minority', religion: 'Muslim', academicGroup: 'Primary (1-5)', annualFee: 64000, termFee: 16000, monthlyFee: 5330, totalInvoiced: 64000, totalCollected: 64000, totalOutstanding: 0, collectedThisYear: 64000, paymentCompletionPct: 100, overallFeeStatus: 'Overpaid', advanceAmount: 4000, advancePaymentStatus: 'Has Advance Payment', unearnedIncome: 'Advance Fee (Unearned)', feePerHeadBand: 'Below ₹10,000', refundStatus: 'Refund Pending Approval', refundTypes: ['Overpayment Refund'], refundAmount: 4000, refundDate: '2025-09-26', refundInitiatedBy: 'Admin Initiated', pendingRefundDaysBand: '0-7 Days', refundMode: 'UPI', feeReceiptEmailed: 'Receipt Emailed' }),

  feeRow({ id: 'fee_028', studentName: 'Harsh Vora', studentId: 'STU-2025-028', admissionNo: 'ADM-0128', className: 'Class 9', section: 'C', rollNo: '29', gender: 'Male', dob: '2011-03-03', category: 'General', academicGroup: 'Secondary (9-10)', annualFee: 108000, termFee: 27000, monthlyFee: 9000, totalInvoiced: 108000, totalCollected: 81000, totalOutstanding: 27000, collectedThisTerm: 27000, collectedThisYear: 81000, paymentCompletionPct: 75, overallFeeStatus: 'Partially Paid', currentTermStatus: 'Partially Paid', overdueStatus: 'Due This Month', feePerHeadBand: '₹25,001-₹50,000', feeDueDate: '2025-10-12', feeRevisionDate: '2025-04-01', feeRevisedThisYear: 'Yes — Revised', revisionType: 'Increased', revisionPct: 8, feeHikePct: 8, exceedsPrevYearPct: 8, refundStatus: 'No Refund', invoiceStatus: 'Generated', invoiceSentToParent: 'Not Sent', invoiceSentMode: 'Not Sent', invoiceAckParent: 'Not Acknowledged', invoiceAcknowledged: 'Not Acknowledged', feeReminderSent: 'No Reminder', remindersCountBand: '0' })
];

/**
 * Per-row overrides that spread the demo ledger across invoice months, fee
 * frequencies, departments, receipt books, hosts/deposit cases etc., so every
 * one of the 228 criteria returns a realistic, varied result set.
 */
const FEE_ROW_PATCHES: Record<string, Partial<FeeRow>> = {
  fee_001: { invoiceDate: '2025-04-08', department: 'Admin' },
  fee_002: { invoiceDate: '2025-05-06', feeFrequency: 'Term-wise', department: 'Library' },
  fee_003: { invoiceDate: '2025-06-10', feeFrequency: 'Monthly', feeApplicableFor: 'Specific Class' },
  fee_004: { invoiceDate: '2025-04-12', feeFrequency: 'Term-wise', department: 'Sports' },
  fee_005: { invoiceDate: '2025-07-05', feeStructureEffectiveTo: '2025-09-30' },
  fee_006: { invoiceDate: '2025-05-20', department: 'Transport', feeFrequency: 'Monthly' },
  fee_007: { invoiceDate: '2025-04-15', proformaInvoice: 'Proforma Only', newAdmissionInvoice: 'New Admission Invoice' },
  fee_008: { invoiceDate: '2025-08-09', invoiceStatus: 'Partially Paid', department: 'Admin' },
  fee_009: { invoiceDate: '2025-04-18', invoiceStatus: 'Cancelled', refundMode: 'Cheque' },
  fee_010: { invoiceDate: '2025-09-10', nachMandate: 'NACH Mandate Active', feeFrequency: 'Annual', tdsOnFee: 'TDS Applicable' },
  fee_011: { invoiceDate: '2025-06-14', invoiceStatus: 'Generated' },
  fee_012: { invoiceDate: '2025-07-08', nachMandate: 'NACH Mandate Active', invoiceStatus: 'Partially Paid' },
  fee_013: { invoiceDate: '2025-04-22', newAdmissionInvoice: 'New Admission Invoice' },
  fee_014: { invoiceDate: '2025-09-12', feeFrequency: 'Quarterly' },
  fee_015: { invoiceDate: '2025-08-16', department: 'Transport', invoiceStatus: 'Partially Paid' },
  fee_016: { invoiceDate: '2025-09-05', nachMandate: 'NACH Mandate Active', receiptBookNumber: 'RB-2025-A' },
  fee_017: { invoiceDate: '2025-07-12', receiptBookNumber: 'RB-2025-B', invoiceStatus: 'Partially Paid' },
  fee_018: { invoiceDate: '2025-04-28', invoiceStatus: 'Overdue', department: 'Admin', receiptBookNumber: 'RB-2025-A' },
  fee_019: { invoiceDate: '2025-05-14', receiptBookNumber: 'RB-2025-C', feeFrequency: 'Annual' },
  fee_020: { invoiceDate: '2025-09-28', invoiceStatus: 'Sent to Parent', newAdmissionInvoice: 'New Admission Invoice' },
  fee_021: { invoiceDate: '2025-06-30', department: 'Hostel', hostelVacatingMonth: 'November' },
  fee_022: { invoiceDate: '2025-04-30', earlyPaymentDiscount: 'Yes' },
  fee_023: { invoiceDate: '2025-05-26', earlyPaymentDiscount: 'Yes' },
  fee_024: { invoiceDate: '2025-06-06', feeFrequency: 'One-Time', proformaInvoice: 'Proforma Only' },
  fee_025: { invoiceDate: '2025-09-20', duplicateReceiptIssued: 'Duplicate Issued', refundMode: 'Bank Transfer (NEFT)' },
  fee_026: {
    invoiceDate: '2025-07-18',
    feeFrequency: 'Monthly',
    tdsOnFee: 'TDS Applicable',
    fineWaived: 'Waived',
    fineWaivedBy: 'Principal — Mr. A. Sharma',
    fineWaiverReason: ['Financial Hardship']
  },
  fee_027: { invoiceDate: '2025-09-26', duplicateReceiptIssued: 'Duplicate Issued', refundMode: 'Bank Transfer (NEFT)' },
  fee_028: {
    invoiceDate: '2025-08-14',
    feeFrequency: 'One-Time',
    invoiceStatus: 'Draft',
    roomType: 'Single',
    busRoute: 'Route 1 — Satellite',
    busStop: 'Shivranjani',
    distanceSlab: '0-5 KM',
    hostelVacatingMonth: 'December'
  }
};

const FEE_ROWS_PATCHED: FeeRow[] = FEE_ROWS.map((r) => ({ ...r, ...(FEE_ROW_PATCHES[r.id] || {}) }));

// ---------------------------------------------------------------- engine maps
const FEE_SELECT_FIELDS: Record<string, string> = {
  financialYear: 'fy', academicYear: 'ay', quarter: 'quarter',
  feeStructureName: 'feeStructureName', feeStructureType: 'feeStructureType', feeGroup: 'feeGroup', feeSubGroup: 'feeSubGroup',
  feeHeadStatus: 'feeHeadStatus', mandatoryOptional: 'mandatoryOptional', recurringOneTime: 'recurringOneTime',
  feeFrequency: 'feeFrequency', feeApplicableFor: 'feeApplicableFor', gstApplicable: 'gstApplicable', gstRate: 'gstRateLabel',
  tdsOnFee: 'tdsOnFee', feeRevisedThisYear: 'feeRevisedThisYear', revisionType: 'revisionType',
  gender: 'gender', nationality: 'nationality', studentType: 'studentType', dayScholarBoarder: 'dayScholarBoarder',
  transportUser: 'transportUser', hasSibling: 'hasSibling', isStaffWard: 'isStaffWard', isRteStudent: 'isRteStudent',
  isBplStudent: 'isBplStudent', isDifferentlyAbled: 'isDifferentlyAbled', scholarshipHolder: 'scholarshipHolder',
  scholarshipSchemeFilter: 'scholarshipScheme', studentStatus: 'studentStatus', yearOfStudy: 'yearOfStudy',
  branch: 'branch', medium: 'medium', academicGroup: 'academicGroup', stream: 'stream', classTeacher: 'classTeacher',
  house: 'house', department: 'department',
  invoiceGeneratedBy: 'invoiceGeneratedBy', invoiceSentMode: 'invoiceSentMode', invoiceAcknowledged: 'invoiceAcknowledged',
  bulkInvoice: 'bulkInvoice', newAdmissionInvoice: 'newAdmissionInvoice', proformaInvoice: 'proformaInvoice',
  invoiceCancelled: 'invoiceCancelled', invoiceRegenerated: 'invoiceRegenerated', invoiceWithLateFine: 'invoiceWithLateFine',
  invoiceWithConcession: 'invoiceWithConcession', feePerHeadAverage: 'feePerHeadBand',
  term1Status: 'term1Status', term2Status: 'term2Status', term3Status: 'term3Status', currentTermStatus: 'currentTermStatus',
  overdueStatus: 'overdueStatus', overdueSinceDays: 'overdueDaysBand', paidOnTime: 'paidOnTime',
  defaulterStatus: 'defaulterStatus', advancePaymentStatus: 'advancePaymentStatus', partialPaymentCount: 'partialPaymentCountBand',
  paymentChannel: 'paymentChannel', paymentGatewayUsed: 'paymentGatewayUsed', bankNameCheque: 'bankNameCheque',
  chequeStatus: 'chequeStatus', postDatedCheque: 'postDatedCheque', receiptStatus: 'receiptStatus',
  receiptIssued: 'receiptIssued', receiptType: 'receiptType', collectedBy: 'collectedBy', collectionCounter: 'collectionCounter',
  bankAccountCredited: 'bankAccountCredited', nachMandate: 'nachMandate',
  hasConcession: 'hasConcession', concessionStatus: 'concessionStatus', concessionApprovedBy: 'concessionApprovedBy',
  scholarshipLinked: 'scholarshipLinked', scholarshipSchemeConcession: 'scholarshipScheme', feeFullyWaived: 'feeFullyWaived',
  earlyPaymentDiscount: 'earlyPaymentDiscount',
  refundInitiatedBy: 'refundInitiatedBy', refundMode: 'refundMode', refundProcessedBy: 'refundProcessedBy',
  refundApprovedBy: 'refundApprovedBy', pendingRefundDays: 'pendingRefundDaysBand', cautionDepositRefund: 'cautionDepositRefund',
  fineApplied: 'fineApplied', fineStatus: 'fineStatus', daysOverdueFine: 'daysOverdueFineBand', fineWaivedFilter: 'fineWaived',
  fineWaivedBy: 'fineWaivedBy',
  roomType: 'roomType', hostelMealPlan: 'hostelMealPlan', hostelJoiningMonth: 'hostelJoiningMonth',
  hostelVacatingMonth: 'hostelVacatingMonth', proratedHostelFee: 'proratedHostelFee', hostelFeeStatus: 'hostelFeeStatus',
  busStop: 'busStop', distanceSlab: 'distanceSlab', vehicleNumber: 'vehicleNumber', driverAssigned: 'driverAssigned',
  transportFeeCategory: 'transportFeeCategory', transportFeeStatus: 'transportFeeStatus',
  glIncomeAccount: 'glAccountHead', postedToLedger: 'postedToLedger', bankAccountMapped: 'bankAccountMapped',
  advanceFeeLiabilityAccount: 'advanceFeeLiabilityAccount', feeReconciledBank: 'feeReconciledBank',
  costCenter: 'costCenter', budgetHead: 'budgetHead', unearnedIncome: 'unearnedIncome',
  invoiceSentToParent: 'invoiceSentToParent', invoiceAckParent: 'invoiceAckParent', feeReminderSent: 'feeReminderSent',
  remindersCount: 'remindersCountBand', demandNoticeIssued: 'demandNoticeIssued', parentLanguage: 'parentLanguage',
  parentPortalAccess: 'parentPortalAccess', feeReceiptEmailed: 'feeReceiptEmailed', autoReminderEnabled: 'autoReminderEnabled',
  feeCommitteeApproved: 'feeCommitteeApproved', feeRegulationAct: 'feeRegulationAct', rteCompliance: 'rteCompliance',
  cbseCircularCompliant: 'cbseCircularCompliant', capitationFeeCheck: 'capitationFeeCheck',
  feeNotifiedToParents: 'feeNotifiedToParents', boardAffiliationCompliance: 'boardAffiliationCompliance',
  createdBy: 'createdBy', modifiedBy: 'modifiedBy', approvedByConcession: 'approvedByConcession',
  dataEntrySource: 'dataEntrySource', receiptBookNumber: 'receiptBookNumber', cancelledReceipt: 'cancelledReceipt',
  duplicateReceiptIssued: 'duplicateReceiptIssued', feeModuleAuditFlag: 'feeModuleAuditFlag', systemVsManual: 'systemVsManual'
};

const FEE_MULTI_FIELDS: Record<string, string> = {
  month: 'months', termInstallment: 'termsInstallments', feeHead: 'feeHeads', glAccountHead: 'glAccounts',
  className: 'className', section: 'section', category: 'category', religion: 'religion',
  concessionTypeStudent: 'concessionTypeList', board: 'board', optionalSubjects: 'optionalSubjects',
  invoiceStatus: 'invoiceStatusList', invoiceTerm: 'invoiceTerm', overallFeeStatus: 'overallFeeStatus',
  installmentStatus: 'installmentStatus', paymentMode: 'paymentMode', concessionType: 'concessionTypeList',
  concessionAppliedTo: 'concessionAppliedTo', waiverReason: 'waiverReason', refundStatus: 'refundStatus',
  refundType: 'refundTypes', fineType: 'fineTypes', fineWaiverReason: 'fineWaiverReason',
  hostelBlock: 'hostelBlock', hostelFeeCategory: 'hostelFeeCategories', busRoute: 'busRoute',
  feeIncomeAccount: 'feeIncomeAccount', invoiceDeliveryMode: 'invoiceDeliveryModes'
};

const FEE_TEXT_FIELDS: Record<string, string[]> = {
  feeHeadCode: ['feeHeadCode'],
  studentName: ['studentName'],
  studentId: ['studentId', 'admissionNo'],
  rollNo: ['rollNo'],
  invoiceNumber: ['invoiceNo'],
  chequeNumber: ['chequeNumber'],
  txnRefNo: ['txnRefNo'],
  receiptNumber: ['receiptNo'],
  roomNumber: ['roomNumber'],
  journalEntryNo: ['journalEntryNo']
};

const FEE_APPLY_RANGES: Record<string, string> = {
  revisionPct: 'revisionPct',
  invoiceAmountRange: 'invoiceAmount',
  annualFeeRange: 'annualFee',
  termFeeRange: 'termFee',
  monthlyFeeRange: 'monthlyFee',
  totalInvoicedRange: 'totalInvoiced',
  totalCollectedRange: 'totalCollected',
  totalOutstandingRange: 'totalOutstanding',
  collectedThisMonthRange: 'collectedThisMonth',
  collectedThisTermRange: 'collectedThisTerm',
  collectedThisYearRange: 'collectedThisYear',
  discountConcessionRange: 'discountAmount',
  scholarshipWaiverRange: 'scholarshipWaiver',
  fineAmountRangeFees: 'fineAmount',
  netPayableRange: 'netPayable',
  advanceExcessRange: 'advanceAmount',
  refundAmountRangeFees: 'refundAmount',
  writtenOffRange: 'writtenOffAmount',
  gstAmountRange: 'gstAmount',
  paymentCompletionPct: 'paymentCompletionPct',
  concessionPct: 'concessionPct',
  concessionAmountRange: 'concessionAmount',
  refundAmountRange: 'refundAmount',
  fineAmountRange: 'fineAmount',
  accumulatedFineRange: 'accumulatedFine',
  receiptSerialRange: 'receiptSerial',
  feeHikePct: 'feeHikePct',
  exceedsPrevYearPct: 'exceedsPrevYearPct'
};

const FEE_APPLY_DATES: Record<string, string> = {
  feePostingDateRange: 'feePostingDate',
  dobRange: 'dob',
  admissionDateRange: 'admissionDate',
  tcDateRange: 'tcDate',
  refundDateRange: 'refundDate',
  transportOptInDate: 'transportOptInDate',
  transportOptOutDate: 'transportOptOutDate',
  journalEntryDateRange: 'journalEntryDate',
  lastReminderDateRange: 'lastReminderDate',
  modifiedDateRange: 'modifiedDate',
  lastSyncDateRange: 'lastSyncDate'
};

const FEE_SINGLE_DATES: Record<string, { field: string; dir: 'from' | 'to' }> = {
  feeInvoiceDateFrom: { field: 'invoiceDate', dir: 'from' },
  feeInvoiceDateTo: { field: 'invoiceDate', dir: 'to' },
  feeDueDateFrom: { field: 'feeDueDate', dir: 'from' },
  feeDueDateTo: { field: 'feeDueDate', dir: 'to' },
  feePaymentDateFrom: { field: 'feePaymentDate', dir: 'from' },
  feePaymentDateTo: { field: 'feePaymentDate', dir: 'to' },
  feeReceiptDateFrom: { field: 'receiptDate', dir: 'from' },
  feeReceiptDateTo: { field: 'receiptDate', dir: 'to' },
  feeStructureEffectiveFrom: { field: 'feeStructureEffectiveFrom', dir: 'from' },
  feeStructureEffectiveTo: { field: 'feeStructureEffectiveTo', dir: 'to' },
  feeRevisionDate: { field: 'feeRevisionDate', dir: 'from' },
  academicSessionStart: { field: 'academicSessionStart', dir: 'from' },
  academicSessionEnd: { field: 'academicSessionEnd', dir: 'to' },
  lastPaymentDateFrom: { field: 'lastPaymentDate', dir: 'from' },
  lastPaymentDateTo: { field: 'lastPaymentDate', dir: 'to' }
};

const matchesFeeValue = (raw: string, value: any): boolean => {
  if (Array.isArray(value)) return value.length === 0 || value.includes(raw);
  const v = String(value);
  if (v.startsWith('All')) return true;
  if (v.includes(' — ') && v.split(' — ').length === 2) {
    return v === raw || v.split(' — ')[0].trim() === raw;
  }
  return v === raw;
};

/** Derives the extra helper fields the filters read (months, terms, bands, FY, GST %). */
const feeDerived = (row: FeeRow): Record<string, any> => {
  const monthOf = (iso: string) => {
    if (!iso) return '';
    const m = new Date(iso).getMonth();
    return FEE_MONTHS[(m + 9) % 12];
  };
  const fyOf = (iso: string) => {
    if (!iso) return 'FY 2025-26';
    const d = new Date(iso);
    const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
    return `FY ${y}-${String((y + 1) % 100).padStart(2, '0')}`;
  };
  const terms: string[] = Array.isArray(row.invoiceTerm) ? row.invoiceTerm.map((t) => t.replace(' Invoice', '')) : [];
  return {
    fy: fyOf(row.invoiceDate),
    ay: '2025-26',
    quarter: 'Q1 (Apr-Jun)',
    months: [monthOf(row.invoiceDate), monthOf(row.feePaymentDate)].filter(Boolean),
    termsInstallments: [...terms, 'Term 1', 'Installment 1'],
    gstRateLabel: `${row.gstRate}%`,
    concessionTypeList: row.concessionType === '—' ? [] : [row.concessionType],
    invoiceStatusList: [row.invoiceStatus],
    overallFeeStatus: [row.overallFeeStatus],
    paymentModeList: [row.paymentMode],
    hostelBlockList: [row.hostelBlock],
    busRouteList: [row.busRoute],
    invoiceTermList: row.invoiceTerm,
    glAccounts: [row.glAccountHead]
  };
};

function applyFeeFilters(rows: FeeRow[], filters: Record<string, any>): FeeRow[] {
  const active = Object.keys(filters).filter((k) => !isBlankFeeValue(filters[k]));
  if (active.length === 0) return rows;

  return rows.filter((row) => {
    const data: any = { ...row, ...feeDerived(row) };

    for (const id of active) {
      const raw = filters[id];
      const kind = FEE_FILTER_KIND[id];

      if (kind === 'range' && FEE_APPLY_RANGES[id]) {
        const num = Number(data[FEE_APPLY_RANGES[id]] || 0);
        const min = (raw as any).min;
        const max = (raw as any).max;
        if (min !== undefined && min !== '' && num < Number(min)) return false;
        if (max !== undefined && max !== '' && num > Number(max)) return false;
        continue;
      }

      if (kind === 'daterange' && FEE_APPLY_DATES[id]) {
        const cell = String(data[FEE_APPLY_DATES[id]] || '');
        if (!cell) return false;
        if ((raw as any).min && cell < String((raw as any).min)) return false;
        if ((raw as any).max && cell > String((raw as any).max)) return false;
        continue;
      }

      if (kind === 'date' && FEE_SINGLE_DATES[id]) {
        const { field, dir } = FEE_SINGLE_DATES[id];
        const cell = String(data[field] || '');
        if (!cell) return false;
        if (dir === 'from' ? cell < String(raw) : cell > String(raw)) return false;
        continue;
      }

      if (kind === 'text' && FEE_TEXT_FIELDS[id]) {
        const needle = String(raw).toLowerCase();
        const hit = FEE_TEXT_FIELDS[id].some((f) => String(data[f] || '').toLowerCase().includes(needle));
        if (!hit) return false;
        continue;
      }

      if (kind === 'multiselect' && FEE_MULTI_FIELDS[id]) {
        const picked: string[] = Array.isArray(raw) ? raw : [String(raw)];
        if (!picked.length || picked.some((p) => p === 'All' || p.startsWith('All '))) continue;
        const field = data[FEE_MULTI_FIELDS[id]];
        const list: string[] = Array.isArray(field) ? field.map(String) : [String(field ?? '')];
        const hit = picked.some((p) => list.some((l) => l === p || l.toLowerCase() === p.toLowerCase()));
        if (!hit) return false;
        continue;
      }

      if (FEE_SELECT_FIELDS[id]) {
        const cell = String(data[FEE_SELECT_FIELDS[id]] ?? '');
        if (!matchesFeeValue(cell, raw)) return false;
        continue;
      }
    }

    return true;
  });
}

const FEE_TABLE_COLUMNS = [
  'studentName',
  'studentId',
  'className',
  'invoiceNo',
  'feeHead',
  'totalInvoiced',
  'totalCollected',
  'totalOutstanding',
  'overallFeeStatus',
  'paymentMode',
  'receiptNo',
  'feeDueDate'
];

// ============================================================================
// FEES REPORT — FILTER PANEL (all 17 groups in ONE panel) + REPORT CATALOGUE
// ============================================================================
function feeChipLabel(def: FeeFilterDef, value: any): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value === true) return 'Yes';
  if (typeof value === 'object' && value) {
    const { min, max } = value;
    if (min && max) return `${min} → ${max}`;
    return String(min || max || '');
  }
  return String(value);
}

function FeeFilterField({
  def,
  value,
  onChange
}: {
  def: FeeFilterDef;
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
          onChange={(v: any) => onChange(def.id, typeof v === 'string' ? v : v?.target?.value ?? '')}
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
          onChange={(vals: string[]) => onChange(def.id, vals)}
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
            on ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-600'
          }`}
        >
          <span>{on ? 'Yes — applied' : 'No'}</span>
          <span className={`h-4 w-8 rounded-full relative ${on ? 'bg-indigo-500' : 'bg-gray-300'}`}>
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

// --------------------------------------------------------------- report data
interface FeeReportDef {
  code: string;
  title: string;
  scope: string;
  group: 'government' | 'erp';
  category: string;
}

interface FeeReportGroup {
  id: string;
  title: string;
  category: string;
  group: 'government' | 'erp';
  icon: 'shield' | 'landmark' | 'scale' | 'audit' | 'structure' | 'invoice' | 'collection' | 'outstanding' | 'mode' |
  'concession' | 'refund' | 'fine' | 'accounting' | 'analysis' | 'student' | 'compliance' | 'communication' | 'special';
  reports: [string, string][];
}

const FEE_REPORT_GROUPS: FeeReportGroup[] = [
  {
    id: 'gov-moe', group: 'government', category: 'Ministry of Education — Central', title: '🏛️ Ministry of Education — Central (12)', icon: 'shield',
    reports: [
      ['MoE-01', 'UDISE+ Fee & Receipt Data Return (Annual)'],
      ['MoE-02', 'Ministry of Education Fee Structure Disclosure'],
      ['MoE-03', 'Central Fee Regulatory Compliance Report'],
      ['MoE-04', 'NEP 2020 Fee Transparency Report'],
      ['MoE-05', 'Digital Fee Disclosure Report (PM e-VIDYA)'],
      ['MoE-06', 'Samagra Shiksha Fee Utilisation Report'],
      ['MoE-07', 'Central Scholarship Fee Adjustment Report (NMMSS)'],
      ['MoE-08', 'SC / ST / OBC Central Fee Waiver Report'],
      ['MoE-09', 'RTE Central Admission Fee Reimbursement Claim'],
      ['MoE-10', 'National Fee Data Bank Upload (Annual)'],
      ['MoE-11', 'Mid-Day Meal Fee Adjustment Report'],
      ['MoE-12', 'Annual Fee Audit Report Submitted to MoE']
    ]
  },
  {
    id: 'gov-state', group: 'government', category: 'State Government / Fee Regulation', title: '🏢 State Government / Fee Regulation (23)', icon: 'landmark',
    reports: [
      ['SG-01', 'State FRC Fee Approval Compliance Report'],
      ['SG-02', 'State Fee Regulatory Committee Annual Filing'],
      ['SG-03', 'Fee Structure Filed with State Authority'],
      ['SG-04', 'State Fee Hike Justification Report'],
      ['SG-05', 'State RTE 25% Reimbursement Claim'],
      ['SG-06', 'State Scholarship Fee Adjustment Report'],
      ['SG-07', 'State Board Fee Notification Compliance'],
      ['SG-08', 'Fee Receipt Serial Number Audit (State)'],
      ['SG-09', 'State Fee Cap Compliance Report'],
      ['SG-10', 'Tuition Fee Increase Approval Report'],
      ['SG-11', 'State-Level Fee Defaulters Report'],
      ['SG-12', 'State Fee Grievance Redressal Report'],
      ['SG-13', 'State Board Exam Fee Collection Report'],
      ['SG-14', 'State Transport Fee Regulation Report'],
      ['SG-15', 'State Hostel Fee Compliance Report'],
      ['SG-16', 'State Fee Refund Compliance Report'],
      ['SG-17', 'State Fee Concession Register'],
      ['SG-18', 'State Minority Fee Waiver Report'],
      ['SG-19', 'State Fee Audit Observations Report'],
      ['SG-20', 'School Fee Regulation Act Compliance Report'],
      ['SG-21', 'State Parent Complaint Fee Report'],
      ['SG-22', 'State Fee Collection Bank Reconciliation'],
      ['SG-23', 'District Education Officer Fee Return']
    ]
  },
  {
    id: 'gov-board', group: 'government', category: 'CBSE / Board', title: '🎓 CBSE / Board (8)', icon: 'scale',
    reports: [
      ['CB-01', 'CBSE Fee Structure Disclosure Report'],
      ['CB-02', 'CBSE Affiliation Fee Compliance Report'],
      ['CB-03', 'CBSE Examination Fee Remittance Report'],
      ['CB-04', 'CBSE Fee-related Circular Compliance'],
      ['CB-05', 'CBSE Board Exam Fee Collection Summary'],
      ['CB-06', 'CBSE Fee Refund Policy Compliance'],
      ['CB-07', 'Board Affiliation Fee Payment Report'],
      ['CB-08', 'CBSE Fee Audit Response Report']
    ]
  },
  {
    id: 'gov-audit', group: 'government', category: 'Statutory Audit', title: '🧾 Statutory Audit (10)', icon: 'audit',
    reports: [
      ['SA-01', 'Fee Income Ledger Reconciliation Report'],
      ['SA-02', 'Fee Receipt vs Bank Deposit Reconciliation'],
      ['SA-03', 'Fee Outstanding Ageing Analysis (Audit)'],
      ['SA-04', 'Fee Concession & Scholarship Audit Trail'],
      ['SA-05', 'Fee Waiver Approval Audit Report'],
      ['SA-06', 'Fee Refund Audit Report'],
      ['SA-07', 'Fee Income Recognition Report (Ind AS 115)'],
      ['SA-08', 'Fee Receipt Number Gap Report'],
      ['SA-09', 'Fee Cancelled Receipt Audit Report'],
      ['SA-10', 'Fee Trust / Society Audit Schedule']
    ]
  },
  {
    id: 'gov-legal', group: 'government', category: 'Legal & Court', title: '⚖️ Legal & Court (6)', icon: 'scale',
    reports: [
      ['LG-01', 'Fee-related Court Case Summary'],
      ['LG-02', 'Legal Notice Issued (Fee Defaulters) Register'],
      ['LG-03', 'Fee Dispute Case Ledger'],
      ['LG-04', 'Fee-related RTI Response Report'],
      ['LG-05', 'Consumer Court Fee Complaint Report'],
      ['LG-06', 'Legal Fee Recovery Status Report']
    ]
  },
  {
    id: 'erp-a', group: 'erp', category: 'Fee Structure', title: '🅰️ A. Fee Structure (12)', icon: 'structure',
    reports: [
      ['A01', 'Master Fee Structure — Class-wise'],
      ['A02', 'Fee Structure Comparison (Year on Year)'],
      ['A03', 'Fee Head Configuration Report'],
      ['A04', 'Fee Structure Change Log'],
      ['A05', 'Fee Revision Approval History'],
      ['A06', 'Class-wise / Section-wise Fee Structure'],
      ['A07', 'Optional & Add-on Fee Head Report'],
      ['A08', 'Fee Structure Applicability Matrix'],
      ['A09', 'Transport Fee Slab Structure'],
      ['A10', 'Hostel Fee Structure (Block / Room-wise)'],
      ['A11', 'New Admission Fee Structure Report'],
      ['A12', 'Fee Structure Print / Circular']
    ]
  },
  {
    id: 'erp-b', group: 'erp', category: 'Fee Invoice', title: '🅱️ B. Fee Invoice (11)', icon: 'invoice',
    reports: [
      ['B01', 'Fee Invoice Register'],
      ['B02', 'Invoice Generation Summary (Bulk)'],
      ['B03', 'Invoice-wise Outstanding Report'],
      ['B04', 'Invoice Cancellation Report'],
      ['B05', 'Invoice Re-issue / Revision Report'],
      ['B06', 'Invoice-wise Concession Report'],
      ['B07', 'Invoice-wise Fine Report'],
      ['B08', 'Monthly Invoice Generation Report'],
      ['B09', 'Term-wise Invoice Summary'],
      ['B10', 'Invoice Delivery / Acknowledgment Report'],
      ['B11', 'Pending Invoice Generation Report']
    ]
  },
  {
    id: 'erp-c', group: 'erp', category: 'Fee Collection', title: '🅲 C. Fee Collection (17)', icon: 'collection',
    reports: [
      ['C01', 'Daily Fee Collection Register'],
      ['C02', 'Monthly Fee Collection Summary'],
      ['C03', 'Class-wise Fee Collection Report'],
      ['C04', 'Section-wise Fee Collection Report'],
      ['C05', 'Fee Head-wise Collection Report'],
      ['C06', 'Cash Collection Register'],
      ['C07', 'Cheque Collection Register'],
      ['C08', 'Online Payment Collection Report'],
      ['C09', 'Counter-wise Collection Report'],
      ['C10', 'Collected-By (Staff) Performance Report'],
      ['C11', 'Collection vs Target Report'],
      ['C12', 'Year-to-Date Collection Report'],
      ['C13', 'Term-wise Collection Report'],
      ['C14', 'Consolidated Fee Collection Report (Branch-wise)'],
      ['C15', 'Fee Collection Time-Slot Analysis'],
      ['C16', 'Receipt-wise Collection Detail'],
      ['C17', 'Fee Collection Variance Report']
    ]
  },
  {
    id: 'erp-d', group: 'erp', category: 'Outstanding / Receivable', title: '🅳 D. Outstanding / Receivable (18)', icon: 'outstanding',
    reports: [
      ['D01', 'Fee Outstanding Ageing Analysis'],
      ['D02', 'Class-wise Outstanding Report'],
      ['D03', 'Student-wise Outstanding Detail'],
      ['D04', 'Fee Head-wise Outstanding Report'],
      ['D05', 'Overdue Fee Report (30 / 60 / 90+ Days)'],
      ['D06', 'Critical Defaulter Report (90+ Days)'],
      ['D07', 'Outstanding Watch List (Follow-up Required)'],
      ['D08', 'Term-wise Outstanding Report'],
      ['D09', 'Transport Fee Outstanding Report'],
      ['D10', 'Hostel Fee Outstanding Report'],
      ['D11', 'Exam Fee Outstanding Report'],
      ['D12', 'Outstanding vs Collection Trend'],
      ['D13', 'Projected Fee Receivable Report'],
      ['D14', 'Outstanding Write-off Report'],
      ['D15', 'Branch-wise Outstanding Report'],
      ['D16', 'Outstanding by Category (SC / ST / OBC / EWS)'],
      ['D17', 'Outstanding Recovery Plan Report'],
      ['D18', 'Receivable Provisioning Report']
    ]
  },
  {
    id: 'erp-e', group: 'erp', category: 'Payment Mode', title: '🅴 E. Payment Mode (15)', icon: 'mode',
    reports: [
      ['E01', 'Payment Mode-wise Collection Summary'],
      ['E02', 'Cash vs Digital Payment Report'],
      ['E03', 'UPI Collection Report'],
      ['E04', 'Credit / Debit Card Collection Report'],
      ['E05', 'NEFT / RTGS Collection Report'],
      ['E06', 'Cheque Payment Register'],
      ['E07', 'DD Receipt Register'],
      ['E08', 'Online Gateway Collection Report'],
      ['E09', 'Auto-Debit (NACH / ECS) Report'],
      ['E10', 'Bounced Cheque / Failed Transaction Report'],
      ['E11', 'Payment Gateway Settlement Reconciliation'],
      ['E12', 'Payment Mode Trend Analysis'],
      ['E13', 'Counter vs Online Payment Mix'],
      ['E14', 'Payment Instrument-wise Charges Report'],
      ['E15', 'Post-Dated Cheque Tracking Report']
    ]
  },
  {
    id: 'erp-f', group: 'erp', category: 'Concession & Waiver', title: '🅵 F. Concession & Waiver (17)', icon: 'concession',
    reports: [
      ['F01', 'Concession Register (All Types)'],
      ['F02', 'Sibling Discount Report'],
      ['F03', 'Staff Ward Concession Report'],
      ['F04', 'Merit / Scholarship Concession Report'],
      ['F05', 'Need-Based Waiver Report'],
      ['F06', 'RTE Free Seat Concession Report'],
      ['F07', 'Management Quota Concession Report'],
      ['F08', 'Concession Approval Status Report'],
      ['F09', 'Concession-wise Fee Impact Report'],
      ['F10', 'Year-wise Concession Comparison'],
      ['F11', 'Class-wise Concession Report'],
      ['F12', 'Concession Audit Trail Report'],
      ['F13', 'Scholarship-linked Fee Adjustment Report'],
      ['F14', 'Waiver Reason Analysis Report'],
      ['F15', 'Concession Expiry / Renewal Report'],
      ['F16', 'Full Fee Waiver Report (100%)'],
      ['F17', 'Concession Duplicate / Misuse Check Report']
    ]
  },
  {
    id: 'erp-g', group: 'erp', category: 'Refund', title: '🅶 G. Refund (15)', icon: 'refund',
    reports: [
      ['G01', 'Fee Refund Register'],
      ['G02', 'TC / Withdrawal Refund Report'],
      ['G03', 'Duplicate / Excess Payment Refund Report'],
      ['G04', 'Refund Approval Status Report'],
      ['G05', 'Refund Mode-wise Summary'],
      ['G06', 'Pending Refund Ageing Report'],
      ['G07', 'Cancelled Admission Refund Report'],
      ['G08', 'Transport Opt-Out Refund Report'],
      ['G09', 'Hostel Vacate Refund Report'],
      ['G10', 'Caution Deposit Refund Report'],
      ['G11', 'Online Payment Failure Refund Report'],
      ['G12', 'Refund vs Collection Reconciliation'],
      ['G13', 'Refund Processed-by-Staff Report'],
      ['G14', 'Refund Rejection Analysis'],
      ['G15', 'Year-wise Refund Summary']
    ]
  },
  {
    id: 'erp-h', group: 'erp', category: 'Fine & Late Fee', title: '🅷 H. Fine & Late Fee (10)', icon: 'fine',
    reports: [
      ['H01', 'Fine Collection Register'],
      ['H02', 'Late Fee / Late Fine Report'],
      ['H03', 'Class-wise Fine Summary'],
      ['H04', 'Fine Waiver Report'],
      ['H05', 'Fine Waiver Approval Report'],
      ['H06', 'Cheque Bounce Charge Report'],
      ['H07', 'Accumulated Pending Fine Report'],
      ['H08', 'Fine Type-wise Analysis'],
      ['H09', 'Fine vs On-Time Payment Trend'],
      ['H10', 'Monthly Fine Collection Summary']
    ]
  },
  {
    id: 'erp-i', group: 'erp', category: 'Receipt & Accounting', title: '🅸 I. Receipt & Accounting (13)', icon: 'accounting',
    reports: [
      ['I01', 'Daily Receipt Register'],
      ['I02', 'Receipt Book / Serial Number Audit'],
      ['I03', 'Cancelled Receipt Report'],
      ['I04', 'Duplicate Receipt Issued Report'],
      ['I05', 'Receipt vs Bank Deposit Reconciliation'],
      ['I06', 'Fee Income GL Posting Report'],
      ['I07', 'Unposted / Pending Fee Posting Report'],
      ['I08', 'Journal Entry Mapping Report (Fee)'],
      ['I09', 'Advance Fee Liability Report'],
      ['I10', 'Unearned Fee Income Report'],
      ['I11', 'Cost Center-wise Fee Posting'],
      ['I12', 'Fee Reconciliation with Bank Statement'],
      ['I13', 'Receipt Format / Print Audit Report']
    ]
  },
  {
    id: 'erp-j', group: 'erp', category: 'Financial Analysis', title: '🅹 J. Financial Analysis (16)', icon: 'analysis',
    reports: [
      ['J01', 'Fee Revenue Trend Analysis (Monthly)'],
      ['J02', 'Fee Revenue vs Budget Report'],
      ['J03', 'Fee Growth / YoY Comparison'],
      ['J04', 'Collection Efficiency Report'],
      ['J05', 'Outstanding-to-Collection Ratio'],
      ['J06', 'Fee Revenue Forecast Report'],
      ['J07', 'Department / Cost Center Revenue Report'],
      ['J08', 'Profitability by Fee Head'],
      ['J09', 'Fee Discount Impact on Revenue'],
      ['J10', 'Fee Realisation per Student'],
      ['J11', 'Cash Flow Projection from Fees'],
      ['J12', 'Term-wise Revenue Recognition Report'],
      ['J13', 'Fee Revenue Concentration Analysis'],
      ['J14', 'Branch / Campus Revenue Comparison'],
      ['J15', 'Fee Waiver Financial Impact Report'],
      ['J16', 'Annual Fee Revenue Summary']
    ]
  },
  {
    id: 'erp-k', group: 'erp', category: 'Student-wise', title: '🅺 K. Student-wise (12)', icon: 'student',
    reports: [
      ['K01', 'Student-wise Fee Ledger'],
      ['K02', 'Student Fee Statement (Statement of Account)'],
      ['K03', 'Student-wise Payment History'],
      ['K04', 'Student Fee Defaulter List'],
      ['K05', 'Fee Clearance Certificate Report'],
      ['K06', 'New Admission Fee Report'],
      ['K07', 'Student Category-wise Fee Report'],
      ['K08', 'Student Transport Fee Report'],
      ['K09', 'Student Hostel Fee Report'],
      ['K10', 'Student Concession Summary'],
      ['K11', 'Student Fee Refund History'],
      ['K12', 'No-Dues / Clearance Status Report']
    ]
  },
  {
    id: 'erp-l', group: 'erp', category: 'Compliance & Regulatory', title: '🅻 L. Compliance & Regulatory (10)', icon: 'compliance',
    reports: [
      ['L01', 'Fee Regulation Act Compliance Dashboard'],
      ['L02', 'Fee Approval Filing Status Report'],
      ['L03', 'RTE Reimbursement Claim Report'],
      ['L04', 'Fee Receipt Compliance Checklist'],
      ['L05', 'GST Compliance Report (Fee)'],
      ['L06', 'TDS on Fee-related Payments Report'],
      ['L07', 'Fee Audit Observation Tracker'],
      ['L08', 'Fee Notification to Parents Compliance'],
      ['L09', 'Fee Committee Approval Register'],
      ['L10', 'Statutory Register of Fees']
    ]
  },
  {
    id: 'erp-m', group: 'erp', category: 'Communication & Notification', title: '🅼 M. Communication & Notification (8)', icon: 'communication',
    reports: [
      ['M01', 'Fee Reminder Sent Report'],
      ['M02', 'Demand Notice Issued Report'],
      ['M03', 'Fee Invoice Delivery Report'],
      ['M04', 'SMS / WhatsApp Fee Communication Log'],
      ['M05', 'Email Fee Communication Report'],
      ['M06', 'Parent Portal Fee Access Report'],
      ['M07', 'Reminder Effectiveness Report'],
      ['M08', 'Outstanding Follow-up Call Report']
    ]
  },
  {
    id: 'erp-n', group: 'erp', category: 'Special Purpose', title: '🅽 N. Special Purpose (16)', icon: 'special',
    reports: [
      ['N01', 'NRI / Foreign Student Fee Report'],
      ['N02', 'Staff Ward Fee Report'],
      ['N03', 'RTE Student Fee Report'],
      ['N04', 'BPL Student Fee Concession Report'],
      ['N05', 'Differently-Abled Student Fee Report'],
      ['N06', 'Minority Student Fee Report'],
      ['N07', 'Boarding Student Consolidated Fee Report'],
      ['N08', 'Transport User Consolidated Fee Report'],
      ['N09', 'Provisional Admission Fee Report'],
      ['N10', 'Mid-Term Admission Fee Report'],
      ['N11', 'Sibling Group Fee Report'],
      ['N12', 'Alumni / Pass-Out Dues Report'],
      ['N13', 'Special Counter Collection Report'],
      ['N14', 'Fee Waiver for Natural Calamity Report'],
      ['N15', 'Trust / Management Quota Fee Report'],
      ['N16', 'Custom Ad-hoc Fee Query Report']
    ]
  }
];

const FEE_REPORTS_FLAT: FeeReportDef[] = FEE_REPORT_GROUPS.flatMap((g) =>
  g.reports.map(([code, title]) => ({ code, title, scope: g.category, group: g.group, category: g.category }))
);
const FEE_GOV_REPORT_COUNT = FEE_REPORTS_FLAT.filter((r) => r.group === 'government').length;
const FEE_ERP_REPORT_COUNT = FEE_REPORTS_FLAT.filter((r) => r.group === 'erp').length;
const TOTAL_FEE_REPORTS = FEE_REPORTS_FLAT.length;

const feeReportIcon = (kind: FeeReportGroup['icon']) => {
  switch (kind) {
    case 'shield':
      return Shield;
    case 'landmark':
      return Landmark;
    case 'scale':
      return Scale;
    case 'audit':
      return ClipboardCheck;
    case 'structure':
      return Layers;
    case 'invoice':
      return FileText;
    case 'collection':
      return Banknote;
    case 'outstanding':
      return AlertCircle;
    case 'mode':
      return CreditCard;
    case 'concession':
      return Percent;
    case 'refund':
      return RefreshCw;
    case 'fine':
      return Clock;
    case 'accounting':
      return Calculator;
    case 'analysis':
      return BarChart3;
    case 'student':
      return Users;
    case 'compliance':
      return BadgeCheck;
    case 'communication':
      return Mail;
    default:
      return Sparkles;
  }
};

// ------------------------------------------------------------- filter panel
function FeeCriteriaPanel({
  draft,
  applied,
  onChange,
  onApply,
  onReset,
  onQuick,
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
  onQuick: (preset: Record<string, any>) => void;
  rows: FeeRow[];
  totalRows: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  onViewRecords: () => void;
}) {
  const activeChips = useMemo(() => {
    const out: { id: string; label: string; value: string }[] = [];
    FEE_FILTER_GROUPS.forEach((g) =>
      g.filters.forEach((f) => {
        const v = applied[f.id];
        if (!isBlankFeeValue(v)) out.push({ id: f.id, label: f.label, value: feeChipLabel(f, v) });
      })
    );
    return out;
  }, [applied]);

  const draftCount = useMemo(
    () => Object.keys(draft).filter((k) => !isBlankFeeValue(draft[k])).length,
    [draft]
  );

  const invoiced = rows.reduce((s, r) => s + r.totalInvoiced, 0);
  const collected = rows.reduce((s, r) => s + r.totalCollected, 0);
  const outstanding = rows.reduce((s, r) => s + r.totalOutstanding, 0);
  const waived = rows.reduce((s, r) => s + r.discountAmount + r.scholarshipWaiver, 0);
  const refunds = rows.reduce((s, r) => s + r.refundAmount, 0);

  return (
    <div id="fee-criteria-panel" className="scroll-mt-6">
    <Card className="rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Fee Report Criteria — All {FEE_FILTER_GROUPS.length} Filter Groups &amp; {TOTAL_FEE_FILTERS} Filters in One Panel
            </h2>
            <p className="text-xs text-gray-500">
              {TOTAL_FEE_FILTERS} search filters · {draftCount} selected · {activeChips.length} applied ·{' '}
              {rows.length} of {totalRows} fee accounts in scope
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset All
          </Button>
          <Button variant="outline" size="sm" onClick={onViewRecords}>
            <Eye className="w-4 h-4 mr-1" />
            View Matched Records
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onApply}>
            <CheckCircle className="w-4 h-4 mr-1" />
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
          { label: 'Total Invoiced', value: invoiced, tone: 'text-gray-900' },
          { label: 'Total Collected', value: collected, tone: 'text-emerald-700' },
          { label: 'Outstanding', value: outstanding, tone: 'text-amber-700' },
          { label: 'Concession / Waiver', value: waived, tone: 'text-indigo-700' },
          { label: 'Refunds', value: refunds, tone: 'text-rose-700' }
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{k.label}</p>
            <p className={`text-sm font-bold ${k.tone}`}>{feeInr(k.value)}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="p-4 space-y-5">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Quick Presets</span>
            {[
              { id: 'overdue', label: 'Overdue Fees' },
              { id: 'defaulters', label: '90+ Day Defaulters' },
              { id: 'concession', label: 'Concession Cases' },
              { id: 'refunds', label: 'Refund Pending' },
              { id: 'fines', label: 'Fine Applied' },
              { id: 'transport', label: 'Transport Users' },
              { id: 'hostel', label: 'Hostel / Boarders' },
              { id: 'rte', label: 'RTE / Scholarship' },
              { id: 'cash', label: 'Cash Counter Collection' },
              { id: 'online', label: 'Online / Digital Payments' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onQuick(FEE_QUICK_PRESETS[p.id] || {})}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          {FEE_FILTER_GROUPS.map((group, gi) => (
            <div key={group.id} className={gi === 0 ? '' : 'pt-4 border-t border-gray-100'}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">{group.title}</h3>
                <span className="text-[10px] font-semibold text-gray-400">{group.filters.length} filters</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {group.filters.map((f) => (
                  <FeeFilterField key={f.id} def={f} value={draft[f.id]} onChange={onChange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 bg-white p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Applied</span>
          {activeChips.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
            >
              {c.label}: <span className="font-semibold">{c.value}</span>
            </span>
          ))}
        </div>
      )}
    </Card>
    </div>
  );
}

const FEE_QUICK_PRESETS: Record<string, Record<string, any>> = {
  overdue: { overdueStatus: 'Overdue' },
  defaulters: { overdueSinceDays: 'More than 90 Days' },
  concession: { hasConcession: 'Yes — Has Concession' },
  refunds: { refundStatus: ['Refund Requested', 'Refund Pending Approval', 'Refund Approved'] },
  fines: { fineApplied: 'Has Fine' },
  transport: { transportUser: 'Uses School Bus' },
  hostel: { dayScholarBoarder: 'Boarder / Hostel Student' },
  rte: { isRteStudent: 'RTE Student' },
  cash: { paymentMode: ['Cash'] },
  online: { paymentChannel: ['School Online Portal', 'Mobile App', 'Third-Party Gateway'] }
};

// ------------------------------------------------------------ report catalog
function FeeReportCatalog({
  search,
  setSearch,
  scope,
  setScope,
  selected,
  toggleReport,
  selectGroup,
  clearSelection,
  onGenerate,
  onExportList,
  generatedCount,
  matchedCount
}: {
  search: string;
  setSearch: (v: string) => void;
  scope: 'all' | 'government' | 'erp';
  setScope: (v: 'all' | 'government' | 'erp') => void;
  selected: string[];
  toggleReport: (code: string) => void;
  selectGroup: (codes: string[], on: boolean) => void;
  clearSelection: () => void;
  onGenerate: () => void;
  onExportList: (fmt: 'csv' | 'excel') => void;
  generatedCount: number;
  matchedCount: number;
}) {
  const needle = search.trim().toLowerCase();
  const groups = FEE_REPORT_GROUPS.filter((g) => (scope === 'all' ? true : g.group === scope)).map((g) => ({
    ...g,
    visible: needle
      ? g.reports.filter(
        ([code, title]) => title.toLowerCase().includes(needle) || code.toLowerCase().includes(needle) || g.category.toLowerCase().includes(needle)
      )
      : g.reports
  })).filter((g) => g.visible.length > 0);

  const visibleCount = groups.reduce((s, g) => s + g.visible.length, 0);

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              All Fee Reports — {TOTAL_FEE_REPORTS} Reports on One Page
            </h2>
            <p className="text-xs text-gray-500">
              {FEE_GOV_REPORT_COUNT} government-required · {FEE_ERP_REPORT_COUNT} ERP pre-made ·{' '}
              {selected.length} selected{generatedCount > 0 ? ` · ${generatedCount} generated this session` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onExportList('csv')}>
            <Download className="w-4 h-4 mr-1" />
            Export List (CSV)
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExportList('excel')}>
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={clearSelection} disabled={selected.length === 0}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onGenerate}>
            <Play className="w-4 h-4 mr-1" />
            Generate Report {selected.length > 0 ? `(${selected.length})` : ''}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-gray-50 border-b border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 249 reports by name or code (e.g. GST, ageing, refund, RTE)…"
            className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          {([['all', `All (${TOTAL_FEE_REPORTS})`], ['government', `Government (${FEE_GOV_REPORT_COUNT})`], ['erp', `ERP Pre-made (${FEE_ERP_REPORT_COUNT})`]] as const).map(
            ([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setScope(id)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  scope === id
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-200'
                }`}
              >
                {label}
              </button>
            )
          )}
          <span className="text-[10px] font-semibold text-gray-400">
            {visibleCount} shown · {matchedCount} fee accounts in scope
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {groups.map((group) => {
          const codes = group.visible.map(([c]) => c);
          const allOn = codes.every((c) => selected.includes(c));
          const Icon = feeReportIcon(group.icon);
          return (
            <div key={group.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm ${
                      group.group === 'government' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">{group.title}</h3>
                  <Badge variant={group.group === 'government' ? 'primary' : 'success'}>
                    {group.group === 'government' ? 'Government' : 'ERP'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-gray-400">{group.visible.length} reports</span>
                  <button
                    type="button"
                    onClick={() => selectGroup(codes, !allOn)}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {allOn ? 'Unselect all' : 'Select all'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.visible.map(([code, title]) => {
                  const on = selected.includes(code);
                  return (
                    <label
                      key={code}
                      className={`group flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${
                        on ? 'border-indigo-300 bg-indigo-50/60' : 'border-gray-200 bg-white hover:border-indigo-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleReport(code)}
                        aria-label={title}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                            {code}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-gray-800 leading-snug">{title}</span>
                        <span className="mt-1 block text-[10px] text-gray-400">{group.category}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-600">No report matches “{search}”.</p>
            <p className="text-[11px] text-gray-400">Try a different keyword — e.g. GST, ageing, refund, transport, RTE.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// FEES REPORT PAGE SHELL — criteria panel + 249-report catalogue on ONE page
// ============================================================================
const feeInr = (n: number) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const FEE_COLUMN_LABELS: Record<string, string> = {
  studentName: 'Student',
  studentId: 'Student ID',
  className: 'Class',
  invoiceNo: 'Invoice No.',
  feeHead: 'Fee Head',
  totalInvoiced: 'Invoiced',
  totalCollected: 'Collected',
  totalOutstanding: 'Outstanding',
  overallFeeStatus: 'Status',
  paymentMode: 'Payment Mode',
  receiptNo: 'Receipt No.',
  feeDueDate: 'Due Date'
};

function FeeRecordsModal({
  open,
  onClose,
  rows
}: {
  open: boolean;
  onClose: () => void;
  rows: FeeRow[];
}) {
  if (!open) return null;
  const invoiced = rows.reduce((s, r) => s + r.totalInvoiced, 0);
  const collected = rows.reduce((s, r) => s + r.totalCollected, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Matched Fee Records</h3>
              <p className="text-xs text-gray-500">
                {rows.length} of {FEE_ROWS_PATCHED.length} fee accounts · Invoiced {feeInr(invoiced)} · Collected {feeInr(collected)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        </div>
        <div className="overflow-auto max-h-[68vh]">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider sticky top-0">
              <tr>
                {FEE_TABLE_COLUMNS.map((c) => (
                  <th key={c} className="p-3 whitespace-nowrap">
                    {FEE_COLUMN_LABELS[c] || c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {FEE_TABLE_COLUMNS.map((c) => {
                    const value = (r as any)[c];
                    const isMoney = ['totalInvoiced', 'totalCollected', 'totalOutstanding'].includes(c);
                    return (
                      <td key={c} className="p-3 whitespace-nowrap text-gray-700">
                        {isMoney ? (
                          <span className={c === 'totalOutstanding' && Number(value) > 0 ? 'font-semibold text-amber-700' : ''}>
                            {feeInr(Number(value))}
                          </span>
                        ) : c === 'overallFeeStatus' ? (
                          <Badge
                            variant={
                              value === 'Fully Paid'
                                ? 'success'
                                : value === 'Partially Paid'
                                  ? 'warning'
                                  : value === 'Waived (Full)' || value === 'Refunded'
                                    ? 'info'
                                    : 'danger'
                            }
                          >
                            {String(value)}
                          </Badge>
                        ) : (
                          String(value ?? '—')
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FeeGenerateModal({
  open,
  onClose,
  reports,
  matched,
  onGenerated
}: {
  open: boolean;
  onClose: () => void;
  reports: FeeReportDef[];
  matched: number;
  onGenerated: (info: { title: string; format: string }) => void;
}) {
  const [dateFrom, setDateFrom] = useState('2025-04-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [className, setClassName] = useState('All Classes');
  const [format, setFormat] = useState('PDF');
  const [email, setEmail] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);

  if (!open) return null;

  const title = reports.length === 1 ? reports[0].title : `${reports.length} selected fee reports`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Generate Fee Report</h3>
              <p className="text-xs text-gray-500">
                {title} · {matched} fee accounts currently in scope
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 max-h-32 overflow-auto">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 mb-1">
              Reports selected ({reports.length})
            </p>
            <ul className="space-y-0.5">
              {reports.map((r) => (
                <li key={r.code} className="text-[11px] text-indigo-900">
                  <span className="font-semibold">{r.code}</span> — {r.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Class</label>
              <Select
                options={[
                  { value: 'All Classes', label: 'All Classes' },
                  ...FEE_CLASSES.map((c) => ({ value: c, label: c }))
                ]}
                value={className}
                onChange={(v: any) => setClassName(typeof v === 'string' ? v : v?.target?.value ?? 'All Classes')}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Output Format</label>
              <Select
                options={[
                  { value: 'PDF', label: 'PDF' },
                  { value: 'Excel', label: 'Excel (.xlsx)' },
                  { value: 'CSV', label: 'CSV' },
                  { value: 'Print', label: 'Print Preview' }
                ]}
                value={format}
                onChange={(v: any) => setFormat(typeof v === 'string' ? v : v?.target?.value ?? 'PDF')}
                className="text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Email To (comma separated)</label>
              <Input
                placeholder="principal@school.edu, accounts@school.edu"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Include detailed student-level rows in the output
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              reports.forEach((r) => onGenerated({ title: r.title, format }));
              onClose();
            }}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Generate {reports.length} Report{reports.length === 1 ? '' : 's'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Fee Reports hub — ALL search filters (17 groups / 225 filters) and ALL
// reports (249 = 59 government + 190 ERP pre-made) live on this ONE page.
// ============================================
export function FeeReportsPage() {
  const [feeDraft, setFeeDraft] = useState<Record<string, any>>({});
  const [feeApplied, setFeeApplied] = useState<Record<string, any>>({});
  const [feePanelOpen, setFeePanelOpen] = useState(true);
  const [feeRecordsOpen, setFeeRecordsOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [reportScope, setReportScope] = useState<'all' | 'government' | 'erp'>('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [genOpen, setGenOpen] = useState(false);
  const [genLog, setGenLog] = useState<{ id: string; title: string; format: string; when: string }[]>([]);

  const feeRows = useMemo(() => applyFeeFilters(FEE_ROWS_PATCHED, feeApplied), [feeApplied]);
  const feeAppliedCount = useMemo(
    () => Object.keys(feeApplied).filter((k) => !isBlankFeeValue(feeApplied[k])).length,
    [feeApplied]
  );
  const selectedDefs = useMemo(
    () => FEE_REPORTS_FLAT.filter((r) => selectedReports.includes(r.code)),
    [selectedReports]
  );

  /** Header shortcut: open the single criteria panel and scroll it into view. */
  const openFeeCriteria = () => {
    setFeePanelOpen(true);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        const el = document.getElementById('fee-criteria-panel');
        if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const setDraftValue = (id: string, value: any) => setFeeDraft((prev) => ({ ...prev, [id]: value }));
  const applyCriteria = () => setFeeApplied({ ...feeDraft });
  const resetCriteria = () => {
    setFeeDraft({});
    setFeeApplied({});
  };
  const applyPreset = (preset: Record<string, any>) => {
    setFeeDraft((prev) => ({ ...prev, ...preset }));
    setFeeApplied((prev) => ({ ...prev, ...preset }));
  };

  const toggleReport = (code: string) =>
    setSelectedReports((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  const selectGroup = (codes: string[], on: boolean) =>
    setSelectedReports((prev) => (on ? Array.from(new Set([...prev, ...codes])) : prev.filter((c) => !codes.includes(c))));

  /** Client-side CSV download (no alert() — keeps the sandboxed preview working). */
  const feeDownloadCsv = (data: any[], filename: string) => {
    const clean = data.map((row) => {
      const out: any = {};
      Object.entries(row).forEach(([k, v]) => {
        if (typeof v !== 'function' && typeof v !== 'object') out[k] = v;
      });
      return out;
    });
    if (clean.length === 0) return;
    const headers = Object.keys(clean[0]).join(',');
    const lines = clean.map((row) =>
      Object.values(row)
        .map((v) => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v))
        .join(',')
    );
    const blob = new Blob([[headers, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportReportList = (fmt: 'csv' | 'excel') => {
    feeDownloadCsv(
      FEE_REPORTS_FLAT.map((r) => ({
        'Report Code': r.code,
        'Report Name': r.title,
        'Report Type': r.group === 'government' ? 'Government' : 'ERP Pre-made',
        Category: r.category,
        Selected: selectedReports.includes(r.code) ? 'Yes' : 'No'
      })),
      fmt === 'excel' ? 'fee-reports-master-list-excel' : 'fee-reports-master-list'
    );
  };

  const exportMatchedRecords = () => {
    feeDownloadCsv(
      feeRows.map((r) => ({
        'Student ID': r.studentId,
        Student: r.studentName,
        Class: `${r.className} ${r.section}`,
        'Fee Head': r.feeHead,
        'Invoice No': r.invoiceNo,
        Invoiced: r.totalInvoiced,
        Collected: r.totalCollected,
        Outstanding: r.totalOutstanding,
        Status: r.overallFeeStatus,
        'Payment Mode': r.paymentMode,
        'Receipt No': r.receiptNo,
        'Due Date': r.feeDueDate
      })),
      'fee-report-matched-records'
    );
  };

  const feeStats = [
    { label: 'Filter Groups', value: String(FEE_FILTER_GROUPS.length), tone: 'text-gray-900' },
    { label: 'Search Filters', value: String(TOTAL_FEE_FILTERS), tone: 'text-indigo-700' },
    { label: 'Total Reports', value: String(TOTAL_FEE_REPORTS), tone: 'text-gray-900' },
    { label: 'Government Reports', value: String(FEE_GOV_REPORT_COUNT), tone: 'text-indigo-700' },
    { label: 'ERP Pre-made Reports', value: String(FEE_ERP_REPORT_COUNT), tone: 'text-emerald-700' },
    { label: 'Fee Accounts in Scope', value: `${feeRows.length} / ${FEE_ROWS_PATCHED.length}`, tone: 'text-amber-700' }
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Fee Reports
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2 py-0.5">
                FY 2025-26
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {FEE_FILTER_GROUPS.length} filter groups ({TOTAL_FEE_FILTERS} filters) and {TOTAL_FEE_REPORTS} reports on one page
              {feeAppliedCount > 0 ? ` · ${feeAppliedCount} filters applied` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={openFeeCriteria}>
            <Filter className="w-4 h-4 mr-1" />
            Report Criteria
          </Button>
          <Button variant="outline" size="sm" onClick={exportMatchedRecords}>
            <Download className="w-4 h-4 mr-1" />
            Export Records
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              if (selectedReports.length === 0) {
                openFeeCriteria();
              } else {
                setGenOpen(true);
              }
            }}
          >
            <Play className="w-4 h-4 mr-1" />
            Generate Report{selectedReports.length > 0 ? ` (${selectedReports.length})` : ''}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {feeStats.map((s) => (
          <Card key={s.label} className="rounded-xl border border-gray-200 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className={`text-lg font-bold ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Generated-in-session log */}
      {genLog.length > 0 && (
        <Card className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-emerald-900">
                Generated in this session ({genLog.length})
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setGenLog([])}>
              <X className="w-4 h-4 mr-1" />
              Clear log
            </Button>
          </div>
          <ul className="space-y-1">
            {genLog.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-900">
                <Badge variant="success">{g.format}</Badge>
                <span className="font-semibold">{g.title}</span>
                <span className="text-emerald-700">· {g.when}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ONE criteria panel — all 17 groups / 228 filters */}
      <FeeCriteriaPanel
        draft={feeDraft}
        applied={feeApplied}
        onChange={setDraftValue}
        onApply={applyCriteria}
        onReset={resetCriteria}
        onQuick={applyPreset}
        rows={feeRows}
        totalRows={FEE_ROWS_PATCHED.length}
        open={feePanelOpen}
        setOpen={setFeePanelOpen}
        onViewRecords={() => setFeeRecordsOpen(true)}
      />

      {/* ALL reports — 249 in one catalogue */}
      <FeeReportCatalog
        search={reportSearch}
        setSearch={setReportSearch}
        scope={reportScope}
        setScope={setReportScope}
        selected={selectedReports}
        toggleReport={toggleReport}
        selectGroup={selectGroup}
        clearSelection={() => setSelectedReports([])}
        onGenerate={() => {
          if (selectedReports.length === 0) {
            setReportSearch('');
            setReportScope('all');
            return;
          }
          setGenOpen(true);
        }}
        onExportList={exportReportList}
        generatedCount={genLog.length}
        matchedCount={feeRows.length}
      />

      <FeeRecordsModal open={feeRecordsOpen} onClose={() => setFeeRecordsOpen(false)} rows={feeRows} />
      <FeeGenerateModal
        open={genOpen}
        onClose={() => setGenOpen(false)}
        reports={selectedDefs}
        matched={feeRows.length}
        onGenerated={(info) =>
          setGenLog((prev) => [
            {
              id: `${info.title}-${prev.length + 1}`,
              title: info.title,
              format: info.format,
              when: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            },
            ...prev
          ])
        }
      />
    </div>
  );
}
