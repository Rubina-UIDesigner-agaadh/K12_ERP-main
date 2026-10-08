import { rp } from './registryHelper';

/**
 * Routes owned by the Academic module: Academics, Curriculum, Timetable, and Event/Activities.
 * Keep page IDs aligned with the Academic sidebars in data/navigationData.ts.
 */
export const academicRegistry: Record<string, () => any> = {
  // Academics — planning and classroom operations
  'academic-planning-execution': rp(
    () => import('../academic/academics/AcademicPlanningExecution'),
    'AcademicPlanningExecution'
  ),
  'curriculum-progress-tracker': rp(
    () => import('../academic/academics/CurriculumProgressTracker'),
    'CurriculumProgressTracker'
  ),
  'skill-development-assessment': rp(
    () => import('../academic/academics/SkillDevelopmentAssessment'),
    'SkillDevelopmentAssessment'
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
  'academic-attendance': rp(
    () => import('../academic/academics/AcademicAttendance'),
    'AcademicAttendance'
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
  'room-resource-allocation': rp(
    () => import('../more/timetable/RoomResourceAllocation'),
    'RoomResourceAllocation'
  ),

  // Event/Activities — legacy routes retained alongside the new pages
  'event-management': rp(
    () => import('../academic/academics/event-activities/EventManagement.tsx'),
    'EventManagement'
  ),
  'smart-event-calendar': rp(
    () => import('../academic/academics/event-activities/SmartEventCalendar'),
    'SmartEventCalendar'
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
  'monthly-activity-calendar': rp(
    () => import('../academic/academics/event-activities/MonthlyActivityCalendar'),
    'MonthlyActivityCalendar'
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
  'conflict-detection': rp(
    () => import('../academic/academics/event-activities/ConflictDetection'),
    'ConflictDetection'
  ),
  'department-duty-allocation': rp(
    () => import('../academic/academics/event-activities/DepartmentDutyAllocation'),
    'DepartmentDutyAllocation'
  ),
  'event-participation-report': rp(
    () => import('../academic/academics/event-activities/EventParticipationReport'),
    'EventParticipationReport'
  ),
  'notifications-reminders': rp(
    () => import('../academic/academics/event-activities/NotificationsReminders'),
    'NotificationsReminders'
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
