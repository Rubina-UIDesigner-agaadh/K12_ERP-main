export const COMPETITION_TYPES_STORAGE_KEY = 'k12-competition-types-v1';
export const COMPETITION_EVENTS_STORAGE_KEY = 'k12-competition-events-v1';
export const COMPETITION_PARTICIPANTS_STORAGE_KEY = 'k12-competition-participants-v1';
export const COMPETITION_RESULTS_STORAGE_KEY = 'k12-competition-results-v1';
export const ACTIVE_COMPETITION_EVENT_STORAGE_KEY = 'k12-active-competition-event-v1';

export function setActiveCompetitionEvent(id: string): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(ACTIVE_COMPETITION_EVENT_STORAGE_KEY, id); } catch { /* Storage may be unavailable. */ }
}

export function getActiveCompetitionEvent(): string {
  if (typeof window === 'undefined') return '';
  try { return window.localStorage.getItem(ACTIVE_COMPETITION_EVENT_STORAGE_KEY) || ''; } catch { return ''; }
}

export const COMPETITION_CATEGORIES = [
  'Academic', 'Sports', 'Cultural', 'Science', 'Science & Tech', 'Technology', 'Leadership', 'Social', 'Creative'
];
export const COMPETITION_LEVELS = [
  'School / Internal', 'Inter-House', 'Inter-School', 'District / Zonal', 'State', 'National', 'International'
];
export const ELIGIBLE_CLASS_GROUPS = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];
export const COMPETITION_EVENT_STATUSES = [
  'Planning', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled'
] as const;

export type CompetitionOrganizer = 'Internal' | 'External' | 'Both';
export type CompetitionTypeStatus = 'Active' | 'Inactive';
export type CompetitionEventStatus = typeof COMPETITION_EVENT_STATUSES[number];
export type ParticipationMode = 'Individual' | 'Team' | 'Both';
export type StudentRegistrationStatus = 'Confirmed' | 'Pending' | 'Rejected';
export type ParentConsentStatus = 'Yes' | 'Awaiting' | 'No' | 'N/A';

export interface CompetitionTypeRecord {
  id: string;
  name: string;
  shortName: string;
  code: string;
  category: string;
  subCategory: string;
  levels: string[];
  organizer: CompetitionOrganizer;
  description: string;
  status: CompetitionTypeStatus;
  eligibleClasses: string[];
  eligibleGender: 'All' | 'Boys' | 'Girls';
  participationMode: ParticipationMode;
  minTeamSize: number;
  maxTeamSize: number;
  minimumAttendance: number;
  judgingType: string;
  resultType: string;
  housePoints: boolean;
  participationCertificate: boolean;
  meritCertificate: boolean;
  reportCard: boolean;
  studentProfile: boolean;
  parentPortal: boolean;
}

export interface CompetitionPrize {
  rank: string;
  award: string;
  cashPrize: number;
  certificate: boolean;
  trophy: boolean;
}

export interface CompetitionEventRecord {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  code: string;
  academicYear: string;
  status: CompetitionEventStatus;
  startDate: string;
  isMultiDay: boolean;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  resultExpectedBy: string;
  level: string;
  organizerMode: 'External Body' | 'Our School' | 'Joint';
  organizingBody: string;
  organizingContact: string;
  venueMode: 'External Venue' | 'Our School';
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  eligibleClasses: string[];
  eligibleGender: 'All' | 'Boys only' | 'Girls only';
  participationMode: ParticipationMode;
  maxParticipants: number;
  perClassLimit: number;
  minimumAttendance: number;
  coordinator: string;
  coCoordinator: string;
  coordinatorResponsibilities: string;
  accompanyingTeachers: string[];
  subjects: string[];
  topics: string;
  syllabusDocument: string;
  referenceMaterials: string[];
  externalRegistrationRequired: boolean;
  registrationPortal: string;
  feeRequired: boolean;
  registrationFee: number;
  feePayer: 'Student' | 'School' | 'Shared';
  prizes: CompetitionPrize[];
  housePointsEnabled: boolean;
  housePointsFirst: number;
  housePointsSecond: number;
  housePointsThird: number;
  housePointsParticipation: number;
  notifyParents: boolean;
  notifyChannels: string[];
  attachCircular: boolean;
  postNoticeBoard: boolean;
  postParentPortal: boolean;
}

