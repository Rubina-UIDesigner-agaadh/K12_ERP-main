import { rp } from './registryHelper';

export const assessmentRegistry: Record<string, () => any> = {
    // General
    'view-result': rp(
        () => import('../assessment/general/ViewResult'),
        'ViewResult'
    ),
    'exam-master': rp(
        () => import('../assessment/general/ExamMaster'),
        'ExamMaster'
    ),
    'student-optional-subject': rp(
        () => import('../assessment/general/StudentOptionalSubject'),
        'StudentOptionalSubject'
    ),
    'mark-entry-single-subject': rp(
        () => import('../assessment/general/MarkEntrySingleSubject'),
        'MarkEntrySingleSubject'
    ),
    'mark-entry-all-subject': rp(
        () => import('../assessment/general/MarkEntryAllSubject'),
        'MarkEntryAllSubject'
    ),
    'mark-entry-status-verify': rp(
        () => import('../assessment/general/MarkEntryStatusVerify'),
        'MarkEntryStatusVerify'
    ),
    'student-result-remark': rp(
        () => import('../assessment/general/StudentResultRemark'),
        'StudentResultRemark'
    ),
    'generate-result': rp(
        () => import('../assessment/general/GenerateResult'),
        'GenerateResult'
    ),
    'assessment-alert': rp(
        () => import('../assessment/general/AssessmentAlert'),
        'AssessmentAlert'
    ),
    'exam-report': rp(
        () => import('../assessment/general/ExamReport'),
        'ExamReport'
    ),
    'result-sheet-report': rp(
        () => import('../assessment/general/ResultSheetReport'),
        'ResultSheetReport'
    ),
    'progress-card-report': rp(
        () => import('../assessment/general/ProgressCardReport'),
        'ProgressCardReport'
    ),
    'result-analysis-report': rp(
        () => import('../assessment/general/ResultAnalysisReport'),
        'ResultAnalysisReport'
    ),
    'report-card-designer': rp(
        () => import('../assessment/general/ReportCardDesigner'),
        'ReportCardDesigner'
    ),
    'exam-hall-management': rp(
        () => import('../assessment/general/ExamHallManagement'),
        'ExamHallManagement'
    ),
    'invigilation-schedule': rp(
        () => import('../assessment/general/InvigilationSchedule'),
        'InvigilationSchedule'
    ),
    'disciplinary-log': rp(
        () => import('../assessment/general/DisciplinaryLog'),
        'DisciplinaryLog'
    ),
    'grace-mark-management': rp(
        () => import('../assessment/general/GraceMarkManagement'),
        'GraceMarkManagement'
    ),
    'hall-ticket-generator': rp(
        () => import('../assessment/general/HallTicketGenerator'),
        'HallTicketGenerator'
    ),

    // Preschool
    'preschool-exam-master': rp(
        () => import('../assessment/general/PreschoolExamMaster'),
        'PreschoolExamMaster'
    ),
    'preschool-skill-milestone-master': rp(
        () => import('../assessment/general/PreschoolSkillMilestoneMaster'),
        'PreschoolSkillMilestoneMaster'
    ),
    'preschool-grade-scale-config': rp(
        () => import('../assessment/general/PreschoolGradeScaleConfig'),
        'PreschoolGradeScaleConfig'
    ),
    'preschool-observation-entry': rp(
        () => import('../assessment/general/PreschoolObservationEntry'),
        'PreschoolObservationEntry'
    ),
    'preschool-bulk-skill-entry': rp(
        () => import('../assessment/general/PreschoolBulkSkillEntry'),
        'PreschoolBulkSkillEntry'
    ),
    'preschool-report-card-generator': rp(
        () => import('../assessment/general/PreschoolReportCardGenerator'),
        'PreschoolReportCardGenerator'
    ),
    'preschool-development-progress-tracker': rp(
        () => import('../assessment/general/PreschoolDevelopmentProgressTracker'),
        'PreschoolDevelopmentProgressTracker'
    ),
    'gseb-performance-analysis': rp(
        () => import('../assessment/general/PreschoolResultLockApproval'),
        'PreschoolResultLockApproval'
    ),
    're-exam-student-management': rp(
        () => import('../assessment/general/ReExamStudentManagement'),
        'ReExamStudentManagement'
    ),
    'exam-timetable-generation': rp(
        () => import('../assessment/general/ExamTimetableGeneration'),
        'ExamTimetableGeneration'
    ),

    // Activity Based
    'activity-type-master': rp(
        () => import('../assessment/activity-based/ActivityTypeMaster'),
        'ActivityTypeMaster'
    ),
    'activity-rubric-master': rp(
        () => import('../assessment/activity-based/ActivityRubricMaster'),
        'ActivityRubricMaster'
    ),
    'activity-assessment-setup': rp(
        () => import('../assessment/activity-based/ActivityAssessmentSetup'),
        'ActivityAssessmentSetup'
    ),
    'activity-mark-grade-entry': rp(
        () => import('../assessment/activity-based/ActivityMarkGradeEntry'),
        'ActivityMarkGradeEntry'
    ),
    'activity-portfolio-record': rp(
        () => import('../assessment/activity-based/ActivityPortfolioRecord'),
        'ActivityPortfolioRecord'
    ),
    'activity-result-view': rp(
        () => import('../assessment/activity-based/ActivityResultView'),
        'ActivityResultView'
    ),
    'activity-student-profile': rp(
        () => import('../assessment/activity-based/ActivityStudentProfile'),
        'ActivityStudentProfile'
    ),
    'activity-report-card-section': rp(
        () => import('../assessment/activity-based/ActivityReportCardSection'),
        'ActivityReportCardSection'
    ),
    'activity-performance-analysis': rp(
        () => import('../assessment/activity-based/ActivityPerformanceAnalysis'),
        'ActivityPerformanceAnalysis'
    ),

    // GSEB
    'gseb-exam-master': rp(
        () => import('../assessment/gseb/GsebExamMaster'),
        'GsebExamMaster'
    ),
    'gseb-grade-calculation-setup': rp(
        () => import('../assessment/gseb/GsebGradeCalculationSetup'),
        'GsebGradeCalculationSetup'
    ),
    'gseb-mark-entry': rp(
        () => import('../assessment/gseb/GsebMarkEntry'),
        'GsebMarkEntry'
    ),
    'gseb-internal-assessment-entry': rp(
        () => import('../assessment/gseb/GsebInternalAssessmentEntry'),
        'GsebInternalAssessmentEntry'
    ),
    'gseb-practical-mark-entry': rp(
        () => import('../assessment/gseb/GsebPracticalMarkEntry'),
        'GsebPracticalMarkEntry'
    ),
    'gseb-result-generation': rp(
        () => import('../assessment/gseb/GsebResultGeneration'),
        'GsebResultGeneration'
    ),
    'gseb-mark-sheet-report': rp(
        () => import('../assessment/gseb/GsebMarkSheetReport'),
        'GsebMarkSheetReport'
    ),
    'gseb-board-submission-export': rp(
        () => import('../assessment/gseb/GsebBoardSubmissionExport'),
        'GsebBoardSubmissionExport'
    ),

    // CBSE
    'cbse-exam-structure-setup': rp(
        () => import('../assessment/cbse/CbseExamStructureSetup'),
        'CbseExamStructureSetup'
    ),
    'cbse-grade-calculation-setup': rp(
        () => import('../assessment/cbse/CbseGradeCalculationSetup'),
        'CbseGradeCalculationSetup'
    ),
    'cbse-theory-mark-entry': rp(
        () => import('../assessment/cbse/CbseTheoryMarkEntry'),
        'CbseTheoryMarkEntry'
    ),
    'cbse-practical-mark-entry': rp(
        () => import('../assessment/cbse/CbsePracticalMarkEntry'),
        'CbsePracticalMarkEntry'
    ),
    'cbse-internal-assessment-entry': rp(
        () => import('../assessment/cbse/CbseInternalAssessmentEntry'),
        'CbseInternalAssessmentEntry'
    ),
    'cbse-project-activity-mark-entry': rp(
        () => import('../assessment/cbse/CbseProjectActivityMarkEntry'),
        'CbseProjectActivityMarkEntry'
    ),
    'cbse-result-generation': rp(
        () => import('../assessment/cbse/CbseResultGeneration'),
        'CbseResultGeneration'
    ),
    'cbse-report-card': rp(
        () => import('../assessment/cbse/CbseReportCard'),
        'CbseReportCard'
    ),
    'cbse-board-submission-export': rp(
        () => import('../assessment/cbse/CbseBoardSubmissionExport'),
        'CbseBoardSubmissionExport'
    ),

    // CISCE
    'cisce-exam-structure-setup': rp(
        () => import('../assessment/cisce/CisceExamStructureSetup'),
        'CisceExamStructureSetup'
    ),
    'cisce-grade-calculation-setup': rp(
        () => import('../assessment/cisce/CisceGradeCalculationSetup'),
        'CisceGradeCalculationSetup'
    ),
    'cisce-theory-mark-entry': rp(
        () => import('../assessment/cisce/CisceTheoryMarkEntry'),
        'CisceTheoryMarkEntry'
    ),
    'cisce-practical-mark-entry': rp(
        () => import('../assessment/cisce/CiscePracticalMarkEntry'),
        'CiscePracticalMarkEntry'
    ),
    'cisce-internal-assessment-entry': rp(
        () => import('../assessment/cisce/CisceInternalAssessmentEntry'),
        'CisceInternalAssessmentEntry'
    ),
    'cisce-project-activity-mark-entry': rp(
        () => import('../assessment/cisce/CisceProjectActivityMarkEntry'),
        'CisceProjectActivityMarkEntry'
    ),
    'cisce-result-generation': rp(
        () => import('../assessment/cisce/CisceResultGeneration'),
        'CisceResultGeneration'
    ),
    'cisce-report-card': rp(
        () => import('../assessment/cisce/CisceReportCard'),
        'CisceReportCard'
    ),
    'cisce-board-submission-export': rp(
        () => import('../assessment/cisce/CisceBoardSubmissionExport'),
        'CisceBoardSubmissionExport'
    ),

    // CCE
    'cce-indicator-master': rp(
        () => import('../assessment/cce/CceIndicatorMaster'),
        'CceIndicatorMaster'
    ),
    'cce-subject-mapping': rp(
        () => import('../assessment/cce/CceSubjectMapping'),
        'CceSubjectMapping'
    ),
    'cce-evaluation-setup': rp(
        () => import('../assessment/cce/CceEvaluationSetup'),
        'CceEvaluationSetup'
    ),
    'cce-skill-mark-entry': rp(
        () => import('../assessment/cce/CceSkillEvaluationMarkEntry'),
        'CceSkillEvaluationMarkEntry'
    ),
    'cce-grade-scale-setup': rp(
        () => import('../assessment/cce/CceGradeScaleSetup'),
        'CceGradeScaleSetup'
    ),
    'cce-term-summary': rp(
        () => import('../assessment/cce/CceTermSummary'),
        'CceTermSummary'
    ),
    'cce-progress-card': rp(
        () => import('../assessment/cce/CceProgressCardReport'),
        'CceProgressCardReport'
    ),

    // Result Card Management
    'rc-student-result-preview': rp(
        () => import('../assessment/result-card/StudentResultCardPreview'),
        'StudentResultCardPreview'
    ),
    'rc-reexam-result-preview': rp(
        () => import('../assessment/result-card/ReExamResultCardPreview'),
        'ReExamResultCardPreview'
    ),
    'rc-bulk-print': rp(
        () => import('../assessment/result-card/BulkPrintResultCards'),
        'BulkPrintResultCards'
    ),
    'rc-single-print': rp(
        () => import('../assessment/result-card/SingleStudentPrint'),
        'SingleStudentPrint'
    ),
    'rc-collection-entry': rp(
        () => import('../assessment/result-card/ReportCardCollectionEntry'),
        'ReportCardCollectionEntry'
    ),
    'rc-bulk-collection-update': rp(
        () => import('../assessment/result-card/BulkCollectionUpdate'),
        'BulkCollectionUpdate'
    ),
    'rc-pending-list': rp(
        () => import('../assessment/result-card/NotCollectedPendingList'),
        'NotCollectedPendingList'
    ),
    'rc-audit-trail': rp(
        () => import('../assessment/result-card/AuditTrail'),
        'AuditTrail'
    ),
    'rc-distribution-report': rp(
        () => import('../assessment/result-card/ResultDistributionReport'),
        'ResultDistributionReport'
    )
};