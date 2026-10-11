import { rp } from './registryHelper';

/**
 * Routes owned by the Academic module: Academics, Curriculum, Timetable, and Event/Activities.
 * Keep page IDs aligned with the Academic sidebars in data/navigationData.ts.
 */
export const academicRegistry: Record<string, () => any> = {
  // Academics — planning and classroom operations
  'academic-planning-dashboard': rp(
    () => import('../academic/academics/AcademicPlanningDashboard'),
    'AcademicPlanningDashboard'
  ),
  'teaching-plan': rp(
    () => import('../academic/academics/TeachingPlan'),
    'TeachingPlan'
  ),
  'curriculum-master': rp(
    () => import('../academic/academics/CurriculumMaster'),
    'CurriculumMaster'
  ),
  'lesson-plan-creation': rp(
    () => import('../academic/academics/LessonPlanCreation'),
    'LessonPlanCreation'
  ),
  'lesson-plan-review': rp(
    () => import('../academic/academics/LessonPlanReview'),
    'LessonPlanReview'
  ),
  'syllabus-completion-tracker': rp(
    () => import('../academic/academics/SyllabusCompletionTracker'),
    'SyllabusCompletionTracker'
  ),
  'teaching-progress-dashboard': rp(
    () => import('../academic/academics/TeachingProgressDashboard'),
    'TeachingProgressDashboard'
  ),
  'question-bank': rp(
    () => import('../academic/academics/QuestionBank'),
    'QuestionBank'
  ),
  'curriculum-academic-reports': rp(
    () => import('../academic/academics/CurriculumReports'),
    'CurriculumReports'
  ),
  'learning-objectives-master': rp(
    () => import('../academic/academics/LearningObjectivesMaster'),
    'LearningObjectivesMaster'
  ),
  'textbook-resource-master': rp(
    () => import('../academic/academics/TextbookResourceMaster'),
    'TextbookResourceMaster'
  ),
  'academic-planning-execution': rp(
    () => import('../academic/academics/AcademicPlanningExecution'),
    'AcademicPlanningExecution'
  ),
  'curriculum-progress-tracker': rp(
    () => import('../academic/academics/CurriculumProgressTracker'),
    'CurriculumProgressTracker'
  ),
  'classroom-operations': rp(
    () => import('../academic/academics/ClassroomOperations'),
    'ClassroomOperations'
  ),
  'teacher-progress-dashboard': rp(
    () => import('../academic/academics/TeacherProgressDashboard'),
    'TeacherProgressDashboard'
  ),
  'homework-assignments': rp(
    () => import('../academic/academics/HomeworkAssignments'),
    'HomeworkAssignments'
  ),
  'study-material': rp(
    () => import('../academic/academics/StudyMaterial'),
    'StudyMaterial'
  ),
  classwork: rp(() => import('../academic/academics/Classwork'), 'Classwork'),
  'school-diary': rp(
    () => import('../academic/academics/SchoolDiary'),
    'SchoolDiary'
  ),

  // Timetable
  'timetable-setup': rp(
    () => import('../more/timetable/TimetableSetup'),
    'TimetableSetup'
  ),
  'class-timetable': rp(
    () => import('../more/timetable/ClassTimetable'),
    'ClassTimetable'
  ),
  'teacher-timetable': rp(
    () => import('../more/timetable/TeacherTimetable'),
    'TeacherTimetable'
  ),
  'substitution-management': rp(
    () => import('../more/timetable/SubstitutionManagement'),
    'SubstitutionManagement'
  ),

  // Event/Activities — legacy routes retained alongside the new pages
  'event-management': rp(
    () => import('../academic/academics/event-activities/EventManagement'),
    'EventManagement'
  ),
  'event-master': rp(
    () => import('../academic/academics/event-activities/EventMaster'),
    'EventMaster'
  ),
  'event-planning-schedule': rp(
    () => import('../academic/academics/event-activities/EventPlanningSchedule'),
    'EventPlanningSchedule'
  ),
  'event-execution': rp(
    () => import('../academic/academics/event-activities/EventExecution'),
    'EventExecution'
  ),
  'event-feedback-review': rp(
    () => import('../academic/academics/event-activities/EventFeedbackReview'),
    'EventFeedbackReview'
  ),
  'teacher-activity-master': rp(
    () => import('../academic/academics/event-activities/TeacherActivityMaster'),
    'TeacherActivityMaster'
  ),
  'professional-development': rp(
    () => import('../academic/academics/event-activities/ProfessionalDevelopment'),
    'ProfessionalDevelopment'
  ),
  'teacher-achievements': rp(
    () => import('../academic/academics/event-activities/TeacherAchievements'),
    'TeacherAchievements'
  ),
  'duty-master': rp(
    () => import('../academic/academics/event-activities/DutyMaster'),
    'DutyMaster'
  ),
  'duty-roster': rp(
    () => import('../academic/academics/event-activities/DutyRoster'),
    'DutyRoster'
  ),
  'duty-attendance': rp(
    () => import('../academic/academics/event-activities/DutyAttendance'),
    'DutyAttendance'
  ),
  'reports-analytics': rp(
    () => import('../academic/academics/event-activities/ReportsAnalytics'),
    'ReportsAnalytics'
  ),
  'media-gallery-management': rp(
    () => import('../academic/academics/event-activities/MediaGalleryManagement'),
    'MediaGalleryManagement'
  ),
  'competition-management': rp(
    () => import('../academic/academics/event-activities/CompetitionManagement'),
    'CompetitionManagement'
  ),
  'competition-master': rp(
    () => import('../academic/academics/event-activities/CompetitionMaster'),
    'CompetitionMaster'
  ),
  'competition-events': rp(
    () => import('../academic/academics/event-activities/CompetitionEvents'),
    'CompetitionEvents'
  ),
  'competition-student-participation': rp(
    () => import('../academic/academics/event-activities/StudentParticipation'),
    'StudentParticipation'
  ),
  'competition-results-achievements': rp(
    () => import('../academic/academics/event-activities/ResultsAchievements'),
    'ResultsAchievements'
  ),
  'clubs-activities': rp(
    () => import('../academic/academics/event-activities/ClubsActivities'),
    'ClubsActivities'
  ),
  'activity-attendance-evaluation': rp(
    () => import('../academic/academics/event-activities/ActivityAttendanceEvaluation'),
    'ActivityAttendanceEvaluation'
  ),
  'planner-dashboard': rp(
    () => import('../academic/academics/event-activities/PlannerDashboard'),
    'PlannerDashboard'
  ),
  'activity-management': rp(
    () => import('../academic/academics/event-activities/ActivityManagement'),
    'ActivityManagement'
  ),
  'activity-calendar': rp(
    () => import('../academic/academics/event-activities/ActivityCalendar'),
    'ActivityCalendar'
  ),
  'activity-types-settings': rp(
    () => import('../academic/academics/event-activities/ActivityTypesSettings'),
    'ActivityTypesSettings'
  ),
  'recurring-activities': rp(
    () => import('../academic/academics/event-activities/RecurringActivities'),
    'RecurringActivities'
  ),
  'bulk-planning': rp(
    () => import('../academic/academics/event-activities/BulkPlanning'),
    'BulkPlanning'
  ),
  'department-duty-allocation': rp(
    () => import('../academic/academics/event-activities/DepartmentDutyAllocation'),
    'DepartmentDutyAllocation'
  ),
  'event-participation-report': rp(
    () => import('../academic/academics/event-activities/EventParticipationReport'),
    'EventParticipationReport'
  ),
  'teacher-duty-report': rp(
    () => import('../academic/academics/event-activities/TeacherDutyReport'),
    'TeacherDutyReport'
  ),
  'teacher-schedule-view': rp(
    () => import('../academic/academics/event-activities/TeacherScheduleView'),
    'TeacherScheduleView'
  ),
  'teacher-workload-view': rp(
    () => import('../academic/academics/event-activities/TeacherWorkloadView'),
    'TeacherWorkloadView'
  )
};
