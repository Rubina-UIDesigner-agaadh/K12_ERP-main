import { rp } from './registryHelper';

export const hrRegistry: Record<string, () => any> = {
  // Employee
  'employee-summary-dashboard': rp(
    () => import('../hr/employee/EmployeeSummaryDashboard'),
    'EmployeeSummaryDashboard'
  ),
  'employee-list-directory': rp(
    () => import('../hr/employee/EmployeeList'),
    'EmployeeList'
  ),
  'employee-profile-view': rp(
    () => import('../hr/employee/EmployeeProfileView'),
    'EmployeeProfileView'
  ),
  'employee-service-register': rp(
    () => import('../hr/employee/EmployeeServiceRegister'),
    'EmployeeServiceRegister'
  ),
  'probation-confirmation-list': rp(
    () => import('../hr/employee/ProbationConfirmationList'),
    'ProbationConfirmationList'
  ),
  'exit-relieved-employees': rp(
    () => import('../hr/employee/ExitRelievedEmployees'),
    'ExitRelievedEmployees'
  ),
  'add-edit-employee-profile': rp(
    () => import('../hr/employee/EmployeeProfile'),
    'EmployeeProfile'
  ),
  'employee-joining-onboarding': rp(
    () => import('../hr/employee/EmployeeJoiningOnboarding'),
    'EmployeeJoiningOnboarding'
  ),
  'employee-confirmation': rp(
    () => import('../hr/employee/EmployeeConfirmation'),
    'EmployeeConfirmation'
  ),
  'employee-transfer': rp(
    () => import('../hr/employee/EmployeeTransfer'),
    'EmployeeTransfer'
  ),
  'role-responsibility-assignment': rp(
    () => import('../hr/employee/RoleResponsibilityAssignment'),
    'RoleResponsibilityAssignment'
  ),
  'employee-separation-exit': rp(
    () => import('../hr/employee/EmployeeSeparationExit'),
    'EmployeeSeparationExit'
  ),
  'document-upload-verification': rp(
    () => import('../hr/employee/DocumentUploadVerification'),
    'DocumentUploadVerification'
  ),
  'employee-id-card': rp(
    () => import('../hr/employee/EmployeeIdCard'),
    'EmployeeIdCard'
  ),
  'teacher-class-subject-allocation': rp(
    () => import('../hr/employee/TeacherClassSubjectAllocation'),
    'TeacherClassSubjectAllocation'
  ),
  'staff-advance-issue': rp(
    () => import('../hr/employee/StaffAdvanceIssue'),
    'StaffAdvanceIssue'
  ),
  'staff-advance-settlement': rp(
    () => import('../hr/employee/StaffAdvanceSettlement'),
    'StaffAdvanceSettlement'
  ),
  'employee-report-advanced': rp(
    () => import('../hr/employee/EmployeeReportAdvanced'),
    'EmployeeReportAdvanced'
  ),
  'staff-strength-demographic-report': rp(
    () => import('../hr/employee/StaffStrengthDemographicReport'),
    'StaffStrengthDemographicReport'
  ),
  'teaching-allocation-summary': rp(
    () => import('../hr/employee/TeachingAllocationSummary'),
    'TeachingAllocationSummary'
  ),

  // Attendance
  'employee-register-view': rp(
    () => import('../hr/attendance/EmployeeRegisterView'),
    'EmployeeRegisterView'
  ),
  'leave-balance-log': rp(
    () => import('../hr/attendance/LeaveBalanceLog'),
    'LeaveBalanceLog'
  ),
  'view-leave-balance': rp(
    () => import('../hr/attendance/ViewLeaveBalance'),
    'ViewLeaveBalance'
  ),
  'employee-attendance-summary': rp(
    () => import('../hr/attendance/EmployeeAttendanceSummary'),
    'EmployeeAttendanceSummary'
  ),
  'settle-days': rp(() => import('../hr/attendance/SettleDays'), 'SettleDays'),
  'daily-attendance-log': rp(
    () => import('../hr/attendance/DailyAttendanceLog'),
    'DailyAttendanceLog'
  ),
  'late-early-arrival-register': rp(
    () => import('../hr/attendance/LateEarlyArrivalRegister'),
    'LateEarlyArrivalRegister'
  ),
  'overtime-register': rp(
    () => import('../hr/attendance/OvertimeRegister'),
    'OvertimeRegister'
  ),
  'employee-register': rp(
    () => import('../hr/attendance/EmployeeRegister'),
    'EmployeeRegister'
  ),
  'employee-attendance-admin': rp(
    () => import('../hr/attendance/EmployeeAttendanceAdmin'),
    'EmployeeAttendanceAdmin'
  ),
  'manual-attendance-employee': rp(
    () => import('../hr/attendance/ManualAttendanceEmployee'),
    'ManualAttendanceEmployee'
  ),
  'leave-balance-adjust-bulk': rp(
    () => import('../hr/attendance/LeaveBalanceAdjustBulk'),
    'LeaveBalanceAdjustBulk'
  ),
  'leave-balance-add': rp(
    () => import('../hr/attendance/LeaveBalanceAdd'),
    'LeaveBalanceAdd'
  ),
  'leave-balance-listing': rp(
    () => import('../hr/attendance/LeaveBalanceListing'),
    'LeaveBalanceListing'
  ),
  'leave-balance-adjust': rp(
    () => import('../hr/attendance/LeaveBalanceAdjust'),
    'LeaveBalanceAdjust'
  ),
  'monthly-attendance-register-hr': rp(
    () => import('../hr/attendance/MonthlyAttendanceRegisterHr'),
    'MonthlyAttendanceRegisterHr'
  ),
  'leave-entry-bulk': rp(
    () => import('../hr/attendance/LeaveEntryBulk'),
    'LeaveEntryBulk'
  ),
  'leave-single-application': rp(
    () => import('../hr/attendance/LeaveSingleApplication'),
    'LeaveSingleApplication'
  ),
  'monthly-attendance': rp(
    () => import('../hr/attendance/MonthlyAttendance'),
    'MonthlyAttendance'
  ),
  'travel-listing-on-duty': rp(
    () => import('../hr/attendance/TravelListingOnDuty'),
    'TravelListingOnDuty'
  ),
  'leave-listing': rp(
    () => import('../hr/attendance/LeaveListing'),
    'LeaveListing'
  ),
  'leave-hierarchy-listing': rp(
    () => import('../hr/attendance/LeaveHierarchyListing'),
    'LeaveHierarchyListing'
  ),
  'attendance-device-import': rp(
    () => import('../hr/attendance/AttendanceDeviceImport'),
    'AttendanceDeviceImport'
  ),
  'shift-weekly-off-assignment': rp(
    () => import('../hr/attendance/ShiftWeeklyOffAssignment'),
    'ShiftWeeklyOffAssignment'
  ),
  'hr-attendance-report': rp(
    () => import('../hr/attendance/HrAttendanceReport'),
    'HrAttendanceReport'
  ),
  'hr-leave-report': rp(
    () => import('../hr/attendance/HrLeaveReport'),
    'HrLeaveReport'
  ),
  'absentee-latecomer-report': rp(
    () => import('../hr/attendance/AbsenteeLatecomerReport'),
    'AbsenteeLatecomerReport'
  ),

  // Payroll
  'payroll-summary-dashboard': rp(
    () => import('../hr/payroll/PayrollDashboard'),
    'PayrollDashboard'
  ),
  'salary-register-view': rp(
    () => import('../hr/payroll/SalaryRegisterView'),
    'SalaryRegisterView'
  ),
  'employee-payslip-list': rp(
    () => import('../hr/payroll/EmployeePayslipList'),
    'EmployeePayslipList'
  ),
  'payroll-exception-list': rp(
    () => import('../hr/payroll/PayrollExceptionList'),
    'PayrollExceptionList'
  ),
  'employee-pay-structure': rp(
    () => import('../hr/payroll/EmployeePayStructure'),
    'EmployeePayStructure'
  ),
  'payroll-process': rp(
    () => import('../hr/payroll/PayrollProcess'),
    'PayrollProcess'
  ),
  'supplementary-arrear-payroll': rp(
    () => import('../hr/payroll/SupplementaryArrearPayroll'),
    'SupplementaryArrearPayroll'
  ),
  'overtime-additional-earnings': rp(
    () => import('../hr/payroll/OvertimeAdditionalEarnings'),
    'OvertimeAdditionalEarnings'
  ),
  'manual-deduction-adjustment': rp(
    () => import('../hr/payroll/ManualDeductionAdjustment'),
    'ManualDeductionAdjustment'
  ),
  'bulk-increment-pay-revision': rp(
    () => import('../hr/payroll/BulkIncrementPayRevision'),
    'BulkIncrementPayRevision'
  ),
  'payslip-lock-release': rp(
    () => import('../hr/payroll/PayslipLockRelease'),
    'PayslipLockRelease'
  ),
  'salary-disbursement-bank-advice': rp(
    () => import('../hr/payroll/SalaryDisbursementBankAdvice'),
    'SalaryDisbursementBankAdvice'
  ),
  'payroll-reversal-reprocess': rp(
    () => import('../hr/payroll/PayrollReversalReprocess'),
    'PayrollReversalReprocess'
  ),
  'payroll-report': rp(
    () => import('../hr/payroll/PayrollReport'),
    'PayrollReport'
  ),
  'earnings-deduction-summary': rp(
    () => import('../hr/payroll/EarningsDeductionSummary'),
    'EarningsDeductionSummary'
  ),
  'department-cost-center-salary': rp(
    () => import('../hr/payroll/DepartmentCostCenterSalary'),
    'DepartmentCostCenterSalary'
  ),
  'payroll-audit-variance-report': rp(
    () => import('../hr/payroll/PayrollAuditVarianceReport'),
    'PayrollAuditVarianceReport'
  ),
  'pay-head-master': rp(
    () => import('../hr/payroll/PayHeadMaster'),
    'PayHeadMaster'
  ),
  'salary-grade-pay-scale-master': rp(
    () => import('../hr/payroll/SalaryGradePayScaleMaster'),
    'SalaryGradePayScaleMaster'
  ),
  'payroll-calendar-period-master': rp(
    () => import('../hr/payroll/PayrollCalendarPeriodMaster'),
    'PayrollCalendarPeriodMaster'
  ),
  'payroll-setup': rp(
    () => import('../hr/payroll/PayrollSetup'),
    'PayrollSetup'
  ),
  'disbursement-mode-bank-setup': rp(
    () => import('../hr/payroll/DisbursementModeBankSetup'),
    'DisbursementModeBankSetup'
  ),

  // Master
  'department-master': rp(
    () => import('../hr/master/DepartmentMaster'),
    'DepartmentMaster'
  ),
  'designation-master': rp(
    () => import('../hr/master/DesignationMaster'),
    'DesignationMaster'
  ),
  'employee-classification-master': rp(
    () => import('../hr/master/EmployeeClassificationMaster'),
    'EmployeeClassificationMaster'
  ),
  'staff-type-category-master': rp(
    () => import('../hr/master/StaffTypeCategoryMaster'),
    'StaffTypeCategoryMaster'
  ),
  'employee-grade-level-master': rp(
    () => import('../hr/master/EmployeeGradeLevelMaster'),
    'EmployeeGradeLevelMaster'
  ),
  'shift-master': rp(() => import('../hr/master/ShiftMaster'), 'ShiftMaster'),
  'working-calendar-master': rp(
    () => import('../hr/master/WorkingCalendarMaster'),
    'WorkingCalendarMaster'
  ),
  'weekly-off-work-pattern-master': rp(
    () => import('../hr/master/WeeklyOffWorkPatternMaster'),
    'WeeklyOffWorkPatternMaster'
  ),
  'leave-type-master': rp(
    () => import('../hr/master/LeaveTypeMaster'),
    'LeaveTypeMaster'
  ),
  'hr-holiday-working-day-calendar': rp(
    () => import('../hr/master/HrHolidayWorkingDayCalendar'),
    'HrHolidayWorkingDayCalendar'
  ),
  'attendance-rule-master': rp(
    () => import('../hr/master/AttendanceRuleMaster'),
    'AttendanceRuleMaster'
  ),
  'employee-document-type-master': rp(
    () => import('../hr/master/EmployeeDocumentTypeMaster'),
    'EmployeeDocumentTypeMaster'
  ),
  'separation-exit-reason-master': rp(
    () => import('../hr/master/SeparationExitReasonMaster'),
    'SeparationExitReasonMaster'
  ),
  'on-duty-travel-type-master': rp(
    () => import('../hr/master/OnDutyTravelTypeMaster'),
    'OnDutyTravelTypeMaster'
  ),
  'role-responsibility-master': rp(
    () => import('../hr/master/RoleResponsibilityMaster'),
    'RoleResponsibilityMaster'
  ),
  'qualification-subject-master': rp(
    () => import('../hr/master/QualificationSubjectMaster'),
    'QualificationSubjectMaster'
  ),
  'service-event-type-master': rp(
    () => import('../hr/master/ServiceEventTypeMaster'),
    'ServiceEventTypeMaster'
  ),

  // Appraisal
  'appraisal-dashboard': rp(
    () => import('../hr/appraisal/AppraisalDashboard'),
    'AppraisalDashboard'
  ),
  'appraisal-cycle-status-view': rp(
    () => import('../hr/appraisal/AppraisalCycleStatusView'),
    'AppraisalCycleStatusView'
  ),
  'employee-appraisal-history': rp(
    () => import('../hr/appraisal/EmployeeAppraisalHistory'),
    'EmployeeAppraisalHistory'
  ),
  'appraisal-cycle-assignment': rp(
    () => import('../hr/appraisal/AppraisalCycleAssignment'),
    'AppraisalCycleAssignment'
  ),
  'self-appraisal-entry': rp(
    () => import('../hr/appraisal/SelfAppraisalEntry'),
    'SelfAppraisalEntry'
  ),
  'manager-hod-appraisal-entry': rp(
    () => import('../hr/appraisal/ManagerHodAppraisalEntry'),
    'ManagerHodAppraisalEntry'
  ),
  'peer-student-feedback-capture': rp(
    () => import('../hr/appraisal/PeerStudentFeedbackCapture'),
    'PeerStudentFeedbackCapture'
  ),
  'appraisal-consolidation-final-rating': rp(
    () => import('../hr/appraisal/AppraisalConsolidationFinalRating'),
    'AppraisalConsolidationFinalRating'
  ),
  'idp-training-needs-entry': rp(
    () => import('../hr/appraisal/IdpTrainingNeedsEntry'),
    'IdpTrainingNeedsEntry'
  ),
  'appraisal-result-report': rp(
    () => import('../hr/appraisal/AppraisalResultReport'),
    'AppraisalResultReport'
  ),
  'rating-distribution-normalisation': rp(
    () => import('../hr/appraisal/RatingDistributionNormalisation'),
    'RatingDistributionNormalisation'
  ),
  'training-needs-action-plan-report': rp(
    () => import('../hr/appraisal/TrainingNeedsActionPlanReport'),
    'TrainingNeedsActionPlanReport'
  ),
  'appraisal-cycle-master': rp(
    () => import('../hr/appraisal/AppraisalCycleMaster'),
    'AppraisalCycleMaster'
  ),
  'appraisal-template-master': rp(
    () => import('../hr/appraisal/AppraisalTemplateMaster'),
    'AppraisalTemplateMaster'
  ),
  'competency-kpi-master': rp(
    () => import('../hr/appraisal/CompetencyKpiMaster'),
    'CompetencyKpiMaster'
  ),
  'rating-scale-master': rp(
    () => import('../hr/appraisal/RatingScaleMaster'),
    'RatingScaleMaster'
  ),
  'appraisal-role-workflow-master': rp(
    () => import('../hr/appraisal/AppraisalRoleWorkflowMaster'),
    'AppraisalRoleWorkflowMaster'
  ),

  // Recruitment
  'recruitment-dashboard': rp(
    () => import('../hr/recruitment/RecruitmentDashboard'),
    'RecruitmentDashboard'
  ),
  'vacancy-requisition-list': rp(
    () => import('../hr/recruitment/VacancyRequisitionList'),
    'VacancyRequisitionList'
  ),
  'applicant-list': rp(
    () => import('../hr/recruitment/ApplicantList'),
    'ApplicantList'
  ),
  'interview-test-schedule-view': rp(
    () => import('../hr/recruitment/InterviewTestScheduleView'),
    'InterviewTestScheduleView'
  ),
  'offer-joining-status-view': rp(
    () => import('../hr/recruitment/OfferJoiningStatusView'),
    'OfferJoiningStatusView'
  ),
  'manpower-requisition': rp(
    () => import('../hr/recruitment/ManpowerRequisition'),
    'ManpowerRequisition'
  ),
  'job-posting-advertisement': rp(
    () => import('../hr/recruitment/JobPostingAdvertisement'),
    'JobPostingAdvertisement'
  ),
  'applicant-entry-online-sync': rp(
    () => import('../hr/recruitment/ApplicantEntryOnlineSync'),
    'ApplicantEntryOnlineSync'
  ),
  'screening-shortlisting': rp(
    () => import('../hr/recruitment/ScreeningShortlisting'),
    'ScreeningShortlisting'
  ),
  'interview-test-scheduling': rp(
    () => import('../hr/recruitment/InterviewTestScheduling'),
    'InterviewTestScheduling'
  ),
  'interview-feedback-scoring': rp(
    () => import('../hr/recruitment/InterviewFeedbackScoring'),
    'InterviewFeedbackScoring'
  ),
  'selection-offer-issue': rp(
    () => import('../hr/recruitment/SelectionOfferIssue'),
    'SelectionOfferIssue'
  ),
  'candidate-joining-conversion': rp(
    () => import('../hr/recruitment/CandidateJoiningConversion'),
    'CandidateJoiningConversion'
  ),
  'recruitment-pipeline-report': rp(
    () => import('../hr/recruitment/RecruitmentPipelineReport'),
    'RecruitmentPipelineReport'
  ),
  'source-campaign-effectiveness-report': rp(
    () => import('../hr/recruitment/SourceCampaignEffectivenessReport'),
    'SourceCampaignEffectivenessReport'
  ),
  'time-to-hire-analytics': rp(
    () => import('../hr/recruitment/TimeToHireAnalytics'),
    'TimeToHireAnalytics'
  ),
  'sanctioned-vs-filled-positions-report': rp(
    () => import('../hr/recruitment/SanctionedVsFilledPositionsReport'),
    'SanctionedVsFilledPositionsReport'
  ),
  'recruitment-position-master': rp(
    () => import('../hr/recruitment/RecruitmentPositionMaster'),
    'RecruitmentPositionMaster'
  ),
  'recruitment-stage-status-master': rp(
    () => import('../hr/recruitment/RecruitmentStageStatusMaster'),
    'RecruitmentStageStatusMaster'
  ),
  'interview-round-panel-master': rp(
    () => import('../hr/recruitment/InterviewRoundPanelMaster'),
    'InterviewRoundPanelMaster'
  ),
  'recruitment-source-channel-master': rp(
    () => import('../hr/recruitment/RecruitmentSourceChannelMaster'),
    'RecruitmentSourceChannelMaster'
  ),
  'evaluation-criteria-competency-master': rp(
    () => import('../hr/recruitment/EvaluationCriteriaCompetencyMaster'),
    'EvaluationCriteriaCompetencyMaster'
  ),
  'recruitment-template-master': rp(
    () => import('../hr/recruitment/RecruitmentTemplateMaster'),
    'RecruitmentTemplateMaster'
  ),
  'recruitment-setup': rp(
    () => import('../hr/recruitment/RecruitmentSetup'),
    'RecruitmentSetup'
  ),

  // Income Tax
  'income-tax-dashboard': rp(
    () => import('../hr/income-tax/IncomeTaxDashboard'),
    'IncomeTaxDashboard'
  ),
  'employee-tax-summary-list': rp(
    () => import('../hr/income-tax/EmployeeTaxSummaryList'),
    'EmployeeTaxSummaryList'
  ),
  'investment-declaration-status': rp(
    () => import('../hr/income-tax/InvestmentDeclarationStatus'),
    'InvestmentDeclarationStatus'
  ),
  'proof-verification-status': rp(
    () => import('../hr/income-tax/ProofVerificationStatus'),
    'ProofVerificationStatus'
  ),
  'monthly-tds-register': rp(
    () => import('../hr/income-tax/MonthlyTdsRegister'),
    'MonthlyTdsRegister'
  ),
  'employee-tax-profile-regime-selection': rp(
    () => import('../hr/income-tax/EmployeeTaxProfileRegimeSelection'),
    'EmployeeTaxProfileRegimeSelection'
  ),
  'employee-income-investment-declaration': rp(
    () => import('../hr/income-tax/EmployeeIncomeInvestmentDeclaration'),
    'EmployeeIncomeInvestmentDeclaration'
  ),
  'investment-deduction-proof-verification': rp(
    () => import('../hr/income-tax/InvestmentDeductionProofVerification'),
    'InvestmentDeductionProofVerification'
  ),
  'annual-tax-projection-calculation': rp(
    () => import('../hr/income-tax/AnnualTaxProjectionCalculation'),
    'AnnualTaxProjectionCalculation'
  ),
  'monthly-tds-computation-transfer': rp(
    () => import('../hr/income-tax/MonthlyTdsComputationTransfer'),
    'MonthlyTdsComputationTransfer'
  ),
  'annual-tax-reconciliation-finalisation': rp(
    () => import('../hr/income-tax/AnnualTaxReconciliationFinalisation'),
    'AnnualTaxReconciliationFinalisation'
  ),
  'employee-tax-projection-report': rp(
    () => import('../hr/income-tax/EmployeeTaxProjectionReport'),
    'EmployeeTaxProjectionReport'
  ),
  'tds-deduction-report': rp(
    () => import('../hr/income-tax/TdsDeductionReport'),
    'TdsDeductionReport'
  ),
  'challan-tax-payment-register': rp(
    () => import('../hr/income-tax/ChallanTaxPaymentRegister'),
    'ChallanTaxPaymentRegister'
  ),
  'form-16-annual-statement-export': rp(
    () => import('../hr/income-tax/Form16AnnualStatementExport'),
    'Form16AnnualStatementExport'
  ),
  'financial-year-tax-config-master': rp(
    () => import('../hr/income-tax/FinancialYearTaxConfigMaster'),
    'FinancialYearTaxConfigMaster'
  ),
  'tax-regime-master': rp(
    () => import('../hr/income-tax/TaxRegimeMaster'),
    'TaxRegimeMaster'
  ),
  'tax-slab-surcharge-master': rp(
    () => import('../hr/income-tax/TaxSlabSurchargeMaster'),
    'TaxSlabSurchargeMaster'
  ),
  'exemption-deduction-section-master': rp(
    () => import('../hr/income-tax/ExemptionDeductionSectionMaster'),
    'ExemptionDeductionSectionMaster'
  ),
  'income-head-mapping-master': rp(
    () => import('../hr/income-tax/IncomeHeadMappingMaster'),
    'IncomeHeadMappingMaster'
  ),
  'hra-special-exemption-rule-master': rp(
    () => import('../hr/income-tax/HraSpecialExemptionRuleMaster'),
    'HraSpecialExemptionRuleMaster'
  )
};