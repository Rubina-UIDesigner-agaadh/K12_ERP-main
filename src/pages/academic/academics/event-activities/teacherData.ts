export const TEACHER_ACTIVITY_TYPES_STORAGE_KEY = 'k12-teacher-activity-types-v1';
export const PROFESSIONAL_DEVELOPMENT_STORAGE_KEY = 'k12-professional-development-v1';
export const TEACHER_ACHIEVEMENTS_STORAGE_KEY = 'k12-teacher-achievements-v1';
export const DUTY_TYPES_STORAGE_KEY = 'k12-teacher-duty-types-v1';
export const DUTY_ASSIGNMENTS_STORAGE_KEY = 'k12-teacher-duty-assignments-v1';
export const DUTY_ATTENDANCE_STORAGE_KEY = 'k12-teacher-duty-attendance-v1';
export const DUTY_MONTH_SUMMARY_STORAGE_KEY = 'k12-teacher-duty-month-summary-v1';

export const ACTIVE_ACADEMIC_YEAR = '2025-26';
export type ActiveRecordStatus = 'Active' | 'Inactive';

export interface TeacherStaffRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
}

export const TEACHER_STAFF: TeacherStaffRecord[] = [
  { id: 't-rk', name: 'Mr. R. Kumar', designation: 'PGT Physics', department: 'Science' },
  { id: 't-sj', name: 'Mrs. S. Joshi', designation: 'PGT Chemistry', department: 'Science' },
  { id: 't-pr', name: 'Ms. P. Roy', designation: 'TGT Science', department: 'Science' },
  { id: 't-as', name: 'Mr. A. Sharma', designation: 'Principal', department: 'Administration' },
  { id: 't-vp', name: 'Mr. V. Patel', designation: 'PGT Mathematics', department: 'Mathematics' },
  { id: 't-ks', name: 'Mrs. K. Singh', designation: 'PGT Mathematics', department: 'Mathematics' },
  { id: 't-mv', name: 'Ms. M. Verma', designation: 'Art Teacher', department: 'Arts' },
  { id: 't-pg', name: 'Mrs. P. Gupta', designation: 'TGT English', department: 'Languages' },
  { id: 't-hn', name: 'Mr. H. Nair', designation: 'PGT Computer Science', department: 'Technology' },
  { id: 't-jk', name: 'Mr. J. Khan', designation: 'TGT Social Science', department: 'Social Science' },
  { id: 't-rn', name: 'Ms. R. Nair', designation: 'TGT English', department: 'Languages' },
  { id: 't-dj', name: 'Mr. D. Joshi', designation: 'PET', department: 'Sports' }
];

export interface TeacherActivityTypeRecord {
  id: string;
  name: string;
  icon: string;
  category: string;
  creditValue: number;
  creditBasis: string;
  status: ActiveRecordStatus;
  description: string;
}

const activityType = (id: string, name: string, icon: string, category: string, creditValue: number, creditBasis: string): TeacherActivityTypeRecord => ({
  id, name, icon, category, creditValue, creditBasis, status: 'Active', description: ''
});

export const DEFAULT_TEACHER_ACTIVITY_TYPES: TeacherActivityTypeRecord[] = [
  activityType('tat-001', 'Workshop / Seminar', '📚', 'Training', 2, 'points/day'),
  activityType('tat-002', 'FDP (Faculty Development Program)', '🎓', 'Training', 5, 'points per FDP'),
  activityType('tat-003', 'Online Certification', '💻', 'Self-learning', 3, 'points each'),
  activityType('tat-004', 'Research Paper Published', '📖', 'Academic', 10, 'points each'),
  activityType('tat-005', 'Conference / Congress', '🗣️', 'Academic', 5, 'points each'),
  activityType('tat-006', 'Resource Person / Speaker', '🏫', 'Recognition', 5, 'points each'),
  activityType('tat-007', 'Award / Felicitation', '🏆', 'Achievement', 15, 'points each'),
  activityType('tat-008', 'Curriculum Development', '📋', 'Academic', 8, 'points each'),
  activityType('tat-009', 'Mentorship / Coaching', '👥', 'Leadership', 3, 'points/month'),
  activityType('tat-010', 'Community Service', '🤝', 'Social', 2, 'points/activity'),
  activityType('tat-011', 'Book / Content Published', '📝', 'Academic', 12, 'points each'),
  activityType('tat-012', 'Co-curricular Contribution', '🎨', 'School Service', 2, 'points/event'),
  activityType('tat-013', 'CBSE Training', '🏅', 'Training', 4, 'points each'),
  activityType('tat-014', 'International Program', '🌐', 'Training', 10, 'points each'),
  activityType('tat-015', 'Innovation / Project', '💡', 'Academic', 8, 'points each')
];

export interface ProfessionalDevelopmentRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  designation: string;
  department: string;
  academicYear: string;
  activityTypeId: string;
  activityTypeName: string;
  activityName: string;
  organizedBy: string;
  description: string;
  subjectArea: string;
  level: 'School' | 'District' | 'State' | 'National' | 'International';
  mode: 'Offline' | 'Online' | 'Hybrid';
  startDate: string;
  endDate: string;
  durationDays: number;
  durationHours: number;
  workingDaysUsed: number;
  leaveApplied: boolean;
  leaveRef: string;
  venue: string;
  city: string;
  travelRequired: boolean;
  travelExpenses: number | null;
  certificateReceived: boolean;
  certificateFile: string;
  certificateNumber: string;
  certificateIssuedBy: string;
  keyLearnings: string;
  applicationPlan: string;
  creditPoints: number;
  workshopMaterials: string;
  permissionLetter: string;
  photos: string;
  managementReport: string;
  hodVerified: boolean;
  principalStatus: 'Pending' | 'Approved' | 'Rejected';
  showOnTeacherProfile: boolean;
  includeAnnualReport: boolean;
  showOnWebsite: boolean;
  showOnParentPortal: boolean;
  verificationStatus: 'Draft' | 'Submitted' | 'Verified' | 'Rejected';
}

export interface TeacherAchievementRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  achievement: string;
  category: string;
  awardedBy: string;
  date: string;
  level: string;
  description: string;
  points: number;
  certificateFile: string;
  evidenceFile: string;
  verified: boolean;
  showOnProfile: boolean;
  includeAnnualReport: boolean;
}

