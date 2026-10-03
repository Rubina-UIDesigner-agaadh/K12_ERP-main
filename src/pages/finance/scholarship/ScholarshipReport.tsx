// ============================================================================
// Scholarship Reports Central — SINGLE UNIFIED SCHOLARSHIP REPORTS PAGE
// ----------------------------------------------------------------------------
// This one page replaces every separate scholarship report-criteria screen:
//   • Scholarship Report (activities / sanctions / audit)
//   • Scholarship Utilization Report
//   • Pending / Rejected Applications Report
//
// It contains:
//   1. ONE filter panel holding ALL 10 scholarship report-criteria groups
//      (85 filters) — no separate panels per group.
//   2. The complete report library — all 68 scholarship reports across
//      5 statutory / internal report families, each with a live preview.
// ============================================================================
import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  FileText,
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
  Building2,
  Sparkles
} from 'lucide-react';

// ============================================================================
// SECTION 1 : FILTER SCHEMA (all 10 groups, kept inside ONE panel)
// ============================================================================
type FilterKind =
  | 'select'
  | 'multiselect'
  | 'text'
  | 'date'
  | 'daterange'
  | 'range'
  | 'slider';

interface FilterDef {
  id: string;
  label: string;
  kind: FilterKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
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
const dt = (id: string, label: string, hint?: string): FilterDef => ({ id, label, kind: 'date', hint });
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
const sld = (id: string, label: string): FilterDef => ({
  id,
  label,
  kind: 'slider',
  min: 0,
  max: 100,
  step: 5,
  unit: '%'
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

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'g1',
    title: '🗓️ Group 1 : Date & Period Filters',
    filters: [
      sel('financialYear', 'Financial Year', ['All Years', 'FY 2023-24', 'FY 2024-25', 'FY 2025-26']),
      sel('academicYear', 'Academic Year', ['All', '2023-24', '2024-25', '2025-26']),
      dt('applicationFromDate', 'Application From Date', 'Start date of application submission'),
      dt('applicationToDate', 'Application To Date', 'End date of application submission'),
      dt('approvalFromDate', 'Approval From Date', 'Start date of scholarship approval'),
      dt('approvalToDate', 'Approval To Date', 'End date of scholarship approval'),
      dt('disbursementFromDate', 'Disbursement From Date', 'Start date of disbursement'),
      dt('disbursementToDate', 'Disbursement To Date', 'End date of disbursement'),
      multi('month', 'Month', MONTHS, 'Multi-select month window'),
      sel('quarter', 'Quarter', ['All', 'Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)']),
      sel('term', 'Term', ['All', 'Term 1', 'Term 2', 'Term 3'])
    ]
  },
  {
    id: 'g2',
    title: '🏛️ Group 2 : Scholarship Type & Scheme Filters',
    filters: [
      sel('schemeType', 'Scholarship Type', ['All', '🏫 Internal', '🏛️ Government']),
      multi('schemeName', 'Scholarship Scheme', [
        'All Schemes',
        'NSP Post-Matric Scholarship',
        'NSP Pre-Matric Scholarship',
        'School Merit Scholarship 2025',
        'Sports Excellence Scholarship',
        'Need-Based Financial Aid',
        'Staff Ward Concession',
        'Sibling Concession',
        'Minority Welfare Scholarship',
        'EWS Support Scheme',
        'RTE Fee Waiver',
        'Alumni Merit Award'
      ], 'All schemes from Scholarship Master'),
      txt('schemeCode', 'Scheme Code', 'e.g. NSP-OBC-2025'),
      sel('schemeStatus', 'Scheme Status', ['All', 'Active', 'Inactive', 'Completed', 'Upcoming']),
      multi('schemeCategory', 'Scholarship Category', [
        'All Categories',
        'Merit',
        'Need-Based',
        'Sports',
        'Cultural',
        'Staff Ward',
        'Sibling',
        'Donor',
        'RTE'
      ]),
      sel('fundingAuthority', 'Funding Authority', [
        'All',
        'School Fund',
        'Trust',
        'Central Govt.',
        'State Govt.',
        'District',
        'Alumni',
        'Donor / Sponsor'
      ]),
      sel('govtPortal', 'Government Portal', [
        'All',
        'NSP (National Scholarship Portal)',
        'State Portal',
        'District Portal',
        'Direct Transfer'
      ]),
      sel('benefitType', 'Benefit Type', ['All', 'Fee Waiver', 'Cash Amount', 'Both']),
      sld('waiverRange', 'Waiver Percentage Range'),
      rng('cashAmountRange', 'Cash Amount Range', 0, 99999, '₹')
    ]
  },
  {
    id: 'g3',
    title: '🎓 Group 3 : Student Filters',
    filters: [
      txt('studentName', 'Student Name', 'Full or partial name'),
      txt('studentId', 'Student ID / Admission No.', 'Exact student ID search'),
      multi('className', 'Class', [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
        'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
      ]),
      multi('section', 'Section', ['A', 'B', 'C', 'D', 'All']),
      sel('gender', 'Gender', ['All', 'Male', 'Female', 'Other']),
      dtr('dobRange', 'Date of Birth (From-To)', 'Filter students by age group'),
      multi('category', 'Category / Caste', ['SC', 'ST', 'OBC', 'General', 'EWS', 'Minority', 'Other']),
      multi('religion', 'Religion', ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']),
      sel('domicileState', 'Domicile State', [
        'All',
        'Gujarat',
        'Maharashtra',
        'Rajasthan',
        'Madhya Pradesh',
        'Uttar Pradesh',
        'Delhi',
        'Karnataka',
        'Tamil Nadu',
        'West Bengal',
        'Other'
      ]),
      sel('bplStatus', 'BPL Status', ['All', 'BPL Card Holder', 'Non-BPL']),
      sel('disabilityStatus', 'Disability Status', ['All', 'Differently-Abled', 'Not Differently-Abled']),
      sel('aadhaarLinked', 'Aadhaar Linked', ['All', 'Aadhaar Linked', 'Not Linked']),
      sel('studentStatus', 'Student Status', [
        'All',
        'Currently Enrolled',
        'Passed Out',
        'Withdrawn',
        'Transferred'
      ]),
      rng('marksRange', 'Marks % (Min-Max)', 0, 100, '%'),
      rng('attendanceRange', 'Attendance % (Min-Max)', 0, 100, '%'),
      sel('stream', 'Stream', ['All', 'Science', 'Commerce', 'Arts']),
      rng('incomeRange', 'Annual Family Income', 0, 1000000, '₹')
    ]
  },
  {
    id: 'g4',
    title: '📋 Group 4 : Application Filters',
    filters: [
      txt('applicationNo', 'Application Number', 'Search specific application'),
      multi('applicationStatus', 'Application Status', [
        'Draft',
        'Submitted',
        'Under Verification',
        'Verified',
        'Pending Approval',
        'Approved',
        'Rejected',
        'On Hold',
        'Cancelled'
      ]),
      sel('applicationSource', 'Application Source', [
        'All',
        'Online Portal (Parent)',
        'Manual (Admin)',
        'Offline Form'
      ]),
      sel('documentsStatus', 'Documents Complete', [
        'All',
        'All Documents Uploaded',
        'Pending Documents'
      ]),
      sel('eligibilityStatus', 'Eligibility Status', ['All', 'Eligible', 'Not Eligible', 'Partial']),
      sel('renewalType', 'Renewal Application', [
        'All',
        'Fresh Application',
        'Renewal Application'
      ]),
      sel('appliedBy', 'Applied By', ['All', 'Parent', 'Admin', 'Self (Student)'])
    ]
  },
  {
    id: 'g5',
    title: '✅ Group 5 : Approval Filters',
    filters: [
      multi('approvalStatus', 'Approval Status', [
        'Pending',
        'Approved',
        'Rejected',
        'On Hold',
        'Reconsidered'
      ]),
      sel('approvedBy', 'Approved By', [
        'All',
        'Principal',
        'Finance Manager',
        'Management',
        'Scholarship Committee'
      ]),
      dtr('approvalDateRange', 'Approval Date Range'),
      multi('rejectionReason', 'Rejection Reason', [
        'Income exceeds scheme limit',
        'Missing income certificate',
        'Missing caste certificate',
        'Below minimum marks',
        'Attendance below 75%',
        'Duplicate application',
        'Not eligible for scheme'
      ]),
      sel('approvalLevel', 'Approval Level', [
        'All',
        'Level 1 — Finance Manager',
        'Level 2 — Principal',
        'Level 3 — Management'
      ])
    ]
  },
  {
    id: 'g6',
    title: '💰 Group 6 : Disbursement Filters',
    filters: [
      multi('disbursementStatus', 'Disbursement Status', [
        'Not Started',
        'Partially Disbursed',
        'Fully Disbursed',
        'Overdue',
        'Held',
        'Cancelled'
      ]),
      sel('disbursementFrequency', 'Disbursement Frequency', [
        'All',
        'One-Time',
        'Monthly',
        'Quarterly',
        'Term-wise',
        'Half-Yearly',
        'Annual',
        'Tranche-based',
        'Conditional'
      ]),
      sel('installmentNo', 'Disbursement Installment No.', [
        'All',
        'Installment 1',
        'Installment 2',
        'Installment 3',
        'Installment 4'
      ]),
      rng('disbursementAmountRange', 'Disbursement Amount', 0, 99999, '₹'),
      dtr('disbursementDateRange', 'Disbursement Date Range'),
      sel('disbursedBy', 'Disbursed By', [
        'All',
        'Finance Manager',
        'Accounts Officer',
        'Principal',
        'Accounts Head'
      ]),
      sel('paymentMethod', 'Payment Method (Disbursement)', [
        'All',
        'Fee Waiver',
        'Cash',
        'Bank Transfer',
        'DBT',
        'Cheque'
      ]),
      sel('installmentOverdue', 'Installment Overdue', [
        'All',
        'Yes — Overdue',
        'No — On Time'
      ])
    ]
  },
  {
    id: 'g7',
    title: '🏛️ Group 7 : Government-Specific Filters',
    filters: [
      txt('nspRefNo', 'NSP Reference No.', 'Search by NSP portal reference number'),
      txt('sanctionOrderNo', 'Govt. Sanction Order No.', 'Search by government sanction order number'),
      sel('portalSubmissionStatus', 'Portal Submission Status', [
        'All',
        'Not Submitted',
        'Submitted',
        'Acknowledged',
        'Under Govt. Review',
        'Govt. Approved',
        'Govt. Rejected',
        'Funds Released'
      ]),
      dtr('portalSubmissionDateRange', 'Portal Submission Date Range'),
      dtr('govtApprovalDateRange', 'Govt. Approval Date Range'),
      sel('govtFundStatus', 'Govt. Fund Receipt Status', [
        'All',
        'Not Received',
        'Partially Received',
        'Fully Received'
      ]),
      dtr('govtFundReceivedDateRange', 'Govt. Fund Received Date Range'),
      sel('dbtStatus', 'DBT Transfer Status', ['All', 'Transferred', 'Pending', 'Failed']),
      sel('aadhaarBankLink', 'Aadhaar-Bank Link Status', [
        'All',
        'Linked',
        'Not Linked',
        'Verification Pending'
      ]),
      sel('bankAccountVerified', 'Bank Account Verified', ['All', 'Verified', 'Not Verified'])
    ]
  },
  {
    id: 'g8',
    title: '📄 Group 8 : Document Filters',
    filters: [
      sel('documentUploadStatus', 'Document Upload Status', [
        'All',
        'All Documents Uploaded',
        'Partially Uploaded',
        'Not Uploaded'
      ]),
      sel('documentVerificationStatus', 'Document Verification Status', [
        'All',
        'All Verified',
        'Partially Verified',
        'Not Verified'
      ]),
      multi('documentType', 'Specific Document Type', [
        'Income Certificate',
        'Caste Certificate',
        'Marksheet',
        'Aadhaar',
        'Bank Passbook',
        'Domicile',
        'Disability Certificate'
      ]),
      sel('sanctionLetterGenerated', 'Sanction Letter Generated', ['All', 'Generated', 'Not Generated']),
      sel('receiptGenerated', 'Receipt Generated', ['All', 'Generated', 'Not Generated']),
      sel('certificateGenerated', 'Certificate Generated', ['All', 'Generated', 'Not Generated'])
    ]
  },
  {
    id: 'g9',
    title: '💰 Group 9 : Financial Filters',
    filters: [
      multi('feeComponent', 'Fee Component Covered', [
        'Tuition Fee',
        'Exam Fee',
        'Hostel Fee',
        'Transport Fee',
        'Activity Fee',
        'Lab Fee'
      ]),
      rng('totalAmountRange', 'Total Scholarship Amount', 0, 500000, '₹'),
      rng('totalDisbursedRange', 'Total Disbursed Amount', 0, 500000, '₹'),
      rng('pendingDisbursementRange', 'Pending Disbursement Amount', 0, 500000, '₹'),
      sel('budgetStatus', 'Budget Scheme', [
        'All',
        'Within Budget',
        'Near Budget Limit',
        'Over Budget'
      ]),
      txt('journalEntryNo', 'Journal Entry No.', 'Search by specific journal entry')
    ]
  },
  {
    id: 'g10',
    title: '🏫 Group 10 : School / Department Filters',
    filters: [
      multi('department', 'Department', [
        'Science',
        'Commerce',
        'Arts',
        'Sports',
        'Library',
        'Admin'
      ]),
      sel('classTeacher', 'Class Teacher', [
        'All',
        'Mrs. R. Iyer',
        'Mr. S. Nair',
        'Ms. P. Desai',
        'Mr. A. Bhatt'
      ]),
      sel('committeeMember', 'Scholarship Committee Member', [
        'All',
        'Principal — Scholarship Committee',
        'Finance Manager — Scholarship Committee',
        'Vice Principal — Scholarship Committee'
      ]),
      sel('verifiedByStaff', 'Verified By (Staff)', [
        'All',
        'Accounts Officer',
        'Office Superintendent',
        'Scholarship Clerk'
      ]),
      sel('approvedByStaff', 'Approved By (Staff)', [
        'All',
        'Principal',
        'Finance Manager',
        'Management Trustee'
      ])
    ]
  }
];

const TOTAL_FILTERS = FILTER_GROUPS.reduce((sum, g) => sum + g.filters.length, 0);

// filter id -> dataset key used for real row filtering
const APPLY_KEYS: Record<string, string> = {
  financialYear: 'financialYear',
  academicYear: 'academicYear',
  schemeType: 'schemeType',
  schemeName: 'schemeName',
  schemeCode: 'schemeCode',
  schemeCategory: 'schemeCategory',
  fundingAuthority: 'fundingAuthority',
  govtPortal: 'govtPortal',
  benefitType: 'benefitType',
  studentName: 'studentName',
  studentId: 'studentId',
  className: 'className',
  section: 'section',
  gender: 'gender',
  category: 'category',
  religion: 'religion',
  domicileState: 'domicileState',
  bplStatus: 'bplStatus',
  disabilityStatus: 'disabilityStatus',
  aadhaarLinked: 'aadhaarLinked',
  studentStatus: 'studentStatus',
  stream: 'stream',
  applicationNo: 'applicationNo',
  applicationStatus: 'applicationStatus',
  applicationSource: 'applicationSource',
  eligibilityStatus: 'eligibilityStatus',
  renewalType: 'renewalType',
  appliedBy: 'appliedBy',
  approvalStatus: 'approvalStatus',
  approvedBy: 'approvedBy',
  approvalLevel: 'approvalLevel',
  disbursementStatus: 'disbursementStatus',
  disbursementFrequency: 'disbursementFrequency',
  installmentNo: 'installmentNo',
  disbursedBy: 'disbursedBy',
  paymentMethod: 'paymentMethod',
  installmentOverdue: 'installmentOverdue',
  portalSubmissionStatus: 'portalSubmissionStatus',
  dbtStatus: 'dbtStatus',
  aadhaarBankLink: 'aadhaarBankLink',
  bankAccountVerified: 'bankAccountVerified',
  govtFundStatus: 'govtFundStatus',
  documentsStatus: 'documentUploadStatus',
  documentVerificationStatus: 'verificationStatus',
  sanctionLetterGenerated: 'sanctionLetterGenerated',
  receiptGenerated: 'receiptGenerated',
  certificateGenerated: 'certificateGenerated',
  budgetStatus: 'budgetStatus',
  journalEntryNo: 'journalEntryNo',
  classTeacher: 'classTeacher',
  committeeMember: 'committeeMember',
  verifiedByStaff: 'verifiedByStaff',
  nspRefNo: 'nspRefNo',
  sanctionOrderNo: 'sanctionOrderNo',
  studentNameQuery: 'studentName'
};

// numeric range filters -> dataset key
const APPLY_RANGES: Record<string, string> = {
  waiverRange: 'waiverPercent',
  cashAmountRange: 'cashAmount',
  marksRange: 'marksPercent',
  attendanceRange: 'attendancePercent',
  incomeRange: 'familyIncome',
  disbursementAmountRange: 'disbursedAmount',
  totalAmountRange: 'totalAmount',
  totalDisbursedRange: 'disbursedAmount',
  pendingDisbursementRange: 'pendingAmount'
};

// ============================================================================
// SECTION 2 : SCHOLARSHIP BENEFICIARY MASTER DATASET (drives every report)
// ============================================================================
interface BeneficiaryRow {
  id: string;
  financialYear: string;
  academicYear: string;
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  gender: string;
  dob: string;
  category: string;
  religion: string;
  domicileState: string;
  bplStatus: string;
  disabilityStatus: string;
  aadhaarLinked: string;
  studentStatus: string;
  marksPercent: number;
  attendancePercent: number;
  stream: string;
  familyIncome: number;
  schemeName: string;
  schemeCode: string;
  schemeType: string;
  schemeCategory: string;
  schemeStatus: string;
  fundingAuthority: string;
  govtPortal: string;
  benefitType: string;
  waiverPercent: number;
  cashAmount: number;
  applicationNo: string;
  applicationDate: string;
  applicationSource: string;
  applicationStatus: string;
  eligibilityStatus: string;
  renewalType: string;
  appliedBy: string;
  documentUploadStatus: string;
  verificationStatus: string;
  documentType: string;
  approvalStatus: string;
  approvedBy: string;
  approvalDate: string;
  approvalLevel: string;
  rejectionReason: string;
  sanctionOrderNo: string;
  nspRefNo: string;
  portalSubmissionStatus: string;
  portalSubmissionDate: string;
  govtApprovalDate: string;
  govtFundStatus: string;
  govtFundReceivedDate: string;
  dbtStatus: string;
  aadhaarBankLink: string;
  bankAccountVerified: string;
  disbursementStatus: string;
  disbursementFrequency: string;
  installmentNo: string;
  totalAmount: number;
  disbursedAmount: number;
  pendingAmount: number;
  disbursementDate: string;
  disbursedBy: string;
  paymentMethod: string;
  installmentOverdue: string;
  journalEntryNo: string;
  budgetStatus: string;
  feeComponent: string;
  sanctionLetterGenerated: string;
  receiptGenerated: string;
  certificateGenerated: string;
  department: string;
  classTeacher: string;
  committeeMember: string;
  verifiedByStaff: string;
}

const DEFAULTS: BeneficiaryRow = {
  id: '0',
  financialYear: 'FY 2025-26',
  academicYear: '2025-26',
  studentName: '',
  studentId: '',
  className: '',
  section: 'A',
  gender: 'Male',
  dob: '2010-04-12',
  category: 'General',
  religion: 'Hindu',
  domicileState: 'Gujarat',
  bplStatus: 'Non-BPL',
  disabilityStatus: 'Not Differently-Abled',
  aadhaarLinked: 'Aadhaar Linked',
  studentStatus: 'Currently Enrolled',
  marksPercent: 75,
  attendancePercent: 85,
  stream: '—',
  familyIncome: 240000,
  schemeName: '',
  schemeCode: '',
  schemeType: '🏫 Internal',
  schemeCategory: 'Merit',
  schemeStatus: 'Active',
  fundingAuthority: 'School Fund',
  govtPortal: 'Direct Transfer',
  benefitType: 'Fee Waiver',
  waiverPercent: 25,
  cashAmount: 0,
  applicationNo: '',
  applicationDate: '2025-05-10',
  applicationSource: 'Online Portal (Parent)',
  applicationStatus: 'Approved',
  eligibilityStatus: 'Eligible',
  renewalType: 'Fresh Application',
  appliedBy: 'Parent',
  documentUploadStatus: 'All Documents Uploaded',
  verificationStatus: 'All Verified',
  documentType: 'Income Certificate, Aadhaar, Bank Passbook',
  approvalStatus: 'Approved',
  approvedBy: 'Principal',
  approvalDate: '2025-05-18',
  approvalLevel: 'Level 2 — Principal',
  rejectionReason: '—',
  sanctionOrderNo: '',
  nspRefNo: '',
  portalSubmissionStatus: 'Submitted',
  portalSubmissionDate: '2025-05-20',
  govtApprovalDate: '2025-06-15',
  govtFundStatus: 'Partially Received',
  govtFundReceivedDate: '2025-07-05',
  dbtStatus: 'Transferred',
  aadhaarBankLink: 'Linked',
  bankAccountVerified: 'Verified',
  disbursementStatus: 'Partially Disbursed',
  disbursementFrequency: 'Term-wise',
  installmentNo: 'Installment 2',
  totalAmount: 15000,
  disbursedAmount: 10000,
  pendingAmount: 5000,
  disbursementDate: '2025-07-01',
  disbursedBy: 'Finance Manager',
  paymentMethod: 'Fee Waiver',
  installmentOverdue: 'No — On Time',
  journalEntryNo: 'JV-2025-0148',
  budgetStatus: 'Within Budget',
  feeComponent: 'Tuition Fee',
  sanctionLetterGenerated: 'Generated',
  receiptGenerated: 'Generated',
  certificateGenerated: 'Not Generated',
  department: 'Science',
  classTeacher: 'Mrs. R. Iyer',
  committeeMember: 'Principal — Scholarship Committee',
  verifiedByStaff: 'Accounts Officer'
};

const mk = (o: Partial<BeneficiaryRow>): BeneficiaryRow => ({ ...DEFAULTS, ...o });

const BENEFICIARIES: BeneficiaryRow[] = [
  mk({
    id: '1',
    studentName: 'Priya Sharma',
    studentId: 'K12-2025-1042',
    className: 'Class 10',
    section: 'A',
    gender: 'Female',
    dob: '2010-05-14',
    category: 'OBC',
    religion: 'Hindu',
    schemeName: 'School Merit Scholarship 2025',
    schemeCode: 'SCM-MERIT-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Merit',
    schemeStatus: 'Active',
    fundingAuthority: 'Trust',
    govtPortal: 'Direct Transfer',
    benefitType: 'Fee Waiver',
    waiverPercent: 50,
    cashAmount: 0,
    totalAmount: 15000,
    disbursedAmount: 10000,
    pendingAmount: 5000,
    applicationNo: 'SCM-APP-2025-0001',
    applicationDate: '2025-04-18',
    approvalStatus: 'Approved',
    approvedBy: 'Principal',
    approvalDate: '2025-04-25',
    disbursementStatus: 'Partially Disbursed',
    disbursementFrequency: 'Term-wise',
    installmentNo: 'Installment 2',
    disbursementDate: '2025-07-01',
    paymentMethod: 'Fee Waiver',
    marksPercent: 88,
    attendancePercent: 94,
    familyIncome: 285000,
    journalEntryNo: 'JV-2025-0148',
    feeComponent: 'Tuition Fee',
    classTeacher: 'Mrs. R. Iyer'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '2',
    studentName: 'Aarav Sharma',
    studentId: 'K12-2025-1011',
    className: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2010-01-22',
    category: 'SC',
    religion: 'Hindu',
    schemeName: 'NSP Post-Matric Scholarship',
    schemeCode: 'NSP-SC-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'Need-Based',
    schemeStatus: 'Active',
    fundingAuthority: 'Central Govt.',
    govtPortal: 'NSP (National Scholarship Portal)',
    benefitType: 'Both',
    waiverPercent: 75,
    cashAmount: 4000,
    totalAmount: 25000,
    disbursedAmount: 25000,
    pendingAmount: 0,
    applicationNo: 'NSP-APP-2025-0142',
    applicationDate: '2025-05-02',
    applicationSource: 'Online Portal (Parent)',
    eligibilityStatus: 'Eligible',
    approvalStatus: 'Approved',
    approvedBy: 'Principal',
    approvalDate: '2025-05-20',
    approvalLevel: 'Level 2 — Principal',
    nspRefNo: 'NSP2025GJ001842',
    sanctionOrderNo: 'GOI-SC-2025-3391',
    portalSubmissionStatus: 'Funds Released',
    portalSubmissionDate: '2025-05-22',
    govtApprovalDate: '2025-06-10',
    govtFundStatus: 'Fully Received',
    govtFundReceivedDate: '2025-06-28',
    dbtStatus: 'Transferred',
    disbursementStatus: 'Fully Disbursed',
    disbursementFrequency: 'Quarterly',
    installmentNo: 'Installment 4',
    disbursementDate: '2025-10-05',
    paymentMethod: 'DBT',
    disbursedBy: 'Accounts Officer',
    marksPercent: 79,
    attendancePercent: 91,
    familyIncome: 145000,
    bplStatus: 'BPL Card Holder',
    journalEntryNo: 'JV-2025-0203',
    feeComponent: 'Tuition Fee',
    certificateGenerated: 'Generated',
    classTeacher: 'Mrs. R. Iyer'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '3',
    studentName: 'Rohan Kumar',
    studentId: 'K12-2025-1189',
    className: 'Class 11',
    section: 'A',
    gender: 'Male',
    category: 'General',
    schemeName: 'Sports Excellence Scholarship',
    schemeCode: 'SCM-SPORT-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Sports',
    fundingAuthority: 'Alumni',
    benefitType: 'Cash Amount',
    waiverPercent: 0,
    cashAmount: 12000,
    totalAmount: 20000,
    disbursedAmount: 8000,
    pendingAmount: 12000,
    applicationNo: 'SCM-APP-2025-0007',
    applicationDate: '2025-04-30',
    renewalType: 'Renewal Application',
    approvalStatus: 'Approved',
    approvedBy: 'Scholarship Committee',
    approvalDate: '2025-05-12',
    approvalLevel: 'Level 3 — Management',
    disbursementStatus: 'Partially Disbursed',
    disbursementFrequency: 'Conditional',
    installmentNo: 'Installment 1',
    paymentMethod: 'Bank Transfer',
    installmentOverdue: 'Yes — Overdue',
    marksPercent: 71,
    attendancePercent: 88,
    stream: 'Science',
    familyIncome: 410000,
    journalEntryNo: 'JV-2025-0161',
    feeComponent: 'Activity Fee',
    department: 'Sports',
    certificateGenerated: 'Generated'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '4',
    studentName: 'Ananya Singh',
    studentId: 'K12-2025-0721',
    className: 'Class 8',
    section: 'A',
    gender: 'Female',
    dob: '2012-09-08',
    category: 'OBC',
    religion: 'Sikh',
    schemeName: 'Need-Based Financial Aid',
    schemeCode: 'SCM-NEED-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Need-Based',
    fundingAuthority: 'Trust',
    benefitType: 'Fee Waiver',
    waiverPercent: 60,
    totalAmount: 30000,
    disbursedAmount: 20000,
    pendingAmount: 10000,
    applicationNo: 'SCM-APP-2025-0014',
    applicationDate: '2025-05-06',
    approvalStatus: 'Approved',
    approvedBy: 'Finance Manager',
    approvalDate: '2025-05-15',
    approvalLevel: 'Level 1 — Finance Manager',
    disbursementStatus: 'Partially Disbursed',
    disbursementFrequency: 'Term-wise',
    installmentNo: 'Installment 2',
    marksPercent: 74,
    attendancePercent: 89,
    familyIncome: 190000,
    bplStatus: 'BPL Card Holder',
    feeComponent: 'Tuition Fee',
    classTeacher: 'Ms. P. Desai'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '5',
    studentName: 'Amit Kumar',
    studentId: 'K12-2025-0910',
    className: 'Class 9',
    section: 'C',
    gender: 'Male',
    category: 'ST',
    religion: 'Christian',
    schemeName: 'NSP Pre-Matric Scholarship',
    schemeCode: 'NSP-ST-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'Need-Based',
    fundingAuthority: 'State Govt.',
    govtPortal: 'State Portal',
    benefitType: 'Both',
    waiverPercent: 100,
    cashAmount: 2000,
    totalAmount: 18000,
    disbursedAmount: 0,
    pendingAmount: 18000,
    applicationNo: 'NSP-APP-2025-0158',
    applicationDate: '2025-05-14',
    applicationStatus: 'Under Verification',
    verificationStatus: 'Partially Verified',
    documentUploadStatus: 'Pending Documents',
    eligibilityStatus: 'Partial',
    approvalStatus: 'Pending',
    approvedBy: '—',
    approvalDate: '—',
    approvalLevel: 'Level 1 — Finance Manager',
    nspRefNo: 'NSP2025GJ002319',
    portalSubmissionStatus: 'Under Govt. Review',
    portalSubmissionDate: '2025-05-28',
    govtApprovalDate: '—',
    govtFundStatus: 'Not Received',
    govtFundReceivedDate: '—',
    dbtStatus: 'Pending',
    aadhaarBankLink: 'Verification Pending',
    bankAccountVerified: 'Not Verified',
    disbursementStatus: 'Not Started',
    disbursementFrequency: 'Annual',
    installmentNo: 'Installment 1',
    disbursementDate: '—',
    installmentOverdue: 'No — On Time',
    journalEntryNo: '—',
    marksPercent: 68,
    attendancePercent: 79,
    familyIncome: 132000,
    bplStatus: 'BPL Card Holder',
    department: 'Arts',
    classTeacher: 'Mr. S. Nair'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '6',
    studentName: 'Sneha Rao',
    studentId: 'K12-2025-1033',
    className: 'Class 10',
    section: 'B',
    gender: 'Female',
    dob: '2010-07-19',
    category: 'Minority',
    religion: 'Muslim',
    schemeName: 'Minority Welfare Scholarship',
    schemeCode: 'GVT-MIN-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'Merit',
    fundingAuthority: 'State Govt.',
    govtPortal: 'State Portal',
    benefitType: 'Cash Amount',
    waiverPercent: 0,
    cashAmount: 8000,
    totalAmount: 22000,
    disbursedAmount: 22000,
    pendingAmount: 0,
    applicationNo: 'GVT-APP-2025-0076',
    applicationDate: '2025-04-22',
    approvalStatus: 'Approved',
    approvedBy: 'Principal',
    approvalDate: '2025-05-09',
    nspRefNo: 'NSP2025GJ000984',
    sanctionOrderNo: 'GOG-MIN-2025-1180',
    portalSubmissionStatus: 'Govt. Approved',
    portalSubmissionDate: '2025-05-11',
    govtApprovalDate: '2025-06-02',
    govtFundStatus: 'Fully Received',
    govtFundReceivedDate: '2025-06-20',
    dbtStatus: 'Transferred',
    disbursementStatus: 'Fully Disbursed',
    disbursementFrequency: 'Half-Yearly',
    installmentNo: 'Installment 2',
    disbursementDate: '2025-09-18',
    paymentMethod: 'DBT',
    marksPercent: 91,
    attendancePercent: 96,
    familyIncome: 205000,
    feeComponent: 'Tuition Fee',
    classTeacher: 'Mrs. R. Iyer',
    certificateGenerated: 'Generated'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '7',
    studentName: 'Rohan Mehra',
    studentId: 'K12-2025-1250',
    className: 'Class 12',
    section: 'B',
    gender: 'Male',
    category: 'General',
    schemeName: 'RTE Fee Waiver',
    schemeCode: 'GVT-RTE-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'RTE',
    fundingAuthority: 'District',
    govtPortal: 'District Portal',
    benefitType: 'Fee Waiver',
    waiverPercent: 100,
    totalAmount: 42000,
    disbursedAmount: 28000,
    pendingAmount: 14000,
    applicationNo: 'GVT-APP-2025-0091',
    applicationDate: '2025-04-11',
    approvalStatus: 'Approved',
    approvedBy: 'Management',
    approvalDate: '2025-05-02',
    approvalLevel: 'Level 3 — Management',
    portalSubmissionStatus: 'Govt. Approved',
    portalSubmissionDate: '2025-05-04',
    govtApprovalDate: '2025-05-30',
    govtFundStatus: 'Partially Received',
    govtFundReceivedDate: '2025-06-18',
    dbtStatus: 'Pending',
    disbursementStatus: 'Partially Disbursed',
    disbursementFrequency: 'Term-wise',
    installmentNo: 'Installment 2',
    paymentMethod: 'Fee Waiver',
    marksPercent: 66,
    attendancePercent: 82,
    familyIncome: 168000,
    stream: 'Commerce',
    feeComponent: 'Tuition Fee',
    department: 'Commerce'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '8',
    studentName: 'Priya Das',
    studentId: 'K12-2025-1160',
    className: 'Class 11',
    section: 'C',
    gender: 'Female',
    category: 'OBC',
    religion: 'Christian',
    schemeName: 'Sibling Concession',
    schemeCode: 'SCM-SIB-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Sibling',
    fundingAuthority: 'School Fund',
    benefitType: 'Fee Waiver',
    waiverPercent: 25,
    totalAmount: 9000,
    disbursedAmount: 4500,
    pendingAmount: 4500,
    applicationNo: 'SCM-APP-2025-0022',
    applicationDate: '2025-05-08',
    approvalStatus: 'Approved',
    approvedBy: 'Finance Manager',
    approvalDate: '2025-05-16',
    approvalLevel: 'Level 1 — Finance Manager',
    portalSubmissionStatus: 'Not Submitted',
    govtPortal: 'Direct Transfer',
    disbursementDate: '2025-08-01',
    paymentMethod: 'Fee Waiver',
    marksPercent: 77,
    attendancePercent: 90,
    familyIncome: 320000,
    stream: 'Commerce',
    feeComponent: 'Tuition Fee',
    department: 'Commerce'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '9',
    studentName: 'Kabir Malhotra',
    studentId: 'K12-2025-1201',
    className: 'Class 12',
    section: 'A',
    gender: 'Male',
    category: 'General',
    religion: 'Sikh',
    schemeName: 'Staff Ward Concession',
    schemeCode: 'SCM-STAFF-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Staff Ward',
    fundingAuthority: 'School Fund',
    benefitType: 'Fee Waiver',
    waiverPercent: 50,
    totalAmount: 24000,
    disbursedAmount: 24000,
    pendingAmount: 0,
    applicationNo: 'SCM-APP-2025-0031',
    applicationDate: '2025-04-25',
    approvalStatus: 'Approved',
    approvedBy: 'Principal',
    approvalDate: '2025-05-06',
    portalSubmissionStatus: 'Not Submitted',
    govtPortal: 'Direct Transfer',
    disbursementStatus: 'Fully Disbursed',
    disbursementFrequency: 'One-Time',
    installmentNo: 'Installment 1',
    disbursementDate: '2025-06-05',
    paymentMethod: 'Fee Waiver',
    marksPercent: 84,
    attendancePercent: 93,
    familyIncome: 480000,
    stream: 'Science',
    feeComponent: 'Tuition Fee',
    department: 'Science',
    certificateGenerated: 'Generated'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '10',
    studentName: 'Meera Joshi',
    studentId: 'K12-2025-0955',
    className: 'Class 9',
    section: 'B',
    gender: 'Female',
    dob: '2011-11-30',
    category: 'SC',
    religion: 'Hindu',
    schemeName: 'NSP Post-Matric Scholarship',
    schemeCode: 'NSP-SC-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'Need-Based',
    fundingAuthority: 'Central Govt.',
    govtPortal: 'NSP (National Scholarship Portal)',
    benefitType: 'Cash Amount',
    waiverPercent: 0,
    cashAmount: 6000,
    totalAmount: 21000,
    disbursedAmount: 7000,
    pendingAmount: 14000,
    applicationNo: 'NSP-APP-2025-0203',
    applicationDate: '2025-05-19',
    approvalStatus: 'Approved',
    approvedBy: 'Principal',
    approvalDate: '2025-06-01',
    nspRefNo: 'NSP2025GJ002877',
    sanctionOrderNo: 'GOI-SC-2025-4402',
    portalSubmissionStatus: 'Submitted',
    portalSubmissionDate: '2025-06-03',
    govtApprovalDate: '2025-06-25',
    govtFundStatus: 'Partially Received',
    govtFundReceivedDate: '2025-07-12',
    dbtStatus: 'Pending',
    aadhaarBankLink: 'Linked',
    disbursementStatus: 'Overdue',
    disbursementFrequency: 'Tranche-based',
    installmentNo: 'Installment 2',
    disbursementDate: '2025-08-20',
    paymentMethod: 'DBT',
    disbursedBy: 'Accounts Head',
    installmentOverdue: 'Yes — Overdue',
    marksPercent: 72,
    attendancePercent: 81,
    familyIncome: 118000,
    bplStatus: 'BPL Card Holder',
    feeComponent: 'Hostel Fee',
    department: 'Arts'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '11',
    studentName: 'Ishan Verma',
    studentId: 'K12-2025-0640',
    className: 'Class 7',
    section: 'A',
    gender: 'Male',
    dob: '2013-02-17',
    category: 'EWS',
    religion: 'Jain',
    schemeName: 'EWS Support Scheme',
    schemeCode: 'GVT-EWS-2025',
    schemeType: '🏛️ Government',
    schemeCategory: 'Need-Based',
    fundingAuthority: 'District',
    govtPortal: 'District Portal',
    benefitType: 'Both',
    waiverPercent: 80,
    cashAmount: 1500,
    totalAmount: 16500,
    disbursedAmount: 8250,
    pendingAmount: 8250,
    applicationNo: 'GVT-APP-2025-0114',
    applicationDate: '2025-05-11',
    applicationStatus: 'Pending Approval',
    approvalStatus: 'Pending',
    approvedBy: '—',
    approvalDate: '—',
    portalSubmissionStatus: 'Acknowledged',
    portalSubmissionDate: '2025-05-24',
    govtApprovalDate: '—',
    govtFundStatus: 'Partially Received',
    govtFundReceivedDate: '2025-07-02',
    dbtStatus: 'Pending',
    aadhaarBankLink: 'Linked',
    bankAccountVerified: 'Verified',
    disbursementStatus: 'Partially Disbursed',
    disbursementFrequency: 'Half-Yearly',
    installmentNo: 'Installment 1',
    disbursementDate: '2025-07-15',
    paymentMethod: 'Bank Transfer',
    marksPercent: 70,
    attendancePercent: 84,
    familyIncome: 96000,
    bplStatus: 'BPL Card Holder',
    feeComponent: 'Tuition Fee',
    classTeacher: 'Ms. P. Desai'
  } as Partial<BeneficiaryRow>),
  mk({
    id: '12',
    studentName: 'Nisha Patel',
    studentId: 'K12-2025-1275',
    className: 'Class 12',
    section: 'C',
    gender: 'Female',
    category: 'Minority',
    religion: 'Muslim',
    schemeName: 'Alumni Merit Award',
    schemeCode: 'DNR-ALM-2025',
    schemeType: '🏫 Internal',
    schemeCategory: 'Donor',
    fundingAuthority: 'Alumni',
    govtPortal: 'Direct Transfer',
    benefitType: 'Cash Amount',
    waiverPercent: 0,
    cashAmount: 15000,
    totalAmount: 15000,
    disbursedAmount: 15000,
    pendingAmount: 0,
    applicationNo: 'DNR-APP-2025-0048',
    applicationDate: '2025-05-05',
    approvalStatus: 'Approved',
    approvedBy: 'Scholarship Committee',
    approvalDate: '2025-05-19',
    approvalLevel: 'Level 3 — Management',
    portalSubmissionStatus: 'Not Submitted',
    disbursementStatus: 'Fully Disbursed',
    disbursementFrequency: 'One-Time',
    installmentNo: 'Installment 1',
    disbursementDate: '2025-06-30',
    paymentMethod: 'Cheque',
    marksPercent: 95,
    attendancePercent: 98,
    familyIncome: 265000,
    stream: 'Science',
    feeComponent: 'Exam Fee',
    department: 'Science',
    sanctionLetterGenerated: 'Generated',
    receiptGenerated: 'Generated',
    certificateGenerated: 'Generated'
  } as Partial<BeneficiaryRow>)
];

const COLUMN_LABELS: Record<string, string> = {
  financialYear: 'Financial Year',
  academicYear: 'Academic Year',
  studentName: 'Student Name',
  studentId: 'Student ID',
  className: 'Class',
  section: 'Section',
  gender: 'Gender',
  dob: 'Date of Birth',
  category: 'Category / Caste',
  religion: 'Religion',
  domicileState: 'Domicile State',
  bplStatus: 'BPL Status',
  disabilityStatus: 'Disability Status',
  aadhaarLinked: 'Aadhaar Linked',
  studentStatus: 'Student Status',
  marksPercent: 'Marks %',
  attendancePercent: 'Attendance %',
  stream: 'Stream',
  familyIncome: 'Annual Family Income',
  schemeName: 'Scholarship Scheme',
  schemeCode: 'Scheme Code',
  schemeType: 'Scholarship Type',
  schemeCategory: 'Scholarship Category',
  schemeStatus: 'Scheme Status',
  fundingAuthority: 'Funding Authority',
  govtPortal: 'Government Portal',
  benefitType: 'Benefit Type',
  waiverPercent: 'Waiver %',
  cashAmount: 'Cash Amount',
  applicationNo: 'Application No.',
  applicationDate: 'Application Date',
  applicationSource: 'Application Source',
  applicationStatus: 'Application Status',
  eligibilityStatus: 'Eligibility Status',
  renewalType: 'Renewal / Fresh',
  appliedBy: 'Applied By',
  documentUploadStatus: 'Document Upload Status',
  verificationStatus: 'Verification Status',
  documentType: 'Documents Submitted',
  approvalStatus: 'Approval Status',
  approvedBy: 'Approved By',
  approvalDate: 'Approval Date',
  approvalLevel: 'Approval Level',
  rejectionReason: 'Rejection Reason',
  sanctionOrderNo: 'Govt. Sanction Order No.',
  nspRefNo: 'NSP Reference No.',
  portalSubmissionStatus: 'Portal Submission Status',
  portalSubmissionDate: 'Portal Submission Date',
  govtApprovalDate: 'Govt. Approval Date',
  govtFundStatus: 'Govt. Fund Receipt Status',
  govtFundReceivedDate: 'Govt. Fund Received Date',
  dbtStatus: 'DBT Transfer Status',
  aadhaarBankLink: 'Aadhaar-Bank Link',
  bankAccountVerified: 'Bank Account Verified',
  disbursementStatus: 'Disbursement Status',
  disbursementFrequency: 'Disbursement Frequency',
  installmentNo: 'Installment No.',
  totalAmount: 'Total Scholarship Amount',
  disbursedAmount: 'Disbursed Amount',
  pendingAmount: 'Pending Amount',
  disbursementDate: 'Disbursement Date',
  disbursedBy: 'Disbursed By',
  paymentMethod: 'Payment Method',
  installmentOverdue: 'Installment Overdue',
  journalEntryNo: 'Journal Entry No.',
  budgetStatus: 'Budget Scheme',
  feeComponent: 'Fee Component Covered',
  sanctionLetterGenerated: 'Sanction Letter',
  receiptGenerated: 'Receipt',
  certificateGenerated: 'Certificate',
  department: 'Department',
  classTeacher: 'Class Teacher',
  committeeMember: 'Scholarship Committee Member',
  verifiedByStaff: 'Verified By (Staff)'
};

// ============================================================================
// SECTION 3 : COMPLETE SCHOLARSHIP REPORT LIBRARY — ALL 68 REPORTS
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

const FAMILY_A: ReportDef[] = [
  { no: 1, name: 'Student Enrollment List', purpose: 'Proof that scholarship recipients are enrolled in school', meta: 'Annual · NSP Portal', columns: ['studentName', 'studentId', 'className', 'section', 'schemeName', 'studentStatus', 'disbursementStatus'] },
  { no: 2, name: 'Scholarship Application List', purpose: 'List of all students who applied with their details', meta: 'Annual (at time of application) · NSP Portal', columns: ['applicationNo', 'studentName', 'className', 'schemeName', 'applicationDate', 'applicationSource', 'applicationStatus'] },
  { no: 3, name: 'Verified Applicant List', purpose: 'List of applications verified by school with verification status', meta: 'Annual · NSP Portal', columns: ['applicationNo', 'studentName', 'className', 'schemeName', 'verificationStatus', 'verifiedByStaff', 'approvalStatus'] },
  { no: 4, name: 'Category-wise Applicant Report', purpose: 'Number of applicants per category (SC/ST/OBC/Minority)', meta: 'Annual · NSP Portal / Ministry', columns: ['category', 'applicationNo', 'studentName', 'className', 'schemeName', 'applicationStatus'] },
  { no: 5, name: 'Aadhaar Seeding Report', purpose: 'Students with Aadhaar linked to bank account', meta: 'Annual · NSP Portal', columns: ['studentName', 'studentId', 'className', 'aadhaarLinked', 'aadhaarBankLink', 'bankAccountVerified'] },
  { no: 6, name: 'Bank Account Verification Report', purpose: 'Confirmed bank accounts for DBT transfer', meta: 'Annual · NSP Portal', columns: ['studentName', 'className', 'bankAccountVerified', 'aadhaarBankLink', 'dbtStatus', 'disbursementStatus'] },
  { no: 7, name: 'Scholarship Utilization Certificate', purpose: 'How scholarship funds were used', meta: 'Annual · Funding Ministry', columns: ['schemeName', 'fundingAuthority', 'totalAmount', 'disbursedAmount', 'pendingAmount', 'budgetStatus'] },
  { no: 8, name: 'Beneficiary List with Bank Details', purpose: 'All scholarship recipients with bank account info for DBT', meta: 'Annual · Ministry / State Dept.', columns: ['studentName', 'className', 'schemeName', 'bankAccountVerified', 'dbtStatus', 'totalAmount'] },
  { no: 9, name: 'Renewal Eligibility Report', purpose: 'Students who qualify for scholarship renewal next year', meta: 'Annual · NSP Portal', columns: ['studentName', 'className', 'schemeName', 'marksPercent', 'attendancePercent', 'renewalType', 'eligibilityStatus'] },
  { no: 10, name: 'Dropout / Discontinued Students Report', purpose: 'Students who left mid-year (scholarship must stop)', meta: 'Whenever applicable · NSP Portal', columns: ['studentName', 'className', 'studentStatus', 'schemeName', 'disbursementStatus', 'applicationStatus'] },
  { no: 11, name: 'Fund Receipt Confirmation', purpose: 'Confirmation that government funds were received by school', meta: 'After each tranche · Ministry', columns: ['schemeName', 'fundingAuthority', 'govtFundStatus', 'govtFundReceivedDate', 'totalAmount', 'journalEntryNo'] },
  { no: 12, name: 'Disbursement Confirmation Report', purpose: 'Proof that scholarship was applied to eligible students', meta: 'After disbursement · Ministry / State', columns: ['studentName', 'className', 'schemeName', 'installmentNo', 'disbursedAmount', 'disbursementDate', 'paymentMethod'] },
  { no: 13, name: 'School Registration / Affiliation Details', purpose: "School's registration details for portal compliance", meta: 'Annual · NSP Portal', columns: ['schemeName', 'schemeCode', 'schemeType', 'govtPortal', 'fundingAuthority', 'schemeStatus'] },
  { no: 14, name: 'Inspector / Auditor Visit Report', purpose: 'For when government sends inspector to verify scholarships', meta: 'On demand · District / State Office', columns: ['studentName', 'className', 'category', 'schemeName', 'applicationStatus', 'approvalStatus', 'verificationStatus'] }
];

const FAMILY_B: ReportDef[] = [
  { no: 1, name: 'SC/ST Scholarship Beneficiary Report', purpose: 'All SC/ST students receiving scholarship', meta: 'State Social Welfare Dept.', columns: ['category', 'studentName', 'className', 'schemeName', 'totalAmount', 'disbursedAmount'] },
  { no: 2, name: 'OBC Scholarship Beneficiary Report', purpose: 'All OBC students receiving scholarship', meta: 'State OBC Welfare Dept.', columns: ['category', 'studentName', 'className', 'schemeName', 'totalAmount', 'disbursedAmount'] },
  { no: 3, name: 'Minority Scholarship Report', purpose: 'All minority students receiving scholarship', meta: 'State Minority Affairs Dept.', columns: ['religion', 'category', 'studentName', 'className', 'schemeName', 'totalAmount'] },
  { no: 4, name: 'EWS / BPL Scholarship Report', purpose: 'All EWS/BPL students with scholarship details', meta: 'State Education Dept.', columns: ['category', 'bplStatus', 'studentName', 'className', 'familyIncome', 'totalAmount'] },
  { no: 5, name: 'RTE Beneficiary Report', purpose: 'Students admitted under Right to Education (free seats)', meta: 'State RTE Authority', columns: ['studentName', 'className', 'category', 'familyIncome', 'benefitType', 'waiverPercent'] },
  { no: 6, name: 'Gender-wise Scholarship Report', purpose: 'Male/Female scholarship recipients (for gender equity tracking)', meta: 'State Education Dept.', columns: ['gender', 'studentName', 'className', 'schemeName', 'totalAmount', 'disbursedAmount'] },
  { no: 7, name: 'District-wise Scholarship Report', purpose: 'Students grouped by district', meta: 'District Education Office', columns: ['domicileState', 'studentName', 'className', 'schemeName', 'totalAmount', 'disbursementStatus'] },
  { no: 8, name: 'Income Group Scholarship Report', purpose: 'Scholarship recipients grouped by annual family income', meta: 'State Welfare Dept.', columns: ['familyIncome', 'studentName', 'className', 'schemeName', 'totalAmount', 'bplStatus'] },
  { no: 9, name: 'Caste Certificate Verification Report', purpose: 'Verification status of caste certificates submitted', meta: 'District Social Welfare', columns: ['category', 'studentName', 'className', 'documentType', 'verificationStatus', 'verifiedByStaff'] },
  { no: 10, name: 'Scholarship Compliance Report', purpose: "School's compliance with government scholarship rules", meta: 'State Education Dept.', columns: ['schemeName', 'schemeType', 'govtPortal', 'portalSubmissionStatus', 'documentUploadStatus', 'budgetStatus'] }
];

const FAMILY_C: ReportDef[] = [
  { no: 1, name: 'PM Scholarship Scheme Report', purpose: 'All students under PM scholarship schemes', meta: 'Ministry of Education', columns: ['schemeName', 'schemeType', 'studentName', 'className', 'totalAmount', 'govtFundStatus'] },
  { no: 2, name: 'Centrally Sponsored Scheme Report', purpose: 'Report on centrally funded scholarship programs', meta: 'Ministry of Social Justice', columns: ['schemeName', 'fundingAuthority', 'studentName', 'className', 'totalAmount', 'disbursedAmount'] },
  { no: 3, name: 'DBTL Report (Direct Benefit Transfer)', purpose: 'Confirmation of direct transfer to student accounts', meta: 'Ministry of Finance', columns: ['studentName', 'className', 'dbtStatus', 'aadhaarBankLink', 'disbursedAmount', 'disbursementDate'] },
  { no: 4, name: 'Annual Scholarship Statistics', purpose: 'Total scholarships, amounts, categories — yearly', meta: 'UDISE / ASER / Ministry', columns: ['financialYear', 'schemeName', 'schemeCategory', 'totalAmount', 'disbursedAmount', 'pendingAmount'] },
  { no: 5, name: 'Social Audit Report', purpose: 'For social audit of scholarship fund utilization', meta: 'Planning Commission / NITI', columns: ['schemeName', 'fundingAuthority', 'journalEntryNo', 'totalAmount', 'disbursedAmount', 'budgetStatus'] }
];

const FAMILY_D: ReportDef[] = [
  { no: 1, name: 'All Scholarship Applications Report', purpose: 'Every application submitted this year with full details', meta: 'Internal MIS', columns: ['applicationNo', 'studentName', 'className', 'schemeName', 'applicationDate', 'applicationStatus'] },
  { no: 2, name: 'Scheme-wise Applicant Report', purpose: 'Applications grouped by scholarship scheme', meta: 'Internal MIS', columns: ['schemeName', 'schemeCode', 'applicationNo', 'studentName', 'className', 'applicationStatus'] },
  { no: 3, name: 'Class-wise Scholarship Report', purpose: 'Scholarships given per class (Class 6 to 12)', meta: 'Internal MIS', columns: ['className', 'section', 'studentName', 'schemeName', 'totalAmount', 'disbursedAmount'] },
  { no: 4, name: 'Category-wise Scholarship Report', purpose: 'Scholarships grouped by SC/ST/OBC/General/Minority', meta: 'Internal MIS', columns: ['category', 'schemeName', 'studentName', 'totalAmount', 'disbursedAmount'] },
  { no: 5, name: 'Merit Scholarship Toppers List', purpose: 'Top students who received merit scholarships with marks', meta: 'Internal MIS', columns: ['studentName', 'className', 'marksPercent', 'schemeName', 'totalAmount', 'disbursementStatus'] },
  { no: 6, name: 'Need-Based Scholarship Beneficiary List', purpose: 'All need-based scholarship recipients with income proof', meta: 'Internal MIS', columns: ['studentName', 'className', 'familyIncome', 'schemeName', 'totalAmount', 'documentUploadStatus'] },
  { no: 7, name: 'Sports Scholarship Report', purpose: 'All sports scholarship recipients with sport and level', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'schemeCategory', 'totalAmount', 'disbursementStatus'] },
  { no: 8, name: 'Staff Ward Concession Report', purpose: 'All staff children who received concession', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeCategory', 'waiverPercent', 'totalAmount', 'disbursementStatus'] },
  { no: 9, name: 'Sibling Concession Report', purpose: 'All siblings who received sibling discount', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'schemeCategory', 'waiverPercent', 'totalAmount'] },
  { no: 10, name: 'Scholarship Approval Summary', purpose: 'Count of Approved / Rejected / Pending applications', meta: 'Internal MIS', columns: ['approvalStatus', 'approvedBy', 'approvalLevel', 'applicationNo', 'studentName', 'schemeName'] },
  { no: 11, name: 'Scholarship Rejection Report', purpose: 'All rejected applications with rejection reasons', meta: 'Internal MIS', columns: ['applicationNo', 'studentName', 'className', 'schemeName', 'rejectionReason', 'approvedBy'] },
  { no: 12, name: 'Scholarship Disbursement Status Report', purpose: 'Per student disbursement progress (% completed)', meta: 'Internal MIS', columns: ['studentName', 'schemeName', 'disbursementStatus', 'totalAmount', 'disbursedAmount', 'pendingAmount'] },
  { no: 13, name: 'Partial Disbursement Pending Report', purpose: 'Students with pending installments not yet released', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'installmentNo', 'disbursedAmount', 'pendingAmount', 'disbursementStatus'] },
  { no: 14, name: 'Overdue Disbursement Report', purpose: 'Installments that are overdue and not yet disbursed', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'installmentNo', 'disbursementDate', 'installmentOverdue', 'pendingAmount'] },
  { no: 15, name: 'Budget vs Actual Scholarship Report', purpose: 'Budgeted scholarship amount vs actual amount given', meta: 'Internal MIS', columns: ['schemeName', 'schemeCode', 'totalAmount', 'disbursedAmount', 'budgetStatus', 'journalEntryNo'] },
  { no: 16, name: 'Scholarship Sanction Letter Register', purpose: 'All sanction letters issued with dates and letter numbers', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'sanctionOrderNo', 'approvalDate', 'sanctionLetterGenerated'] },
  { no: 17, name: 'Scholarship Receipt Register', purpose: 'All receipts generated with dates and amounts', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'disbursedAmount', 'disbursementDate', 'receiptGenerated'] },
  { no: 18, name: 'Scholarship Certificate Register', purpose: 'All certificates issued', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'certificateGenerated', 'approvalDate', 'approvalStatus'] },
  { no: 19, name: 'Scholarship Renewal Report', purpose: 'Students eligible for renewal next year with conditions', meta: 'Internal MIS', columns: ['studentName', 'className', 'renewalType', 'eligibilityStatus', 'marksPercent', 'attendancePercent'] },
  { no: 20, name: 'Scholarship Cancellation Report', purpose: 'Scholarships cancelled mid-year with reasons', meta: 'Internal MIS', columns: ['studentName', 'className', 'schemeName', 'applicationStatus', 'approvalStatus', 'rejectionReason'] },
  { no: 21, name: 'Fee Waiver Impact Report', purpose: 'How much fee revenue was reduced due to scholarships', meta: 'Internal MIS', columns: ['schemeName', 'schemeCategory', 'feeComponent', 'waiverPercent', 'totalAmount', 'disbursedAmount'] },
  { no: 22, name: 'Scholarship Expense Ledger', purpose: 'All scholarship journal entries in ledger', meta: 'Internal MIS', columns: ['journalEntryNo', 'studentName', 'schemeName', 'totalAmount', 'disbursedAmount', 'disbursementDate'] },
  { no: 23, name: 'Year-wise Scholarship Comparison', purpose: 'Compare scholarship data across multiple years', meta: 'Internal MIS', columns: ['financialYear', 'academicYear', 'schemeName', 'totalAmount', 'disbursedAmount', 'pendingAmount'] },
  { no: 24, name: 'Gender-wise Scholarship Report', purpose: 'Male vs Female scholarship distribution', meta: 'Internal MIS', columns: ['gender', 'schemeName', 'studentName', 'totalAmount', 'disbursedAmount'] },
  { no: 25, name: 'Donor-wise Scholarship Report', purpose: 'Scholarships funded by specific donors or trusts', meta: 'Internal MIS', columns: ['fundingAuthority', 'schemeName', 'studentName', 'totalAmount', 'disbursedAmount', 'govtFundStatus'] }
];

