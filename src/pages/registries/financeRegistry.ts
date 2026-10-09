import { rp } from './registryHelper';

export const financeRegistry: Record<string, () => any> = {
  // Ledgers
  'general-ledger': rp(
    () => import('../finance/ledgers/GeneralLedger'),
    'GeneralLedger'
  ),
  'day-book': rp(() => import('../finance/ledgers/DayBook'), 'DayBook'),
  'cash-book': rp(() => import('../finance/ledgers/CashBook'), 'CashBook'),
  'bank-book': rp(() => import('../finance/ledgers/BankBook'), 'BankBook'),
  'income-expenditure': rp(
    () => import('../finance/ledgers/IncomeExpenditure'),
    'IncomeExpenditure'
  ),
  'balance-sheet': rp(
    () => import('../finance/ledgers/BalanceSheet'),
    'BalanceSheet'
  ),
  'ledger-audit-trail': rp(
    () => import('../finance/ledgers/LedgerAuditTrail'),
    'LedgerAuditTrail'
  ),

  // Fees
  'fee-summary-dashboard': rp(
    () => import('../finance/fees/FeeSummaryDashboard'),
    'FeeSummaryDashboard'
  ),
  // Fee Receipt & Discount List is merged into Student Fee Process (one page: list → student fee details)
  'fee-receipt-list': rp(
    () => import('../finance/fees/StudentFeeProcess'),
    'StudentFeeProcess'
  ),
  'fee-pending-list': rp(
    () => import('../finance/fees/FeePendingList'),
    'FeePendingList'
  ),
  'fee-collection-register': rp(
    () => import('../finance/fees/FeeCollectionRegister'),
    'FeeCollectionRegister'
  ),
  'fee-receipt': rp(() => import('../finance/fees/FeeReceipt'), 'FeeReceipt'),
  'student-fee-process': rp(
    () => import('../finance/fees/StudentFeeProcess'),
    'StudentFeeProcess'
  ),
  'fee-receipt-bulk': rp(
    () => import('../finance/fees/FeeReceiptBulk'),
    'FeeReceiptBulk'
  ),
  'fee-refund': rp(() => import('../finance/fees/FeeRefund'), 'FeeRefund'),
  'assign-exemption-type': rp(
    () => import('../finance/fees/AssignExemptionType'),
    'AssignExemptionType'
  ),
  'fee-collection-reports': rp(
    () => import('../finance/fees/FeeCollectionReports'),
    'FeeReportsPage'
  ),
  'branch-transfer': rp(
    () => import('../finance/fees/BranchTransfer'),
    'BranchTransfer'
  ),
  'fee-structure': rp(
    () => import('../finance/fees/FeeStructure'),
    'FeeStructure'
  ),
  'royalty-collection': rp(
    () => import('../finance/fees/RoyaltyCollection'),
    'RoyaltyCollection'
  ),
  'fee-receipt-template': rp(
    () => import('../finance/fees/FeeReceiptTemplate'),
    'default'
  ),

  // Charge
  'charge-summary-dashboard': rp(
    () => import('../finance/charge/ChargeSummaryDashboard'),
    'ChargeSummaryDashboard'
  ),
  // Charge List is merged into Charge Receipt (one page: students & staff with pending charges → collect payment)
  'charge-list': rp(() => import('../finance/charge/ChargeReceipt'), 'ChargeReceipt'),
  'charge-receipt': rp(
    () => import('../finance/charge/ChargeReceipt'),
    'ChargeReceipt'
  ),
  'charge-receipt-import': rp(
    () => import('../finance/charge/ChargeReceiptImport'),
    'ChargeReceiptImport'
  ),
  'charge-receipt-report': rp(
    () => import('../finance/charge/ChargeReceiptReport'),
    'ChargeReceiptReport'
  ),
  'charge-receipt-book-master': rp(
    () => import('../finance/charge/ChargeReceiptBookMaster'),
    'ChargeReceiptBookMaster'
  ),
  // Charge Master is listed under Admin Tools → Masters → Charge
  'charge-master': rp(
    () => import('../finance/charge/ChargeMaster'),
    'ChargeMaster'
  ),
  // Scholarship
  'scholarship-summary-dashboard': rp(
    () => import('../finance/scholarship/ScholarshipSummaryDashboard'),
    'ScholarshipSummaryDashboard'
  ),
  'student-scholarship-list': rp(
    () => import('../finance/scholarship/StudentScholarshipList'),
    'StudentScholarshipList'
  ),
  // Scholarship Application List + Eligibility & Evaluation are merged into Scholarship Application Entry
  'scholarship-application-list': rp(
    () => import('../finance/scholarship/ScholarshipApplicationEntry'),
    'ScholarshipApplicationEntry'
  ),
  'scholarship-application-entry': rp(
    () => import('../finance/scholarship/ScholarshipApplicationEntry'),
    'ScholarshipApplicationEntry'
  ),
  'scholarship-eligibility-evaluation': rp(
    () => import('../finance/scholarship/ScholarshipApplicationEntry'),
    'ScholarshipApplicationEntry'
  ),
  'scholarship-approval-sanction': rp(
    () => import('../finance/scholarship/ScholarshipApprovalSanction'),
    'ScholarshipApprovalSanction'
  ),
  // Scholarship Allocation to Fee is replaced by the new Scholarship Disbursement page (fee waiver + cash)
  'scholarship-allocation-fee': rp(
    () => import('../finance/scholarship/ScholarshipDisbursement'),
    'ScholarshipDisbursement'
  ),
  'scholarship-disbursement': rp(
    () => import('../finance/scholarship/ScholarshipDisbursement'),
    'ScholarshipDisbursement'
  ),
  'scholarship-documents-receipts': rp(
    () => import('../finance/scholarship/ScholarshipDocumentsReceipts'),
    'ScholarshipDocumentsReceipts'
  ),
  'scholarship-adjustment-cancellation': rp(
    () => import('../finance/scholarship/ScholarshipAdjustmentCancellation'),
    'ScholarshipAdjustmentCancellation'
  ),
  'scholarship-utilization-report': rp(
    () => import('../finance/scholarship/ScholarshipReport'),
    'ScholarshipReport'
  ),
  'pending-rejected-applications-report': rp(
    () => import('../finance/scholarship/ScholarshipReport'),
    'ScholarshipReport'
  ),
  'scholarship-scheme-master': rp(
    () => import('../finance/scholarship/ScholarshipSchemeMaster'),
    'ScholarshipSchemeMaster'
  ),
  'scholarship-quota-master': rp(
    () => import('../finance/scholarship/ScholarshipQuotaMaster'),
    'ScholarshipQuotaMaster'
  ),
  'scholarship-criteria-master': rp(
    () => import('../finance/scholarship/ScholarshipCriteriaMaster'),
    'ScholarshipCriteriaMaster'
  ),

  // Account
  'account-master': rp(
    () => import('../finance/ledgers/AccountMaster'),
    'AccountMaster'
  ),

  // Expenses
  'expense-summary-dashboard': rp(
    () => import('../finance/expenses/ExpenseSummaryDashboard'),
    'ExpenseSummaryDashboard'
  ),
  'expense-request': rp(
    () => import('../finance/expenses/ExpenseRequest'),
    'ExpenseRequest'
  ),
  'expense-budget-master': rp(
    () => import('../finance/expenses/ExpenseBudgetMaster'),
    'ExpenseBudgetMaster'
  ),
  'expense-voucher-entry': rp(
    () => import('../finance/expenses/ExpenseVoucherEntry'),
    'ExpenseVoucherEntry'
  ),
  'bill-invoice-management': rp(
    () => import('../finance/expenses/BillInvoiceManagement'),
    'BillInvoiceManagement'
  ),
  'expense-payment': rp(
    () => import('../finance/expenses/BillInvoiceManagement'),
    'BillInvoiceManagement'
  ),
  'vendor-payment': rp(
    () => import('../finance/expenses/BillInvoiceManagement'),
    'BillInvoiceManagement'
  ),
  'petty-cash-issue': rp(
    () => import('../finance/expenses/PettyCashIssue'),
    'PettyCashIssue'
  ),
  'recurring-expense-scheduler': rp(
    () => import('../finance/expenses/ExpenseRequest'),
    'ExpenseRequest'
  ),
  'bulk-expense-import': rp(
    () => import('../finance/expenses/BulkExpenseImport'),
    'BulkExpenseImport'
  ),
  'expense-approval-workflow': rp(
    () => import('../finance/expenses/ExpenseRequest'),
    'ExpenseRequest'
  ),
  'expense-report': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),
  'budget-vs-actual-report': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),
  'department-wise-expense': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),
  'vendor-wise-expense': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),
  'petty-cash-report': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),

};