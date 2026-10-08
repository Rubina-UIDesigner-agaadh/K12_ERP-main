import {
  LayoutDashboard,
  Users,
  Wallet,
  Briefcase,
  ClipboardList,
  Shield,
  Grid,
  User,
  Puzzle,
  GraduationCap
} from
  'lucide-react';
import { Module, SidebarSection } from '../types/navigation';

// Helper to create simple submodules
const createSubModules = (labels: string[]) =>
  labels.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label
  }));

// ============================================
// STUDENT MODULE SIDEBAR CONFIGURATIONS
// ============================================

const studentManagementSidebar: SidebarSection[] = [
  {
    title: 'List Screens',
    items: [
      { label: 'Student List', id: 'student-list' },
      { label: 'Student Summary Dashboard', id: 'student-summary-dashboard' },
      {
        label: 'Student List (All Batch & Deleted)',
        id: 'student-list-all-batch-combined'
      },
      { label: 'ID Register', id: 'id-register' }]

  },
  {
    title: 'Transactions',
    items: [
      { label: 'Student Detail', id: 'student-detail' },
      { label: 'Verify Info & Documents', id: 'verify-info-documents' },
      { label: 'Upload Student Media', id: 'upload-student-media' },
      { label: 'Student Sibling', id: 'student-sibling' },
      { label: 'Alumni Convert', id: 'alumni-convert' },
      { label: 'Alert', id: 'alert' }]

  },
  {
    title: 'Report Criteria',
    items: [
      { label: 'Student Custom Search', id: 'student-custom-search' },
      { label: 'Student Reports', id: 'student-reports' }]

  },
  {
    title: 'Allocation & Changes',
    items: [
      { label: 'Student Preference Collection', id: 'student-preference-collection' },
      { label: 'Stream Allocation Engine', id: 'stream-allocation-engine' },
      { label: 'Allocation Result', id: 'allocation-result' },
      { label: 'Manual Override / Adjustment', id: 'manual-override-adjustment' },
      {
        label: 'Division & Batch Change Approval',
        id: 'division-batch-change-approval'
      }]

  },
  {
    title: 'Additional Modules',
    items: [
      {
        label: 'Student Transfer & Withdrawal',
        id: 'student-transfer-withdrawal'
      },
      { label: 'Student Health & Medical', id: 'student-health-medical' },
      { label: 'Student Discipline & Behaviour', id: 'student-discipline' },
      { label: 'Student Achievements', id: 'student-achievements' },
      { label: 'Audit Trail & Change History', id: 'audit-trail' }]

  }];

const studentSettingsSidebar: SidebarSection[] = [
  {
    title: 'Admission & ID Logic',
    items: [
      { label: 'GR No. Auto-Generation Rules', id: 'gr-no-rules' },
      { label: 'SU ID Generation Rules', id: 'subject-allocation' },
      { label: 'ID Card Template Configuration', id: 'id-card-template' },
      { label: 'Student Document Type Master', id: 'student-doc-type' },
      { label: 'Admission Form Field Settings', id: 'admission-form-settings' }]

  },
  {
    title: 'Academic Rules',
    items: [
      { label: 'Student Promotion Policy Setup', id: 'promotion-policy' },
      { label: 'Roll Number Generation Logic', id: 'roll-no-logic' }]

  }];

const admissionSidebar: SidebarSection[] = [
  {
    title: 'Summary',
    items: [{ label: 'Admission Summary', id: 'admission-summary' }]
  },
  {
    title: 'Transaction',
    items: [
      { label: 'Admission Inquiry', id: 'admission-inquiry' },
      {
        label: 'Admission Inquiry Follow-up',
        id: 'admission-inquiry-follow-up'
      },
      { label: 'Admission Form', id: 'admission-form' },
      {
        label: 'Document Upload & Smart Auto-Fill',
        id: 'admission-exam-qp-setup'
      },
      { label: 'Admission Exam Setup', id: 'admission-exam-setup' },
      { label: 'Admission Mark Entry', id: 'admission-mark-entry' },
      { label: 'Admission Merit & Setup', id: 'admission-merit-setup' },
      { label: 'Student Readmission', id: 'student-readmission' },
      { label: 'Alert (Admissions)', id: 'alert-admissions' }]

  },
  {
    title: 'Report Criteria',
    items: [
      { label: 'Admission Report', id: 'admission-report' },
      { label: 'Admission Custom Search', id: 'admission-custom-search' },
      { label: 'Admission Audit Log', id: 'admission-audit-log' }]

  },
  {
    title: 'Master',
    items: [
      { label: 'Inquiry Reference Master', id: 'inquiry-reference-master' },
      { label: 'Admission Inquiry Setup', id: 'admission-inquiry-setup' }]

  }];

const attendanceSidebar: SidebarSection[] = [
  {
    title: 'Registers & Views',
    items: [
      { label: 'Division Register', id: 'division-register' },
      { label: 'Attendance Summary', id: 'attendance-summary' },
      {
        label: 'Attendance Defaulter Overview',
        id: 'attendance-defaulter-overview'
      }]

  },
  {
    title: 'Transactions',
    items: [
      { label: 'Quick Present Entry', id: 'quick-present-entry' },
      { label: 'Attendance Register', id: 'attendance-register-combined' },
      { label: 'Monthly Register Generate', id: 'monthly-register-generate' },
      { label: 'Student Attendance', id: 'student-attendance' },
      { label: 'Subjectwise Attendance', id: 'subjectwise-attendance' },
      {
        label: 'Manual Attendance Correction',
        id: 'manual-attendance-correction'
      },
      { label: 'Device Sync / Biometric Import', id: 'device-sync-biometric' }]

  },
  {
    title: 'Leave Management',
    items: [
      { label: 'Student Leave Request', id: 'student-leave-request' },
      { label: 'Student Leave Listing', id: 'student-leave-listing' }]

  },
  {
    title: 'Follow-up',
    items: [
      { label: 'Attendance Follow Up', id: 'attendance-follow-up' },
      { label: 'Student Register', id: 'student-register' }]

  },
  {
    title: 'Alerts & Communication',
    items: [{ label: 'Alert (Attendance)', id: 'alert-attendance' }]
  },
  {
    title: 'Reports',
    items: [
      { label: 'Attendance Reports', id: 'attendance-reports' },
      { label: 'Attendance Defaulter List', id: 'attendance-defaulter-list' },
      {
        label: 'Late Arrival / Early Departure',
        id: 'late-arrival-early-departure'
      }]

  }];

const certificateSidebar: SidebarSection[] = [
  {
    title: 'Summary & Dashboards',
    items: [{ label: 'Certificate Summary', id: 'certificate-summary' }]
  },
  {
    title: 'Certificates',
    items: [
      { label: 'Bonafide', id: 'bonafide-combined' },
      { label: 'First Trial', id: 'first-trial-combined' },
      { label: 'Leaving', id: 'leaving-combined' },
      { label: 'Character', id: 'character-combined' },
      { label: 'Transfer', id: 'transfer' },
      { label: 'Other Certificate', id: 'other-certificate' }]

  },
  {
    title: 'Templates & Printing',
    items: [
      { label: 'Print Template Student', id: 'print-template-student' },
      { label: 'Print Template', id: 'print-template' }]

  }];

// ============================================
// FINANCE MODULE SIDEBAR CONFIGURATIONS
// ============================================

