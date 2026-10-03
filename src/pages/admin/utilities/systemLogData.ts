// systemLogData.ts — data + types for the unified System Log page
// (Admin Tools ▸ Utilities ▸ System Log). Audit Logs (who did what, where, when)
// and System Logs (events, errors, performance, cron) share one entry structure.

export type LogCategory =
  | 'Security'
  | 'User & RBAC'
  | 'Academic'
  | 'Finance'
  | 'Student'
  | 'System'
  | 'Export'
  | 'Communication'
  | 'API'
  | 'Error';

export type LogAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'APPROVE'
  | 'REJECT'
  | 'PRINT'
  | 'SYSTEM';

export type LogStatus = 'success' | 'failed' | 'warning' | 'blocked';
export type Priority = 'Critical' | 'High' | 'Medium';

export interface LogEventDef {
  /** specific event key, e.g. marks_edited */
  key: string;
  /** what the event means, in plain words */
  label: string;
  action: LogAction;
  module: string;
}

export interface LogEntry {
  /** LOG-2025-09-28-MRK-5821 */
  id: string;
  category: LogCategory;
  type: string;
  action: LogAction;
  module: string;
  page: string;
  description: string;
  // WHO
  userId: number;
  userName: string;
  userRole: string;
  userEmpId: string;
  // WHAT CHANGED
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  // WHEN
  date: string; // ISO yyyy-mm-dd, used by the date filters
  createdAt: string; // display timestamp (local timezone)
  academicYear: string;
  // WHERE / HOW
  ip: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  sessionId: string;
  requestId: string;
  // RESULT
  status: LogStatus;
  failureReason?: string;
  /** high-visibility flag (reprints, bulk exports, sensitive reads) */
  highPriority?: boolean;
  // CONTEXT
  branch: string;
  classId?: string;
  divisionId?: string;
}

/* ------------------------------------------------------------ categories */

export const CATEGORY_META: Record<
  LogCategory,
  { icon: string; priority: Priority; retention: string; note: string }
> = {
  Security: { icon: '🔐', priority: 'Critical', retention: '5 years', note: 'Logins, password & OTP events, access violations' },
  'User & RBAC': { icon: '👥', priority: 'Critical', retention: '7 years', note: 'User lifecycle, roles, permissions, data scope, deactivation wizard' },
  Academic: { icon: '📚', priority: 'Critical', retention: '10 years', note: 'Marks, attendance, exams, report cards, timetable, homework' },
  Finance: { icon: '💰', priority: 'Critical', retention: '7 years', note: 'Fees, receipts, concessions, payroll, journal & vouchers' },
  Student: { icon: '🎓', priority: 'High', retention: '10 years', note: 'Student records, sensitive document & medical access, admissions' },
  System: { icon: '⚙️', priority: 'High', retention: '3 years', note: 'Configuration, templates, backup, maintenance, retention' },
  Export: { icon: '📤', priority: 'High', retention: '5 years', note: 'Every export, print, external share and import' },
  Communication: { icon: '📣', priority: 'Medium', retention: 'Follows System (3 years)', note: 'Circulars, bulk SMS/email, push notifications, parent messages' },
  API: { icon: '🔌', priority: 'Medium', retention: '2 years', note: 'API keys, external calls, webhooks, gateways, biometric sync' },
  Error: { icon: '🐞', priority: 'Medium', retention: '1 year', note: 'Application errors, failed uploads, performance, cron jobs' }
};

export const CATEGORIES: LogCategory[] = [
  'Security',
  'User & RBAC',
  'Academic',
  'Finance',
  'Student',
  'System',
  'Export',
  'Communication',
  'API',
  'Error'
];

/* --------------------------------------------------------- event catalog */

const E = (key: string, label: string, action: LogAction, module: string): LogEventDef => ({ key, label, action, module });