export interface CompetitionParticipantRecord {
  id: string;
  eventId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  registrationStatus: StudentRegistrationStatus;
  parentConsent: ParentConsentStatus;
  attendance: number;
  disciplineClear: boolean;
}

export interface CompetitionStudentResult {
  id: string;
  eventId: string;
  studentName: string;
  className: string;
  score: string;
  position: string;
  award: string;
  house: string;
  housePoints: number;
}

const allLevels = [...COMPETITION_LEVELS];

export const DEFAULT_COMPETITION_TYPES: CompetitionTypeRecord[] = [
  { id: 'ct-001', name: 'Science Olympiad', shortName: 'Sci. Olympiad', code: 'COMP-SCI-OLY', category: 'Academic', subCategory: 'Science', levels: ['National'], organizer: 'External', description: 'Academic science competition across Physics, Chemistry and Biology.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 4, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-002', name: 'Mathematics Olympiad', shortName: 'Math Olympiad', code: 'COMP-MATH-OLY', category: 'Academic', subCategory: 'Mathematics', levels: ['National'], organizer: 'External', description: 'Mathematics problem-solving competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-003', name: 'Debate Competition', shortName: 'Debate', code: 'COMP-DEBATE', category: 'Academic', subCategory: 'Public Speaking', levels: ['Inter-School'], organizer: 'Internal', description: 'Structured debate and public-speaking competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 4, minimumAttendance: 75, judgingType: 'Mixed', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-004', name: 'Elocution / Speech', shortName: 'Elocution', code: 'COMP-ELOCUTION', category: 'Academic', subCategory: 'Public Speaking', levels: ['Inter-House'], organizer: 'Internal', description: 'Individual elocution and speech competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-005', name: 'Essay Writing', shortName: 'Essay', code: 'COMP-ESSAY', category: 'Academic', subCategory: 'Writing', levels: ['District / Zonal'], organizer: 'External', description: 'Creative and academic essay-writing competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-006', name: 'Quiz Competition', shortName: 'Quiz', code: 'COMP-QUIZ', category: 'Academic', subCategory: 'General Knowledge', levels: allLevels, organizer: 'Both', description: 'General knowledge and subject quiz for all grades.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 4, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Points-based', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-007', name: 'Football Tournament', shortName: 'Football', code: 'COMP-FOOTBALL', category: 'Sports', subCategory: 'Team Sports', levels: ['Inter-School'], organizer: 'Both', description: 'School and inter-school football tournament.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Team', minTeamSize: 7, maxTeamSize: 15, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Qualify/Eliminate', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-008', name: 'Cricket Tournament', shortName: 'Cricket', code: 'COMP-CRICKET', category: 'Sports', subCategory: 'Team Sports', levels: ['District / Zonal'], organizer: 'External', description: 'School cricket tournament and external fixtures.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Team', minTeamSize: 11, maxTeamSize: 16, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Qualify/Eliminate', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-009', name: 'Athletics / Track & Field', shortName: 'Athletics', code: 'COMP-ATHLETICS', category: 'Sports', subCategory: 'Athletics', levels: allLevels, organizer: 'Both', description: 'Track and field events across eligible grade groups.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-010', name: 'Badminton', shortName: 'Badminton', code: 'COMP-BADMINTON', category: 'Sports', subCategory: 'Racquet Sports', levels: ['Inter-House'], organizer: 'Internal', description: 'Singles and doubles badminton competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 2, minimumAttendance: 75, judgingType: 'Internal Teachers', resultType: 'Qualify/Eliminate', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-011', name: 'Drama / Skit', shortName: 'Drama', code: 'COMP-DRAMA', category: 'Cultural', subCategory: 'Performing Arts', levels: ['Inter-House'], organizer: 'Internal', description: 'Drama, theatre and skit performances.', status: 'Active', eligibleClasses: ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Team', minTeamSize: 2, maxTeamSize: 12, minimumAttendance: 75, judgingType: 'Mixed', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-012', name: 'Singing Competition', shortName: 'Singing', code: 'COMP-SINGING', category: 'Cultural', subCategory: 'Music', levels: ['Inter-School'], organizer: 'Both', description: 'Solo and group singing competition.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 8, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-013', name: 'Dance Competition', shortName: 'Dance', code: 'COMP-DANCE', category: 'Cultural', subCategory: 'Performing Arts', levels: allLevels, organizer: 'Both', description: 'Classical, folk and contemporary dance competition.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 12, minimumAttendance: 75, judgingType: 'Mixed', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-014', name: 'Painting / Drawing', shortName: 'Art', code: 'COMP-ART', category: 'Cultural', subCategory: 'Visual Arts', levels: ['District / Zonal'], organizer: 'External', description: 'Painting, drawing and visual arts competition.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-015', name: 'Science Fair / Exhibition', shortName: 'Science Fair', code: 'COMP-SCI-FAIR', category: 'Science', subCategory: 'Exhibition', levels: ['District / Zonal'], organizer: 'External', description: 'Science projects, demonstrations and exhibitions.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 5, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-016', name: 'Coding / Robotics', shortName: 'Coding', code: 'COMP-CODING', category: 'Technology', subCategory: 'Robotics', levels: ['National'], organizer: 'External', description: 'Coding, robotics and computational-thinking competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 4, minimumAttendance: 75, judgingType: 'Online Platform', resultType: 'Points-based', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-017', name: 'Eco Club Activity', shortName: 'Eco Club', code: 'COMP-ECO', category: 'Social', subCategory: 'Environment', levels: ['State'], organizer: 'External', description: 'Environmental awareness and eco-club activity.', status: 'Active', eligibleClasses: ELIGIBLE_CLASS_GROUPS, eligibleGender: 'All', participationMode: 'Both', minTeamSize: 1, maxTeamSize: 10, minimumAttendance: 75, judgingType: 'Mixed', resultType: 'Points-based', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-018', name: 'Photography', shortName: 'Photo', code: 'COMP-PHOTO', category: 'Creative', subCategory: 'Visual Arts', levels: ['Inter-School'], organizer: 'External', description: 'Photography and visual storytelling competition.', status: 'Active', eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-019', name: 'MUN (Model UN)', shortName: 'MUN', code: 'COMP-MUN', category: 'Leadership', subCategory: 'Model United Nations', levels: ['National'], organizer: 'External', description: 'Model United Nations diplomacy and leadership conference.', status: 'Active', eligibleClasses: ['Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Grade-based', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true },
  { id: 'ct-020', name: 'Spell Bee', shortName: 'Spell Bee', code: 'COMP-SPELL-BEE', category: 'Academic', subCategory: 'Language', levels: ['National'], organizer: 'External', description: 'Spelling, vocabulary and language proficiency competition.', status: 'Active', eligibleClasses: ['Class 1-5', 'Class 6-8', 'Class 9-10'], eligibleGender: 'All', participationMode: 'Individual', minTeamSize: 1, maxTeamSize: 1, minimumAttendance: 75, judgingType: 'External Judges', resultType: 'Rank-based (1st, 2nd, 3rd)', housePoints: true, participationCertificate: true, meritCertificate: true, reportCard: true, studentProfile: true, parentPortal: true }
];

const defaultPrizes: CompetitionPrize[] = [
  { rank: '1st', award: 'Gold Medal + Trophy', cashPrize: 5000, certificate: true, trophy: true },
  { rank: '2nd', award: 'Silver Medal + Certificate', cashPrize: 3000, certificate: true, trophy: false },
  { rank: '3rd', award: 'Bronze Medal + Certificate', cashPrize: 1000, certificate: true, trophy: false },
  { rank: 'All', award: 'Participation Certificate', cashPrize: 0, certificate: true, trophy: false }
];

const eventDefaults: CompetitionEventRecord = {
  id: '', name: '', typeId: 'ct-001', typeName: 'Science Olympiad', code: '', academicYear: '2025-26', status: 'Planning',
  startDate: '', isMultiDay: false, endDate: '', startTime: '09:00', endTime: '16:00', registrationDeadline: '', resultExpectedBy: '',
  level: 'School / Internal', organizerMode: 'Our School', organizingBody: '', organizingContact: '', venueMode: 'Our School', venueName: '', venueAddress: '', mapsUrl: '',
  eligibleClasses: ['Class 6-8', 'Class 9-10', 'Class 11-12'], eligibleGender: 'All', participationMode: 'Both', maxParticipants: 15, perClassLimit: 3, minimumAttendance: 75,
  coordinator: '', coCoordinator: '', coordinatorResponsibilities: '', accompanyingTeachers: [], subjects: [], topics: '', syllabusDocument: '', referenceMaterials: [],
  externalRegistrationRequired: false, registrationPortal: '', feeRequired: false, registrationFee: 0, feePayer: 'School', prizes: defaultPrizes.map((p) => ({ ...p })),
  housePointsEnabled: true, housePointsFirst: 20, housePointsSecond: 15, housePointsThird: 10, housePointsParticipation: 5,
  notifyParents: true, notifyChannels: ['SMS', 'Email', 'Parent Portal'], attachCircular: true, postNoticeBoard: true, postParentPortal: true
};

const makeEvent = (overrides: Partial<CompetitionEventRecord>): CompetitionEventRecord => ({
  ...eventDefaults,
  ...overrides,
  prizes: (overrides.prizes || eventDefaults.prizes).map((prize) => ({ ...prize })),
  eligibleClasses: [...(overrides.eligibleClasses || eventDefaults.eligibleClasses)],
  subjects: [...(overrides.subjects || eventDefaults.subjects)],
  accompanyingTeachers: [...(overrides.accompanyingTeachers || eventDefaults.accompanyingTeachers)],
  referenceMaterials: [...(overrides.referenceMaterials || eventDefaults.referenceMaterials)],
  notifyChannels: [...(overrides.notifyChannels || eventDefaults.notifyChannels)]
});

export const DEFAULT_COMPETITION_EVENTS: CompetitionEventRecord[] = [
  makeEvent({ id: 'evt-001', name: 'District Science Olympiad 2025', typeId: 'ct-001', typeName: 'Science Olympiad', code: 'COMP-2025-SCI-001', status: 'Registration Open', startDate: '2025-11-30', registrationDeadline: '2025-11-20', resultExpectedBy: '2025-12-10', level: 'District / Zonal', organizerMode: 'External Body', organizingBody: 'District Education Office, Pune', organizingContact: 'Mr. A. Kulkarni — 98XXXXXXXX', venueMode: 'External Venue', venueName: 'Government Science College, Pune', venueAddress: 'Pune, Maharashtra', mapsUrl: 'https://maps.google.com/?q=Pune', eligibleClasses: ['Class 9-10', 'Class 11-12'], maxParticipants: 15, perClassLimit: 3, coordinator: 'Mr. R. Kumar — Science Department', coCoordinator: 'Mrs. S. Joshi', coordinatorResponsibilities: 'Shortlist students, prepare them, submit registrations and accompany students to the venue.', accompanyingTeachers: ['Mr. R. Kumar', 'Mrs. K. Singh'], subjects: ['Physics', 'Chemistry', 'Biology'], topics: 'NCERT Class 9-10 Science curriculum', externalRegistrationRequired: true, registrationPortal: 'https://districtolympiad.gov.in', housePointsEnabled: true }),
  makeEvent({ id: 'evt-002', name: 'Inter-House Debate', typeId: 'ct-003', typeName: 'Debate Competition', code: 'COMP-2025-DEB-002', status: 'Planning', startDate: '2025-12-05', level: 'Inter-House', venueMode: 'Our School', venueName: 'Auditorium' }),
  makeEvent({ id: 'evt-003', name: 'CBSE Science Exhibition', typeId: 'ct-015', typeName: 'Science Fair / Exhibition', code: 'COMP-2026-SCI-003', status: 'Planning', startDate: '2026-01-15', level: 'National', organizerMode: 'External Body', organizingBody: 'CBSE', venueMode: 'External Venue', venueName: 'External venue' }),
  makeEvent({ id: 'evt-004', name: 'Annual Sports Day Sprint', typeId: 'ct-009', typeName: 'Athletics / Track & Field', code: 'COMP-2026-ATH-004', status: 'Planning', startDate: '2026-01-15', level: 'School / Internal', venueMode: 'Our School', venueName: 'Sports Ground' }),
  makeEvent({ id: 'evt-005', name: 'State Math Olympiad', typeId: 'ct-002', typeName: 'Mathematics Olympiad', code: 'COMP-2026-MATH-005', status: 'Completed', startDate: '2026-01-20', level: 'State', organizerMode: 'External Body', organizingBody: 'State Mathematics Council', venueMode: 'External Venue', venueName: 'External venue' }),
  makeEvent({ id: 'evt-006', name: 'Inter-House Cricket', typeId: 'ct-008', typeName: 'Cricket Tournament', code: 'COMP-2026-CRI-006', status: 'Planning', startDate: '2026-02-10', level: 'Inter-House', venueMode: 'Our School', venueName: 'Sports Ground' }),
  makeEvent({ id: 'evt-007', name: 'Annual Day Dance Competition', typeId: 'ct-013', typeName: 'Dance Competition', code: 'COMP-2026-DAN-007', status: 'Planning', startDate: '2026-03-15', level: 'School / Internal', venueMode: 'Our School', venueName: 'Auditorium' })
];

export const DEFAULT_COMPETITION_PARTICIPANTS: CompetitionParticipantRecord[] = [
  { id: 'part-001', eventId: 'evt-001', studentName: 'Rahul Kumar', className: '10-A', rollNumber: '001', registrationStatus: 'Confirmed', parentConsent: 'Yes', attendance: 87, disciplineClear: true },
  { id: 'part-002', eventId: 'evt-001', studentName: 'Priya Sharma', className: '10-B', rollNumber: '015', registrationStatus: 'Confirmed', parentConsent: 'Yes', attendance: 92, disciplineClear: true },
  { id: 'part-003', eventId: 'evt-001', studentName: 'Amit Verma', className: '9-A', rollNumber: '022', registrationStatus: 'Confirmed', parentConsent: 'Yes', attendance: 81, disciplineClear: true },
  { id: 'part-004', eventId: 'evt-001', studentName: 'Sita Patel', className: '11-A', rollNumber: '008', registrationStatus: 'Pending', parentConsent: 'Awaiting', attendance: 89, disciplineClear: true },
  { id: 'part-005', eventId: 'evt-001', studentName: 'Ravi Singh', className: '12-B', rollNumber: '034', registrationStatus: 'Rejected', parentConsent: 'N/A', attendance: 72, disciplineClear: false }
];

export const DEFAULT_COMPETITION_RESULTS: CompetitionStudentResult[] = [
  { id: 'res-001', eventId: 'evt-001', studentName: 'Rahul Kumar', className: '10-A', score: '88/100', position: '3rd', award: 'Bronze + Certificate', house: 'Fire House', housePoints: 10 },
  { id: 'res-002', eventId: 'evt-001', studentName: 'Priya Sharma', className: '10-B', score: '76/100', position: '12th', award: 'Participation', house: 'Blue House', housePoints: 5 },
  { id: 'res-003', eventId: 'evt-001', studentName: 'Amit Verma', className: '9-A', score: '91/100', position: '2nd', award: 'Silver + Certificate', house: 'Earth House', housePoints: 15 },
  { id: 'res-004', eventId: 'evt-001', studentName: 'Sita Patel', className: '11-A', score: '95/100', position: '1st', award: 'Gold + Certificate', house: 'Fire House', housePoints: 20 }
];

export function loadCompetitionCollection<T>(storageKey: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function saveCompetitionCollection<T>(storageKey: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Keep the page usable when browser storage is unavailable or full.
  }
}

export function downloadCsv(filename: string, rows: Array<Record<string, string | number | boolean>>): void {
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
