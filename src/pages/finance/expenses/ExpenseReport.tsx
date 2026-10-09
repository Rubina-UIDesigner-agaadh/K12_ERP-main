// ============================================================================
// Expense Reports Central — SINGLE UNIFIED EXPENSE REPORTS PAGE
// ----------------------------------------------------------------------------
// This one page replaces every separate expense report-criteria screen:
//   • Detailed Expense Register      • Budget vs Actual Report
//   • Department-wise Expense        • Vendor-wise Expense
//   • Petty Cash Report
//
// It contains:
//   1. ONE criteria panel holding every expense report filter (9 groups).
//   2. The complete expense report library — 88 reports:
//        20 statutory / regulatory returns (auditor, ministry, GST, TDS, EPFO…)
//        68 operational reports (request, PO, GRN, bill, payment, vendor,
//        financial analysis, audit support)
//      Each report renders live from the applied criteria.
// ============================================================================
import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Receipt,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Printer,
  Download,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  Calculator
} from 'lucide-react';

// ============================================================================
// SECTION 1 : EXPENSE REPORT CRITERIA — 9 GROUPS IN ONE PANEL
// ============================================================================
type FilterKind = 'select' | 'multiselect' | 'text' | 'date' | 'daterange' | 'range' | 'toggle';

interface FilterDef {
  id: string;
  label: string;
  kind: FilterKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  unit?: string;
}

interface FilterGroup {
  id: string;
  title: string;
  filters: FilterDef[];
}

const sel = (id: string, label: string, options: string[], hint?: string): FilterDef => ({
  id,
  label,
  kind: 'select',
  options,
  hint
});
const multi = (id: string, label: string, options: string[], hint?: string): FilterDef => ({
  id,
  label,
  kind: 'multiselect',
  options,
  hint
});
const txt = (id: string, label: string, placeholder?: string): FilterDef => ({
  id,
  label,
  kind: 'text',
  placeholder
});
const dtr = (id: string, label: string, hint?: string): FilterDef => ({
  id,
  label,
  kind: 'daterange',
  hint
});
const rng = (id: string, label: string, min: number, max: number, unit = ''): FilterDef => ({
  id,
  label,
  kind: 'range',
  min,
  max,
  unit
});
const tog = (id: string, label: string, hint?: string): FilterDef => ({
  id,
  label,
  kind: 'toggle',
  hint
});

const MONTHS = [
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

const EXPENSE_CATEGORIES = [
  'Stationery',
  'Lab Equipment',
  'IT Equipment',
  'Furniture',
  'Sports Equipment',
  'Books & Library',
  'Maintenance',
  'Utilities',
  'Transport',
  'Events',
  'Staff Welfare',
  'Printing',
  'Cleaning',
  'Security',
  'Insurance',
  'Rent',
  'Other'
];

const EXPENSE_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'g1',
    title: '🗓️ Group 1 : Date & Period Filters',
    filters: [
      sel('financialYear', 'Financial Year', ['All Years', 'FY 2023-24', 'FY 2024-25', 'FY 2025-26']),
      multi('month', 'Month', MONTHS, 'April to March'),
      sel('quarter', 'Quarter', ['All', 'Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)']),
      dtr('expenseRequestDateRange', 'Expense Request Date Range', 'When the expense was requested'),
      dtr('poDateRange', 'PO Date Range', 'When the purchase order was created'),
      dtr('grnDateRange', 'GRN Date Range', 'When goods were received'),
      dtr('billDateRange', 'Bill / Invoice Date Range', "Date on vendor's invoice"),
      dtr('billReceivedDateRange', 'Bill Received Date Range', 'When school received the bill'),
      dtr('approvalDateRange', 'Approval Date Range', 'When the bill was approved'),
      dtr('paymentDateRange', 'Payment Date Range', 'When payment was made to vendor'),
      dtr('dueDateRange', 'Due Date Range', 'When payment was due'),
      tog('overdueOnly', 'Overdue Only', 'Yes — show only overdue bills')
    ]
  },
  {
    id: 'g2',
    title: '🏷️ Group 2 : Expense Category & Type Filters',
    filters: [
      multi('category', 'Expense Category', EXPENSE_CATEGORIES),
      sel('expenseType', 'Expense Type', [
        'All',
        'Capital Expense (long-term asset)',
        'Revenue Expense (day-to-day cost)'
      ]),
      multi('expenseHead', 'Expense Head / Account', [
        'All Expense Accounts',
        'Electricity Charges',
        'Repairs & Maintenance',
        'Office Stationery',
        'Lab Consumables',
        'IT & Software Licences',
        'Sports Equipment',
        'Library Books & Journals',
        'Housekeeping & Cleaning',
        'Carriage & Freight',
        'Rent — Building',
        'Security Services',
        'Insurance Premium'
      ], 'All expense accounts from Chart of Accounts in GL'),
      sel('budgetCategory', 'Budget Category', [
        'All',
        'Academic Budget',
        'Administrative Budget',
        'Capital Budget',
        'Maintenance Budget',
        'Utility Budget',
        'Welfare Budget'
      ]),
      sel('recurringExpense', 'Recurring Expense', ['All', 'Recurring', 'Non-Recurring']),
      sel('billType', 'Bill Type', ['All', 'PO-Based', 'Direct Bill', 'Recurring Bill', 'Advance Bill']),
      sel('isPettyCash', 'Is Petty Cash', ['All', 'Yes — Petty Cash', 'No — Regular'])
    ]
  },
  {
    id: 'g3',
    title: '🏢 Group 3 : Department & Purpose Filters',
    filters: [
      multi('department', 'Department', [
        'Administration',
        'Academic',
        'Science Lab',
        'Computer Lab',
        'Library',
        'Sports',
        'Hostel',
        'Transport',
        'Kitchen',
        'Maintenance',
        'Accounts',
        'Management'
      ]),
      sel('requestedBy', 'Requested By (Staff)', [
        'All',
        'Administration Officer',
        'Academic Coordinator',
        'Lab Assistant',
        'IT Coordinator',
        'Librarian',
        'Sports Coach',
        'Hostel Warden',
        'Transport In-charge',
        'Accounts Officer'
      ]),
      sel('approvedByStaff', 'Approved By (Staff)', [
        'All',
        'Finance Head',
        'Principal',
        'Management Trustee',
        'Department Head',
        'Vice Principal'
      ]),
      txt('purpose', 'Purpose / Description', 'Free text search in narration / description'),
      sel('project', 'Project / Event', [
        'All',
        'Annual Sports Meet',
        'Science Exhibition',
        'Annual Day Function',
        'Building Renovation',
        'IT Infrastructure Upgrade',
        'Board Exam Preparation',
        'Not Linked to Project'
      ])
    ]
  },
  {
    id: 'g4',
    title: '👥 Group 4 : Vendor Filters',
    filters: [
      multi('vendor', 'Vendor Name', [
        'Global Electricity Corporation Ltd',
        'Modern Stationery Hub Pvt Ltd',
        'Apex Maintenance Services',
        'Tech Solutions Pvt Ltd',
        'Bounty Catering & Events',
        'City Water Works',
        'Sports World Equipment',
        'Swift Transport Co.',
        'SafeGuard Security Services',
        'SecureLife Insurance Co.'
      ], 'Search or select from vendor master'),
      txt('vendorCode', 'Vendor Code', 'Specific vendor code'),
      sel('vendorType', 'Vendor Type', [
        'All',
        'Supplier',
        'Service Provider',
        'Contractor',
        'Utility',
        'Rent',
        'Government',
        'Other'
      ]),
      multi('vendorCategory', 'Vendor Category', [
        'Stationery',
        'Lab',
        'IT',
        'Sports',
        'Maintenance',
        'Printing',
        'Transport',
        'Utility'
      ]),
      txt('vendorGSTIN', 'GSTIN', "Search by vendor's GSTIN"),
      sel('msmeVendor', 'MSME Vendor', ['All', 'MSME', 'Non-MSME']),
      sel('blacklistedVendor', 'Blacklisted Vendor', [
        'All',
        'Active Vendors Only',
        'Blacklisted Only'
      ])
    ]
  },
  {
    id: 'g5',
    title: '📄 Group 5 : Document Reference Filters',
    filters: [
      txt('expenseRequestNo', 'Expense Request No.', 'e.g. EXP-REQ-2025-001'),
      txt('poNo', 'Purchase Order No.', 'e.g. PO-2025-001'),
      txt('grnNo', 'GRN No.', 'e.g. GRN-2025-001'),
      txt('billNo', 'Bill / Invoice No. (ERP)', 'e.g. BILL-2025-001'),
      txt('vendorInvoiceNo', 'Vendor Invoice No.', "As printed on vendor's invoice"),
      txt('paymentNo', 'Payment No.', 'e.g. PAY-2025-001'),
      txt('journalEntryNo', 'Journal Entry No.', 'e.g. JV-2025-045'),
      txt('chequeNo', 'Cheque No.', 'Cheque number used for payment'),
      txt('bankRefNo', 'Bank Reference / UTR No.', 'NEFT / RTGS / UPI reference number')
    ]
  },
  {
    id: 'g6',
    title: '📊 Group 6 : Status Filters',
    filters: [
      multi('expenseRequestStatus', 'Expense Request Status', [
        'Draft',
        'Submitted',
        'Approved',
        'Rejected',
        'PO Created',
        'Completed'
      ]),
      multi('poStatus', 'Purchase Order Status', [
        'Draft',
        'Sent to Vendor',
        'Acknowledged',
        'Partially Received',
        'Fully Received',
        'Closed',
        'Cancelled'
      ]),
      multi('grnStatus', 'GRN Status', ['Full Receipt', 'Partial Receipt', 'Rejected', 'Pending']),
      multi('billStatus', 'Bill Status', [
        'Received',
        'Under Verification',
        'Verified',
        'Pending Approval',
        'Approved',
        'Rejected',
        'On Hold',
        'Paid',
        'Partially Paid',
        'Cancelled'
      ]),
      multi('paymentStatus', 'Payment Status', [
        'Pending',
        'Partially Paid',
        'Fully Paid',
        'Overdue',
        'Advance Paid'
      ]),
      sel('threeWayMatch', '3-Way Match Status', ['All', 'Matched', 'Mismatch Found', 'Not Applicable']),
      sel('overdueStatus', 'Overdue Status', [
        'All',
        'Overdue',
        'Due Today',
        'Due This Week',
        'Not Overdue'
      ])
    ]
  },
  {
    id: 'g7',
    title: '💰 Group 7 : Amount Filters',
    filters: [
      rng('billAmountRange', 'Bill Amount (Range)', 0, 9999999, '₹'),
      rng('paymentAmountRange', 'Payment Amount (Range)', 0, 9999999, '₹'),
      rng('outstandingAmountRange', 'Outstanding Amount (Range)', 0, 9999999, '₹'),
      rng('gstAmountRange', 'GST Amount (Range)', 0, 999999, '₹'),
      sel('tdsDeducted', 'TDS Deducted', ['All', 'TDS Applied', 'No TDS']),
      rng('tdsAmountRange', 'TDS Amount (Range)', 0, 999999, '₹'),
      sel('tdsSection', 'TDS Section', ['All', '194C', '194J', '194A', '194I', 'Others']),
      sel('budgetStatus', 'Budget Status', [
        'All',
        'Within Budget',
        'Near Limit (>80%)',
        'Over Budget'
      ])
    ]
  },
  {
    id: 'g8',
    title: '💳 Group 8 : Payment Method Filters',
    filters: [
      multi('paymentMode', 'Payment Mode', ['Cash', 'Cheque', 'NEFT', 'RTGS', 'UPI', 'IMPS', 'DD', 'Advance']),
      sel('bankAccount', 'Bank Account Used', [
        'All',
        'SBI — Current A/c XXXX4521',
        'HDFC — Operational A/c XXXX9912',
        'ICICI — Fee Collection A/c XXXX8841',
        'Petty Cash — Admin Office'
      ]),
      sel('paymentType', 'Payment Type', ['All', 'Full Payment', 'Partial Payment', 'Advance Payment']),
      sel('advancePayment', 'Advance Payment', [
        'All',
        'Advance Paid',
        'Advance Adjusted',
        'Advance Pending'
      ])
    ]
  },
  {
    id: 'g9',
    title: '🔍 Group 9 : Audit & Compliance Filters',
    filters: [
      sel('createdBy', 'Created By', [
        'All',
        'Administration Officer',
        'Accounts Officer',
        'Academic Coordinator',
        'IT Coordinator',
        'Facilities In-charge'
      ]),
      sel('verifiedBy', 'Verified By', [
        'All',
        'Accounts Officer',
        'Internal Auditor',
        'Store Keeper',
        'Office Superintendent'
      ]),
      sel('approvedBy', 'Approved By', [
        'All',
        'Finance Head',
        'Principal',
        'Management Trustee',
        'Department Head'
      ]),
      sel('paidBy', 'Paid By', ['All', 'Accounts Officer', 'Cashier', 'Finance Manager']),
      sel('supportingDoc', 'Supporting Doc Attached', [
        'All',
        'Yes — Document Attached',
        'No — Missing'
      ]),
      sel('gstInvoiceType', 'GST Invoice', ['All', 'GST Invoice', 'Non-GST / Proforma']),
      sel('eInvoice', 'E-Invoice', ['All', 'E-Invoice', 'Regular Invoice'])
    ]
  }
];