const ledgersSidebar: SidebarSection[] = [
  { title: 'Ledger Views', items: [{ label: 'General Ledger', id: 'general-ledger' }] },
  { title: 'Books', items: [{ label: 'Day Book', id: 'day-book' }, { label: 'Cash Book', id: 'cash-book' }, { label: 'Bank Book', id: 'bank-book' }] },
  { title: 'Financial Statements', items: [{ label: 'Income & Expenditure', id: 'income-expenditure' }, { label: 'Balance Sheet', id: 'balance-sheet' }] },
  { title: 'Master', items: [{ label: 'Account Master', id: 'account-master' }] },
  { title: 'Reconciliation & Audit', items: [{ label: 'Audit Trail', id: 'ledger-audit-trail' }] }
];

const feesSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Fee Summary Dashboard', id: 'fee-summary-dashboard' }, { label: 'Fee Pending List', id: 'fee-pending-list' }, { label: 'Fee Collection Register', id: 'fee-collection-register' }] },
  { title: 'Transactions', items: [{ label: 'Fee Collection', id: 'fee-receipt' }, { label: 'Student Fee Process', id: 'student-fee-process' }, { label: 'Fee Receipt – Bulk', id: 'fee-receipt-bulk' }, { label: 'Fee Refund', id: 'fee-refund' }, { label: 'Assign Exemption Type', id: 'assign-exemption-type' }, { label: 'Branch Transfer', id: 'branch-transfer' }, { label: 'Fee Structure', id: 'fee-structure' }, { label: 'Royalty Collection', id: 'royalty-collection' }, { label: 'Fee Receipt Template', id: 'fee-receipt-template' }] },
  { title: 'Master & Rules', items: [{ label: 'Fee Category, Installment Pattern & Schedule Master', id: 'fee-category-installment-due-rules-master' }] },
  { title: 'Report Criteria', items: [{ label: 'Fee Reports', id: 'fee-collection-reports' }] }
];

const chargeSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Charge Summary Dashboard', id: 'charge-summary-dashboard' }] },
  { title: 'Transactions', items: [{ label: 'Charge Receipt', id: 'charge-receipt' }, { label: 'Charge Receipt Import', id: 'charge-receipt-import' }] },
  { title: 'Report Criteria', items: [{ label: 'Charge Receipt Report', id: 'charge-receipt-report' }] }
];

const scholarshipSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Scholarship Summary Dashboard', id: 'scholarship-summary-dashboard' }, { label: 'Student Scholarship List', id: 'student-scholarship-list' }] },
  { title: 'Transactions', items: [{ label: 'Scholarship Application Entry', id: 'scholarship-application-entry' }, { label: 'Scholarship Approval & Award', id: 'scholarship-approval-sanction' }, { label: 'Scholarship Disbursement', id: 'scholarship-disbursement' }, { label: 'Bulk Scholarship Disbursement', id: 'bulk-scholarship-disbursement' }, { label: 'Scholarship Documents & Receipts', id: 'scholarship-documents-receipts' }, { label: 'Scholarship Adjustment / Cancellation', id: 'scholarship-adjustment-cancellation' }] },
  { title: 'Report Criteria', items: [{ label: 'Scholarship Reports — All Reports (Unified)', id: 'scholarship-report' }] }
];

const expensesSidebar: SidebarSection[] = [
  { title: 'List Screen', items: [{ label: 'Expense Summary Dashboard', id: 'expense-summary-dashboard' }] },
  { title: 'Transaction', items: [{ label: 'Expense Request, Approval & Recurring Rules', id: 'expense-request' }, { label: 'Expense Voucher Entry', id: 'expense-voucher-entry' }, { label: 'Bill / Invoice Management, Approval & Payment', id: 'bill-invoice-management' }, { label: 'Petty Cash Issue', id: 'petty-cash-issue' }, { label: 'Bulk Expense Import', id: 'bulk-expense-import' }] },
  { title: 'Budget & Controls', items: [{ label: 'Expense Budget & Utilization', id: 'expense-budget-master' }] },
  { title: 'Report Criteria', items: [{ label: 'Expense Reports — All Reports (Unified)', id: 'expense-report' }] }
];

const employeeSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Employee Summary Dashboard', id: 'employee-summary-dashboard' }, { label: 'Employee List / Directory', id: 'employee-list-directory' }, { label: 'Employee Profile View', id: 'employee-profile-view' }, { label: 'Probation / Confirmation List', id: 'probation-confirmation-list' }, { label: 'Exit / Relieved Employees', id: 'exit-relieved-employees' }] },
  { title: 'Transactions', items: [{ label: 'Add / Edit Employee Profile', id: 'add-edit-employee-profile' }, { label: 'Employee Letters & Document Generation', id: 'employee-service-register' }, { label: 'Employee Confirmation', id: 'employee-confirmation' }, { label: 'Employee Transfer', id: 'employee-transfer' }, { label: 'Staff Workload Management', id: 'role-responsibility-assignment' }, { label: 'Employee Separation / Exit', id: 'employee-separation-exit' }, { label: 'Document Upload & Verification', id: 'document-upload-verification' }, { label: 'Employee ID Card', id: 'employee-id-card' }, { label: 'Teacher Class / Subject Allocation', id: 'teacher-class-subject-allocation' }, { label: 'Staff Advance Issue', id: 'staff-advance-issue' }, { label: 'Staff Advance Settlement', id: 'staff-advance-settlement' }] },
  { title: 'Report Criteria', items: [{ label: 'Employee Report (Advanced Search)', id: 'employee-report-advanced' }, { label: 'Staff Strength & Demographic Report', id: 'staff-strength-demographic-report' }, { label: 'Teaching Allocation Summary', id: 'teaching-allocation-summary' }] }
];

const hrAttendanceSidebar: SidebarSection[] = [
  { title: 'List Screen', items: [{ label: 'Employee Attendance Summary', id: 'employee-attendance-summary' }, { label: 'Daily Attendance Log', id: 'daily-attendance-log' }, { label: 'Late / Early Arrival Register', id: 'late-early-arrival-register' }, { label: 'Overtime Register', id: 'overtime-register' }] },
  { title: 'Transaction', items: [{ label: 'Employee Attendance Admin', id: 'employee-attendance-admin' }, { label: 'Manual Attendance (Employee)', id: 'manual-attendance-employee' }, { label: 'Leave Balance Adjust Bulk', id: 'leave-balance-adjust-bulk' }, { label: 'Leave Balance Add', id: 'leave-balance-add' }, { label: 'Leave Balance Listing', id: 'leave-balance-listing' }, { label: 'Leave Balance Adjust', id: 'leave-balance-adjust' }, { label: 'Monthly Attendance Register', id: 'monthly-attendance-register-hr' }, { label: 'Leave Entry Bulk', id: 'leave-entry-bulk' }, { label: 'Leave (Single Application)', id: 'leave-single-application' }, { label: 'Leave Listing', id: 'leave-listing' }] },
  { title: 'Report Criteria', items: [{ label: 'Attendance Report', id: 'hr-attendance-report' }, { label: 'Leave Report', id: 'hr-leave-report' }, { label: 'Absentee / Latecomer Report', id: 'absentee-latecomer-report' }] }
];

const payrollSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Payroll Summary Dashboard', id: 'payroll-summary-dashboard' }, { label: 'Salary Register View', id: 'salary-register-view' }, { label: 'Employee Payslip List', id: 'employee-payslip-list' }, { label: 'Payroll Exception List', id: 'payroll-exception-list' }] },
  { title: 'Transactions', items: [{ label: 'Employee Pay Structure', id: 'employee-pay-structure' }, { label: 'Payroll Process', id: 'payroll-process' }, { label: 'Supplementary / Arrear Payroll', id: 'supplementary-arrear-payroll' }, { label: 'Overtime & Additional Earnings', id: 'overtime-additional-earnings' }, { label: 'Manual Deduction / Adjustment', id: 'manual-deduction-adjustment' }, { label: 'Bulk Increment / Pay Revision', id: 'bulk-increment-pay-revision' }, { label: 'Payslip Lock & Release', id: 'payslip-lock-release' }, { label: 'Salary Disbursement & Bank Advice', id: 'salary-disbursement-bank-advice' }, { label: 'Payroll Reversal / Re-process', id: 'payroll-reversal-reprocess' }] },
  { title: 'Report Criteria', items: [{ label: 'Payroll Report', id: 'payroll-report' }, { label: 'Earnings & Deduction Summary', id: 'earnings-deduction-summary' }, { label: 'Department / Cost Center Salary', id: 'department-cost-center-salary' }, { label: 'Payroll Audit & Variance Report', id: 'payroll-audit-variance-report' }] }
];

const hrMasterSidebar: SidebarSection[] = [
  { title: 'Employee Masters', items: [{ label: 'Department Master', id: 'department-master' }, { label: 'Designation Master', id: 'designation-master' }, { label: 'Employee Classification Master', id: 'employee-classification-master' }, { label: 'Employee Document Type Master', id: 'employee-document-type-master' }, { label: 'Separation / Exit Reason Master', id: 'separation-exit-reason-master' }, { label: 'On-Duty / Travel Type Master', id: 'on-duty-travel-type-master' }, { label: 'Role & Responsibility Master', id: 'role-responsibility-master' }, { label: 'Qualification & Subject Master', id: 'qualification-subject-master' }, { label: 'Service Event Type Master', id: 'service-event-type-master' }] },
  { title: 'Employee Attendance Master', items: [{ label: 'Shift Master', id: 'shift-master' }, { label: 'Working Calendar Master', id: 'working-calendar-master' }, { label: 'Leave Type Master', id: 'leave-type-master' }, { label: 'Attendance Rule Master', id: 'attendance-rule-master' }] },
  { title: 'Recruitment Master', items: [{ label: 'Recruitment Stage & Status Master', id: 'recruitment-stage-status-master' }] },
  { title: 'Payroll Master', items: [{ label: 'Pay Head Master', id: 'pay-head-master' }, { label: 'Salary Grade / Pay Scale Master', id: 'salary-grade-pay-scale-master' }, { label: 'Payroll Calendar / Period Master', id: 'payroll-calendar-period-master' }, { label: 'Payroll Setup', id: 'payroll-setup' }, { label: 'Disbursement Mode / Bank Setup', id: 'disbursement-mode-bank-setup' }] },
  { title: 'Appraisal Master', items: [{ label: 'Appraisal Cycle Master', id: 'appraisal-cycle-master' }, { label: 'Appraisal Template Master', id: 'appraisal-template-master' }, { label: 'Competency & KPI Master', id: 'competency-kpi-master' }, { label: 'Rating Scale Master', id: 'rating-scale-master' }, { label: 'Appraisal Role & Workflow Master', id: 'appraisal-role-workflow-master' }] },
  { title: 'Income Tax Master', items: [{ label: 'Financial Year & Tax Configuration Master', id: 'financial-year-tax-config-master' }, { label: 'Tax Regime Master', id: 'tax-regime-master' }, { label: 'Tax Slab & Surcharge Master', id: 'tax-slab-surcharge-master' }, { label: 'Exemption & Deduction Section Master', id: 'exemption-deduction-section-master' }, { label: 'Income Head Mapping Master', id: 'income-head-mapping-master' }, { label: 'HRA & Special Exemption Rule Master', id: 'hra-special-exemption-rule-master' }] }
];

const appraisalSidebar: SidebarSection[] = [
  { title: 'List Screens', items: [{ label: 'Appraisal Dashboard', id: 'appraisal-dashboard' }, { label: 'Appraisal Cycle Status View', id: 'appraisal-cycle-status-view' }, { label: 'Employee Appraisal History', id: 'employee-appraisal-history' }] },
  { title: 'Transactions', items: [{ label: 'Appraisal Cycle Assignment', id: 'appraisal-cycle-assignment' }, { label: 'Self Appraisal Entry', id: 'self-appraisal-entry' }, { label: 'Manager / HOD Appraisal Entry', id: 'manager-hod-appraisal-entry' }, { label: 'Peer / Student Feedback Capture', id: 'peer-student-feedback-capture' }, { label: 'Appraisal Consolidation & Final Rating', id: 'appraisal-consolidation-final-rating' }, { label: 'IDP / Training Needs Entry', id: 'idp-training-needs-entry' }] },
  { title: 'Report Criteria', items: [{ label: 'Appraisal Result Report', id: 'appraisal-result-report' }, { label: 'Rating Distribution & Normalisation', id: 'rating-distribution-normalisation' }, { label: 'Training Needs & Action Plan Report', id: 'training-needs-action-plan-report' }] }
];

const recruitmentSidebar: SidebarSection[] = [
  { title: 'LIST SCREEN', items: [{ label: 'Recruitment Dashboard', id: 'recruitment-dashboard' }, { label: 'Vacancy / Requisition List', id: 'vacancy-requisition-list' }, { label: 'Applicant List', id: 'applicant-list' }, { label: 'Interview & Test Schedule View', id: 'interview-test-schedule-view' }, { label: 'Offer & Joining Status View', id: 'offer-joining-status-view' }] },
  { title: 'TRANSACTION', items: [{ label: 'Manpower Requisition', id: 'manpower-requisition' }, { label: 'Job Posting & Advertisement', id: 'job-posting-advertisement' }, { label: 'Applicant Entry / Online Application Sync', id: 'applicant-entry-online-sync' }, { label: 'Screening & Shortlisting', id: 'screening-shortlisting' }, { label: 'Interview & Test Scheduling', id: 'interview-test-scheduling' }, { label: 'Interview Feedback & Scoring', id: 'interview-feedback-scoring' }, { label: 'Selection & Offer Issue', id: 'selection-offer-issue' }, { label: 'Candidate Joining & Conversion to Employee', id: 'candidate-joining-conversion' }] },
  { title: 'REPORT CRITERIA', items: [{ label: 'Recruitment Pipeline Report', id: 'recruitment-pipeline-report' }, { label: 'Source & Campaign Effectiveness Report', id: 'source-campaign-effectiveness-report' }, { label: 'Time‑to‑Hire / Turnaround Analytics', id: 'time-to-hire-analytics' }, { label: 'Sanctioned vs Filled Positions Report', id: 'sanctioned-vs-filled-positions-report' }] }
];

const incomeTaxSidebar: SidebarSection[] = [
  { title: 'LIST SCREEN', items: [{ label: 'Income Tax Dashboard', id: 'income-tax-dashboard' }, { label: 'Employee Tax Summary List', id: 'employee-tax-summary-list' }, { label: 'Investment Declaration Status', id: 'investment-declaration-status' }, { label: 'Proof Verification Status', id: 'proof-verification-status' }, { label: 'Monthly TDS Register', id: 'monthly-tds-register' }] },
  { title: 'TRANSACTION', items: [{ label: 'Employee Tax Profile & Regime Selection', id: 'employee-tax-profile-regime-selection' }, { label: 'Employee Income & Investment Declaration', id: 'employee-income-investment-declaration' }, { label: 'Investment / Deduction Proof Verification', id: 'investment-deduction-proof-verification' }, { label: 'Annual Tax Projection Calculation', id: 'annual-tax-projection-calculation' }, { label: 'Monthly TDS Computation & Transfer to Payroll', id: 'monthly-tds-computation-transfer' }, { label: 'Annual Tax Reconciliation & Finalisation', id: 'annual-tax-reconciliation-finalisation' }] },
  { title: 'REPORT CRITERIA', items: [{ label: 'Employee Tax Projection Report', id: 'employee-tax-projection-report' }, { label: 'TDS Deduction Report', id: 'tds-deduction-report' }, { label: 'Challan / Tax Payment Register', id: 'challan-tax-payment-register' }, { label: 'Form‑16 / Annual Statement Data Export', id: 'form-16-annual-statement-export' }] }
];