const FAMILY_E: ReportDef[] = [
  { no: 1, name: 'Govt. Scholarship Applications Summary', purpose: 'All government scholarship applications with portal status', meta: 'Government Report · Portal', columns: ['applicationNo', 'studentName', 'className', 'schemeName', 'portalSubmissionStatus', 'applicationStatus'] },
  { no: 2, name: 'NSP Submission Status Report', purpose: 'Which applications are submitted / pending on NSP', meta: 'Government Report · NSP', columns: ['nspRefNo', 'studentName', 'className', 'schemeName', 'portalSubmissionStatus', 'portalSubmissionDate'] },
  { no: 3, name: 'Government Approval Status Report', purpose: 'Govt. approved / rejected / pending decision', meta: 'Government Report · Ministry', columns: ['nspRefNo', 'studentName', 'schemeName', 'approvalStatus', 'govtApprovalDate', 'sanctionOrderNo'] },
  { no: 4, name: 'Government Fund Receipt Report', purpose: 'Funds received from government — date, amount, tranche', meta: 'Government Report · Ministry', columns: ['schemeName', 'fundingAuthority', 'govtFundStatus', 'govtFundReceivedDate', 'totalAmount', 'journalEntryNo'] },
  { no: 5, name: 'DBT Transfer Confirmation Report', purpose: 'Cash scholarships transferred directly to students banks', meta: 'Government Report · Ministry of Finance', columns: ['studentName', 'className', 'dbtStatus', 'disbursedAmount', 'disbursementDate', 'bankAccountVerified'] },
  { no: 6, name: 'Pending Government Approval Report', purpose: 'Applications waiting for govt. decision', meta: 'Government Report · Ministry', columns: ['nspRefNo', 'studentName', 'schemeName', 'portalSubmissionDate', 'approvalStatus', 'eligibilityStatus'] },
  { no: 7, name: 'Government Scholarship Disbursement Report', purpose: 'How government funds were applied to student fee accounts', meta: 'Government Report · Ministry', columns: ['studentName', 'className', 'schemeName', 'disbursedAmount', 'paymentMethod', 'journalEntryNo'] },
  { no: 8, name: 'Aadhaar-Bank Linkage Status Report', purpose: 'Students with/without Aadhaar-bank link', meta: 'Government Report · NSP', columns: ['studentName', 'className', 'aadhaarLinked', 'aadhaarBankLink', 'bankAccountVerified', 'dbtStatus'] },
  { no: 9, name: 'Portal Submission Deadline Report', purpose: 'Applications not yet submitted with days remaining', meta: 'Government Report · NSP', columns: ['applicationNo', 'studentName', 'schemeName', 'portalSubmissionStatus', 'portalSubmissionDate', 'govtPortal'] },
  { no: 10, name: 'Government Fund Utilization Report', purpose: 'Complete utilization of govt. scholarship funds', meta: 'Government Report · Ministry', columns: ['schemeName', 'totalAmount', 'disbursedAmount', 'pendingAmount', 'govtFundStatus', 'budgetStatus'] },
  { no: 11, name: 'Scheme-wise Government Scholarship Report', purpose: 'NSP / State / District scheme-wise beneficiary list', meta: 'Government Report · Ministry', columns: ['schemeName', 'schemeCode', 'schemeType', 'studentName', 'className', 'totalAmount'] },
  { no: 12, name: 'Government Scholarship Verification Letter Register', purpose: 'All school verification letters issued to students', meta: 'Government Report · NSP', columns: ['studentName', 'className', 'schemeName', 'verifiedByStaff', 'verificationStatus', 'sanctionLetterGenerated'] },
  { no: 13, name: 'Government Scholarship Compliance Checklist', purpose: "School's compliance with all government requirements", meta: 'Government Report · State Dept.', columns: ['schemeName', 'govtPortal', 'portalSubmissionStatus', 'documentUploadStatus', 'verificationStatus', 'budgetStatus'] },
  { no: 14, name: 'Tranche-wise Fund Receipt & Disbursement', purpose: 'Per tranche tracking of funds received and disbursed', meta: 'Government Report · Ministry', columns: ['schemeName', 'installmentNo', 'govtFundReceivedDate', 'disbursedAmount', 'disbursementDate', 'disbursementFrequency'] }
];