export const DEFAULT_PROFESSIONAL_DEVELOPMENT: ProfessionalDevelopmentRecord[] = [
  { id: 'pd-001', teacherId: 't-rk', teacherName: 'Mr. R. Kumar', designation: 'PGT Physics', department: 'Science', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-001', activityTypeName: 'Workshop / Seminar', activityName: 'NEP 2020 Implementation WS', organizedBy: 'CBSE Regional Centre, Pune', description: 'Two-day workshop on implementing NEP 2020 in classroom practice.', subjectArea: 'Education Policy / Teaching Methodology', level: 'District', mode: 'Offline', startDate: '2025-11-25', endDate: '2025-11-26', durationDays: 2, durationHours: 16, workingDaysUsed: 2, leaveApplied: true, leaveRef: 'LEAVE-2025-0234', venue: 'CBSE Regional Centre, Ganeshkhind', city: 'Pune', travelRequired: true, travelExpenses: 0, certificateReceived: true, certificateFile: 'CBSE_Workshop_Certificate_Nov2025.pdf', certificateNumber: 'CBSE/WS/2025/NOV/XXXXX', certificateIssuedBy: 'CBSE Regional Office, Pune', keyLearnings: 'NEP 2020 focuses on competency-based learning, activity-based assessments, and mother tongue instruction. Practical strategies for classroom implementation.', applicationPlan: 'Will redesign classroom activities and incorporate more project-based learning in Physics teaching.', creditPoints: 4, workshopMaterials: 'NEP-workshop-material.pdf', permissionLetter: 'permission-letter.pdf', photos: '', managementReport: 'Shared classroom application plan with Science HOD.', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-002', teacherId: 't-sj', teacherName: 'Mrs. S. Joshi', designation: 'PGT Chemistry', department: 'Science', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-003', activityTypeName: 'Online Certification', activityName: 'Digital Tools Certification', organizedBy: 'National Digital Learning Platform', description: 'Online certification in digital learning tools.', subjectArea: 'Digital Teaching', level: 'National', mode: 'Online', startDate: '2025-11-20', endDate: '2025-11-20', durationDays: 1, durationHours: 8, workingDaysUsed: 0, leaveApplied: false, leaveRef: '', venue: 'Online', city: '', travelRequired: false, travelExpenses: null, certificateReceived: true, certificateFile: 'digital-tools-certificate.pdf', certificateNumber: 'NDL-2025-771', certificateIssuedBy: 'National Digital Learning Platform', keyLearnings: 'Using interactive assessments and learning dashboards.', applicationPlan: 'Use digital quizzes for Chemistry revision.', creditPoints: 3, workshopMaterials: '', permissionLetter: '', photos: '', managementReport: '', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-003', teacherId: 't-pr', teacherName: 'Ms. P. Roy', designation: 'TGT Science', department: 'Science', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-005', activityTypeName: 'Conference / Congress', activityName: 'Inter-School Teachers Congress', organizedBy: 'District Education Office', description: 'Annual inter-school teaching and learning conference.', subjectArea: 'Science Education', level: 'District', mode: 'Offline', startDate: '2025-11-18', endDate: '2025-11-18', durationDays: 1, durationHours: 8, workingDaysUsed: 1, leaveApplied: false, leaveRef: '', venue: 'District Conference Hall', city: 'Pune', travelRequired: false, travelExpenses: null, certificateReceived: true, certificateFile: 'teachers-congress.pdf', certificateNumber: 'DEC-2025-91', certificateIssuedBy: 'District Education Office', keyLearnings: 'Peer approaches to inquiry-based science teaching.', applicationPlan: 'Introduce collaborative experiments in Class 8.', creditPoints: 5, workshopMaterials: '', permissionLetter: '', photos: 'conference-photo.jpg', managementReport: '', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-004', teacherId: 't-as', teacherName: 'Mr. A. Sharma', designation: 'Principal', department: 'Administration', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-007', activityTypeName: 'Award / Felicitation', activityName: 'Best Teacher Award', organizedBy: 'District Education Office', description: 'District-level recognition for teaching leadership.', subjectArea: 'School Leadership', level: 'District', mode: 'Offline', startDate: '2025-11-15', endDate: '2025-11-15', durationDays: 1, durationHours: 3, workingDaysUsed: 0, leaveApplied: false, leaveRef: '', venue: 'District Auditorium', city: 'Pune', travelRequired: false, travelExpenses: null, certificateReceived: true, certificateFile: 'best-teacher-award.pdf', certificateNumber: 'DEO-AWARD-2025-115', certificateIssuedBy: 'District Education Office', keyLearnings: 'Recognition for mentoring staff and improving classroom practice.', applicationPlan: 'Continue peer coaching and school-wide lesson-study.', creditPoints: 15, workshopMaterials: '', permissionLetter: '', photos: 'award-ceremony.jpg', managementReport: 'Award reported to the school management.', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: true, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-005', teacherId: 't-vp', teacherName: 'Mr. V. Patel', designation: 'PGT Mathematics', department: 'Mathematics', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-013', activityTypeName: 'CBSE Training', activityName: 'CBSE Training — Math', organizedBy: 'CBSE Centre of Excellence', description: 'Mathematics pedagogy and competency-based assessment training.', subjectArea: 'Mathematics', level: 'National', mode: 'Hybrid', startDate: '2025-11-10', endDate: '2025-11-10', durationDays: 1, durationHours: 7, workingDaysUsed: 1, leaveApplied: false, leaveRef: '', venue: 'CBSE Centre of Excellence', city: 'Pune', travelRequired: false, travelExpenses: null, certificateReceived: true, certificateFile: 'cbse-math-training.pdf', certificateNumber: 'CBSE-MATH-2025-88', certificateIssuedBy: 'CBSE Centre of Excellence', keyLearnings: 'Formative assessment and competency-based mathematics tasks.', applicationPlan: 'Use application-based problem sets in Class 9.', creditPoints: 4, workshopMaterials: '', permissionLetter: '', photos: '', managementReport: '', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-006', teacherId: 't-sj', teacherName: 'Mrs. S. Joshi', designation: 'PGT Chemistry', department: 'Science', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-004', activityTypeName: 'Research Paper Published', activityName: 'Research Paper — Science Education', organizedBy: 'National Journal of Science Education', description: 'Peer-reviewed research paper on laboratory learning.', subjectArea: 'Chemistry Education', level: 'National', mode: 'Online', startDate: '2025-11-05', endDate: '2025-11-05', durationDays: 1, durationHours: 0, workingDaysUsed: 0, leaveApplied: false, leaveRef: '', venue: 'Online', city: '', travelRequired: false, travelExpenses: null, certificateReceived: false, certificateFile: '', certificateNumber: '', certificateIssuedBy: '', keyLearnings: 'Published findings on inquiry-based laboratory tasks.', applicationPlan: 'Share the research approach with the Science Department.', creditPoints: 10, workshopMaterials: '', permissionLetter: '', photos: '', managementReport: '', hodVerified: true, principalStatus: 'Approved', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: true, showOnParentPortal: false, verificationStatus: 'Verified' },
  { id: 'pd-007', teacherId: 't-mv', teacherName: 'Ms. M. Verma', designation: 'Art Teacher', department: 'Arts', academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: 'tat-002', activityTypeName: 'FDP (Faculty Development Program)', activityName: 'Art Workshop — 5 days', organizedBy: 'State Institute of Education', description: 'Five-day faculty development program in visual arts and classroom integration.', subjectArea: 'Arts Education', level: 'State', mode: 'Offline', startDate: '2025-11-01', endDate: '2025-11-05', durationDays: 5, durationHours: 40, workingDaysUsed: 5, leaveApplied: true, leaveRef: 'LEAVE-2025-0195', venue: 'State Institute of Education', city: 'Pune', travelRequired: true, travelExpenses: 1200, certificateReceived: true, certificateFile: 'arts-fdp-certificate.pdf', certificateNumber: 'SIE-FDP-2025-508', certificateIssuedBy: 'State Institute of Education', keyLearnings: 'Integrating visual thinking, local materials and inclusive art practice.', applicationPlan: 'Run cross-curricular art projects with Classes 6–8.', creditPoints: 5, workshopMaterials: 'arts-fdp-notes.pdf', permissionLetter: 'permission-fdp.pdf', photos: '', managementReport: '', hodVerified: true, principalStatus: 'Pending', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Submitted' }
];

export const DEFAULT_TEACHER_ACHIEVEMENTS: TeacherAchievementRecord[] = [
  { id: 'ach-001', teacherId: 't-as', teacherName: 'Mr. A. Sharma', achievement: 'Best Teacher Award', category: 'Award', awardedBy: 'District Ed.', date: '2025-11-15', level: 'District', description: 'Recognition for outstanding teaching and school leadership.', points: 15, certificateFile: 'best-teacher-award.pdf', evidenceFile: 'award-ceremony.jpg', verified: true, showOnProfile: true, includeAnnualReport: true },
  { id: 'ach-002', teacherId: 't-sj', teacherName: 'Mrs. S. Joshi', achievement: 'Research Paper — Chemistry', category: 'Publication', awardedBy: 'National Journal', date: '2025-11-05', level: 'National', description: 'Peer-reviewed Chemistry education research paper.', points: 10, certificateFile: 'journal-acceptance.pdf', evidenceFile: 'paper.pdf', verified: true, showOnProfile: true, includeAnnualReport: true },
  { id: 'ach-003', teacherId: 't-vp', teacherName: 'Mr. V. Patel', achievement: 'Resource Person — State Conference', category: 'Recognition', awardedBy: 'State Govt.', date: '2025-10-20', level: 'State', description: 'Invited as resource person for a state-level mathematics conference.', points: 5, certificateFile: 'speaker-certificate.pdf', evidenceFile: '', verified: true, showOnProfile: true, includeAnnualReport: true },
  { id: 'ach-004', teacherId: 't-pr', teacherName: 'Ms. P. Roy', achievement: 'Innovative Teaching Practice', category: 'Innovation', awardedBy: 'CBSE', date: '2025-09-05', level: 'National', description: 'Recognition for an innovative inquiry-based classroom practice.', points: 8, certificateFile: 'cbse-innovation.pdf', evidenceFile: 'practice-summary.pdf', verified: true, showOnProfile: true, includeAnnualReport: true },
  { id: 'ach-005', teacherId: 't-hn', teacherName: 'Mr. H. Nair', achievement: 'Content Creator — NCERT', category: 'Publication', awardedBy: 'NCERT', date: '2025-08-15', level: 'National', description: 'Contributed digital learning material for school students.', points: 12, certificateFile: 'ncert-contributor.pdf', evidenceFile: 'content-sample.pdf', verified: true, showOnProfile: true, includeAnnualReport: true }
];

export interface DutyTypeRecord {
  id: string;
  name: string;
  code: string;
  icon: string;
  category: string;
  description: string;
  frequency: string;
  startTime: string;
  endTime: string;
  defaultLocation: string;
  advanceNoticeDays: number;
  teachersPerDuty: number;
  eligibleAllTeachingStaff: boolean;
  specificDesignation: string;
  rotationMethod: 'Automatic rotation' | 'Manual assignment';
  canBeSwapped: boolean;
  canBeExcused: boolean;
  minimumGapDays: number;
  responsibilities: string[];
  requiredAttire: string;
  reportingTo: string;
  actionOnAbsence: string;
  trackAttendance: boolean;
  attendanceMethod: 'Supervisor' | 'Teacher self-mark' | 'Biometric';
  affectPayroll: boolean;
  affectAppraisal: boolean;
  status: ActiveRecordStatus;
}

const dutyType = (id: string, name: string, icon: string, category: string, frequency: string, startTime = '07:00 AM', endTime = '08:00 AM', defaultLocation = 'School Campus'): DutyTypeRecord => ({
  id, name, code: `DUTY-${name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`, icon, category,
  description: '', frequency, startTime, endTime, defaultLocation, advanceNoticeDays: 1, teachersPerDuty: 1,
  eligibleAllTeachingStaff: true, specificDesignation: '', rotationMethod: 'Automatic rotation', canBeSwapped: true,
  canBeExcused: true, minimumGapDays: 2, responsibilities: [], requiredAttire: 'Formal school uniform', reportingTo: 'Vice Principal on duty',
  actionOnAbsence: 'Log as duty absent — impacts appraisal', trackAttendance: true, attendanceMethod: 'Supervisor',
  affectPayroll: false, affectAppraisal: true, status: 'Active'
});

export const DEFAULT_DUTY_TYPES: DutyTypeRecord[] = [
  { ...dutyType('duty-001', 'Gate Duty (Morning)', '🚪', 'Campus Safety', 'Daily', '07:00 AM', '08:15 AM', 'Main Gate (Campus Entrance)'), teachersPerDuty: 2, responsibilities: ['Be present at main gate by 7:00 AM', 'Check student ID cards', 'Ensure orderly entry — no running or pushing', 'Note late arrivals in the late register', 'Report incidents to the Principal immediately', 'Remain until 8:15 AM'] },
  dutyType('duty-002', 'Gate Duty (Afternoon)', '🚪', 'Campus Safety', 'Daily', '02:30 PM', '03:30 PM', 'Main Gate'),
  dutyType('duty-003', 'Assembly Duty', '📋', 'Academic', 'Daily', '07:30 AM', '07:50 AM', 'Assembly Ground'),
  dutyType('duty-004', 'Library Supervision', '📚', 'Academic', 'Daily', '01:00 PM', '02:30 PM', 'Library'),
  dutyType('duty-005', 'Lunch / Canteen Supervision', '🍽️', 'Campus Safety', 'Daily', '12:30 PM', '01:00 PM', 'Canteen'),
  dutyType('duty-006', 'Bus Duty (Morning)', '🚌', 'Transport', 'Daily', '07:00 AM', '08:00 AM', 'Bus Bay'),
  dutyType('duty-007', 'Bus Duty (Afternoon)', '🚌', 'Transport', 'Daily', '02:30 PM', '03:30 PM', 'Bus Bay'),
  dutyType('duty-008', 'Exam Invigilation', '📝', 'Examination', 'Per Exam', '09:00 AM', '12:00 PM', 'Examination Hall'),
  dutyType('duty-009', 'Exam Hall Management', '📋', 'Examination', 'Per Exam', '08:30 AM', '12:30 PM', 'Examination Hall'),
  dutyType('duty-010', 'Relief / Substitute Duty', '🔔', 'Academic', 'As Needed', 'As scheduled', 'As scheduled', 'Assigned classroom'),
  dutyType('duty-011', 'Sports Ground Supervision', '🏃', 'Sports', 'Daily', '03:00 PM', '04:00 PM', 'Sports Ground'),
  dutyType('duty-012', 'Event Duty', '🎭', 'Events', 'Per Event', 'As scheduled', 'As scheduled', 'Event venue'),
  dutyType('duty-013', 'Hostel Night Duty', '🏠', 'Hostel', 'Rotational', '08:00 PM', '06:00 AM', 'Hostel'),
  dutyType('duty-014', 'Hostel Warden Duty', '🏠', 'Hostel', 'Weekly', '08:00 AM', '08:00 PM', 'Hostel'),
  dutyType('duty-015', 'PTM Room Duty', '📊', 'Academic', 'Per PTM', '09:00 AM', '01:00 PM', 'Assigned classroom'),
  dutyType('duty-016', 'Corridor Supervision', '🚶', 'Campus Safety', 'Per Period', 'As scheduled', 'As scheduled', 'Academic corridor'),
  dutyType('duty-017', 'Competition Coordinator', '🏆', 'Events', 'Per Event', 'As scheduled', 'As scheduled', 'Event venue'),
  dutyType('duty-018', 'Emergency Response Team', '🚨', 'Safety', 'On-call', 'As needed', 'As needed', 'Whole Campus'),
  dutyType('duty-019', 'Garden / Cleanliness Duty', '🌿', 'Campus', 'Weekly', '08:00 AM', '08:30 AM', 'Campus grounds'),
  dutyType('duty-020', 'Photography Duty', '📸', 'Events', 'Per Event', 'As scheduled', 'As scheduled', 'Event venue')
];

export interface DutyAssignmentRecord {
  id: string;
  dutyTypeId: string;
  dutyTypeName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  teachers: string[];
  status: 'Scheduled' | 'Done' | 'Absent' | 'Substituted';
  substituteTeacher: string;
  specialInstructions: string;
  notifyTeachers: boolean;
  notificationChannels: string[];
  notified: boolean;
}

export interface DutyAttendanceRecord {
  id: string;
  assignmentId: string;
  date: string;
  dutyTypeId: string;
  dutyTypeName: string;
  teacherName: string;
  status: 'Upcoming' | 'Present' | 'Absent' | 'Late' | 'Substituted';
  substituteTeacher: string;
  remarks: string;
}

export interface DutyMonthlySummaryRecord {
  teacherName: string;
  totalDuties: number;
  dutiesDone: number;
  absences: number;
  note: string;
}

export const DEFAULT_DUTY_ASSIGNMENTS: DutyAssignmentRecord[] = [
  { id: 'da-2511-gate-1', dutyTypeId: 'duty-001', dutyTypeName: 'Gate Duty (Morning)', date: '2025-11-25', startTime: '07:00 AM', endTime: '08:15 AM', location: 'Main Gate', teachers: ['Mr. R. Kumar', 'Ms. P. Roy'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-assembly-1', dutyTypeId: 'duty-003', dutyTypeName: 'Assembly Duty', date: '2025-11-25', startTime: '07:30 AM', endTime: '07:50 AM', location: 'Assembly Ground', teachers: ['Mrs. P. Gupta'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-lunch-1', dutyTypeId: 'duty-005', dutyTypeName: 'Lunch / Canteen Supervision', date: '2025-11-25', startTime: '12:30 PM', endTime: '01:00 PM', location: 'Canteen', teachers: ['Mr. J. Khan'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-library-1', dutyTypeId: 'duty-004', dutyTypeName: 'Library Supervision', date: '2025-11-25', startTime: '01:00 PM', endTime: '02:30 PM', location: 'Library', teachers: ['Mrs. K. Singh'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-bus-1', dutyTypeId: 'duty-007', dutyTypeName: 'Bus Duty (Afternoon)', date: '2025-11-25', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Bus Bay', teachers: ['Mr. H. Nair'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-gate-2', dutyTypeId: 'duty-001', dutyTypeName: 'Gate Duty (Morning)', date: '2025-11-26', startTime: '07:00 AM', endTime: '08:15 AM', location: 'Main Gate', teachers: ['Mrs. S. Joshi', 'Mr. H. Nair'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-assembly-2', dutyTypeId: 'duty-003', dutyTypeName: 'Assembly Duty', date: '2025-11-26', startTime: '07:30 AM', endTime: '07:50 AM', location: 'Assembly Ground', teachers: ['Mr. A. Sharma'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-lunch-2', dutyTypeId: 'duty-005', dutyTypeName: 'Lunch / Canteen Supervision', date: '2025-11-26', startTime: '12:30 PM', endTime: '01:00 PM', location: 'Canteen', teachers: ['Ms. R. Nair'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-library-2', dutyTypeId: 'duty-004', dutyTypeName: 'Library Supervision', date: '2025-11-26', startTime: '01:00 PM', endTime: '02:30 PM', location: 'Library', teachers: ['Mr. R. Kumar'], status: 'Done', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-bus-2', dutyTypeId: 'duty-007', dutyTypeName: 'Bus Duty (Afternoon)', date: '2025-11-26', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Bus Bay', teachers: ['Mr. V. Patel'], status: 'Absent', substituteTeacher: 'Mr. H. Nair', specialInstructions: 'Mr. H. Nair covered after absence was noted.', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-gate-3', dutyTypeId: 'duty-001', dutyTypeName: 'Gate Duty (Morning)', date: '2025-11-27', startTime: '07:00 AM', endTime: '08:15 AM', location: 'Main Gate', teachers: ['Mr. V. Patel', 'Mrs. K. Singh'], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-assembly-3', dutyTypeId: 'duty-003', dutyTypeName: 'Assembly Duty', date: '2025-11-27', startTime: '07:30 AM', endTime: '07:50 AM', location: 'Assembly Ground', teachers: ['Ms. M. Verma'], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-lunch-3', dutyTypeId: 'duty-005', dutyTypeName: 'Lunch / Canteen Supervision', date: '2025-11-27', startTime: '12:30 PM', endTime: '01:00 PM', location: 'Canteen', teachers: ['Mr. D. Joshi'], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-library-3', dutyTypeId: 'duty-004', dutyTypeName: 'Library Supervision', date: '2025-11-27', startTime: '01:00 PM', endTime: '02:30 PM', location: 'Library', teachers: ['Mrs. S. Joshi'], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true },
  { id: 'da-2511-bus-3', dutyTypeId: 'duty-007', dutyTypeName: 'Bus Duty (Afternoon)', date: '2025-11-27', startTime: '02:30 PM', endTime: '03:30 PM', location: 'Bus Bay', teachers: ['Ms. P. Roy'], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: true }
];

export const DEFAULT_DUTY_ATTENDANCE: DutyAttendanceRecord[] = [
  { id: 'att-gate-vp', assignmentId: 'da-2511-gate-3', date: '2025-11-27', dutyTypeId: 'duty-001', dutyTypeName: 'Gate Duty (Morning)', teacherName: 'Mr. V. Patel', status: 'Present', substituteTeacher: '', remarks: '' },
  { id: 'att-gate-ks', assignmentId: 'da-2511-gate-3', date: '2025-11-27', dutyTypeId: 'duty-001', dutyTypeName: 'Gate Duty (Morning)', teacherName: 'Mrs. K. Singh', status: 'Present', substituteTeacher: '', remarks: '' },
  { id: 'att-assembly-mv', assignmentId: 'da-2511-assembly-3', date: '2025-11-27', dutyTypeId: 'duty-003', dutyTypeName: 'Assembly Duty', teacherName: 'Ms. M. Verma', status: 'Present', substituteTeacher: '', remarks: '' },
  { id: 'att-lunch-dj', assignmentId: 'da-2511-lunch-3', date: '2025-11-27', dutyTypeId: 'duty-005', dutyTypeName: 'Lunch / Canteen Supervision', teacherName: 'Mr. D. Joshi', status: 'Upcoming', substituteTeacher: '', remarks: '' },
  { id: 'att-library-sj', assignmentId: 'da-2511-library-3', date: '2025-11-27', dutyTypeId: 'duty-004', dutyTypeName: 'Library Supervision', teacherName: 'Mrs. S. Joshi', status: 'Upcoming', substituteTeacher: '', remarks: '' },
  { id: 'att-bus-pr', assignmentId: 'da-2511-bus-3', date: '2025-11-27', dutyTypeId: 'duty-007', dutyTypeName: 'Bus Duty (Afternoon)', teacherName: 'Ms. P. Roy', status: 'Upcoming', substituteTeacher: '', remarks: '' },
  { id: 'att-bus-vp-absence', assignmentId: 'da-2511-bus-2', date: '2025-11-26', dutyTypeId: 'duty-007', dutyTypeName: 'Bus Duty (Afternoon)', teacherName: 'Mr. V. Patel', status: 'Absent', substituteTeacher: 'Mr. H. Nair', remarks: 'Substitute coverage provided.' }
];

export const DEFAULT_DUTY_MONTH_SUMMARY: DutyMonthlySummaryRecord[] = [
  { teacherName: 'Mr. V. Patel', totalDuties: 12, dutiesDone: 11, absences: 1, note: '1 absence — 26-Nov Bus Duty' },
  { teacherName: 'Mrs. S. Joshi', totalDuties: 10, dutiesDone: 10, absences: 0, note: '0 absences — Excellent' },
  { teacherName: 'Ms. P. Roy', totalDuties: 11, dutiesDone: 9, absences: 2, note: '2 absences — Review needed' },
  { teacherName: 'Mr. R. Kumar', totalDuties: 13, dutiesDone: 13, absences: 0, note: '0 absences — Excellent' }
];

export function loadTeacherCollection<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function saveTeacherCollection<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Keep the page usable if storage is unavailable. */ }
}

export function createTeacherRecordId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function downloadTeacherCsv(filename: string, rows: Array<Record<string, string | number | boolean>>): void {
  if (typeof window === 'undefined' || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(','))].join('\r\n');
  const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function calculateActivityCredits(activityType: TeacherActivityTypeRecord | undefined, durationDays: number, months = 1): number {
  if (!activityType) return 0;
  if (activityType.creditBasis === 'points/day') return activityType.creditValue * Math.max(1, durationDays);
  if (activityType.creditBasis === 'points/month') return activityType.creditValue * Math.max(1, months);
  return activityType.creditValue;
}