const generalAssessmentSidebar: SidebarSection[] = [
  { title: 'Setup & Masters', items: [{ label: 'Exam Master', id: 'exam-master' }, { label: 'Grade Setup', id: 'mark-entry-single-subject' }, { label: 'Assessment Pattern Builder', id: 'mark-entry-all-subject' }, { label: 'Internal Marking Setup', id: 'mark-entry-status-verify' }, { label: 'Student Optional Subject', id: 'student-optional-subject' }, { label: 'Practical Marking Setup', id: 'student-result-remark' }, { label: 'Re-Exam Setup', id: 'result-sheet-report' }, { label: 'Generate Result', id: 'generate-result' }, { label: 'Report Card & Progress Report Templates', id: 'report-card-progress-templates' }, { label: 'Ranking & Merit List Rules', id: 'ranking-merit-list-rules' }] },
  { title: 'Result Processing', items: [{ label: 'Progress Card Report', id: 'progress-card-report' }, { label: 'Alert', id: 'assessment-alert' }] },
  { title: 'Exam Management', items: [{ label: 'Exam Hall Management', id: 'exam-hall-management' }, { label: 'Invigilation Schedule', id: 'invigilation-schedule' }, { label: 'Report Card Designer', id: 'report-card-designer' }, { label: 'Grace Mark Management', id: 'grace-mark-management' }, { label: 'Hall Ticket Generator', id: 'hall-ticket-generator' }, { label: 'Re-Exam Student Management', id: 're-exam-student-management' }, { label: 'Exam Timetable Generation', id: 'exam-timetable-generation' }] }
];

const preschoolAssessmentSidebar: SidebarSection[] = [
  { title: 'Setup & Masters', items: [{ label: 'Preschool Exam Master', id: 'preschool-exam-master' }, { label: 'Skill & Milestone Master', id: 'preschool-skill-milestone-master' }, { label: 'Activity-Based Assessment', id: 'preschool-grade-scale-config' }] },
  { title: 'Observations & Entry', items: [{ label: 'Term Assessment Entry', id: 'preschool-observation-entry' }] },
  { title: 'Reports', items: [{ label: 'Growth Tracking', id: 'preschool-bulk-skill-entry' }, { label: 'Preschool Report Card Generator', id: 'preschool-report-card-generator' }, { label: 'Portfolio Management', id: 'preschool-development-progress-tracker' }, { label: 'Result Lock & Approval', id: 'gseb-performance-analysis' }] }
];

const ccemanagementSidebar: SidebarSection[] = [
  { title: 'Setup & Masters', items: [{ label: 'CCE Indicator Master', id: 'cce-indicator-master' }, { label: 'CCE Subject Mapping', id: 'cce-subject-mapping' }, { label: 'CCE Grade Scale Setup', id: 'cce-grade-scale-setup' }] },
  { title: 'Observations & Entry', items: [{ label: 'Skill Evaluation Mark Entry', id: 'cce-skill-mark-entry' }] },
  { title: 'Reports', items: [{ label: 'Term-End CCE Summary', id: 'cce-term-summary' }, { label: 'CCE Progress Card Report', id: 'cce-progress-card' }] }
];

const gsebSidebar: SidebarSection[] = [
  { title: 'Mark Entry', items: [{ label: 'Subject Wise Mark Entry', id: 'gseb-mark-entry' }, { label: 'Term Wise Mark Entry', id: 'gseb-internal-assessment-entry' }, { label: 'Consolidated Result Mark Entry', id: 'gseb-practical-mark-entry' }, { label: 'Class Wise Mark Entry', id: 'gseb-result-generation' }, { label: 'Re Exam Mark Entry', id: 'gseb-exam-master' }] },
  { title: 'Report Criteria', items: [{ label: 'Tabulation Register', id: 'gseb-mark-sheet-report' }, { label: 'Result Lock & Approval', id: 'gseb-board-submission-export' }] }
];

const cbseSidebar: SidebarSection[] = [
  { title: 'Mark Entry', items: [{ label: 'Subject Wise Mark Entry', id: 'cbse-theory-mark-entry' }, { label: 'Term Wise Mark Entry', id: 'cbse-practical-mark-entry' }, { label: 'Consolidate Result Mark Entry', id: 'cbse-internal-assessment-entry' }, { label: 'Class Wise Mark Entry', id: 'cbse-project-activity-mark-entry' }, { label: 'Re-Exam Mark Entry', id: 'cbse-grade-calculation-setup' }] },
  { title: 'Report Criteria', items: [{ label: 'Tabulation Register', id: 'cbse-report-card' }, { label: 'Result Lock and Approval', id: 'cbse-board-submission-export' }] }
];

const cisceSidebar: SidebarSection[] = [
  { title: 'Marks Entry', items: [{ label: 'Subject Wise Mark Entry', id: 'cisce-theory-mark-entry' }, { label: 'Term Wise Mark Entry', id: 'cisce-practical-mark-entry' }, { label: 'Consolidate Result Mark Entry', id: 'cisce-internal-assessment-entry' }, { label: 'Class Wise Mark Entry', id: 'cisce-result-generation' }, { label: 'Re-Exam Mark Entry', id: 'cisce-grade-calculation-setup' }] },
  { title: 'Report Criteria', items: [{ label: 'Tabulation Register', id: 'cisce-report-card' }, { label: 'Result Lock and Approval', id: 'cisce-board-submission-export' }] }
];

const resultCardManagementSidebar: SidebarSection[] = [
  { title: 'Result View', items: [{ label: 'Student Result Card Preview', id: 'rc-student-result-preview' }, { label: 'Re-Exam Result Card Preview', id: 'rc-reexam-result-preview' }] },
  { title: 'Print and Export', items: [{ label: 'Bulk Print Result Cards', id: 'rc-bulk-print' }, { label: 'Single Student Print', id: 'rc-single-print' }] },
  { title: 'Distribution Entry', items: [{ label: 'Report Card Collection Entry', id: 'rc-collection-entry' }, { label: 'Bulk Collection Update', id: 'rc-bulk-collection-update' }, { label: 'Not Collected / Pending List', id: 'rc-pending-list' }] },
  { title: 'Report Criteria', items: [{ label: 'Audit Trail', id: 'rc-audit-trail' }, { label: 'Result Distribution Report', id: 'rc-distribution-report' }] }
];

const securitySidebar: SidebarSection[] = [
  { title: 'List Screen', items: [{ label: 'Security Summary Dashboard', id: 'security-summary-dashboard' }, { label: 'User Log', id: 'user-log' }, { label: 'Active Users & User Access', id: 'active-users' }, { label: 'Deleted Users', id: 'deleted-users' }] },
  { title: 'Data Scope', items: [{ label: 'Data Scope Management', id: 'data-scope-management' }] },
  { title: 'Transaction', items: [{ label: 'Security Admin', id: 'security-admin' }, { label: 'Module Access Control', id: 'security-user-profile' }] },
  { title: 'Master', items: [{ label: 'User Master', id: 'user-master' }, { label: 'Roles & Permissions', id: 'roles-and-permissions' }] }
];