const TOTAL_EXPENSE_FILTERS = EXPENSE_FILTER_GROUPS.reduce((s, g) => s + g.filters.length, 0);

// filter id -> dataset key (real row filtering)
const APPLY_KEYS: Record<string, string> = {
  financialYear: 'financialYear',
  month: 'monthName',
  quarter: 'quarter',
  category: 'category',
  expenseType: 'expenseType',
  expenseHead: 'head',
  budgetCategory: 'budgetCategory',
  recurringExpense: 'recurringLabel',
  billType: 'billType',
  isPettyCash: 'pettyCashLabel',
  department: 'department',
  requestedBy: 'requestedBy',
  approvedByStaff: 'approvedBy',
  purpose: 'description',
  project: 'project',
  vendor: 'vendor',
  vendorCode: 'vendorCode',
  vendorType: 'vendorType',
  vendorCategory: 'vendorCategory',
  vendorGSTIN: 'vendorGSTIN',
  msmeVendor: 'msmeLabel',
  blacklistedVendor: 'blacklistLabel',
  expenseRequestNo: 'expenseRequestNo',
  poNo: 'poNo',
  grnNo: 'grnNo',
  billNo: 'billNo',
  vendorInvoiceNo: 'vendorInvoiceNo',
  paymentNo: 'paymentNo',
  journalEntryNo: 'journalEntryNo',
  chequeNo: 'chequeNo',
  bankRefNo: 'bankRefNo',
  expenseRequestStatus: 'expenseRequestStatus',
  poStatus: 'poStatus',
  grnStatus: 'grnStatus',
  billStatus: 'billStatus',
  paymentStatus: 'paymentStatus',
  threeWayMatch: 'threeWayMatch',
  overdueStatus: 'overdueStatus',
  tdsDeducted: 'tdsLabel',
  tdsSection: 'tdsSection',
  budgetStatus: 'budgetStatus',
  paymentMode: 'paymentMode',
  bankAccount: 'bankAccount',
  paymentType: 'paymentType',
  advancePayment: 'advanceStatus',
  createdBy: 'createdBy',
  verifiedBy: 'verifiedBy',
  paidBy: 'paidBy',
  supportingDoc: 'supportingDocLabel',
  gstInvoiceType: 'gstInvoiceType',
  eInvoice: 'eInvoice'
};

const APPLY_DATES: Record<string, string> = {
  expenseRequestDateRange: 'expenseRequestDate',
  poDateRange: 'poDate',
  grnDateRange: 'grnDate',
  billDateRange: 'billDate',
  billReceivedDateRange: 'billReceivedDate',
  approvalDateRange: 'approvalDate',
  paymentDateRange: 'paymentDate',
  dueDateRange: 'dueDate'
};

const APPLY_RANGES: Record<string, string> = {
  billAmountRange: 'billAmount',
  paymentAmountRange: 'paymentAmount',
  outstandingAmountRange: 'outstandingAmount',
  gstAmountRange: 'gstAmount',
  tdsAmountRange: 'tdsAmount'
};

const TEXT_SEARCH_FILTERS = [
  'vendorCode',
  'vendorGSTIN',
  'expenseRequestNo',
  'poNo',
  'grnNo',
  'billNo',
  'vendorInvoiceNo',
  'paymentNo',
  'journalEntryNo',
  'chequeNo',
  'bankRefNo',
  'purpose'
];

// ============================================================================
// SECTION 2 : EXPENSE MASTER DATASET (drives every report)
// ============================================================================
interface ExpenseRow {
  id: string;
  /* ---- period ---- */
  financialYear: string;
  academicYear: string;
  quarter: string;
  monthName: string;
  expenseRequestDate: string;
  poDate: string;
  grnDate: string;
  billDate: string;
  billReceivedDate: string;
  approvalDate: string;
  paymentDate: string;
  dueDate: string;
  postingDate: string;
  /* ---- document references ---- */
  expenseRequestNo: string;
  poNo: string;
  grnNo: string;
  billNo: string;
  vendorInvoiceNo: string;
  paymentNo: string;
  journalEntryNo: string;
  chequeNo: string;
  bankRefNo: string;
  /* ---- classification ---- */
  category: string;
  expenseType: string;
  head: string;
  budgetCategory: string;
  billType: string;
  isPettyCash: string;
  /* ---- department & purpose ---- */
  department: string;
  costCenter: string;
  project: string;
  description: string;
  requestedBy: string;
  /* ---- vendor ---- */
  vendor: string;
  vendorCode: string;
  vendorType: string;
  vendorCategory: string;
  vendorGSTIN: string;
  msme: string;
  blacklisted: string;
  paymentTerms: string;
  /* ---- amounts ---- */
  billAmount: number;
  gstAmount: number;
  tdsAmount: number;
  billTotal: number;
  paymentAmount: number;
  outstandingAmount: number;
  tdsSection: string;
  gstRateLabel: string;
  budgetCode: string;
  budgetAllocated: number;
  budgetUtilized: number;
  budgetVariancePct: number;
  /* ---- status ---- */
  expenseRequestStatus: string;
  poStatus: string;
  grnStatus: string;
  billStatus: string;
  paymentStatus: string;
  threeWayMatch: string;
  overdueStatus: string;
  budgetStatus: string;
  /* ---- payment ---- */
  paymentMode: string;
  bankAccount: string;
  paymentType: string;
  advanceStatus: string;
  /* ---- audit & compliance ---- */
  createdBy: string;
  verifiedBy: string;
  approvedBy: string;
  paidBy: string;
  supportingDoc: string;
  gstInvoiceType: string;
  eInvoice: string;
  /* ---- derived label helpers used by the criteria engine ---- */
  recurringLabel: string;
  pettyCashLabel: string;
  msmeLabel: string;
  blacklistLabel: string;
  tdsLabel: string;
  supportingDocLabel: string;
}

const EXPENSE_DEFAULTS: ExpenseRow = {
  id: '0',
  financialYear: 'FY 2025-26',
  academicYear: '2025-26',
  quarter: 'Q2 (Jul-Sep)',
  monthName: 'July',
  expenseRequestDate: '2025-07-02',
  poDate: '2025-07-05',
  grnDate: '2025-07-08',
  billDate: '2025-07-09',
  billReceivedDate: '2025-07-10',
  approvalDate: '2025-07-11',
  paymentDate: '2025-07-12',
  dueDate: '2025-08-11',
  postingDate: '2025-07-13',
  expenseRequestNo: 'EXP-REQ-2025-0001',
  poNo: 'PO-2025-0001',
  grnNo: 'GRN-2025-0001',
  billNo: 'BILL-2025-0001',
  vendorInvoiceNo: 'INV-0001',
  paymentNo: 'PAY-2025-0001',
  journalEntryNo: 'JV-2025-0001',
  chequeNo: '—',
  bankRefNo: 'UTR2025XXXXXX',
  category: 'Stationery',
  expenseType: 'Revenue Expense (day-to-day cost)',
  head: 'Office Stationery',
  budgetCategory: 'Administrative Budget',
  billType: 'PO-Based',
  isPettyCash: 'No',
  department: 'Administration',
  costCenter: 'CC-ADM-01 Admin Block',
  project: 'Not Linked to Project',
  description: 'Office supplies purchase',
  requestedBy: 'Administration Officer',
  vendor: 'Modern Stationery Hub Pvt Ltd',
  vendorCode: 'VND-2025-014',
  vendorType: 'Supplier',
  vendorCategory: 'Stationery',
  vendorGSTIN: '24ABCDE1234F1Z5',
  msme: 'MSME',
  blacklisted: 'Active Vendors Only',
  paymentTerms: 'Net 30',
  billAmount: 10000,
  gstAmount: 1800,
  tdsAmount: 0,
  billTotal: 11800,
  paymentAmount: 11800,
  outstandingAmount: 0,
  tdsSection: '—',
  gstRateLabel: '18%',
  budgetCode: 'BDG-ADM-2025',
  budgetAllocated: 500000,
  budgetUtilized: 260000,
  budgetVariancePct: -48,
  expenseRequestStatus: 'Completed',
  poStatus: 'Fully Received',
  grnStatus: 'Full Receipt',
  billStatus: 'Paid',
  paymentStatus: 'Fully Paid',
  threeWayMatch: 'Matched',
  overdueStatus: 'Not Overdue',
  budgetStatus: 'Within Budget',
  paymentMode: 'NEFT',
  bankAccount: 'SBI — Current A/c XXXX4521',
  paymentType: 'Full Payment',
  advanceStatus: 'All',
  createdBy: 'Administration Officer',
  verifiedBy: 'Accounts Officer',
  approvedBy: 'Finance Head',
  paidBy: 'Accounts Officer',
  supportingDoc: 'Yes',
  gstInvoiceType: 'GST Invoice',
  eInvoice: 'E-Invoice',
  recurringLabel: 'Non-Recurring',
  pettyCashLabel: 'No — Regular',
  msmeLabel: 'MSME',
  blacklistLabel: 'Active Vendors Only',
  tdsLabel: 'No TDS',
  supportingDocLabel: 'Yes — Document Attached'
};