export const EVENT_CATALOG: { category: LogCategory; events: LogEventDef[] }[] = [
  {
    category: 'Security',
    events: [
      E('user_login_success', 'User logged in successfully', 'LOGIN', 'Security'),
      E('user_login_failed', 'Wrong password attempt (attempt count tracked)', 'LOGIN', 'Security'),
      E('user_login_blocked', 'Account locked after maximum failed attempts', 'LOGIN', 'Security'),
      E('user_logout', 'User logged out manually', 'LOGOUT', 'Security'),
      E('session_expired', 'Session auto-expired due to inactivity', 'LOGOUT', 'Security'),
      E('force_logout', "Admin force-terminated a user's active session", 'LOGOUT', 'Security'),
      E('concurrent_login_attempt', 'Login from a different device while a session is active', 'LOGIN', 'Security'),
      E('login_outside_hours', 'Login at an unusual time (e.g. 2 AM)', 'LOGIN', 'Security'),
      E('password_changed', 'User changed their own password', 'UPDATE', 'Security'),
      E('password_reset_requested', 'Forgot password request submitted', 'UPDATE', 'Security'),
      E('password_reset_completed', 'Password successfully reset via link or OTP', 'UPDATE', 'Security'),
      E('password_reset_by_admin', "Admin forcefully reset a user's password", 'UPDATE', 'Security'),
      E('otp_generated', 'OTP sent for two-factor authentication', 'CREATE', 'Security'),
      E('otp_verified', 'OTP successfully entered and verified', 'READ', 'Security'),
      E('otp_failed', 'Incorrect OTP entered', 'READ', 'Security'),
      E('unauthorized_access_attempt', "User opened a page they don't have permission for", 'READ', 'Security'),
      E('data_scope_violation', 'Data accessed outside the assigned data scope', 'READ', 'Security'),
      E('api_unauthorized', 'API call made without a valid token', 'READ', 'Security'),
      E('rate_limit_triggered', 'Too many requests from a single user or IP address', 'READ', 'Security')
    ]
  },
  {
    category: 'User & RBAC',
    events: [
      E('user_created', 'New user account created', 'CREATE', 'RBAC'),
      E('user_edited', 'User profile details changed', 'UPDATE', 'RBAC'),
      E('user_activated', 'User account activated', 'UPDATE', 'RBAC'),
      E('user_suspended', 'User account temporarily suspended', 'UPDATE', 'RBAC'),
      E('user_deactivated', 'User account permanently deactivated', 'UPDATE', 'RBAC'),
      E('user_archived', 'User moved to archive after retention period', 'UPDATE', 'RBAC'),
      E('user_reactivated', 'Previously deactivated user reactivated', 'UPDATE', 'RBAC'),
      E('role_created', 'New RBAC role created', 'CREATE', 'RBAC'),
      E('role_edited', 'Role name or description changed', 'UPDATE', 'RBAC'),
      E('role_deleted', 'Role deleted from the system', 'DELETE', 'RBAC'),
      E('role_assigned_to_user', 'Role assigned to a user', 'UPDATE', 'RBAC'),
      E('role_removed_from_user', 'Role removed from a user', 'UPDATE', 'RBAC'),
      E('permission_granted', 'Permission (View, Create, Edit, Delete, Approve, Export) added to a role for a page', 'UPDATE', 'RBAC'),
      E('permission_revoked', 'Permission removed from a role for a page', 'UPDATE', 'RBAC'),
      E('data_scope_created', 'New data scope definition created', 'CREATE', 'RBAC'),
      E('data_scope_edited', 'Data scope rules modified', 'UPDATE', 'RBAC'),
      E('data_scope_assigned', 'Data scope assigned to a role on a specific page', 'UPDATE', 'RBAC'),
      E('user_scope_assignment_added', 'Teacher assigned a class-subject data scope mapping', 'CREATE', 'RBAC'),
      E('user_scope_assignment_removed', "Teacher's class-subject scope mapping removed", 'DELETE', 'RBAC'),
      E('deactivation_initiated', 'Admin started the user deactivation wizard', 'UPDATE', 'RBAC'),
      E('deactivation_reassigned', 'Active responsibilities reassigned to other users', 'UPDATE', 'RBAC'),
      E('deactivation_completed', 'Full deactivation process executed successfully', 'UPDATE', 'RBAC'),
      E('deactivation_cancelled', 'Deactivation wizard cancelled midway', 'UPDATE', 'RBAC')
    ]
  },
  {
    category: 'Academic',
    events: [
      E('marks_entered', 'Teacher entered marks for a student for the first time', 'CREATE', 'Academics'),
      E('marks_edited', 'Marks changed after initial entry (full before/after captured)', 'UPDATE', 'Academics'),
      E('marks_bulk_uploaded', 'Marks imported via Excel or CSV file', 'IMPORT', 'Academics'),
      E('marks_approved', 'HOD or Admin approved a marks entry', 'APPROVE', 'Academics'),
      E('marks_rejected', 'Marks sent back to the teacher for correction', 'REJECT', 'Academics'),
      E('marks_deleted', 'A marks record was removed', 'DELETE', 'Academics'),
      E('result_published', 'Results published and visible to students and parents', 'APPROVE', 'Academics'),
      E('attendance_marked', 'Daily attendance marked by teacher for a class', 'CREATE', 'Attendance'),
      E('attendance_edited', 'Attendance record corrected after initial entry', 'UPDATE', 'Attendance'),
      E('attendance_bulk_marked', 'Batch attendance upload processed', 'IMPORT', 'Attendance'),
      E('attendance_approved', 'Attendance approved by HOD or coordinator', 'APPROVE', 'Attendance'),
      E('leave_application_created', 'Student leave request submitted', 'CREATE', 'Attendance'),
      E('leave_application_approved', 'Student leave request approved', 'APPROVE', 'Attendance'),
      E('leave_application_rejected', 'Student leave request rejected', 'REJECT', 'Attendance'),
      E('exam_created', 'New exam schedule created', 'CREATE', 'Examination'),
      E('exam_edited', 'Exam details modified', 'UPDATE', 'Examination'),
      E('exam_cancelled', 'Exam cancelled', 'UPDATE', 'Examination'),
      E('question_paper_uploaded', 'Question paper file uploaded to the system', 'CREATE', 'Examination'),
      E('hall_ticket_generated', 'Hall ticket created for a student', 'CREATE', 'Examination'),
      E('admit_card_printed', 'Admit card printed or downloaded', 'PRINT', 'Examination'),
      E('report_card_generated', 'Report card created for a student', 'CREATE', 'Examination'),
      E('report_card_edited', 'Report card content modified', 'UPDATE', 'Examination'),
      E('report_card_approved', 'Report card signed off by authority', 'APPROVE', 'Examination'),
      E('report_card_printed', 'Report card sent to printer', 'PRINT', 'Examination'),
      E('report_card_shared', 'Report card shared with parent via portal', 'EXPORT', 'Examination'),
      E('timetable_created', 'New timetable created for a class', 'CREATE', 'Timetable'),
      E('timetable_edited', 'A timetable slot modified', 'UPDATE', 'Timetable'),
      E('timetable_published', 'Timetable made live for students and teachers', 'APPROVE', 'Timetable'),
      E('substitute_assigned', 'A substitute teacher assigned to a slot', 'UPDATE', 'Timetable'),
      E('homework_assigned', 'Homework given to a class', 'CREATE', 'Academics'),
      E('homework_edited', 'Homework details modified', 'UPDATE', 'Academics'),
      E('homework_deleted', 'Homework entry removed', 'DELETE', 'Academics'),
      E('assignment_submitted', 'Student submitted an assignment', 'CREATE', 'Academics')
    ]
  },
  {
    category: 'Finance',
    events: [
      E('fee_paid', 'Fee payment received from a student or parent', 'CREATE', 'Fee'),
      E('fee_receipt_generated', 'Receipt created after a payment', 'CREATE', 'Fee'),
      E('fee_receipt_reprinted', 'Receipt reprinted (flagged high priority for audit)', 'PRINT', 'Fee'),
      E('fee_receipt_cancelled', 'Receipt voided', 'DELETE', 'Fee'),
      E('fee_receipt_edited', 'Receipt details modified after generation', 'UPDATE', 'Fee'),
      E('fee_concession_applied', "Discount or concession applied to a student's fee", 'UPDATE', 'Fee'),
      E('fee_concession_approved', 'Concession request approved by admin', 'APPROVE', 'Fee'),
      E('fee_concession_rejected', 'Concession request denied', 'REJECT', 'Fee'),
      E('fee_waived', 'Entire fee waived for a student', 'APPROVE', 'Fee'),
      E('fee_refund_processed', 'Refund issued to parent', 'UPDATE', 'Fee'),
      E('fee_structure_created', 'New fee structure defined for a class or category', 'CREATE', 'Fee'),
      E('fee_structure_edited', 'Fee amounts changed (before/after amounts stored)', 'UPDATE', 'Fee'),
      E('fee_due_date_changed', 'Due date for a fee installment modified', 'UPDATE', 'Fee'),
      E('late_fee_applied', "Late payment penalty applied to a student's account", 'UPDATE', 'Fee'),
      E('bulk_fee_generated', 'Fees generated for an entire class or batch', 'CREATE', 'Fee'),
      E('bulk_receipt_printed', 'Multiple receipts printed in one operation', 'PRINT', 'Fee'),
      E('fee_report_exported', 'Financial report exported to Excel or PDF', 'EXPORT', 'Fee'),
      E('salary_generated', 'Staff salary computed for the month', 'CREATE', 'HR'),
      E('salary_edited', 'Salary amount modified (before/after values stored)', 'UPDATE', 'HR'),
      E('salary_approved', 'Payroll approved by authorised admin', 'APPROVE', 'HR'),
      E('salary_disbursed', 'Payment made to staff', 'UPDATE', 'HR'),
      E('salary_slip_printed', 'Salary slip generated or printed', 'PRINT', 'HR'),
      E('journal_entry_created', 'New accounting journal entry created', 'CREATE', 'Finance'),
      E('journal_entry_edited', 'Journal entry modified', 'UPDATE', 'Finance'),
      E('voucher_created', 'Expense or income voucher created', 'CREATE', 'Finance'),
      E('accounts_report_exported', 'Profit & loss or balance sheet exported', 'EXPORT', 'Finance')
    ]
  },
  {
    category: 'Student',
    events: [
      E('student_enrolled', 'New student admitted to the school', 'CREATE', 'Admissions'),
      E('student_profile_edited', 'Student details updated (changed fields with before/after)', 'UPDATE', 'Students'),
      E('student_profile_viewed', 'Full student profile viewed (READ logged for sensitive records)', 'READ', 'Students'),
      E('student_class_promoted', 'Student moved to the next class', 'UPDATE', 'Students'),
      E('student_transferred', 'Student transferred to another branch', 'UPDATE', 'Students'),
      E('student_detained', 'Student detained in the same class', 'UPDATE', 'Students'),
      E('student_withdrawn', "Student's enrollment cancelled", 'UPDATE', 'Students'),
      E('student_alumni_converted', 'Student record moved to the alumni database', 'UPDATE', 'Students'),
      E('student_medical_viewed', 'Medical records accessed by a user', 'READ', 'Students'),
      E('student_medical_edited', 'Medical information updated', 'UPDATE', 'Students'),
      E('student_document_viewed', 'Transfer Certificate, Marksheet or ID document viewed', 'READ', 'Students'),
      E('student_document_uploaded', 'Document uploaded to a student record', 'CREATE', 'Students'),
      E('student_document_downloaded', 'Document downloaded from a student record', 'EXPORT', 'Students'),
      E('student_document_deleted', 'Document removed from a student record', 'DELETE', 'Students'),
      E('admission_application_created', 'Online or offline application submitted', 'CREATE', 'Admissions'),
      E('admission_application_reviewed', 'Application reviewed by admissions staff', 'READ', 'Admissions'),
      E('admission_approved', 'Student formally admitted', 'APPROVE', 'Admissions'),
      E('admission_rejected', 'Application rejected', 'REJECT', 'Admissions'),
      E('admission_waitlisted', 'Applicant placed on waitlist', 'UPDATE', 'Admissions')
    ]
  },
  {
    category: 'System',
    events: [
      E('academic_year_created', 'New academic year set up', 'CREATE', 'System'),
      E('academic_year_activated', 'Active academic year switched', 'UPDATE', 'System'),
      E('school_profile_edited', 'School name, logo or address changed', 'UPDATE', 'System'),
      E('branch_created', 'New school branch added', 'CREATE', 'System'),
      E('branch_edited', 'Branch details modified', 'UPDATE', 'System'),
      E('class_created', 'New class added', 'CREATE', 'System'),
      E('division_created', 'New division added', 'CREATE', 'System'),
      E('subject_created', 'New subject added', 'CREATE', 'System'),
      E('holiday_calendar_updated', 'Holiday or event calendar modified', 'UPDATE', 'System'),
      E('email_template_edited', 'Email template content modified', 'UPDATE', 'System'),
      E('sms_template_edited', 'SMS template content changed', 'UPDATE', 'System'),
      E('notification_rule_created', 'New automatic notification rule created', 'CREATE', 'System'),
      E('notification_rule_deleted', 'Notification rule removed', 'DELETE', 'System'),
      E('backup_created', 'System backup generated (size and duration logged)', 'SYSTEM', 'System'),
      E('backup_restored', 'Data restored from a backup', 'SYSTEM', 'System'),
      E('maintenance_mode_on', 'System put into maintenance mode', 'SYSTEM', 'System'),
      E('maintenance_mode_off', 'System brought back online', 'SYSTEM', 'System'),
      E('records_archived', 'Old records moved to archive storage', 'SYSTEM', 'System'),
      E('records_purged', 'Data permanently deleted after retention period expiry', 'DELETE', 'System'),
      E('retention_policy_changed', 'Data retention rules updated', 'UPDATE', 'System')
    ]
  },
  {
    category: 'Export',
    events: [
      E('data_exported_excel', 'Module data exported to Excel format', 'EXPORT', 'Exports'),
      E('data_exported_pdf', 'Data or report exported to PDF format', 'EXPORT', 'Exports'),
      E('data_exported_csv', 'CSV export triggered from any module', 'EXPORT', 'Exports'),
      E('bulk_data_exported', 'Large-scale export (all students, full fee register)', 'EXPORT', 'Exports'),
      E('report_card_printed', 'Student report card sent to print', 'PRINT', 'Exports'),
      E('fee_receipt_printed', 'Fee receipt printed', 'PRINT', 'Fee'),
      E('admit_card_printed', 'Exam admit card printed', 'PRINT', 'Examination'),
      E('id_card_printed', 'Student or staff ID card printed', 'PRINT', 'Exports'),
      E('certificate_printed', 'Achievement, Transfer or Bonafide certificate printed', 'PRINT', 'Exports'),
      E('report_shared_parent', 'Report or document shared with parent via portal', 'EXPORT', 'Communication'),
      E('data_sent_sms', 'Student or school data shared via SMS', 'EXPORT', 'Communication'),
      E('data_sent_email', 'Report or information sent by email', 'EXPORT', 'Communication'),
      E('api_data_shared', 'Data shared to an external system via API', 'EXPORT', 'API'),
      E('data_imported_excel', 'Bulk data imported from Excel into any module', 'IMPORT', 'Imports'),
      E('student_bulk_imported', 'Student records imported in bulk', 'IMPORT', 'Imports'),
      E('marks_bulk_imported', 'Marks uploaded via CSV file', 'IMPORT', 'Imports'),
      E('import_validation_failed', 'Import rejected due to validation errors (error details + file name logged)', 'IMPORT', 'Imports')
    ]
  },
  {
    category: 'Communication',
    events: [
      E('circular_published', 'School circular or notice published', 'CREATE', 'Communication'),
      E('circular_edited', 'Circular content updated', 'UPDATE', 'Communication'),
      E('circular_deleted', 'Circular removed', 'DELETE', 'Communication'),
      E('sms_sent_bulk', 'Mass SMS sent to parents or students', 'CREATE', 'Communication'),
      E('sms_sent_individual', 'Single SMS notification sent', 'CREATE', 'Communication'),
      E('email_sent_bulk', 'Mass email campaign sent to a group', 'CREATE', 'Communication'),
      E('push_notification_sent', 'Mobile app push notification dispatched', 'CREATE', 'Communication'),
      E('parent_message_sent', 'Direct message sent to a specific parent', 'CREATE', 'Communication'),
      E('announcement_broadcast', 'School-wide announcement sent to all users', 'CREATE', 'Communication')
    ]
  },
  {
    category: 'API',
    events: [
      E('api_key_created', 'New API key generated', 'CREATE', 'API'),
      E('api_key_revoked', 'API key revoked', 'DELETE', 'API'),
      E('api_call_success', 'Successful external API call made', 'READ', 'API'),
      E('api_call_failed', 'External API call returned an error (response code + message logged)', 'READ', 'API'),
      E('webhook_triggered', 'Webhook sent to an external system', 'READ', 'API'),
      E('webhook_failed', 'Webhook delivery failed (reason + retry count logged)', 'READ', 'API'),
      E('third_party_login', 'SSO, Google or Microsoft login used', 'LOGIN', 'API'),
      E('payment_gateway_hit', 'Online fee payment API called', 'READ', 'API'),
      E('sms_gateway_response', 'SMS gateway response received (delivery status logged)', 'READ', 'API'),
      E('biometric_sync', 'Biometric device synced attendance data into the system', 'SYSTEM', 'API')
    ]
  },
  {
    category: 'Error',
    events: [
      E('page_error_500', 'Internal server error on a page (URL + stack trace logged)', 'SYSTEM', 'System'),
      E('page_error_404', 'Page not found (requested URL logged)', 'SYSTEM', 'System'),
      E('database_error', 'Database query failed (query type + error, never sensitive content)', 'SYSTEM', 'System'),
      E('file_upload_failed', 'File upload error (file name + reason logged)', 'SYSTEM', 'System'),
      E('email_delivery_failed', 'Email failed to deliver (recipient + error code logged)', 'SYSTEM', 'System'),
      E('slow_query_detected', 'Database query took longer than 3 seconds (duration logged)', 'SYSTEM', 'System'),
      E('high_memory_usage', 'Server memory usage exceeded threshold', 'SYSTEM', 'System'),
      E('server_down', 'Server became unreachable', 'SYSTEM', 'System'),
      E('scheduled_job_failed', 'A scheduled cron job did not run or failed mid-execution', 'SYSTEM', 'System'),
      E('cron_attendance_reminder', 'Daily attendance reminder notification sent', 'SYSTEM', 'Cron'),
      E('cron_fee_due_reminder', 'Upcoming fee due date SMS or email sent to parents', 'SYSTEM', 'Cron'),
      E('cron_backup_completed', 'Nightly backup finished (size + duration logged)', 'SYSTEM', 'Cron'),
      E('cron_report_generated', 'Scheduled report automatically created', 'SYSTEM', 'Cron'),
      E('cron_archive_completed', 'Records auto-archived per retention policy', 'SYSTEM', 'Cron')
    ]
  }
];