const utilitiesSidebar: SidebarSection[] = [
  { title: 'Utilities', items: [
    { label: 'Data Export', id: 'data-export' },
    { label: 'Data Import / Export Wizards', id: 'data-import-wizard' },
    { label: 'System Log', id: 'log-viewer-audit-export' },
    { label: 'Number Series & Document ID Settings', id: 'number-series-document-id-settings' }
  ] },
  { title: 'Archive Management', items: [
    { label: 'Archive Dashboard', id: 'archive-dashboard' },
    { label: 'Data Tier & Retrieval', id: 'data-tier-browser' },
    { label: 'Archive Jobs & Schedule', id: 'archive-jobs-schedule' },
    { label: 'Cold Storage Manager', id: 'cold-storage-manager' },
    { label: 'Archive Settings & Rules', id: 'archive-settings-rules' },
    { label: 'Archive Audit Trail', id: 'archive-audit-trail' }
  ] }
];
const mastersSidebar: SidebarSection[] = [
  { title: 'Academic', items: [
    { label: 'Stream & Subject Group Master', id: 'stream-subject-group-master' }
  ] },
  { title: 'Charge', items: [{ label: 'Charge Master', id: 'charge-master' }] },
  { title: 'Expense', items: [
    { label: 'Expense Head Master', id: 'expense-head-master' },
    { label: 'Vendor / Payee Master', id: 'vendor-payee-master' },
    { label: 'Petty Cash Location Master', id: 'petty-cash-location-master' }
  ] },
  { title: 'Scholarship', items: [{ label: 'Scholarship Master', id: 'scholarship-concession-rules' }] },
  { title: 'Global', items: [{ label: 'Custom Fields & Dynamic Forms', id: 'custom-fields-dynamic-forms' }] },
  { title: 'Finance Rules', items: [
    { label: 'Fee Behaviour & Late Fee Rules', id: 'fee-behaviour-late-fee-rules' }
  ] },
  { title: 'Governance & Workflows', items: [
    { label: 'Discipline & Counselling Policy', id: 'discipline-counselling-policy' }
  ] }
];
const instituteSetupSidebar: SidebarSection[] = [{ title: 'Institute Setup', items: [{ label: 'Institute Profile & Branch Management', id: 'institute-profile-branch-management' }, { label: 'Campus, Building & Room Layout', id: 'campus-building-room-layout' }, { label: 'Academic Session & Term Setup', id: 'academic-session-term-setup' }, { label: 'Class & Section Structure Setup', id: 'class-section-structure-setup' }, { label: 'Department & Subject Grouping Setup', id: 'department-subject-grouping-setup' }, { label: 'Institute Calendar & Working Days', id: 'institute-calendar-working-days' }, { label: 'Timetable Framework & Shift Setup', id: 'timetable-framework-shift-setup' }, { label: 'House, Club & Co-curricular Group Setup', id: 'house-club-co-curricular-group-setup' }, { label: 'Batch Master', id: 'batch-master' }] }];
const marketplaceSidebar: SidebarSection[] = [{ title: 'Marketplace', items: [{ label: 'Marketplace', id: 'marketplace' }] }];
const billingSidebar: SidebarSection[] = [{ title: 'Billing', items: [{ label: 'Subscription Overview', id: 'subscription-overview' }, { label: 'Usage Insights', id: 'usage-insights' }, { label: 'Invoice Archive', id: 'invoice-archive' }, { label: 'Account Details', id: 'account-details' }] }];
const newsfeedSidebar: SidebarSection[] = [{ title: 'Content Management', items: [{ label: 'Internal School Updates', id: 'internal-school-updates' }, { label: 'Government & Policy Updates', id: 'government-policy-updates' }, { label: 'Board & Examination Updates', id: 'board-examination-updates' }, { label: 'Scholarships & Grants', id: 'scholarships-grants' }, { label: 'Health & Safety Advisories', id: 'health-safety-advisories' }, { label: 'Education Industry & Global News', id: 'education-industry-global-news' }] }, { title: 'Media & Engagement', items: [{ label: 'Media & Attachments', id: 'media-attachments' }, { label: 'Engagement & Interaction', id: 'engagement-interaction' }] }, { title: 'Management', items: [{ label: 'Smart Targeting & Filtering', id: 'smart-targeting-filtering' }, { label: 'Moderation & Workflow', id: 'moderation-workflow' }, { label: 'Alerts & Action Center', id: 'alerts-action-center' }, { label: 'Analytics & Insights', id: 'analytics-insights' }] }];
const reportsSidebar: SidebarSection[] = [{ title: 'Government Reports', items: [{ label: 'CBSE Compliance Dashboard', id: 'cbse-compliance-dashboard' }, { label: 'ICSE Compliance Reports', id: 'icse-compliance-reports' }, { label: 'GSEB Compliance Reports', id: 'gseb-compliance-reports' }] }, { title: 'Student Reports', items: [{ label: 'Admission Reports', id: 'admission-reports' }, { label: 'Academic Performance Reports', id: 'academic-performance-reports' }, { label: 'Transfer & Leaving Certificate Report', id: 'transfer-leaving-certificate-report' }] }, { title: 'Employee Reports', items: [{ label: 'Employee Master Report', id: 'employee-master-report' }, { label: 'Employee Attendance Report', id: 'employee-attendance-report' }, { label: 'Appraisal Reports', id: 'appraisal-reports' }, { label: 'Recruitment Reports', id: 'recruitment-reports' }, { label: 'Income Tax Reports', id: 'income-tax-reports' }] }, { title: 'Finance Reports', items: [{ label: 'Charges & Miscellaneous Income', id: 'charges-miscellaneous-income' }, { label: 'Scholarship Reports — All Reports (Unified)', id: 'scholarship-report' }, { label: 'Online Payment Report', id: 'online-payment-report' }] }, { title: 'Examination Reports', items: [{ label: 'Internal Exam Reports', id: 'internal-exam-reports' }, { label: 'Board Exam Reports', id: 'board-exam-reports' }] }, { title: 'Compliance & Audit', items: [{ label: 'Compliance & Audit Reports', id: 'compliance-audit-reports' }] }, { title: 'Advanced Builder', items: [{ label: 'Advanced Report Builder', id: 'advanced-report-builder' }] }];
const frontOfficeSidebar: SidebarSection[] = [{ title: 'Front Office', items: [{ label: 'Admission Management', id: 'admission-management' }, { label: 'Visitor Management', id: 'visitor-management' }, { label: 'Reception & Helpdesk', id: 'reception-helpdesk' }, { label: 'Student Movement', id: 'student-movement' }, { label: 'Lost & Found Management', id: 'lost-found-management' }] }];
const communicationsSidebar: SidebarSection[] = [{ title: 'Communications', items: [{ label: 'Messaging', id: 'messaging' }, { label: 'Circulars & Notices', id: 'circulars-notices' }, { label: 'Announcements', id: 'announcements' }, { label: 'Parent Interaction', id: 'parent-interaction' }, { label: 'Communication Logs', id: 'communication-logs' }, { label: 'Private Chats', id: 'private-chats' }] }];
const eventActivitiesSidebar: SidebarSection[] = [
  { title: 'Event Management', items: [
    { label: 'Event Management', id: 'event-management' },
    { label: 'Smart Event Calendar', id: 'smart-event-calendar' },
    { label: 'Media & Gallery Management', id: 'media-gallery-management' },
    { label: 'Event Participation Report', id: 'event-participation-report' }
  ] },
  { title: 'Event Section', items: [
    { label: 'Event Master', id: 'event-master' },
    { label: 'Event Planning & Schedule', id: 'event-planning-schedule' },
    { label: 'Event Execution', id: 'event-execution' },
    { label: 'Event Feedback & Review', id: 'event-feedback-review' }
  ] },
  { title: 'Activity Planning', items: [
    { label: 'Planner Dashboard', id: 'planner-dashboard' },
    { label: 'Activity Management', id: 'activity-management' },
    { label: 'Activity Calendar', id: 'activity-calendar' },
    { label: 'Monthly Activity Calendar', id: 'monthly-activity-calendar' },
    { label: 'Activity Types & Settings', id: 'activity-types-settings' },
    { label: 'Recurring Activities', id: 'recurring-activities' },
    { label: 'Bulk Planning', id: 'bulk-planning' },
    { label: 'Conflict Detection', id: 'conflict-detection' },
    { label: 'Notifications & Reminders', id: 'notifications-reminders' }
  ] },
  { title: 'Teacher & Department Coordination', items: [
    { label: 'Department Duty Allocation', id: 'department-duty-allocation' },
    { label: 'Teacher Schedule View', id: 'teacher-schedule-view' },
    { label: 'Teacher Workload View', id: 'teacher-workload-view' },
    { label: 'Teacher Duty Report', id: 'teacher-duty-report' }
  ] },
  { title: 'Competition Management', items: [
    { label: 'Competition Master', id: 'competition-master' },
    { label: 'Competition Events', id: 'competition-events' },
    { label: 'Student Participation', id: 'competition-student-participation' },
    { label: 'Results & Achievements', id: 'competition-results-achievements' }
  ] },
  { title: 'Co-curricular Activities', items: [
    { label: 'Clubs & Activities', id: 'clubs-activities' },
    { label: 'Activity Attendance & Evaluation', id: 'activity-attendance-evaluation' }
  ] }
];
const timetableSidebar: SidebarSection[] = [{ title: 'Timetable', items: [{ label: 'Timetable Setup', id: 'timetable-setup' }, { label: 'Class Timetable', id: 'class-timetable' }, { label: 'Teacher Timetable', id: 'teacher-timetable' }, { label: 'Substitution Management', id: 'substitution-management' }, { label: 'Room & Resource Allocation', id: 'room-resource-allocation' }] }];
const administrationSidebar: SidebarSection[] = [
  { title: 'Administration', items: [
    { label: 'My Workflow Hub', id: 'my-workflow-hub' },
    { label: 'Workflow Setup Desk', id: 'workflow-setup-desk' }
  ] },
  { title: 'Governance & Audit', items: [
    { label: 'Administrative Control Reports', id: 'administrative-control-reports' },
    { label: 'Consent Log', id: 'consent-log' },
    { label: 'Data Governance & Lock Manager', id: 'data-governance-lock-manager' }
  ] }
];
const academicsSidebar: SidebarSection[] = [
  { title: 'Planning & Tracking', items: [{ label: 'Academic Planning & Execution', id: 'academic-planning-execution' }] },
  { title: 'Operations', items: [{ label: 'Academic Attendance', id: 'academic-attendance' }, { label: 'Classroom Operations', id: 'classroom-operations' }, { label: 'Teacher Progress Dashboard', id: 'teacher-progress-dashboard' }, { label: 'School Diary', id: 'school-diary' }] }
];
const curriculumSidebar: SidebarSection[] = [{ title: 'Curriculum', items: [
  { label: 'Curriculum Progress Tracker', id: 'curriculum-progress-tracker' },
  { label: 'Skill Development Assessment', id: 'skill-development-assessment' },
  { label: 'Classwork', id: 'classwork' },
  { label: 'Homework & Assignments', id: 'homework-assignments' },
  { label: 'Study Material', id: 'study-material' }
] }];
const healthSidebar: SidebarSection[] = [{ title: 'Health', items: [{ label: 'Health Records', id: 'health-records' }, { label: 'Health Checkups', id: 'health-checkups' }, { label: 'Incident Management', id: 'incident-management' }, { label: 'Vaccination Tracking', id: 'vaccination-tracking' }] }];
const misSidebar: SidebarSection[] = [{ title: 'Dashboards', items: [{ label: 'Executive Dashboards', id: 'executive-dashboards' }, { label: 'Academic Analytics', id: 'academic-analytics' }, { label: 'Attendance Analytics', id: 'attendance-analytics' }, { label: 'Financial Overview', id: 'financial-overview' }] }, { title: 'Reports', items: [{ label: 'Compliance & Government Data', id: 'compliance-government-data' }, { label: 'Custom Report Builder', id: 'custom-report-builder-mis' }] }];
const projectManagementSidebar: SidebarSection[] = [{ title: 'Project Management', items: [{ label: 'Project Setup', id: 'project-setup' }, { label: 'Task Management', id: 'task-management' }, { label: 'Resource Management', id: 'resource-management' }, { label: 'Milestone Tracking', id: 'milestone-tracking' }, { label: 'Project Reports', id: 'project-reports' }] }];
const eisSidebar: SidebarSection[] = [{ title: 'Executive Information', items: [{ label: 'Executive KPI Dashboard', id: 'executive-kpi-dashboard' }, { label: 'Strategic Planning', id: 'strategic-planning' }, { label: 'Risk & Alert Monitoring', id: 'risk-alert-monitoring' }, { label: 'Performance Overview', id: 'performance-overview' }] }];
const issueReportingSidebar: SidebarSection[] = [{ title: 'Issue Management', items: [{ label: 'Issue Logging', id: 'issue-logging' }, { label: 'Ticket Management', id: 'ticket-management' }, { label: 'Maintenance Requests', id: 'maintenance-requests' }, { label: 'Escalation Management', id: 'escalation-management' }, { label: 'Feedback & Closure', id: 'feedback-closure' }] }];
const myCommunicationSidebar: SidebarSection[] = [
  { title: 'Messages', items: [{ label: 'Internal Messages Inbox', id: 'my-messages-inbox' }, { label: 'Sent Items & Drafts', id: 'my-sent-drafts' }] },
  { title: 'Notifications', items: [
    { label: 'Notification Centre', id: 'my-notification-centre' },
    { label: 'Announcement Subscriptions', id: 'my-announcement-subscriptions' },
    { label: 'Notification Queue & Resend', id: 'notification-queue-resend-utility' }
  ] },
  { title: 'Meetings', items: [{ label: 'Meeting & Appointment Requests', id: 'my-meeting-requests' }] },
  { title: 'History', items: [{ label: 'Communication History', id: 'my-communication-history' }] },
  { title: 'Feedback', items: [{ label: 'Feedback & Suggestions', id: 'my-feedback-suggestions' }] }
];
const manageSettingsSidebar: SidebarSection[] = [{ title: 'System Updates', items: [{ label: 'Release Note Detail', id: 'my-release-note-detail' }] }, { title: 'Account', items: [{ label: 'My Account Settings', id: 'my-account-settings' }, { label: 'Password & Security', id: 'my-password-security' }] }, { title: 'Preferences', items: [{ label: 'General Settings', id: 'my-display-language' }] }, { title: 'Policies', items: [{ label: 'Policy Library', id: 'my-policy-library' }, { label: 'Policy Acknowledgement History', id: 'my-policy-acknowledgements' }] }, { title: 'Accounts & Devices', items: [{ label: 'Linked Accounts', id: 'my-linked-accounts' }, { label: 'Device & Session Management', id: 'my-device-sessions' }] }, { title: 'Audit', items: [{ label: 'My Data Access Log', id: 'my-data-access-log' }] }];
const qrBarcodeSidebar: SidebarSection[] = [{ title: 'QR Code & Barcode', items: [{ label: 'QR / Barcode Master', id: 'qr-barcode-master' }, { label: 'Code Generator (Bulk & Dynamic)', id: 'code-generator' }, { label: 'Entity Mapping', id: 'entity-mapping' }, { label: 'Scan & Usage Management', id: 'scan-usage-management' }, { label: 'Attendance & Access Integration', id: 'attendance-access-integration' }, { label: 'Security & Expiry Controls', id: 'security-expiry-controls' }, { label: 'Reports & Scan Logs', id: 'reports-scan-logs' }] }];
const gpsTrackingSidebar: SidebarSection[] = [{ title: 'GPS Tracking (Transport)', items: [{ label: 'Vehicle & Device Master', id: 'vehicle-device-master' }, { label: 'Route & Geo-Fence Setup', id: 'route-geofence-setup' }, { label: 'Live Tracking Dashboard', id: 'live-tracking-dashboard' }, { label: 'Student Boarding Tracking', id: 'student-boarding-tracking' }, { label: 'Alert Integration', id: 'gps-alert-integration' }, { label: 'Trip History & Logs', id: 'trip-history-logs' }, { label: 'Transport Analytics', id: 'transport-analytics' }] }];
const mobileAppSidebar: SidebarSection[] = [{ title: 'Mobile App Integration', items: [{ label: 'App Configuration & Feature Control', id: 'app-configuration' }, { label: 'Role-Based Access Setup', id: 'role-based-access-setup' }, { label: 'Push Notification Management', id: 'push-notification-management' }, { label: 'Content & Announcement Control', id: 'content-announcement-control' }, { label: 'Authentication (OTP / SSO)', id: 'app-authentication' }, { label: 'App Usage Analytics', id: 'app-usage-analytics' }, { label: 'App Logs & Monitoring', id: 'app-logs-monitoring' }] }];
const whatsappSidebar: SidebarSection[] = [{ title: 'WhatsApp Integration', items: [{ label: 'API Configuration', id: 'whatsapp-api-configuration' }, { label: 'Template Management', id: 'whatsapp-template-management' }, { label: 'Automated Notification Rules', id: 'automated-notification-rules' }, { label: 'Bulk Messaging Panel', id: 'bulk-messaging-panel' }, { label: 'Two-Way Communication', id: 'two-way-communication' }, { label: 'Delivery Tracking', id: 'whatsapp-delivery-tracking' }, { label: 'Logs & Analytics', id: 'whatsapp-logs-analytics' }] }];
const tallySidebar: SidebarSection[] = [{ title: 'Tally Integration', items: [{ label: 'Company & Ledger Mapping', id: 'company-ledger-mapping' }, { label: 'Voucher & Fee Sync', id: 'voucher-fee-sync' }, { label: 'GST & Tax Mapping', id: 'gst-tax-mapping' }, { label: 'Auto Posting Rules', id: 'auto-posting-rules' }, { label: 'Export / Import Controls', id: 'export-import-controls' }, { label: 'Sync Monitoring', id: 'tally-sync-monitoring' }, { label: 'Audit Logs & Reports', id: 'tally-audit-logs-reports' }] }];
const paymentGatewaySidebar: SidebarSection[] = [{ title: 'Payment Gateway', items: [{ label: 'Payment Gateway Master', id: 'payment-gateway-master' }, { label: 'Online Payment & Convenience Fee Settings', id: 'online-payment-convenience-fee' }, { label: 'Gateway Configuration', id: 'gateway-configuration' }, { label: 'Online Payment Setup', id: 'online-payment-setup' }, { label: 'Fee Head Mapping', id: 'fee-head-mapping' }, { label: 'Online Payment Management', id: 'online-payment-management' }, { label: 'Auto Reconciliation', id: 'auto-reconciliation' }, { label: 'Refund & Adjustment Panel', id: 'refund-adjustment-panel' }, { label: 'Transaction Monitoring', id: 'transaction-monitoring' }, { label: 'Payment Analytics', id: 'payment-analytics' }] },
  { title: 'List Screen', items: [{ label: 'Online Payment Dashboard', id: 'online-payment-dashboard' }, { label: 'Online Transaction List', id: 'online-transaction-list' }, { label: 'Failed / Disputed Transactions', id: 'failed-disputed-transactions' }] },
  { title: 'Transaction', items: [{ label: 'Initiate Online Payment', id: 'initiate-online-payment' }, { label: 'Online Payment Re-try / Status Sync', id: 'online-payment-retry-status' }, { label: 'Online Refund Processing', id: 'online-refund-processing' }, { label: 'Gateway Settlement Import', id: 'gateway-settlement-import' }, { label: 'Online Payment Reconciliation', id: 'online-payment-reconciliation' }] },
  { title: 'Report Criteria', items: [{ label: 'Online Payment Report', id: 'online-payment-report' }, { label: 'Gateway-wise Collection Summary', id: 'gateway-wise-collection-summary' }, { label: 'Settlement Mismatch Report', id: 'settlement-mismatch-report'}] }
];
const emailSidebar: SidebarSection[] = [{ title: 'Email Integration', items: [{ label: 'SMTP & Domain Setup', id: 'smtp-domain-setup' }, { label: 'Template Manager', id: 'email-template-manager' }, { label: 'Bulk & Automated Email Rules', id: 'bulk-automated-email-rules' }, { label: 'Scheduling & Attachments', id: 'scheduling-attachments' }, { label: 'Delivery Tracking', id: 'email-delivery-tracking' }, { label: 'Bounce & Spam Handling', id: 'bounce-spam-handling' }, { label: 'Email Logs & Reports', id: 'email-logs-reports' }] }];
const biometricSidebar: SidebarSection[] = [{ title: 'Biometric Integration', items: [{ label: 'Device Registration & Mapping', id: 'device-registration-mapping' }, { label: 'User Biometric Mapping', id: 'user-biometric-mapping' }, { label: 'Attendance Sync Engine', id: 'attendance-sync-engine' }, { label: 'Real-Time / Manual Sync', id: 'realtime-manual-sync' }, { label: 'Attendance Logs', id: 'biometric-attendance-logs' }, { label: 'Exception & Error Handling', id: 'exception-error-handling' }, { label: 'Device Monitoring', id: 'biometric-device-monitoring' }] }];
const smsCallingSidebar: SidebarSection[] = [{ title: 'SMS & Calling', items: [{ label: 'SMS Gateway Configuration', id: 'sms-gateway-configuration' }, { label: 'DLT & Template Management', id: 'dlt-template-management' }, { label: 'Automated SMS Rules', id: 'automated-sms-rules' }, { label: 'Bulk Messaging', id: 'bulk-messaging-sms' }, { label: 'IVR / Auto Call Setup', id: 'ivr-auto-call-setup' }, { label: 'Delivery Reports', id: 'sms-delivery-reports' }, { label: 'Credit Usage & Logs', id: 'credit-usage-logs' }] }];
const googleAppsSidebar: SidebarSection[] = [{ title: 'Google Apps Integration', items: [{ label: 'Google Workspace Authentication', id: 'google-workspace-auth' }, { label: 'Classroom & Assignment Sync', id: 'classroom-assignment-sync' }, { label: 'Meet & Calendar Integration', id: 'meet-calendar-integration' }, { label: 'Drive & Document Sync', id: 'drive-document-sync' }, { label: 'SSO Configuration', id: 'google-sso-configuration' }, { label: 'API Token Management', id: 'google-api-token-management' }, { label: 'Sync Logs & Monitoring', id: 'google-sync-logs-monitoring' }] }];
const microsoftToolsSidebar: SidebarSection[] = [{ title: 'Microsoft Tools Integration', items: [{ label: 'Microsoft 365 Authentication', id: 'microsoft-365-auth' }, { label: 'Teams & Assignment Sync', id: 'teams-assignment-sync' }, { label: 'Outlook & Calendar Integration', id: 'outlook-calendar-integration' }, { label: 'OneDrive & SharePoint Sync', id: 'onedrive-sharepoint-sync' }, { label: 'Azure AD SSO', id: 'azure-ad-sso' }, { label: 'Meeting Automation', id: 'ms-meeting-automation' }, { label: 'Sync Logs & Monitoring', id: 'ms-sync-logs-monitoring' }] }];
const alertPluginSidebar: SidebarSection[] = [{ title: 'Alert', items: [{ label: 'Alert Master', id: 'alert-master' }, { label: 'Rule Engine', id: 'alert-rule-engine' }, { label: 'Channel & Delivery Management', id: 'channel-delivery-management' }, { label: 'Templates', id: 'alert-templates' }, { label: 'Escalation & Automation', id: 'escalation-automation' }, { label: 'Dashboard', id: 'alert-dashboard' }, { label: 'Logs & Analytics', id: 'alert-logs-analytics' }] }];