const em = (o: Partial<ExpenseRow>): ExpenseRow => ({ ...EXPENSE_DEFAULTS, ...o });

const EXPENSES: ExpenseRow[] = [
  em({
    id: '1',
    vendor: 'Global Electricity Corporation Ltd',
    vendorCode: 'VND-2025-001',
    vendorType: 'Utility',
    vendorCategory: 'Utility',
    vendorGSTIN: '24GECL1234F1Z8',
    head: 'Electricity Charges',
    category: 'Utilities',
    budgetCategory: 'Utility Budget',
    description: 'Monthly electricity bill for July 2025 — Main Building',
    billAmount: 12500,
    gstAmount: 2250,
    billTotal: 14750,
    paymentAmount: 14750,
    expenseRequestNo: 'EXP-REQ-2025-0101',
    poNo: 'PO-2025-0188',
    grnNo: 'GRN-2025-0188',
    billNo: 'BILL-2025-0188',
    vendorInvoiceNo: 'EB-JUL-2025',
    paymentNo: 'PAY-2025-0188',
    journalEntryNo: 'JV-2025-0611',
    budgetCode: 'BDG-UTL-2025',
    budgetAllocated: 300000,
    budgetUtilized: 262000,
    budgetVariancePct: -13,
    budgetStatus: 'Near Limit (>80%)',
    department: 'Maintenance',
    costCenter: 'CC-MNT-01 Maintenance Yard',
    project: 'Not Linked to Project',
    billType: 'Recurring Bill',
    recurringLabel: 'Recurring',
    requestedBy: 'Facilities In-charge',
    approvedBy: 'Finance Head',
    createdBy: 'Facilities In-charge'
  } as Partial<ExpenseRow>),
  em({
    id: '2',
    vendor: 'Modern Stationery Hub Pvt Ltd',
    vendorCode: 'VND-2025-014',
    vendorType: 'Supplier',
    vendorCategory: 'Stationery',
    head: 'Office Stationery',
    category: 'Stationery',
    description: 'Office stationery bulk purchase — pens, paper, folders',
    billAmount: 4500,
    gstAmount: 810,
    billTotal: 5310,
    paymentAmount: 5310,
    expenseRequestNo: 'EXP-REQ-2025-0102',
    poNo: 'PO-2025-0190',
    grnNo: 'GRN-2025-0190',
    billNo: 'BILL-2025-0191',
    vendorInvoiceNo: 'INV-MSH-2025-991',
    paymentNo: 'PAY-2025-0191',
    journalEntryNo: 'JV-2025-0612',
    department: 'Administration',
    requestedBy: 'Administration Officer'
  } as Partial<ExpenseRow>),
  em({
    id: '3',
    vendor: 'Apex Maintenance Services',
    vendorCode: 'VND-2025-022',
    vendorType: 'Contractor',
    vendorCategory: 'Maintenance',
    head: 'Repairs & Maintenance',
    category: 'Maintenance',
    budgetCategory: 'Maintenance Budget',
    expenseType: 'Revenue Expense (day-to-day cost)',
    description: 'Annual maintenance contract — laboratory equipment servicing',
    billAmount: 60000,
    gstAmount: 10800,
    tdsAmount: 1200,
    tdsSection: '194C',
    tdsLabel: 'TDS Applied',
    billTotal: 70800,
    paymentAmount: 40000,
    outstandingAmount: 30800,
    expenseRequestNo: 'EXP-REQ-2025-0103',
    poNo: 'PO-2025-0191',
    grnNo: 'GRN-2025-0191',
    billNo: 'BILL-2025-0193',
    vendorInvoiceNo: 'INV-APX-2025-441',
    paymentNo: 'PAY-2025-0193',
    journalEntryNo: 'JV-2025-0620',
    budgetCode: 'BDG-MNT-2025',
    budgetAllocated: 400000,
    budgetUtilized: 428000,
    budgetVariancePct: 6,
    budgetStatus: 'Over Budget',
    billStatus: 'Partially Paid',
    paymentStatus: 'Partially Paid',
    paymentType: 'Partial Payment',
    paymentMode: 'RTGS',
    department: 'Science Lab',
    costCenter: 'CC-LAB-01 Science Block',
    project: 'Not Linked to Project',
    requestedBy: 'Lab Assistant',
    verifiedBy: 'Internal Auditor',
    createdBy: 'Academic Coordinator',
    gstInvoiceType: 'GST Invoice',
    eInvoice: 'Regular Invoice'
  } as Partial<ExpenseRow>),
  em({
    id: '4',
    vendor: 'Bounty Catering & Events',
    vendorCode: 'VND-2025-031',
    vendorType: 'Service Provider',
    vendorCategory: 'Printing',
    head: 'Events & Functions',
    category: 'Events',
    budgetCategory: 'Welfare Budget',
    description: 'Annual day celebration catering and stage arrangements',
    billAmount: 85000,
    gstAmount: 15300,
    billTotal: 100300,
    paymentAmount: 0,
    outstandingAmount: 100300,
    expenseRequestNo: 'EXP-REQ-2025-0104',
    poNo: 'PO-2025-0195',
    grnNo: 'GRN-2025-0195',
    billNo: 'BILL-2025-0198',
    vendorInvoiceNo: 'INV-BCY-2025-112',
    paymentNo: '—',
    journalEntryNo: '—',
    paymentDate: '—',
    approvalDate: '—',
    postingDate: '—',
    expenseRequestStatus: 'PO Created',
    poStatus: 'Sent to Vendor',
    grnStatus: 'Pending',
    billStatus: 'Pending Approval',
    paymentStatus: 'Pending',
    budgetCode: 'BDG-EVT-2025',
    budgetAllocated: 150000,
    budgetUtilized: 142000,
    budgetVariancePct: -5,
    budgetStatus: 'Near Limit (>80%)',
    paymentMode: '—',
    paymentType: '—',
    department: 'Management',
    costCenter: 'CC-MGT-01 Admin Block',
    project: 'Annual Day Function',
    requestedBy: 'Administration Officer',
    approvedBy: '—',
    verifiedBy: '—',
    supportingDoc: 'No',
    supportingDocLabel: 'No — Missing',
    threeWayMatch: 'Mismatch Found',
    createdBy: 'Administration Officer',
    blacklisted: 'Active Vendors Only',
    eInvoice: 'Regular Invoice'
  } as Partial<ExpenseRow>),
  em({
    id: '5',
    vendor: 'Tech Solutions Pvt Ltd',
    vendorCode: 'VND-2025-045',
    vendorType: 'Supplier',
    vendorCategory: 'IT',
    head: 'IT & Software Licences',
    category: 'IT Equipment',
    budgetCategory: 'Capital Budget',
    expenseType: 'Capital Expense (long-term asset)',
    description: 'Annual ERP licence renewal and server maintenance',
    billAmount: 120000,
    gstAmount: 21600,
    tdsAmount: 2400,
    tdsSection: '194J',
    tdsLabel: 'TDS Applied',
    billTotal: 141600,
    paymentAmount: 141600,
    expenseRequestNo: 'EXP-REQ-2025-0105',
    poNo: 'PO-2025-0203',
    grnNo: 'GRN-2025-0203',
    billNo: 'BILL-2025-0207',
    vendorInvoiceNo: 'INV-TSP-2025-778',
    paymentNo: 'PAY-2025-0207',
    journalEntryNo: 'JV-2025-0633',
    bankRefNo: 'RTGS-R3019283019',
    budgetCode: 'BDG-IT-2025',
    budgetAllocated: 600000,
    budgetUtilized: 420000,
    budgetVariancePct: -30,
    budgetStatus: 'Within Budget',
    paymentMode: 'RTGS',
    isPettyCash: 'No',
    billType: 'PO-Based',
    recurringLabel: 'Recurring',
    department: 'Computer Lab',
    costCenter: 'CC-IT-01 IT & Labs',
    project: 'IT Infrastructure Upgrade',
    requestedBy: 'IT Coordinator',
    createdBy: 'IT Coordinator',
    approvedBy: 'Management Trustee',
    paidBy: 'Finance Manager',
    msme: 'Non-MSME',
    msmeLabel: 'Non-MSME',
    eInvoice: 'E-Invoice'
  } as Partial<ExpenseRow>),
  em({
    id: '6',
    vendor: 'Modern Stationery Hub Pvt Ltd',
    vendorCode: 'VND-2025-014',
    vendorType: 'Supplier',
    vendorCategory: 'Stationery',
    head: 'Office Stationery',
    category: 'Stationery',
    description: 'Petty cash purchase — whiteboard markers and dusters',
    billAmount: 1850,
    gstAmount: 0,
    gstRateLabel: '0% Exempt',
    billTotal: 1850,
    paymentAmount: 1850,
    expenseRequestNo: 'EXP-REQ-2025-0106',
    poNo: '—',
    grnNo: '—',
    billNo: 'BILL-2025-0210',
    vendorInvoiceNo: 'CASH-118',
    paymentNo: 'PAY-2025-0210',
    journalEntryNo: 'JV-2025-0640',
    bankRefNo: '—',
    isPettyCash: 'Yes',
    pettyCashLabel: 'Yes — Petty Cash',
    billType: 'Direct Bill',
    paymentMode: 'Cash',
    bankAccount: 'Petty Cash — Admin Office',
    department: 'Administration',
    threeWayMatch: 'Not Applicable',
    gstInvoiceType: 'Non-GST / Proforma',
    supportingDocLabel: 'Yes — Document Attached',
    approvedBy: 'Finance Head',
    verifiedBy: 'Store Keeper',
    createdBy: 'Administration Officer'
  } as Partial<ExpenseRow>),
  em({
    id: '7',
    vendor: 'City Water Works',
    vendorCode: 'VND-2025-052',
    vendorType: 'Utility',
    vendorCategory: 'Utility',
    vendorGSTIN: '24CTYW5678K1L2',
    head: 'Repairs & Maintenance',
    category: 'Utilities',
    budgetCategory: 'Utility Budget',
    description: 'Quarterly water charges — Hostel block',
    billAmount: 9600,
    gstAmount: 480,
    gstRateLabel: '5%',
    billTotal: 10080,
    paymentAmount: 10080,
    expenseRequestNo: 'EXP-REQ-2025-0107',
    poNo: 'PO-2025-0211',
    grnNo: 'GRN-2025-0211',
    billNo: 'BILL-2025-0215',
    vendorInvoiceNo: 'WB-Q2-2025-HB',
    paymentNo: 'PAY-2025-0215',
    journalEntryNo: 'JV-2025-0641',
    chequeNo: 'CHQ-893045',
    bankRefNo: '—',
    bankAccount: 'HDFC — Operational A/c XXXX9912',
    paymentMode: 'Cheque',
    department: 'Hostel',
    costCenter: 'CC-HST-01 Hostel Block',
    billType: 'Recurring Bill',
    recurringLabel: 'Recurring',
    requestedBy: 'Hostel Warden',
    createdBy: 'Hostel Warden'
  } as Partial<ExpenseRow>),
  em({
    id: '8',
    vendor: 'Sports World Equipment',
    vendorCode: 'VND-2025-061',
    vendorType: 'Supplier',
    vendorCategory: 'Sports',
    head: 'Sports Equipment',
    category: 'Sports Equipment',
    budgetCategory: 'Academic Budget',
    expenseType: 'Capital Expense (long-term asset)',
    description: 'Inter-school athletics kit — spikes, javelins, relay batons',
    billAmount: 45000,
    gstAmount: 8100,
    billTotal: 53100,
    paymentAmount: 53100,
    expenseRequestNo: 'EXP-REQ-2025-0108',
    poNo: 'PO-2025-0215',
    grnNo: 'GRN-2025-0215',
    billNo: 'BILL-2025-0219',
    vendorInvoiceNo: 'INV-SWE-2025-063',
    paymentNo: 'PAY-2025-0219',
    journalEntryNo: 'JV-2025-0648',
    paymentMode: 'UPI',
    bankRefNo: 'UPI-2025-7781290',
    budgetCode: 'BDG-SPT-2025',
    budgetAllocated: 200000,
    budgetUtilized: 92000,
    budgetVariancePct: -54,
    budgetStatus: 'Within Budget',
    department: 'Sports',
    costCenter: 'CC-SPT-01 Sports Complex',
    project: 'Annual Sports Meet',
    requestedBy: 'Sports Coach',
    createdBy: 'Sports Coach',
    gstInvoiceType: 'GST Invoice',
    eInvoice: 'E-Invoice'
  } as Partial<ExpenseRow>),
  em({
    id: '9',
    vendor: 'Swift Transport Co.',
    vendorCode: 'VND-2025-070',
    vendorType: 'Contractor',
    vendorCategory: 'Transport',
    head: 'Carriage & Freight',
    category: 'Transport',
    budgetCategory: 'Maintenance Budget',
    description: 'School bus diesel and interstate trip charges — July 2025',
    billAmount: 28000,
    gstAmount: 1400,
    gstRateLabel: '5%',
    billTotal: 29400,
    paymentAmount: 29400,
    expenseRequestNo: 'EXP-REQ-2025-0109',
    poNo: 'PO-2025-0218',
    grnNo: 'GRN-2025-0218',
    billNo: 'BILL-2025-0223',
    vendorInvoiceNo: 'INV-STC-2025-221',
    paymentNo: 'PAY-2025-0223',
    journalEntryNo: 'JV-2025-0655',
    budgetCode: 'BDG-TRN-2025',
    budgetAllocated: 320000,
    budgetUtilized: 338000,
    budgetVariancePct: 5,
    budgetStatus: 'Over Budget',
    department: 'Transport',
    costCenter: 'CC-TRN-01 Transport Yard',
    billType: 'Recurring Bill',
    recurringLabel: 'Recurring',
    requestedBy: 'Transport In-charge',
    createdBy: 'Transport In-charge',
    verifiedBy: 'Office Superintendent'
  } as Partial<ExpenseRow>),
  em({
    id: '10',
    vendor: 'SafeGuard Security Services',
    vendorCode: 'VND-2025-081',
    vendorType: 'Service Provider',
    vendorCategory: 'Maintenance',
    head: 'Security Services',
    category: 'Security',
    budgetCategory: 'Administrative Budget',
    description: 'Monthly campus security guard deployment — August 2025',
    billAmount: 56000,
    gstAmount: 10080,
    tdsAmount: 1120,
    tdsSection: '194C',
    tdsLabel: 'TDS Applied',
    billTotal: 66080,
    paymentAmount: 0,
    outstandingAmount: 66080,
    expenseRequestNo: 'EXP-REQ-2025-0110',
    poNo: 'PO-2025-0224',
    grnNo: 'GRN-2025-0224',
    billNo: 'BILL-2025-0230',
    vendorInvoiceNo: 'INV-SGS-2025-0901',
    paymentNo: '—',
    journalEntryNo: '—',
    paymentDate: '—',
    approvalDate: '2025-08-25',
    postingDate: '—',
    dueDate: '2025-08-20',
    billDate: '2025-08-05',
    monthName: 'August',
    quarter: 'Q2 (Jul-Sep)',
    expenseRequestStatus: 'Approved',
    poStatus: 'Fully Received',
    grnStatus: 'Full Receipt',
    billStatus: 'Approved',
    paymentStatus: 'Overdue',
    overdueStatus: 'Overdue',
    paymentMode: '—',
    paymentType: '—',
    department: 'Administration',
    costCenter: 'CC-ADM-01 Admin Block',
    requestedBy: 'Administration Officer',
    createdBy: 'Administration Officer',
    supportingDocLabel: 'Yes — Document Attached'
  } as Partial<ExpenseRow>),
  em({
    id: '11',
    vendor: 'SecureLife Insurance Co.',
    vendorCode: 'VND-2025-090',
    vendorType: 'Government',
    vendorCategory: 'Utility',
    head: 'Insurance Premium',
    category: 'Insurance',
    budgetCategory: 'Administrative Budget',
    description: 'Annual group insurance premium — students and staff',
    billAmount: 78000,
    gstAmount: 14040,
    billTotal: 92040,
    paymentAmount: 92040,
    expenseRequestNo: 'EXP-REQ-2025-0111',
    poNo: 'PO-2025-0231',
    grnNo: 'GRN-2025-0231',
    billNo: 'BILL-2025-0237',
    vendorInvoiceNo: 'INV-SLI-2025-330',
    paymentNo: 'PAY-2025-0237',
    journalEntryNo: 'JV-2025-0670',
    billType: 'Direct Bill',
    paymentMode: 'DD',
    bankRefNo: 'DD-2025-7781',
    isPettyCash: 'No',
    pettyCashLabel: 'No — Regular',
    department: 'Accounts',
    costCenter: 'CC-ACC-01 Accounts Wing',
    dueDate: '2025-09-10',
    billDate: '2025-08-11',
    billReceivedDate: '2025-08-12',
    approvalDate: '2025-08-14',
    paymentDate: '2025-08-18',
    monthName: 'August',
    requestedBy: 'Accounts Officer',
    createdBy: 'Accounts Officer',
    verifiedBy: 'Internal Auditor'
  } as Partial<ExpenseRow>),
  em({
    id: '12',
    vendor: 'Bounty Catering & Events',
    vendorCode: 'VND-2025-031',
    vendorType: 'Service Provider',
    vendorCategory: 'Printing',
    head: 'Events & Functions',
    category: 'Printing',
    budgetCategory: 'Welfare Budget',
    description: 'Science exhibition refreshments and display board printing',
    billAmount: 18600,
    gstAmount: 3348,
    billTotal: 21948,
    paymentAmount: 21948,
    expenseRequestNo: 'EXP-REQ-2025-0112',
    poNo: '—',
    grnNo: '—',
    billNo: 'BILL-2025-0242',
    vendorInvoiceNo: 'INV-BCY-2025-140',
    paymentNo: 'PAY-2025-0242',
    journalEntryNo: 'JV-2025-0668',
    chequeNo: 'CHQ-893077',
    bankRefNo: '—',
    bankAccount: 'ICICI — Fee Collection A/c XXXX8841',
    paymentMode: 'Cheque',
    billType: 'Direct Bill',
    budgetCode: 'BDG-EVT-2025',
    budgetAllocated: 150000,
    budgetUtilized: 149600,
    budgetVariancePct: 0,
    budgetStatus: 'Near Limit (>80%)',
    department: 'Academic',
    costCenter: 'CC-ACA-01 Academic Wing',
    project: 'Science Exhibition',
    threeWayMatch: 'Not Applicable',
    requestedBy: 'Academic Coordinator',
    createdBy: 'Academic Coordinator',
    supportingDoc: 'No',
    supportingDocLabel: 'No — Missing',
    gstInvoiceType: 'Non-GST / Proforma',
    eInvoice: 'Regular Invoice'
  } as Partial<ExpenseRow>)
];