const REPORT_FAMILIES: ReportFamily[] = [
  {
    id: 'fa',
    code: 'A',
    title: 'NSP & Government Compliance Reports',
    subtitle: 'Submitted to NSP Portal, funding ministry & state departments',
    tone: 'indigo',
    reports: FAMILY_A
  },
  {
    id: 'fb',
    code: 'B',
    title: 'Category & Statutory Welfare Reports',
    subtitle: 'Caste / category / income based statutory submissions',
    tone: 'blue',
    reports: FAMILY_B
  },
  {
    id: 'fc',
    code: 'C',
    title: 'Central Scheme & Audit Reports',
    subtitle: 'Central schemes, DBTL and social audit packs',
    tone: 'purple',
    reports: FAMILY_C
  },
  {
    id: 'fd',
    code: 'D',
    title: 'Internal MIS Reports',
    subtitle: 'School-level operational & management registers',
    tone: 'emerald',
    reports: FAMILY_D
  },
  {
    id: 'fe',
    code: 'E',
    title: 'Government Scholarship Reports',
    subtitle: 'Portal, approval, fund receipt & DBT tracking',
    tone: 'amber',
    reports: FAMILY_E
  }
];

const TOTAL_REPORTS = REPORT_FAMILIES.reduce((sum, f) => sum + f.reports.length, 0);

