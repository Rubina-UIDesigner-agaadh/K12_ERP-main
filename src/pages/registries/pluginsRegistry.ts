import { rp } from './registryHelper';

export const pluginsRegistry: Record<string, () => any> = {
  // ── QR Code & Barcode ──────────────────────────────────────────────────────
  'qr-barcode-master': rp(
    () => import('../plugins/qr-barcode/QrBarcodeMaster'),
    'QrBarcodeMaster'
  ),
  'code-generator': rp(
    () => import('../plugins/qr-barcode/CodeGenerator'),
    'CodeGenerator'
  ),
  'entity-mapping': rp(
    () => import('../plugins/qr-barcode/EntityMapping'),
    'EntityMapping'
  ),
  'scan-usage-management': rp(
    () => import('../plugins/qr-barcode/ScanUsageManagement'),
    'ScanUsageManagement'
  ),
  'attendance-access-integration': rp(
    () => import('../plugins/qr-barcode/AttendanceAccessIntegration'),
    'AttendanceAccessIntegration'
  ),
  'security-expiry-controls': rp(
    () => import('../plugins/qr-barcode/SecurityExpiryControls'),
    'SecurityExpiryControls'
  ),
  'reports-scan-logs': rp(
    () => import('../plugins/qr-barcode/ReportsScanLogs'),
    'ReportsScanLogs'
  ),

  // ── GPS Tracking ───────────────────────────────────────────────────────────
  'vehicle-device-master': rp(
    () => import('../plugins/gps-tracking/VehicleDeviceMaster'),
    'VehicleDeviceMaster'
  ),
  'route-geofence-setup': rp(
    () => import('../plugins/gps-tracking/RouteGeofenceSetup'),
    'RouteGeofenceSetup'
  ),
  'live-tracking-dashboard': rp(
    () => import('../plugins/gps-tracking/LiveTrackingDashboard'),
    'LiveTrackingDashboard'
  ),
  'student-boarding-tracking': rp(
    () => import('../plugins/gps-tracking/StudentBoardingTracking'),
    'StudentBoardingTracking'
  ),
  'gps-alert-integration': rp(
    () => import('../plugins/gps-tracking/AlertIntegration'),
    'AlertIntegration'
  ),
  'trip-history-logs': rp(
    () => import('../plugins/gps-tracking/TripHistoryLogs'),
    'TripHistoryLogs'
  ),
  'transport-analytics': rp(
    () => import('../plugins/gps-tracking/TransportAnalytics'),
    'TransportAnalytics'
  ),

  // ── Mobile App ─────────────────────────────────────────────────────────────
  'app-configuration': rp(
    () => import('../plugins/mobile-app/AppConfiguration'),
    'AppConfiguration'
  ),
  'role-based-access-setup': rp(
    () => import('../plugins/mobile-app/RoleBasedAccessSetup'),
    'RoleBasedAccessSetup'
  ),
  'push-notification-management': rp(
    () => import('../plugins/mobile-app/PushNotificationManagement'),
    'PushNotificationManagement'
  ),
  'content-announcement-control': rp(
    () => import('../plugins/mobile-app/ContentAnnouncementControl'),
    'ContentAnnouncementControl'
  ),
  'app-authentication': rp(
    () => import('../plugins/mobile-app/Authentication'),
    'Authentication'
  ),
  'app-usage-analytics': rp(
    () => import('../plugins/mobile-app/AppUsageAnalytics'),
    'AppUsageAnalytics'
  ),
  'app-logs-monitoring': rp(
    () => import('../plugins/mobile-app/AppLogsMonitoring'),
    'AppLogsMonitoring'
  ),

  // ── WhatsApp ───────────────────────────────────────────────────────────────
  'whatsapp-api-configuration': rp(
    () => import('../plugins/whatsapp/ApiConfiguration'),
    'ApiConfiguration'
  ),
  'whatsapp-template-management': rp(
    () => import('../plugins/whatsapp/TemplateManagement'),
    'TemplateManagement'
  ),
  'automated-notification-rules': rp(
    () => import('../plugins/whatsapp/AutomatedNotificationRules'),
    'AutomatedNotificationRules'
  ),
  'bulk-messaging-panel': rp(
    () => import('../plugins/whatsapp/BulkMessagingPanel'),
    'BulkMessagingPanel'
  ),
  'two-way-communication': rp(
    () => import('../plugins/whatsapp/TwoWayCommunication'),
    'TwoWayCommunication'
  ),
  'whatsapp-delivery-tracking': rp(
    () => import('../plugins/whatsapp/DeliveryTracking'),
    'DeliveryTracking'
  ),
  'whatsapp-logs-analytics': rp(
    () => import('../plugins/whatsapp/LogsAnalytics'),
    'LogsAnalytics'
  ),

  // ── Tally ──────────────────────────────────────────────────────────────────
  'company-ledger-mapping': rp(
    () => import('../plugins/tally/CompanyLedgerMapping'),
    'CompanyLedgerMapping'
  ),
  'voucher-fee-sync': rp(
    () => import('../plugins/tally/VoucherFeeSync'),
    'VoucherFeeSync'
  ),
  'gst-tax-mapping': rp(
    () => import('../plugins/tally/GstTaxMapping'),
    'GstTaxMapping'
  ),
  'auto-posting-rules': rp(
    () => import('../plugins/tally/AutoPostingRules'),
    'AutoPostingRules'
  ),
  'export-import-controls': rp(
    () => import('../plugins/tally/ExportImportControls'),
    'ExportImportControls'
  ),
  'tally-sync-monitoring': rp(
    () => import('../plugins/tally/SyncMonitoring'),
    'SyncMonitoring'
  ),
  'tally-audit-logs-reports': rp(
    () => import('../plugins/tally/AuditLogsReports'),
    'AuditLogsReports'
  ),

  // ── Payment Gateway ────────────────────────────────────────────────────────
  'gateway-configuration': rp(
    () => import('../plugins/payment-gateway/GatewayConfiguration'),
    'GatewayConfiguration'
  ),
  'fee-head-mapping': rp(
    () => import('../plugins/payment-gateway/FeeHeadMapping'),
    'FeeHeadMapping'
  ),
  'online-payment-management': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentManagement'),
    'OnlinePaymentManagement'
  ),
  'auto-reconciliation': rp(
    () => import('../plugins/payment-gateway/AutoReconciliation'),
    'AutoReconciliation'
  ),
  'refund-adjustment-panel': rp(
    () => import('../plugins/payment-gateway/RefundAdjustmentPanel'),
    'RefundAdjustmentPanel'
  ),
  'transaction-monitoring': rp(
    () => import('../plugins/payment-gateway/TransactionMonitoring'),
    'TransactionMonitoring'
  ),
  'payment-analytics': rp(
    () => import('../plugins/payment-gateway/PaymentAnalytics'),
    'PaymentAnalytics'
  ),

  // ── Payment Gateway : Online Payment (moved from Finance) ─────────────────
  'online-payment-dashboard': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentDashboard'),
    'OnlinePaymentDashboard'
  ),

  'online-transaction-list': rp(
    () => import('../plugins/payment-gateway/OnlineTransactionList'),
    'OnlineTransactionList'
  ),

  'failed-disputed-transactions': rp(
    () => import('../plugins/payment-gateway/FailedDisputedTransactions.tsx'),
    'FailedDisputedTransactions'
  ),

  'initiate-online-payment': rp(
    () => import('../plugins/payment-gateway/InitiateOnlinePayment'),
    'InitiateOnlinePayment'
  ),

  'online-payment-retry-status': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentRetryStatus'),
    'OnlinePaymentRetryStatus'
  ),

  'online-refund-processing': rp(
    () => import('../plugins/payment-gateway/OnlineRefundProcessing'),
    'OnlineRefundProcessing'
  ),

  'gateway-settlement-import': rp(
    () => import('../plugins/payment-gateway/GatewaySettlementImport'),
    'GatewaySettlementImport'
  ),

  'online-payment-reconciliation': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentReconciliation'),
    'OnlinePaymentReconciliation'
  ),

  'online-payment-report': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentReport'),
    'OnlinePaymentReport'
  ),

  'gateway-wise-collection-summary': rp(
    () => import('../plugins/payment-gateway/GatewayWiseCollectionSummary'),
    'GatewayWiseCollectionSummary'
  ),

  'settlement-mismatch-report': rp(
    () => import('../plugins/payment-gateway/SettlementMismatchReport'),
    'SettlementMismatchReport'
  ),

  'payment-gateway-master': rp(
    () => import('../plugins/payment-gateway/PaymentGatewayMaster'),
    'PaymentGatewayMaster'
  ),

  'online-payment-setup': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentSetup'),
    'OnlinePaymentSetup'
  ),

  'online-payment-account-mapping': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentAccountMapping'),
    'OnlinePaymentAccountMapping'
  ),

  'online-payment-notification-templates': rp(
    () => import('../plugins/payment-gateway/OnlinePaymentNotificationTemplates'),
    'OnlinePaymentNotificationTemplates'
  ),

  // ── Email ──────────────────────────────────────────────────────────────────
  'smtp-domain-setup': rp(
    () => import('../plugins/email/SmtpDomainSetup'),
    'SmtpDomainSetup'
  ),
  'email-template-manager': rp(
    () => import('../plugins/email/TemplateManager'),
    'TemplateManager'
  ),
  'bulk-automated-email-rules': rp(
    () => import('../plugins/email/BulkAutomatedEmailRules'),
    'BulkAutomatedEmailRules'
  ),
  'scheduling-attachments': rp(
    () => import('../plugins/email/SchedulingAttachments'),
    'SchedulingAttachments'
  ),
  'email-delivery-tracking': rp(
    () => import('../plugins/email/DeliveryTracking'),
    'EmailDeliveryTracking'
  ),
  'bounce-spam-handling': rp(
    () => import('../plugins/email/BounceSpamHandling'),
    'BounceSpamHandling'
  ),
  'email-logs-reports': rp(
    () => import('../plugins/email/EmailLogsReports'),
    'EmailLogsReports'
  ),

  // ── Biometric ──────────────────────────────────────────────────────────────
  'device-registration-mapping': rp(
    () => import('../plugins/biometric/DeviceRegistrationMapping'),
    'DeviceRegistrationMapping'
  ),
  'user-biometric-mapping': rp(
    () => import('../plugins/biometric/UserBiometricMapping'),
    'UserBiometricMapping'
  ),
  'attendance-sync-engine': rp(
    () => import('../plugins/biometric/AttendanceSyncEngine'),
    'AttendanceSyncEngine'
  ),
  'realtime-manual-sync': rp(
    () => import('../plugins/biometric/RealtimeManualSync'),
    'RealtimeManualSync'
  ),
  'biometric-attendance-logs': rp(
    () => import('../plugins/biometric/AttendanceLogs'),
    'AttendanceLogs'
  ),
  'exception-error-handling': rp(
    () => import('../plugins/biometric/ExceptionErrorHandling'),
    'ExceptionErrorHandling'
  ),
  'biometric-device-monitoring': rp(
    () => import('../plugins/biometric/DeviceMonitoring'),
    'DeviceMonitoring'
  ),

  // ── SMS & Calling ──────────────────────────────────────────────────────────
  'sms-gateway-configuration': rp(
    () => import('../plugins/sms-calling/SmsGatewayConfiguration'),
    'SmsGatewayConfiguration'
  ),
  'dlt-template-management': rp(
    () => import('../plugins/sms-calling/DltTemplateManagement'),
    'DltTemplateManagement'
  ),
  'automated-sms-rules': rp(
    () => import('../plugins/sms-calling/AutomatedSmsRules'),
    'AutomatedSmsRules'
  ),
  'bulk-messaging-sms': rp(
    () => import('../plugins/sms-calling/BulkMessaging'),
    'BulkMessaging'
  ),
  'ivr-auto-call-setup': rp(
    () => import('../plugins/sms-calling/IvrAutoCallSetup'),
    'IvrAutoCallSetup'
  ),
  'sms-delivery-reports': rp(
    () => import('../plugins/sms-calling/DeliveryReports'),
    'DeliveryReports'
  ),
  'credit-usage-logs': rp(
    () => import('../plugins/sms-calling/CreditUsageLogs'),
    'CreditUsageLogs'
  ),

  // ── Google Apps ────────────────────────────────────────────────────────────
  'google-workspace-auth': rp(
    () => import('../plugins/google-apps/GoogleWorkspaceAuth'),
    'GoogleWorkspaceAuth'
  ),
  'classroom-assignment-sync': rp(
    () => import('../plugins/google-apps/ClassroomAssignmentSync'),
    'ClassroomAssignmentSync'
  ),
  'meet-calendar-integration': rp(
    () => import('../plugins/google-apps/MeetCalendarIntegration'),
    'MeetCalendarIntegration'
  ),
  'drive-document-sync': rp(
    () => import('../plugins/google-apps/DriveDocumentSync'),
    'DriveDocumentSync'
  ),
  'google-sso-configuration': rp(
    () => import('../plugins/google-apps/SsoConfiguration'),
    'SsoConfiguration'
  ),
  'google-api-token-management': rp(
    () => import('../plugins/google-apps/ApiTokenManagement'),
    'ApiTokenManagement'
  ),
  'google-sync-logs-monitoring': rp(
    () => import('../plugins/google-apps/SyncLogsMonitoring'),
    'GoogleSyncLogsMonitoring'
  ),

  // ── Microsoft Tools ────────────────────────────────────────────────────────
  'microsoft-365-auth': rp(
    () => import('../plugins/microsoft-tools/Microsoft365Auth'),
    'Microsoft365Auth'
  ),
  'teams-assignment-sync': rp(
    () => import('../plugins/microsoft-tools/TeamsAssignmentSync'),
    'TeamsAssignmentSync'
  ),
  'outlook-calendar-integration': rp(
    () => import('../plugins/microsoft-tools/OutlookCalendarIntegration'),
    'OutlookCalendarIntegration'
  ),
  'onedrive-sharepoint-sync': rp(
    () => import('../plugins/microsoft-tools/OneDriveSharepointSync'),
    'OneDriveSharepointSync'
  ),
  'azure-ad-sso': rp(
    () => import('../plugins/microsoft-tools/AzureAdSso'),
    'AzureAdSso'
  ),
  'ms-meeting-automation': rp(
    () => import('../plugins/microsoft-tools/MeetingAutomation'),
    'MeetingAutomation'
  ),
  'ms-sync-logs-monitoring': rp(
    () => import('../plugins/microsoft-tools/MsSyncLogsMonitoring'),
    'MsSyncLogsMonitoring'
  ),

  // ── Alert ──────────────────────────────────────────────────────────────────
  'alert-master': rp(
    () => import('../plugins/alert/AlertMaster'),
    'AlertMaster'
  ),
  'alert-rule-engine': rp(
    () => import('../plugins/alert/RuleEngine'),
    'RuleEngine'
  ),
  'channel-delivery-management': rp(
    () => import('../plugins/alert/ChannelDeliveryManagement'),
    'ChannelDeliveryManagement'
  ),
  'alert-templates': rp(
    () => import('../plugins/alert/AlertTemplates'),
    'AlertTemplates'
  ),
  'escalation-automation': rp(
    () => import('../plugins/alert/EscalationAutomation'),
    'EscalationAutomation'
  ),
  'alert-dashboard': rp(
    () => import('../plugins/alert/AlertDashboard'),
    'AlertDashboard'
  ),
  'alert-logs-analytics': rp(
    () => import('../plugins/alert/AlertLogsAnalytics'),
    'AlertLogsAnalytics'
  )
};