const COLUMN_LABELS: Record<string, string> = {
  financialYear: 'Financial Year',
  academicYear: 'Academic Year',
  quarter: 'Quarter',
  monthName: 'Month',
  expenseRequestDate: 'Expense Request Date',
  poDate: 'PO Date',
  grnDate: 'GRN Date',
  billDate: 'Bill / Invoice Date',
  billReceivedDate: 'Bill Received Date',
  approvalDate: 'Approval Date',
  paymentDate: 'Payment Date',
  dueDate: 'Due Date',
  postingDate: 'GL Posting Date',
  expenseRequestNo: 'Expense Request No.',
  poNo: 'Purchase Order No.',
  grnNo: 'GRN No.',
  billNo: 'Bill / Invoice No.',
  vendorInvoiceNo: 'Vendor Invoice No.',
  paymentNo: 'Payment No.',
  journalEntryNo: 'Journal Entry No.',
  chequeNo: 'Cheque No.',
  bankRefNo: 'Bank Reference / UTR No.',
  category: 'Expense Category',
  expenseType: 'Expense Type',
  head: 'Expense Head / Account',
  budgetCategory: 'Budget Category',
  billType: 'Bill Type',
  isPettyCash: 'Is Petty Cash',
  department: 'Department',
  costCenter: 'Cost Center',
  project: 'Project / Event',
  description: 'Purpose / Description',
  requestedBy: 'Requested By',
  vendor: 'Vendor Name',
  vendorCode: 'Vendor Code',
  vendorType: 'Vendor Type',
  vendorCategory: 'Vendor Category',
  vendorGSTIN: 'GSTIN',
  msme: 'MSME Vendor',
  blacklisted: 'Vendor Status',
  paymentTerms: 'Payment Terms',
  billAmount: 'Bill Amount',
  gstAmount: 'GST Amount',
  tdsAmount: 'TDS Amount',
  billTotal: 'Bill Total',
  paymentAmount: 'Payment Amount',
  outstandingAmount: 'Outstanding Amount',
  tdsSection: 'TDS Section',
  gstRateLabel: 'GST Rate',
  budgetCode: 'Budget Code',
  budgetAllocated: 'Budget Allocated',
  budgetUtilized: 'Budget Utilized',
  budgetVariancePct: 'Budget Variance %',
  expenseRequestStatus: 'Expense Request Status',
  poStatus: 'Purchase Order Status',
  grnStatus: 'GRN Status',
  billStatus: 'Bill Status',
  paymentStatus: 'Payment Status',
  threeWayMatch: '3-Way Match Status',
  overdueStatus: 'Overdue Status',
  budgetStatus: 'Budget Status',
  paymentMode: 'Payment Mode',
  bankAccount: 'Bank Account Used',
  paymentType: 'Payment Type',
  advanceStatus: 'Advance Payment',
  createdBy: 'Created By',
  verifiedBy: 'Verified By',
  approvedBy: 'Approved By',
  paidBy: 'Paid By',
  supportingDoc: 'Supporting Doc Attached',
  gstInvoiceType: 'GST Invoice',
  eInvoice: 'E-Invoice'
};

// ============================================================================
// SECTION 3 : EXPENSE REPORT LIBRARY — 88 REPORTS / 9 FAMILIES
// ============================================================================
interface ReportDef {
  no: number;
  name: string;
  purpose: string;
  meta: string;
  columns: string[];
}