export const ALL_EVENTS: LogEventDef[] = EVENT_CATALOG.flatMap((c) => c.events);

/* -------------------------------------------------- retention + priority */

export const RETENTION_POLICY: { category: LogCategory | 'All logs'; years: string; rule: string }[] = [
  { category: 'Security', years: '5 years', rule: 'Security logs (logins, violations)' },
  { category: 'User & RBAC', years: '7 years', rule: 'User & RBAC change logs' },
  { category: 'Academic', years: '10 years', rule: 'Academic logs (marks, attendance, results)' },
  { category: 'Finance', years: '7 years', rule: 'Finance & fee logs' },
  { category: 'Student', years: '10 years', rule: 'Student record logs' },
  { category: 'System', years: '3 years', rule: 'System & configuration logs' },
  { category: 'Export', years: '5 years', rule: 'Export & print logs' },
  { category: 'Error', years: '1 year', rule: 'Error logs' },
  { category: 'API', years: '2 years', rule: 'API & integration logs' }
];

export const PRIORITY_TABLE: { area: string; priority: Priority }[] = [
  { area: 'Security & Access', priority: 'Critical' },
  { area: 'User & RBAC Management', priority: 'Critical' },
  { area: 'Academic (Marks, Attendance, Results)', priority: 'Critical' },
  { area: 'Finance & Fee', priority: 'Critical' },
  { area: 'Student Records & Admissions', priority: 'High' },
  { area: 'System & Configuration', priority: 'High' },
  { area: 'Export, Print & Data Sharing', priority: 'High' },
  { area: 'Communication', priority: 'Medium' },
  { area: 'API & Integration', priority: 'Medium' },
  { area: 'Error & Performance', priority: 'Medium' }
];

export const NEVER_LOGGED: string[] = [
  'Passwords in plain text or hashed form',
  'OTP values',
  'JWT tokens or session tokens',
  'Full credit card or payment card numbers (last 4 digits only, if needed)',
  'Full bank account numbers (last 4 digits only, if needed)',
  'Raw biometric data',
  'API secret keys or private keys',
  'Full medical record content (only the access event is logged, never the content)'
];

export const MASKED_FIELD_EXAMPLES: { field: string; stored: string }[] = [
  { field: 'password', stored: '••••••••  (never stored, not even hashed)' },
  { field: 'otp', stored: '••••••  (never stored — only otp_generated / otp_verified events)' },
  { field: 'card_number', stored: '•••• 4821  (last 4 digits only)' },
  { field: 'bank_account', stored: '•••• 7734  (last 4 digits only)' },
  { field: 'api_secret', stored: '••••••••••  (never stored)' },
  { field: 'biometric_raw', stored: 'not stored — device only' },
  { field: 'medical_notes', stored: 'not stored — access event only ("student_medical_viewed")' }
];

/* ------------------------------------------------------------ seed entries */

const DEFAULT_SESSION = 'sess-7b2c…4f19';

const L = (
  e: Partial<LogEntry> & {
    id: string;
    category: LogCategory;
    type: string;
    action: LogAction;
    module: string;
    page: string;
    description: string;
    userName: string;
    userRole: string;
    userEmpId: string;
    date: string;
    createdAt: string;
    status: LogStatus;
  }
): LogEntry => ({
  userId: 1024,
  academicYear: '2025-26',
  ip: '10.0.4.21',
  device: 'Desktop',
  browser: 'Chrome 120',
  os: 'Windows 11',
  sessionId: DEFAULT_SESSION,
  requestId: 'req-' + e.id.toLowerCase(),
  branch: 'Main Branch',
  oldValues: null,
  newValues: null,
  ...e
});

