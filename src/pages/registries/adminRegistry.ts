import { rp } from './registryHelper';

export const adminRegistry: Record<string, () => any> = {
  // Security
  'security-summary-dashboard': rp(() => import('../admin/security/SecuritySummaryDashboard'), 'SecuritySummaryDashboard'),
  'active-users': rp(() => import('../admin/security/ActiveUsers'), 'ActiveUsers'),
  'deleted-users': rp(() => import('../admin/security/DeletedUsers'), 'DeletedUsers'),
  'roles-and-permissions': rp(() => import('../admin/security/RolesAndPermissions'), 'RolesAndPermissions'),
  'security-admin': rp(() => import('../admin/security/SecurityAdmin'), 'SecurityAdmin'),
  'security-user-profile': rp(() => import('../admin/security/SecurityUserProfile'), 'ModuleAccessControl'),
  'user-master': rp(() => import('../admin/security/UserMaster'), 'UserMaster'),
  'user-log': rp(() => import('../admin/security/UserLog'), 'UserLog'),

  // Administration
  'my-workflow-hub': rp(() => import('../admin/administration/UnifiedApprovalInbox'), 'UnifiedApprovalInbox'),
  'central-control-audit-vault': rp(() => import('../admin/administration/CentralApprovalControlDesk'), 'CentralApprovalControlDesk'),
  'consent-log': rp(() => import('../admin/administration/ConsentLog'), 'ConsentLogs'),
  'administrative-control-reports': rp(() => import('../admin/administration/AdministrativeControlReports'), 'AdministrativeControlReports'),
  'workflow-setup-desk': rp(() => import('../admin/administration/ApprovalWorkflowBuilder'), 'ApprovalWorkflowBuilder'),
  'data-governance-lock-manager': rp(() => import('../admin/administration/DataGovernanceLockManager'), 'DataGovernanceLockManager'),
  'data-scope-management': rp(() => import('../admin/security/DataScopeManagement'), 'DataScopeManagement'),

  // Configuration
  'institute-policies-rule-overrides': rp(
    () => import('../admin/institute-setup/InstitutePoliciesRuleOverrides'),
    'InstitutePoliciesRuleOverrides'
  ),
  'scholarship-setup': rp(
    () => import('../admin/configuration/ScholarshipSetup'),
    'ScholarshipSetup'
  ),
  'student-rules': rp(
    () => import('../admin/configuration/StudentRules'),
    'StudentRules'
  ),
  'promotion-detention-criteria': rp(
    () => import('../admin/configuration/PromotionDetentionCriteria'),
    'PromotionDetentionCriteria'
  ),
  'report-card-progress-templates': rp(
    () => import('../admin/configuration/ReportCardProgressTemplates'),
    'ReportCardProgressTemplates'
  ),
  'ranking-merit-list-rules': rp(
    () => import('../admin/configuration/RankingMeritListRules'),
    'RankingMeritListRules'
  ),
  'fee-behaviour-late-fee-rules': rp(
    () => import('../admin/configuration/FeeBehaviourLateFeeRules'),
    'FeeBehaviourLateFeeRules'
  ),
  'scholarship-concession-rules': rp(
    () => import('../admin/configuration/ScholarshipSetup'),
    'ScholarshipSetup'
  ),
  'discipline-counselling-policy': rp(
    () => import('../admin/configuration/DisciplineCounsellingPolicy'),
    'DisciplineCounsellingPolicy'
  ),
  'custom-fields-dynamic-forms': rp(
    () => import('../admin/configuration/CustomFieldsDynamicForms'),
    'CustomFieldsDynamicForms'
  ),
  'number-series-document-id-settings': rp(
    () => import('../admin/configuration/NumberSeriesDocumentIdSettings'),
    'NumberSeriesDocumentIdSettings'
  ),

  // Utilities
  'data-export': rp(
    () => import('../admin/utilities/DataExport'),
    'DataExport'
  ),
  'data-import-wizard': rp(
    () => import('../admin/utilities/DataImportWizard'),
    'DataImportWizard'
  ),
  'log-viewer-audit-export': rp(
    () => import('../admin/utilities/LogViewerAuditExport'),
    'LogViewerAuditExport'
  ),
  // Utilities - Archive Management
  'archive-dashboard': rp(
    () => import('../admin/utilities/ArchiveDashboard'),
    'ArchiveDashboard'
  ),
  'data-tier-browser': rp(
    () => import('../admin/utilities/DataTierBrowser'),
    'DataTierBrowser'
  ),
  'archive-jobs-schedule': rp(
    () => import('../admin/utilities/ArchiveJobsSchedule'),
    'ArchiveJobsSchedule'
  ),
  'cold-storage-manager': rp(
    () => import('../admin/utilities/ColdStorageManager'),
    'ColdStorageManager'
  ),
  'archive-settings-rules': rp(
    () => import('../admin/utilities/ArchiveSettingsRules'),
    'ArchiveSettingsRules'
  ),
  'archive-audit-trail': rp(
    () => import('../admin/utilities/ArchiveAuditTrail'),
    'ArchiveAuditTrail'
  ),

  // Masters - Academic
  'class-section-master': rp(
    () => import('../admin/masters/ClassSectionMaster'),
    'ClassSectionMaster'
  ),
  'stream-subject-group-master': rp(
    () => import('../admin/masters/StreamSubjectGroupMaster'),
    'StreamSubjectGroupMaster'
  ),
  'academic-term-exam-type-master': rp(
    () => import('../admin/masters/AcademicTermExamTypeMaster'),
    'AcademicTermExamTypeMaster'
  ),
  // Masters - Finance
  'fee-head-master-admin': rp(
    () => import('../admin/masters/FeeHeadMasterAdmin'),
    'FeeHeadMasterAdmin'
  ),
  'fee-category-installment-due-rules-master': rp(
    () => import('../admin/masters/FeeCategoryInstallmentDueRulesMaster'),
    'FeeCategoryInstallmentDueRulesMaster'
  ),
  'fee-structure-template-master': rp(
    () => import('../admin/masters/FeeStructureTemplateMaster'),
    'FeeStructureTemplateMaster'
  ),

  // Masters - Expense
  'expense-head-master': rp(
    () => import('../admin/masters/ExpenseHeadMaster'),
    'ExpenseHeadMaster'
  ),
  'vendor-payee-master': rp(
    () => import('../admin/masters/VendorPayeeMaster'),
    'VendorPayeeMaster'
  ),
  'petty-cash-location-master': rp(
    () => import('../admin/masters/PettyCashLocationMaster'),
    'PettyCashLocationMaster'
  ),
  'expense-account-mapping': rp(
    () => import('../admin/masters/ExpenseAccountMapping'),
    'ExpenseAccountMapping'
  ),

  // Masters - Scholarship
  'scholarship-account-mapping': rp(
    () => import('../admin/configuration/ScholarshipSetup'),
    'ScholarshipSetup'
  ),

  // Institute Setup
  'institute-profile-branch-management': rp(
    () => import('../admin/institute-setup/InstituteProfileBranchManagement'),
    'InstituteProfileBranchManagement'
  ),
  'campus-building-room-layout': rp(
    () => import('../admin/institute-setup/CampusBuildingRoomLayout'),
    'CampusBuildingRoomLayout'
  ),
  'academic-session-term-setup': rp(
    () => import('../admin/institute-setup/AcademicSessionTermSetup'),
    'AcademicSessionTermSetup'
  ),
  'class-section-structure-setup': rp(
    () => import('../admin/institute-setup/ClassSectionStructureSetup'),
    'ClassSectionStructureSetup'
  ),
  'department-subject-grouping-setup': rp(
    () => import('../admin/institute-setup/DepartmentSubjectGroupingSetup'),
    'DepartmentSubjectGroupingSetup'
  ),
  'institute-calendar-working-days': rp(
    () => import('../admin/institute-setup/InstituteCalendarWorkingDays'),
    'InstituteCalendarWorkingDays'
  ),
  'timetable-framework-shift-setup': rp(
    () => import('../admin/institute-setup/TimetableFrameworkShiftSetup'),
    'TimetableFrameworkShiftSetup'
  ),
  'house-club-co-curricular-group-setup': rp(
    () => import('../admin/institute-setup/HouseClubCoCurricularGroupSetup'),
    'HouseClubCoCurricularGroupSetup'
  ),
  'batch-master': rp(
    () => import('../admin/institute-setup/BatchMaster'),
    'BatchMaster'
  ),

  // Marketplace
  'marketplace': rp(
    () => import('../admin/marketplace/Marketplace'),
    'ModuleActivationPage'
  ),

  // Billing
  'account-details': rp(
    () => import('../admin/billing/AccountDetails'),
    'AccountDetails'
  ),
  'subscription-overview': rp(
    () => import('../admin/billing/SubscriptionOverview'),
    'SubscriptionOverview'
  ),
  'usage-insights': rp(
    () => import('../admin/billing/UsageInsights'),
    'UsageInsights'
  ),
  'invoice-archive': rp(
    () => import('../admin/billing/InvoiceArchive'),
    'InvoiceArchive'
  ),};