interface ReportFamily {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tone: 'indigo' | 'blue' | 'emerald' | 'amber' | 'purple';
  reports: ReportDef[];
}

// ---- FAMILY S : statutory / regulatory returns (required by government & auditors)
const FAMILY_S: ReportDef[] = [
  { no: 1, name: 'Audited Income & Expenditure Statement', purpose: 'Official annual financial statement', meta: 'Statutory Auditor / Trust', columns: ['financialYear', 'expenseType', 'category', 'billAmount', 'gstAmount', 'billTotal'] },
  { no: 2, name: 'Utilization Certificate', purpose: 'Proof that grant money was used for intended purpose', meta: 'Funding Ministry / State Govt.', columns: ['financialYear', 'project', 'head', 'billTotal', 'paymentAmount', 'outstandingAmount'] },
  { no: 3, name: 'Grant Utilization Report', purpose: 'Detailed report on how government grants were spent', meta: 'Granting Authority', columns: ['project', 'head', 'vendor', 'billTotal', 'paymentAmount', 'supportingDoc'] },
  { no: 4, name: 'TDS Payment Report', purpose: 'TDS deducted from vendor payments and deposited to govt.', meta: 'Income Tax Dept.', columns: ['vendor', 'vendorCode', 'vendorGSTIN', 'tdsSection', 'tdsAmount', 'paymentDate'] },
  { no: 5, name: 'TDS Returns (Form 26Q / 27Q)', purpose: 'Quarterly TDS filing with vendor-wise breakup', meta: 'Income Tax Dept.', columns: ['vendor', 'vendorCode', 'tdsSection', 'billAmount', 'tdsAmount', 'quarter'] },
  { no: 6, name: 'GST Input Credit Report', purpose: 'GST paid on purchases claimed as input credit', meta: 'GST Department', columns: ['billNo', 'vendor', 'vendorGSTIN', 'gstRateLabel', 'gstAmount', 'gstInvoiceType'] },
  { no: 7, name: 'GST Purchase Register', purpose: 'All purchases with GST details', meta: 'GST Department', columns: ['billNo', 'billDate', 'vendor', 'vendorGSTIN', 'gstRateLabel', 'gstAmount'] },
  { no: 8, name: 'MSME Outstanding Report', purpose: 'Payments outstanding to MSME vendors > 45 days', meta: 'MSME Samadhaan Portal', columns: ['vendor', 'msme', 'billNo', 'billDate', 'outstandingAmount', 'overdueStatus'] },
  { no: 9, name: 'Fixed Asset Register', purpose: 'All capital assets purchased with cost and depreciation', meta: 'Statutory Auditor', columns: ['head', 'category', 'vendor', 'billNo', 'billTotal', 'expenseType'] },
  { no: 10, name: 'Depreciation Schedule', purpose: 'Year-wise depreciation on all assets', meta: 'Statutory Auditor', columns: ['financialYear', 'head', 'category', 'expenseType', 'billTotal', 'postingDate'] },
  { no: 11, name: 'Annual Audit Report Support', purpose: 'All expense vouchers and bills for audit verification', meta: 'Statutory / Internal Auditor', columns: ['billNo', 'vendor', 'category', 'billTotal', 'supportingDoc', 'createdBy'] },
  { no: 12, name: 'Bank Reconciliation Statement', purpose: 'Match school records with bank statement', meta: 'Statutory Auditor', columns: ['bankAccount', 'paymentNo', 'bankRefNo', 'chequeNo', 'paymentAmount', 'paymentDate'] },
  { no: 13, name: 'Staff Provident Fund (PF) Report', purpose: 'PF deductions from salaries', meta: 'EPFO', columns: ['head', 'department', 'tdsSection', 'tdsAmount', 'paymentAmount', 'monthName'] },
  { no: 14, name: 'Professional Tax Report', purpose: 'PT deductions', meta: 'State Government', columns: ['head', 'department', 'tdsAmount', 'paymentAmount', 'quarter', 'financialYear'] },
  { no: 15, name: 'Building / Infrastructure Fund Utilization', purpose: 'How infrastructure grant was spent', meta: 'State Education Dept.', columns: ['project', 'head', 'vendor', 'billTotal', 'paymentAmount', 'supportingDoc'] },
  { no: 16, name: 'Mid-Day Meal Expenditure Report', purpose: 'Food / meal expense for government mid-day meal scheme', meta: 'State Education Dept.', columns: ['category', 'head', 'department', 'billTotal', 'paymentAmount', 'monthName'] },
  { no: 17, name: 'Library Grant Utilization', purpose: 'How library grant was used', meta: 'State / Central Education Dept.', columns: ['category', 'head', 'vendor', 'billTotal', 'paymentAmount', 'supportingDoc'] },
  { no: 18, name: 'Sports Fund Utilization', purpose: 'How sports grant was used', meta: 'State Education / Sports Dept.', columns: ['category', 'project', 'vendor', 'billTotal', 'paymentAmount', 'billStatus'] },
  { no: 19, name: 'SMC / PTA Fund Report', purpose: 'School Management Committee fund utilization', meta: 'State Education Dept.', columns: ['department', 'head', 'category', 'billTotal', 'paymentAmount', 'approvalDate'] },
  { no: 20, name: 'Annual Balance Sheet (School)', purpose: 'Complete financial position for the year', meta: 'Trust / Charitable Dept.', columns: ['financialYear', 'expenseType', 'category', 'billTotal', 'paymentAmount', 'outstandingAmount'] }
];

// ---- FAMILY A : expense request reports
const FAMILY_A: ReportDef[] = [
  { no: 1, name: 'All Expense Requests', purpose: 'Every expense request raised this year', meta: 'Expense Request Reports', columns: ['expenseRequestNo', 'expenseRequestDate', 'department', 'requestedBy', 'description', 'expenseRequestStatus'] },
  { no: 2, name: 'Pending Approval Requests', purpose: 'Requests waiting for approval', meta: 'Expense Request Reports', columns: ['expenseRequestNo', 'expenseRequestDate', 'department', 'requestedBy', 'billAmount', 'expenseRequestStatus'] },
  { no: 3, name: 'Approved Requests Not Yet PO Created', purpose: "Approved requests where PO hasn't been made", meta: 'Expense Request Reports', columns: ['expenseRequestNo', 'approvedBy', 'approvalDate', 'department', 'billAmount', 'poStatus'] },
  { no: 4, name: 'Rejected Expense Requests', purpose: 'Rejected requests with reasons', meta: 'Expense Request Reports', columns: ['expenseRequestNo', 'department', 'requestedBy', 'billAmount', 'expenseRequestStatus', 'approvedBy'] },
  { no: 5, name: 'Department-wise Requests', purpose: 'Requests grouped by department', meta: 'Expense Request Reports', columns: ['department', 'expenseRequestNo', 'requestedBy', 'billAmount', 'expenseRequestStatus', 'budgetStatus'] },
  { no: 6, name: 'Urgent / High Priority Requests', purpose: 'Requests marked urgent or high priority', meta: 'Expense Request Reports', columns: ['expenseRequestNo', 'expenseRequestDate', 'department', 'description', 'billAmount', 'paymentStatus'] }
];

// ---- FAMILY B : purchase order reports
const FAMILY_B: ReportDef[] = [
  { no: 7, name: 'Purchase Order Register', purpose: 'All POs created with vendor, amount, status', meta: 'Purchase Order Reports', columns: ['poNo', 'poDate', 'vendor', 'billAmount', 'poStatus', 'department'] },
  { no: 8, name: 'Open POs (Not Yet Fulfilled)', purpose: 'POs sent to vendor but delivery pending', meta: 'Purchase Order Reports', columns: ['poNo', 'poDate', 'vendor', 'billAmount', 'poStatus', 'grnStatus'] },
  { no: 9, name: 'Partially Received POs', purpose: 'POs where only some items have been received', meta: 'Purchase Order Reports', columns: ['poNo', 'vendor', 'poStatus', 'grnNo', 'grnStatus', 'billStatus'] },
  { no: 10, name: 'PO vs GRN Comparison', purpose: 'What was ordered vs what was received', meta: 'Purchase Order Reports', columns: ['poNo', 'grnNo', 'grnDate', 'vendor', 'billAmount', 'threeWayMatch'] },
  { no: 11, name: 'Vendor-wise PO Report', purpose: 'POs grouped by vendor', meta: 'Purchase Order Reports', columns: ['vendor', 'vendorCode', 'poNo', 'poDate', 'billAmount', 'poStatus'] },
  { no: 12, name: 'Category-wise PO Report', purpose: 'POs grouped by expense category', meta: 'Purchase Order Reports', columns: ['category', 'poNo', 'vendor', 'billAmount', 'budgetCategory', 'poStatus'] },
  { no: 13, name: 'PO Expiry / Overdue Delivery Report', purpose: 'POs where delivery date has passed', meta: 'Purchase Order Reports', columns: ['poNo', 'poDate', 'vendor', 'poStatus', 'grnStatus', 'overdueStatus'] },
  { no: 14, name: 'Cancelled POs Report', purpose: 'All cancelled purchase orders with reasons', meta: 'Purchase Order Reports', columns: ['poNo', 'poDate', 'vendor', 'billAmount', 'poStatus', 'approvedBy'] }
];

// ---- FAMILY C : GRN reports
const FAMILY_C: ReportDef[] = [
  { no: 15, name: 'GRN Register', purpose: 'All goods received notes', meta: 'GRN Reports', columns: ['grnNo', 'grnDate', 'vendor', 'poNo', 'billAmount', 'grnStatus'] },
  { no: 16, name: 'Partial Receipt Report', purpose: 'Items partially received from vendors', meta: 'GRN Reports', columns: ['grnNo', 'vendor', 'poNo', 'grnStatus', 'billStatus', 'threeWayMatch'] },
  { no: 17, name: 'Rejected / Damaged Goods Report', purpose: 'Items rejected at the time of receipt', meta: 'GRN Reports', columns: ['grnNo', 'grnDate', 'vendor', 'category', 'billAmount', 'grnStatus'] },
  { no: 18, name: 'GRN Pending Bill Report', purpose: 'GRNs done but vendor bill not yet received', meta: 'GRN Reports', columns: ['grnNo', 'grnDate', 'vendor', 'poNo', 'billNo', 'billStatus'] },
  { no: 19, name: 'Department-wise Goods Received Report', purpose: 'What each department received', meta: 'GRN Reports', columns: ['department', 'grnNo', 'grnDate', 'vendor', 'category', 'billAmount'] }
];