export const modules: Module[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, subModules: createSubModules(['User Dashboard', 'EIS Consolidate Dashboard', 'MIS Consolidate Dashboard', 'SMS Predefine Alert']) },
  { id: 'student', label: 'Student', icon: Users, subModules: [{ id: 'student-management', label: 'Student Management', sidebarConfig: studentManagementSidebar }, { id: 'student-settings', label: 'Student Settings', sidebarConfig: studentSettingsSidebar }, { id: 'admissions', label: 'Admissions', sidebarConfig: admissionSidebar }, { id: 'attendance', label: 'Attendance', sidebarConfig: attendanceSidebar }, { id: 'certificates', label: 'Certificates', sidebarConfig: certificateSidebar }] },
  { id: 'academic', label: 'Academic', icon: GraduationCap, subModules: [{ id: 'academics', label: 'Academics', sidebarConfig: academicsSidebar }, { id: 'curriculum', label: 'Curriculum', sidebarConfig: curriculumSidebar }, { id: 'timetable', label: 'Timetable', sidebarConfig: timetableSidebar }, { id: 'event-activities', label: 'Event/Activities', sidebarConfig: eventActivitiesSidebar }] },
  { id: 'finance', label: 'Finance', icon: Wallet, subModules: [{ id: 'ledgers', label: 'Ledgers', sidebarConfig: ledgersSidebar }, { id: 'fees', label: 'Fees', sidebarConfig: feesSidebar }, { id: 'charge', label: 'Charge', sidebarConfig: chargeSidebar }, { id: 'scholarship', label: 'Scholarship', sidebarConfig: scholarshipSidebar }, { id: 'expenses', label: 'Expenses', sidebarConfig: expensesSidebar }] },
  { id: 'hr', label: 'HR', icon: Briefcase, subModules: [{ id: 'employee', label: 'Employee', sidebarConfig: employeeSidebar }, { id: 'attendance', label: 'Attendance', sidebarConfig: hrAttendanceSidebar }, { id: 'payroll', label: 'Payroll', sidebarConfig: payrollSidebar }, { id: 'master', label: 'Master', sidebarConfig: hrMasterSidebar }, { id: 'appraisal', label: 'Appraisal', sidebarConfig: appraisalSidebar }, { id: 'recruitment', label: 'Recruitment', sidebarConfig: recruitmentSidebar }, { id: 'income-tax', label: 'Income Tax', sidebarConfig: incomeTaxSidebar }] },
  { id: 'assessment', label: 'Assessment', icon: ClipboardList, subModules: [{ id: 'general', label: 'Assessment Setup', sidebarConfig: generalAssessmentSidebar }, { id: 'preschool-assessment', label: 'Preschool Assessment', sidebarConfig: preschoolAssessmentSidebar }, { id: 'cce-management', label: 'CCE Management', sidebarConfig: ccemanagementSidebar }, { id: 'result-card-management', label: 'Result Card Management', sidebarConfig: resultCardManagementSidebar }, { id: 'gseb', label: 'GSEB', sidebarConfig: gsebSidebar }, { id: 'cbse', label: 'CBSE', sidebarConfig: cbseSidebar }, { id: 'cisce', label: 'CISCE', sidebarConfig: cisceSidebar }] },
  { id: 'admin-tools', label: 'Admin Tools', icon: Shield, subModules: [{ id: 'security', label: 'Security', sidebarConfig: securitySidebar }, { id: 'administration', label: 'Administration', sidebarConfig: administrationSidebar }, { id: 'utilities', label: 'Utilities', sidebarConfig: utilitiesSidebar }, { id: 'masters', label: 'Masters', sidebarConfig: mastersSidebar }, { id: 'institute-setup', label: 'Institute Setup', sidebarConfig: instituteSetupSidebar }, { id: 'marketplace', label: 'Marketplace', sidebarConfig: marketplaceSidebar }, { id: 'billing', label: 'Billing', sidebarConfig: billingSidebar }] },
  { id: 'more', label: 'More', icon: Grid, subModules: [{ id: 'newsfeed', label: 'Newsfeed', sidebarConfig: newsfeedSidebar }, { id: 'reports', label: 'Reports', sidebarConfig: reportsSidebar }, { id: 'front-office', label: 'Front Office', sidebarConfig: frontOfficeSidebar }, { id: 'communications', label: 'Communications', sidebarConfig: communicationsSidebar }, { id: 'health', label: 'Health', sidebarConfig: healthSidebar }, { id: 'mis', label: 'MIS', sidebarConfig: misSidebar }, { id: 'project-management', label: 'Project Management', sidebarConfig: projectManagementSidebar }, { id: 'eis', label: 'EIS', sidebarConfig: eisSidebar }, { id: 'issue-reporting', label: 'Issue Reporting', sidebarConfig: issueReportingSidebar }] },
  { id: 'my-details', label: 'My Details', icon: User, subModules: [{ id: 'my-communication', label: 'My Communication', sidebarConfig: myCommunicationSidebar }, { id: 'manage-settings', label: 'Manage Settings', sidebarConfig: manageSettingsSidebar }] },
  { id: 'plugins', label: 'Plugins', icon: Puzzle, subModules: [{ id: 'qr-barcode', label: 'QR Code & Barcode', sidebarConfig: qrBarcodeSidebar }, { id: 'gps-tracking', label: 'GPS Tracking', sidebarConfig: gpsTrackingSidebar }, { id: 'mobile-app', label: 'Mobile App', sidebarConfig: mobileAppSidebar }, { id: 'whatsapp', label: 'WhatsApp', sidebarConfig: whatsappSidebar }, { id: 'tally', label: 'Tally', sidebarConfig: tallySidebar }, { id: 'payment-gateway', label: 'Payment Gateway', sidebarConfig: paymentGatewaySidebar }, { id: 'email', label: 'Email', sidebarConfig: emailSidebar }, { id: 'biometric', label: 'Biometric', sidebarConfig: biometricSidebar }, { id: 'sms-calling', label: 'SMS & Calling', sidebarConfig: smsCallingSidebar }, { id: 'google-apps', label: 'Google Apps', sidebarConfig: googleAppsSidebar }, { id: 'microsoft-tools', label: 'Microsoft Tools', sidebarConfig: microsoftToolsSidebar }, { id: 'alert', label: 'Alert', sidebarConfig: alertPluginSidebar }] }
];