export const SEED_LOGS: LogEntry[] = [
  /* ---------------------------------------------------------- Security */
  L({
    id: 'LOG-2025-09-30-SEC-9021', category: 'Security', type: 'user_login_success', action: 'LOGIN', module: 'Security',
    page: 'Login', description: 'Priya Gupta logged in successfully from the school main gate IP',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-30',
    createdAt: '30-Sep-2025 09:04:12 AM', status: 'success', ip: '10.0.4.21', browser: 'Chrome 120', os: 'Windows 11'
  }),
  L({
    id: 'LOG-2025-09-30-SEC-9022', category: 'Security', type: 'user_login_failed', action: 'LOGIN', module: 'Security',
    page: 'Login', description: 'Wrong password attempt #2 for account priya.gupta@school.com from 103.21.44.7',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-30',
    createdAt: '30-Sep-2025 08:58:41 AM', status: 'failed', failureReason: 'Invalid password — attempt 2 of 5',
    ip: '103.21.44.7', browser: 'Firefox 121', os: 'Windows 10', device: 'Desktop'
  }),
  L({
    id: 'LOG-2025-09-30-SEC-9023', category: 'Security', type: 'user_login_blocked', action: 'LOGIN', module: 'Security',
    page: 'Login', description: 'Account ravi.shah@school.com locked after 5 failed attempts — auto-block 30 minutes',
    userName: 'Ravi Shah', userRole: 'Accountant', userEmpId: 'EMP-1188', date: '2025-09-30',
    createdAt: '30-Sep-2025 07:41:09 AM', status: 'blocked', failureReason: 'Maximum failed attempts reached (5) — account locked automatically',
    ip: '45.116.208.19', browser: 'Chrome 119', os: 'Android 14', device: 'Mobile'
  }),
  L({
    id: 'LOG-2025-09-30-SEC-9024', category: 'Security', type: 'login_outside_hours', action: 'LOGIN', module: 'Security',
    page: 'Login', description: 'Login at 02:12 AM — outside the configured working window (06:00–22:00)',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-30',
    createdAt: '30-Sep-2025 02:12:55 AM', status: 'warning', failureReason: 'Outside allowed login hours — flagged for review',
    ip: '10.0.4.5', browser: 'Edge 120', os: 'Windows 11'
  }),
  L({
    id: 'LOG-2025-09-30-SEC-9025', category: 'Security', type: 'unauthorized_access_attempt', action: 'READ', module: 'RBAC',
    page: 'Payroll Approval', description: 'Kavita Rao tried to open Payroll Approval without the payroll.approve permission',
    userName: 'Kavita Rao', userRole: 'HR Manager', userEmpId: 'EMP-1042', date: '2025-09-30',
    createdAt: '30-Sep-2025 11:26:03 AM', status: 'blocked', failureReason: 'Missing permission: payroll.approve on page payroll-approval',
    ip: '10.0.4.31', browser: 'Chrome 120', os: 'macOS 14'
  }),
  L({
    id: 'LOG-2025-09-30-SEC-9026', category: 'Security', type: 'data_scope_violation', action: 'READ', module: 'RBAC',
    page: 'Student Marks', description: 'Teacher attempted to read Class 10-B marks — data scope allows only Class 8-A',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-30',
    createdAt: '30-Sep-2025 10:47:58 AM', status: 'blocked', failureReason: 'data_scope_violation — scope "Class 8-A only" rejected class_id 10-B',
    ip: '10.0.4.44', browser: 'Chrome 118', os: 'Windows 11', classId: 'Class 10-B'
  }),
  L({
    id: 'LOG-2025-09-29-SEC-8955', category: 'Security', type: 'api_unauthorized', action: 'READ', module: 'API',
    page: 'REST API', description: 'API call to /api/v1/fees rejected — expired bearer token',
    userName: 'Integration Service', userRole: 'System', userEmpId: 'SYS-API', date: '2025-09-29',
    createdAt: '29-Sep-2025 06:22:14 PM', status: 'blocked', failureReason: '401 Unauthorized — token expired 2025-09-28T23:59:00Z',
    ip: '52.66.14.90', browser: '—', os: 'Linux (Ubuntu 22.04)', device: 'Desktop'
  }),
  L({
    id: 'LOG-2025-09-29-SEC-8954', category: 'Security', type: 'rate_limit_triggered', action: 'READ', module: 'API',
    page: 'REST API', description: 'Rate limit triggered: 320 requests in 60 seconds from a single IP',
    userName: 'Integration Service', userRole: 'System', userEmpId: 'SYS-API', date: '2025-09-29',
    createdAt: '29-Sep-2025 06:18:02 PM', status: 'warning', failureReason: 'Limit 120 req/min exceeded — throttled for 10 minutes',
    ip: '52.66.14.90', browser: '—', os: 'Linux (Ubuntu 22.04)'
  }),
  L({
    id: 'LOG-2025-09-29-SEC-8950', category: 'Security', type: 'otp_verified', action: 'READ', module: 'Security',
    page: 'Two-Factor Authentication', description: 'OTP verified for salary disbursement authorisation (2FA step)',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 04:05:37 PM', status: 'success', ip: '10.0.4.5'
  }),
  L({
    id: 'LOG-2025-09-29-SEC-8949', category: 'Security', type: 'otp_failed', action: 'READ', module: 'Security',
    page: 'Two-Factor Authentication', description: 'Incorrect OTP entered for salary disbursement authorisation',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 04:04:51 PM', status: 'failed', failureReason: 'OTP mismatch — attempt 1 of 3 (value never stored)'
  }),
  L({
    id: 'LOG-2025-09-29-SEC-8942', category: 'Security', type: 'force_logout', action: 'LOGOUT', module: 'Security',
    page: 'Active Users', description: 'Super Admin force-terminated Ravi Shah’s active session from a library desktop',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 02:11:20 PM', status: 'success', ip: '10.0.4.5',
    oldValues: { session_state: 'active', session_id: 'sess-3ad9…77c1', device: 'Library Desktop LS-04' },
    newValues: { session_state: 'terminated_by_admin', session_id: 'sess-3ad9…77c1', terminated_by: 'EMP-1001 (Super Admin)' }
  }),
  L({
    id: 'LOG-2025-09-28-SEC-8901', category: 'Security', type: 'password_reset_by_admin', action: 'UPDATE', module: 'Security',
    page: 'User Master', description: 'Admin reset the password of account ravi.shah@school.com after the lockout',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-28',
    createdAt: '28-Sep-2025 09:32:44 AM', status: 'success', ip: '10.0.4.5',
    entityType: 'user', entityId: 'USR-1188', entityLabel: 'Ravi Shah | Accountant | EMP-1188',
    oldValues: { password: '•••••••• (never stored)', must_change_password: false },
    newValues: { password: '•••••••• (never stored)', must_change_password: true, reset_by: 'EMP-1001' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-28-SEC-8898', category: 'Security', type: 'session_expired', action: 'LOGOUT', module: 'Security',
    page: 'Session', description: 'Session auto-expired after 30 minutes of inactivity',
    userName: 'Sneha Patel', userRole: 'Librarian', userEmpId: 'EMP-1902', date: '2025-09-28',
    createdAt: '28-Sep-2025 01:52:10 PM', status: 'success', ip: '10.0.6.14', browser: 'Chrome 120', os: 'Windows 11'
  }),

  /* -------------------------------------------------------- User & RBAC */
  L({
    id: 'LOG-2025-09-30-RBC-9077', category: 'User & RBAC', type: 'permission_granted', action: 'UPDATE', module: 'RBAC',
    page: 'Role Management', description: 'Granted Delete permission on “Fee Receipts” to the Finance Manager role',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-30',
    createdAt: '30-Sep-2025 12:08:33 PM', status: 'success', ip: '10.0.4.5',
    entityType: 'role_permission', entityId: 'ROLE-FIN-02', entityLabel: 'Finance Manager → Fee Receipts → Delete',
    oldValues: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
    newValues: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-30-RBC-9076', category: 'User & RBAC', type: 'role_assigned_to_user', action: 'UPDATE', module: 'RBAC',
    page: 'User Master', description: 'Assigned the role “Accounts Reviewer” to Ravi Shah',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-30',
    createdAt: '30-Sep-2025 11:58:07 AM', status: 'success',
    entityType: 'user_role', entityId: 'USR-1188', entityLabel: 'Ravi Shah | Accountant | EMP-1188',
    oldValues: { roles: ['Accountant'] }, newValues: { roles: ['Accountant', 'Accounts Reviewer'] }
  }),
  L({
    id: 'LOG-2025-09-30-RBC-9075', category: 'User & RBAC', type: 'data_scope_assigned', action: 'UPDATE', module: 'RBAC',
    page: 'Data Scope Management', description: 'Assigned the data scope “Class 8-A — Mathematics only” to Teacher role on Student Marks',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-30',
    createdAt: '30-Sep-2025 11:44:19 AM', status: 'success',
    entityType: 'page_data_scope', entityId: 'PS-0088', entityLabel: 'Teacher → Student Marks → Class 8-A / Mathematics',
    oldValues: { scope_id: null, scope_name: null },
    newValues: { scope_id: 'DS-0042', scope_name: 'Class 8-A — Mathematics only' }
  }),
  L({
    id: 'LOG-2025-09-29-RBC-9040', category: 'User & RBAC', type: 'user_deactivated', action: 'UPDATE', module: 'RBAC',
    page: 'Deactivation Wizard', description: 'Deactivated the account of Sunita Desai (retired) after responsibility handover',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 03:26:45 PM', status: 'success',
    entityType: 'user', entityId: 'USR-0912', entityLabel: 'Sunita Desai | Senior Clerk | EMP-0912',
    oldValues: { status: 'active', login_allowed: true },
    newValues: { status: 'deactivated', login_allowed: false, deactivated_on: '2025-09-29' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-RBC-9039', category: 'User & RBAC', type: 'deactivation_reassigned', action: 'UPDATE', module: 'RBAC',
    page: 'Deactivation Wizard', description: 'Reassigned 3 active responsibilities before deactivation of EMP-0912',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 03:18:02 PM', status: 'success',
    entityType: 'responsibility', entityId: 'WIZ-2025-0014', entityLabel: 'Fee counter (→ Ravi Shah) · Library desk (→ Sneha Patel) · Transport log (→ Imran Khan)',
    oldValues: { owner: 'EMP-0912', tasks: ['Fee counter', 'Library desk', 'Transport log'] },
    newValues: { reassigned: { 'Fee counter': 'EMP-1188', 'Library desk': 'EMP-1902', 'Transport log': 'EMP-1601' } }
  }),
  L({
    id: 'LOG-2025-09-28-RBC-9021', category: 'User & RBAC', type: 'role_edited', action: 'UPDATE', module: 'RBAC',
    page: 'Role Management', description: 'Renamed role “Fee Manager” → “Finance Manager” and added the Approve permission',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-28',
    createdAt: '28-Sep-2025 10:15:26 AM', status: 'success',
    entityType: 'role', entityId: 'ROLE-FIN-02', entityLabel: 'Finance Manager',
    oldValues: { name: 'Fee Manager', description: 'Handles fee counter operations', approve: false },
    newValues: { name: 'Finance Manager', description: 'Handles all finance operations incl. approvals', approve: true },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-27-RBC-8990', category: 'User & RBAC', type: 'user_created', action: 'CREATE', module: 'RBAC',
    page: 'User Master', description: 'Created the user account for the new Physics teacher',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-27',
    createdAt: '27-Sep-2025 04:47:11 PM', status: 'success',
    entityType: 'user', entityId: 'USR-2210', entityLabel: 'Nikhil Bhatt | Physics Teacher | EMP-2210',
    newValues: { name: 'Nikhil Bhatt', role: 'Teacher', email: 'nikhil.bhatt@school.com', status: 'active' }
  }),

  /* ----------------------------------------------------------- Academic */
  L({
    id: 'LOG-2025-09-28-MRK-5821', category: 'Academic', type: 'marks_edited', action: 'UPDATE', module: 'Academics',
    page: 'Student Marks', description: 'Edited Math marks for Rahul Kumar, Class 8-A, Term 1',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-28',
    createdAt: '28-Sep-2025 10:42:13 AM', status: 'success', ip: '10.0.4.44', classId: 'Class 8-A', divisionId: 'A',
    entityType: 'student_mark', entityId: 'MARK-88213', entityLabel: 'Rahul Kumar | Class 8-A | Mathematics | Term 1',
    oldValues: { marks: 72, grade: 'B', remarks: 'Needs improvement in algebra' },
    newValues: { marks: 85, grade: 'A', remarks: 'Improved after re-test' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-28-MRK-5820', category: 'Academic', type: 'marks_bulk_uploaded', action: 'IMPORT', module: 'Academics',
    page: 'Marks Entry', description: 'Bulk uploaded Term 1 marks for Class 8-A from marks_term1_8A.xlsx (42 rows, 42 valid)',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-28',
    createdAt: '28-Sep-2025 09:58:40 AM', status: 'success', classId: 'Class 8-A',
    newValues: { file: 'marks_term1_8A.xlsx', rows_total: 42, rows_imported: 42, rows_failed: 0 }
  }),
  L({
    id: 'LOG-2025-09-28-MRK-5819', category: 'Academic', type: 'import_validation_failed', action: 'IMPORT', module: 'Academics',
    page: 'Marks Entry', description: 'Marks import rejected — 4 rows had marks above the maximum of 100',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-28',
    createdAt: '28-Sep-2025 09:52:02 AM', status: 'failed', classId: 'Class 8-A',
    failureReason: 'Validation failed — rows 7, 19, 23, 31: marks 118/105/112/101 exceed max_marks 100',
    newValues: { file: 'marks_term1_8A_v2.xlsx', rows_total: 42, rows_imported: 0, rows_failed: 4 }
  }),
  L({
    id: 'LOG-2025-09-27-MRK-5770', category: 'Academic', type: 'marks_approved', action: 'APPROVE', module: 'Academics',
    page: 'Marks Approval', description: 'Approved Term 1 Mathematics marks for Class 8-A (38 students)',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-27',
    createdAt: '27-Sep-2025 05:12:44 PM', status: 'success', classId: 'Class 8-A',
    entityType: 'marks_batch', entityId: 'MB-2025-114', entityLabel: 'Class 8-A | Mathematics | Term 1',
    oldValues: { status: 'submitted' }, newValues: { status: 'approved', approved_by: 'EMP-1001' }
  }),
  L({
    id: 'LOG-2025-09-27-MRK-5765', category: 'Academic', type: 'result_published', action: 'APPROVE', module: 'Academics',
    page: 'Result Publishing', description: 'Published Term 1 results for Class 8 (A + B) to the parent portal',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-27',
    createdAt: '27-Sep-2025 05:35:19 PM', status: 'success',
    entityType: 'result_batch', entityId: 'RES-2025-T1-08', entityLabel: 'Term 1 | Class 8 | 76 students',
    oldValues: { published: false }, newValues: { published: true, visible_to: ['students', 'parents'] },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-30-ATT-9060', category: 'Academic', type: 'attendance_edited', action: 'UPDATE', module: 'Attendance',
    page: 'Attendance Register', description: 'Corrected attendance for Ayaan Qureshi — absent marked by mistake',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-30',
    createdAt: '30-Sep-2025 08:22:09 AM', status: 'success', ip: '10.0.4.60', device: 'Mobile', browser: 'Chrome 120', os: 'Android 14',
    classId: 'Class 8-A',
    entityType: 'attendance', entityId: 'ATT-2025-09-30-8A-14', entityLabel: 'Ayaan Qureshi | Class 8-A | 30-Sep-2025',
    oldValues: { status: 'absent', marked_by: 'EMP-2077' },
    newValues: { status: 'present', marked_by: 'EMP-2077', corrected_reason: 'Student arrived late — parent informed' }
  }),
  L({
    id: 'LOG-2025-09-30-ATT-9059', category: 'Academic', type: 'attendance_marked', action: 'CREATE', module: 'Attendance',
    page: 'Attendance Register', description: 'Marked daily attendance for Class 8-A — 34 present, 4 absent',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-30',
    createdAt: '30-Sep-2025 07:58:31 AM', status: 'success', classId: 'Class 8-A',
    newValues: { class: 'Class 8-A', date: '2025-09-30', present: 34, absent: 4 }
  }),

  /* ------------------------------------------------------------ Finance */
  L({
    id: 'LOG-2025-09-30-FEE-9101', category: 'Finance', type: 'fee_paid', action: 'CREATE', module: 'Fee',
    page: 'Fee Collection', description: 'Collected ₹15,500 tuition fee Q2 from Rahul Kumar, Class 8-A (cash)',
    userName: 'Ramesh Sharma', userRole: 'Accountant', userEmpId: 'EMP-1122', date: '2025-09-30',
    createdAt: '30-Sep-2025 10:06:52 AM', status: 'success', ip: '10.0.4.18',
    entityType: 'fee_receipt', entityId: 'REC-2025-00892', entityLabel: 'Rahul Kumar | Class 8-A | Tuition Fee Q2',
    newValues: { amount: 15500, mode: 'Cash', receipt_no: 'REC-2025-00892', collected_by: 'EMP-1122' }
  }),
  L({
    id: 'LOG-2025-09-30-FEE-9100', category: 'Finance', type: 'fee_receipt_reprinted', action: 'PRINT', module: 'Fee',
    page: 'Fee Collection', description: 'Receipt REC-2025-00788 reprinted for parent copy (2nd reprint)',
    userName: 'Ramesh Sharma', userRole: 'Accountant', userEmpId: 'EMP-1122', date: '2025-09-30',
    createdAt: '30-Sep-2025 09:47:15 AM', status: 'warning', failureReason: 'Reprint flagged for audit review — original printed on 12-Sep-2025',
    entityType: 'fee_receipt', entityId: 'REC-2025-00788', entityLabel: 'Meera Nair | Class 7-B | Transport Fee',
    oldValues: { print_count: 1, last_printed: '12-Sep-2025 11:04 AM' },
    newValues: { print_count: 2, last_printed: '30-Sep-2025 09:47 AM', reprint_reason: 'Parent requested duplicate' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-FEE-9078', category: 'Finance', type: 'fee_concession_approved', action: 'APPROVE', module: 'Fee',
    page: 'Scholarship & Concession', description: 'Approved 25% sibling concession for Meera Nair (Class 7-B)',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-29',
    createdAt: '29-Sep-2025 12:31:27 PM', status: 'success',
    entityType: 'fee_concession', entityId: 'CON-2025-0219', entityLabel: 'Meera Nair | Class 7-B | Sibling concession',
    oldValues: { concession_percent: 0, status: 'pending' },
    newValues: { concession_percent: 25, status: 'approved', approved_by: 'EMP-1024' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-FEE-9077', category: 'Finance', type: 'fee_structure_edited', action: 'UPDATE', module: 'Fee',
    page: 'Fee Structure Master', description: 'Class 9 tuition fee for FY 2025-26 raised from ₹15,000 to ₹16,200 per term',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-29',
    createdAt: '29-Sep-2025 11:52:03 AM', status: 'success',
    entityType: 'fee_structure', entityId: 'FS-2025-C9-TUI', entityLabel: 'Class 9 | Tuition Fee | FY 2025-26',
    oldValues: { amount_per_term: 15000, effective_from: '2025-04-01' },
    newValues: { amount_per_term: 16200, effective_from: '2025-10-01' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-FEE-9076', category: 'Finance', type: 'fee_receipt_cancelled', action: 'DELETE', module: 'Fee',
    page: 'Fee Collection', description: 'Cancelled receipt REC-2025-00801 — cheque bounced, amount moved to dues',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-29',
    createdAt: '29-Sep-2025 11:20:47 AM', status: 'success',
    entityType: 'fee_receipt', entityId: 'REC-2025-00801', entityLabel: 'Arjun Verma | Class 9-A | Tuition Fee Q2',
    oldValues: { status: 'paid', amount: 16200, mode: 'Cheque' },
    newValues: { status: 'cancelled', amount: 0, cancellation_reason: 'Cheque returned — insufficient funds' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-28-FEE-9024', category: 'Finance', type: 'bulk_data_exported', action: 'EXPORT', module: 'Fee',
    page: 'Fee Collection Report', description: 'Exported the full FY 2025-26 fee register (18,450 receipts) to Excel',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-28',
    createdAt: '28-Sep-2025 03:14:28 PM', status: 'success',
    entityType: 'export', entityId: 'EXP-2025-0184', entityLabel: 'Fee Collection — FY 2025-26 (All classes)',
    newValues: { format: 'Excel', rows: 18450, size: '6.4 MB', filters: 'FY 2025-26, all classes, paid only' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-27-FIN-8994', category: 'Finance', type: 'salary_edited', action: 'UPDATE', module: 'HR',
    page: 'Payroll Processing', description: 'Corrected August salary for Imran Khan — HRA revised after promotion',
    userName: 'Kavita Rao', userRole: 'HR Manager', userEmpId: 'EMP-1042', date: '2025-09-27',
    createdAt: '27-Sep-2025 06:31:55 PM', status: 'success',
    entityType: 'salary', entityId: 'SAL-2025-08-1601', entityLabel: 'Imran Khan | Transport In-charge | Aug 2025',
    oldValues: { basic: 22000, hra: 6600, net_pay: 26400 },
    newValues: { basic: 22000, hra: 8800, net_pay: 28600, reason: 'Promotion effective 01-Aug-2025' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-26-FIN-8961', category: 'Finance', type: 'journal_entry_created', action: 'CREATE', module: 'Finance',
    page: 'Journal Entry', description: 'Created the monthly depreciation journal entry for September',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-26',
    createdAt: '26-Sep-2025 04:09:12 PM', status: 'success',
    entityType: 'journal_entry', entityId: 'JV-2025-0912', entityLabel: 'Depreciation — Sep 2025 | ₹42,500',
    newValues: { debit_account: 'Depreciation Expense', credit_account: 'Accumulated Depreciation', amount: 42500, period: 'Sep 2025' }
  }),

  /* ------------------------------------------------------------ Student */
  L({
    id: 'LOG-2025-09-30-STU-9088', category: 'Student', type: 'student_medical_viewed', action: 'READ', module: 'Students',
    page: 'Student Profile — Medical', description: 'Medical record of Ayaan Qureshi (asthma note) opened by the school nurse',
    userName: 'Sister Mary Thomas', userRole: 'School Nurse', userEmpId: 'EMP-2301', date: '2025-09-30',
    createdAt: '30-Sep-2025 11:03:41 AM', status: 'success', ip: '10.0.7.12',
    entityType: 'student_medical', entityId: 'MED-2022-0451', entityLabel: 'Ayaan Qureshi | Class 8-A | Medical record',
    newValues: { access: 'read', content: 'NOT STORED — only the access event is logged' }
  }),
  L({
    id: 'LOG-2025-09-30-STU-9087', category: 'Student', type: 'student_document_downloaded', action: 'EXPORT', module: 'Students',
    page: 'Student Documents', description: 'Downloaded the verified Birth Certificate of Ayaan Qureshi for the board file',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-30',
    createdAt: '30-Sep-2025 10:36:20 AM', status: 'success',
    entityType: 'student_document', entityId: 'DOC-2022-0451-BC', entityLabel: 'Ayaan Qureshi | Birth Certificate.pdf',
    newValues: { action: 'download', file: 'birth_certificate.pdf', size: '184 KB' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-STU-9062', category: 'Student', type: 'student_profile_edited', action: 'UPDATE', module: 'Students',
    page: 'Student Master', description: 'Updated the guardian mobile and address for Rahul Kumar, Class 8-A',
    userName: 'Ramesh Sharma', userRole: 'Accountant', userEmpId: 'EMP-1122', date: '2025-09-29',
    createdAt: '29-Sep-2025 09:14:50 AM', status: 'success',
    entityType: 'student', entityId: 'STU-2022-0451', entityLabel: 'Rahul Kumar | Class 8-A | ADM-2022-045',
    oldValues: { guardian_mobile: '98765XXXXX', address: '12, Shanti Nagar, Ahmedabad' },
    newValues: { guardian_mobile: '98250XXXXX', address: '44, Green Park Society, Ahmedabad' }
  }),
  L({
    id: 'LOG-2025-09-28-STU-9025', category: 'Student', type: 'admission_approved', action: 'APPROVE', module: 'Admissions',
    page: 'Admission Management', description: 'Approved the admission of Tanya Mehta into Class 6-B for FY 2025-26',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-28',
    createdAt: '28-Sep-2025 12:44:37 PM', status: 'success',
    entityType: 'admission', entityId: 'ADM-2025-0341', entityLabel: 'Tanya Mehta | Class 6-B | Application APP-2025-0341',
    oldValues: { stage: 'under_review', decision: null },
    newValues: { stage: 'admitted', decision: 'approved', student_id: 'STU-2025-0781', fee_plan: 'Standard Class 6' }
  }),

  /* ------------------------------------------------------------- System */
  L({
    id: 'LOG-2025-09-30-SYS-9090', category: 'System', type: 'cron_backup_completed', action: 'SYSTEM', module: 'System',
    page: 'Backup & Maintenance', description: 'Nightly full backup finished — 16.2 GB written in 18 min 10 sec',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-30',
    createdAt: '30-Sep-2025 05:18:10 AM', status: 'success', ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { backup_file: 'erp_full_2025-09-30.sql.gz', size: '16.2 GB', duration: '18m 10s', destination: 'S3 ap-south-1' }
  }),
  L({
    id: 'LOG-2025-09-29-SYS-9044', category: 'System', type: 'retention_policy_changed', action: 'UPDATE', module: 'System',
    page: 'Archive Settings & Rules', description: 'Fee module primary retention reduced from 3 years to 2 years',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 03:52:31 PM', status: 'success',
    entityType: 'retention_policy', entityId: 'RP-FEE', entityLabel: 'Fee Module retention rule',
    oldValues: { primary_keep: '3 years', archive_keep: '4 years', cold_keep: '8 years' },
    newValues: { primary_keep: '2 years', archive_keep: '4 years', cold_keep: '8 years' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-29-SYS-9043', category: 'System', type: 'records_archived', action: 'SYSTEM', module: 'System',
    page: 'Archive Management', description: 'Nightly archive moved 12,450 Finance/GL journal entries older than 2 years',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-29',
    createdAt: '29-Sep-2025 02:23:45 AM', status: 'success', ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { module: 'Finance/GL', records: 12450, freed: '245 MB', verify: 'checksum 12,450/12,450 match' }
  }),
  L({
    id: 'LOG-2025-09-28-SYS-9026', category: 'System', type: 'maintenance_mode_on', action: 'SYSTEM', module: 'System',
    page: 'System Settings', description: 'System put into maintenance mode for the quarterly DB upgrade',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-28',
    createdAt: '28-Sep-2025 11:02:08 PM', status: 'success',
    oldValues: { maintenance_mode: false }, newValues: { maintenance_mode: true, expected_until: '29-Sep-2025 01:00 AM' }
  }),
  L({
    id: 'LOG-2025-09-28-SYS-9027', category: 'System', type: 'maintenance_mode_off', action: 'SYSTEM', module: 'System',
    page: 'System Settings', description: 'System brought back online after the DB upgrade',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-28',
    createdAt: '28-Sep-2025 11:48:52 PM', status: 'success',
    oldValues: { maintenance_mode: true }, newValues: { maintenance_mode: false, downtime: '46 min 44 sec' }
  }),

  /* ------------------------------------------------------------- Export */
  L({
    id: 'LOG-2025-09-30-EXP-9092', category: 'Export', type: 'data_exported_pdf', action: 'EXPORT', module: 'Finance',
    page: 'Trial Balance', description: 'Exported the September Trial Balance to PDF (1,240 rows)',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-30',
    createdAt: '30-Sep-2025 01:12:39 PM', status: 'success',
    entityType: 'export', entityId: 'EXP-2025-0183', entityLabel: 'Trial Balance — Sep 2025 (PDF)',
    newValues: { format: 'PDF', rows: 1240, size: '820 KB', filters: 'Sep 2025, all cost centres' }
  }),
  L({
    id: 'LOG-2025-09-30-EXP-9091', category: 'Export', type: 'certificate_printed', action: 'PRINT', module: 'Certificates',
    page: 'Certificates', description: 'Printed a Bonafide Certificate for Ayaan Qureshi, Class 8-A',
    userName: 'Sneha Patel', userRole: 'Librarian', userEmpId: 'EMP-1902', date: '2025-09-30',
    createdAt: '30-Sep-2025 11:41:06 AM', status: 'success',
    entityType: 'certificate', entityId: 'CERT-2025-00776', entityLabel: 'Bonafide Certificate | Ayaan Qureshi | Class 8-A',
    newValues: { certificate_type: 'Bonafide', copies: 1, printed_at: 'Front Office Printer' }
  }),
  L({
    id: 'LOG-2025-09-29-EXP-9063', category: 'Export', type: 'report_shared_parent', action: 'EXPORT', module: 'Communication',
    page: 'Report Card Sharing', description: 'Term 1 report card of Ayaan Qureshi shared with the parent portal',
    userName: 'Meenal Joshi', userRole: 'Teacher', userEmpId: 'EMP-2077', date: '2025-09-29',
    createdAt: '29-Sep-2025 09:33:14 AM', status: 'success', classId: 'Class 8-A',
    entityType: 'report_card', entityId: 'RC-2025-T1-0451', entityLabel: 'Ayaan Qureshi | Class 8-A | Term 1',
    newValues: { shared_with: 'parent (98250XXXXX)', via: 'parent portal', notified: 'push + email' }
  }),
  L({
    id: 'LOG-2025-09-27-EXP-9001', category: 'Export', type: 'student_bulk_imported', action: 'IMPORT', module: 'Imports',
    page: 'Data Import Wizard', description: 'Imported 128 new student records from admission_master.xlsx',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-27',
    createdAt: '27-Sep-2025 11:26:48 AM', status: 'success',
    entityType: 'import', entityId: 'IMP-2025-0044', entityLabel: 'admission_master.xlsx',
    newValues: { file: 'admission_master.xlsx', rows_total: 130, rows_imported: 128, rows_failed: 2, failure_reason: 'Duplicate admission numbers' }
  }),

  /* ------------------------------------------------------ Communication */
  L({
    id: 'LOG-2025-09-30-COM-9093', category: 'Communication', type: 'sms_sent_bulk', action: 'CREATE', module: 'Communication',
    page: 'Bulk Messaging', description: 'Sent the fee-due reminder SMS to 412 parents of Classes 6–8',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-30',
    createdAt: '30-Sep-2025 02:05:22 PM', status: 'success',
    entityType: 'sms_campaign', entityId: 'SMS-2025-1187', entityLabel: 'Fee due reminder | Classes 6–8 | 412 recipients',
    newValues: { recipients: 412, template: 'FEE_DUE_REMINDER', credits_used: 412, gateway: 'DLT-TRAI approved' }
  }),
  L({
    id: 'LOG-2025-09-29-COM-9064', category: 'Communication', type: 'circular_published', action: 'CREATE', module: 'Communication',
    page: 'Circulars & Notices', description: 'Published the Half-Yearly Examination circular to all classes',
    userName: 'Anil Mehta', userRole: 'Super Admin', userEmpId: 'EMP-1001', date: '2025-09-29',
    createdAt: '29-Sep-2025 10:18:55 AM', status: 'success',
    entityType: 'circular', entityId: 'CIR-2025-0142', entityLabel: 'Half-Yearly Examination Schedule — Oct 2025',
    newValues: { audience: 'all classes, staff', channels: ['in-app', 'email'], attachment: 'exam_schedule_oct2025.pdf' }
  }),

  /* ---------------------------------------------------------------- API */
  L({
    id: 'LOG-2025-09-30-API-9094', category: 'API', type: 'api_call_failed', action: 'READ', module: 'API',
    page: 'Payment Gateway', description: 'Payment gateway refund call failed — gateway returned 502',
    userName: 'System (Gateway Worker)', userRole: 'System', userEmpId: 'SYS-API', date: '2025-09-30',
    createdAt: '30-Sep-2025 02:26:41 PM', status: 'failed', failureReason: 'HTTP 502 Bad Gateway from gateway — refund ₹2,400 retried twice, queued for retry #3',
    ip: '10.0.9.4', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'api_call', entityId: 'REF-2025-0031', entityLabel: 'Refund ₹2,400 | REC-2025-00790 | Parent: Meera Nair',
    newValues: { endpoint: '/v2/refunds', request_id: 'pg_req_8871', response_code: 502, attempts: 2 }
  }),
  L({
    id: 'LOG-2025-09-30-API-9095', category: 'API', type: 'biometric_sync', action: 'SYSTEM', module: 'API',
    page: 'Biometric Sync', description: 'Biometric device DEV-04 synced 268 staff attendance punch records',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-30',
    createdAt: '30-Sep-2025 06:00:14 AM', status: 'success', ip: '10.0.8.31', browser: '—', os: 'Device firmware',
    entityType: 'device_sync', entityId: 'DEV-04', entityLabel: 'Main Gate Entry Device',
    newValues: { punches: 268, duplicates_skipped: 3, raw_data: 'not stored — only the sync event is logged' }
  }),
  L({
    id: 'LOG-2025-09-29-API-9065', category: 'API', type: 'webhook_failed', action: 'READ', module: 'API',
    page: 'Webhooks', description: 'Webhook to the Tally sync endpoint failed — connection timed out',
    userName: 'System (Webhook Worker)', userRole: 'System', userEmpId: 'SYS-API', date: '2025-09-29',
    createdAt: '29-Sep-2025 07:40:02 PM', status: 'failed', failureReason: 'Connection timed out after 15 s — retry 3 of 5 scheduled',
    ip: '10.0.9.4', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { event: 'voucher.created', endpoint: 'https://tally.school.local/hook', retry_count: 3, next_retry: '30 min' }
  }),
  L({
    id: 'LOG-2025-09-28-API-8998', category: 'API', type: 'payment_gateway_hit', action: 'READ', module: 'API',
    page: 'Online Payment', description: 'Online fee payment API called for ₹8,400 — payment captured successfully',
    userName: 'System (Gateway Worker)', userRole: 'System', userEmpId: 'SYS-API', date: '2025-09-28',
    createdAt: '28-Sep-2025 08:15:36 PM', status: 'success', ip: '10.0.9.4', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'online_payment', entityId: 'OP-2025-2288', entityLabel: 'Ayaan Qureshi | Class 8-A | ₹8,400 UPI',
    newValues: { amount: 8400, method: 'UPI', card_number: 'not applicable', bank_account: '•••• 7734 (last 4 only)', status: 'captured' }
  }),

  /* -------------------------------------------------------------- Error */
  L({
    id: 'LOG-2025-09-30-ERR-9096', category: 'Error', type: 'page_error_500', action: 'SYSTEM', module: 'System',
    page: 'Fee Collection Report', description: 'Internal server error while generating the consolidated fee report',
    userName: 'Priya Gupta', userRole: 'Finance Manager', userEmpId: 'EMP-1024', date: '2025-09-30',
    createdAt: '30-Sep-2025 03:02:57 PM', status: 'failed', failureReason: 'HTTP 500 — TypeError: cannot read property “length” of undefined (report_builder.ts:412). Users retried successfully at 03:06 PM',
    ip: '10.0.4.21', browser: 'Chrome 120', os: 'Windows 11',
    entityType: 'page', entityId: '/reports/fee-collection/consolidated',
    newValues: { url: '/reports/fee-collection/consolidated', error_code: 500, trace_id: 'trc-9f21c8' },
    highPriority: true
  }),
  L({
    id: 'LOG-2025-09-30-ERR-9097', category: 'Error', type: 'page_error_404', action: 'SYSTEM', module: 'System',
    page: 'Unknown route', description: 'Requested URL not found — stale bookmark from the old reporting module',
    userName: 'Ravi Shah', userRole: 'Accountant', userEmpId: 'EMP-1188', date: '2025-09-30',
    createdAt: '30-Sep-2025 03:11:24 PM', status: 'warning', failureReason: 'HTTP 404 — no route matches /schoolerp/reports/old-fee-register',
    ip: '10.0.4.18', browser: 'Chrome 119', os: 'Windows 10',
    entityType: 'page', entityId: '/reports/old-fee-register', newValues: { error_code: 404 }
  }),
  L({
    id: 'LOG-2025-09-30-ERR-9098', category: 'Error', type: 'slow_query_detected', action: 'SYSTEM', module: 'System',
    page: 'Fee Collection Report', description: 'Database query exceeded the 3 second threshold during report generation',
    userName: 'System (Monitor)', userRole: 'System', userEmpId: 'SYS-MON', date: '2025-09-30',
    createdAt: '30-Sep-2025 03:01:12 PM', status: 'warning', failureReason: 'Query took 6.8 s (threshold 3 s) — missing index on fee_receipts(student_id, fy)',
    ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { query_type: 'SELECT with JOIN (content not stored — may contain sensitive data)', duration_ms: 6842, rows_scanned: 96400 }
  }),
  L({
    id: 'LOG-2025-09-29-ERR-9070', category: 'Error', type: 'scheduled_job_failed', action: 'SYSTEM', module: 'System',
    page: 'Scheduled Jobs', description: 'Cron job cron_fee_due_reminder aborted mid-execution — SMS gateway quota exhausted',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-29',
    createdAt: '29-Sep-2025 08:00:31 PM', status: 'failed', failureReason: 'Gateway returned “insufficient credits” after 180 of 412 messages — remainder queued for tomorrow',
    ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'cron_job', entityId: 'cron_fee_due_reminder',
    newValues: { sent: 180, failed: 232, next_run: '30-Sep-2025 08:00 PM', alert_emailed_to: 'admin@school.com' }
  }),
  L({
    id: 'LOG-2025-09-29-ERR-9071', category: 'Error', type: 'file_upload_failed', action: 'SYSTEM', module: 'System',
    page: 'Document Upload', description: 'Upload of a 42 MB scanned TC failed — file exceeds the 25 MB limit',
    userName: 'Sneha Patel', userRole: 'Librarian', userEmpId: 'EMP-1902', date: '2025-09-29',
    createdAt: '29-Sep-2025 01:07:19 PM', status: 'failed', failureReason: 'File size 42 MB exceeds the 25 MB per-file limit (file name logged, contents never stored)',
    ip: '10.0.6.14', browser: 'Chrome 120', os: 'Windows 11',
    newValues: { file: 'TC_scan_2025_0781.pdf', size: '42 MB', allowed_max: '25 MB' }
  }),
  L({
    id: 'LOG-2025-09-28-ERR-9030', category: 'Error', type: 'database_error', action: 'SYSTEM', module: 'System',
    page: 'Payroll Processing', description: 'Payroll batch insert failed — deadlock detected on the salary table',
    userName: 'System (Monitor)', userRole: 'System', userEmpId: 'SYS-MON', date: '2025-09-28',
    createdAt: '28-Sep-2025 06:44:03 PM', status: 'failed', failureReason: 'Deadlock found when trying to get lock — transaction rolled back, batch re-ran successfully at 06:47 PM',
    ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { query_type: 'INSERT … SELECT (statement content not stored)', rows_affected: 0, rolled_back: true }
  }),
  L({
    id: 'LOG-2025-09-28-ERR-9031', category: 'Error', type: 'high_memory_usage', action: 'SYSTEM', module: 'System',
    page: 'Server Monitor', description: 'Application server memory usage crossed the 85% threshold',
    userName: 'System (Monitor)', userRole: 'System', userEmpId: 'SYS-MON', date: '2025-09-28',
    createdAt: '28-Sep-2025 06:52:40 PM', status: 'warning', failureReason: 'Memory at 87% (6.9 GB of 8 GB) — report worker pool restarted, back to 54%',
    ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    newValues: { memory_used: '6.9 GB', memory_total: '8 GB', action: 'worker pool restart' }
  }),
  L({
    id: 'LOG-2025-09-27-ERR-9011', category: 'Error', type: 'cron_fee_due_reminder', action: 'SYSTEM', module: 'Cron',
    page: 'Scheduled Jobs', description: 'Daily fee-due reminder cron ran — 412 SMS and 388 emails dispatched',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-27',
    createdAt: '27-Sep-2025 08:00:06 PM', status: 'success', ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'cron_job', entityId: 'cron_fee_due_reminder',
    newValues: { sms_sent: 412, email_sent: 388, due_date_alerted: '05-Oct-2025', duration: '2 min 14 s' }
  }),
  L({
    id: 'LOG-2025-09-27-ERR-9012', category: 'Error', type: 'cron_attendance_reminder', action: 'SYSTEM', module: 'Cron',
    page: 'Scheduled Jobs', description: 'Daily attendance reminder cron ran — 26 pending classes notified',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-27',
    createdAt: '27-Sep-2025 04:30:00 PM', status: 'success', ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'cron_job', entityId: 'cron_attendance_reminder',
    newValues: { classes_pending: 26, notified: 26, channel: 'in-app + email' }
  }),
  L({
    id: 'LOG-2025-09-27-ERR-9013', category: 'Error', type: 'cron_archive_completed', action: 'SYSTEM', module: 'Cron',
    page: 'Scheduled Jobs', description: 'Auto-archive cron finished — 20,680 records moved per the retention policy',
    userName: 'System (Scheduler)', userRole: 'System', userEmpId: 'SYS-CRON', date: '2025-09-27',
    createdAt: '27-Sep-2025 02:26:37 AM', status: 'success', ip: '127.0.0.1', browser: '—', os: 'Linux (Ubuntu 22.04)',
    entityType: 'cron_job', entityId: 'cron_archive_completed',
    newValues: { finance_gl: 12450, attendance: 8230, freed: '430 MB', verify: 'checksum matched' }
  })
];

/* ------------------------------------------------------------- security alerts */

export interface SecurityAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Warning';
  icon: string;
  title: string;
  detail: string;
  user: string;
  ip: string;
  when: string;
}

export const SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'ALR-9001',
    severity: 'Critical',
    icon: '🚨',
    title: 'Account locked — 5 failed login attempts',
    detail: 'ravi.shah@school.com was locked automatically for 30 minutes after 5 wrong passwords from an unknown IP.',
    user: 'Ravi Shah (Accountant, EMP-1188)',
    ip: '45.116.208.19',
    when: '30-Sep-2025 07:41 AM'
  },
  {
    id: 'ALR-9002',
    severity: 'Critical',
    icon: '⛔',
    title: 'Unauthorized access attempt',
    detail: 'HR Manager opened Payroll Approval without the payroll.approve permission — request blocked and logged.',
    user: 'Kavita Rao (HR Manager, EMP-1042)',
    ip: '10.0.4.31',
    when: '30-Sep-2025 11:26 AM'
  },
  {
    id: 'ALR-9003',
    severity: 'High',
    icon: '🔒',
    title: 'Data scope violation',
    detail: 'Teacher tried to read Class 10-B marks while her data scope allows Class 8-A only.',
    user: 'Meenal Joshi (Teacher, EMP-2077)',
    ip: '10.0.4.44',
    when: '30-Sep-2025 10:47 AM'
  },
  {
    id: 'ALR-9004',
    severity: 'Warning',
    icon: '🕑',
    title: 'Login outside working hours (02:12 AM)',
    detail: 'Super Admin logged in at 02:12 AM, outside the configured 06:00–22:00 login window.',
    user: 'Anil Mehta (Super Admin, EMP-1001)',
    ip: '10.0.4.5',
    when: '30-Sep-2025 02:12 AM'
  },
  {
    id: 'ALR-9005',
    severity: 'Warning',
    icon: '📈',
    title: 'Rate limit triggered',
    detail: '320 API requests in 60 seconds from 52.66.14.90 — throttled for 10 minutes.',
    user: 'Integration Service',
    ip: '52.66.14.90',
    when: '29-Sep-2025 06:18 PM'
  }
];

/* --------------------------------------------------------------- aggregates */

export const TODAY = '2025-09-30';

export const QUICK_STATS = {
  totalToday: 34,
  logins: 12,
  dataChanges: 18,
  errors: 3,
  securityViolations: 4,
  exports: 6
};

export const MODULE_OPTIONS = Array.from(new Set(SEED_LOGS.map((l) => l.module))).sort();
export const BRANCH_OPTIONS = ['Main Branch', 'Satellite Branch — Ahmedabad', 'Pre-Primary Wing'];
export const DEVICE_OPTIONS: LogEntry['device'][] = ['Desktop', 'Mobile', 'Tablet'];
export const ACTION_OPTIONS: LogAction[] = [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
  'IMPORT',
  'APPROVE',
  'REJECT',
  'PRINT',
  'SYSTEM'
];
export const STATUS_OPTIONS: LogStatus[] = ['success', 'failed', 'warning', 'blocked'];