// ---- FAMILY D : bill / invoice reports
const FAMILY_D: ReportDef[] = [
  { no: 20, name: 'Bill Register (All Bills)', purpose: 'Every bill received this year with full details', meta: 'Bill / Invoice Reports', columns: ['billNo', 'billDate', 'vendor', 'vendorInvoiceNo', 'billTotal', 'billStatus'] },
  { no: 21, name: 'Pending Verification Bills', purpose: 'Bills received but not yet verified', meta: 'Bill / Invoice Reports', columns: ['billNo', 'billDate', 'vendor', 'billTotal', 'billStatus', 'verifiedBy'] },
  { no: 22, name: 'Pending Approval Bills', purpose: 'Verified bills awaiting approval', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'billTotal', 'billStatus', 'approvedBy', 'dueDate'] },
  { no: 23, name: 'Approved Unpaid Bills', purpose: 'Bills approved but payment not yet made', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'billTotal', 'paymentAmount', 'outstandingAmount', 'paymentStatus'] },
  { no: 24, name: 'Overdue Bills Report', purpose: 'Bills where payment due date has passed', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'dueDate', 'outstandingAmount', 'overdueStatus', 'paymentStatus'] },
  { no: 25, name: 'Bills Due This Week', purpose: 'Bills whose due date is within 7 days', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'dueDate', 'outstandingAmount', 'overdueStatus', 'billStatus'] },
  { no: 26, name: 'Bills Due This Month', purpose: 'All bills due in the current month', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'dueDate', 'monthName', 'outstandingAmount', 'paymentStatus'] },
  { no: 27, name: '3-Way Match Failure Report', purpose: "Bills where PO/GRN/Bill amounts don't match", meta: 'Bill / Invoice Reports', columns: ['billNo', 'poNo', 'grnNo', 'vendor', 'billTotal', 'threeWayMatch'] },
  { no: 28, name: 'Direct Bills Report', purpose: 'Bills without Purchase Orders', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'billType', 'billTotal', 'department', 'billStatus'] },
  { no: 29, name: 'Recurring Bills Report', purpose: 'Fixed recurring expenses like rent, utilities', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'category', 'billType', 'billTotal', 'budgetCategory'] },
  { no: 30, name: 'Rejected Bills Report', purpose: 'Bills rejected with rejection reasons', meta: 'Bill / Invoice Reports', columns: ['billNo', 'vendor', 'billTotal', 'billStatus', 'approvedBy', 'description'] }
];

// ---- FAMILY E : payment reports
const FAMILY_E: ReportDef[] = [
  { no: 31, name: 'Payment Register (All Payments)', purpose: 'Every payment made this year', meta: 'Payment Reports', columns: ['paymentNo', 'paymentDate', 'vendor', 'billNo', 'paymentAmount', 'paymentMode'] },
  { no: 32, name: 'Vendor-wise Payment Report', purpose: 'Payments grouped by vendor', meta: 'Payment Reports', columns: ['vendor', 'vendorCode', 'billNo', 'paymentAmount', 'outstandingAmount', 'paymentStatus'] },
  { no: 33, name: 'Payment Mode-wise Report', purpose: 'Payments via Cash / Cheque / NEFT / RTGS / UPI', meta: 'Payment Reports', columns: ['paymentMode', 'paymentNo', 'vendor', 'paymentAmount', 'bankAccount', 'paymentDate'] },
  { no: 34, name: 'TDS Deduction Report', purpose: 'All TDS deducted with section and amount', meta: 'Payment Reports', columns: ['vendor', 'tdsSection', 'tdsAmount', 'billAmount', 'paymentAmount', 'paymentDate'] },
  { no: 35, name: 'Advance Payment Report', purpose: 'All advance payments made to vendors', meta: 'Payment Reports', columns: ['vendor', 'paymentNo', 'paymentType', 'paymentAmount', 'advanceStatus', 'paymentDate'] },
  { no: 36, name: 'Advance Adjustment Report', purpose: 'Advances adjusted against bills', meta: 'Payment Reports', columns: ['vendor', 'billNo', 'paymentType', 'paymentAmount', 'advanceStatus', 'journalEntryNo'] },
  { no: 37, name: 'Pending Advance Recovery Report', purpose: 'Advances paid but not yet adjusted', meta: 'Payment Reports', columns: ['vendor', 'paymentNo', 'paymentAmount', 'advanceStatus', 'outstandingAmount', 'paymentStatus'] },
  { no: 38, name: 'Monthly Payment Summary', purpose: 'Total payments made month-wise', meta: 'Payment Reports', columns: ['monthName', 'quarter', 'paymentNo', 'vendor', 'paymentAmount', 'paymentMode'] },
  { no: 39, name: 'Cheque Status Report', purpose: 'Status of all issued cheques (cleared / pending / bounced)', meta: 'Payment Reports', columns: ['chequeNo', 'paymentDate', 'vendor', 'paymentAmount', 'bankAccount', 'paymentStatus'] },
  { no: 40, name: 'Bounced Cheques Report', purpose: 'Cheques that have bounced', meta: 'Payment Reports', columns: ['chequeNo', 'vendor', 'paymentAmount', 'bankAccount', 'paymentStatus', 'bankRefNo'] }
];

// ---- FAMILY F : vendor reports
const FAMILY_F: ReportDef[] = [
  { no: 41, name: 'Vendor Master List', purpose: 'All vendors with complete details', meta: 'Vendor Reports', columns: ['vendor', 'vendorCode', 'vendorType', 'vendorCategory', 'vendorGSTIN', 'msme'] },
  { no: 42, name: 'Vendor Outstanding Report', purpose: 'Amount still owed to each vendor', meta: 'Vendor Reports', columns: ['vendor', 'vendorCode', 'billNo', 'billTotal', 'paymentAmount', 'outstandingAmount'] },
  { no: 43, name: 'Vendor-wise Expense Summary', purpose: 'Total spent with each vendor this year', meta: 'Vendor Reports', columns: ['vendor', 'vendorType', 'category', 'billTotal', 'paymentAmount', 'financialYear'] },
  { no: 44, name: 'Vendor Aging Report', purpose: 'Outstanding grouped by age (0-30, 31-60, 61-90, 90+ days)', meta: 'Vendor Reports', columns: ['vendor', 'billNo', 'billDate', 'dueDate', 'outstandingAmount', 'overdueStatus'] },
  { no: 45, name: 'MSME Vendor Outstanding Report', purpose: 'Outstanding dues to MSME vendors (regulatory compliance)', meta: 'Vendor Reports', columns: ['vendor', 'msme', 'billNo', 'billDate', 'outstandingAmount', 'paymentStatus'] },
  { no: 46, name: 'New Vendors Added This Year', purpose: 'Vendors added to master this financial year', meta: 'Vendor Reports', columns: ['vendor', 'vendorCode', 'vendorType', 'vendorCategory', 'vendorGSTIN', 'financialYear'] },
  { no: 47, name: 'Inactive Vendors Report', purpose: 'Vendors with no transactions this year', meta: 'Vendor Reports', columns: ['vendor', 'vendorCode', 'vendorType', 'billAmount', 'billNo', 'financialYear'] },
  { no: 48, name: 'Top 10 Vendors by Spend', purpose: 'Vendors with highest expenditure this year', meta: 'Vendor Reports', columns: ['vendor', 'vendorCategory', 'billTotal', 'paymentAmount', 'outstandingAmount', 'department'] }
];

// ---- FAMILY G : financial analysis reports
const FAMILY_G: ReportDef[] = [
  { no: 49, name: 'Category-wise Expense Report', purpose: 'Total spent per category (Stationery, Lab, IT, etc.)', meta: 'Financial Analysis Reports', columns: ['category', 'head', 'billAmount', 'gstAmount', 'billTotal', 'budgetStatus'] },
  { no: 50, name: 'Department-wise Expense Report', purpose: 'Total spent per department', meta: 'Financial Analysis Reports', columns: ['department', 'costCenter', 'category', 'billTotal', 'paymentAmount', 'budgetStatus'] },
  { no: 51, name: 'Month-wise Expense Trend', purpose: 'Monthly expense totals — shows seasonal spending', meta: 'Financial Analysis Reports', columns: ['monthName', 'quarter', 'category', 'billTotal', 'paymentAmount', 'budgetCategory'] },
  { no: 52, name: 'Budget vs Actual Expense Report', purpose: 'Planned budget vs actual spending per category', meta: 'Financial Analysis Reports', columns: ['budgetCode', 'budgetCategory', 'budgetAllocated', 'budgetUtilized', 'budgetVariancePct', 'budgetStatus'] },
  { no: 53, name: 'Budget Overrun Report', purpose: 'Categories / departments that exceeded budget', meta: 'Financial Analysis Reports', columns: ['budgetCode', 'department', 'budgetAllocated', 'budgetUtilized', 'budgetVariancePct', 'budgetStatus'] },
  { no: 54, name: 'Near Budget Limit Report', purpose: 'Categories at 80%+ of budget — alert for management', meta: 'Financial Analysis Reports', columns: ['budgetCode', 'budgetCategory', 'budgetAllocated', 'budgetUtilized', 'budgetVariancePct', 'budgetStatus'] },
  { no: 55, name: 'Capital vs Revenue Expense Report', purpose: 'Long-term assets vs day-to-day expense split', meta: 'Financial Analysis Reports', columns: ['expenseType', 'category', 'head', 'billTotal', 'paymentAmount', 'budgetCategory'] },
  { no: 56, name: 'GST Input Credit Summary', purpose: 'Total GST paid on purchases claimable as credit', meta: 'Financial Analysis Reports', columns: ['gstRateLabel', 'vendor', 'billNo', 'gstAmount', 'billAmount', 'gstInvoiceType'] },
  { no: 57, name: 'GST Purchase Register', purpose: 'All purchases with GSTIN, GST rate, and amount', meta: 'Financial Analysis Reports', columns: ['billNo', 'billDate', 'vendor', 'vendorGSTIN', 'gstRateLabel', 'gstAmount'] },
  { no: 58, name: 'Expense vs Income Comparison', purpose: "School's income vs expenditure for the period", meta: 'Financial Analysis Reports', columns: ['monthName', 'category', 'billTotal', 'paymentAmount', 'budgetCategory', 'budgetStatus'] },
  { no: 59, name: 'Year-wise Expense Comparison', purpose: 'Compare spending across multiple years', meta: 'Financial Analysis Reports', columns: ['financialYear', 'academicYear', 'category', 'billTotal', 'paymentAmount', 'budgetStatus'] },
  { no: 60, name: 'Top 10 Expenses This Year', purpose: 'Biggest individual expenses of the year', meta: 'Financial Analysis Reports', columns: ['billNo', 'vendor', 'category', 'description', 'billTotal', 'department'] }
];