const TONE_STYLES: Record<string, { chip: string; head: string }> = {
  indigo: { chip: 'bg-indigo-50 text-indigo-700 border border-indigo-200', head: 'text-indigo-700' },
  blue: { chip: 'bg-blue-50 text-blue-700 border border-blue-200', head: 'text-blue-700' },
  emerald: { chip: 'bg-emerald-50 text-emerald-700 border border-emerald-200', head: 'text-emerald-700' },
  amber: { chip: 'bg-amber-50 text-amber-700 border border-amber-200', head: 'text-amber-700' },
  purple: { chip: 'bg-purple-50 text-purple-700 border border-purple-200', head: 'text-purple-700' }
};

// ============================================================================
// SECTION 4 : SHARED HELPERS + RENDERERS
// ============================================================================
const FILTER_KIND: Record<string, FilterKind> = {};
FILTER_GROUPS.forEach((g) => g.filters.forEach((f) => (FILTER_KIND[f.id] = f.kind)));

const MONEY_KEYS = [
  'totalAmount',
  'disbursedAmount',
  'pendingAmount',
  'cashAmount',
  'familyIncome'
];
const PERCENT_KEYS = ['marksPercent', 'attendancePercent', 'waiverPercent'];

const RESET_OPTION_VALUES = [
  'All',
  'All Years',
  'All Categories',
  'All Schemes',
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

const TEXT_SEARCH_FILTERS = [
  'studentName',
  'studentId',
  'applicationNo',
  'schemeCode',
  'nspRefNo',
  'sanctionOrderNo',
  'journalEntryNo'
];

function applyFilters(
  rows: BeneficiaryRow[],
  filters: Record<string, any>
): BeneficiaryRow[] {
  const entries = Object.keys(filters).filter((k) => !isBlank(filters[k]));
  if (entries.length === 0) return rows;

  return rows.filter((row) => {
    for (const id of entries) {
      const raw = filters[id];
      const kind = FILTER_KIND[id];

      // slider (single numeric threshold)
      if (kind === 'slider' && APPLY_RANGES[id]) {
        const num = Number((row as any)[APPLY_RANGES[id]]) || 0;
        if (Number(raw) > 0 && num < Number(raw)) return false;
        continue;
      }

      // min-max ranges
      if (kind === 'range' && APPLY_RANGES[id]) {
        const num = Number((row as any)[APPLY_RANGES[id]]) || 0;
        const min = raw.min !== '' && raw.min !== undefined ? Number(raw.min) : null;
        const max = raw.max !== '' && raw.max !== undefined ? Number(raw.max) : null;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        continue;
      }

      const key = APPLY_KEYS[id];
      if (!key) continue; // criterion recorded but not part of the demo dataset
      const value = (row as any)[key];

      if (Array.isArray(raw)) {
        const picked = raw.filter((v: string) => !isIgnoredOption(v));
        if (picked.length === 0) continue;
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
  if (value === undefined || value === null) return '—';
  if (typeof value === 'number') {
    if (MONEY_KEYS.indexOf(key) !== -1) return '₹' + value.toLocaleString('en-IN');
    if (PERCENT_KEYS.indexOf(key) !== -1) return value + '%';
    return value.toLocaleString('en-IN');
  }
  return String(value);
};

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

// ---------------------------------------------------------------------------
// Filter field renderer — every filter type lives in the SAME panel
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

  if (def.kind === 'range') {
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

  // slider
  const numValue = Number(value) || 0;
  return (
    <div>
      {labelEl}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="range"
          min={def.min ?? 0}
          max={def.max ?? 100}
          step={def.step ?? 5}
          value={numValue}
          onChange={(e) => onChange(def.id, e.target.value)}
          className="w-full accent-indigo-600"
        />
        <span className="text-[11px] font-bold text-indigo-700 w-10 text-right">
          {numValue}
          {def.unit || ''}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI tile
// ---------------------------------------------------------------------------
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
// SECTION 5 : UNIFIED SCHOLARSHIP REPORTS PAGE
// ============================================================================
export function ScholarshipReport() {
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

  const appliedRows = useMemo(() => applyFilters(BENEFICIARIES, appliedFilters), [appliedFilters]);

  const activeFilterChips = useMemo(() => {
    const chips: { id: string; label: string; value: string }[] = [];
    FILTER_GROUPS.forEach((g) =>
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
          chips.push({ id: f.id, label: f.label, value: String(raw) + (f.unit || '') });
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
  const previewTotals = useMemo(() => {
    return appliedRows.reduce(
      (acc, r) => {
        acc.total += r.totalAmount;
        acc.disbursed += r.disbursedAmount;
        acc.pending += r.pendingAmount;
        return acc;
      },
      { total: 0, disbursed: 0, pending: 0 }
    );
  }, [appliedRows]);

  const familyTotals = useMemo(() => {
    return REPORT_FAMILIES.map((f) => ({ id: f.id, code: f.code, count: f.reports.length, title: f.title }));
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
    <div className="space-y-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Scholarship Reports Central <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"> FY: 2025-26 </Badge>
                </h1>
                <p className="text-xs text-gray-500">
                  Single unified workspace — all {TOTAL_FILTERS} scholarship report criteria and all {TOTAL_REPORTS} statutory &amp; MIS reports in one page
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
            onClick={() => flash('Compiling all 68 scholarship report sheets into the Excel workbook...')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" /> Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
            onClick={() => flash('Printing compiled scholarship report portfolio (PDF)...')}
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
        <KpiTile label="Total Reports" value={String(TOTAL_REPORTS)} note="5 report families" tone="indigo" />
        <KpiTile label="Report Filters" value={String(TOTAL_FILTERS)} note="10 criteria groups" tone="blue" />
        <KpiTile label="Active Criteria" value={String(activeFilterChips.length)} note="Applied to results" tone="amber" />
        <KpiTile label="Records in Scope" value={String(appliedRows.length)} note={`of ${BENEFICIARIES.length} beneficiary records`} tone="emerald" />
        <KpiTile label="Total Scholarship" value={inr(previewTotals.total)} note="Sanctioned value" tone="indigo" />
        <KpiTile label="Disbursed / Pending" value={`${inr(previewTotals.disbursed)}`} note={`${inr(previewTotals.pending)} pending`} tone="purple" />
      </div>

      {/* ==================================================================== */}
      {/* SINGLE FILTER PANEL — ALL 10 GROUPS INSIDE ONE PANEL                 */}
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
                Scholarship Report Criteria — All 10 Filter Groups
              </h2>
              <p className="text-[11px] text-gray-500">
                {TOTAL_FILTERS} filters in a single panel · {draftCount} selected · {activeFilterChips.length} applied
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">
              {FILTER_GROUPS.length} groups
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
            {FILTER_GROUPS.map((group, gi) => (
              <div
                key={group.id}
                className={gi === 0 ? 'pt-1' : 'pt-4 border-t border-gray-100'}
              >
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

            {/* Panel footer — same panel, no separate cards */}
            <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto">
                {activeFilterChips.length === 0 ? (
                  <span className="text-[11px] text-gray-400 italic">
                    No criteria applied — all {BENEFICIARIES.length} scholarship records are in scope.
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
                    flash('All report criteria cleared.');
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
      {/* REPORT LIBRARY — ALL 68 REPORTS                                      */}
      {/* ==================================================================== */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Scholarship Report Library — {TOTAL_REPORTS} Reports
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
              <option value="all">All Families ({TOTAL_REPORTS})</option>
              {familyTotals.map((f) => (
                <option key={f.id} value={f.id}>
                  Family {f.code} — {f.title} ({f.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {REPORT_FAMILIES.filter((f) => familyFilter === 'all' || familyFilter === f.id).map(
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
                            <th className="p-3">Frequency · Submitted To</th>
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
                                        flash(`Preparing PDF export for "${report.name}"...`);
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

          {/* Report KPI strip */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-gray-100">
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Records</p>
              <p className="text-lg font-bold text-gray-900">{appliedRows.length}</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                Total Scholarship
              </p>
              <p className="text-lg font-bold text-indigo-700">{inr(previewTotals.total)}</p>
            </div>
            <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Disbursed</p>
              <p className="text-lg font-bold text-emerald-700">{inr(previewTotals.disbursed)}</p>
            </div>
            <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Pending</p>
              <p className="text-lg font-bold text-amber-700">{inr(previewTotals.pending)}</p>
            </div>
          </div>

          {/* Applied criteria recap */}
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mr-1">
              Criteria applied:
            </span>
            {activeFilterChips.length === 0 ? (
              <span className="text-[11px] text-gray-400 italic">None — full scholarship dataset</span>
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
          K12 ERP Master System · Scholarship Reports &amp; Statutory Submission Engine
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>
            <Building2 className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
            {TOTAL_REPORTS} reports · {TOTAL_FILTERS} criteria
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> Last generated: Today
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gray-400" /> Active Academic Year: <b>2025-26</b>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipReport;
