import { rp } from './registryHelper';

export const studentRegistry: Record<string, () => any> = {
  // Management
  'student-list': rp(
    () => import('../student/management/StudentList'),
    'StudentListPage'
  ),
  'student-summary-dashboard': rp(
    () => import('../student/management/StudentSummaryDashboard'),
    'StudentSummaryDashboard'
  ),
  'student-list-all-batch-combined': rp(
    () => import('../student/management/StudentListAllBatchCombined'),
    'StudentListAllBatchCombined'
  ),
  'id-register': rp(
    () => import('../student/management/IdRegister'),
    'IdRegister'
  ),
  'student-detail': rp(
    () => import('../student/management/StudentDetail'),
    'StudentDetail'
  ),
  'verify-info-documents': rp(
    () => import('../student/management/VerifyInfoDocuments'),
    'VerifyInfoDocuments'
  ),
  'upload-student-media': rp(
    () => import('../student/management/UploadStudentMedia'),
    'UploadStudentMedia'
  ),
  'student-sibling': rp(
    () => import('../student/management/StudentSibling'),
    'StudentSibling'
  ),
  'alumni-convert': rp(
    () => import('../student/management/AlumniConvert'),
    'AlumniConvert'
  ),
  alert: rp(() => import('../student/management/Alert'), 'Alert'),
  'student-custom-search': rp(
    () => import('../student/management/StudentCustomSearch'),
    'StudentCustomSearch'
  ),
  'student-reports': rp(
    () => import('../student/management/StudentAcademicReports'),
    'StudentAcademicReports'
  ),
  'student-transfer-withdrawal': rp(
    () => import('../student/management/StudentTransferWithdrawal'),
    'StudentTransferWithdrawal'
  ),
  'student-health-medical': rp(
    () => import('../student/management/StudentHealthMedical'),
    'StudentHealthMedical'
  ),
  'student-discipline': rp(
    () => import('../student/management/StudentDiscipline'),
    'StudentDiscipline'
  ),
  'student-achievements': rp(
    () => import('../student/management/StudentAchievements'),
    'StudentAchievements'
  ),
  'audit-trail': rp(
    () => import('../student/management/AuditTrail'),
    'AuditTrail'
  ),
  'student-preference-collection': rp(
    () => import('../student/management/StudentPreferenceCollection'),
    'StudentPreferenceCollection'
  ),
  'stream-allocation-engine': rp(
    () => import('../student/management/StreamAllocationEngine'),
    'StreamAllocationEngine'
  ),
  'allocation-result': rp(
    () => import('../student/management/AllocationResult'),
    'AllocationResult'
  ),
  'manual-override-adjustment': rp(
    () => import('../student/management/ManualOverrideAdjustment'),
    'ManualOverrideAdjustment'
  ),
  'division-batch-change-approval': rp(
    () => import('../student/management/DivisionBatchChangeApproval'),
    'DivisionBatchChangeApproval'
  ),

  // Settings
  'gr-no-rules': rp(() => import('../student/settings/GrNoRules'), 'GrNoRules'),
  'subject-allocation': rp(
    () => import('../student/settings/SubjectAllocation'),
    'SubjectAllocation'
  ),
  'id-card-template': rp(
    () => import('../student/settings/IdCardTemplate'),
    'IdCardTemplate'
  ),
  'student-doc-type': rp(
    () => import('../student/settings/StudentDocType'),
    'StudentDocType'
  ),
  'admission-form-settings': rp(
    () => import('../student/settings/AdmissionFormSettings'),
    'AdmissionFormSettings'
  ),
  'promotion-policy': rp(
    () => import('../student/settings/PromotionPolicy'),
    'PromotionPolicy'
  ),
  'roll-no-logic': rp(
    () => import('../student/settings/RollNoLogic'),
    'RollNoLogic'
  ),
  'alert-trigger': rp(
    () => import('../student/settings/AlertTrigger'),
    'AlertTrigger'
  ),
  'student-sms-template': rp(
    () => import('../student/settings/StudentSmsTemplate'),
    'StudentSmsTemplate'
  ),
  'parent-portal-rules': rp(
    () => import('../student/settings/ParentPortalRules'),
    'ParentPortalRules'
  ),

  // Admissions
  'admission-summary': rp(
    () => import('../student/admissions/AdmissionSummary'),
    'AdmissionSummary'
  ),
  'admission-inquiry': rp(
    () => import('../student/admissions/AdmissionInquiry'),
    'AdmissionInquiry'
  ),
  'admission-inquiry-follow-up': rp(
    () => import('../student/admissions/AdmissionInquiryFollowUp'),
    'AdmissionInquiryFollowUp'
  ),
  'admission-form': rp(
    () => import('../student/admissions/AdmissionForm'),
    'AdmissionForm'
  ),
  'admission-exam-qp-setup': rp(
    () => import('../student/admissions/AdmissionExamQpSetup'),
    'AdmissionExamQpSetup'
  ),
  'admission-exam-setup': rp(
    () => import('../student/admissions/AdmissionExamSetup'),
    'AdmissionExamSetup'
  ),
  'admission-mark-entry': rp(
    () => import('../student/admissions/AdmissionMarkEntry'),
    'AdmissionMarkEntry'
  ),
  'admission-merit-setup': rp(
    () => import('../student/admissions/AdmissionMeritSetup'),
    'AdmissionMeritSetup'
  ),
  'alert-admissions': rp(
    () => import('../student/admissions/AlertAdmissions'),
    'AlertAdmissions'
  ),
  'admission-report': rp(
    () => import('../student/admissions/AdmissionReport'),
    'AdmissionReport'
  ),
  'admission-custom-search': rp(
    () => import('../student/admissions/AdmissionCustomSearch'),
    'AdmissionCustomSearch'
  ),
  'admission-audit-log': rp(
    () => import('../student/admissions/AdmissionAuditLog'),
    'AdmissionAuditLog'
  ),
  'student-readmission': rp(
    () => import('../student/admissions/StudentReadmission'),
    'StudentReadmission'
  ),
  'inquiry-reference-master': rp(
    () => import('../student/admissions/InquiryReferenceMaster'),
    'InquiryReferenceMaster'
  ),
  'admission-inquiry-setup': rp(
    () => import('../student/admissions/AdmissionInquirySetup'),
    'AdmissionInquirySetup'
  ),

  // Attendance
  'division-register': rp(
    () => import('../student/attendance/DivisionRegister'),
    'DivisionRegister'
  ),
  'attendance-summary': rp(
    () => import('../student/attendance/AttendanceSummary'),
    'AttendanceSummary'
  ),
  'attendance-defaulter-overview': rp(
    () => import('../student/attendance/AttendanceDefaulterOverview'),
    'AttendanceDefaulterOverview'
  ),
  'quick-present-entry': rp(
    () => import('../student/attendance/QuickPresentEntry'),
    'QuickPresentEntry'
  ),
  'attendance-register-combined': rp(
    () => import('../student/attendance/AttendanceRegisterCombined'),
    'AttendanceRegisterCombined'
  ),
  'monthly-register-generate': rp(
    () => import('../student/attendance/MonthlyRegisterGenerate'),
    'MonthlyRegisterGenerate'
  ),
  'student-attendance': rp(
    () => import('../student/attendance/StudentAttendance'),
    'StudentAttendance'
  ),
  'subjectwise-attendance': rp(
    () => import('../student/attendance/SubjectwiseAttendance'),
    'SubjectwiseAttendance'
  ),
  'manual-attendance-correction': rp(
    () => import('../student/attendance/ManualAttendanceCorrection'),
    'ManualAttendanceCorrection'
  ),
  'device-sync-biometric': rp(
    () => import('../student/attendance/DeviceSyncBiometric'),
    'DeviceSyncBiometric'
  ),
  'student-leave-request': rp(
    () => import('../student/attendance/StudentLeaveRequest'),
    'StudentLeaveRequest'
  ),
  'student-leave-listing': rp(
    () => import('../student/attendance/StudentLeaveListing'),
    'StudentLeaveListing'
  ),
  'attendance-follow-up': rp(
    () => import('../student/attendance/AttendanceFollowUp'),
    'AttendanceFollowUp'
  ),
  'student-register': rp(
    () => import('../student/attendance/StudentRegister'),
    'StudentRegister'
  ),
  'alert-attendance': rp(
    () => import('../student/attendance/AlertAttendance'),
    'AlertAttendance'
  ),
  'attendance-reports': rp(
    () => import('../student/attendance/AttendanceReports'),
    'AttendanceReports'
  ),
  'attendance-defaulter-list': rp(
    () => import('../student/attendance/AttendanceDefaulterList'),
    'AttendanceDefaulterList'
  ),
  'late-arrival-early-departure': rp(
    () => import('../student/attendance/LateArrivalEarlyDeparture'),
    'LateArrivalEarlyDeparture'
  ),
  'holiday-working-day-calendar': rp(
    () => import('../student/attendance/HolidayWorkingDayCalendar'),
    'HolidayWorkingDayCalendar'
  ),

  // Certificates
  'certificate-summary': rp(
    () => import('../student/certificates/CertificateSummary'),
    'CertificateSummary'
  ),
  'bonafide-combined': rp(
    () => import('../student/certificates/BonafideCombined'),
    'BonafideCombined'
  ),
  'first-trial-combined': rp(
    () => import('../student/certificates/FirstTrialCombined'),
    'FirstTrialCombined'
  ),
  'leaving-combined': rp(
    () => import('../student/certificates/LeavingCombined'),
    'LeavingCombined'
  ),
  'character-combined': rp(
    () => import('../student/certificates/CharacterCombined'),
    'CharacterCombined'
  ),
  transfer: rp(() => import('../student/certificates/Transfer'), 'Transfer'),
  'other-certificate': rp(
    () => import('../student/certificates/OtherCertificate'),
    'OtherCertificate'
  ),
  'print-template-student': rp(
    () => import('../student/certificates/PrintTemplateStudent'),
    'PrintTemplateStudent'
  ),
  'print-template': rp(
    () => import('../student/certificates/PrintTemplate'),
    'PrintTemplate'
  )
};