// ---- FAMILY H : audit support reports
const FAMILY_H: ReportDef[] = [
  { no: 61, name: 'Expense Audit Trail', purpose: 'Full log of who created / approved / paid each bill', meta: 'Audit Support Reports', columns: ['billNo', 'createdBy', 'verifiedBy', 'approvedBy', 'paidBy', 'approvalDate'] },
  { no: 62, name: 'Bills Without Supporting Documents', purpose: 'Bills where invoice / proof is missing', meta: 'Audit Support Reports', columns: ['billNo', 'vendor', 'billTotal', 'supportingDoc', 'category', 'billStatus'] },
  { no: 63, name: 'Large Expense Report (Above Threshold)', purpose: 'All expenses above a set amount (e.g. ₹1,00,000)', meta: 'Audit Support Reports', columns: ['billNo', 'vendor', 'category', 'billTotal', 'approvedBy', 'billStatus'] },
  { no: 64, name: 'Expenses Without PO', purpose: 'Bills paid without a Purchase Order (compliance issue)', meta: 'Audit Support Reports', columns: ['billNo', 'vendor', 'billType', 'poNo', 'billTotal', 'billStatus'] },
  { no: 65, name: 'Duplicate Payment Check Report', purpose: 'Identifies if same bill was paid twice', meta: 'Audit Support Reports', columns: ['vendor', 'billNo', 'vendorInvoiceNo', 'paymentNo', 'paymentAmount', 'paymentDate'] },
  { no: 66, name: 'Vendor Payment Reconciliation', purpose: "School's payment records vs vendor's statement", meta: 'Audit Support Reports', columns: ['vendor', 'billTotal', 'paymentAmount', 'outstandingAmount', 'bankRefNo', 'paymentStatus'] },
  { no: 67, name: 'Fixed Asset Purchase Report', purpose: 'All capital assets purchased this year', meta: 'Audit Support Reports', columns: ['head', 'category', 'vendor', 'billNo', 'billTotal', 'expenseType'] },
  { no: 68, name: 'Depreciation Report', purpose: 'Depreciation charged on all assets', meta: 'Audit Support Reports', columns: ['financialYear', 'head', 'category', 'expenseType', 'billTotal', 'postingDate'] }
];

const EXPENSE_REPORT_FAMILIES: ReportFamily[] = [
  {
    id: 'fs',
    code: 'S',
    title: 'Statutory & Regulatory Reports',
    subtitle: 'Required by government, auditors and regulatory bodies — auditor, ministry, GST, TDS, EPFO returns',
    tone: 'indigo',
    reports: FAMILY_S
  },
  {
    id: 'fa',
    code: 'A',
    title: 'Expense Request Reports',
    subtitle: 'Requests raised, pending, approved and rejected',
    tone: 'blue',
    reports: FAMILY_A
  },
  {
    id: 'fb',
    code: 'B',
    title: 'Purchase Order Reports',
    subtitle: 'PO register, open / partial POs and vendor-wise POs',
    tone: 'emerald',
    reports: FAMILY_B
  },
  {
    id: 'fc',
    code: 'C',
    title: 'GRN Reports',
    subtitle: 'Goods received notes, partial receipts and pending bills',
    tone: 'amber',
    reports: FAMILY_C
  },
  {
    id: 'fd',
    code: 'D',
    title: 'Bill / Invoice Reports',
    subtitle: 'Bill register, verification, approval, overdue and 3-way match exceptions',
    tone: 'purple',
    reports: FAMILY_D
  },
  {
    id: 'fe',
    code: 'E',
    title: 'Payment Reports',
    subtitle: 'Payment register, TDS, advances, cheques and monthly summaries',
    tone: 'emerald',
    reports: FAMILY_E
  },
  {
    id: 'ff',
    code: 'F',
    title: 'Vendor Reports',
    subtitle: 'Vendor master, outstanding, ageing and MSME compliance',
    tone: 'blue',
    reports: FAMILY_F
  },
  {
    id: 'fg',
    code: 'G',
    title: 'Financial Analysis Reports',
    subtitle: 'Category / department trends, budget variance and GST analysis',
    tone: 'indigo',
    reports: FAMILY_G
  },
  {
    id: 'fh',
    code: 'H',
    title: 'Audit Support Reports',
    subtitle: 'Audit trail, missing documents, duplicates and asset reports',
    tone: 'amber',
    reports: FAMILY_H
  }
];

const TOTAL_EXPENSE_REPORTS = EXPENSE_REPORT_FAMILIES.reduce((s, f) => s + f.reports.length, 0);

const TONE_STYLES: Record<string, { chip: string; head: string }> = {
  indigo: { chip: 'bg-indigo-50 text-indigo-700 border border-indigo-200', head: 'text-indigo-700' },
  blue: { chip: 'bg-blue-50 text-blue-700 border border-blue-200', head: 'text-blue-700' },
  emerald: { chip: 'bg-emerald-50 text-emerald-700 border border-emerald-200', head: 'text-emerald-700' },
  amber: { chip: 'bg-amber-50 text-amber-700 border border-amber-200', head: 'text-amber-700' },
  purple: { chip: 'bg-purple-50 text-purple-700 border border-purple-200', head: 'text-purple-700' }
};
// ============================================================================
// SECTION 4 : HELPERS + RENDERERS
// ============================================================================
const FILTER_KIND: Record<string, FilterKind> = {};
EXPENSE_FILTER_GROUPS.forEach((g) => g.filters.forEach((f) => (FILTER_KIND[f.id] = f.kind)));

const MONEY_KEYS = [
  'billAmount',
  'gstAmount',
  'tdsAmount',
  'billTotal',
  'paymentAmount',
  'outstandingAmount',
  'budgetAllocated',
  'budgetUtilized'
];
const PERCENT_KEYS = ['budgetVariancePct'];
const LIST_FIELDS: string[] = [];

const RESET_OPTION_VALUES = [
  'All',
  'All Years',
  'All Categories',
  'All Statuses',
  'All Classes'
];

