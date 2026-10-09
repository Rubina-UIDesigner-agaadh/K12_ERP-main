import { rp } from './registryHelper';

export const moreRegistry: Record<string, () => any> = {
  // Newsfeed
  'internal-school-updates': rp(
    () => import('../more/newsfeed/InternalSchoolUpdates'),
    'InternalSchoolUpdates'
  ),
  'government-policy-updates': rp(
    () => import('../more/newsfeed/GovernmentPolicyUpdates'),
    'GovernmentPolicyUpdates'
  ),
  'board-examination-updates': rp(
    () => import('../more/newsfeed/BoardExaminationUpdates'),
    'BoardExaminationUpdates'
  ),
  'scholarships-grants': rp(
    () => import('../more/newsfeed/ScholarshipsGrants'),
    'ScholarshipsGrants'
  ),
  'health-safety-advisories': rp(
    () => import('../more/newsfeed/HealthSafetyAdvisories'),
    'HealthSafetyAdvisories'
  ),
  'education-industry-global-news': rp(
    () => import('../more/newsfeed/EducationIndustryGlobalNews'),
    'EducationIndustryGlobalNews'
  ),
  'media-attachments': rp(
    () => import('../more/newsfeed/MediaAttachments'),
    'MediaAttachments'
  ),
  'engagement-interaction': rp(
    () => import('../more/newsfeed/EngagementInteraction'),
    'EngagementInteraction'
  ),
  'smart-targeting-filtering': rp(
    () => import('../more/newsfeed/SmartTargetingFiltering'),
    'SmartTargetingFiltering'
  ),
  'moderation-workflow': rp(
    () => import('../more/newsfeed/ModerationWorkflow'),
    'ModerationWorkflow'
  ),
  'alerts-action-center': rp(
    () => import('../more/newsfeed/AlertsActionCenter'),
    'AlertsActionCenter'
  ),
  'analytics-insights': rp(
    () => import('../more/newsfeed/AnalyticsInsights'),
    'AnalyticsInsights'
  ),

  // Reports — Government
  'cbse-compliance-dashboard': rp(
    () => import('../more/reports/CbseComplianceDashboard'),
    'CbseComplianceDashboard'
  ),
  'icse-compliance-reports': rp(
    () => import('../more/reports/IcseComplianceReports'),
    'IcseComplianceReports'
  ),
  'gseb-compliance-reports': rp(
    () => import('../more/reports/GsebComplianceReports'),
    'GsebComplianceReports'
  ),

  // Reports — Student
  'admission-reports': rp(
    () => import('../more/reports/AdmissionReports'),
    'AdmissionReports'
  ),
  'academic-performance-reports': rp(
    () => import('../more/reports/AcademicPerformanceReports'),
    'AcademicPerformanceReports'
  ),
  'transfer-leaving-certificate-report': rp(
    () => import('../more/reports/TransferLeavingCertificateReport'),
    'TransferLeavingCertificateReport'
  ),

  // Reports — Employee
  'employee-master-report': rp(
    () => import('../more/reports/EmployeeMasterReport'),
    'EmployeeMasterReport'
  ),
  'employee-attendance-report': rp(
    () => import('../more/reports/EmployeeAttendanceReport'),
    'EmployeeAttendanceReport'
  ),
  'appraisal-reports': rp(
    () => import('../more/reports/AppraisalReports'),
    'AppraisalReports'
  ),
  'recruitment-reports': rp(
    () => import('../more/reports/RecruitmentReports'),
    'RecruitmentReports'
  ),
  'income-tax-reports': rp(
    () => import('../more/reports/IncomeTaxReports'),
    'IncomeTaxReports'
  ),

  // Reports — Finance
  'charges-miscellaneous-income': rp(
    () => import('../more/reports/ChargesMiscellaneousIncome'),
    'ChargesMiscellaneousIncome'
  ),
  'scholarship-report': rp(
    () => import('../finance/scholarship/ScholarshipReport'),
    'ScholarshipReport'
  ),

  // Reports — Examination
  'internal-exam-reports': rp(
    () => import('../more/reports/InternalExamReports'),
    'InternalExamReports'
  ),
  'board-exam-reports': rp(
    () => import('../more/reports/BoardExamReports'),
    'BoardExamReports'
  ),

  // Reports — Compliance & Audit
  'compliance-audit-reports': rp(
    () => import('../more/reports/ComplianceAuditReports'),
    'ComplianceAuditReports'
  ),

  // Reports — Advanced Builder
  'advanced-report-builder': rp(
    () => import('../more/reports/AdvancedReportBuilder'),
    'AdvancedReportBuilder'
  ),

  // Front Office
  'admission-management': rp(
    () => import('../more/front-office/AdmissionManagement'),
    'AdmissionManagement'
  ),
  'visitor-management': rp(
    () => import('../more/front-office/VisitorManagement'),
    'VisitorManagement'
  ),
  'reception-helpdesk': rp(
    () => import('../more/front-office/ReceptionHelpdesk'),
    'ReceptionHelpdesk'
  ),
  'student-movement': rp(
    () => import('../more/front-office/StudentMovement'),
    'StudentMovement'
  ),
  'lost-found-management': rp(
    () => import('../more/front-office/LostFoundManagement'),
    'LostFoundManagement'
  ),

  // Communications
  messaging: rp(() => import('../more/communications/Messaging'), 'Messaging'),
  'circulars-notices': rp(
    () => import('../more/communications/CircularsNotices'),
    'CircularsNotices'
  ),
  announcements: rp(
    () => import('../more/communications/Announcements'),
    'Announcements'
  ),
  'parent-interaction': rp(
    () => import('../more/communications/ParentInteraction'),
    'ParentInteraction'
  ),
  'communication-logs': rp(
    () => import('../more/communications/CommunicationLogs'),
    'CommunicationLogs'
  ),
  'private-chats': rp(
    () => import('../more/communications/PrivateChats'),
    'PrivateChats'
  ),

  // Health
  'health-records': rp(
    () => import('../more/health/HealthRecords'),
    'HealthRecords'
  ),
  'health-checkups': rp(
    () => import('../more/health/HealthCheckups'),
    'HealthCheckups'
  ),
  'incident-management': rp(
    () => import('../more/health/IncidentManagement'),
    'IncidentManagement'
  ),
  'vaccination-tracking': rp(
    () => import('../more/health/VaccinationTracking'),
    'VaccinationTracking'
  ),

  // MIS
  'executive-dashboards': rp(
    () => import('../more/mis/ExecutiveDashboards'),
    'ExecutiveDashboards'
  ),
  'academic-analytics': rp(
    () => import('../more/mis/AcademicAnalytics'),
    'AcademicAnalytics'
  ),
  'attendance-analytics': rp(
    () => import('../more/mis/AttendanceAnalytics'),
    'AttendanceAnalytics'
  ),
  'financial-overview': rp(
    () => import('../more/mis/FinancialOverview'),
    'FinancialOverview'
  ),
  'compliance-government-data': rp(
    () => import('../more/mis/ComplianceGovernmentData'),
    'ComplianceGovernmentData'
  ),
  'custom-report-builder-mis': rp(
    () => import('../more/mis/CustomReportBuilderMis'),
    'CustomReportBuilderMis'
  ),

  // Project Management
  'project-setup': rp(
    () => import('../more/project-management/ProjectSetup'),
    'ProjectSetup'
  ),
  'task-management': rp(
    () => import('../more/project-management/TaskManagement'),
    'TaskManagement'
  ),
  'resource-management': rp(
    () => import('../more/project-management/ResourceManagement'),
    'ResourceManagement'
  ),
  'milestone-tracking': rp(
    () => import('../more/project-management/MilestoneTracking'),
    'MilestoneTracking'
  ),
  'project-reports': rp(
    () => import('../more/project-management/ProjectReports'),
    'ProjectReports'
  ),

  // EIS
  'executive-kpi-dashboard': rp(
    () => import('../more/eis/ExecutiveKpiDashboard'),
    'ExecutiveKpiDashboard'
  ),
  'strategic-planning': rp(
    () => import('../more/eis/StrategicPlanning'),
    'StrategicPlanning'
  ),
  'risk-alert-monitoring': rp(
    () => import('../more/eis/RiskAlertMonitoring'),
    'RiskAlertMonitoring'
  ),
  'performance-overview': rp(
    () => import('../more/eis/PerformanceOverview'),
    'PerformanceOverview'
  ),

  // Issue Reporting
  'issue-logging': rp(
    () => import('../more/issue-reporting/IssueLogging'),
    'IssueLogging'
  ),
  'ticket-management': rp(
    () => import('../more/issue-reporting/TicketManagement'),
    'TicketManagement'
  ),
  'maintenance-requests': rp(
    () => import('../more/issue-reporting/MaintenanceRequests'),
    'MaintenanceRequests'
  ),
  'escalation-management': rp(
    () => import('../more/issue-reporting/EscalationManagement'),
    'EscalationManagement'
  ),
  'feedback-closure': rp(
    () => import('../more/issue-reporting/FeedbackClosure'),
    'FeedbackClosure'
  )
};