const isBlank = (v: any): boolean => {
  if (v === undefined || v === null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return !v.min && !v.max;
  return false;
};

const isIgnoredOption = (v: string): boolean => RESET_OPTION_VALUES.indexOf(v) !== -1;

function applyFilters(rows: ExpenseRow[], filters: Record<string, any>): ExpenseRow[] {
  const active = Object.keys(filters).filter((k) => !isBlank(filters[k]));
  if (active.length === 0) return rows;

  return rows.filter((row) => {
    for (const id of active) {
      const raw = filters[id];

      // toggle criteria (e.g. "Overdue Only")
      if (FILTER_KIND[id] === 'toggle') {
        const want = raw === true || raw === 'Yes';
        const isOverdue = row.overdueStatus === 'Overdue';
        if (want && !isOverdue) return false;
        continue;
      }

      // date-range criteria
      if (FILTER_KIND[id] === 'daterange' && APPLY_DATES[id]) {
        const cell = String((row as any)[APPLY_DATES[id]] || '');
        if (!cell || cell === '—') return false;
        const t = Date.parse(cell);
        if (Number.isNaN(t)) return false;
        if (raw.min) {
          const from = Date.parse(raw.min);
          if (!Number.isNaN(from) && t < from) return false;
        }
        if (raw.max) {
          const to = Date.parse(raw.max);
          if (!Number.isNaN(to) && t > to) return false;
        }
        continue;
      }

      if (FILTER_KIND[id] === 'range' && APPLY_RANGES[id]) {
        const num = Number((row as any)[APPLY_RANGES[id]]) || 0;
        const min = raw.min !== '' && raw.min !== undefined ? Number(raw.min) : null;
        const max = raw.max !== '' && raw.max !== undefined ? Number(raw.max) : null;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        continue;
      }

      const key = APPLY_KEYS[id];
      if (!key) continue;
      const value = (row as any)[key];

      if (Array.isArray(raw)) {
        const picked = raw.filter((v: string) => !isIgnoredOption(v));
        if (picked.length === 0) continue;
        if (LIST_FIELDS.indexOf(key) !== -1) {
          if (!picked.some((p: string) => String(value).indexOf(p) !== -1)) return false;
          continue;
        }
        if (picked.indexOf(String(value)) === -1) return false;
        continue;
      }

      if (typeof raw === 'string') {
        if (isIgnoredOption(raw)) continue;
        if (TEXT_SEARCH_FILTERS.indexOf(id) !== -1) {
          if (String(value).toLowerCase().indexOf(raw.toLowerCase()) === -1) return false;
        } else if (String(value) !== raw) {
          return false;
        }
      }
    }
    return true;
  });
}

const formatCell = (key: string, value: any): string => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'number') {
    if (MONEY_KEYS.indexOf(key) !== -1) return '₹' + value.toLocaleString('en-IN');
    if (PERCENT_KEYS.indexOf(key) !== -1) return value + '%';
    return value.toLocaleString('en-IN');
  }
  return String(value);
};

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// ---------------------------------------------------------------------------
// Filter field renderer — all criteria live in the SAME panel
// ---------------------------------------------------------------------------
function FilterField({
  def,
  value,
  onChange
}: {
  def: FilterDef;
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

  // range
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

function KpiTile({
  label,
  value,
  note,
  tone
}: {
  label: string;
  value: string;
  note?: string;
  tone: 'indigo' | 'blue' | 'emerald' | 'amber' | 'purple';
}) {
  const tones: Record<string, { card: string; title: string; val: string }> = {
    indigo: {
      card: 'p-4 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm',
      title: 'text-indigo-600',
      val: 'text-indigo-700'
    },
    blue: {
      card: 'p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm',
      title: 'text-blue-600',
      val: 'text-blue-700'
    },
    emerald: {
      card: 'p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm',
      title: 'text-emerald-600',
      val: 'text-emerald-700'
    },
    amber: {
      card: 'p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm',
      title: 'text-amber-600',
      val: 'text-amber-700'
    },
    purple: {
      card: 'p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm',
      title: 'text-purple-600',
      val: 'text-purple-700'
    }
  };
  const t = tones[tone];
  return (
    <Card className={t.card}>
      <p className={'text-xs font-semibold uppercase tracking-wider ' + t.title}>{label}</p>
      <p className={'text-2xl font-bold mt-1 ' + t.val}>{value}</p>
      {note && <p className="text-[11px] text-gray-500 mt-1">{note}</p>}
    </Card>
  );
}

// ============================================================================
// SECTION 5 : UNIFIED EXPENSE REPORTS PAGE
// ============================================================================
export function ExpenseReport() {
  const [draftFilters, setDraftFilters] = useState<Record<string, any>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(true);
  const [reportSearch, setReportSearch] = useState<string>('');
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [collapsedFamilies, setCollapsedFamilies] = useState<Record<string, boolean>>({});
  const [selectedReport, setSelectedReport] = useState<{ family: ReportFamily; report: ReportDef } | null>(
    null
  );
  const [notice, setNotice] = useState<string>('');

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const handleFilterChange = (id: string, value: any) => {
    setDraftFilters((prev) => ({ ...prev, [id]: value }));
  };

  const appliedRows = useMemo(() => applyFilters(EXPENSES, appliedFilters), [appliedFilters]);

  const activeFilterChips = useMemo(() => {
    const chips: { id: string; label: string; value: string }[] = [];
    EXPENSE_FILTER_GROUPS.forEach((g) =>
      g.filters.forEach((f) => {
        const raw = appliedFilters[f.id];
        if (isBlank(raw)) return;
        if (Array.isArray(raw)) {
          const picked = raw.filter((v: string) => !isIgnoredOption(v));
          if (picked.length === 0) return;
          chips.push({ id: f.id, label: f.label, value: picked.join(', ') });
        } else if (typeof raw === 'object') {
          chips.push({
            id: f.id,
            label: f.label,
            value: `${raw.min || '0'} — ${raw.max || '∞'}`
          });
        } else {
          if (isIgnoredOption(String(raw))) return;
          chips.push({ id: f.id, label: f.label, value: String(raw) });
        }
      })
    );
    return chips;
  }, [appliedFilters]);

  const draftCount = useMemo(
    () => Object.keys(draftFilters).filter((k) => !isBlank(draftFilters[k])).length,
    [draftFilters]
  );

  const previewColumns = selectedReport ? selectedReport.report.columns : [];

  const totals = useMemo(() => {
    return appliedRows.reduce(
      (acc, r) => {
        acc.total += r.billTotal;
        acc.paid += r.paymentAmount;
        acc.balance += r.outstandingAmount;
        acc.tax += r.gstAmount;
        acc.tds += r.tdsAmount;
        return acc;
      },
      { total: 0, paid: 0, balance: 0, tax: 0, tds: 0 }
    );
  }, [appliedRows]);

  const familyTotals = useMemo(() => {
    return EXPENSE_REPORT_FAMILIES.map((f) => ({
      id: f.id,
      code: f.code,
      count: f.reports.length,
      title: f.title
    }));
  }, []);

  const exportPreviewCsv = () => {
    if (!selectedReport) return;
    const header = previewColumns.map((c) => COLUMN_LABELS[c] || c).join(',');
    const lines = appliedRows.map((row) =>
      previewColumns
        .map((c) => `"${String(formatCell(c, (row as any)[c])).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReport.report.name.replace(/[^A-Za-z0-9]+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    flash(`Exported "${selectedReport.report.name}" (${appliedRows.length} rows) to CSV.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Expense Reports Central
              <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                FY: 2025-26
              </Badge>
            </h1>
            <p className="text-xs text-gray-500">
              Single unified workspace — all {TOTAL_EXPENSE_FILTERS} expense report criteria and all {TOTAL_EXPENSE_REPORTS} reports in one page
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
            onClick={() => flash('Compiling all expense report sheets into the Excel workbook...')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" /> Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
            onClick={() => flash('Printing compiled expense report portfolio (PDF)...')}
          >
            <Printer className="w-4 h-4 mr-1" /> Print PDF
          </Button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          {notice}
        </div>
      )}

      {/* ---------------- KPI STRIP ---------------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiTile label="Total Reports" value={String(TOTAL_EXPENSE_REPORTS)} note="5 report families" tone="indigo" />
        <KpiTile label="Report Criteria" value={String(TOTAL_EXPENSE_FILTERS)} note="10 criteria groups" tone="blue" />
        <KpiTile label="Active Criteria" value={String(activeFilterChips.length)} note="Applied to results" tone="amber" />
        <KpiTile label="Records in Scope" value={String(appliedRows.length)} note={`of ${EXPENSES.length} vouchers`} tone="emerald" />
        <KpiTile label="Total Expenditure" value={inr(totals.total)} note={`GST ${inr(totals.tax)} · TDS ${inr(totals.tds)}`} tone="indigo" />
        <KpiTile label="Paid / Outstanding" value={inr(totals.paid)} note={`${inr(totals.balance)} outstanding`} tone="purple" />
      </div>

      {/* ==================================================================== */}
      {/* SINGLE CRITERIA PANEL — ALL 10 GROUPS INSIDE ONE PANEL               */}
      {/* ==================================================================== */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/60"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Filter className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Expense Report Criteria — All 9 Filter Groups
              </h2>
              <p className="text-[11px] text-gray-500">
                {TOTAL_EXPENSE_FILTERS} filters in a single panel · {draftCount} selected · {activeFilterChips.length} applied
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">
              {EXPENSE_FILTER_GROUPS.length} groups
            </Badge>
            {isFilterPanelOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="p-4 pt-0 space-y-5 animate-in fade-in">
            {EXPENSE_FILTER_GROUPS.map((group, gi) => (
              <div key={group.id} className={gi === 0 ? 'pt-1' : 'pt-4 border-t border-gray-100'}>
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
                    <FilterField
                      key={f.id}
                      def={f}
                      value={draftFilters[f.id]}
                      onChange={handleFilterChange}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto">
                {activeFilterChips.length === 0 ? (
                  <span className="text-[11px] text-gray-400 italic">
                    No criteria applied — all {EXPENSES.length} expense vouchers are in scope.
                  </span>
                ) : (
                  activeFilterChips.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {c.label}: {c.value}
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setDraftFilters({});
                    setAppliedFilters({});
                    flash('All expense report criteria cleared.');
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset All
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    setAppliedFilters({ ...draftFilters });
                    flash(`Filters applied — ${Object.keys(draftFilters).filter((k) => !isBlank(draftFilters[k])).length} criteria active.`);
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ==================================================================== */}
      {/* EXPENSE REPORT LIBRARY — 52 REPORTS                                  */}
      {/* ==================================================================== */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Expense Report Library — {TOTAL_EXPENSE_REPORTS} Reports
              </h2>
              <p className="text-[11px] text-gray-500">
                Click any report to generate it using the criteria applied above
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                placeholder="Search report name or purpose..."
                className="pl-9 pr-3 py-1.5 w-64 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <select
              value={familyFilter}
              onChange={(e) => setFamilyFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none"
            >
              <option value="all">All Families ({TOTAL_EXPENSE_REPORTS})</option>
              {familyTotals.map((f) => (
                <option key={f.id} value={f.id}>
                  Family {f.code} — {f.title} ({f.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {EXPENSE_REPORT_FAMILIES.filter((f) => familyFilter === 'all' || familyFilter === f.id).map(
            (family) => {
              const visible = family.reports.filter((r) => {
                if (!reportSearch.trim()) return true;
                const q = reportSearch.toLowerCase();
                return (
                  r.name.toLowerCase().indexOf(q) !== -1 ||
                  r.purpose.toLowerCase().indexOf(q) !== -1 ||
                  r.meta.toLowerCase().indexOf(q) !== -1
                );
              });
              const collapsed = !!collapsedFamilies[family.id];
              const tone = TONE_STYLES[family.tone];

              return (
                <div key={family.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div
                    className="p-3 flex items-center justify-between gap-3 bg-gray-50/70 cursor-pointer hover:bg-gray-100/70"
                    onClick={() =>
                      setCollapsedFamilies((prev) => ({ ...prev, [family.id]: !prev[family.id] }))
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={
                          'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold border ' +
                          tone.chip
                        }
                      >
                        {family.code}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{family.title}</h3>
                        <p className="text-[10px] text-gray-500">{family.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] bg-white border border-gray-200 text-gray-600">
                        {visible.length} of {family.reports.length} reports
                      </Badge>
                      {collapsed ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {!collapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                            <th className="p-3 w-12 text-center">#</th>
                            <th className="p-3">Report Name</th>
                            <th className="p-3">Purpose / Contents</th>
                            <th className="p-3">Report Family</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {visible.map((report) => {
                            const isActive =
                              selectedReport &&
                              selectedReport.family.id === family.id &&
                              selectedReport.report.no === report.no;
                            return (
                              <tr
                                key={family.id + '-' + report.no}
                                className={
                                  'transition-colors ' +
                                  (isActive ? 'bg-indigo-50/40' : 'hover:bg-indigo-50/20')
                                }
                              >
                                <td className="p-3 text-center font-mono text-gray-500">{report.no}</td>
                                <td className="p-3 font-semibold text-gray-900">
                                  {report.name}
                                  {isActive && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 text-[9px] bg-indigo-100 text-indigo-700 border border-indigo-200"
                                    >
                                      Generated
                                    </Badge>
                                  )}
                                </td>
                                <td className="p-3 text-gray-600">{report.purpose}</td>
                                <td className="p-3 text-gray-500">{report.meta}</td>
                                <td className="p-3">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-[11px] text-indigo-700 hover:bg-indigo-50"
                                      onClick={() => {
                                        setSelectedReport({ family, report });
                                        flash(`Generated "${report.name}" from ${appliedRows.length} in-scope records.`);
                                      }}
                                    >
                                      <Eye className="w-3.5 h-3.5 mr-1" /> Generate
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-[11px] text-gray-600 hover:bg-gray-100"
                                      onClick={() => {
                                        setSelectedReport({ family, report });
                                        flash(`Preparing export for "${report.name}"...`);
                                      }}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {visible.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                                No reports in this family match “{reportSearch}”.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </Card>

      {/* ==================================================================== */}
      {/* GENERATED REPORT PREVIEW                                             */}
      {/* ==================================================================== */}
      {selectedReport && (
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">{selectedReport.report.name}</h2>
                <p className="text-[11px] text-gray-500">
                  Family {selectedReport.family.code} · {selectedReport.report.meta} ·{' '}
                  {selectedReport.report.purpose}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                {appliedRows.length} records
              </Badge>
              <Button variant="outline" size="sm" className="text-xs" onClick={exportPreviewCsv}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => flash('Sending report to print queue...')}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3 border-b border-gray-100">
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Vouchers</p>
              <p className="text-lg font-bold text-gray-900">{appliedRows.length}</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Total Amount</p>
              <p className="text-lg font-bold text-indigo-700">{inr(totals.total)}</p>
            </div>
            <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Paid</p>
              <p className="text-lg font-bold text-emerald-700">{inr(totals.paid)}</p>
            </div>
            <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Outstanding</p>
              <p className="text-lg font-bold text-amber-700">{inr(totals.balance)}</p>
            </div>
            <div className="p-3 rounded-xl border border-purple-100 bg-purple-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">GST · TDS</p>
              <p className="text-lg font-bold text-purple-700">
                {inr(totals.tax)} · {inr(totals.tds)}
              </p>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mr-1">
              Criteria applied:
            </span>
            {activeFilterChips.length === 0 ? (
              <span className="text-[11px] text-gray-400 italic">None — full expense dataset</span>
            ) : (
              activeFilterChips.map((c) => (
                <span
                  key={'preview-' + c.id}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {c.label}: {c.value}
                </span>
              ))
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                  {previewColumns.map((c) => (
                    <th key={c} className="p-3 whitespace-nowrap">
                      {COLUMN_LABELS[c] || c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appliedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-indigo-50/20 transition-colors">
                    {previewColumns.map((c) => (
                      <td key={row.id + '-' + c} className="p-3 whitespace-nowrap text-gray-700">
                        {formatCell(c, (row as any)[c])}
                      </td>
                    ))}
                  </tr>
                ))}
                {appliedRows.length === 0 && (
                  <tr>
                    <td colSpan={previewColumns.length} className="p-6 text-center text-gray-400 italic">
                      No records match the applied criteria. Adjust the filters and apply again.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50 font-bold border-t border-gray-200 text-xs">
                <tr>
                  <td className="p-3 text-gray-700">Total ({appliedRows.length} records)</td>
                  {previewColumns.slice(1).map((c) =>
                    MONEY_KEYS.indexOf(c) !== -1 ? (
                      <td key={'tot-' + c} className="p-3 text-right font-mono text-gray-900">
                        {inr(appliedRows.reduce((a, b) => a + Number((b as any)[c] || 0), 0))}
                      </td>
                    ) : (
                      <td key={'tot-' + c} className="p-3 text-gray-400">
                        —
                      </td>
                    )
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* ---------------- FOOTER ---------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 px-2 pt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          K12 ERP Master System · Expense Reporting, Statutory Returns &amp; Audit Engine
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-gray-400" /> {TOTAL_EXPENSE_REPORTS} reports · {TOTAL_EXPENSE_FILTERS} criteria
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> Last generated: Today
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" /> Active Financial Year: <b>2025-26</b>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExpenseReport;
